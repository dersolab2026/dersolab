import './globals.css'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'DersoLab',
  description: 'LGS ve YKS öğrencileri için online özel ders ve kamp platformu',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
