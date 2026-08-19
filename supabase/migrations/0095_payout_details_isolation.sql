-- GÜVENLİK: eğitmen IBAN'ları herkese açıktı.
--
-- Postgres'te RLS SATIR düzeyinde çalışıyor, sütun düzeyinde değil.
-- instructors tablosunda pazar yeri için açık bir okuma politikası var
-- (eğitmen profilleri giriş yapmadan görülebilsin diye). Satır görünür
-- olunca BÜTÜN sütunlar geliyor — payout_iban ve payout_name dahil.
--
-- Doğrulandı: giriş yapmamış bir ziyaretçi
--   select payout_iban from instructors
-- sorgusuyla kayıtlı tüm IBAN'ları okuyabiliyordu.
--
-- Çözüm sütun izni değil, ayrı tablo: eğitmenin kendi IBAN'ını görmesi
-- gerekiyor, dolayısıyla kolonu tamamen kısıtlayamayız. Ödeme bilgisi
-- kendi RLS'i olan ayrı bir tabloya taşınıyor.

create table if not exists public.instructor_payout_details (
  user_id uuid primary key references public.instructors(user_id) on delete cascade,
  payout_name text,
  payout_iban text,
  payout_updated_at timestamptz,
  created_at timestamptz not null default now()
);

-- Mevcut veriyi taşı (kolonlar düşürülmeden önce).
insert into public.instructor_payout_details (user_id, payout_name, payout_iban, payout_updated_at)
select user_id, payout_name, payout_iban, payout_updated_at
from public.instructors
where payout_name is not null or payout_iban is not null
on conflict (user_id) do nothing;

alter table public.instructor_payout_details enable row level security;

-- Yalnızca eğitmenin kendisi ve admin. Pazar yeri bu tabloya hiç bakmıyor.
create policy "payout_select_own" on public.instructor_payout_details
  for select using (user_id = (select auth.uid()) or public.is_admin());

create policy "payout_insert_own" on public.instructor_payout_details
  for insert with check (user_id = (select auth.uid()));

create policy "payout_update_own" on public.instructor_payout_details
  for update using (user_id = (select auth.uid()));

-- Sızıntının kaynağını kaldır.
alter table public.instructors
  drop column if exists payout_name,
  drop column if exists payout_iban,
  drop column if exists payout_updated_at;
