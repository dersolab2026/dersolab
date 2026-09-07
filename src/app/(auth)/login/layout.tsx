import type { ReactNode } from 'react'

/**
 * Sayfa istemci bileseni oldugu icin metadata'yi kendisi disa aktaramiyor;
 * duzen katmani bunun icin var. Basliksiz kaldiginda arama motoru kok
 * duzenin genel basligini kullaniyordu ve sonuclarda dort ayri sayfa ayni
 * isimle gorunuyordu.
 */
export const metadata = {
  title: 'Giriş Yap',
  description: 'DersoLab hesabına giriş yap.',
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: '/login',
  },
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
