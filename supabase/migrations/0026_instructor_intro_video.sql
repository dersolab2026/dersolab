alter table public.instructors add column intro_video_url text;

create or replace view public.instructor_profiles as
select u.id, u.name, u.avatar_url, i.bio, i.subjects, i.lesson_price, i.calendar_connected, i.intro_video_url
from public.users u
join public.instructors i on i.user_id = u.id;
