import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createGoogleOAuthClient } from '@/lib/google/oauth-client'
import { verifySignedOAuthState } from '@/lib/google/oauth-state'

export async function GET(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!
  const settingsUrl = new URL('/dashboard/instructor/settings', appUrl)

  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')
  const savedState = request.cookies.get('google_oauth_state')?.value

  if (!code || !state) {
    settingsUrl.searchParams.set('calendar_error', 'invalid_state')
    return NextResponse.redirect(settingsUrl)
  }

  // 1. İmzalı HMAC state her durumda geçerli olmalı
  const { valid: isSignedValid, userId: signedUserId } = verifySignedOAuthState(state)
  const isCookieMatch = Boolean(savedState && state === savedState)

  if (!isSignedValid || !signedUserId) {
    settingsUrl.searchParams.set('calendar_error', 'invalid_state')
    return NextResponse.redirect(settingsUrl)
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Tarayıcıda aktif bir oturum varsa: state içindeki kullanıcı kimliği oturumla BİREBİR eşleşmeli
  // ve masaüstü akışında çerez varsa çerez de eşleşmeli (çapraz hesap takvim bağlama / CSRF engeli).
  if (user) {
    if (user.id !== signedUserId || (savedState && !isCookieMatch)) {
      settingsUrl.searchParams.set('calendar_error', 'invalid_state')
      return NextResponse.redirect(settingsUrl)
    }
  } else if (savedState && !isCookieMatch) {
    settingsUrl.searchParams.set('calendar_error', 'invalid_state')
    return NextResponse.redirect(settingsUrl)
  }

  const targetUserId = signedUserId

  const admin = createAdminClient()
  const { data: instructor } = await admin
    .from('instructors')
    .select('user_id')
    .eq('user_id', targetUserId)
    .maybeSingle()

  if (!instructor) {
    settingsUrl.searchParams.set('calendar_error', 'not_instructor')
    return NextResponse.redirect(settingsUrl)
  }

  try {
    const oauthClient = createGoogleOAuthClient()
    const { tokens } = await oauthClient.getToken(code)

    if (!tokens.access_token || !tokens.expiry_date) {
      throw new Error('Google yanıtında beklenen alanlar eksik')
    }

    // Doğrudan admin client ile takvim kimlik bilgilerini upsert et
    const { error: upsertError } = await admin
      .from('instructor_calendar_credentials')
      .upsert(
        {
          instructor_id: targetUserId,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token ?? undefined,
          expires_at: new Date(tokens.expiry_date).toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'instructor_id' }
      )

    if (upsertError) throw upsertError

    // refresh_token kontrolü
    const { data: cred } = await admin
      .from('instructor_calendar_credentials')
      .select('refresh_token')
      .eq('instructor_id', targetUserId)
      .single()

    if (!cred?.refresh_token) {
      throw new Error('missing_refresh_token')
    }

    await admin.from('instructors').update({ calendar_connected: true }).eq('user_id', targetUserId)

    settingsUrl.searchParams.set('calendar_connected', '1')
  } catch (err) {
    console.error('Google Calendar bağlantı hatası:', err)
    const message = err instanceof Error ? err.message : ''
    if (message.includes('missing_refresh_token')) {
      settingsUrl.searchParams.set('calendar_error', 'missing_refresh_token')
    } else {
      settingsUrl.searchParams.set('calendar_error', 'token_exchange_failed')
    }
  }

  const response = NextResponse.redirect(settingsUrl)
  response.cookies.delete('google_oauth_state')
  return response
}
