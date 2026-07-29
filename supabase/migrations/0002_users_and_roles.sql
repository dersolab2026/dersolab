create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null,
  name text not null,
  email text not null unique,
  phone text,
  birth_date date,
  avatar_url text,
  created_at timestamptz not null default now()
);

create table public.students (
  user_id uuid primary key references public.users(id) on delete cascade,
  grade_track grade_track not null,
  credit_balance integer not null default 0 check (credit_balance >= 0),
  created_at timestamptz not null default now()
);

create table public.instructors (
  user_id uuid primary key references public.users(id) on delete cascade,
  bio text,
  subjects text[] not null default '{}',
  hourly_rate numeric(10,2) not null default 0,
  created_at timestamptz not null default now()
);

create table public.instructor_calendar_credentials (
  instructor_id uuid primary key references public.instructors(user_id) on delete cascade,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  updated_at timestamptz not null default now()
);

create table public.guardian_links (
  id uuid primary key default gen_random_uuid(),
  guardian_id uuid not null references public.users(id) on delete cascade,
  student_id uuid not null references public.users(id) on delete cascade,
  relationship text,
  is_primary_payer boolean not null default true,
  created_at timestamptz not null default now(),
  unique (guardian_id, student_id)
);
