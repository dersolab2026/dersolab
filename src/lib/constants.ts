export const LESSON_DURATION_MINUTES = 40
export const TRIAL_LESSON_DURATION_MINUTES = 20

export const GUIDANCE_SUBJECT = 'Rehberlik'

// Eğitmen Bul / marketplace branş filtresinde gösterilen dersler.
export const LESSON_SUBJECTS = [
  'Lise Matematik', 'Ortaokul Matematik', 'Geometri', 'Fizik', 'Kimya', 'Biyoloji',
  'Lise Türkçe', 'Ortaokul Türkçe', 'Edebiyat', 'Tarih', 'Coğrafya',
  'Lise İngilizce', 'Ortaokul İngilizce', 'Fen Bilgisi', 'Sosyal Bilgiler',
] as const

// Eğitmenin profilinde seçebileceği branşlar — Rehberlik marketplace filtresinde görünmez,
// ayrı bir sayfadan (Rehberlik) erişilir.
export const INSTRUCTOR_SUBJECT_OPTIONS = [...LESSON_SUBJECTS, GUIDANCE_SUBJECT] as const
