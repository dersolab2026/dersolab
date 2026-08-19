-- Sınav tarihleri ve herkese açık geri sayım.
--
-- Tarihler KODA GÖMÜLMÜYOR: ÖSYM 2027 takvimini henüz açıklamadı (2026'nın
-- son çeyreğinde bekleniyor) ve açıklandığında kod değişikliği + deploy
-- gerektirmemeli. Tablo admin tarafından güncellenebiliyor.
--
-- is_official alanı önemli: resmî olmayan tarihler arayüzde "tahmini" diye
-- işaretleniyor. Rakip araştırmasında görüldü ki uydurma/eskimiş sayılar
-- yakalandığı anda bütün güveni götürüyor.

create table if not exists public.exam_dates (
  id uuid primary key default gen_random_uuid(),
  exam_type text not null,
  -- "2027" gibi; ayni sinav turunun farkli yillari yan yana durabilsin.
  label text not null,
  exam_date date not null,
  is_official boolean not null default false,
  -- Herkese acik sayfada gosterilsin mi.
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create unique index if not exists exam_dates_tur_etiket
  on public.exam_dates (exam_type, label);

alter table public.exam_dates enable row level security;

-- Herkese acik: geri sayim sayfalari giris gerektirmiyor.
create policy "exam_dates_public_select" on public.exam_dates
  for select using (true);

create policy "exam_dates_admin_write" on public.exam_dates
  for all using (public.is_admin()) with check (public.is_admin());

-- Baslangic verisi: hepsi TAHMINI olarak isaretli. ÖSYM/MEB resmi takvimi
-- açıkladığında exam_date güncellenip is_official true yapılmalı.
insert into public.exam_dates (exam_type, label, exam_date, is_official)
values
  ('tyt',  '2027', '2027-06-19', false),
  ('ayt',  '2027', '2027-06-20', false),
  ('ydt',  '2027', '2027-06-20', false),
  ('lgs',  '2027', '2027-06-13', false)
on conflict (exam_type, label) do nothing;
