import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getInstagramConfig, publishToInstagram } from '@/lib/social/instagram'
import { getTikTokConfig, publishToTikTok } from '@/lib/social/tiktok'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
  }

  const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (userRow?.role !== 'admin') {
    return NextResponse.json({ error: 'Bu işlem yalnızca sistem yöneticilerine açıktır.' }, { status: 403 })
  }

  const igConfig = getInstagramConfig()
  const ttConfig = getTikTokConfig()

  return NextResponse.json({
    instagram: {
      isConfigured: igConfig.isConfigured,
      accountId: igConfig.accountId ? `${igConfig.accountId.substring(0, 4)}***` : null,
    },
    tiktok: {
      isConfigured: ttConfig.isConfigured,
      clientKey: ttConfig.clientKey ? `${ttConfig.clientKey.substring(0, 4)}***` : null,
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    // Auth kontrolü: Yalnızca sistem yöneticileri (admin) sosyal medyada paylaşım yapabilir
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
    const {
      postId,
      platform = 'both',
      caption,
      imageUrls,
      videoUrl,
      contentType,
      isReels = false,
      title,
    } = body

    // Gönderi mi Story mi? Otomatik tespit
    const isStory = Boolean(body.isStory || contentType === 'story')
    const isActualReels = Boolean(isReels || contentType === 'reels')

    if (!caption && !isStory) {
      return NextResponse.json({ error: 'Paylaşım için açıklama (caption) gereklidir.' }, { status: 400 })
    }

    // Platform seçimine göre dağıt
    const shouldPublishInstagram = platform === 'both' || platform === 'all' || platform === 'instagram'
    const shouldPublishTikTok = platform === 'both' || platform === 'all' || platform === 'tiktok'

    let instagramResult = null
    let tiktokResult = null

    const tasks: Promise<any>[] = []

    if (shouldPublishInstagram) {
      tasks.push(
        publishToInstagram({
          caption: caption || '',
          imageUrls,
          videoUrl,
          isReels: isActualReels,
          isStory,
        }).then((res) => {
          instagramResult = res
        })
      )
    }

    if (shouldPublishTikTok) {
      tasks.push(
        publishToTikTok({
          caption: caption || '',
          imageUrls,
          videoUrl,
          isReels: isActualReels,
          isStory,
          title,
        }).then((res) => {
          tiktokResult = res
        })
      )
    }

    await Promise.all(tasks)

    // Veritabanı durumunu güncelle (Supabase)
    if (postId) {
      try {
        await supabase
          .from('social_posts')
          .update({
            status: 'published',
            published_at: new Date().toISOString(),
          })
          .eq('id', postId)
      } catch (err) {
        console.warn('Supabase social_posts tablosu güncellenemedi (tablo henüz oluşturulmamış olabilir):', err)
      }
    }

    return NextResponse.json({
      success: true,
      isStory,
      isPost: !isStory,
      contentType: isStory ? 'story' : isActualReels ? 'reels' : imageUrls && imageUrls.length > 1 ? 'carousel' : 'post',
      instagram: instagramResult,
      tiktok: tiktokResult,
      message: isStory
        ? 'Tek tuşla Instagram Story ve TikTok Story olarak başarıyla hazırlandı ve paylaşıldı!'
        : 'Tek tuşla Instagram ve TikTok gönderisi olarak başarıyla hazırlandı ve paylaşıldı!',
    })
  } catch (error: any) {
    console.error('Social media publish API error:', error)
    return NextResponse.json(
      { error: error?.message || 'Paylaşım sırasında bir hata oluştu.' },
      { status: 500 }
    )
  }
}
