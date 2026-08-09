create or replace function public.get_yok_atlas_il_listesi()
returns table (il_adi text)
language sql
stable
security definer
set search_path = public
as $$
  select distinct p.il_adi
  from public.yok_atlas_programs p
  where p.il_adi is not null
  order by p.il_adi;
$$;

grant execute on function public.get_yok_atlas_il_listesi() to anon, authenticated;
