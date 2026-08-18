-- 1 haftalik ucretsiz kocluk: tanisma dersiyle ayni talep havuzunu
-- kullaniyor, sadece turu farkli. Ucretsiz kocluk talebi ders olusturmaz;
-- ustlenen koc ogrenciye atanir ve haftayi kendisi planlar.
--
-- ONEMLI: "hak kullanildi" ve "bekleyen talep var" kontrolleri RLS'e
-- KONULMAZ. 0038'de goruldugu gibi politikanin kendi tablosuna subquery
-- ile referans vermesi "infinite recursion detected in policy" hatasi
-- veriyor. Bu kontroller security definer trigger'da kaliyor.

-- 0080'de eksik kalmis olabilir; varsa atlanir.
alter table public.student_exam_results
  add column if not exists track text
  check (track is null or track in ('sayisal', 'ea', 'sozel', 'dil'));

alter table public.students
  add column if not exists free_coaching_used boolean not null default false;

alter table public.demo_lesson_requests
  add column if not exists request_type text not null default 'demo_lesson'
  check (request_type in ('demo_lesson', 'coaching_week'));

create index if not exists demo_lesson_requests_type_status_idx
  on public.demo_lesson_requests (request_type, status);

-- Kocluk talebini yalnizca "Koçluk" bransi olan onayli egitmenler gorup
-- ustlenebilir.
create or replace function public.is_coach(p_user_id uuid)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.instructors i
    where i.user_id = p_user_id
      and 'Koçluk' = any(i.subjects)
      and i.approval_status = 'approved'
      and not i.paused
  );
$$;

-- SELECT: talep turune gore uygun egitmen kumesi degisiyor. Alt sorgu
-- yalnizca demo_lesson_declines'a (baska tablo) gidiyor, ozyineleme yok.
drop policy if exists "demo_requests_select" on public.demo_lesson_requests;
create policy "demo_requests_select" on public.demo_lesson_requests
  for select using (
    requested_by = auth.uid()
    or student_id = auth.uid()
    or assigned_instructor_id = auth.uid()
    or public.is_admin()
    or (
      status = 'pending'
      and (
        (request_type = 'demo_lesson'
          and exists (select 1 from public.instructors i where i.user_id = auth.uid() and i.offers_free_trial))
        or (request_type = 'coaching_week' and public.is_coach(auth.uid()))
      )
      and not exists (
        select 1 from public.demo_lesson_declines d
        where d.request_id = demo_lesson_requests.id and d.instructor_id = auth.uid()
      )
    )
  );

-- INSERT: 0038'deki gibi sade tutuluyor; uygunluk kontrolu trigger'da.
drop policy if exists "demo_requests_insert" on public.demo_lesson_requests;
create policy "demo_requests_insert" on public.demo_lesson_requests
  for insert with check (
    requested_by = auth.uid()
    and student_id = auth.uid()
  );

drop policy if exists "demo_requests_update_claim" on public.demo_lesson_requests;
create policy "demo_requests_update_claim" on public.demo_lesson_requests
  for update using (
    status = 'pending'
    and (
      (request_type = 'demo_lesson'
        and exists (select 1 from public.instructors i where i.user_id = auth.uid() and i.offers_free_trial))
      or (request_type = 'coaching_week' and public.is_coach(auth.uid()))
    )
  )
  with check (assigned_instructor_id = auth.uid() and status = 'assigned');

drop policy if exists "demo_declines_insert" on public.demo_lesson_declines;
create policy "demo_declines_insert" on public.demo_lesson_declines
  for insert with check (
    instructor_id = auth.uid()
    and (
      exists (select 1 from public.instructors i where i.user_id = auth.uid() and i.offers_free_trial)
      or public.is_coach(auth.uid())
    )
  );

-- Uygunluk kontrolu artik talep turune duyarli: her hak ayri sayiliyor ve
-- "bekleyen talep" kontrolu yalnizca ayni tur icinde yapiliyor.
create or replace function public.check_demo_lesson_request_eligibility()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  hak_kullanildi boolean;
  bekleyen_var boolean;
begin
  if new.request_type = 'coaching_week' then
    select free_coaching_used into hak_kullanildi from public.students where user_id = new.student_id;
    if hak_kullanildi then
      raise exception 'Ucretsiz kocluk hakki zaten kullanilmis';
    end if;
  else
    select free_trial_used into hak_kullanildi from public.students where user_id = new.student_id;
    if hak_kullanildi then
      raise exception 'Ucretsiz tanisma dersi hakki zaten kullanilmis';
    end if;
  end if;

  select exists(
    select 1 from public.demo_lesson_requests
    where student_id = new.student_id
      and status = 'pending'
      and request_type = new.request_type
  ) into bekleyen_var;
  if bekleyen_var then
    -- Mesajlar tur bazinda ayri; uygulama tarafi bunlara gore
    -- kullaniciya gosterilecek metni seciyor.
    if new.request_type = 'coaching_week' then
      raise exception 'Bu ogrenci icin zaten bekleyen bir kocluk talebi var';
    else
      raise exception 'Bu ogrenci icin zaten bekleyen bir tanisma dersi talebi var';
    end if;
  end if;

  return new;
end;
$$;

-- Kocluk talebi ustlenildiginde hak kullanilmis sayilir. Ders olusmadigi
-- icin tanisma dersindeki booking tetikleyicisine karsilik gelen adim bu.
create or replace function public.mark_free_coaching_used()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if new.request_type = 'coaching_week'
     and new.status = 'assigned' and old.status = 'pending' then
    update public.students set free_coaching_used = true where user_id = new.student_id;
  end if;
  return new;
end;
$$;

drop trigger if exists on_coaching_request_assigned on public.demo_lesson_requests;
create trigger on_coaching_request_assigned
  after update on public.demo_lesson_requests
  for each row execute function public.mark_free_coaching_used();
