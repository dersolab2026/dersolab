import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createGoogleOAuthClient } from '@/lib/google/oauth-client'

export async function GET(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!
  const settingsUrl = new URL('/dashboard/instructor/settings', appUrl)

  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')
  const savedState = request.cookies.get('google_oauth_state')?.value

  if (!code || !state || state !== savedState) {
    settingsUrl.searchParams.set('calendar_error', 'invalid_state')
    return NextResponse.redirect(settingsUrl)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', appUrl))
  }

  try {
    const oauthClient = createGoogleOAuthClient()
    const { tokens } = await oauthClient.getToken(code)

    if (!tokens.access_token || !tokens.expiry_date) {
      throw new Error('Google yanıtında beklenen alanlar eksik')
    }

    const { error } = await supabase.rpc('upsert_instructor_calendar_credentials', {
      p_access_token: tokens.access_token,
      p_refresh_token: tokens.refresh_token ?? null,
      p_expires_at: new Date(tokens.expiry_date).toISOString(),
    })

    if (error) throw error

    settingsUrl.searchParams.set('calendar_connected', '1')
  } catch (err) {
    console.error('Google Calendar bağlantı hatası:', err)
    const message = err instanceof Error ? err.message : ''
    if (message.includes('missing_refresh_token')) {
      // Google, bu hesap için daha önce zaten yetki verildiğinde refresh_token döndürmeyebilir.
      // Kullanıcı Google hesap izinlerinden DersoLab'ı kaldırıp tekrar bağlamalı.
      settingsUrl.searchParams.set('calendar_error', 'missing_refresh_token')
    } else {
      settingsUrl.searchParams.set('calendar_error', 'token_exchange_failed')
    }
  }

  const response = NextResponse.redirect(settingsUrl)
  response.cookies.delete('google_oauth_state')
  return response
}
