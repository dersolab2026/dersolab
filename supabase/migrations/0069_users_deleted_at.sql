-- deleteUserAccount() hesabi anonimlestirip girisi kapatiyordu ama satir
-- Kullanicilar listesinde "Silinmis Kullanici" olarak sonsuza kadar
-- gorunmeye devam ediyordu. Silinme anini isaretleyip admin listesinden
-- gizliyoruz; alttaki satir (gecmis ders/odeme kayitlari icin) korunuyor.

alter table public.users add column deleted_at timestamptz;

-- Daha once anonimlestirilmis hesaplari geriye donuk isaretle.
update public.users set deleted_at = now() where email like 'silinmis-%@dersolab.local';
