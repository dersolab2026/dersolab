export const LESSON_DURATION_MINUTES = 40
export const TRIAL_LESSON_DURATION_MINUTES = 20

export const GUIDANCE_SUBJECT = 'Koçluk'

// Eğitmen Bul / marketplace branş filtresinde kategori başlıklarıyla gösterilen dersler.
export const SUBJECT_CATEGORIES = [
  {
    label: 'Sözel',
    subjects: ['Lise Türkçe', 'Ortaokul Türkçe', 'Türk Dili ve Edebiyatı', 'Tarih', 'Coğrafya', 'Sosyal Bilgiler'],
  },
  {
    label: 'Sayısal',
    subjects: ['Lise Matematik', 'Ortaokul Matematik', 'Geometri', 'Fen Bilimleri', 'Fizik', 'Kimya', 'Biyoloji'],
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
