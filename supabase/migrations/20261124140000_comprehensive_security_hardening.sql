-- ============================================================================
-- DERSOLAB — KAPSAMLI GÜVENLİK SIKILAŞTIRMASI (2026-11-24)
-- ============================================================================
-- Kapatılan açıklar:
-- 1. [CRIT-01] public.students üzerinde credit_balance / free_trial_used doğrudan
--              istemci (PostgREST) güncelleme engeli (trigger + session GUC).
-- 2. [CRIT-02] public.bookings üzerinde credits_used = 0 (ücretsiz paralı ders)
--              açığının kapatılması ve FOR UPDATE satır kilidi ile yarış koruması.
-- 3. [CRIT-03] public.package_purchases üzerinde istemciden gelen sahte
--              credits_granted değerinin her zaman packages tablosundan zorlanması.
-- 4. [MED-01]  student_ai_questions RLS politikasındaki var olmayan public.guardians
--              referansının düzeltilmesi.
-- 5. [MED-02]  public.users (email, deleted_at) ve public.instructors
--              (lesson_price, calendar_connected) kolon koruma genişletmeleri.
-- 6. [MED-03]  Gelecekteki derslerin erken completed / no_show işaretlenmesinin
--              veritabanı düzeyinde engellenmesi.
-- 7. [LOW-02]  egitmen_dolu_araliklar aralık sınırı (35 gün), instructor_education
--              yalnızca onaylı eğitmen görünürlüğü, study_resources onaylı eğitmen
--              şartı ve storage silme politikaları.
-- ============================================================================

-- 1) STUDENTS HASSAS KOLON KORUMASI
create or replace function public.prevent_student_sensitive_tamper()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(auth.role(), '') = 'service_role'
     or coalesce(current_setting('dersolab.internal_credit_op', true), '') = '1'
     or public.is_admin()
  then
    return new;
  end if;

  if new.user_id is distinct from old.user_id then
    raise exception 'Ogrenci kimligi degistirilemez';
  end if;

  if new.credit_balance is distinct from old.credit_balance then
    raise exception 'Kredi bakiyesi dogrudan degistirilemez';
  end if;

  if new.free_trial_used is distinct from old.free_trial_used then
    raise exception 'Ucretsiz tanisma dersi hakki dogrudan degistirilemez';
  end if;

  return new;
end;
$$;

revoke execute on function public.prevent_student_sensitive_tamper() from public;

drop trigger if exists trg_prevent_student_sensitive_tamper on public.students;
create trigger trg_prevent_student_sensitive_tamper
  before update on public.students
  for each row execute function public.prevent_student_sensitive_tamper();

-- 2) BOOKINGS KREDİ DÜŞME & TANITIM DERSİ YARIŞ KORUMASI
alter table public.bookings drop constraint if exists bookings_credits_used_check;
alter table public.bookings
  add constraint bookings_credits_used_check
  check ((is_trial = true and credits_used = 0) or (is_trial = false and credits_used > 0)) not valid;

create or replace function public.deduct_credit_on_booking()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_balance integer;
  trial_already_used boolean;
  egitmen_uygun boolean;
  egitmen_tanisma_veriyor boolean;
begin
  -- Eğitmenin onaylı ve aktif olduğunu doğrula
  select (i.approval_status = 'approved' and coalesce(i.paused, false) = false),
         coalesce(i.offers_free_trial, false)
  into egitmen_uygun, egitmen_tanisma_veriyor
  from public.instructors i
  join public.users u on u.id = i.user_id
  where i.user_id = new.instructor_id
    and u.deleted_at is null;

  if egitmen_uygun is not true then
    raise exception 'Secilen egitmen su anda ders kabul etmiyor';
  end if;

  -- Öğrenci satırını kilitle (eşzamanlı çift tanışma dersi / eksi bakiye yarışını önler)
  select s.credit_balance, s.free_trial_used
  into current_balance, trial_already_used
  from public.students s
  where s.user_id = new.student_id
  for update;

  if current_balance is null then
    raise exception 'Ogrenci kaydi bulunamadi';
  end if;

  if new.is_trial then
    if egitmen_tanisma_veriyor is not true then
      raise exception 'Bu egitmen ucretsiz tanisma dersi vermiyor';
    end if;

    if trial_already_used then
      raise exception 'Ucretsiz tanisma dersi hakki zaten kullanilmis';
    end if;

    new.credits_used := 0;
    perform set_config('dersolab.internal_credit_op', '1', true);
    update public.students set free_trial_used = true where user_id = new.student_id;
    perform set_config('dersolab.internal_credit_op', '0', true);
    return new;
  end if;

  -- Normal (ücretli) derslerde istemciden gelen 0 veya negatif değeri ez, her zaman 1 kredi kes
  new.credits_used := 1;

  if current_balance < new.credits_used then
    raise exception 'Yetersiz kredi bakiyesi: mevcut %, gerekli %', current_balance, new.credits_used;
  end if;

  perform set_config('dersolab.internal_credit_op', '1', true);
  update public.students
  set credit_balance = credit_balance - new.credits_used
  where user_id = new.student_id;
  perform set_config('dersolab.internal_credit_op', '0', true);

  return new;
