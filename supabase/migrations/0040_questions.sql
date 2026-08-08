-- Ogrenci (veya veli, ogrenci adina) bir egitmene soru sorabilir, egitmen cevaplar.
-- Sadece daha once ders aldigi egitmenlere soru sorulabilir (bookings uzerinden).

create table public.questions (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(user_id) on delete cascade,
  instructor_id uuid not null references public.instructors(user_id) on delete cascade,
  asked_by uuid not null references public.users(id),
  question_text text not null,
  answer_text text,
  status text not null default 'pending' check (status in ('pending', 'answered')),
  created_at timestamptz not null default now(),
  answered_at timestamptz
);

alter table public.questions enable row level security;

create policy "questions_select" on public.questions
  for select using (
    student_id = auth.uid()
    or instructor_id = auth.uid()
    or public.is_guardian_of(student_id)
    or public.is_admin()
  );

create policy "questions_insert" on public.questions
  for insert with check (
    asked_by = auth.uid()
    and (student_id = auth.uid() or public.is_guardian_of(student_id))
    and exists (
      select 1 from public.bookings b
      where b.student_id = questions.student_id and b.instructor_id = questions.instructor_id
    )
  );

create policy "questions_update_instructor" on public.questions
  for update using (instructor_id = auth.uid())
  with check (instructor_id = auth.uid());
