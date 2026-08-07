-- Her ogrenci, tum platformda toplamda bir kere ucretsiz tanisma dersi alabilir.
-- Egitmen bu dersi ucretsiz verir, kredi dusulmez.

alter table public.bookings add column is_trial boolean not null default false;
alter table public.students add column free_trial_used boolean not null default false;

alter table public.bookings drop constraint bookings_credits_used_check;
alter table public.bookings add constraint bookings_credits_used_check check (credits_used >= 0);

create or replace function public.deduct_credit_on_booking()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  current_balance integer;
  trial_already_used boolean;
begin
  if new.is_trial then
    select free_trial_used into trial_already_used from public.students where user_id = new.student_id;
    if trial_already_used then
      raise exception 'Ucretsiz tanisma dersi hakki zaten kullanilmis';
    end if;
    new.credits_used := 0;
    update public.students set free_trial_used = true where user_id = new.student_id;
    return new;
  end if;

  select credit_balance into current_balance from public.students where user_id = new.student_id;
  if current_balance < new.credits_used then
    raise exception 'Yetersiz kredi bakiyesi: mevcut %, gerekli %', current_balance, new.credits_used;
  end if;
  update public.students set credit_balance = credit_balance - new.credits_used where user_id = new.student_id;
  return new;
end;
$$;
