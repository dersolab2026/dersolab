import type { MetadataRoute } from 'next'

const TABAN = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dersolab.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard/',
        '/api/',
        '/auth/',
        '/social',
        '/canli-ders/',
        '/hesap-turu',
        '/terms/accept',
        '/tasarim',
        '/tasarim2',
        '/tasarim3',
        '/reset-password',
      ],
    },
    sitemap: `${TABAN}/sitemap.xml`,
  }
}
