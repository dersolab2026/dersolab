/**
 * Hedef karsilastirmasi ve karar kurallari.
 *
 * Kurallar tamamen deterministik — model, esik kalibrasyonu, ogrenme yok.
 * Kocun "programi mi degistirelim, hedefi mi yukseltelim" sorusuna
 * bakabilecegi tek bir cumle uretmek amac.
 */

export type HedefDurumu = 'veri-yok' | 'geride' | 'yolunda' | 'ileride'

export interface HedefDegerlendirme {
  durum: HedefDurumu
  mesaj: string
  /** Son denemedeki netin hedefe uzakligi (eksi = geride). */
  fark: number | null
  /** Karara kac deneme bakildi. */
  bakilanDeneme: number
}

/** Karar kac son denemeye bakiyor. */
const PENCERE = 4

/** Karar icin gereken en az deneme sayisi. */
const ASGARI = 3

/**
 * Netler ESKIDEN YENIYE sirali gelmeli.
 *
 * "Geride" demek icin son penceredeki denemelerin HEPSI hedefin altinda
 * olmali; tek bir kotu deneme karar degistirmemeli. Ayni sekilde "ileride"
 * icin hepsi hedefte ya da uzerinde olmali.
 */
export function degerlendir(netler: number[], hedefNet: number | null): HedefDegerlendirme {
  if (hedefNet === null || hedefNet <= 0) {
    return { durum: 'veri-yok', mesaj: 'Hedef net girilmemiş.', fark: null, bakilanDeneme: 0 }
  }
  if (netler.length < ASGARI) {
    return {
      durum: 'veri-yok',
      mesaj: `Karar için en az ${ASGARI} deneme gerekiyor (şu an ${netler.length}).`,
      fark: netler.length > 0 ? yuvarla(netler[netler.length - 1] - hedefNet) : null,
      bakilanDeneme: netler.length,
    }
  }

  const son = netler.slice(-PENCERE)
  const fark = yuvarla(netler[netler.length - 1] - hedefNet)

  if (son.every((n) => n < hedefNet)) {
    return {
      durum: 'geride',
      mesaj: `Son ${son.length} denemenin hepsi hedefin altında. Programı gözden geçirmek gerekiyor.`,
      fark,
      bakilanDeneme: son.length,
    }
  }

  if (son.every((n) => n >= hedefNet)) {
    return {
      durum: 'ileride',
      mesaj: `Son ${son.length} denemenin hepsi hedefte ya da üzerinde. Hedefi yükseltmenin zamanı.`,
      fark,
      bakilanDeneme: son.length,
    }
  }

  return {
    durum: 'yolunda',
    mesaj: `Son ${son.length} denemede hedefin bir altında bir üstünde — gidişat dengeli.`,
    fark,
    bakilanDeneme: son.length,
  }
}

function yuvarla(n: number): number {
  return Math.round(n * 100) / 100
}

/** Ders bazli hedeflerin toplami. */
export function toplamHedefNet(hedefler: { targetNet: number }[]): number | null {
  if (hedefler.length === 0) return null
  return yuvarla(hedefler.reduce((t, h) => t + h.targetNet, 0))
}

export const DURUM_RENK: Record<HedefDurumu, string> = {
  'veri-yok': '#61757B',
  geride: '#DD7B3A',
  yolunda: '#E8C468',
  ileride: '#6FA89E',
}
