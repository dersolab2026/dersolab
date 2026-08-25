import { TERMS_VERSION } from '@/lib/legal'
import { gecerliRolMu, hesapTuruBelirle, type SecilebilirRol } from '@/lib/auth/account-type'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Kayit formundaki secimi Google donusune tasiyan not.
 *
 * Google ne rolu ne de KVKK onayini tasiyor. Kullanici formda ikisini de
 * secmis oluyor; tasimazsak donusunde AYNI IKI SORUYU tekrar sormak
 * gerekiyor ki bu sinir bozucu.
 *
 * URL parametresi yerine httpOnly CEREZ kullaniliyor: adres cubugunda
 * gorunmuyor, kullanici kurcalayamiyor ve baskasina link atarak birinin
 * hesap turunu belirletemiyor. Kisa omurlu — OAuth turu birkac dakika
 * surer.
 *
 * Not sadece bir NIYET. Yetkiyi o vermiyor: rol yine hesapTuruBelirle'nin
 * tek kullanimlik kapisindan geciyor, yani yalnizca yepyeni hesaplarda
 * uygulaniyor.
 */

export const OAUTH_NOT_CEREZI = 'dersolab-oauth-not'
export const OAUTH_NOT_OMRU = 60 * 10 // 10 dakika

export interface OAuthNotu {
  rol: SecilebilirRol
  sartSurumu: string
}

export function notuYaz(not: OAuthNotu): string {
  return JSON.stringify({ rol: not.rol, sartSurumu: not.sartSurumu })
}

export function notuOku(ham: string | undefined): OAuthNotu | null {
  if (!ham) return null
  try {
    const veri = JSON.parse(ham)
    if (!gecerliRolMu(veri?.rol)) return null
    if (typeof veri?.sartSurumu !== 'string') return null
    return { rol: veri.rol, sartSurumu: veri.sartSurumu }
  } catch {
    return null
  }
}

/**
 * Notu uygular. Basarisizlik giris akisini BOZMUYOR — not uygulanamazsa
 * kullanici /hesap-turu ve /terms/accept ekranlarina dusuyor, yani en
 * kotu ihtimalde eski davranisa geri donuyoruz.
 */
export async function notuUygula(userId: string, not: OAuthNotu): Promise<void> {
  const sonuc = await hesapTuruBelirle(userId, not.rol)
  if (!sonuc.success) {
    // Hesap turu zaten belirlenmisse bu beklenen bir durum, hata degil.
    console.info('OAuth notu: hesap türü uygulanmadı —', sonuc.error)
  }

  // Sart surumu ESKIYSE kabul yazilmiyor: kullanici formda gordugu
  // metni kabul etti, arada surum degistiyse tekrar gostermek dogru.
  if (not.sartSurumu !== TERMS_VERSION) return

  const admin = createAdminClient()
  const { error } = await admin.from('terms_acceptances').upsert(
    { user_id: userId, terms_version: TERMS_VERSION, acceptance_source: 'oauth' },
    { onConflict: 'user_id,terms_version', ignoreDuplicates: true },
  )
  if (error) console.error('OAuth notu: şart kabulü yazılamadı', error.message)
}
