drop view if exists public.instructor_profiles;

alter table public.instructors rename column hourly_rate to lesson_price;

create view public.instructor_profiles as
select u.id, u.name, u.avatar_url, i.bio, i.subjects, i.lesson_price
from public.users u
join public.instructors i on i.user_id = u.id;

grant select on public.instructor_profiles to anon, authenticated;
