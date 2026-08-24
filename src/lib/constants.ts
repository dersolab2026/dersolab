export const LESSON_DURATION_MINUTES = 40
export const TRIAL_LESSON_DURATION_MINUTES = 20

export const GUIDANCE_SUBJECT = 'Koçluk'

// Eğitmen Bul / marketplace branş filtresinde kategori başlıklarıyla gösterilen dersler.
export const SUBJECT_CATEGORIES = [
  {
    label: 'Sözel',
    subjects: ['Lise Türkçe', 'Ortaokul Türkçe', 'KPSS Türkçe', 'Türk Dili ve Edebiyatı', 'Tarih', 'Coğrafya', 'Sosyal Bilgiler'],
  },
  {
    label: 'Sayısal',
    subjects: ['Lise Matematik', 'Ortaokul Matematik', 'KPSS Matematik', 'Geometri', 'Fen Bilimleri', 'Fizik', 'Kimya', 'Biyoloji'],
  },
  {
    label: 'Dil',
    subjects: ['Ortaokul İngilizce', 'Lise İngilizce'],
  },
  {
    label: 'Beceri',
    subjects: ['Hızlı Okuma'],
  },
] as const

export const LESSON_SUBJECTS = SUBJECT_CATEGORIES.flatMap((c) => c.subjects)

// Eğitmenin profilinde seçebileceği branşlar — Koçluk marketplace filtresinde görünmez,
// ayrı bir sayfadan (Koçluk) erişilir.
export const INSTRUCTOR_SUBJECT_OPTIONS = [...LESSON_SUBJECTS, GUIDANCE_SUBJECT] as const

/**
 * Ana sayfadaki "Bizi takip edin" bolumunde gosterilen hesaplar.
 *
 * Liste bos oldugu surece bolum hic render edilmiyor; boylece olu link
 * yayina cikmiyor. Hesap eklemek icin asagiya bir satir yazmak yeterli:
 *   { platform: 'instagram', url: 'https://instagram.com/kullaniciadi' },
 * Desteklenen platform degerleri: instagram, youtube, tiktok, x, linkedin.
 */
export const SOCIAL_LINKS: { platform: SocialPlatform; url: string }[] = [
  { platform: 'instagram', url: 'https://www.instagram.com/dersolabegitim/' },
  { platform: 'tiktok', url: 'https://www.tiktok.com/@dersolabegitim' },
]

export type SocialPlatform = 'instagram' | 'youtube' | 'tiktok' | 'x' | 'linkedin'

export const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  x: 'X',
  linkedin: 'LinkedIn',
}
