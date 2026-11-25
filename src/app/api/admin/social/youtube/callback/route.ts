import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createClient } from '@/lib/supabase/server'
import { verifySignedOAuthState } from '@/lib/google/oauth-state'
import {
  createYouTubeOAuthClient,
  loadYouTubeCredentials,
  saveYouTubeCredentials,
} from '@/lib/google/youtube-oauth'

export async function GET(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dersolab.com'
  const socialUrl = new URL('/dashboard/admin/social', appUrl)

  const code = request.nextUrl.searchParams.get('code')
  const state = request.nextUrl.searchParams.get('state')
  const oauthError = request.nextUrl.searchParams.get('error')
  const savedState = request.cookies.get('youtube_oauth_state')?.value

  if (oauthError) {
    socialUrl.searchParams.set('youtube_error', oauthError)
    const res = NextResponse.redirect(socialUrl)
    res.cookies.delete('youtube_oauth_state')
    return res
  }

  if (!code || !state || !savedState || state !== savedState) {
    socialUrl.searchParams.set('youtube_error', 'invalid_state')
    return NextResponse.redirect(socialUrl)
  }

  const { valid, userId: signedUserId } = verifySignedOAuthState(state)
  if (!valid || !signedUserId) {
    socialUrl.searchParams.set('youtube_error', 'invalid_state')
    return NextResponse.redirect(socialUrl)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.id !== signedUserId) {
    socialUrl.searchParams.set('youtube_error', 'unauthorized')
    return NextResponse.redirect(socialUrl)
  }

  const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (userRow?.role !== 'admin') {
    socialUrl.searchParams.set('youtube_error', 'forbidden')
    return NextResponse.redirect(socialUrl)
  }

  try {
    const oauthClient = createYouTubeOAuthClient()
    const { tokens } = await oauthClient.getToken(code)
    const existing = await loadYouTubeCredentials().catch(() => null)
    const refreshToken = tokens.refresh_token || existing?.refresh_token

    if (!refreshToken) {
      throw new Error('missing_refresh_token')
    }

    oauthClient.setCredentials({
      access_token: tokens.access_token ?? undefined,
      refresh_token: refreshToken,
      expiry_date: tokens.expiry_date ?? undefined,
    })

    let channelId: string | undefined
    let channelTitle: string | undefined
    try {
      const yt = google.youtube({ version: 'v3', auth: oauthClient })
      const chRes = await yt.channels.list({ part: ['snippet'], mine: true })
      const ch = chRes.data.items?.[0]
      channelId = ch?.id ?? undefined
      channelTitle = ch?.snippet?.title ?? undefined
    } catch (chErr) {
      console.warn('YouTube kanal bilgisi okunamadı (yetki kaydediliyor):', chErr)
    }

    await saveYouTubeCredentials({
      refresh_token: refreshToken,
      access_token: tokens.access_token ?? undefined,
      expiry_date: tokens.expiry_date ?? undefined,
      channel_id: channelId,
      channel_title: channelTitle,
      updated_at: new Date().toISOString(),
    })

    socialUrl.searchParams.set('youtube_connected', '1')
    if (channelTitle) {
      socialUrl.searchParams.set('youtube_channel', channelTitle)
    }
  } catch (err) {
    console.error('YouTube OAuth callback hatası:', err)
    const msg = err instanceof Error ? err.message : ''
    socialUrl.searchParams.set(
      'youtube_error',
      msg.includes('missing_refresh_token') ? 'missing_refresh_token' : 'token_exchange_failed'
    )
  }

  const response = NextResponse.redirect(socialUrl)
  response.cookies.delete('youtube_oauth_state')
  return response
}
