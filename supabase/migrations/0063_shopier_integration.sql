alter table public.packages
  add column shopier_product_id text,
  add column shopier_product_url text;

-- Shopier webhook'u aynı siparişi birden fazla kez gönderebilir (retry);
-- aynı payment_reference ile ikinci kez kredi verilmesini engeller.
create unique index package_purchases_provider_reference_unique
  on public.package_purchases (payment_provider, payment_reference)
  where payment_reference is not null;

-- Shopier'in tek ürün-linki modelinde alıcı e-postasını DersoLab hesabına
-- otomatik eşleştiremediğimiz (veya velinin birden fazla çocuğu olduğu için
-- hangi öğrenciye kredi verileceğini bilemediğimiz) ödemeler burada bekler,
-- admin elle bir öğrenciye bağlar.
create table public.shopier_unmatched_payments (
  id uuid primary key default gen_random_uuid(),
  shopier_order_id text not null unique,
  shopier_product_id text,
  package_id uuid references public.packages(id),
  buyer_email text,
  buyer_name text,
  amount numeric(10,2),
  note text,
  reason text not null,
  status text not null default 'pending' check (status in ('pending', 'resolved')),
  resolved_student_id uuid references public.users(id),
  resolved_purchase_id uuid references public.package_purchases(id),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

alter table public.shopier_unmatched_payments enable row level security;

create policy "shopier_unmatched_payments_admin_manage" on public.shopier_unmatched_payments
  for all using (public.is_admin()) with check (public.is_admin());
