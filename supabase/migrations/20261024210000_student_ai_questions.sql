-- Öğrencinin AI Soru Asistanı ile çözdürdüğü soruların (Soru Defterim) bulutta
-- saklanması, cihazlar arası senkronize edilmesi ve eğitmen/veli tarafından incelenebilmesi.

create table if not exists public.student_ai_questions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(user_id) on delete cascade,
  subject text not null,
  question text not null,
  solution text not null,
  is_favorite boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists student_ai_questions_student_created_idx
  on public.student_ai_questions (student_id, created_at desc);

alter table public.student_ai_questions enable row level security;

create policy "ai_questions_select_own_or_authorized" on public.student_ai_questions
  for select using (
    student_id = (select auth.uid())
    or exists (
      select 1 from public.bookings b
      where b.student_id = student_ai_questions.student_id
        and b.instructor_id = (select auth.uid())
    )
    or exists (
      select 1 from public.guardians g
      where g.student_id = student_ai_questions.student_id
        and g.parent_id = (select auth.uid())
    )
    or exists (
      select 1 from public.users u
      where u.id = (select auth.uid())
        and u.role = 'admin'
    )
  );

create policy "ai_questions_insert_own" on public.student_ai_questions
  for insert with check (student_id = (select auth.uid()));

create policy "ai_questions_update_own" on public.student_ai_questions
  for update using (student_id = (select auth.uid()))
  with check (student_id = (select auth.uid()));

create policy "ai_questions_delete_own" on public.student_ai_questions
  for delete using (student_id = (select auth.uid()));
