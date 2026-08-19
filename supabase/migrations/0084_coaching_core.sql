-- Koçluk altyapısının çekirdeği: kalıcı koçluk ilişkisi, oturum formu ve
-- deneme yanlışlarının tip kırılımı.
--
-- Bugüne kadar koç–öğrenci bağı can_view_student() içinde bookings ve
-- demo_lesson_requests'ten TÜRETİLİYORDU (0083). Erişim kontrolü için
-- yetiyordu ama haftalık plan, oturum formu ve rapor gibi özellikler
-- "ilişki ne zaman başladı, hâlâ sürüyor mu" sorusunu soruyor; türetilmiş
-- bir bağ bunu cevaplayamıyor.

-- ------------------------------------------------------- koçluk ilişkisi
create table if not exists public.coaching_relationships (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(user_id) on delete cascade,
  coach_id uuid not null references public.instructors(user_id) on delete cascade,
  started_on date not null default current_date,
  ended_on date,
  -- Serbest metin: "haftada 1 ana görüşme + 1 ara kontrol" gibi.
  weekly_rhythm text,
  status text not null default 'active' check (status in ('active', 'paused', 'ended')),
  created_at timestamptz not null default now()
);

-- Aynı çift için aynı anda tek bir aktif ilişki olabilir; geçmiş ilişkiler
-- (status='ended') tekrar tekrar kurulabilsin diye kısmi indeks.
create unique index if not exists coaching_relationships_aktif_tek
  on public.coaching_relationships (student_id, coach_id)
  where status = 'active';

create index if not exists coaching_relationships_coach_idx
  on public.coaching_relationships (coach_id, status);

-- Koçun dışarıdan getirdiği öğrenciyi bağlaması için davet kodu.
alter table public.instructors
  add column if not exists coach_invite_code text unique;

alter table public.coaching_relationships enable row level security;

create policy "coaching_rel_select" on public.coaching_relationships
  for select using (
    student_id = (select auth.uid())
    or coach_id = (select auth.uid())
    or public.is_admin()
  );

create policy "coaching_rel_insert_coach" on public.coaching_relationships
  for insert with check (
    coach_id = (select auth.uid()) and public.is_coach((select auth.uid()))
  );

create policy "coaching_rel_update_coach" on public.coaching_relationships
  for update using (coach_id = (select auth.uid()) or public.is_admin());

-- Erişim kuralına kalıcı ilişkiyi de ekliyoruz. Türetilmiş dallar duruyor:
-- eski koçluk talepleri ve dersler hâlâ erişim vermeli.
create or replace function public.can_view_student(p_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    public.is_admin()
    or exists (
      select 1 from public.bookings b
      where b.student_id = p_student_id
        and b.instructor_id = (select auth.uid())
    )
    or exists (
      select 1 from public.demo_lesson_requests r
      where r.student_id = p_student_id
        and r.assigned_instructor_id = (select auth.uid())
    )
    or exists (
      select 1 from public.coaching_relationships c
      where c.student_id = p_student_id
        and c.coach_id = (select auth.uid())
    );
$$;

-- ------------------------------------------------------- oturum formu
create table if not exists public.coaching_session_notes (
  id uuid primary key default gen_random_uuid(),
  -- Kocluk gorusmeleri her zaman bir rezervasyona bagli olmayabilir
  -- (ucretsiz kocluk haftasinda ders olusmuyor), bu yuzden nullable.
  booking_id uuid unique references public.bookings(id) on delete set null,
  relationship_id uuid references public.coaching_relationships(id) on delete set null,
  coach_id uuid not null references public.instructors(user_id) on delete cascade,
  student_id uuid not null references public.students(user_id) on delete cascade,
  session_date date not null default current_date,
  -- Plana ne kadar uyuldu.
  plan_followed text check (plan_followed is null or plan_followed in ('evet', 'kismen', 'hayir')),
  obstacle text,
  student_commitment text,
  coach_decisions text,
  -- Ogrencinin "bunu yapabilirim" ozguveni; zaman serisi olarak anlamli.
  confidence smallint check (confidence is null or (confidence between 1 and 10)),
  created_at timestamptz not null default now()
);

create index if not exists coaching_session_notes_ogrenci_idx
  on public.coaching_session_notes (student_id, session_date desc);

alter table public.coaching_session_notes enable row level security;

-- Ogrenci kendi oturum notlarini GOREBILIR: koclugun seffaf olmasi
-- gerekiyor, ogrenci hakkinda gizli not tutulan bir sistem olmamali.
create policy "session_notes_select" on public.coaching_session_notes
  for select using (
    student_id = (select auth.uid())
    or coach_id = (select auth.uid())
    or public.is_admin()
  );

create policy "session_notes_insert_coach" on public.coaching_session_notes
  for insert with check (coach_id = (select auth.uid()));

create policy "session_notes_update_coach" on public.coaching_session_notes
  for update using (coach_id = (select auth.uid()));

create policy "session_notes_delete_coach" on public.coaching_session_notes
  for delete using (coach_id = (select auth.uid()));

-- --------------------------------------------- yanlislarin tip kirilimi
-- Ayni 5 net kaybinin dort farkli tedavisi var; tek bir "yanlis" rakami
-- bu ayrimi yapamiyor. Alanlar opsiyonel, girilmezse eskisi gibi calisiyor.
alter table public.student_exam_sections
  add column if not exists wrong_knowledge smallint check (wrong_knowledge is null or wrong_knowledge >= 0),
  add column if not exists wrong_careless smallint check (wrong_careless is null or wrong_careless >= 0),
  add column if not exists wrong_misread smallint check (wrong_misread is null or wrong_misread >= 0),
  add column if not exists wrong_timeout smallint check (wrong_timeout is null or wrong_timeout >= 0);

-- Tip toplami o dersteki yanlis sayisini asamaz.
alter table public.student_exam_sections
  drop constraint if exists student_exam_sections_hata_tipi_toplami;
alter table public.student_exam_sections
  add constraint student_exam_sections_hata_tipi_toplami check (
    coalesce(wrong_knowledge, 0) + coalesce(wrong_careless, 0)
    + coalesce(wrong_misread, 0) + coalesce(wrong_timeout, 0) <= wrong_count
  );

-- Ogrenci kendi ders kirilimini guncelleyebilsin (hata tipi sonradan
-- girilebiliyor); 0080'de yalnizca insert/delete vardi.
drop policy if exists "exam_sections_update_own" on public.student_exam_sections;
create policy "exam_sections_update_own" on public.student_exam_sections
  for update using (
    exists (
      select 1 from public.student_exam_results r
      where r.id = exam_result_id and r.student_id = (select auth.uid())
    )
  );
