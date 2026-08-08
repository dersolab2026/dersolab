-- Soru-cevap ozelligi sadece ogrenci-egitmen arasinda olsun, veli dahil olmasin.

drop policy "questions_select" on public.questions;
create policy "questions_select" on public.questions
  for select using (
    student_id = auth.uid()
    or instructor_id = auth.uid()
    or public.is_admin()
  );

drop policy "questions_insert" on public.questions;
create policy "questions_insert" on public.questions
  for insert with check (
    asked_by = auth.uid()
    and student_id = auth.uid()
    and exists (
      select 1 from public.bookings b
      where b.student_id = questions.student_id and b.instructor_id = questions.instructor_id
    )
  );
