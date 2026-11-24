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

    const clientKey = process.env.TIKTOK_CLIENT_KEY
    const clientSecret = process.env.TIKTOK_CLIENT_SECRET
    const redirectUri = 'https://dersolab.com/admin/social'

    if (!clientKey || !clientSecret) {
      return NextResponse.json(
        { error: 'Sunucu ortam değişkenlerinde TIKTOK_CLIENT_KEY veya TIKTOK_CLIENT_SECRET tanımlı değil.' },
        { status: 503 }
      )
    }

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
          error: 'TikTok yetkilendirme anahtarı alınamadı.',
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      accessToken: tokenData.access_token || tokenData.data?.access_token,
      openId: tokenData.open_id || tokenData.data?.open_id,
      expiresIn: tokenData.expires_in || tokenData.data?.expires_in,
    })
  } catch (err: unknown) {
    console.error('TikTok token exchange error:', err)
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 })
  }
}
