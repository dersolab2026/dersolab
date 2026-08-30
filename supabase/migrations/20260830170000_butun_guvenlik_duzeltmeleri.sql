-- ============================================================
-- DERSOLAB — TÜM GÜVENLİK VE VERİTABANI DÜZELTMELERİ (MASTER MIGRATION)
-- ============================================================
-- Bu dosya platformdaki bilinen tüm veritabanı açıklarını ve eksik
-- kuralları tek seferde uygular. Baştan sona tek tıkla çalıştırılabilir.
-- ============================================================

-- 1) ÜCRETSİZ TANITIM DERSİ KORUMASI (TRIGGER)
create or replace function public.deduct_credit_on_booking()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  current_balance integer;
  trial_already_used boolean;
  egitmen_veriyor boolean;
begin
  if new.is_trial then
    -- Eğitmen tanışma dersi vermeyi kabul etmiş olmalı.
    select i.offers_free_trial into egitmen_veriyor
    from public.instructors i
    where i.user_id = new.instructor_id;

    if egitmen_veriyor is not true then
      raise exception 'Bu egitmen ucretsiz tanisma dersi vermiyor';
    end if;

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

revoke execute on function public.deduct_credit_on_booking() from public;

-- 2) YABANCI EĞİTMENİN ÖĞRENCİ EKRANINA YAZMASINI ENGELLEME (RLS)
drop policy if exists "plan_items_insert_coach" on public.coaching_plan_items;
create policy "plan_items_insert_coach" on public.coaching_plan_items
  for insert to authenticated
  with check (
    coach_id = (select auth.uid())
    and public.is_coach((select auth.uid()))
    and public.can_view_student(student_id)
  );

drop policy if exists "session_notes_insert_coach" on public.coaching_session_notes;
create policy "session_notes_insert_coach" on public.coaching_session_notes
  for insert to authenticated
  with check (
    coach_id = (select auth.uid())
    and public.can_view_student(student_id)
  );

drop policy if exists "homework_insert_instructor" on public.homework;
create policy "homework_insert_instructor" on public.homework
  for insert
  with check (
    public.is_admin()
    or (instructor_id = (select auth.uid()) and public.can_view_student(student_id))
  );

-- 3) BAŞLAMIŞ DERS İPTALİ VE YARIŞ DURUMU (RACE CONDITION) ENGELLEYİCİ
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
  select * into v_booking from public.bookings where id = p_booking_id for update;

  if v_booking is null then
    raise exception 'Rezervasyon bulunamadı';
  end if;

  if v_booking.status <> 'scheduled' then
    raise exception 'Bu rezervasyon zaten iptal edilmiş veya tamamlanmış';
  end if;

  if v_booking.start_time <= now() then
    raise exception 'Başlamış bir ders iptal edilemez';
  end if;

  if p_as_role = 'instructor' then
    v_is_authorized := v_booking.instructor_id = auth.uid();
  elsif p_as_role = 'student' then
    v_is_authorized := v_booking.student_id = auth.uid();
  else
    v_is_authorized := false;
  end if;

  if not v_is_authorized then
    raise exception 'Bu rezervasyonu iptal etme yetkin yok';
  end if;

  update public.bookings
  set status = 'cancelled',
      cancelled_by = p_as_role::user_role,
      cancelled_at = now()
  where id = p_booking_id;
end;
$$;

revoke execute on function public.cancel_booking(uuid, text) from public;
grant execute on function public.cancel_booking(uuid, text) to authenticated;

-- 4) KAPANMIŞ REZERVASYONUN DURUMUNU KORUMA (TAMPER TRIGGER)
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

  if old.status in ('cancelled', 'completed', 'no_show')
     and new.status is distinct from old.status
  then
    raise exception 'Kapanmis bir rezervasyonun durumu degistirilemez';
  end if;

  return new;
end;
$$;

revoke execute on function public.prevent_booking_field_tamper() from public;

-- 5) DOLU SAATLERİ GİZLİLİĞİ KORUYARAK DÖNEN FONKSİYON
create or replace function public.egitmen_dolu_araliklar(
  p_instructor_id uuid,
  p_bas timestamptz,
  p_bit timestamptz
)
returns table (start_time timestamptz, end_time timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select b.start_time, b.end_time
  from public.bookings b
  where b.instructor_id = p_instructor_id
    and b.status = 'scheduled'
    and b.start_time < p_bit
    and b.end_time > p_bas
  order by b.start_time;
$$;

revoke execute on function public.egitmen_dolu_araliklar(uuid, timestamptz, timestamptz) from public;
grant execute on function public.egitmen_dolu_araliklar(uuid, timestamptz, timestamptz) to authenticated, anon;

-- 6) VELİLERİN ÇOCUKLARINA DERS REZERVASYONU AÇABİLMESİ (RLS)
drop policy if exists "bookings_insert" on public.bookings;
create policy "bookings_insert" on public.bookings
  for insert with check (
    student_id = auth.uid()
    or public.is_guardian_of(student_id)
    or public.is_admin()
  );

-- 7) KOÇLUK DAVET KODLARINI İZOLE ETME (VERİ SIZINTISINI ENGELLEME)
create table if not exists public.instructor_coach_codes (
  user_id uuid primary key references public.instructors(user_id) on delete cascade,
  coach_invite_code text unique,
  created_at timestamptz not null default now()
);

-- Mevcut kodları aktar (varsa)
insert into public.instructor_coach_codes (user_id, coach_invite_code)
select user_id, coach_invite_code
from public.instructors
where coach_invite_code is not null
on conflict (user_id) do update set coach_invite_code = excluded.coach_invite_code;

alter table public.instructor_coach_codes enable row level security;

drop policy if exists "coach_codes_select_own" on public.instructor_coach_codes;
create policy "coach_codes_select_own" on public.instructor_coach_codes
  for select using (user_id = auth.uid() or public.is_admin());

drop policy if exists "coach_codes_insert_own" on public.instructor_coach_codes;
create policy "coach_codes_insert_own" on public.instructor_coach_codes
  for insert with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "coach_codes_update_own" on public.instructor_coach_codes;
create policy "coach_codes_update_own" on public.instructor_coach_codes
  for update using (user_id = auth.uid() or public.is_admin());

-- instructors tablosundaki sızıntı kaynağı kolonu düşür
alter table public.instructors drop column if exists coach_invite_code;

-- 8) INSTRUCTORS TABLOSU RLS SIKILAŞTIRMASI (YALNIZCA ONAYLI EĞİTMENLER GÖRÜNSÜN)
drop policy if exists "instructors_public_select" on public.instructors;
drop policy if exists "instructors_select_approved" on public.instructors;
drop policy if exists "instructors_select_own" on public.instructors;
drop policy if exists "instructors_select_admin" on public.instructors;

create policy "instructors_select_approved" on public.instructors
  for select using (approval_status = 'approved' and paused = false);

create policy "instructors_select_own" on public.instructors
  for select using (user_id = auth.uid());

create policy "instructors_select_admin" on public.instructors
  for select using (public.is_admin());
