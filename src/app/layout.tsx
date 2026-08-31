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
  alternates: {
    canonical: '/',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={inter.variable}>
      <body>
        <ToastProvider>
          {children}
          <WhatsAppButton />
          <NativeAuthBridge />
        </ToastProvider>
      </body>
    </html>
  )
}
