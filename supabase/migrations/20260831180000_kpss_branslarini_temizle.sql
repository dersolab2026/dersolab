-- Eğitmen profillerinden KPSS branşlarını kaldırır.
--
-- Ürün kararı: site yalnızca LGS ve YKS'ye hazırlıyor. Katalogdan
-- ('KPSS Türkçe', 'KPSS Matematik') kaldırıldı, ama daha önce o branşları
-- seçmiş eğitmenlerin `instructors.subjects` dizisinde değer duruyor.
-- Filtrede görünmüyorlar (katalogda yoklar) ama profilde yazıyorlar.
--
-- ÖNCE 1. BÖLÜMÜ ÇALIŞTIRIN. Sadece KPSS branşı olan bir eğitmen varsa
-- temizlik onun dizisini BOŞALTIR; boş dizili eğitmen hiçbir filtreye
-- düşmez, yani pazar yerinden fiilen kaybolur. Öyle biri çıkarsa önce
-- onunla konuşup uygun bir branş seçmesini istemek gerekir.

-- ============================================================
-- 1) ÖNCE BAK: kim etkileniyor?
-- ============================================================

-- a) KPSS branşı olan bütün eğitmenler
select
  i.user_id,
  u.name,
  u.email,
  i.subjects,
  array_length(i.subjects, 1) as brans_sayisi
from public.instructors i
join public.users u on u.id = i.user_id
where i.subjects && array['KPSS Türkçe', 'KPSS Matematik']::text[]
order by u.name;

-- b) TEHLİKELİ OLANLAR: temizlik sonrası hiç branşı kalmayacaklar
select
  i.user_id,
  u.name,
  u.email,
  i.subjects as mevcut_branslar
from public.instructors i
join public.users u on u.id = i.user_id
where i.subjects && array['KPSS Türkçe', 'KPSS Matematik']::text[]
  and array_length(
        array(select unnest(i.subjects)
              except select unnest(array['KPSS Türkçe', 'KPSS Matematik']::text[])),
        1
      ) is null
order by u.name;

-- ============================================================
-- 2) SONRA TEMİZLE
-- ============================================================
-- Yukarıdaki (b) sorgusu BOŞ döndüyse çalıştırın.
-- Dolu döndüyse önce o eğitmenlerin branşını düzeltin.

update public.instructors i
set subjects = array(
      select unnest(i.subjects)
      except
      select unnest(array['KPSS Türkçe', 'KPSS Matematik']::text[])
    )
where i.subjects && array['KPSS Türkçe', 'KPSS Matematik']::text[];

-- ============================================================
-- 3) DOĞRULAMA
-- ============================================================
-- Boş dönmeli:
--   select user_id, subjects from public.instructors
--   where subjects && array['KPSS Türkçe','KPSS Matematik']::text[];
--
-- Branşsız kalan var mı (temizlikten bağımsız da kontrol edilebilir):
--   select i.user_id, u.name from public.instructors i
--   join public.users u on u.id = i.user_id
--   where coalesce(array_length(i.subjects,1),0) = 0;

-- NOT — DOKUNULMAYANLAR
-- Branş adı başka tablolarda da geçiyor ama oraya karışmıyoruz, çünkü
-- onlar katalog değil KULLANICI İÇERİĞİ:
--   student_study_logs.subject   -> öğrencinin kendi günlüğü
--   coaching_plan_items.subject  -> koçun yazdığı haftalık plan
--   homework_resources.subject   -> yüklenen kaynağın etiketi
--   curriculum_topics.subject    -> konu listesi
-- Öğrencinin "KPSS Matematik çalıştım" kaydını silmek veriyi
-- çarpıtmak olurdu.
