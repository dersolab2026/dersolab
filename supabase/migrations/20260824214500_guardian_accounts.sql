-- VELİ HESABI GERİ GELİYOR (0064'te kaldırılmıştı).
--
-- 0064 veli rolünü ürün kararıyla tamamen kaldırmıştı. O karar geri
-- alınıyor, ama aynı şekilde değil: veli artık öğrencinin yerine işlem
-- yapan bir "vekil" değil, İZLEYİCİ + ÖDEYİCİ.
--
-- Yetki sınırı (bilinçli):
--   GÖRÜR : ders takvimi ve katılım, ödev durumu, deneme netleri,
--           kredi bakiyesi, ödeme geçmişi, koçun haftalık raporu (e-posta)
--   YAPAR : öğrenciye kredi paketi satın alır
--   GÖREMEZ: Günlük (student_study_logs), Koçluk Formu
--           (student_intake_forms), öz değerlendirme, deneme sonrası
--           yansımalar, koç seans notları, öğrencinin sorduğu sorular
--
-- Neden bu alanlar kapalı: Koçluk Formu "koçluk almak kimin fikriydi"
-- gibi sorular soruyor; tam da velinin zorlayıp zorlamadığını anlamak
-- için. Veli okuyacak olsa öğrenci dürüst cevap vermez ve koçun elindeki
-- verinin değeri düşer.
--
-- BAĞI VELİ KOPARIR, ÖĞRENCİ DEĞİL (ürün kararı: ödeyen taraf veli;
-- öğrenci kötü giden bir dönemi tek taraflı gizleyememeli). Öğrenci
-- kimlerin bağlı olduğunu GÖRÜR ama silemez. Yanlış kurulmuş bir bağda
-- öğrenci mahsur kalmasın diye iki koruma var: kod tek kullanımlık ve
-- 7 günde doluyor, ayrıca admin her bağı koparabiliyor.

-- ============================================================
-- 1) TABLOLAR
-- ============================================================

create table if not exists public.guardian_links (
  id uuid primary key default gen_random_uuid(),
  guardian_id uuid not null references public.users(id) on delete cascade,
  student_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (guardian_id, student_id)
);

create index if not exists guardian_links_student_idx on public.guardian_links (student_id);
create index if not exists guardian_links_guardian_idx on public.guardian_links (guardian_id);

-- Karıştırılabilir karakterler (0/O, 1/I/l) listede yok: kod telefonda
-- okunup elle giriliyor.
create or replace function public.gen_guardian_code()
returns text
language sql volatile
set search_path = ''
as $$
  select string_agg(
    substr('ABCDEFGHJKLMNPQRSTUVWXYZ23456789', (floor(random() * 32)::int) + 1, 1), ''
  )
  from generate_series(1, 8);
$$;

create table if not exists public.guardian_link_codes (
  code text primary key default public.gen_guardian_code(),
  student_id uuid not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '7 days',
  used_at timestamptz,
  used_by uuid references public.users(id) on delete set null
);

create index if not exists guardian_link_codes_student_idx on public.guardian_link_codes (student_id);

-- ============================================================
-- 2) YARDIMCI FONKSİYON
-- ============================================================

create or replace function public.is_guardian_of(p_student_id uuid)
returns boolean
language sql stable security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.guardian_links g
    where g.guardian_id = (select auth.uid()) and g.student_id = p_student_id
  );
$$;

revoke execute on function public.is_guardian_of(uuid) from public;
grant execute on function public.is_guardian_of(uuid) to authenticated;

revoke execute on function public.gen_guardian_code() from public;

-- ============================================================
-- 3) KAYIT: 'parent' rolü tekrar kabul ediliyor
-- ============================================================

-- 20260824213000'deki (referanssız) hâlin üzerine yalnızca rol beyaz
-- listesi genişliyor. Veli için students/instructors satırı AÇILMIYOR.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_role user_role;
  v_requested_role text;
  v_grade smallint;
  v_track student_track;
