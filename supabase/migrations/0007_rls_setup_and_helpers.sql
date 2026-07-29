alter table public.users enable row level security;
alter table public.students enable row level security;
alter table public.instructors enable row level security;
alter table public.instructor_calendar_credentials enable row level security;
alter table public.guardian_links enable row level security;
alter table public.packages enable row level security;
alter table public.package_purchases enable row level security;
alter table public.bookings enable row level security;
alter table public.homework enable row level security;
alter table public.notifications enable row level security;

create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (select 1 from public.users where id = auth.uid() and role = 'admin');
$$;

create or replace function public.is_guardian_of(target_student_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.guardian_links
    where student_id = target_student_id and guardian_id = auth.uid()
  );
$$;
