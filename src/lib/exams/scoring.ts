export const EXAM_TYPES = ['lgs', 'tyt', 'ayt', 'kpss', 'dgs', 'ales'] as const
export type ExamType = (typeof EXAM_TYPES)[number]

export const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  lgs: 'LGS',
  tyt: 'TYT',
  ayt: 'AYT',
  kpss: 'KPSS',
  dgs: 'DGS',
  ales: 'ALES',
}

/**
 * Kac yanlisin bir dogruyu goturdugu. LGS'de 3, diger sinavlarda 4.
 */
const WRONG_PER_CORRECT: Record<ExamType, number> = {
  lgs: 3, tyt: 4, ayt: 4, kpss: 4, dgs: 4, ales: 4,
}

/** Soru sayisi — tahmini puan hesabinda tavan icin kullaniliyor. */
const QUESTION_COUNT: Record<ExamType, number> = {
  lgs: 90, tyt: 120, ayt: 80, kpss: 120, dgs: 80, ales: 100,
}

/** OBP'nin yerlestirme puanina katki katsayisi (YKS). */
export const OBP_COEFFICIENT = 0.12

/** Tahmini puanin taban ve tavan degerleri (100–500 olceği). */
const SCORE_FLOOR = 100
const SCORE_CEILING = 500

/** Net = dogru − (yanlis / katsayi). Kesin hesap. */
export function calculateNet(examType: ExamType, correct: number, wrong: number): number {
  const net = correct - wrong / WRONG_PER_CORRECT[examType]
  return Math.max(0, Math.round(net * 100) / 100)
}

/**
 * Nete gore TAHMINI sinav puani.
 *
 * ÖSYM'nin gercek puani adaylarin standart sapmasina dayaniyor ve sinav
 * bazinda degisiyor; disaridan birebir hesaplanamaz. Burada net ile puan
 * arasinda dogrusal bir yaklasim kullaniyoruz (taban 100, tavan 500).
 * Sonuc bu yuzden arayuzde "tahmini" olarak etiketleniyor.
 */
export function estimateScore(examType: ExamType, net: number): number {
  const perNet = (SCORE_CEILING - SCORE_FLOOR) / QUESTION_COUNT[examType]
  const puan = SCORE_FLOOR + net * perNet
  return Math.round(Math.min(SCORE_CEILING, puan) * 100) / 100
}

/** OBP yalnizca YKS (TYT/AYT) yerlestirme puanina giriyor. */
export function supportsObp(examType: ExamType): boolean {
  return examType === 'tyt' || examType === 'ayt'
}

/**
 * Tahmini yerlestirme puani = tahmini sinav puani + OBP × 0.12.
 * OBP katkisi kesin bir kural; belirsizlik yalnizca sinav puani tarafinda.
 */
export function estimatePlacementScore(
  examType: ExamType,
  net: number,
  obp: number | null,
): number | null {
  if (!supportsObp(examType) || obp === null) return null
  return Math.round((estimateScore(examType, net) + obp * OBP_COEFFICIENT) * 100) / 100
}
