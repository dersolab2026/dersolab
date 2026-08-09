alter table public.tercih_listeleri
  alter column sender_id drop not null,
  alter column recipient_id drop not null,
  add column recipient_email text;
