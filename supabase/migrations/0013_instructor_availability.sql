create table public.instructor_availability (
  id uuid primary key default gen_random_uuid(),
  instructor_id uuid not null references public.instructors(user_id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);

alter table public.instructor_availability enable row level security;

create policy "availability_public_select" on public.instructor_availability
  for select using (is_active = true or instructor_id = auth.uid() or public.is_admin());

create policy "availability_manage_own" on public.instructor_availability
  for all using (instructor_id = auth.uid()) with check (instructor_id = auth.uid());
