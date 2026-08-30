-- DENETİM DÜZELTMELERİ — veritabanı gerektiren HER ŞEY tek dosyada.
--
-- Daha önce parça parça verdiğim için özür; kalan bütün SQL burada.
-- 20260827140000_ucretsiz_ders_egitmen_onayi.sql SİLİNDİ, içeriği 1
-- numaralı bölüm olarak buraya alındı — hiç çalıştırılmamıştı.
--
-- Zaten çalıştırdığınız 20260827120000 (koçluk yetkisi + rezervasyon
-- çakışması) burada TEKRARLANMIYOR.
--
-- Altı bölüm var, hepsi bağımsız; sırayla uygulanabilir.

-- ============================================================
-- 1) ÜCRETSİZ DERS, EĞİTMEN KABUL ETMESE DE ALINABİLİYOR
-- ============================================================
--
-- createBooking bir sunucu eylemi, yani HTTP ucu; `isTrial` istemciden
-- geliyor ve doğrulanmıyor. 0050'deki prevent_booking_field_tamper
-- is_trial'i koruyor ama yalnızca BEFORE UPDATE'te — INSERT'te koruma
-- yok. 0035'teki kredi tetikleyicisi de yalnızca students.free_trial_used
-- alanına bakıyor, eğitmenin offers_free_trial değerine bakmıyor.
--
-- Sonuç: öğrenci isteğe isTrial:true ekleyip tanışma dersi vermeyen bir
-- eğitmenden de 0 kredi ile ders alabiliyor. Öğrenci başına bir kez ama
-- tüm eğitmen kadrosuna yayılabilir.
--
-- Arayüzün rezervasyon yolu isTrial hiç göndermiyor; tek meşru çağrı
-- sunucudaki acceptDemoLessonRequest. Koruma bu yüzden veritabanına
-- konuyor: hangi yoldan gelirse gelsin kapansın.
--
-- Fonksiyonun geri kalanı 0035'teki hâliyle aynı.

create or replace function public.deduct_credit_on_booking()
returns trigger
language plpgsql security definer set search_path = public
as $$
declare
  current_balance integer;
  trial_already_used boolean;
  egitmen_veriyor boolean;
begin
  if new.is_trial then
    -- YENİ: eğitmen tanışma dersi vermeyi kabul etmiş olmalı.
    select i.offers_free_trial into egitmen_veriyor
    from public.instructors i
    where i.user_id = new.instructor_id;

    if egitmen_veriyor is not true then
      raise exception 'Bu egitmen ucretsiz tanisma dersi vermiyor';
    end if;

    select free_trial_used into trial_already_used from public.students where user_id = new.student_id;
    if trial_already_used then
      raise exception 'Ucretsiz tanisma dersi hakki zaten kullanilmis';
    end if;
    new.credits_used := 0;
    update public.students set free_trial_used = true where user_id = new.student_id;
    return new;
  end if;

  select credit_balance into current_balance from public.students where user_id = new.student_id;
  if current_balance < new.credits_used then
    raise exception 'Yetersiz kredi bakiyesi: mevcut %, gerekli %', current_balance, new.credits_used;
  end if;
  update public.students set credit_balance = credit_balance - new.credits_used where user_id = new.student_id;
  return new;
end;
$$;

revoke execute on function public.deduct_credit_on_booking() from public;

