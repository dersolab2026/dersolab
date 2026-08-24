/**
 * Koçluk formunun seçenek katalogları.
 *
 * Form eskiden serbest metindi ve pratikte boş kalıyordu: kimse paragraf
 * yazmak istemiyor. Artık hepsi tıklanabilir seçenek — öğrenci hiç yazı
 * yazmadan formu bitirebiliyor.
 *
 * Cevaplar ANAHTAR olarak saklanıyor (etiket olarak değil): etiket metni
 * ileride değişirse eski kayıtlar bozulmasın. Etiket çözümü tek yerden,
 * bu dosyadan yapılıyor.
 *
 * Bu dosya bilerek 'use server' DEĞİL: Next 16'da bir 'use server' dosyası
 * yalnızca async fonksiyon dışa aktarabiliyor, sabit dizi aktarınca
 * typecheck geçse de production build kırılıyor.
 */

export interface IntakeSecenek {
  key: string
  label: string
  /** Aynı soru içinde alt başlık; yoksa tek grup. */
  grup?: string
}

export const HEDEF_SECENEKLERI: IntakeSecenek[] = [
  { key: 'bolum', label: 'Belirli bir bölüm/üniversite hedefim var' },
  { key: 'puan', label: 'Puanımı yükseltmek istiyorum' },
  { key: 'okul', label: 'Okul derslerimi toparlamak istiyorum' },
  { key: 'ilk_kez', label: 'İlk kez hazırlanıyorum, yol haritası lazım' },
  { key: 'tekrar', label: 'Geçen seneki puanımı geçmek istiyorum' },
  { key: 'duzen', label: 'Düzenli çalışma alışkanlığı kazanmak istiyorum' },
  { key: 'kaygi', label: 'Sınav kaygımı yönetmek istiyorum' },
  { key: 'motivasyon', label: 'Motivasyonumu toparlamak istiyorum' },
]

/** LGS ve YKS ders listeleri ayrı: öğrenciye görmeyeceği ders gösterilmiyor. */
export const ZORLANDIGI_DERSLER_LGS: IntakeSecenek[] = [
  { key: 'lgs_turkce', label: 'Türkçe' },
  { key: 'lgs_matematik', label: 'Matematik' },
  { key: 'lgs_fen', label: 'Fen Bilimleri' },
  { key: 'lgs_sosyal', label: 'Sosyal Bilgiler' },
  { key: 'lgs_inkilap', label: 'İnkılap Tarihi' },
  { key: 'lgs_ingilizce', label: 'İngilizce' },
  { key: 'lgs_din', label: 'Din Kültürü' },
]

export const ZORLANDIGI_DERSLER_YKS: IntakeSecenek[] = [
  { key: 'yks_turkce', label: 'Türkçe' },
  { key: 'yks_edebiyat', label: 'Edebiyat' },
  { key: 'yks_matematik', label: 'Matematik' },
  { key: 'yks_geometri', label: 'Geometri' },
  { key: 'yks_fizik', label: 'Fizik' },
  { key: 'yks_kimya', label: 'Kimya' },
  { key: 'yks_biyoloji', label: 'Biyoloji' },
  { key: 'yks_tarih', label: 'Tarih' },
  { key: 'yks_cografya', label: 'Coğrafya' },
  { key: 'yks_felsefe', label: 'Felsefe' },
  { key: 'yks_din', label: 'Din Kültürü' },
  { key: 'yks_ingilizce', label: 'İngilizce' },
]

export const RUTIN_SECENEKLERI: IntakeSecenek[] = [
  { key: 'sure_0_1', label: 'Günde 1 saatten az', grup: 'Ne kadar' },
  { key: 'sure_1_2', label: 'Günde 1–2 saat', grup: 'Ne kadar' },
  { key: 'sure_2_4', label: 'Günde 2–4 saat', grup: 'Ne kadar' },
  { key: 'sure_4_plus', label: 'Günde 4 saatten fazla', grup: 'Ne kadar' },
  { key: 'duzensiz', label: 'Çok düzensiz, bazı günler hiç', grup: 'Ne kadar' },

  { key: 'zaman_okul_sonrasi', label: 'Okuldan hemen sonra', grup: 'Ne zaman' },
  { key: 'zaman_aksam', label: 'Akşam', grup: 'Ne zaman' },
  { key: 'zaman_gece', label: 'Gece geç saatlerde', grup: 'Ne zaman' },
  { key: 'zaman_sabah', label: 'Sabah erken', grup: 'Ne zaman' },
  { key: 'zaman_haftasonu', label: 'Ağırlıklı hafta sonu', grup: 'Ne zaman' },
  { key: 'zaman_dershane', label: 'Dershane/etüde gidiyorum', grup: 'Ne zaman' },
]

