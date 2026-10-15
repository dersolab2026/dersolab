import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getGoogleConsentUrl } from '@/lib/google/oauth-client'
import { createSignedOAuthState } from '@/lib/google/oauth-state'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_APP_URL))
  }

  const state = createSignedOAuthState(user.id)
  const consentUrl = getGoogleConsentUrl(state)

  const response = NextResponse.redirect(consentUrl)
  response.cookies.set('google_oauth_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 900,
  })
  return response
}
