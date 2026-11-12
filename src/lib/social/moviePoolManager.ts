import moviesPoolJson from '@/data/social/moviesPool.json'
import type { SpotlightCardData } from '@/types/social'
import { isBlacklistedMovie } from './bookCovers'

export interface PoolMovieBadge {
  text: string
  color: 'green' | 'blue' | 'purple' | 'rose' | 'amber'
}

export interface PoolMovieItem {
  id: string
  title: string
  originalTitle: string
  director: string
  year: number
  imdb: string
  genre: string
  level: 'ortaokul' | 'lise'
  whyWatch: string
  quote: string
  quoteSecondary?: string
  badges: PoolMovieBadge[]
  watermarkLetters: [string, string]
  keywords: string[]
  imageUrl?: string
}

export interface MoviesPoolData {
  version: string
  total: number
  totalOrtaokul: number
  totalLise: number
  movies: PoolMovieItem[]
}

const POOL: MoviesPoolData = moviesPoolJson as unknown as MoviesPoolData

/**
 * Havuzdaki tüm filmleri döner (kara listedekiler filtrelenir)
 */
export function getAllPoolMovies(): PoolMovieItem[] {
  return POOL.movies.filter((m) => !isBlacklistedMovie(m.title) && !isBlacklistedMovie(m.originalTitle))
}

/**
 * Seviyeye göre filmleri döner
 */
export function getPoolMoviesByLevel(level: 'ortaokul' | 'lise'): PoolMovieItem[] {
  return getAllPoolMovies().filter((m) => m.level === level)
}

/**
 * İsme veya anahtar kelimeye göre havuzdan film arar
 */
export function findMovieInPool(query: string): PoolMovieItem | null {
  if (!query) return null
  const q = query
    .toLocaleLowerCase('tr-TR')
    .replace(/['"’`.,!?()-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const all = getAllPoolMovies()

  // 1. Tam başlık veya orijinal başlık eşleşmesi
  for (const movie of all) {
    const t = movie.title.toLocaleLowerCase('tr-TR')
    const o = movie.originalTitle.toLocaleLowerCase('tr-TR')
    if (q === t || q === o || q.includes(t) || t.includes(q)) {
      return movie
    }
  }

  // 2. Anahtar kelimeler
  for (const movie of all) {
    for (const kw of movie.keywords) {
      if (q.includes(kw.toLocaleLowerCase('tr-TR'))) {
        return movie
      }
    }
  }

  return null
}

/**
 * Belirli bir seed veya index'e göre film seçer
 */
export function pickPoolMovie(seed: number = 1, level?: 'ortaokul' | 'lise'): PoolMovieItem {
  const list = level ? getPoolMoviesByLevel(level) : getAllPoolMovies()
  if (list.length === 0) return POOL.movies[0]
  const idx = Math.abs(seed - 1) % list.length
  return list[idx]
}

/**
 * PoolMovieItem'ı tam teşekküllü Yukarı Bak formatındaki SpotlightCardData'ya dönüştürür
 */
export function convertMovieToSpotlightData(movie: PoolMovieItem): SpotlightCardData {
  const imgSlug = movie.title
    .toLocaleLowerCase('tr-TR')
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^a-z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')

  return {
    category: 'movie',
    categoryPill: 'HAFTANIN FİLMİ',
    watermarkLetters: movie.watermarkLetters,
    title: movie.title,
    subtitle: `(${movie.originalTitle.replace(/\s*\(\d{4}\)$/, '')}, ${movie.year})`,
    ratingOrBadge: `⭐ ${movie.imdb} / 10`,
    quote: movie.quote,
    quoteSecondary: movie.quoteSecondary,
    explanation: movie.whyWatch,
    badges: movie.badges,
    footerClub: 'DersoLab Sinema Kulübü',
    footerCredit: `Yönetmen: ${movie.director}`,
    imageUrl: movie.imageUrl || `/spotlight/${imgSlug}.jpg`,
  }
}
