-- Denetimde bulunan iki kritik açık kapatılıyor.
--
-- ÖNCE design/cakisma-kontrol.sql çalıştırın. Mevcut veride çakışan
-- rezervasyon varsa 2. bölümdeki kısıt migration'ı düşürür; önce o
-- kayıtları temizlemek gerekir.

-- ============================================================
-- 1) KOÇ, HERHANGİ BİR ÖĞRENCİYE KENDİNİ BAĞLAYABİLİYORDU
-- ============================================================
--
-- 0084'teki coaching_rel_insert_coach politikası yalnızca şunlara
-- bakıyordu:
--     coach_id = auth.uid() and is_coach(auth.uid())
-- student_id hakkında HİÇBİR ŞEY söylemiyordu.
--
-- Zincir şöyle tamamlanıyordu:
--   is_coach()  = branşlarında 'Koçluk' olan, onaylı, duraklatılmamış
--                 her eğitmen
--   can_view_student() (0084) koçluk ilişkisini erişim yolu sayıyor
--   o fonksiyon da şunların kapısı: deneme sonuçları, sınav yansımaları,
--   student_study_logs (Günlük), student_intake_forms (Koçluk Formu),
--   hedefler, müfredat konuları
--
-- Yani "Koçluk" branşlı onaylı bir eğitmen, startCoaching sunucu
-- eylemini istediği studentId ile çağırıp o öğrencinin özel dosyasını
-- kalıcı olarak açabiliyordu. Arayüzde o eylemin düğmesi yok, ama
-- CoachingSessionForm modülü import ettiği için tüm eylemleri HTTP ucu
-- olarak erişilebilir.
--
-- Bunun ağırlığı: 20260824214500 (veli hesapları) Günlük ve Koçluk
-- Formu'nu VELİDEN BİLE bilerek gizliyor ve gerekçesini yazıyor —
-- "Koçluk Formu 'koçluk almak kimin fikriydi' gibi sorular soruyor…
-- Veli okuyacak olsa öğrenci dürüst cevap vermez."
--
-- ÇÖZÜM: ilişki kurmak için öğrenci tarafında bir DAYANAK şartı.
-- Dayanak kümesi bilerek can_view_student ile aynı: aralarında ders
-- olması ya da atanmış bir tanışma dersi talebi. Böylece koç, zaten
-- erişimi olan bir öğrenciyle ilişkiyi kalıcılaştırabiliyor; hiç
-- tanımadığı birine kendini bağlayamıyor. Admin her zaman atayabilir.

-- Dayanak kontrolü ayrı bir fonksiyonda, politikanın içinde değil.
-- Sebebi teknik: politika gövdesindeki alt sorguda hem bookings hem
-- coaching_relationships'te `student_id` var; nitelemeyi yanlış yapmak
-- sessizce "her zaman doğru" bir koşul üretir ve açığı kapatmaz.
-- Parametreye alınca böyle bir belirsizlik kalmıyor. Depoda zaten aynı
-- desen var: is_coach(), can_view_student(), is_guardian_of().
--
-- security definer ŞART: fonksiyon bookings ve demo_lesson_requests'i
-- çağıranın RLS'inden bağımsız okumalı. Aksi halde koçun göremediği bir
-- ders yüzünden dayanak "yok" sayılır ve meşru ilişki de kurulamazdı.
create or replace function public.kocluk_dayanagi_var(p_student_id uuid, p_coach_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
      select 1 from public.bookings b
      where b.student_id = p_student_id and b.instructor_id = p_coach_id
    )
    or exists (
      select 1 from public.demo_lesson_requests r
      where r.student_id = p_student_id and r.assigned_instructor_id = p_coach_id
    );
$$;

revoke execute on function public.kocluk_dayanagi_var(uuid, uuid) from public;
grant execute on function public.kocluk_dayanagi_var(uuid, uuid) to authenticated;

drop policy if exists "coaching_rel_insert_coach" on public.coaching_relationships;

create policy "coaching_rel_insert_coach" on public.coaching_relationships
  for insert to authenticated
  with check (
    public.is_admin()
    or (
      coach_id = (select auth.uid())
      and public.is_coach((select auth.uid()))
      and public.kocluk_dayanagi_var(student_id, coach_id)
    )
  );

-- İlişkiyi bitirme de aynı sıkılıkta olmalı: 0084'teki update politikası
-- `coach_id = auth.uid() or is_admin()` diyor, o zaten doğru — koç
-- yalnızca kendi ilişkisini kapatabiliyor. Dokunulmuyor.

-- ============================================================
-- 2) AYNI SAATE İKİ REZERVASYON YAPILABİLİYORDU
-- ============================================================
--
-- Ne createBooking'de insert öncesi çakışma kontrolü vardı, ne de
-- veritabanında bir kısıt. Arayüzün müsait saat göstermesi tavsiye
-- niteliğinde: iki öğrenci aynı anda aynı saati seçerse ikisi de
-- geçiyordu. Google freebusy kontrolü de rezervasyon anında değil,
-- saat listesi üretilirken çalışıyor.
--
-- Koruma veritabanına konuyor, çünkü uygulama katmanındaki bir kontrol
-- yarışı çözmez: iki istek aynı anda kontrolü geçip ikisi de yazar.
-- EXCLUDE kısıtı bunu tek işlemde, kilitle çözer.
--
-- Yalnızca 'scheduled' satırlar için: iptal edilmiş ya da tamamlanmış
-- bir ders aynı saati bloke etmemeli.

create extension if not exists btree_gist;

alter table public.bookings
  drop constraint if exists bookings_egitmen_cakisma;

alter table public.bookings
  add constraint bookings_egitmen_cakisma
  exclude using gist (
    instructor_id with =,
    tstzrange(start_time, end_time) with &&
  ) where (status = 'scheduled');

-- Öğrenci tarafı da aynı şekilde: bir öğrenci aynı saatte iki farklı
-- eğitmenden ders alamaz.
alter table public.bookings
  drop constraint if exists bookings_ogrenci_cakisma;

alter table public.bookings
  add constraint bookings_ogrenci_cakisma
  exclude using gist (
    student_id with =,
    tstzrange(start_time, end_time) with &&
  ) where (status = 'scheduled');
