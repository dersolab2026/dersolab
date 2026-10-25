import booksPoolJson from '@/data/social/booksPool.json'

export interface PoolBookItem {
  id: string
  title: string
  author: string
  genre: string
  level: 'ortaokul' | 'lise'
  whyRead: string
  highlightTag: string
  imageUrl?: string
}

export interface BooksPoolData {
  version: string
  totalOrtaokul: number
  totalLise: number
  ortaokul: PoolBookItem[]
  lise: PoolBookItem[]
}

// Kullanıcının havuzdan kesin olarak kaldırılmasını istediği 15 yasaklı kitap listesi
export const BLACKLISTED_BOOKS: string[] = [
  'küçük kara balık',
  'kucuk kara balik',
  'fareler ve insanlar',
  'bilim öyküleri',
  'bilim oykuleri',
  'simyacı',
  'simyaci',
  'uçan sınıf',
  'ucan sinif',
  'kürk mantolu madonna',
  'kurk mantolu madonna',
  "mo'nun gizemi",
  'monun gizemi',
  'mo nun gizemi',
  'denemeler',
  'momo',
  'dava',
  'bu ülke',
  'bu ulke',
  'sol ayağım',
  'sol ayagim',
  'bulantı',
  'bulanti',
  'satranç',
  'satranc',
  'gece yarısı kütüphanesi',
  'gece yarisi kutuphanesi',
]

/**
 * Verilen kitap adının yasaklı / havuzdan kaldırılmış kitaplar arasında olup olmadığını kontrol eder.
 */
