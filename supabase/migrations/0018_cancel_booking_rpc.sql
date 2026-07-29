create or replace function public.cancel_booking(p_booking_id uuid, p_as_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking record;
  v_is_authorized boolean;
begin
  select * into v_booking from public.bookings where id = p_booking_id;

  if v_booking is null then
    raise exception 'Rezervasyon bulunamadı';
  end if;

  if v_booking.status <> 'scheduled' then
    raise exception 'Bu rezervasyon zaten iptal edilmiş veya tamamlanmış';
  end if;

  if p_as_role = 'instructor' then
    v_is_authorized := v_booking.instructor_id = auth.uid();
  elsif p_as_role = 'student' then
    v_is_authorized := v_booking.student_id = auth.uid() or public.is_guardian_of(v_booking.student_id);
  else
    v_is_authorized := false;
  end if;

  if not v_is_authorized then
    raise exception 'Bu rezervasyonu iptal etme yetkin yok';
  end if;

  update public.bookings
  set status = 'cancelled',
      cancelled_by = case when p_as_role = 'instructor' then 'instructor'::user_role else 'student'::user_role end
  where id = p_booking_id;
end;
$$;

revoke all on function public.cancel_booking from public;
grant execute on function public.cancel_booking to authenticated;
