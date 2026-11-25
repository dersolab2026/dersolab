import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
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

    let customToken: string | undefined
    try {
      const body = await request.json()
      customToken = typeof body?.tiktokAccessToken === 'string' ? body.tiktokAccessToken.trim() : undefined
    } catch {
      // İsteğe bağlı gövde yoksa ortam değişkenine düş
    }

    const token = customToken || process.env.TIKTOK_ACCESS_TOKEN?.trim()
    if (!token) {
      return NextResponse.json({ error: 'TikTok erişim anahtarı bulunamadı.' }, { status: 400 })
    }

    const res = await fetch('https://open.tiktokapis.com/v2/post/publish/creator_info/query/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: '{}',
    })

    const data = await res.json().catch(() => null)
    if (!res.ok || data?.error?.code !== 'ok' || !data?.data) {
      return NextResponse.json(
        {
          error: 'TikTok hesap bilgileri alınamadı.',
          code: data?.error?.code || 'unknown',
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      creatorInfo: data.data,
    })
  } catch (err) {
    console.error('TikTok creator_info/query error:', err)
    return NextResponse.json({ error: 'TikTok hesap bilgileri alınırken sunucu hatası oluştu.' }, { status: 500 })
  }
}
