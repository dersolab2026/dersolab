-- Veli (parent) rolü ürün kararıyla tamamen kaldırılıyor: artık her öğrenci
-- kendi hesabıyla kayıt olup kendi adına işlem yapıyor, veli bir öğrenci
-- adına hesap/rezervasyon/satın alma yönetemiyor. guardian_links tablosu ve
-- is_guardian_of() fonksiyonu bu yüzden kaldırılıyor; her RLS politikasındaki
-- "or public.is_guardian_of(...)" cümlesi düşürülüyor.
--
-- user_role enum'undan 'parent' değeri kasıtlı olarak çıkarılmıyor: Postgres
-- enum'lardan değer silmeyi desteklemiyor, yeni tip oluşturup users.role ve
-- bookings.cancelled_by kolonlarını taşımak gerekir — sıfır fonksiyonel fayda
-- için gereksiz risk. 'parent' ölü ama geçerli bir değer olarak kalıyor,
-- kod bir daha asla yazmayacak.

-- 1) is_guardian_of() kullanan her canlı politikayı güncelle

alter policy "users_select_own_or_linked" on public.users
  using (id = (select auth.uid()) or public.is_admin());

alter policy "students_select" on public.students
  using (user_id = auth.uid() or public.is_admin());

alter policy "purchases_select" on public.package_purchases
  using (student_id = auth.uid() or purchased_by = auth.uid() or public.is_admin());

alter policy "purchases_insert_own" on public.package_purchases
  with check (student_id = auth.uid() and purchased_by = auth.uid() and status = 'pending');

alter policy "bookings_select" on public.bookings
  using (student_id = auth.uid() or instructor_id = auth.uid() or public.is_admin());

alter policy "bookings_insert" on public.bookings
  with check (student_id = auth.uid() or public.is_admin());

alter policy "homework_select" on public.homework
  using (student_id = auth.uid() or instructor_id = auth.uid() or public.is_admin());

alter policy "homework_submissions_select" on public.homework_submissions
  using (
    exists (
      select 1 from public.homework h
      where h.id = homework_submissions.homework_id
      and (h.student_id = auth.uid() or h.instructor_id = auth.uid() or public.is_admin())
    )
  );

alter policy "homework_submissions_insert" on public.homework_submissions
  with check (
    exists (
      select 1 from public.homework h
      where h.id = homework_submissions.homework_id
      and h.student_id = auth.uid()
    )
  );

alter policy "homework_submission_files_insert" on storage.objects
  with check (
    bucket_id = 'homework-submissions'
    and exists (
      select 1 from public.homework h
      where h.id::text = (storage.foldername(name))[1]
      and h.student_id = auth.uid()
    )
  );

alter policy "homework_submission_files_select" on storage.objects
  using (
    bucket_id = 'homework-submissions'
    and exists (
      select 1 from public.homework h
      where h.id::text = (storage.foldername(name))[1]
      and (h.student_id = auth.uid() or h.instructor_id = auth.uid() or public.is_admin())
    )
  );

alter policy "lesson_materials_select" on public.lesson_materials
  using (
    instructor_id = auth.uid()
    or student_id = auth.uid()
    or public.is_admin()
  );

alter policy "lesson_material_files_select" on storage.objects
  using (
    bucket_id = 'lesson-materials'
    and exists (
      select 1 from public.bookings b
      where b.id::text = (storage.foldername(name))[1]
      and (b.student_id = auth.uid() or b.instructor_id = auth.uid() or public.is_admin())
    )
  );

alter policy "demo_requests_select" on public.demo_lesson_requests
  using (
    requested_by = auth.uid()
    or student_id = auth.uid()
    or assigned_instructor_id = auth.uid()
    or public.is_admin()
    or (
      status = 'pending'
      and exists (select 1 from public.instructors i where i.user_id = auth.uid() and i.offers_free_trial)
      and not exists (
        select 1 from public.demo_lesson_declines d
        where d.request_id = demo_lesson_requests.id and d.instructor_id = auth.uid()
      )
    )
  );

alter policy "demo_requests_insert" on public.demo_lesson_requests
  with check (
    requested_by = auth.uid()
    and student_id = auth.uid()
  );

-- 2) Fonksiyonları güncelle

create or replace function public.cancel_booking(p_booking_id uuid, p_as_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking record;
  v_is_authorized boolean;
begin
  select * into v_booking from public.bookings where id = p_booking_id;

  if v_booking is null then
    raise exception 'Rezervasyon bulunamadı';
  end if;

  if v_booking.status <> 'scheduled' then
    raise exception 'Bu rezervasyon zaten iptal edilmiş veya tamamlanmış';
  end if;

  if p_as_role = 'instructor' then
    v_is_authorized := v_booking.instructor_id = auth.uid();
  elsif p_as_role = 'student' then
    v_is_authorized := v_booking.student_id = auth.uid();
  else
    v_is_authorized := false;
  end if;

  if not v_is_authorized then
    raise exception 'Bu rezervasyonu iptal etme yetkin yok';
  end if;

  update public.bookings
  set status = 'cancelled',
      cancelled_by = case when p_as_role = 'instructor' then 'instructor'::user_role else 'student'::user_role end
  where id = p_booking_id;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_role user_role;
  v_requested_role text;
begin
  v_requested_role := new.raw_user_meta_data->>'role';
  v_role := case
    when v_requested_role in ('student', 'instructor') then v_requested_role::user_role
    else 'student'
  end;

  insert into public.users (id, role, name, email)
  values (new.id, v_role, coalesce(new.raw_user_meta_data->>'name', ''), new.email);

  if v_role = 'student' then
    insert into public.students (user_id, grade_track)
    values (new.id, coalesce((new.raw_user_meta_data->>'grade_track')::grade_track, 'yks'));
  elsif v_role = 'instructor' then
    insert into public.instructors (user_id)
    values (new.id);
  end if;

  return new;
end;
$$;

-- 3) Artık hiçbir politika/fonksiyon is_guardian_of'a bağlı değil, kaldırılabilir

drop function public.is_guardian_of(uuid);

-- 4) guardian_links tablosu (ve kendi politikaları) kaldırılıyor

drop table public.guardian_links;
