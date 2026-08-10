-- instructor_profiles view artik kullanilmiyor; gercek erisim
-- get_instructor_profiles()/get_instructor_profile_by_id() fonksiyonlari
-- uzerinden (bkz. 0033_remove_reviews.sql). Bare view, RLS'i bypass eden
-- (SECURITY DEFINER) bir nesne olarak duruyordu, kullanilmadigi icin kaldiriliyor.
drop view if exists public.instructor_profiles;

-- auth.uid() her satirda yeniden hesaplaniyordu; (select auth.uid()) ile
-- sarmalayarak Postgres'in bunu bir kez hesaplamasini (InitPlan) sagliyoruz.
alter policy "users_select_own_or_linked" on public.users
  using (id = (select auth.uid()) or public.is_guardian_of(id) or public.is_admin());

alter policy "users_update_own" on public.users
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));
