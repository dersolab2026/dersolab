import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
    }

    const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (userRow?.role !== 'admin') {
      return NextResponse.json({ error: 'Bu işlem yalnızca yöneticilere açıktır.' }, { status: 403 })
    }
    const body = await req.json()
    const code = body.code?.trim()

    if (!code) {
      return NextResponse.json({ error: 'Yetkilendirme kodu (code) bulunamadı.' }, { status: 400 })
    }

    const clientKey = process.env.TIKTOK_CLIENT_KEY || 'sbawm5ipgpytsjdnp9'
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET || 'hdK7EownwWpHcpBXaBzSpYuSBPrJzgUi'
    const redirectUri = 'https://dersolab.com/admin/social'

    const postParams = new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    })

    const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cache-Control': 'no-cache',
      },
      body: postParams.toString(),
    })

    const tokenData = await tokenRes.json()

    if (!tokenRes.ok || tokenData.error) {
      return NextResponse.json(
        {
          error: tokenData.error_description || tokenData.error?.message || 'TikTok token alınamadı.',
          details: tokenData,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      accessToken: tokenData.access_token || tokenData.data?.access_token,
      openId: tokenData.open_id || tokenData.data?.open_id,
      expiresIn: tokenData.expires_in || tokenData.data?.expires_in,
      refreshToken: tokenData.refresh_token || tokenData.data?.refresh_token,
      raw: tokenData,
    })
  } catch (err: any) {
    console.error('TikTok token exchange error:', err)
    return NextResponse.json({ error: err?.message || 'Sunucu hatası oluştu.' }, { status: 500 })
  }
}
