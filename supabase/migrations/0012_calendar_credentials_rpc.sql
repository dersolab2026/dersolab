create or replace function public.upsert_instructor_calendar_credentials(
  p_access_token text,
  p_refresh_token text,
  p_expires_at timestamptz
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (select 1 from public.instructors where user_id = auth.uid()) then
    raise exception 'Sadece eğitmen hesapları takvim bağlayabilir';
  end if;

  insert into public.instructor_calendar_credentials
    (instructor_id, access_token, refresh_token, expires_at, updated_at)
  values
    (auth.uid(), p_access_token, p_refresh_token, p_expires_at, now())
  on conflict (instructor_id) do update
    set access_token = excluded.access_token,
        refresh_token = coalesce(excluded.refresh_token, instructor_calendar_credentials.refresh_token),
        expires_at = excluded.expires_at,
        updated_at = now();

  update public.instructors set calendar_connected = true where user_id = auth.uid();
end;
$$;

revoke all on function public.upsert_instructor_calendar_credentials from public;
grant execute on function public.upsert_instructor_calendar_credentials to authenticated;
