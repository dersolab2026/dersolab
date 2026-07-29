create table public.packages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  credit_amount integer not null check (credit_amount > 0),
  price numeric(10,2) not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.package_purchases (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.packages(id),
  student_id uuid not null references public.students(user_id),
  purchased_by uuid not null references public.users(id),
  credits_granted integer not null,
  amount_paid numeric(10,2) not null,
  payment_provider text not null default 'stripe',
  payment_reference text,
  status purchase_status not null default 'pending',
  created_at timestamptz not null default now()
);

create or replace function public.grant_credits_on_purchase()
returns trigger
language plpgsql security definer set search_path = public
as $$
begin
  if new.status = 'completed' and (old.status is null or old.status <> 'completed') then
    update public.students set credit_balance = credit_balance + new.credits_granted
    where user_id = new.student_id;
  end if;
  return new;
end;
$$;

create trigger trg_grant_credits
  after insert or update on public.package_purchases
  for each row execute function public.grant_credits_on_purchase();
