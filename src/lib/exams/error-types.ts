/**
 * Yanlislarin tip kirilimi.
 *
 * Bu tanimlar actions/exam-results.ts icinde duramiyor: o dosya 'use server'
 * ve Next yalnizca async fonksiyon export'una izin veriyor — sabit bir nesne
 * export etmek uretim derlemesini kiriyor (typecheck bunu yakalamiyor).
 */

export interface ErrorTypeCounts {
  knowledge: number   // konuyu bilmiyordum
  careless: number    // dikkat / islem hatasi
  misread: number     // soruyu yanlis okudum-yorumladim
  timeout: number     // sure yetmedi
}

export const ERROR_TYPE_LABELS: Record<keyof ErrorTypeCounts, string> = {
  knowledge: 'Bilmiyordum',
  careless: 'Dikkat hatası',
  misread: 'Yanlış yorumladım',
  timeout: 'Süre yetmedi',
}

/** Baskin hata tipine gore kocun/ogrencinin ne yapmasi gerektigi. */
export const ERROR_TYPE_PRESCRIPTION: Record<keyof ErrorTypeCounts, string> = {
  knowledge: 'Yanlışlarının çoğu bilgi eksiğinden — konu tekrarı öncelikli.',
  careless: 'Yanlışlarının çoğu dikkat hatası — işlem kontrolü rutini kurmak gerek.',
  misread: 'Yanlışlarının çoğu soruyu yanlış anlamaktan — soru okuma tekniği çalışılmalı.',
  timeout: 'Yanlışlarının çoğu süreden — deneme sırasında tur stratejisi gerekiyor.',
}
