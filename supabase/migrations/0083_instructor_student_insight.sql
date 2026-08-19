-- Egitmen/koc, ilgilendigi ogrencinin deneme sonuclarini ve gunlugunu
-- gorebilsin. Odev verisi zaten egitmene aciktı (homework.instructor_id),
-- eksik olan bu iki tabloydu.
--
-- Erisim sinirini tek bir yerde tanimliyoruz: can_view_student(). Boylece
-- kural uc politikada tekrarlanmiyor ve ileride degisirse tek yerden degisiyor.
--
-- Neden security definer: fonksiyon icinde bookings ve demo_lesson_requests
-- okunuyor. Bunlari cagiran kullanicinin RLS'i altinda okumak, ileride o
-- tablolarin politikalari degistiginde sessizce yanlis sonuc uretebilirdi.
-- Fonksiyon disariya yalnizca boolean donduruyor, veri sizdirmiyor.

create or replace function public.can_view_student(p_student_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    -- Admin (site sahibi ve kurucular) tum ogrencileri gorebilir.
    public.is_admin()
    -- Dersi olan egitmen: gecmis ya da gelecek fark etmiyor.
    or exists (
      select 1 from public.bookings b
      where b.student_id = p_student_id
        and b.instructor_id = (select auth.uid())
    )
    -- Koc ya da tanisma dersini ustlenen egitmen.
    or exists (
      select 1 from public.demo_lesson_requests r
      where r.student_id = p_student_id
        and r.assigned_instructor_id = (select auth.uid())
    );
$$;

revoke all on function public.can_view_student(uuid) from public;
grant execute on function public.can_view_student(uuid) to authenticated;

-- ---------------------------------------------------------------- denemeler
drop policy if exists "exam_results_select_instructor" on public.student_exam_results;
create policy "exam_results_select_instructor" on public.student_exam_results
  for select using (public.can_view_student(student_id));

drop policy if exists "exam_sections_select_instructor" on public.student_exam_sections;
create policy "exam_sections_select_instructor" on public.student_exam_sections
  for select using (
    exists (
      select 1 from public.student_exam_results r
      where r.id = exam_result_id and public.can_view_student(r.student_id)
    )
  );

-- ------------------------------------------------------------------ gunluk
drop policy if exists "study_logs_select_instructor" on public.student_study_logs;
create policy "study_logs_select_instructor" on public.student_study_logs
  for select using (public.can_view_student(student_id));

-- Egitmen listesinde ogrencinin adini gosterebilmek icin.
drop policy if exists "students_select_instructor" on public.students;
create policy "students_select_instructor" on public.students
  for select using (public.can_view_student(user_id));

-- Not: yalnizca SELECT veriliyor. Egitmen ogrencinin denemesini ya da
-- gunlugunu duzenleyemez, silemez.