begin
  v_requested_role := new.raw_user_meta_data->>'role';
  v_role := case
    when v_requested_role in ('student', 'instructor', 'parent') then v_requested_role::user_role
    else 'student'
  end;

  if (new.raw_user_meta_data->>'grade') ~ '^(?:[5-9]|1[0-3])$' then
    v_grade := (new.raw_user_meta_data->>'grade')::smallint;
  end if;

  if (new.raw_user_meta_data->>'track') in ('sayisal', 'sozel', 'ea', 'dil') then
    v_track := (new.raw_user_meta_data->>'track')::student_track;
  end if;

  insert into public.users (id, role, name, email)
  values (new.id, v_role, coalesce(new.raw_user_meta_data->>'name', ''), new.email);

  if v_role = 'student' then
    insert into public.students (user_id, grade_track, school_name, grade, track)
    values (
      new.id,
      case when new.raw_user_meta_data->>'grade_track' = 'lgs' then 'lgs'::grade_track else 'yks'::grade_track end,
      nullif(left(new.raw_user_meta_data->>'school_name', 120), ''),
      v_grade,
      v_track
    );
  elsif v_role = 'instructor' then
    insert into public.instructors (user_id)
    values (new.id);
  end if;

  if new.raw_user_meta_data->>'terms_version' = '2026-08-07' then
    insert into public.terms_acceptances (user_id, terms_version, acceptance_source)
    values (new.id, '2026-08-07', 'email_signup')
    on conflict (user_id, terms_version) do nothing;
  end if;

  return new;
end;
$$;

-- ============================================================
-- 4) KOD ÜRETME / KULLANMA
-- ============================================================

alter table public.guardian_link_codes enable row level security;

-- Öğrenci kendi kodunu üretir ve görür. Veli bu tabloyu HİÇ okuyamaz —
-- kodu tarama yoluyla bulmak mümkün olmasın diye kullanım bir RPC ile.
drop policy if exists "guardian_codes_select_own" on public.guardian_link_codes;
create policy "guardian_codes_select_own" on public.guardian_link_codes
  for select to authenticated using (student_id = (select auth.uid()));

drop policy if exists "guardian_codes_insert_own" on public.guardian_link_codes;
create policy "guardian_codes_insert_own" on public.guardian_link_codes
  for insert to authenticated with check (student_id = (select auth.uid()));

drop policy if exists "guardian_codes_delete_own" on public.guardian_link_codes;
create policy "guardian_codes_delete_own" on public.guardian_link_codes
  for delete to authenticated using (student_id = (select auth.uid()));

/**
 * Veli, öğrencinin verdiği kodu kullanarak bağı kurar.
 *
 * Tek atomik işlem: kod geçerli mi + süresi dolmuş mu + kullanılmış mı
 * kontrolü ile bağın kurulması aynı fonksiyonda. Kod kullanıldığı anda
 * tükeniyor; sızan bir kod ikinci kez işe yaramaz.
 */
create or replace function public.redeem_guardian_code(p_code text)
returns uuid
language plpgsql security definer set search_path = public
as $$
declare
  v_guardian uuid := (select auth.uid());
  v_student uuid;
  v_code text := upper(regexp_replace(coalesce(p_code, ''), '\s', '', 'g'));
begin
  if v_guardian is null then
    raise exception 'Giris yapmalisin';
  end if;

  if not exists (select 1 from public.users where id = v_guardian and role = 'parent') then
    raise exception 'Bu islem yalnizca veli hesaplari icin';
  end if;

  -- Satırı kilitle: aynı kod iki kez eş zamanlı kullanılamasın.
  select student_id into v_student
  from public.guardian_link_codes
  where code = v_code and used_at is null and expires_at > now()
  for update;

  if v_student is null then
    raise exception 'Kod gecersiz ya da suresi dolmus';
  end if;

  if v_student = v_guardian then
    raise exception 'Kendi hesabini kendine baglayamazsin';
  end if;

  insert into public.guardian_links (guardian_id, student_id)
  values (v_guardian, v_student)
  on conflict (guardian_id, student_id) do nothing;

  update public.guardian_link_codes
  set used_at = now(), used_by = v_guardian
  where code = v_code;

  return v_student;
