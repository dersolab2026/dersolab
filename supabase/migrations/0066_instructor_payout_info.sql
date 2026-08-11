-- Egitmenlerin odeme (IBAN) bilgilerini kendi panellerinden girip
-- guncelleyebilmesi, admin'in de muhasebe bolumunden gorebilmesi icin.

alter table public.instructors
  add column payout_name text,
  add column payout_iban text,
  add column payout_updated_at timestamptz;
