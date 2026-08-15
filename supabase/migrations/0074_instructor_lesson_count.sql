-- Egitmen kartlarinda sosyal kanit icin tamamlanan ders sayisini ekliyoruz.
-- Donus tipi (OUT parametreleri) degistigi icin fonksiyonlari once silmemiz gerekiyor.

drop function if exists public.get_instructor_profile_by_id(uuid);
drop function if exists public.get_instructor_profiles(text);

create or replace function public.get_instructor_profiles(p_subject text default null)
returns table(
  id uuid, name text, avatar_url text, bio text, subjects text[],
  lesson_price numeric, intro_video_url text, calendar_connected boolean,
  completed_lesson_count bigint
)
language sql stable security definer set search_path = public
as $$
  select u.id, u.name, u.avatar_url, i.bio, i.subjects, i.lesson_price, i.intro_video_url, i.calendar_connected,
    coalesce((select count(*) from public.bookings b where b.instructor_id = u.id and b.status = 'completed'), 0)
  from public.users u
  join public.instructors i on i.user_id = u.id
  where i.approval_status = 'approved'
    and not i.paused
    and (p_subject is null or i.subjects @> array[p_subject]);
$$;

create or replace function public.get_instructor_profile_by_id(p_id uuid)
returns table(
  id uuid, name text, avatar_url text, bio text, subjects text[],
  lesson_price numeric, intro_video_url text, calendar_connected boolean,
  completed_lesson_count bigint
)
language sql stable security definer set search_path = public
as $$
  select * from public.get_instructor_profiles() where id = p_id;
$$;