end;
$$;

revoke execute on function public.deduct_credit_on_booking() from public;

-- İptal iadesi tetikleyicisini de dahili kredi bayrağıyla uyumlu hale getir
create or replace function public.refund_credit_on_cancel()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'cancelled' and old.status <> 'cancelled' then
    if new.cancelled_by in ('instructor', 'admin')
       or (old.start_time - now() >= interval '24 hours') then
      if old.credits_used > 0 then
        perform set_config('dersolab.internal_credit_op', '1', true);
        update public.students
        set credit_balance = credit_balance + old.credits_used
        where user_id = old.student_id;
        perform set_config('dersolab.internal_credit_op', '0', true);
      end if;
      new.credit_refunded := true;
    else
      new.credit_refunded := false;
    end if;
  end if;
  return new;
end;
$$;

revoke execute on function public.refund_credit_on_cancel() from public;

-- 3) PACKAGE_PURCHASES KREDİ MİKTARI DOĞRULAMASI VE KREDİ YÜKLEME GÜVENLİĞİ
create or replace function public.enforce_package_purchase_integrity()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_credits integer;
  v_price numeric;
begin
  select p.credit_amount, p.price
  into v_credits, v_price
  from public.packages p
  where p.id = new.package_id;

  if v_credits is null then
    raise exception 'Gecersiz paket secimi';
  end if;

  -- İstemciden (veli/öğrenci pending satırı) gelen credits_granted değerine ASLA güvenme;
  -- her zaman paketin veritabanındaki gerçek kredi adedini yaz.
  new.credits_granted := v_credits;

  if coalesce(auth.role(), '') <> 'service_role' and not public.is_admin() then
    new.amount_paid := v_price;
    if tg_op = 'INSERT' and new.status <> 'pending' then
      raise exception 'Satin alma yalnizca bekleyen (pending) durumunda baslatilabilir';
    end if;
  end if;

  return new;
end;
$$;

revoke execute on function public.enforce_package_purchase_integrity() from public;

drop trigger if exists trg_enforce_package_purchase_integrity on public.package_purchases;
create trigger trg_enforce_package_purchase_integrity
  before insert or update on public.package_purchases
  for each row execute function public.enforce_package_purchase_integrity();

create or replace function public.grant_credits_on_purchase()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.status = 'completed' and (old is null or old.status is distinct from 'completed') then
    perform set_config('dersolab.internal_credit_op', '1', true);
    update public.students
    set credit_balance = credit_balance + new.credits_granted
    where user_id = new.student_id;
    perform set_config('dersolab.internal_credit_op', '0', true);
  end if;
  return new;
end;
$$;

revoke execute on function public.grant_credits_on_purchase() from public;

-- 4) USERS VE INSTRUCTORS EK KOLON KORUMALARI
create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    if new.role is distinct from old.role then
      raise exception 'Rol degisikligi bu yontemle yapilamaz';
    end if;
    if new.role_confirmed is distinct from old.role_confirmed then
      raise exception 'Hesap turu onayi bu yontemle degistirilemez';
    end if;
    if new.email is distinct from old.email then
      raise exception 'E-posta adresi dogrudan degistirilemez';
    end if;
    if new.deleted_at is distinct from old.deleted_at then
      raise exception 'Hesap silinme durumu dogrudan degistirilemez';
    end if;
  end if;
  return new;
end;
$$;

revoke execute on function public.prevent_role_change() from public;

