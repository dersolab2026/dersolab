-- Ogretmenlere puan/yorum verme ozelligi kaldirildi.

drop function if exists public.get_instructor_profile_by_id(uuid);
drop function if exists public.get_instructor_profiles(text);
drop function if exists public.get_reviews_for_instructor(uuid);
drop view if exists public.review_details;
drop view if exists public.instructor_profiles;
drop table if exists public.reviews;

create function public.get_instructor_profiles(p_subject text default null)
returns table(
  id uuid, name text, avatar_url text, bio text, subjects text[],
  lesson_price numeric, intro_video_url text, calendar_connected boolean
)
language sql stable security definer set search_path = public
as $$
  select u.id, u.name, u.avatar_url, i.bio, i.subjects, i.lesson_price, i.intro_video_url, i.calendar_connected
  from public.users u
  join public.instructors i on i.user_id = u.id
  where i.approval_status = 'approved'
    and (p_subject is null or i.subjects @> array[p_subject]);
$$;

create function public.get_instructor_profile_by_id(p_id uuid)
returns table(
  id uuid, name text, avatar_url text, bio text, subjects text[],
  lesson_price numeric, intro_video_url text, calendar_connected boolean
)
language sql stable security definer set search_path = public
as $$
  select * from public.get_instructor_profiles() where id = p_id;
$$;

create view public.instructor_profiles as
select u.id, u.name, u.avatar_url, i.bio, i.subjects, i.lesson_price, i.calendar_connected, i.intro_video_url
from public.users u
join public.instructors i on i.user_id = u.id
where i.approval_status = 'approved';
