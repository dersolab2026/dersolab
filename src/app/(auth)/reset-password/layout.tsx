import type { ReactNode } from 'react'

/**
 * Sayfa istemci bileseni oldugu icin metadata'yi kendisi disa aktaramiyor;
 * duzen katmani bunun icin var. Basliksiz kaldiginda arama motoru kok
 * duzenin genel basligini kullaniyordu ve sonuclarda dort ayri sayfa ayni
 * isimle gorunuyordu.
 */
export const metadata = {
  title: 'Yeni Şifre Belirle',
  description: 'Hesabın için yeni bir şifre belirle.',
}

export default function Layout({ children }: { children: ReactNode }) {
  return children
}
