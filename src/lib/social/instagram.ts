/**
 * DersoLab Instagram Publishing Client (Meta Graph API)
 * 
 * Instagram Graph API Resmi Akışı:
 * 1. Single Image/Video Container oluşturma: POST /{ig-user-id}/media
 * 2. Carousel Container oluşturma: POST /{ig-user-id}/media?children=id1,id2,id3&media_type=CAROUSEL
 * 3. Container'ı yayına alma: POST /{ig-user-id}/media_publish?creation_id={container-id}
 */

export interface InstagramPublishResult {
  success: boolean
  postId?: string
  permalink?: string
  mode: 'api' | 'manual_fallback'
  action: 'story' | 'post'
  message: string
}

export function getInstagramConfig(customToken?: string, customAccountId?: string) {
  const token = customToken?.trim() || process.env.INSTAGRAM_ACCESS_TOKEN
  const isIgLoginToken = Boolean(token && token.startsWith('IG'))
  const accountId =
    customAccountId?.trim() ||
    process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID ||
    (isIgLoginToken ? 'me' : undefined)

  return {
    isConfigured: Boolean(token && accountId),
    token,
    accountId,
    isIgLoginToken,
  }
}

/**
 * Tekli görsel veya carousel gönderisini Instagram'a gönderir
 */
