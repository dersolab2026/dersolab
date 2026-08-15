-- Ogrenci rezervasyon olustururken istege bagli konu notu birakabilsin, egitmen derse hazirlikli gelsin.

alter table public.bookings add column topic_note text;
