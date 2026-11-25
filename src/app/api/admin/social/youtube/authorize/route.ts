import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createSignedOAuthState } from '@/lib/google/oauth-state'
import { getYouTubeConsentUrl } from '@/lib/google/youtube-oauth'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dersolab.com'
    const loginUrl = new URL('/login', appUrl)
    loginUrl.searchParams.set('next', '/api/admin/social/youtube/authorize')
    return NextResponse.redirect(loginUrl)
  }

  const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (userRow?.role !== 'admin') {
    return NextResponse.json({ error: 'Bu işlem yalnızca yöneticilere açıktır.' }, { status: 403 })
  }

  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return NextResponse.json(
      { error: 'GOOGLE_CLIENT_ID veya GOOGLE_CLIENT_SECRET tanımlı değil.' },
      { status: 503 }
    )
  }

  const state = createSignedOAuthState(user.id)
  const consentUrl = getYouTubeConsentUrl(state)

  const response = NextResponse.redirect(consentUrl)
  response.cookies.set('youtube_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 15,
    path: '/',
  })

  return response
}
