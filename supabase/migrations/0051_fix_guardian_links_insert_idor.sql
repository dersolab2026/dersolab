drop policy if exists "guardian_links_insert" on public.guardian_links;

create policy "guardian_links_insert" on public.guardian_links
  for insert with check (
    public.is_admin()
    or (
      guardian_id = auth.uid()
      and exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'parent')
      and not exists (
        select 1 from public.guardian_links gl
        where gl.student_id = guardian_links.student_id
      )
    )
  );
