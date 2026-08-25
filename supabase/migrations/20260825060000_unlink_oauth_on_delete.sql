-- HATA: Hesabını silen kullanıcı Google ile bir daha kaydolamıyordu.
--
-- deleteMyAccount hesabı gerçekten silmiyor — kişisel veriyi anonimleştirip
-- kullanıcıyı 100 yıl banlıyor. Bu bilinçli ve doğru: rezervasyon ve ödeme
-- kayıtları muhasebe için duruyor.
--
-- Ama Google kimliği (auth.identities) o banlı kullanıcıya bağlı kalıyordu.
-- Sonuç: kişi Google ile girmeye çalıştığında Supabase kimliği banlı hesapla
-- eşleştirip "user_banned" dönüyordu. Kapı kalıcı olarak ve SESSİZCE
-- kapanıyordu — kullanıcı sadece login'e atılıyor, sebebini göremiyordu.
--
-- Canlıda doğrulandı: 22 Ağustos'ta silinen bir hesabın Google kimliği
-- duruyordu ve o Google hesabıyla yeniden kayıt imkânsızdı.
--
-- Çözüm: silme sırasında OAuth kimlikleri kaldırılıyor. Ban ve
-- anonimleştirme AYNEN KALIYOR; yalnızca sağlayıcı bağı kopuyor, böylece
-- kişi isterse yeniden kaydolabiliyor. Kayıtlar korunuyor, kapı açılıyor.
--
-- auth şemasına PostgREST'ten erişilemediği için security definer bir
-- fonksiyon gerekiyor. Yalnızca service_role çağırabiliyor; uygulama
-- tarafında zaten "kendi hesabını siliyor musun" kontrolü var.

create or replace function public.delete_user_oauth_identities(p_user_id uuid)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_silinen integer;
begin
  -- 'email' kimliği KALIYOR: hesabın kendisi duruyor, yalnızca sağlayıcı
  -- bağları kopuyor.
  delete from auth.identities
  where user_id = p_user_id and provider <> 'email';

  get diagnostics v_silinen = row_count;
  return v_silinen;
end;
$$;

-- Yalnızca servis rolü. Giriş yapmış bir kullanıcı bu fonksiyonu
-- çağırıp başkasının kimliğini koparamamalı.
revoke execute on function public.delete_user_oauth_identities(uuid) from public;
revoke execute on function public.delete_user_oauth_identities(uuid) from anon;
revoke execute on function public.delete_user_oauth_identities(uuid) from authenticated;
grant execute on function public.delete_user_oauth_identities(uuid) to service_role;
