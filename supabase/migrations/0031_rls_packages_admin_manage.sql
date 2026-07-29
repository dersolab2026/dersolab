create policy "packages_manage_admin" on public.packages
  for all using (public.is_admin()) with check (public.is_admin());
