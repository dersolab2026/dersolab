-- Ucretsiz tanisma dersi artik belirli bir egitmen secilerek degil,
-- talep olarak olusturuluyor ve sadece "offers_free_trial" isaretli
-- egitmenlere dagitiliyor. Ilk kabul eden egitmen dersi alir.

alter table public.instructors add column offers_free_trial boolean not null default false;

update public.instructors set offers_free_trial = true
where user_id in (
  '437c3905-8dc0-4172-b21c-6f3182f5a4d4', -- Egemen Isik
  '6349a00d-cb55-4306-a4a8-b7b6206edc8f', -- Nisa Karaalioglu
  'd96a9da2-0057-4c2e-9d74-91c07a5ea9ee', -- Selva Sahin
  '5e24812e-7a53-430d-b79d-93136b185229'  -- Gamze Budak
);

create table public.demo_lesson_requests (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(user_id) on delete cascade,
  requested_by uuid not null references public.users(id),
  status text not null default 'pending' check (status in ('pending', 'assigned', 'cancelled')),
  assigned_instructor_id uuid references public.instructors(user_id),
  booking_id uuid references public.bookings(id),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

alter table public.demo_lesson_requests enable row level security;

create table public.demo_lesson_declines (
  request_id uuid not null references public.demo_lesson_requests(id) on delete cascade,
  instructor_id uuid not null references public.instructors(user_id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (request_id, instructor_id)
);

alter table public.demo_lesson_declines enable row level security;

create policy "demo_requests_select" on public.demo_lesson_requests
  for select using (
    requested_by = auth.uid()
    or student_id = auth.uid()
    or public.is_guardian_of(student_id)
    or assigned_instructor_id = auth.uid()
    or public.is_admin()
    or (
      status = 'pending'
      and exists (select 1 from public.instructors i where i.user_id = auth.uid() and i.offers_free_trial)
      and not exists (
        select 1 from public.demo_lesson_declines d
        where d.request_id = demo_lesson_requests.id and d.instructor_id = auth.uid()
      )
    )
  );

create policy "demo_requests_insert" on public.demo_lesson_requests
  for insert with check (
    requested_by = auth.uid()
    and (student_id = auth.uid() or public.is_guardian_of(student_id))
    and not exists (select 1 from public.students s where s.user_id = student_id and s.free_trial_used)
    and not exists (
      select 1 from public.demo_lesson_requests r
      where r.student_id = demo_lesson_requests.student_id and r.status = 'pending'
    )
  );

create policy "demo_requests_update_claim" on public.demo_lesson_requests
  for update using (
    status = 'pending'
    and exists (select 1 from public.instructors i where i.user_id = auth.uid() and i.offers_free_trial)
  )
  with check (assigned_instructor_id = auth.uid() and status = 'assigned');

create policy "demo_declines_select" on public.demo_lesson_declines
  for select using (instructor_id = auth.uid() or public.is_admin());

create policy "demo_declines_insert" on public.demo_lesson_declines
  for insert with check (
    instructor_id = auth.uid()
    and exists (select 1 from public.instructors i where i.user_id = auth.uid() and i.offers_free_trial)
  );
