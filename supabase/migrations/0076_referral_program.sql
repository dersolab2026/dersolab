-- Basit referans/davet programi: arkadasini davet eden ogrenci ve davet edilen
-- ogrenci, davet edilen e-postasini onayladiginda birer ders kredisi kazanir.

alter table public.students
  add column referral_code text,
  add column referred_by uuid references public.students(user_id) on delete set null,
  add column referral_reward_granted boolean not null default false;

update public.students
  set referral_code = upper(substr(md5(user_id::text || clock_timestamp()::text), 1, 8))
  where referral_code is null;

alter table public.students alter column referral_code set not null;
alter table public.students add constraint students_referral_code_key unique (referral_code);

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_role user_role;
  v_referrer_id uuid;
  v_new_code text;
begin
  v_role := coalesce((new.raw_user_meta_data->>'role')::user_role, 'student');

  insert into public.users (id, role, name, email)
  values (new.id, v_role, coalesce(new.raw_user_meta_data->>'name', ''), new.email);

  if v_role = 'student' then
    if new.raw_user_meta_data->>'referral_code' is not null then
      select user_id into v_referrer_id from public.students
        where referral_code = upper(new.raw_user_meta_data->>'referral_code');
    end if;

    v_new_code := upper(substr(md5(new.id::text || clock_timestamp()::text), 1, 8));

    insert into public.students (user_id, grade_track, school_name, grade, track, referral_code, referred_by)
    values (
      new.id,
      coalesce((new.raw_user_meta_data->>'grade_track')::grade_track, 'yks'),
      nullif(new.raw_user_meta_data->>'school_name', ''),
      (new.raw_user_meta_data->>'grade')::smallint,
      (new.raw_user_meta_data->>'track')::student_track,
      v_new_code,
      v_referrer_id
    );
  elsif v_role = 'instructor' then
    insert into public.instructors (user_id)
    values (new.id);
  end if;

  return new;
end;
$$;

create or replace function public.handle_user_email_confirmed()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_referred_by uuid;
  v_already_granted boolean;
begin
  if old.email_confirmed_at is null and new.email_confirmed_at is not null then
    select referred_by, referral_reward_granted into v_referred_by, v_already_granted
      from public.students where user_id = new.id;

    if v_referred_by is not null and v_already_granted is false then
      update public.students set credit_balance = credit_balance + 1, referral_reward_granted = true
        where user_id = new.id;
      update public.students set credit_balance = credit_balance + 1
        where user_id = v_referred_by;
    end if;
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_confirmed on auth.users;
create trigger on_auth_user_confirmed
  after update on auth.users
  for each row execute function public.handle_user_email_confirmed();