export const YONTEM_SECENEKLERI: IntakeSecenek[] = [
  { key: 'dershane', label: 'Dershane / kurs' },
  { key: 'ozel_ders', label: 'Özel ders' },
  { key: 'video', label: 'YouTube / online video' },
  { key: 'soru_bankasi', label: 'Soru bankası' },
  { key: 'konu_anlatim', label: 'Konu anlatım kitabı' },
  { key: 'deneme', label: 'Deneme çözme' },
  { key: 'kendi_program', label: 'Kendi programımı yaptım' },
  { key: 'uygulama', label: 'Çalışma uygulaması / dijital araç' },
  { key: 'grup_calisma', label: 'Arkadaşlarla grup çalışması' },
  { key: 'hicbiri', label: 'Hiçbiri, ilk kez sistemli çalışacağım' },
]

export const ORTAM_SECENEKLERI: IntakeSecenek[] = [
  { key: 'yer_oda', label: 'Evde kendi odamda', grup: 'Nerede' },
  { key: 'yer_ortak', label: 'Evde ortak alanda', grup: 'Nerede' },
  { key: 'yer_kutuphane', label: 'Kütüphanede', grup: 'Nerede' },
  { key: 'yer_etut', label: 'Etüt merkezinde', grup: 'Nerede' },
  { key: 'yer_kafe', label: 'Kafede', grup: 'Nerede' },

  { key: 'dd_telefon', label: 'Telefon', grup: 'Dikkatimi dağıtan' },
  { key: 'dd_sosyal', label: 'Sosyal medya', grup: 'Dikkatimi dağıtan' },
  { key: 'dd_oyun', label: 'Oyun', grup: 'Dikkatimi dağıtan' },
  { key: 'dd_ev', label: 'Ev kalabalık / gürültülü', grup: 'Dikkatimi dağıtan' },
  { key: 'dd_uyku', label: 'Uyku düzenim bozuk', grup: 'Dikkatimi dağıtan' },
  { key: 'dd_odaklanma', label: 'Uzun süre odaklanamıyorum', grup: 'Dikkatimi dağıtan' },
  { key: 'dd_yok', label: 'Ciddi bir dikkat dağıtıcım yok', grup: 'Dikkatimi dağıtan' },
]

/** Tüm ders seçenekleri — etiket çözerken hangi tracka ait olduğunu bilmek gerekmiyor. */
export const TUM_DERSLER = [...ZORLANDIGI_DERSLER_LGS, ...ZORLANDIGI_DERSLER_YKS]

/** Sunucu tarafı doğrulama ve etiket çözümü için alan → katalog eşlemesi. */
export const INTAKE_KATALOGLARI = {
  goal: HEDEF_SECENEKLERI,
  hardSubjects: TUM_DERSLER,
  dailyRoutine: RUTIN_SECENEKLERI,
  triedMethods: YONTEM_SECENEKLERI,
  studyEnvironment: ORTAM_SECENEKLERI,
} as const

export type IntakeAlan = keyof typeof INTAKE_KATALOGLARI

/** Katalogda olmayan anahtarları eler. Sunucuda kaydetmeden önce çalışıyor. */
export function gecerliAnahtarlar(alan: IntakeAlan, secilenler: string[]): string[] {
  const izinli = new Set(INTAKE_KATALOGLARI[alan].map((s) => s.key))
  return [...new Set(secilenler)].filter((k) => izinli.has(k))
}

/**
 * Anahtarları okunur etikete çevirir.
 *
 * Katalogda bulunmayan bir değer OLDUĞU GİBİ döner. Sebebi: form eskiden
 * serbest metindi, eski kayıtlar tek elemanlı dizi olarak taşındı. Koç o
 * eski cevabı da görebilmeli.
 */
export function etiketle(alan: IntakeAlan, secilenler: string[]): string[] {
  const harita = new Map(INTAKE_KATALOGLARI[alan].map((s) => [s.key, s.label]))
  return secilenler.map((k) => harita.get(k) ?? k)
}
