-- cancel_booking'in yazdığı cancelled_at kolonu hiç oluşturulmamıştı.
--
-- 20260830170000 (master) içindeki cancel_booking şunu yazıyor:
--     update public.bookings
--     set status = 'cancelled',
--         cancelled_by = p_as_role::user_role,
--         cancelled_at = now()
--
-- Ama `cancelled_at` hiçbir migration'da tanımlı değil. 0017 yalnızca
-- `cancelled_by` kolonunu eklemişti.
--
-- NEDEN SESSİZ KALDI: plpgsql fonksiyon gövdeleri oluşturulurken yalnızca
-- sözdizimi denetleniyor; içindeki SQL'in kolon adları çalışma anında
-- çözülüyor. Yani master migration büyük olasılıkla hatasız uygulanır ve
-- sorun İLK DERS İPTALİNDE ortaya çıkar:
--     column "cancelled_at" of relation "bookings" does not exist
-- Bu noktada öğrenci de eğitmen de hiçbir dersi iptal edemez.
--
-- İki çözüm vardı: satırı fonksiyondan silmek ya da kolonu eklemek.
-- Kolon ekleniyor, çünkü iptal zaman damgası gerçekten işe yarıyor:
-- "24 saatten az kala mı iptal edildi" sorusu bugün start_time üzerinden
-- dolaylı hesaplanıyor, iade denetimi için kaydın kendisi daha sağlam.
--
-- Sıra önemli değil: bu dosya master'dan önce de sonra da çalıştırılabilir,
-- çünkü kolon eksikliği yalnızca çalışma anında sorun oluyor. Ama master'ı
-- ÇALIŞTIRDIYSANIZ bunu HEMEN çalıştırın — iptal akışı şu an kırık.

alter table public.bookings
  add column if not exists cancelled_at timestamptz;

-- Not: aciklama metninde noktali virgul YOK. Postgres icin sorun olmazdi
-- ama ifadeleri noktali virgulden bolen migration araclari bu satiri
-- ortasindan kesip iki gecersiz parcaya cevirebiliyor.
comment on column public.bookings.cancelled_at is
  'Iptal zamani. cancel_booking() yaziyor. Kredi iade kurali (0017) start_time - now() farkina bakiyor, bu kolon denetim izi icin.';

-- Doğrulama:
--   select column_name from information_schema.columns
--   where table_name = 'bookings' and column_name in ('cancelled_by','cancelled_at');
--   -- iki satır dönmeli
