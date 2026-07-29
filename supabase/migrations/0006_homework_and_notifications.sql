create table public.homework (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references public.bookings(id) on delete set null,
  student_id uuid not null references public.students(user_id),
  instructor_id uuid not null references public.instructors(user_id),
  title text not null,
  description text,
  due_date date,
  status homework_status not null default 'assigned',
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  recipient_id uuid not null references public.users(id) on delete cascade,
  type notification_type not null,
  channel notification_channel not null default 'in_app',
  title text not null,
  body text,
  related_booking_id uuid references public.bookings(id) on delete set null,
  related_homework_id uuid references public.homework(id) on delete set null,
  is_read boolean not null default false,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);