-- ============================================================
-- 2) YABANCI EĞİTMEN, TANIMADIĞI ÖĞRENCİNİN EKRANINA YAZABİLİYOR
-- ============================================================
--
-- Üç yazma ucunda "bu eğitmenin bu öğrenciyle ilişkisi var mı?" hiç
-- sorulmuyor. Üçü de arayüzde düğmesi olmasa bile canlı HTTP ucu, çünkü
-- ilgili 'use server' modülleri istemci bileşenlerinden import ediliyor.
--
--   plan_items_insert_coach (0085:52)  -> yalnızca coach_id + is_coach
--   session_notes_insert_coach (0084)  -> yalnızca coach_id, onay şartı bile yok
--   homework_insert_instructor (0010)  -> yalnızca instructor_id
--
-- Yabancı bir eğitmen, öğrencinin plan/ödev ekranına serbest metin
-- bırakabiliyor ve öğrenci bu satırları silemiyor.
--
-- Çözüm tek kural: can_view_student() (0084'te zaten var) yazma
-- tarafında da kapı olsun. O fonksiyon aralarında ders, atanmış tanışma
-- dersi talebi ya da koçluk ilişkisi arıyor — yani meşru eğitmen
-- etkilenmiyor.

drop policy if exists "plan_items_insert_coach" on public.coaching_plan_items;
create policy "plan_items_insert_coach" on public.coaching_plan_items
  for insert to authenticated
  with check (
    coach_id = (select auth.uid())
    and public.is_coach((select auth.uid()))
    and public.can_view_student(student_id)
  );

drop policy if exists "session_notes_insert_coach" on public.coaching_session_notes;
create policy "session_notes_insert_coach" on public.coaching_session_notes
  for insert to authenticated
  with check (
    coach_id = (select auth.uid())
    and public.can_view_student(student_id)
  );

drop policy if exists "homework_insert_instructor" on public.homework;
create policy "homework_insert_instructor" on public.homework
  for insert
  with check (
    public.is_admin()
    or (instructor_id = (select auth.uid()) and public.can_view_student(student_id))
  );

-- ============================================================
-- 3) BAŞLAMIŞ DERS İPTAL EDİLEBİLİYOR + ÇİFT İPTAL YARIŞI
-- ============================================================
--
-- cancel_booking (0064:125) satırı kilitlemeden okuyup sonra yazıyor:
-- iki eşzamanlı istek kontrolü birlikte geçip ikisi de iptal bildirimi
-- üretebiliyor. Ayrıca start_time/now() karşılaştırması hiç yok — öğrenci
-- gerçekleşmiş bir dersi iptal edip eğitmenin ödeme sayacından
-- düşürebiliyor. Eğitmen tarafında arayüz bunu gizliyor
-- (InstructorBookingListItem:27) ama öğrenci tarafında koruma yok ve
-- arayüz koruması zaten yeterli değil: RPC doğrudan çağrılabilir.
--
-- Fonksiyonun geri kalanı 0064'teki hâliyle aynı; eklenen iki şey:
-- `for update` kilidi ve başlamış ders kontrolü.

create or replace function public.cancel_booking(p_booking_id uuid, p_as_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_booking record;
  v_is_authorized boolean;
begin
  -- for update: satırı kilitle. Kilitsiz okuma iki eşzamanlı iptalin de
  -- kontrolü geçmesine ve çift bildirime yol açıyordu.
  select * into v_booking from public.bookings where id = p_booking_id for update;

  if v_booking is null then
    raise exception 'Rezervasyon bulunamadı';
  end if;

  if v_booking.status <> 'scheduled' then
    raise exception 'Bu rezervasyon zaten iptal edilmiş veya tamamlanmış';
  end if;

  -- YENİ: başlamış ya da geçmiş ders iptal edilemez.
  if v_booking.start_time <= now() then
    raise exception 'Başlamış bir ders iptal edilemez';
  end if;

  if p_as_role = 'instructor' then
    v_is_authorized := v_booking.instructor_id = auth.uid();
  elsif p_as_role = 'student' then
    v_is_authorized := v_booking.student_id = auth.uid();
  else
    v_is_authorized := false;
  end if;

  if not v_is_authorized then
    raise exception 'Bu rezervasyonu iptal etme yetkin yok';
  end if;

  update public.bookings
  set status = 'cancelled',
      cancelled_by = p_as_role::user_role,
      cancelled_at = now()
  where id = p_booking_id;
end;
$$;

revoke execute on function public.cancel_booking(uuid, text) from public;
grant execute on function public.cancel_booking(uuid, text) to authenticated;

-- ============================================================
-- 4) KAPANMIŞ REZERVASYONUN DURUMU GERİ ALINABİLİYOR
-- ============================================================
--
-- markBookingCompleted / markBookingNoShow yalnızca eğitmeni filtreliyor,
-- rezervasyonun mevcut durumuna bakmıyor. bookings_update_instructor
-- (0010) politikasında WITH CHECK yok. Yani iptal edilip kredisi iade
-- edilmiş bir ders "tamamlandı"ya çevrilebiliyor: kredi öğrencide kalıyor
-- ama ders eğitmenin ödeme sayacına yazılıyor.
--
-- Koruma tetikleyiciye konuyor çünkü uygulama katmanındaki kontrol
-- doğrudan RPC/eylem çağrısıyla atlanabilir. 0050'deki service_role
-- kaçış kapısı korunuyor: sistem telafileri (createBooking'in takvim
-- hatasında yaptığı iptal gibi) admin istemcisiyle çalışıyor.

