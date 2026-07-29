create or replace view public.instructor_profiles as
select u.id, u.name, u.avatar_url, i.bio, i.subjects, i.lesson_price, i.calendar_connected
from public.users u
join public.instructors i on i.user_id = u.id;
