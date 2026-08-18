import type { ExamType } from './scoring'

/**
 * Sinavlarin ders bazli soru dagilimlari.
 *
 * Kaynak: MEB 2026 LGS Basvuru ve Uygulama Kilavuzu ile ÖSYM 2026-YKS,
 * KPSS, DGS ve ALES kilavuzlari. Her sinavin bolum toplami, o sinavin
 * toplam soru sayisina esittir.
 */

export type ExamTrack = 'sayisal' | 'ea' | 'sozel'

export const TRACK_LABELS: Record<ExamTrack, string> = {
  sayisal: 'Sayısal',
  ea: 'Eşit Ağırlık',
  sozel: 'Sözel',
}

export interface ExamSection {
  name: string
  questionCount: number
}

// Alandan bagimsiz sinavlar
const FLAT_SECTIONS: Partial<Record<ExamType, ExamSection[]>> = {
  lgs: [
    { name: 'Türkçe', questionCount: 20 },
    { name: 'Matematik', questionCount: 20 },
    { name: 'Fen Bilimleri', questionCount: 20 },
    { name: 'T.C. İnkılap Tarihi ve Atatürkçülük', questionCount: 10 },
    { name: 'Din Kültürü ve Ahlak Bilgisi', questionCount: 10 },
    { name: 'Yabancı Dil', questionCount: 10 },
  ],
  tyt: [
    { name: 'Türkçe', questionCount: 40 },
    { name: 'Temel Matematik', questionCount: 40 },
    { name: 'Sosyal Bilimler', questionCount: 20 },
    { name: 'Fen Bilimleri', questionCount: 20 },
  ],
  // YDT, YKS'nin ucuncu oturumu (AYT'nin bir testi degil). ÖSYM Tablo 1B'de
  // adlandirilmis alt testlere bolunmuyor, tek bir 80 soruluk test.
  ydt: [
    { name: 'Yabancı Dil', questionCount: 80 },
  ],
  kpss: [
    { name: 'Türkçe', questionCount: 30 },
    { name: 'Matematik', questionCount: 30 },
    { name: 'Tarih', questionCount: 27 },
    { name: 'Türkiye Coğrafyası', questionCount: 18 },
    { name: 'Vatandaşlık', questionCount: 9 },
    { name: 'Güncel Bilgiler', questionCount: 6 },
  ],
  dgs: [
    { name: 'Sayısal Bölüm', questionCount: 50 },
    { name: 'Sözel Bölüm', questionCount: 50 },
  ],
  ales: [
    { name: 'Sayısal Testi', questionCount: 50 },
    { name: 'Sözel Testi', questionCount: 50 },
  ],
}

// AYT'de aday alanina gore farkli testleri cozer; her alanda toplam 80 soru.
const AYT_SECTIONS: Record<ExamTrack, ExamSection[]> = {
  sayisal: [
    { name: 'Matematik', questionCount: 40 },
    { name: 'Fizik', questionCount: 14 },
    { name: 'Kimya', questionCount: 13 },
    { name: 'Biyoloji', questionCount: 13 },
  ],
  ea: [
    { name: 'Matematik', questionCount: 40 },
    { name: 'Türk Dili ve Edebiyatı', questionCount: 24 },
    { name: 'Tarih-1', questionCount: 10 },
    { name: 'Coğrafya-1', questionCount: 6 },
  ],
  sozel: [
    { name: 'Türk Dili ve Edebiyatı', questionCount: 24 },
    { name: 'Tarih-1', questionCount: 10 },
    { name: 'Coğrafya-1', questionCount: 6 },
    { name: 'Tarih-2', questionCount: 11 },
    { name: 'Coğrafya-2', questionCount: 11 },
    { name: 'Felsefe Grubu', questionCount: 12 },
    { name: 'Din Kültürü ve Ahlak Bilgisi', questionCount: 6 },
  ],
}

/** AYT alan secimi gerektiriyor; digerleri gerektirmiyor. */
export function requiresTrack(examType: ExamType): boolean {
  return examType === 'ayt'
}

/** Secilen sinav (ve gerekiyorsa alan) icin ders listesi. */
export function getExamSections(examType: ExamType, track?: ExamTrack | null): ExamSection[] {
  if (examType === 'ayt') return AYT_SECTIONS[track ?? 'sayisal']
  return FLAT_SECTIONS[examType] ?? []
}

/** Ders sayilarindan turetilen toplam soru sayisi. */
export function getTotalQuestions(examType: ExamType, track?: ExamTrack | null): number {
  return getExamSections(examType, track).reduce((t, s) => t + s.questionCount, 0)
}
