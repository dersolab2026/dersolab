import type { MetadataRoute } from 'next'

const TABAN = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dersolab.com'

type Kayit = { yol: string; oncelik: number; siklik: MetadataRoute.Sitemap[number]['changeFrequency'] }

const SAYFALAR: Kayit[] = [
  { yol: '', oncelik: 1.0, siklik: 'weekly' },        // ana sayfa
  { yol: '/instructors', oncelik: 0.9, siklik: 'weekly' },
  { yol: '/kocluk', oncelik: 0.9, siklik: 'weekly' },
  { yol: '/demo-ders', oncelik: 0.9, siklik: 'monthly' },
  { yol: '/lab', oncelik: 0.85, siklik: 'weekly' },
  { yol: '/lab/matematik', oncelik: 0.75, siklik: 'monthly' },
  { yol: '/lab/fizik', oncelik: 0.75, siklik: 'monthly' },
  { yol: '/lab/kimya', oncelik: 0.75, siklik: 'monthly' },
  { yol: '/lab/biyoloji', oncelik: 0.75, siklik: 'monthly' },
  { yol: '/lab/turkce', oncelik: 0.75, siklik: 'monthly' },
  { yol: '/lab/sosyal', oncelik: 0.75, siklik: 'monthly' },
  { yol: '/lab/ingilizce', oncelik: 0.75, siklik: 'monthly' },
  { yol: '/register', oncelik: 0.8, siklik: 'monthly' },
  { yol: '/hakkimizda', oncelik: 0.6, siklik: 'monthly' },
  { yol: '/contact', oncelik: 0.5, siklik: 'monthly' },
  { yol: '/terms', oncelik: 0.3, siklik: 'yearly' },
  { yol: '/privacy', oncelik: 0.3, siklik: 'yearly' },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const simdi = new Date()
  return SAYFALAR.map((s) => ({
    url: `${TABAN}${s.yol}`,
    lastModified: simdi,
    changeFrequency: s.siklik,
    priority: s.oncelik,
  }))
}