export async function publishToInstagram({
  caption,
  imageUrls,
  videoUrl,
  isReels = false,
  isStory = false,
  customToken,
  customAccountId,
}: {
  caption: string
  imageUrls?: string[]
  videoUrl?: string
  isReels?: boolean
  isStory?: boolean
  customToken?: string
  customAccountId?: string
}): Promise<InstagramPublishResult> {
  const { isConfigured, token, accountId, isIgLoginToken } = getInstagramConfig(
    customToken,
    customAccountId
  )
  const actionType: 'story' | 'post' = isStory ? 'story' : 'post'

  const validPublicUrls = (imageUrls || []).filter(
    (u) => u.startsWith('http://') || u.startsWith('https://')
  )

  if (!isConfigured || (!videoUrl && validPublicUrls.length === 0)) {
    return {
      success: true,
      mode: 'manual_fallback',
      action: actionType,
      permalink: isStory ? 'https://www.instagram.com/stories/create/' : 'https://www.instagram.com/',
      message: isStory
        ? 'Instagram Story (9:16 Hikaye) başarıyla hazırlandı. Dikey görsel cihazınıza aktarıldı, metin panoya kopyalandı ve Instagram Story açıldı.'
        : 'Instagram Gönderisi başarıyla hazırlandı. Görseller cihazınıza indirildi, açıklama panoya kopyalandı ve Instagram açıldı.',
    }
  }

  try {
    const GRAPH_API_BASE = isIgLoginToken
      ? 'https://graph.instagram.com/v21.0'
      : 'https://graph.facebook.com/v21.0'

    // STORY (HİKAYE) PAYLAŞIMI
    if (isStory && imageUrls && imageUrls.length > 0) {
      const containerRes = await fetch(`${GRAPH_API_BASE}/${accountId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_type: 'STORIES',
          image_url: imageUrls[0],
          access_token: token,
        }),
      })

      const containerData = await containerRes.json()
      if (!containerRes.ok || !containerData.id) {
        throw new Error(containerData.error?.message || 'Story container oluşturulamadı')
      }

      const publishRes = await fetch(`${GRAPH_API_BASE}/${accountId}/media_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerData.id,
          access_token: token,
        }),
      })

      const publishData = await publishRes.json()
      if (!publishRes.ok || !publishData.id) {
        throw new Error(publishData.error?.message || 'Story yayınlanamadı')
      }

      return {
        success: true,
        postId: publishData.id,
        permalink: 'https://www.instagram.com/dersolabegitim',
        mode: 'api',
        action: actionType,
        message: 'Story başarıyla Instagram hesabınızda yayınlandı!',
      }
    }

    // REELS / VIDEO PAYLAŞIMI
    if (isReels && videoUrl) {
      const containerRes = await fetch(`${GRAPH_API_BASE}/${accountId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_type: 'REELS',
          video_url: videoUrl,
          caption,
          access_token: token,
        }),
      })

      const containerData = await containerRes.json()
      if (!containerRes.ok || !containerData.id) {
        throw new Error(containerData.error?.message || 'Reels container oluşturulamadı')
      }

      // Yayınla
      const publishRes = await fetch(`${GRAPH_API_BASE}/${accountId}/media_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerData.id,
          access_token: token,
        }),
      })

      const publishData = await publishRes.json()
      if (!publishRes.ok || !publishData.id) {
        throw new Error(publishData.error?.message || 'Reels yayınlanamadı')
      }

      return {
        success: true,
        postId: publishData.id,
        permalink: 'https://www.instagram.com/dersolabegitim',
        mode: 'api',
        action: actionType,
        message: 'Reels başarıyla Instagram hesabınızda yayınlandı!',
      }
    }

    // CAROUSEL GÖNDERİSİ
    if (imageUrls && imageUrls.length > 1) {
      // 1. Her bir slayt için alt container (item) oluştur
      const itemContainerIds: string[] = []

      for (const imgUrl of imageUrls) {
        const itemRes = await fetch(`${GRAPH_API_BASE}/${accountId}/media`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image_url: imgUrl,
            is_carousel_item: true,
            access_token: token,
          }),
        })
        const itemData = await itemRes.json()
        if (itemData.id) {
          itemContainerIds.push(itemData.id)
        }
      }

      if (itemContainerIds.length < 2) {
        throw new Error('Carousel için en az 2 slayt görseli gereklidir.')
      }

      // 2. Ana Carousel Container oluştur
      const carouselRes = await fetch(`${GRAPH_API_BASE}/${accountId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_type: 'CAROUSEL',
          children: itemContainerIds.join(','),
          caption,
          access_token: token,
        }),
      })

      const carouselData = await carouselRes.json()
      if (!carouselRes.ok || !carouselData.id) {
        throw new Error(carouselData.error?.message || 'Carousel container oluşturulamadı')
      }

      // 3. Yayınla
      const publishRes = await fetch(`${GRAPH_API_BASE}/${accountId}/media_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: carouselData.id,
          access_token: token,
        }),
      })

      const publishData = await publishRes.json()
      if (!publishRes.ok || !publishData.id) {
        throw new Error(publishData.error?.message || 'Carousel yayınlanamadı')
      }

      return {
        success: true,
        postId: publishData.id,
        permalink: 'https://www.instagram.com/dersolabegitim',
        mode: 'api',
        action: actionType,
        message: 'Carousel gönderisi başarıyla Instagram hesabınızda yayınlandı!',
      }
    }

    // TEKLİ FOTOĞRAF GÖNDERİSİ
    if (imageUrls && imageUrls.length === 1) {
      const containerRes = await fetch(`${GRAPH_API_BASE}/${accountId}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUrls[0],
          caption,
          access_token: token,
        }),
      })

      const containerData = await containerRes.json()
      if (!containerRes.ok || !containerData.id) {
        throw new Error(containerData.error?.message || 'Görsel container oluşturulamadı')
      }

      const publishRes = await fetch(`${GRAPH_API_BASE}/${accountId}/media_publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: containerData.id,
          access_token: token,
        }),
      })

      const publishData = await publishRes.json()
      if (!publishRes.ok || !publishData.id) {
        throw new Error(publishData.error?.message || 'Gönderi yayınlanamadı')
      }

      return {
        success: true,
        postId: publishData.id,
        permalink: 'https://www.instagram.com/dersolabegitim',
        mode: 'api',
        action: actionType,
        message: 'Gönderi başarıyla Instagram hesabınızda yayınlandı!',
      }
    }

    throw new Error('Yayınlanacak geçerli görsel veya video bulunamadı.')
  } catch (error: any) {
    console.error('Instagram API publish error:', error)
    return {
      success: false,
      mode: 'api',
      action: actionType,
      permalink: isStory ? 'https://www.instagram.com/stories/create/' : 'https://www.instagram.com/',
      message: error?.message || 'Instagram API çağrısı sırasında bir hata oluştu.',
    }
  }
}
