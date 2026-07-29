create policy "packages_public_select" on public.packages
  for select using (is_active = true or public.is_admin());

create policy "purchases_select" on public.package_purchases
  for select using (
    student_id = auth.uid() or purchased_by = auth.uid()
    or public.is_guardian_of(student_id) or public.is_admin()
  );

create policy "bookings_select" on public.bookings
  for select using (
    student_id = auth.uid() or instructor_id = auth.uid()
    or public.is_guardian_of(student_id) or public.is_admin()
  );

create policy "bookings_insert" on public.bookings
  for insert with check (
    student_id = auth.uid() or public.is_guardian_of(student_id) or public.is_admin()
  );

create policy "bookings_update_instructor" on public.bookings
  for update using (instructor_id = auth.uid() or public.is_admin());

create policy "homework_select" on public.homework
  for select using (
    student_id = auth.uid() or instructor_id = auth.uid()
    or public.is_guardian_of(student_id) or public.is_admin()
  );

create policy "homework_insert_instructor" on public.homework
  for insert with check (instructor_id = auth.uid() or public.is_admin());

create policy "notifications_select_own" on public.notifications
  for select using (recipient_id = auth.uid() or public.is_admin());

create policy "notifications_update_own" on public.notifications
  for update using (recipient_id = auth.uid());
