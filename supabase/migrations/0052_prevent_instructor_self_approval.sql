create or replace function public.prevent_instructor_self_approval()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') = 'service_role' or public.is_admin() then
    return new;
  end if;

  if new.approval_status is distinct from old.approval_status
     or new.approval_note is distinct from old.approval_note
     or new.reviewed_at is distinct from old.reviewed_at
     or new.reviewed_by is distinct from old.reviewed_by
     or new.offers_free_trial is distinct from old.offers_free_trial
  then
    raise exception 'Bu alanlar sadece yönetici tarafından değiştirilebilir';
  end if;

  return new;
end;
$$;

create trigger trg_prevent_instructor_self_approval
  before update on public.instructors
  for each row execute function public.prevent_instructor_self_approval();
