-- Koçluk formu serbest metinden çoktan seçmeliye geçiyor.
--
-- Sebep: alanlar pratikte boş kalıyordu. Öğrenci paragraf yazmak yerine
-- seçenek tıklamak istiyor. Artık formun tamamı hiç yazı yazmadan
-- doldurulabiliyor.
--
-- Kolonlar text -> text[] oluyor. Cevaplar ETİKET değil ANAHTAR olarak
-- saklanıyor (ör. 'soru_bankasi'); etiket metni src/lib/coaching/
-- intake-options.ts içinde duruyor, ileride metin değişse eski kayıtlar
-- bozulmuyor.
--
-- VERİ KAYBI YOK: mevcut serbest metin cevaplar tek elemanlı diziye
-- taşınıyor. Bu değerler katalogdaki anahtarlarla eşleşmeyecek, o yüzden
-- arayüz onları olduğu gibi metin olarak gösteriyor (etiketle() katalogda
-- bulamadığını aynen döndürüyor).
--
-- notes ve who_wanted DEĞİŞMİYOR: who_wanted zaten seçmeliydi, notes ise
-- bilinçli olarak serbest kalıyor — "eklemek istediğin başka bir şey"
-- sorusunun seçenek listesi olamaz ve zaten isteğe bağlı.

alter table public.student_intake_forms
  alter column goal type text[]
    using (case when goal is null then null::text[] else array[goal] end),

  alter column hard_subjects type text[]
    using (case when hard_subjects is null then null::text[] else array[hard_subjects] end),

  alter column daily_routine type text[]
    using (case when daily_routine is null then null::text[] else array[daily_routine] end),

  alter column tried_methods type text[]
    using (case when tried_methods is null then null::text[] else array[tried_methods] end),

  alter column study_environment type text[]
    using (case when study_environment is null then null::text[] else array[study_environment] end);
