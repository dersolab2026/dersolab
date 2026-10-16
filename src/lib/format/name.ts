/**
 * Türkçe kurallarına uygun olarak ad ve soyadların baş harflerini büyütür,
 * kalan harfleri küçültür (Title Case).
 *
 * Örn:
 * - "FERAHNAZ ÖZHELVACI" -> "Ferahnaz Özhelvacı"
 * - "selin köksal"       -> "Selin Köksal"
 * - "ışıl şeker"         -> "Işıl Şeker"
 * - "ilker özcan"        -> "İlker Özcan"
 * - "mehmet-ali"         -> "Mehmet-Ali"
 */
export function formatTurkishTitleCase(input: string): string {
  if (!input) return ''
  return input
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (!word) return ''
      if (word.includes('-')) {
        return word
          .split('-')
          .map((sub) => (sub ? sub.charAt(0).toLocaleUpperCase('tr-TR') + sub.slice(1).toLocaleLowerCase('tr-TR') : ''))
          .join('-')
      }
      return word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1).toLocaleLowerCase('tr-TR')
    })
    .join(' ')
}
