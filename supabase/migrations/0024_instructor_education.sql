create table public.instructor_education (
  id uuid primary key default gen_random_uuid(),
  instructor_id uuid not null references public.instructors(user_id) on delete cascade,
  institution text not null,
  degree text,
  field_of_study text,
  start_year smallint,
  end_year smallint,
  display_order smallint not null default 0,
  created_at timestamptz not null default now()
);

alter table public.instructor_education enable row level security;

create policy "instructor_education_public_select" on public.instructor_education
  for select using (true);

create policy "instructor_education_manage_own" on public.instructor_education
  for all using (instructor_id = auth.uid()) with check (instructor_id = auth.uid());
