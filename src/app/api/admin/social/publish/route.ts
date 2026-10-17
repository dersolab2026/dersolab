import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getInstagramConfig, publishToInstagram } from '@/lib/social/instagram'

export async function GET() {
  // Config durumunu kontrol et
  const config = getInstagramConfig()
  return NextResponse.json({
    isConfigured: config.isConfigured,
    accountId: config.accountId ? `${config.accountId.substring(0, 4)}***` : null,
  })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim. Lütfen giriş yapınız.' }, { status: 401 })
    }

    const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (userRow?.role !== 'admin') {
      return NextResponse.json({ error: 'Bu işlem yalnızca sistem yöneticilerine açıktır.' }, { status: 403 })
    }

    const body = await request.json()
    const { caption, imageUrls, videoUrl, isReels } = body

    if (!caption) {
      return NextResponse.json({ error: 'Paylaşım için açıklama (caption) gereklidir.' }, { status: 400 })
    }

    const result = await publishToInstagram({
      caption,
      imageUrls,
      videoUrl,
      isReels,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Social media publish API error:', error)
    return NextResponse.json(
      { error: error?.message || 'Paylaşım sırasında bir hata oluştu.' },
      { status: 500 }
    )
  }
}
