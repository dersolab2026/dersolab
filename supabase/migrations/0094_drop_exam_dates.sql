-- Sınav geri sayımı kaldırıldı (ürün kararı).
--
-- 0089 uygulanmıştı; dosyayı silmek yerine geri alan bir migration yazıldı ki
-- veritabanı geçmişi neyin ne zaman yapıldığını göstermeye devam etsin.
--
-- students.target_exam_date kolonu BIRAKILIYOR: hedef panelinin parçası ve
-- ileride hedef çizgisinin projeksiyonunda kullanılabilir. Şu an hiçbir yerde
-- gösterilmiyor, girişi de kaldırıldı; boş kalacak.

drop table if exists public.exam_dates;