create or replace function public.prevent_instructor_self_approval()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(auth.role(), '') = 'service_role' or public.is_admin() then
    return new;
  end if;

  if new.lesson_price is distinct from old.lesson_price
     or new.calendar_connected is distinct from old.calendar_connected
  then
    raise exception 'Bu alanlar dogrudan degistirilemez';
  end if;

  if old.approval_status = 'rejected' and new.approval_status = 'pending'
     and new.approval_note is null and new.reviewed_at is null and new.reviewed_by is null
     and new.offers_free_trial is not distinct from old.offers_free_trial
  then
    return new;
  end if;

  if new.approval_status is distinct from old.approval_status
     or new.approval_note is distinct from old.approval_note
     or new.reviewed_at is distinct from old.reviewed_at
     or new.reviewed_by is distinct from old.reviewed_by
     or new.offers_free_trial is distinct from old.offers_free_trial
  then
    raise exception 'Bu alanlar sadece yonetici tarafindan degistirilebilir';
  end if;

  return new;
end;
$$;

revoke execute on function public.prevent_instructor_self_approval() from public;

-- 5) BOOKINGS ALAN VE ZAMAN KORUMASI (GELECEK DERSİ ERKEN BİTİRME ENGELİ)
create or replace function public.prevent_booking_field_tamper()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(auth.role(), '') = 'service_role' or public.is_admin() then
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

  if new.status in ('completed', 'no_show') and old.start_time > now() then
    raise exception 'Henuz baslamamis bir ders tamamlandi veya katilmadi olarak isaretlenemez';
  end if;

  return new;
end;
$$;

revoke execute on function public.prevent_booking_field_tamper() from public;

-- 6) STUDENT_AI_QUESTIONS KIRIK GUARDIANS POLİTİKASI DÜZELTMESİ
do $$
begin
  if to_regclass('public.student_ai_questions') is not null then
    execute 'drop policy if exists "ai_questions_select_own_or_authorized" on public.student_ai_questions';
    execute $pol$
      create policy "ai_questions_select_own_or_authorized" on public.student_ai_questions
        for select using (
          student_id = (select auth.uid())
          or public.can_view_student(student_id)
          or public.is_guardian_of(student_id)
          or public.is_admin()
        )
    $pol$;
  end if;
end;
$$;

-- 7) DOLU ARALIK SORGUSU ARALIK SINIRI, EĞİTİM GÖRÜNÜRLÜĞÜ & KAYNAK EKLEME ŞARTI
create or replace function public.egitmen_dolu_araliklar(
  p_instructor_id uuid,
  p_bas timestamptz,
  p_bit timestamptz
)
returns table (start_time timestamptz, end_time timestamptz)
language plpgsql
stable
security definer
set search_path = ''
as $$
begin
  if p_bit <= p_bas or (p_bit - p_bas) > interval '35 days' then
    raise exception 'Gecersiz tarih araligi (en fazla 35 gun sorgulanabilir)';
  end if;

  return query
    select b.start_time, b.end_time
    from public.bookings b
    where b.instructor_id = p_instructor_id
      and b.status = 'scheduled'
      and b.start_time < p_bit
      and b.end_time > p_bas
    order by b.start_time;
end;
$$;

revoke execute on function public.egitmen_dolu_araliklar(uuid, timestamptz, timestamptz) from public;
grant execute on function public.egitmen_dolu_araliklar(uuid, timestamptz, timestamptz) to authenticated, anon;

drop policy if exists "instructor_education_public_select" on public.instructor_education;
create policy "instructor_education_public_select" on public.instructor_education
  for select using (
    instructor_id = (select auth.uid())
    or public.is_admin()
    or exists (
      select 1 from public.instructors i
      where i.user_id = instructor_education.instructor_id
        and i.approval_status = 'approved'
        and coalesce(i.paused, false) = false
    )
  );

do $$
begin
  if to_regclass('public.study_resources') is not null then
    execute 'drop policy if exists "resources_insert_instructor" on public.study_resources';
    execute $pol$
      create policy "resources_insert_instructor" on public.study_resources
        for insert to authenticated
        with check (
          public.is_admin()
          or exists (
            select 1 from public.instructors i
            where i.user_id = (select auth.uid())
              and i.approval_status = 'approved'
          )
        )
    $pol$;
  end if;
end;
$$;

-- Storage nesneleri için sahip silme politikaları
drop policy if exists "avatar_owner_delete" on storage.objects;
create policy "avatar_owner_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

drop policy if exists "instructor_video_owner_delete" on storage.objects;
create policy "instructor_video_owner_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'instructor-videos' and (storage.foldername(name))[1] = (select auth.uid())::text);
