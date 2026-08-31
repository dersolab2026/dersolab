import type { MetadataRoute } from 'next'

/**
 * /robots.txt
 *
 * Onceden 404 donuyordu. Tarayicilar icin bu "her seyi tara" demek —
 * engel degil ama panel ve API yollarinin taranmamasi gerektigini de
 * hicbir yerde soylemiyorduk.
 *
 * Disallow listesi gizlilik icin DEGIL, gurultu icin: o yollar zaten
 * giris istiyor ve tarayiciya /login gosteriyorlar. Tarama butcesini
 * ayni yonlendirmeyi yuzlerce kez gormeye harcamalarinin anlami yok.
 * Gercek koruma her zaman sunucu tarafinda.
 */
const TABAN = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dersolab.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/api/', '/auth/', '/hesap-turu', '/terms/accept'],
    },
    sitemap: `${TABAN}/sitemap.xml`,
  }
}
