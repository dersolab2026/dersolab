create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null unique references public.bookings(id) on delete cascade,
  student_id uuid not null references public.students(user_id),
  instructor_id uuid not null references public.instructors(user_id),
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

create policy "reviews_public_select" on public.reviews
  for select using (true);

create policy "reviews_insert_own_completed_booking" on public.reviews
  for insert with check (
    exists (
      select 1 from public.bookings b
      where b.id = booking_id
        and b.status = 'completed'
        and b.student_id = student_id
        and b.instructor_id = instructor_id
        and (b.student_id = auth.uid() or public.is_guardian_of(b.student_id))
    )
  );

create policy "reviews_update_own" on public.reviews
  for update using (student_id = auth.uid() or public.is_guardian_of(student_id))
  with check (student_id = auth.uid() or public.is_guardian_of(student_id));

create policy "reviews_delete_own_or_admin" on public.reviews
  for delete using (student_id = auth.uid() or public.is_guardian_of(student_id) or public.is_admin());

create view public.review_details as
select
  r.id, r.instructor_id, r.rating, r.comment, r.created_at,
  case
    when split_part(u.name, ' ', 2) = '' then split_part(u.name, ' ', 1)
    else split_part(u.name, ' ', 1) || ' ' || left(split_part(u.name, ' ', 2), 1) || '.'
  end as student_display_name
from public.reviews r
join public.users u on u.id = r.student_id;

grant select on public.review_details to anon, authenticated;

create or replace view public.instructor_profiles as
select
  u.id, u.name, u.avatar_url, i.bio, i.subjects, i.lesson_price, i.calendar_connected, i.intro_video_url,
  coalesce(r.average_rating, 0) as average_rating,
  coalesce(r.review_count, 0) as review_count
from public.users u
join public.instructors i on i.user_id = u.id
left join (
  select instructor_id, avg(rating)::numeric(3,2) as average_rating, count(*) as review_count
  from public.reviews
  group by instructor_id
) r on r.instructor_id = i.user_id
where i.approval_status = 'approved';