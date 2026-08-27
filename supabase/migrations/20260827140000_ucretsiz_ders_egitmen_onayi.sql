-- Ücretsiz tanışma dersi, eğitmen kabul etmese de alınabiliyordu.
--
-- SORUN
-- createBooking bir sunucu eylemi, yani HTTP ucu. `isTrial` parametresi
-- istemciden geliyor ve hiçbir yerde doğrulanmıyordu:
--   - 0050'deki prevent_booking_field_tamper `is_trial`'i koruyor ama
--     yalnızca BEFORE UPDATE'te (0050:28). INSERT'te koruma yok.
--   - 0035'teki deduct_credit_on_booking yalnızca students.free_trial_used
--     alanına bakıyor; eğitmenin offers_free_trial değerine BAKMIYOR.
--
-- Yani giriş yapmış bir öğrenci, isteğe `isTrial: true` ekleyerek tanışma
-- dersi vermeyen bir eğitmenden de 0 kredi ile ders alabiliyordu. Eğitmen
-- kabul etmediği ücretsiz bir dersle karşılaşıyor ve ödeme almıyordu.
-- Öğrenci başına bir kez (hak yanıyor) ama tüm eğitmen kadrosuna yayılabilir.
--
-- Arayüzün rezervasyon yolu isTrial hiç göndermiyor
-- (InstructorBookingSection.tsx:39); tek meşru çağrı sunucu tarafındaki
-- acceptDemoLessonRequest. Bu yüzden koruma uygulama katmanına değil
-- VERİTABANINA konuyor: hangi yoldan gelirse gelsin kapansın.
--
-- Fonksiyonun geri kalanı 0035'teki hâliyle aynı; tek eklenen, aşağıdaki
-- "eğitmen bu dersi veriyor mu" kontrolü.

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

-- 20260822161438 bu fonksiyonun public'ten execute yetkisini almıştı;
-- create or replace yetkileri sıfırladığı için tekrar alıyoruz.
revoke execute on function public.deduct_credit_on_booking() from public;
