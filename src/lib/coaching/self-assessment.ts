/**
 * Çalışma alışkanlıkları öz-değerlendirmesi.
 *
 * ÖNEMLİ: Bu DersoLab'ın kendi madde seti. LASSI gibi ticari lisanslı
 * ölçeklerin maddeleri kullanılmadı; ölçülen boyutlar benzer ama ifadeler
 * özgün. Ölçek psikometrik olarak doğrulanmış DEĞİL — geçerlik/güvenirlik
 * çalışması yapılmadı. Bir tanı aracı değil, koçun ilk görüşmede neyi
 * konuşacağını bulmasını sağlayan bir konuşma başlatıcı. Arayüzde de böyle
 * sunulmalı.
 *
 * Cevaplar 1–5 (1 = hiç katılmıyorum, 5 = tamamen katılıyorum).
 * Ters maddelerde puan 6 − cevap olarak çevriliyor, böylece her boyutta
 * yüksek puan her zaman "iyi" anlamına geliyor.
 */

export type Boyut = 'zaman' | 'konsantrasyon' | 'kaygi' | 'kendini-test' | 'süreklilik'

export interface Madde {
  id: string
  boyut: Boyut
  metin: string
  /** true ise puan ters çevriliyor. */
  ters?: boolean
}

export const BOYUT_ADLARI: Record<Boyut, string> = {
  zaman: 'Zaman yönetimi',
  konsantrasyon: 'Konsantrasyon',
  kaygi: 'Sınav kaygısıyla baş etme',
  'kendini-test': 'Kendini test etme',
  süreklilik: 'Süreklilik',
}

export const MADDELER: Madde[] = [
  // Zaman yönetimi
  { id: 'zy1', boyut: 'zaman', metin: 'Haftalık bir çalışma programı yapar ve genelde ona uyarım.' },
  { id: 'zy2', boyut: 'zaman', metin: 'Çalışmaya oturmadan önce o oturumda ne yapacağıma karar veririm.' },
  { id: 'zy3', boyut: 'zaman', metin: 'Yapmam gerekeni sürekli ertesi güne bırakırım.', ters: true },
  { id: 'zy4', boyut: 'zaman', metin: 'Bir konuya ne kadar süre ayıracağımı önceden belirlerim.' },

  // Konsantrasyon
  { id: 'ko1', boyut: 'konsantrasyon', metin: 'Çalışırken telefonuma bakmadan uzun süre devam edebilirim.' },
  { id: 'ko2', boyut: 'konsantrasyon', metin: 'Kitabın başındayken aklım sürekli başka şeylere kayar.', ters: true },
  { id: 'ko3', boyut: 'konsantrasyon', metin: 'Dikkatim dağıldığında kaldığım yere çabuk dönerim.' },
  { id: 'ko4', boyut: 'konsantrasyon', metin: 'Çalışma ortamımı dikkatimi dağıtmayacak şekilde düzenlerim.' },

  // Sınav kaygısıyla baş etme (hepsi ters: yüksek puan = kaygı düşük)
  { id: 'ka1', boyut: 'kaygi', metin: 'Deneme sınavına girmeden önce aşırı gerilirim.', ters: true },
  { id: 'ka2', boyut: 'kaygi', metin: 'Bildiğim soruları sınavda heyecandan yapamadığım olur.', ters: true },
  { id: 'ka3', boyut: 'kaygi', metin: 'Sınav sonucumu öğrenmekten çekinirim.', ters: true },
  { id: 'ka4', boyut: 'kaygi', metin: 'Sınavda süre baskısı düşünmemi engeller.', ters: true },

  // Kendini test etme
  { id: 'kt1', boyut: 'kendini-test', metin: 'Konuyu bitirince kitaba bakmadan kendime sorular sorarım.' },
  { id: 'kt2', boyut: 'kendini-test', metin: 'Yanlış yaptığım soruları not eder, bir süre sonra tekrar çözerim.' },
  { id: 'kt3', boyut: 'kendini-test', metin: 'Sadece okuyup geçmek yerine soru çözerek pekiştiririm.' },
  { id: 'kt4', boyut: 'kendini-test', metin: 'Bir konuyu gerçekten anlayıp anlamadığımı sınamadan geçmem.' },

  // Süreklilik
  { id: 'su1', boyut: 'süreklilik', metin: 'Zorlandığım bir konuda pes etmeden devam ederim.' },
  { id: 'su2', boyut: 'süreklilik', metin: 'Kötü bir deneme sonucundan sonra çalışmaya ara veririm.', ters: true },
  { id: 'su3', boyut: 'süreklilik', metin: 'Hedefimi düşündüğümde çalışma isteğim artar.' },
  { id: 'su4', boyut: 'süreklilik', metin: 'Planladığım çalışmayı canım istemediğinde de yaparım.' },
]

export const OLCEK_ETIKETLERI = [
  'Hiç katılmıyorum',
  'Pek katılmıyorum',
  'Kararsızım',
  'Katılıyorum',
  'Tamamen katılıyorum',
]

export interface BoyutSkoru {
  boyut: Boyut
  ad: string
  /** 1–5 arası ortalama. */
  puan: number
  /** Yüzdeye çevrilmiş hali (grafik için). */
  oran: number
  cevaplanan: number
}

/** Cevaplardan boyut skorlarını hesapla. Eksik cevaplar sayıma girmiyor. */
export function boyutSkorlari(cevaplar: Record<string, number>): BoyutSkoru[] {
  const boyutlar: Boyut[] = ['zaman', 'konsantrasyon', 'kaygi', 'kendini-test', 'süreklilik']

  return boyutlar.map((b) => {
    const maddeler = MADDELER.filter((m) => m.boyut === b)
    const puanlar: number[] = []

    for (const m of maddeler) {
      const c = cevaplar[m.id]
      if (typeof c !== 'number' || c < 1 || c > 5) continue
      puanlar.push(m.ters ? 6 - c : c)
    }

    const puan = puanlar.length > 0
      ? Math.round((puanlar.reduce((a, x) => a + x, 0) / puanlar.length) * 100) / 100
      : 0

    return {
      boyut: b,
      ad: BOYUT_ADLARI[b],
      puan,
      // 1–5 -> 0–1: (puan − 1) / 4
      oran: puanlar.length > 0 ? (puan - 1) / 4 : 0,
      cevaplanan: puanlar.length,
    }
  })
}

/** En düşük iki boyut — koçun ilk görüşmede konuşacağı yer. */
export function zayifBoyutlar(skorlar: BoyutSkoru[]): BoyutSkoru[] {
  return skorlar
    .filter((s) => s.cevaplanan > 0)
    .slice()
    .sort((a, b) => a.puan - b.puan)
    .slice(0, 2)
}