end;
$$;

revoke execute on function public.redeem_guardian_code(text) from public;
grant execute on function public.redeem_guardian_code(text) to authenticated;

-- ============================================================
-- 5) BAĞ TABLOSU POLİTİKALARI
-- ============================================================

alter table public.guardian_links enable row level security;

-- Öğrenci kimin bağlı olduğunu GÖRÜR (şeffaflık) ama silemez.
drop policy if exists "guardian_links_select" on public.guardian_links;
create policy "guardian_links_select" on public.guardian_links
  for select to authenticated using (
    guardian_id = (select auth.uid())
    or student_id = (select auth.uid())
    or public.is_admin()
  );

-- Bağı yalnızca veli (ve admin) koparır — ürün kararı.
drop policy if exists "guardian_links_delete_guardian" on public.guardian_links;
create policy "guardian_links_delete_guardian" on public.guardian_links
  for delete to authenticated using (
    guardian_id = (select auth.uid()) or public.is_admin()
  );

-- INSERT politikası YOK: bağ yalnızca redeem_guardian_code() ile kurulur.
-- Böylece kodu olmayan biri doğrudan satır ekleyip kendini bağlayamaz.

-- ============================================================
-- 6) VELİNİN GÖREBİLDİKLERİ
-- ============================================================
-- Mevcut politikalar değiştirilmiyor; her tabloya AYRI bir izin
-- politikası ekleniyor. Aynı komuttaki permissive politikalar OR ile
-- birleşiyor, dolayısıyla bu ekleme kimsenin mevcut erişimini
-- daraltmıyor ve daha önce yazılmış bir politikayı yeniden üretme
-- riski doğurmuyor.

drop policy if exists "users_select_guardian" on public.users;
create policy "users_select_guardian" on public.users
  for select to authenticated using (public.is_guardian_of(id));

drop policy if exists "students_select_guardian" on public.students;
create policy "students_select_guardian" on public.students
  for select to authenticated using (public.is_guardian_of(user_id));

drop policy if exists "bookings_select_guardian" on public.bookings;
create policy "bookings_select_guardian" on public.bookings
  for select to authenticated using (public.is_guardian_of(student_id));

drop policy if exists "homework_select_guardian" on public.homework;
create policy "homework_select_guardian" on public.homework
  for select to authenticated using (public.is_guardian_of(student_id));

drop policy if exists "homework_submissions_select_guardian" on public.homework_submissions;
create policy "homework_submissions_select_guardian" on public.homework_submissions
  for select to authenticated using (
    exists (
      select 1 from public.homework h
      where h.id = homework_submissions.homework_id and public.is_guardian_of(h.student_id)
    )
  );

drop policy if exists "exam_results_select_guardian" on public.student_exam_results;
create policy "exam_results_select_guardian" on public.student_exam_results
  for select to authenticated using (public.is_guardian_of(student_id));

drop policy if exists "exam_sections_select_guardian" on public.student_exam_sections;
create policy "exam_sections_select_guardian" on public.student_exam_sections
  for select to authenticated using (
    exists (
      select 1 from public.student_exam_results r
      where r.id = student_exam_sections.exam_result_id and public.is_guardian_of(r.student_id)
    )
  );

drop policy if exists "purchases_select_guardian" on public.package_purchases;
create policy "purchases_select_guardian" on public.package_purchases
  for select to authenticated using (public.is_guardian_of(student_id));

-- Veli öğrencisi adına paket alabilir. status='pending' sınırı öğrenci
-- politikasıyla aynı: krediyi trigger, ödeme onaylanınca yüklüyor.
drop policy if exists "purchases_insert_guardian" on public.package_purchases;
create policy "purchases_insert_guardian" on public.package_purchases
  for insert to authenticated with check (
    public.is_guardian_of(student_id)
    and purchased_by = (select auth.uid())
    and status = 'pending'
  );
