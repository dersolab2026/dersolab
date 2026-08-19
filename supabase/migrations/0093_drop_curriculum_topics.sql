-- Konu sözlüğü ve konu takip çizelgesi kaldırıldı (ürün kararı).
--
-- 0091 uygulanmıştı, bu yüzden dosyayı silmek yerine geri alan bir migration
-- yazıldı: veritabanının geçmişi neyin ne zaman yapıldığını göstermeye devam
-- etsin.
--
-- Konu verisi hiç yüklenmedi, bu yüzden veri kaybı yok.

alter table public.student_study_logs drop column if exists topic_id;
alter table public.homework drop column if exists topic_id;

drop table if exists public.student_topic_status;
drop table if exists public.curriculum_topics;
