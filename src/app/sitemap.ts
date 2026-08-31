import type { MetadataRoute } from 'next'

/**
 * /sitemap.xml
 *
 * Onceden 404 donuyordu.
 *
 * YALNIZCA GIRIS GEREKTIRMEYEN ICERIK SAYFALARI listeleniyor. Panel
 * rotalari, /kocluk ve /instructors disarida: ikisi de cikis yapmis
 * ziyaretciyi /login'e yonlendiriyor, yani tarayici icin bos sayfa.
 * Sitemap'e koymak "burada icerik var" demek olurdu ve olmayan bir sey
 * vaat etmek arama sonuclarinda da ceza getiriyor.
 *
 * Sifre sifirlama ve giris ekranlari da yok: aranacak bir icerikleri
 * yok, kullanici oraya zaten uygulamadan geliyor. Kayit sayfasi listede
 * cunku donusum sayfasi ve dogrudan aranabiliyor.
 *
 * lastModified elle yazilmiyor: derleme zamanini kullaniyoruz. Sabit bir
 * tarih yazsaydik icerik degistikce bayatlar ve yanlis bilgi verirdi.
 */
const TABAN = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dersolab.com'

type Kayit = { yol: string; oncelik: number; siklik: MetadataRoute.Sitemap[number]['changeFrequency'] }

const SAYFALAR: Kayit[] = [
  { yol: '', oncelik: 1.0, siklik: 'weekly' },        // ana sayfa
  { yol: '/demo-ders', oncelik: 0.9, siklik: 'monthly' },
  { yol: '/register', oncelik: 0.8, siklik: 'monthly' },
  { yol: '/hakkimizda', oncelik: 0.6, siklik: 'monthly' },
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
