create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and coalesce(auth.role(), '') <> 'service_role' then
    raise exception 'Rol degisikligi bu yontemle yapilamaz';
  end if;
  return new;
end;
$$;

create trigger trg_prevent_role_change
  before update on public.users
  for each row execute function public.prevent_role_change();
