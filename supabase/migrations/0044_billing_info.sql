-- iyzico odeme entegrasyonu icin gereken fatura/alici bilgileri.
-- phone zaten users tablosunda vardi, TC kimlik no ve adres bilgisi ekleniyor.

alter table public.users add column identity_number text;
alter table public.users add column address text;
alter table public.users add column city text;
