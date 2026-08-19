-- İlk oturum tanıma formu ve öz-değerlendirme ölçeği.
--
-- Sıfır veri anındaki tek bilgi kaynağı: hiç deneme, günlük ya da ödev
-- birikmemişken koç ilk görüşmeye tamamen kör giriyor.
--
-- Ölçek DersoLab'ın kendi madde seti. LASSI gibi ticari lisanslı ölçeklerin
-- maddeleri kullanılmadı; boyutlar benzer ama ifadeler özgün. Bu ölçek
-- psikometrik olarak doğrulanmış DEĞİL ve arayüzde de öyle sunuluyor:
-- bilimsel bir test değil, konuşma başlatıcı.

create table if not exists public.student_intake_forms (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(user_id) on delete cascade,
  goal text,
  hard_subjects text,
  daily_routine text,
  tried_methods text,
  study_environment text,
  -- "Buraya gelmeyi kim istedi" — degisime hazir olusun en pratik gostergesi.
  -- Veli getirdi / ogrenci istemiyor vakasini erken ayirt ediyor.
  who_wanted text check (who_wanted is null or who_wanted in ('kendim', 'ailem', 'ikimiz')),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ogrenci basina tek form; guncellenebiliyor.
create unique index if not exists student_intake_forms_tek
  on public.student_intake_forms (student_id);

alter table public.student_intake_forms enable row level security;

create policy "intake_select" on public.student_intake_forms
  for select using (
    student_id = (select auth.uid()) or public.can_view_student(student_id)
  );

create policy "intake_insert_own" on public.student_intake_forms
  for insert with check (student_id = (select auth.uid()));

create policy "intake_update_own" on public.student_intake_forms
  for update using (student_id = (select auth.uid()));

-- Olcek birden fazla kez alinabiliyor: 8-10 hafta sonra tekrar olculup
-- ust uste bindiriliyor. Kocluğun etkisini netten bagimsiz gosterebilen
-- tek cikti bu.
create table if not exists public.student_self_assessments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(user_id) on delete cascade,
  taken_on date not null default current_date,
  -- { "zy1": 4, "ko2": 2, ... } — madde tanimlari kodda duruyor.
  -- jsonb secildi cunku madde seti zamanla degisebilir; kolon eklemek
  -- her degisiklikte migration gerektirirdi.
  answers jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists student_self_assessments_ogrenci_idx
  on public.student_self_assessments (student_id, taken_on desc);

alter table public.student_self_assessments enable row level security;

create policy "self_assessment_select" on public.student_self_assessments
  for select using (
    student_id = (select auth.uid()) or public.can_view_student(student_id)
  );

create policy "self_assessment_insert_own" on public.student_self_assessments
  for insert with check (student_id = (select auth.uid()));

create policy "self_assessment_delete_own" on public.student_self_assessments
  for delete using (student_id = (select auth.uid()));
