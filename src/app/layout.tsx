import './globals.css'
import type { ReactNode } from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-sans' })

export const metadata = {
  title: 'DersoLab',
  description: 'LGS ve YKS öğrencileri için online özel ders ve kamp platformu',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}
