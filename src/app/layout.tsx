import './globals.css'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import { WhatsAppButton } from '@/components/layout/WhatsAppButton'

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-sans' })

export const metadata = {
  title: 'DersoLab',
  description: 'Öğrenciler için online özel ders ve rehberlik platformu',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={inter.variable}>
      <body>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  )
}
