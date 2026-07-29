create policy "instructors_public_select" on public.instructors
  for select using (true);

create policy "instructors_update_own" on public.instructors
  for update using (user_id = auth.uid());

create view public.instructor_profiles as
select u.id, u.name, u.avatar_url, i.bio, i.subjects, i.hourly_rate
from public.users u
join public.instructors i on i.user_id = u.id;

grant select on public.instructor_profiles to anon, authenticated;
