create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(user_id),
  instructor_id uuid not null references public.instructors(user_id),
  purchased_by uuid references public.users(id),
  start_time timestamptz not null,
  end_time timestamptz not null,
  meet_link text,
  status booking_status not null default 'scheduled',
  credits_used integer not null default 1 check (credits_used > 0),
  instructor_notes text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  check (end_time > start_time)
);

create or replace function public.deduct_credit_on_booking()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare current_balance integer;
begin
  select credit_balance into current_balance from public.students where user_id = new.student_id;
  if current_balance < new.credits_used then
    raise exception 'Yetersiz kredi bakiyesi: mevcut %, gerekli %', current_balance, new.credits_used;
  end if;
  update public.students set credit_balance = credit_balance - new.credits_used where user_id = new.student_id;
  return new;
end;
$$;

create trigger trg_deduct_credit
  before insert on public.bookings
  for each row execute function public.deduct_credit_on_booking();

create or replace function public.refund_credit_on_cancel()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if new.status = 'cancelled' and old.status <> 'cancelled' then
    update public.students set credit_balance = credit_balance + old.credits_used where user_id = old.student_id;
  end if;
  return new;
end;
$$;

create trigger trg_refund_credit
  after update on public.bookings
  for each row execute function public.refund_credit_on_cancel();
