create or replace function public.prevent_booking_field_tamper()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') = 'service_role' then
    return new;
  end if;

  if new.student_id is distinct from old.student_id
     or new.instructor_id is distinct from old.instructor_id
     or new.purchased_by is distinct from old.purchased_by
     or new.credits_used is distinct from old.credits_used
     or new.start_time is distinct from old.start_time
     or new.end_time is distinct from old.end_time
     or new.is_trial is distinct from old.is_trial
  then
    raise exception 'Bu alanlar bu yontemle degistirilemez';
  end if;

  return new;
end;
$$;

create trigger trg_prevent_booking_field_tamper
  before update on public.bookings
  for each row execute function public.prevent_booking_field_tamper();
