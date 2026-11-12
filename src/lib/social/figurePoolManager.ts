import figuresPoolJson from '@/data/social/figuresPool.json'
import type { SpotlightCardData } from '@/types/social'
import { isBlacklistedFigure } from './bookCovers'

export interface PoolFigureBadge {
  text: string
  color: 'green' | 'blue' | 'purple' | 'rose' | 'amber'
}

export interface PoolFigureItem {
  id: string
  name: string
  title: string
  category: string
  quote: string
  quoteSecondary?: string
  explanation: string
  badges: PoolFigureBadge[]
  watermarkLetters: [string, string]
  keywords: string[]
  imageUrl?: string
}

export interface FiguresPoolData {
  version: string
  total: number
  figures: PoolFigureItem[]
}

const POOL: FiguresPoolData = figuresPoolJson as unknown as FiguresPoolData

/**
 * Havuzdaki tüm ünlüleri / düşünürleri döner (kara listedekiler elenir)
 */
export function getAllPoolFigures(): PoolFigureItem[] {
  return POOL.figures.filter((f) => !isBlacklistedFigure(f.name))
}

/**
 * Kategoriye göre ünlüleri döner
 */
export function getPoolFiguresByCategory(category: string): PoolFigureItem[] {
  return getAllPoolFigures().filter((f) => f.category.toLowerCase().includes(category.toLowerCase()))
}

/**
 * İsim veya anahtar kelimeye göre havuzdan ünlü arar
 */
export function findFigureInPool(query: string): PoolFigureItem | null {
  if (!query) return null
  const q = query
    .toLocaleLowerCase('tr-TR')
    .replace(/['"’`.,!?()-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const all = getAllPoolFigures()

  // 1. Tam isim veya unvan eşleşmesi
  for (const figure of all) {
    const n = figure.name.toLocaleLowerCase('tr-TR')
    const t = figure.title.toLocaleLowerCase('tr-TR')
    if (q === n || q.includes(n) || n.includes(q) || q.includes(t)) {
      return figure
    }
  }

  // 2. Anahtar kelimeler
  for (const figure of all) {
    for (const kw of figure.keywords) {
      if (q.includes(kw.toLocaleLowerCase('tr-TR'))) {
        return figure
      }
    }
  }

  return null
}

/**
 * Belirli bir seed veya index'e göre ünlü seçer
 */
export function pickPoolFigure(seed: number = 1): PoolFigureItem {
  const list = getAllPoolFigures()
  if (list.length === 0) return POOL.figures[0]
  const idx = Math.abs(seed - 1) % list.length
  return list[idx]
}

/**
 * PoolFigureItem'ı haftanın motivasyonu SpotlightCardData formatına dönüştürür
 */
export function convertFigureToSpotlightData(figure: PoolFigureItem): SpotlightCardData {
  const imgSlug = figure.name
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
    category: 'motivation',
    categoryPill: 'HAFTANIN MOTİVASYONU',
    watermarkLetters: figure.watermarkLetters,
    title: figure.name,
    subtitle: `(${figure.title})`,
    quote: figure.quote,
    quoteSecondary: figure.quoteSecondary,
    explanation: figure.explanation,
    badges: figure.badges,
    footerClub: 'DersoLab Rehberlik Kulübü',
    footerCredit: 'DersoLab 2026',
    imageUrl: figure.imageUrl || `/spotlight/${imgSlug}.jpg`,
  }
}
