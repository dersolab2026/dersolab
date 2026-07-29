create policy "users_select_own_or_linked" on public.users
  for select using (id = auth.uid() or public.is_guardian_of(id) or public.is_admin());

create policy "users_update_own" on public.users
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "students_select" on public.students
  for select using (user_id = auth.uid() or public.is_guardian_of(user_id) or public.is_admin());

create policy "guardian_links_select" on public.guardian_links
  for select using (guardian_id = auth.uid() or student_id = auth.uid() or public.is_admin());

create policy "guardian_links_insert" on public.guardian_links
  for insert with check (guardian_id = auth.uid() or public.is_admin());
