create type instructor_approval_status as enum ('pending', 'approved', 'rejected');

alter table public.instructors
  add column approval_status instructor_approval_status not null default 'pending',
  add column approval_note text,
  add column reviewed_at timestamptz,
  add column reviewed_by uuid references public.users(id);

create or replace view public.instructor_profiles as
select u.id, u.name, u.avatar_url, i.bio, i.subjects, i.lesson_price, i.calendar_connected, i.intro_video_url
from public.users u
join public.instructors i on i.user_id = u.id
where i.approval_status = 'approved';

create policy "instructors_update_admin" on public.instructors
  for update using (public.is_admin());
