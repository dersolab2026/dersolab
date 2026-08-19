/**
 * Ödev tipleri.
 *
 * "Kapalı kitap" tipi neredeyse bedava geldi: teslim (fotoğraf/video) ve
 * eğitmen onay akışı zaten vardı, eksik olan tek şey tipi seçtiren alan ve
 * onay ekranındaki kısa geri bildirim kutusuydu.
 *
 * Tipin işlevi öğrenciye NE YAPACAĞINI söylemek değil sadece; eğitmenin
 * onaylarken neye bakacağını da belirliyor.
 */

export type OdevTipi = 'serbest' | 'kaynak' | 'konu-tekrari' | 'kapali-kitap'

export interface OdevTipiTanim {
  deger: OdevTipi
  etiket: string
  aciklama: string
  /** Öğrenciye teslim ekranında gösterilen yönerge. */
  ogrenciYonergesi: string
  kaynakGerekir: boolean
}

export const ODEV_TIPLERI: OdevTipiTanim[] = [
  {
    deger: 'serbest',
    etiket: 'Serbest',
    aciklama: 'Kendi tarif ettiğin ödev.',
    ogrenciYonergesi: 'Eğitmeninin tarif ettiği ödevi tamamlayıp teslim et.',
    kaynakGerekir: false,
  },
  {
    deger: 'kaynak',
    etiket: 'Kaynaktan bölüm',
    aciklama: 'Belirli bir kitabın belirli bir bölümü.',
    ogrenciYonergesi: 'Belirtilen kaynağın belirtilen bölümünü çöz, çözümlerinin fotoğrafını yükle.',
    kaynakGerekir: true,
  },
  {
    deger: 'konu-tekrari',
    etiket: 'Konu tekrarı',
    aciklama: 'Bir konuyu baştan çalışma.',
    ogrenciYonergesi: 'Konuyu çalıştıktan sonra kendi özetini çıkar ve fotoğrafını yükle.',
    kaynakGerekir: false,
  },
  {
    deger: 'kapali-kitap',
    etiket: 'Kapalı kitap hatırlama',
    aciklama: 'Kitap kapalıyken hatırladığını yazma — en etkili tekrar biçimi.',
    ogrenciYonergesi:
      'Kitabı ve defterini KAPAT. Konuyla ilgili hatırladığın her şeyi boş bir kâğıda yaz, sonra fotoğrafını yükle. Eksik kalanlar tam da çalışman gereken yerler.',
    kaynakGerekir: false,
  },
]

export const ODEV_TIPI_ETIKET: Record<OdevTipi, string> = Object.fromEntries(
  ODEV_TIPLERI.map((t) => [t.deger, t.etiket]),
) as Record<OdevTipi, string>

export function odevTipi(deger: string | null | undefined): OdevTipiTanim {
  return ODEV_TIPLERI.find((t) => t.deger === deger) ?? ODEV_TIPLERI[0]
}

/**
 * Kaynağın yüzde kaçının bittiği.
 *
 * Aralık serbest metin ("3. bölüm", "1-40", "Test 5-8") olduğu için
 * SAYMIYORUZ; yalnızca kaç ödev verildiğine bakıyoruz. Serbest metinden
 * birim sayısı çıkarmaya çalışmak yanlış sayı üretir ve yanlış sayı hiç
 * sayı olmamasından kötüdür.
 */
export function kaynakIlerlemesi(
  tamamlananOdevSayisi: number,
  toplamBirim: number | null,
): { yuzde: number | null; metin: string } {
  if (!toplamBirim || toplamBirim <= 0) {
    return {
      yuzde: null,
      metin: `${tamamlananOdevSayisi} ödev tamamlandı`,
    }
  }
  const yuzde = Math.min(100, Math.round((tamamlananOdevSayisi / toplamBirim) * 100))
  return {
    yuzde,
    metin: `${tamamlananOdevSayisi}/${toplamBirim} bölüm · %${yuzde}`,
  }
}
