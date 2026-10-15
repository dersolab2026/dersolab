'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { createClient } from '@/lib/supabase/client'

// Google OAuth girişi native'de sistem tarayıcısında tamamlanıyor (embedded
// WebView'de engelleniyor) ve https://dersolab.com/auth/callback'e gitse
// oturum WebView'in değil sistem tarayıcısının çerezlerine yazılırdı. Bunun
// yerine com.dersolab.app:// özel şemasını yakalayıp kodu doğrudan burada,
// WebView'in kendi Supabase istemcisiyle değiştiriyoruz.
export function NativeAuthBridge() {
  const router = useRouter()

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    const listenerPromise = App.addListener('appUrlOpen', async ({ url }) => {
      if (url.includes('calendar_connected') || url.includes('calendar/callback')) {
        await Browser.close().catch(() => {})
        router.replace('/dashboard/instructor/settings?calendar_connected=1')
        router.refresh()
        return
      }

      if (!url.includes('auth/callback')) return
      const code = new URL(url).searchParams.get('code')
      await Browser.close().catch(() => {})
      if (code) {
        const supabase = createClient()
        await supabase.auth.exchangeCodeForSession(code)
      }
      router.replace('/dashboard')
      router.refresh()
    })

    return () => {
      listenerPromise.then((listener) => listener.remove())
    }
  }, [router])

  return null
}
