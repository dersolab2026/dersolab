import { getTotalQuestions, type ExamTrack } from './structure'

export const EXAM_TYPES = ['lgs', 'tyt', 'ayt', 'ydt', 'kpss', 'dgs', 'ales'] as const
export type ExamType = (typeof EXAM_TYPES)[number]

export const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  lgs: 'LGS',
  tyt: 'TYT',
  ayt: 'AYT',
  ydt: 'YDT (Yabancı Dil)',
  kpss: 'KPSS',
  dgs: 'DGS',
  ales: 'ALES',
}

/**
 * Kac yanlisin bir dogruyu goturdugu. LGS'de 3 (MEB kilavuzu madde 11-b),
 * diger sinavlarda 4.
 */
const WRONG_PER_CORRECT: Record<ExamType, number> = {
  lgs: 3, tyt: 4, ayt: 4, ydt: 4, kpss: 4, dgs: 4, ales: 4,
}

/** OBP'nin yerlestirme puanina katki katsayisi (YKS). */
export const OBP_COEFFICIENT = 0.12

/** Tahmini puanin taban ve tavan degerleri (100–500 olcegi). */
const SCORE_FLOOR = 100
const SCORE_CEILING = 500

/**
 * Net = dogru − (yanlis / katsayi). Kesin hesap.
 * LGS ve YKS'de net DERS BAZINDA hesaplanir; toplam net, ders netlerinin
 * toplamidir. Bu yuzden bu fonksiyon tek bir ders icin cagrilir.
 */
export function calculateNet(examType: ExamType, correct: number, wrong: number): number {
  const net = correct - wrong / WRONG_PER_CORRECT[examType]
  return Math.round(net * 100) / 100
}

export interface SectionScore {
  name: string
  correct: number
  wrong: number
}

/** Ders netlerinin toplami. Negatif ders netleri de toplama dahil edilir. */
export function calculateTotalNet(examType: ExamType, sections: SectionScore[]): number {
  const toplam = sections.reduce((t, s) => t + calculateNet(examType, s.correct, s.wrong), 0)
  return Math.max(0, Math.round(toplam * 100) / 100)
}

/**
 * Nete gore TAHMINI sinav puani.
 *
 * ÖSYM'nin gercek puani adaylarin standart sapmasina dayaniyor ve sinav
 * bazinda degisiyor; disaridan birebir hesaplanamaz. Burada net ile puan
 * arasinda dogrusal bir yaklasim kullaniliyor (taban 100, tavan 500).
 * Arayuzde bu yuzden "tahmini" olarak etiketleniyor.
 */
export function estimateScore(examType: ExamType, net: number, track?: ExamTrack | null): number {
  const soruSayisi = getTotalQuestions(examType, track)
  if (soruSayisi === 0) return SCORE_FLOOR
  const perNet = (SCORE_CEILING - SCORE_FLOOR) / soruSayisi
  const puan = SCORE_FLOOR + Math.max(0, net) * perNet
  return Math.round(Math.min(SCORE_CEILING, puan) * 100) / 100
}

/** OBP yalnizca YKS oturumlarinin (TYT/AYT/YDT) yerlestirme puanina giriyor. */
export function supportsObp(examType: ExamType): boolean {
  return examType === 'tyt' || examType === 'ayt' || examType === 'ydt'
}

/**
 * Tahmini yerlestirme puani = tahmini sinav puani + OBP × 0.12.
 * OBP katkisi kesin bir kural; belirsizlik yalnizca sinav puani tarafinda.
 */
export function estimatePlacementScore(
  examType: ExamType,
  net: number,
  obp: number | null,
  track?: ExamTrack | null,
): number | null {
  if (!supportsObp(examType) || obp === null) return null
  return Math.round((estimateScore(examType, net, track) + obp * OBP_COEFFICIENT) * 100) / 100
}
