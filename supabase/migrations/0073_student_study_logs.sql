-- Ogrencinin "Gunluk" sayfasinda kendi kendine calisma notu dusebilmesi
-- icin: hangi gun, hangi derse/konuya, kac saat calisti, kac soru cozdu,
-- hangi kaynaktan.

create table public.student_study_logs (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(user_id) on delete cascade,
  log_date date not null,
  subject text not null,
  topic text,
  hours numeric(4,1) check (hours is null or hours >= 0),
  questions_solved integer check (questions_solved is null or questions_solved >= 0),
  source text,
  created_at timestamptz not null default now()
);

create index student_study_logs_student_date_idx on public.student_study_logs (student_id, log_date);

alter table public.student_study_logs enable row level security;

create policy "study_logs_select_own" on public.student_study_logs
  for select using (student_id = (select auth.uid()));

create policy "study_logs_insert_own" on public.student_study_logs
  for insert with check (student_id = (select auth.uid()));

create policy "study_logs_delete_own" on public.student_study_logs
  for delete using (student_id = (select auth.uid()));
