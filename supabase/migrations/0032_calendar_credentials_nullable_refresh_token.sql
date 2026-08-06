-- Google yalnizca offline erisimin ilk onayinda refresh_token doner; prompt=consent
-- kullanilsa bile bazi hesaplarda (ozellikle onceden yetki verilmis) refresh_token
-- gelmeyebilir. Kolon NOT NULL oldugu icin bu durumda ilk baglanti denemesi
-- veritabani kisitlamasina takilip sessizce basarisiz oluyordu.
alter table public.instructor_calendar_credentials
  alter column refresh_token drop not null;

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

  if not exists (
    select 1 from public.instructor_calendar_credentials
    where instructor_id = auth.uid() and refresh_token is not null
  ) then
    raise exception 'missing_refresh_token';
  end if;

  update public.instructors set calendar_connected = true where user_id = auth.uid();
end;
$$;

revoke all on function public.upsert_instructor_calendar_credentials from public;
grant execute on function public.upsert_instructor_calendar_credentials to authenticated;
