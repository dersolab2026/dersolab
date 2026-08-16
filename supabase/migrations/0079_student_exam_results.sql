-- Ogrencinin "Netlerim" sayfasinda deneme sonuclarini takip edebilmesi icin:
-- deneme adi, turu, dogru/yanlis sayisi ve (YKS icin) istege bagli OBP.
-- Net ve tahmini puan uygulama tarafinda hesaplaniyor, veride tutulmuyor.

create table public.student_exam_results (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(user_id) on delete cascade,
  exam_name text not null,
  exam_type text not null check (exam_type in ('lgs', 'tyt', 'ayt', 'kpss', 'dgs', 'ales')),
  exam_date date not null,
  correct_count integer not null check (correct_count >= 0),
  wrong_count integer not null check (wrong_count >= 0),
  obp numeric(5,2) check (obp is null or (obp >= 100 and obp <= 500)),
  created_at timestamptz not null default now()
);

create index student_exam_results_student_date_idx
  on public.student_exam_results (student_id, exam_date desc);

alter table public.student_exam_results enable row level security;

create policy "exam_results_select_own" on public.student_exam_results
  for select using (student_id = (select auth.uid()));

create policy "exam_results_insert_own" on public.student_exam_results
  for insert with check (student_id = (select auth.uid()));

create policy "exam_results_delete_own" on public.student_exam_results
  for delete using (student_id = (select auth.uid()));
