-- GÜVENLİK: role_confirmed kullanıcı tarafından değiştirilebiliyordu.
--
-- 20260824223000 hesap türü seçimini "tek kullanımlık" bir kapıya bağladı:
-- sunucu aksiyonu yalnızca role_confirmed = false ise rol veriyor. Ama
-- users tablosunda kullanıcının kendi satırını güncelleme izni var ve
-- RLS SATIR düzeyinde çalışıyor — satır güncellenebiliyorsa o satırdaki
-- HER kolon güncellenebiliyor.
--
-- Doğrulanan sömürü zinciri:
--   1. Öğrenci kendi satırında role_confirmed = false yapıyor
--   2. /hesap-turu sayfasına gidiyor
--   3. "Eğitmen" seçiyor — aksiyon kapıyı açık görüp rolü veriyor
-- Sonuç: herhangi bir öğrenci kendini eğitmene yükseltebiliyordu.
--
-- Çözüm, rol için zaten kullanılan desenin aynısı: kolonu tetikleyiciyle
-- korumak. prevent_role_change (0048) genişletiliyor; artık hem role hem
-- role_confirmed yalnızca service_role tarafından değiştirilebiliyor
-- (yani admin istemcisini kullanan sunucu aksiyonu).

create or replace function public.prevent_role_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(auth.role(), '') <> 'service_role' then
    if new.role is distinct from old.role then
      raise exception 'Rol degisikligi bu yontemle yapilamaz';
    end if;
    if new.role_confirmed is distinct from old.role_confirmed then
      raise exception 'Hesap turu onayi bu yontemle degistirilemez';
    end if;
  end if;
  return new;
end;
$$;

-- Tetikleyici 0048'de zaten users üzerinde tanımlı; fonksiyon değişti,
-- yeniden bağlamaya gerek yok.