create or replace function public.prevent_booking_field_tamper()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') = 'service_role' then
    return new;
  end if;

  if new.student_id is distinct from old.student_id
     or new.instructor_id is distinct from old.instructor_id
     or new.purchased_by is distinct from old.purchased_by
     or new.credits_used is distinct from old.credits_used
     or new.start_time is distinct from old.start_time
     or new.end_time is distinct from old.end_time
     or new.is_trial is distinct from old.is_trial
  then
    raise exception 'Bu alanlar bu yontemle degistirilemez';
  end if;

  -- YENİ: kapanmış bir rezervasyonun durumu değiştirilemez.
  -- Diğer alanlar (ör. instructor_notes) hâlâ güncellenebiliyor.
  if old.status in ('cancelled', 'completed', 'no_show')
     and new.status is distinct from old.status
  then
    raise exception 'Kapanmis bir rezervasyonun durumu degistirilemez';
  end if;

  return new;
end;
$$;

revoke execute on function public.prevent_booking_field_tamper() from public;

-- ============================================================
-- 5) MÜSAİTLİK SORGULARI DOLU SAATLERİ BOŞ GÖSTERİYOR
-- ============================================================
--
-- get-next-slots.ts ve get-available-slots.ts rezervasyonları RLS'e
-- saygılı istemciyle okuyor. bookings_select (0010 + 0064) yalnızca
-- kendi kayıtlarını gösterdiği için başka öğrencilerin dersleri boş
-- görünüyor: pazaryeri kartındaki "ilk müsait saat" dolu bir saati
-- önerebiliyor.
--
-- Politikayı gevşetmek yanlış olurdu — rezervasyon satırında öğrenci
-- kimliği ve not var. Onun yerine YALNIZCA dolu zaman aralıklarını
-- dönen bir fonksiyon: kişisel veri yok, sadece başlangıç/bitiş.

create or replace function public.egitmen_dolu_araliklar(
  p_instructor_id uuid,
  p_bas timestamptz,
  p_bit timestamptz
)
returns table (start_time timestamptz, end_time timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select b.start_time, b.end_time
  from public.bookings b
  where b.instructor_id = p_instructor_id
    and b.status = 'scheduled'
    and b.start_time < p_bit
    and b.end_time > p_bas
  order by b.start_time;
$$;

revoke execute on function public.egitmen_dolu_araliklar(uuid, timestamptz, timestamptz) from public;
grant execute on function public.egitmen_dolu_araliklar(uuid, timestamptz, timestamptz) to authenticated, anon;

-- ============================================================
-- 6) DOĞRULAMA
-- ============================================================
-- Uyguladıktan sonra bunları çalıştırıp beklenen sonucu görün:
--
--   -- politikalar yerinde mi (3 satır dönmeli)
--   select policyname from pg_policies
--   where policyname in ('plan_items_insert_coach','session_notes_insert_coach','homework_insert_instructor');
--
--   -- fonksiyonlar yerinde mi (5 satır dönmeli)
--   select proname from pg_proc
--   where proname in ('deduct_credit_on_booking','cancel_booking',
--                     'prevent_booking_field_tamper','egitmen_dolu_araliklar',
--                     'kocluk_dayanagi_var');
--
--   -- kilitlenmiş tanışma dersi talebi var mı (boş dönmeli)
--   select id, student_id, assigned_instructor_id, created_at
--   from public.demo_lesson_requests
--   where status = 'assigned' and booking_id is null;