export function isBlacklistedBook(
  titleOrBook?: { title?: string; author?: string } | string | null
): boolean {
  if (!titleOrBook) return false
  const title = typeof titleOrBook === 'string' ? titleOrBook : titleOrBook.title || ''
  if (!title) return false
  const norm = title
    .toLocaleLowerCase('tr-TR')
    .replace(/['"’`]/g, '')
    .trim()
  return BLACKLISTED_BOOKS.some((bad) => {
    const cleanBad = bad
      .toLocaleLowerCase('tr-TR')
      .replace(/['"’`]/g, '')
      .trim()
    return norm === cleanBad || norm.includes(cleanBad) || cleanBad.includes(norm)
  })
}

const STORAGE_KEY = 'dersolab_used_books_pool_v2'
export const BOOK_POOL_EVENT = 'dersolab_book_pool_updated'

// Hafıza tabanlı yedek (SSR / Node.js veya localStorage erişilemeyen durumlar için)
const memoryUsedIds = new Set<string>()
const memoryUsedTitles = new Set<string>()

function normalizeTitle(title: string): string {
  return (title || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/['’"`]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Mevcut kitap havuzu verisini döner (1000 Ortaokul + 1000 Lise)
 */
export function getBooksPool(): BooksPoolData {
  return booksPoolJson as BooksPoolData
}

/**
 * LocalStorage veya bellekten kullanılan kitap kimliklerini ve başlıklarını çeker
 */
export function getUsedBookState(): { usedIds: Set<string>; usedTitles: Set<string> } {
  if (typeof window === 'undefined') {
    return {
      usedIds: new Set(memoryUsedIds),
      usedTitles: new Set(memoryUsedTitles),
    }
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return { usedIds: new Set(), usedTitles: new Set() }
    }
    const parsed = JSON.parse(raw) as { usedIds?: string[]; usedTitles?: string[] }
    return {
      usedIds: new Set(parsed.usedIds || []),
      usedTitles: new Set(parsed.usedTitles || []),
    }
  } catch {
    return { usedIds: new Set(), usedTitles: new Set() }
  }
}

function saveUsedBookState(usedIds: Set<string>, usedTitles: Set<string>): void {
  // Belleğe kaydet
  memoryUsedIds.clear()
  usedIds.forEach((id) => memoryUsedIds.add(id))

  memoryUsedTitles.clear()
  usedTitles.forEach((t) => memoryUsedTitles.add(t))

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          usedIds: Array.from(usedIds),
          usedTitles: Array.from(usedTitles),
          updatedAt: new Date().toISOString(),
        })
      )
      window.dispatchEvent(new CustomEvent(BOOK_POOL_EVENT))
    } catch (e) {
      console.warn('LocalStorage save failed for book pool:', e)
    }
  }
}

/**
 * Bir kitabın daha önce kullanılıp kullanılmadığını veya kara listede olup olmadığını kontrol eder
 */
export function isBookUsed(book: { id?: string; title: string }): boolean {
  if (!book || !book.title) return true
  if (isBlacklistedBook(book.title)) return true

  const { usedIds, usedTitles } = getUsedBookState()
  if (book.id && usedIds.has(book.id)) return true

  const norm = normalizeTitle(book.title)
  if (usedTitles.has(norm)) return true

  return false
}

/**
 * Bir kitabı kullanıldı olarak işaretler ve havuzdan kalıcı olarak çıkarır
 */
export function markBookAsUsed(bookOrTitle: { id?: string; title: string } | string): void {
  const { usedIds, usedTitles } = getUsedBookState()

  if (typeof bookOrTitle === 'string') {
    usedTitles.add(normalizeTitle(bookOrTitle))
  } else {
    if (bookOrTitle.id) usedIds.add(bookOrTitle.id)
    if (bookOrTitle.title) usedTitles.add(normalizeTitle(bookOrTitle.title))
  }

  saveUsedBookState(usedIds, usedTitles)
}

/**
 * Bir çift kitabı (Ortaokul + Lise) aynı anda kullanıldı olarak işaretler ve havuzdan çıkarır
 */
export function markPairAsUsed(pair: {
  ortaokul: { id?: string; title: string }
  lise: { id?: string; title: string }
}): void {
  const { usedIds, usedTitles } = getUsedBookState()

  if (pair.ortaokul) {
    if (pair.ortaokul.id) usedIds.add(pair.ortaokul.id)
    if (pair.ortaokul.title) usedTitles.add(normalizeTitle(pair.ortaokul.title))
  }

  if (pair.lise) {
    if (pair.lise.id) usedIds.add(pair.lise.id)
    if (pair.lise.title) usedTitles.add(normalizeTitle(pair.lise.title))
  }

  saveUsedBookState(usedIds, usedTitles)
}

/**
 * Kullanılan kitap havuzunu sıfırlar (tüm 1000'er kitap tekrar kullanılabilir olur)
 */
export function resetUsedPool(level?: 'ortaokul' | 'lise'): void {
  const pool = getBooksPool()
  const { usedIds, usedTitles } = getUsedBookState()

  if (!level) {
    usedIds.clear()
    usedTitles.clear()
    saveUsedBookState(usedIds, usedTitles)
    return
  }

  const targetList = pool[level] || []
  for (const b of targetList) {
    usedIds.delete(b.id)
    usedTitles.delete(normalizeTitle(b.title))
  }

  saveUsedBookState(usedIds, usedTitles)
}

/**
 * Henüz kullanılmamış ve kara listede olmayan kitapları listeler
 */
export function getAvailableBooks(level: 'ortaokul' | 'lise'): PoolBookItem[] {
  const pool = getBooksPool()
  const list = pool[level] || []
  const { usedIds, usedTitles } = getUsedBookState()

  return list.filter((b) => {
    if (isBlacklistedBook(b.title)) return false
    if (usedIds.has(b.id)) return false
    if (usedTitles.has(normalizeTitle(b.title))) return false
    return true
  })
}

/**
 * Havuzun güncel istatistiklerini döner (Toplam, Kullanılan, Kalan)
 */
export function getPoolStats(): {
  ortaokul: { total: number; used: number; remaining: number }
  lise: { total: number; used: number; remaining: number }
} {
  const pool = getBooksPool()
  const availableOrt = getAvailableBooks('ortaokul')
  const availableLis = getAvailableBooks('lise')

  return {
    ortaokul: {
      total: pool.ortaokul.length,
      used: pool.ortaokul.length - availableOrt.length,
      remaining: availableOrt.length,
    },
    lise: {
      total: pool.lise.length,
      used: pool.lise.length - availableLis.length,
      remaining: availableLis.length,
    },
  }
}

/**
 * Sıradaki kullanılmamış tekil kitabı seçer ve otomatik olarak havuzdan çıkarır (kullanıldı işaretler)
 */
export function pickNextSingleBook(
  level: 'ortaokul' | 'lise',
  autoMarkUsed: boolean = true
): PoolBookItem {
  let available = getAvailableBooks(level)
  const pool = getBooksPool()

  // Eğer tüm kitaplar tükendiyse havuzu sıfırla ve baştan başla
  if (available.length === 0) {
    resetUsedPool(level)
    available = getAvailableBooks(level)
  }

  const selected = available.length > 0 ? available[0] : pool[level][0]

  if (autoMarkUsed && selected) {
    markBookAsUsed(selected)
  }

  return selected
}

/**
 * Sıradaki kullanılmamış 1 Ortaokul ve 1 Lise kitabını seçer,
 * otomatik olarak havuzdan çıkarır (kullanıldı işaretler) ve çift olarak döner.
 */
export function pickNextBookPair(
  excludeSummary: string = '',
  seed: number = 1,
  autoMarkUsed: boolean = true
): { ortaokul: PoolBookItem; lise: PoolBookItem } {
  let availableOrt = getAvailableBooks('ortaokul')
  let availableLis = getAvailableBooks('lise')
  const pool = getBooksPool()

  // Eğer tükenmişse sıfırla
  if (availableOrt.length === 0) {
    resetUsedPool('ortaokul')
    availableOrt = getAvailableBooks('ortaokul')
  }
  if (availableLis.length === 0) {
    resetUsedPool('lise')
    availableLis = getAvailableBooks('lise')
  }

  const excludeLower = (excludeSummary || '').toLocaleLowerCase('tr-TR')

  // excludeSummary'de yer almayan ilk kullanılmamış kitabı bul
  let ort = availableOrt.find(
    (b) => !excludeLower.includes(b.title.toLocaleLowerCase('tr-TR'))
  )
  if (!ort) ort = availableOrt[0] || pool.ortaokul[0]

  let lis = availableLis.find(
    (b) => !excludeLower.includes(b.title.toLocaleLowerCase('tr-TR'))
  )
  if (!lis) lis = availableLis[0] || pool.lise[0]

  if (autoMarkUsed) {
    markPairAsUsed({ ortaokul: ort, lise: lis })
  }

  return { ortaokul: ort, lise: lis }
}
