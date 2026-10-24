import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getInstagramConfig, publishToInstagram } from '@/lib/social/instagram'
import { getTikTokConfig, publishToTikTok } from '@/lib/social/tiktok'
import { uploadSocialDataUrlToStorage } from '@/actions/social-posts'

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
    const postObj = body.post || {}
    const postId = body.postId || postObj.id
    const platform = body.platform || postObj.platform || 'both'
    const rawCaption = body.caption ?? postObj.caption ?? ''
    const hashtags: string[] = body.hashtags || postObj.hashtags || []
    const caption =
      hashtags.length > 0 && !rawCaption.includes('#')
        ? `${rawCaption}\n\n${hashtags.map((h: string) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`
        : rawCaption
    const imageUrls: string[] | undefined = body.imageUrls
    const videoUrl: string | undefined = body.videoUrl
    const contentType = body.contentType || postObj.type || 'post'
    const isReels = Boolean(body.isReels || contentType === 'reels')
    const title = body.title || postObj.title || 'DersoLab'

    // İsteğe bağlı: Admin panelinden girilen API anahtarları
    const customIgToken: string | undefined = body.instagramAccessToken
    const customIgAccountId: string | undefined = body.instagramAccountId
    const customTtToken: string | undefined = body.tiktokAccessToken

    // Gönderi mi Story mi? Otomatik tespit
    const isStory = Boolean(body.isStory || contentType === 'story')
    const isActualReels = Boolean(isReels || contentType === 'reels')

    if (!caption && !isStory) {
      return NextResponse.json({ error: 'Paylaşım için açıklama (caption) gereklidir.' }, { status: 400 })
    }

    // Platform seçimine göre dağıt
    const shouldPublishInstagram = platform === 'both' || platform === 'all' || platform === 'instagram'
    const shouldPublishTikTok = platform === 'both' || platform === 'all' || platform === 'tiktok'

    // Görselleri ve videoları Supabase Storage'a yükleyip public HTTPS URL al (Meta Graph API & TikTok API için zorunlu)
    let resolvedImageUrls: string[] | undefined = imageUrls
    let resolvedVideoUrl: string | undefined = videoUrl

    if (Array.isArray(imageUrls) && imageUrls.length > 0) {
      const uploaded = await Promise.all(
        imageUrls.map(async (url: string, idx: number) => {
          if (url.startsWith('data:image/')) {
            const pubUrl = await uploadSocialDataUrlToStorage(url, `${postId || 'post'}_${idx + 1}`)
            return pubUrl || url
          }
          return url
        })
      )
      resolvedImageUrls = uploaded
    }

    if (videoUrl && videoUrl.startsWith('data:video/')) {
      const pubVideoUrl = await uploadSocialDataUrlToStorage(videoUrl, `${postId || 'reels'}_video`)
      if (pubVideoUrl) {
        resolvedVideoUrl = pubVideoUrl
      }
    }

    let instagramResult = null
    let tiktokResult = null

    const tasks: Promise<any>[] = []

    if (shouldPublishInstagram) {
      tasks.push(
        publishToInstagram({
          caption: caption || '',
          imageUrls: resolvedImageUrls,
          videoUrl: resolvedVideoUrl,
          isReels: isActualReels,
          isStory,
          customToken: customIgToken,
          customAccountId: customIgAccountId,
        }).then((res) => {
          instagramResult = res
        })
      )
    }

    if (shouldPublishTikTok) {
      tasks.push(
        publishToTikTok({
          caption: caption || '',
          imageUrls: resolvedImageUrls,
          videoUrl: resolvedVideoUrl,
          isReels: isActualReels,
          isStory,
          title,
          customToken: customTtToken,
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
