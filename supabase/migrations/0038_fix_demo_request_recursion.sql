-- demo_requests_insert politikasi kendi tablosuna (demo_lesson_requests) subquery ile
-- referans verdigi icin "infinite recursion detected in policy" hatasina yol aciyordu.
-- Bu kontrolleri RLS'ten cikarip, mevcut deduct_credit_on_booking() ornegindeki gibi
-- security definer bir trigger'a tasiyoruz.

drop policy "demo_requests_insert" on public.demo_lesson_requests;

create policy "demo_requests_insert" on public.demo_lesson_requests
  for insert with check (
    requested_by = auth.uid()
    and (student_id = auth.uid() or public.is_guardian_of(student_id))
  );

create or replace function public.check_demo_lesson_request_eligibility()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  trial_used boolean;
  pending_exists boolean;
begin
  select free_trial_used into trial_used from public.students where user_id = new.student_id;
  if trial_used then
    raise exception 'Ucretsiz tanisma dersi hakki zaten kullanilmis';
  end if;

  select exists(
    select 1 from public.demo_lesson_requests
    where student_id = new.student_id and status = 'pending'
  ) into pending_exists;
  if pending_exists then
    raise exception 'Bu ogrenci icin zaten bekleyen bir tanisma dersi talebi var';
  end if;

  return new;
end;
$$;

create trigger trg_check_demo_lesson_eligibility
  before insert on public.demo_lesson_requests
  for each row execute function public.check_demo_lesson_request_eligibility();
