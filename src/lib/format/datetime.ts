/**
 * Sunucu tarafinda tarih/saat bicimlendirme.
 *
 * NEDEN AYRI BIR MODUL: uretimde sunucu UTC'de calisiyor. `toLocaleString`
 * cagrilirken timeZone verilmezse Istanbul'daki 09:00 ekranda ve e-postada
 * 06:00 gorunuyor — ogrenci dersi kacirir. Sunucuda saat basan her yer
 * buradan gecmeli.
 *
 * Istemci bilesenleri (tarayicida calisanlar) kullanicinin kendi saat
 * dilimini kullaniyor ve Turkiye'deki kullanici icin dogru sonuc veriyor;
 * onlar bu modulu kullanmak zorunda degil.
 */

export const ISTANBUL_TZ = 'Europe/Istanbul'

/** "20 Ağustos 2026 Perşembe 09:00" */
export function tamTarihSaat(an: Date | string): string {
  return new Date(an).toLocaleString('tr-TR', {
    timeZone: ISTANBUL_TZ,
    dateStyle: 'full',
    timeStyle: 'short',
  })
}

/** "20 Ağu 2026 09:00" */
export function kisaTarihSaat(an: Date | string): string {
  return new Date(an).toLocaleString('tr-TR', {
    timeZone: ISTANBUL_TZ,
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

/** Saat dilimi sabitli tam serbest bicim. */
export function tarihSaat(an: Date | string, secenekler: Intl.DateTimeFormatOptions = {}): string {
  return new Date(an).toLocaleString('tr-TR', { timeZone: ISTANBUL_TZ, ...secenekler })
}

/** Bir anin Istanbul takvimindeki gunu (YYYY-MM-DD). */
export function istanbulGunu(an: Date | string): string {
  return new Date(an).toLocaleDateString('en-CA', { timeZone: ISTANBUL_TZ })
}
