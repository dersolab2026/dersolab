-- Kullanım şartı kabulü, kullanıcı tarafından güncellenebilir profil alanlarından
-- ayrı tutulur. Kaydı yalnızca sunucu / auth trigger'ı oluşturabilir.
create table public.terms_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  terms_version text not null,
  accepted_at timestamptz not null default now(),
  acceptance_source text not null check (acceptance_source in ('email_signup', 'oauth', 'renewal')),
  unique (user_id, terms_version)
);

alter table public.terms_acceptances enable row level security;

revoke all on table public.terms_acceptances from anon, authenticated;
grant select on table public.terms_acceptances to authenticated;

create policy "terms_acceptances_select_own"
  on public.terms_acceptances
  for select
  to authenticated
  using (user_id = (select auth.uid()));

-- Kayit formu "Mezun" icin 13 degerini gonderiyor; bu deger veritabaninda da
-- gecerlidir. Diger degerler yeni kullanici trigger'inda guvenli bicimde yok sayilir.
alter table public.students drop constraint if exists students_grade_check;
alter table public.students add constraint students_grade_check check (grade between 5 and 13);

-- raw_user_meta_data kullanici tarafindan degistirilebilir. Bu nedenle yalnizca
-- kayda izin verilen roller secilir; admin rolu asla signup verisinden gelmez.
-- E-posta kaydinda kabul sunucu aksiyonu tarafindan dogrulanir. OAuth kullanicilari
-- ilk dashboard girisinde onay sayfasina yonlendirilir.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_role user_role;
  v_requested_role text;
  v_referrer_id uuid;
  v_new_code text;
  v_grade smallint;
  v_track student_track;
begin
  v_requested_role := new.raw_user_meta_data->>'role';
  v_role := case
    when v_requested_role in ('student', 'instructor') then v_requested_role::user_role
    else 'student'
  end;

  if (new.raw_user_meta_data->>'grade') ~ '^(?:[5-9]|1[0-3])$' then
    v_grade := (new.raw_user_meta_data->>'grade')::smallint;
  end if;

  if (new.raw_user_meta_data->>'track') in ('sayisal', 'sozel', 'ea', 'dil') then
    v_track := (new.raw_user_meta_data->>'track')::student_track;
  end if;

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
      case when new.raw_user_meta_data->>'grade_track' = 'lgs' then 'lgs'::grade_track else 'yks'::grade_track end,
      nullif(left(new.raw_user_meta_data->>'school_name', 120), ''),
      v_grade,
      v_track,
      v_new_code,
      v_referrer_id
    );
  elsif v_role = 'instructor' then
    insert into public.instructors (user_id)
    values (new.id);
  end if;

  if new.raw_user_meta_data->>'terms_version' = '2026-08-07' then
    insert into public.terms_acceptances (user_id, terms_version, acceptance_source)
    values (new.id, '2026-08-07', 'email_signup')
    on conflict (user_id, terms_version) do nothing;
  end if;

  return new;
end;
$$;

-- Trigger fonksiyonlari HTTP/RPC uzerinden cagrilamaz; yalnizca kendi
-- tetikleyicileri araciligiyla calisir.
revoke execute on function public.check_demo_lesson_request_eligibility() from public;
revoke execute on function public.deduct_credit_on_booking() from public;
revoke execute on function public.deduct_credits_on_refund() from public;
revoke execute on function public.grant_credits_on_purchase() from public;
revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_user_email_confirmed() from public;
revoke execute on function public.mark_free_coaching_used() from public;
revoke execute on function public.mark_homework_submitted() from public;
revoke execute on function public.prevent_booking_field_tamper() from public;
revoke execute on function public.prevent_instructor_self_approval() from public;
revoke execute on function public.prevent_role_change() from public;
revoke execute on function public.refund_credit_on_cancel() from public;

-- RPC ile yalnizca giris yapmis kullanicilarin ihtiyaci olan yardimci
-- fonksiyonlara erisimi sinirla.
revoke execute on function public.can_view_student(uuid) from public;
grant execute on function public.can_view_student(uuid) to authenticated;

revoke execute on function public.cancel_booking(uuid, text) from public;
grant execute on function public.cancel_booking(uuid, text) to authenticated;

revoke execute on function public.is_coach(uuid) from public;
grant execute on function public.is_coach(uuid) to authenticated;

revoke execute on function public.upsert_instructor_calendar_credentials(text, text, timestamptz) from public;
grant execute on function public.upsert_instructor_calendar_credentials(text, text, timestamptz) to authenticated;

-- RLS politikalarinda kullanilan is_admin fonksiyonunun arama yolu sabittir.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.users
    where id = (select auth.uid()) and role = 'admin'
  );
$$;
