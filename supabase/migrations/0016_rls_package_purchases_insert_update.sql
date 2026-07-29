create policy "purchases_insert_own" on public.package_purchases
  for insert with check (
    (student_id = auth.uid() or public.is_guardian_of(student_id))
    and purchased_by = auth.uid()
    and status = 'pending'
  );

create policy "purchases_update_own_pending_to_failed" on public.package_purchases
  for update using (purchased_by = auth.uid() and status = 'pending')
  with check (status = 'failed');
