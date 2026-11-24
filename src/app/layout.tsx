import './globals.css'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'
import { NativeAuthBridge } from '@/components/native/NativeAuthBridge'
import { ToastProvider } from '@/components/ui/Toast'

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-sans' })

const TABAN = process.env.NEXT_PUBLIC_APP_URL ?? 'https://dersolab.com'

/**
 * Onceden yalnizca title ve description vardi. Iki sonucu vardi:
 *
 * 1. WhatsApp, Telegram ve sosyal medyada paylasilan her baglanti
 *    onizlemesiz, ciplak bir adres olarak goruniyordu. Ogrenci kazanimi
 *    buyuk olcude paylasimdan geliyorsa bu dogrudan kayip.
 * 2. Arama sonucunda baslik yalnizca "DersoLab" yaziyordu — ne yaptigini
 *    anlatmiyordu.
 *
 * `template` alt sayfalarin kendi basligini koruyup sonuna markayi
 * ekliyor; `default` yalnizca kendi basligi olmayan sayfalarda devreye
 * giriyor.
 *
 * Paylasim gorseli src/app/opengraph-image.png — Next bu dosyayi konuma
 * gore otomatik olarak og:image ve twitter:image yapiyor, elle url
 * yazmaya gerek yok.
 */
export const metadata = {
  metadataBase: new URL(TABAN),
  title: {
    default: 'DersoLab — Öğrenciler İçin Online Özel Ders ve Koçluk',
    template: '%s — DersoLab',
  },
  description:
    'Onaylı eğitmenlerle bire bir online ders, deneme analizi ve koçluk. Aylık abonelik yok, kullanmadığın kredi yanmaz.',
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    siteName: 'DersoLab',
    url: TABAN,
    title: 'DersoLab — Öğrenciler İçin Online Özel Ders ve Koçluk',
    description:
      'Onaylı eğitmenlerle bire bir online ders, deneme analizi ve koçluk. Aylık abonelik yok, kullanmadığın kredi yanmaz.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DersoLab — Öğrenciler İçin Online Özel Ders ve Koçluk',
    description:
      'Onaylı eğitmenlerle bire bir online ders, deneme analizi ve koçluk. Aylık abonelik yok, kullanmadığın kredi yanmaz.',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'EducationalOrganization',
        '@id': `${TABAN}/#organization`,
        name: 'DersoLab',
        url: TABAN,
        logo: `${TABAN}/dersolab-mark-512.png`,
        description:
          'LGS ve YKS hazırlığında onaylı eğitmenlerle bire bir online özel ders, akademik koçluk ve Maarif Modeli uyumlu L.A.B. simülasyonları.',
        sameAs: [
          'https://www.instagram.com/dersolabegitim/',
          'https://www.tiktok.com/@dersolabegitim',
          'https://www.youtube.com/channel/UC9YAcbRIPALgsMEjiORUEFQ',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'destek@dersolab.com',
          contactType: 'customer support',
          availableLanguage: 'Turkish',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${TABAN}/#website`,
        url: TABAN,
        name: 'DersoLab',
        inLanguage: 'tr-TR',
        publisher: { '@id': `${TABAN}/#organization` },
      },
    ],
  }

  return (
    <html lang="tr" className={inter.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c'),
          }}
        />
        <ToastProvider>
          {children}
          <WhatsAppButton />
          <NativeAuthBridge />
        </ToastProvider>
      </body>
    </html>
  )
}
