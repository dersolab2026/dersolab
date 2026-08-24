-- İki özellik ürün kararıyla kaldırılıyor:
--   1) 1 haftalık ücretsiz koçluk (0081)
--   2) Arkadaşını davet et / referans ödülü (0076)
--
-- Her ikisi de "geri alma" migration'ı olarak yazıldı; orijinal dosyalar
-- silinmiyor ki veritabanı geçmişi dürüst kalsın.
--
-- ÖNEMLİ: public.is_coach() KALDIRILMIYOR. O fonksiyon ücretli koçluk
-- sisteminin (0084/0085) politikalarında kullanılıyor; buradaki ücretsiz
-- koçluk haftasıyla aynı şey değil.

-- ============================================================
-- 1) ÜCRETSİZ KOÇLUK HAFTASI (0081 geri alınıyor)
-- ============================================================

-- Hak kullanıldı işaretini koyan tetikleyici artık gereksiz.
drop trigger if exists on_coaching_request_assigned on public.demo_lesson_requests;
drop function if exists public.mark_free_coaching_used();

-- Uygunluk kontrolü yalnızca tanışma dersini biliyor.
create or replace function public.check_demo_lesson_request_eligibility()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  hak_kullanildi boolean;
  bekleyen_var boolean;
begin
  select free_trial_used into hak_kullanildi from public.students where user_id = new.student_id;
  if hak_kullanildi then
    raise exception 'Ucretsiz tanisma dersi hakki zaten kullanilmis';
  end if;

  select exists(
    select 1 from public.demo_lesson_requests
    where student_id = new.student_id
      and status = 'pending'
  ) into bekleyen_var;
  if bekleyen_var then
    raise exception 'Bu ogrenci icin zaten bekleyen bir tanisma dersi talebi var';
  end if;

  return new;
end;
$$;

-- Politikalardan koçluk dalı çıkıyor: havuzu yalnızca tanışma dersi veren
-- eğitmenler görüyor ve üstleniyor.
drop policy if exists "demo_requests_select" on public.demo_lesson_requests;
create policy "demo_requests_select" on public.demo_lesson_requests
  for select using (
    requested_by = (select auth.uid())
    or student_id = (select auth.uid())
    or assigned_instructor_id = (select auth.uid())
    or public.is_admin()
    or (
      status = 'pending'
      and exists (
        select 1 from public.instructors i
        where i.user_id = (select auth.uid()) and i.offers_free_trial
      )
      and not exists (
        select 1 from public.demo_lesson_declines d
        where d.request_id = demo_lesson_requests.id and d.instructor_id = (select auth.uid())
      )
    )
  );

drop policy if exists "demo_requests_update_claim" on public.demo_lesson_requests;
create policy "demo_requests_update_claim" on public.demo_lesson_requests
  for update using (
    status = 'pending'
    and exists (
      select 1 from public.instructors i
      where i.user_id = (select auth.uid()) and i.offers_free_trial
    )
  )
  with check (assigned_instructor_id = (select auth.uid()) and status = 'assigned');

drop policy if exists "demo_declines_insert" on public.demo_lesson_declines;
create policy "demo_declines_insert" on public.demo_lesson_declines
  for insert with check (
    instructor_id = (select auth.uid())
    and exists (
      select 1 from public.instructors i
      where i.user_id = (select auth.uid()) and i.offers_free_trial
    )
  );

-- Bekleyen koçluk talepleri artık üstlenilemez; havuzda ölü kayıt kalmasın.
-- Üstlenilmiş (assigned) kayıtlar geçmiş olarak KORUNUYOR, bu yüzden
-- request_type kolonu ve check kısıtı olduğu gibi kalıyor.
delete from public.demo_lesson_requests
where request_type = 'coaching_week' and status = 'pending';

-- Hak sayacı artık kullanılmıyor.
alter table public.students drop column if exists free_coaching_used;

-- ============================================================
-- 2) REFERANS PROGRAMI (0076 geri alınıyor)
-- ============================================================

-- E-posta onayında kredi dağıtan tetikleyici ve fonksiyonu kalkıyor.
-- (Bu fonksiyon yalnızca referans ödülü için vardı, başka işi yoktu.)
drop trigger if exists on_auth_user_confirmed on auth.users;
drop function if exists public.handle_user_email_confirmed();

-- handle_new_user: 20260822161438'deki sertleştirilmiş hâli korunuyor
-- (rol beyaz listesi, grade/track doğrulaması, şart kabulü), yalnızca
-- referans kodu üretimi ve davet eden eşleştirmesi çıkarılıyor.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  v_role user_role;
  v_requested_role text;
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
    insert into public.students (user_id, grade_track, school_name, grade, track)
    values (
      new.id,
      case when new.raw_user_meta_data->>'grade_track' = 'lgs' then 'lgs'::grade_track else 'yks'::grade_track end,
      nullif(left(new.raw_user_meta_data->>'school_name', 120), ''),
      v_grade,
      v_track
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

-- Referans kolonları kalkıyor (unique kısıt kolonla birlikte düşer).
alter table public.students
  drop column if exists referral_code,
  drop column if exists referred_by,
  drop column if exists referral_reward_granted;
