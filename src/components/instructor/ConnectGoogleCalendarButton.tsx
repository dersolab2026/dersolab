'use client'

import { useEffect } from 'react'
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { Check } from 'lucide-react'
import { INSTRUCTOR_BUTTON_PRIMARY, PIXEL_BUTTON_SECONDARY } from '@/lib/theme'

interface ConnectGoogleCalendarButtonProps {
  isConnected: boolean
}

// Google, OAuth ekranını gömülü (Android) WebView içinde açmayı reddediyor
// ("disallowed_useragent"). Native uygulamada bu yüzden akışı sistem
// tarayıcısında (Chrome Custom Tabs) açıyoruz; kullanıcı tarayıcıyı kapatıp
// uygulamaya döndüğünde sayfayı yeniden yükleyip bağlantı durumunu tazeliyoruz.
export function ConnectGoogleCalendarButton({ isConnected }: ConnectGoogleCalendarButtonProps) {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return
    const listener = Browser.addListener('browserFinished', () => {
      window.location.reload()
    })
    return () => {
      listener.then((l) => l.remove())
    }
  }, [])

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!Capacitor.isNativePlatform()) return
    e.preventDefault()
    await Browser.open({ url: new URL('/api/google/authorize', window.location.origin).toString() })
  }

  if (isConnected) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className={`${PIXEL_BUTTON_SECONDARY} gap-2 px-4 py-2 opacity-70`}>
          <Check className="h-4 w-4" />
          Google Takvimi bağlı
        </span>
        <a href="/api/google/authorize" onClick={handleClick} className="text-sm font-bold underline text-slate-200">
          Yeniden Bağla
        </a>
      </div>
    )
  }

  return (
    <a href="/api/google/authorize" onClick={handleClick} className={`${INSTRUCTOR_BUTTON_PRIMARY} px-4 py-2`}>
      Google Takvimini Bağla
    </a>
  )
}
