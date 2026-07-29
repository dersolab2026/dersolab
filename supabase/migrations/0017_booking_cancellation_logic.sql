alter table public.bookings
  add column cancelled_by user_role,
  add column credit_refunded boolean,
  add column google_event_id text;

drop trigger if exists trg_refund_credit on public.bookings;

create or replace function public.refund_credit_on_cancel()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'cancelled' and old.status <> 'cancelled' then
    if new.cancelled_by in ('instructor', 'admin')
       or (old.start_time - now() >= interval '24 hours') then
      update public.students set credit_balance = credit_balance + old.credits_used
      where user_id = old.student_id;
      new.credit_refunded := true;
    else
      new.credit_refunded := false;
    end if;
  end if;
  return new;
end;
$$;

create trigger trg_refund_credit
  before update on public.bookings
  for each row execute function public.refund_credit_on_cancel();
