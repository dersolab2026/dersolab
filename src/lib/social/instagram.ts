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
  let accountId = customAccountId?.trim() || process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID
  if (!accountId && isIgLoginToken) {
    // Doğrulanmış Instagram Business Scoped ID (@dersolabegitim)
    accountId = '17841443400092890'
  }

  return {
    isConfigured: Boolean(token && accountId),
    token,
    accountId,
    isIgLoginToken,
  }
}

/**
 * Meta & Instagram Graph API için parametreleri hem query hem URL-encoded form uyumlu gönderen yardımcı
 */
async function callInstagramEndpoint(
  baseUrl: string,
  accountId: string,
  endpoint: 'media' | 'media_publish',
  params: Record<string, string | undefined>
) {
  const url = new URL(`${baseUrl}/${accountId}/${endpoint}`)
  const bodyParams = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      url.searchParams.set(key, value)
      bodyParams.set(key, value)
    }
  }

  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: bodyParams.toString(),
  })

  const data = await res.json()
  return { ok: res.ok, data }
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

    const targetAccountId = accountId || '17841443400092890'

    // 1. STORY (HİKAYE) PAYLAŞIMI
    if (isStory && validPublicUrls.length > 0) {
      const { ok: cOk, data: containerData } = await callInstagramEndpoint(
        GRAPH_API_BASE,
        targetAccountId,
        'media',
        {
          media_type: 'STORIES',
          image_url: validPublicUrls[0],
          access_token: token,
        }
      )

      if (!cOk || !containerData.id) {
        throw new Error(containerData.error?.message || 'Story container oluşturulamadı')
      }

      const { ok: pOk, data: publishData } = await callInstagramEndpoint(
        GRAPH_API_BASE,
        targetAccountId,
        'media_publish',
        {
          creation_id: containerData.id,
          access_token: token,
        }
      )

      if (!pOk || !publishData.id) {
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

    // 2. REELS / VIDEO PAYLAŞIMI
    if (isReels && videoUrl) {
      const { ok: cOk, data: containerData } = await callInstagramEndpoint(
        GRAPH_API_BASE,
        targetAccountId,
        'media',
        {
          media_type: 'REELS',
          video_url: videoUrl,
          caption,
          access_token: token,
        }
      )

      if (!cOk || !containerData.id) {
        throw new Error(containerData.error?.message || 'Reels container oluşturulamadı')
      }

      const { ok: pOk, data: publishData } = await callInstagramEndpoint(
        GRAPH_API_BASE,
        targetAccountId,
        'media_publish',
        {
          creation_id: containerData.id,
          access_token: token,
        }
      )

      if (!pOk || !publishData.id) {
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

    // 3. CAROUSEL GÖNDERİSİ (Çoklu Slayt)
    if (validPublicUrls.length > 1) {
      const itemContainerIds: string[] = []

      for (const imgUrl of validPublicUrls) {
        const { ok: iOk, data: itemData } = await callInstagramEndpoint(
          GRAPH_API_BASE,
          targetAccountId,
          'media',
          {
            image_url: imgUrl,
            is_carousel_item: 'true',
            access_token: token,
          }
        )
        if (iOk && itemData.id) {
          itemContainerIds.push(itemData.id)
        }
      }

      if (itemContainerIds.length < 2) {
        throw new Error('Carousel için en az 2 slayt görseli gereklidir.')
      }

      const { ok: cOk, data: carouselData } = await callInstagramEndpoint(
        GRAPH_API_BASE,
        targetAccountId,
        'media',
        {
          media_type: 'CAROUSEL',
          children: itemContainerIds.join(','),
          caption,
          access_token: token,
        }
      )

      if (!cOk || !carouselData.id) {
        throw new Error(carouselData.error?.message || 'Carousel container oluşturulamadı')
      }

      const { ok: pOk, data: publishData } = await callInstagramEndpoint(
        GRAPH_API_BASE,
        targetAccountId,
        'media_publish',
        {
          creation_id: carouselData.id,
          access_token: token,
        }
      )

      if (!pOk || !publishData.id) {
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

    // 4. TEKLİ FOTOĞRAF GÖNDERİSİ
    if (validPublicUrls.length === 1) {
      const { ok: cOk, data: containerData } = await callInstagramEndpoint(
        GRAPH_API_BASE,
        targetAccountId,
        'media',
        {
          image_url: validPublicUrls[0],
          caption,
          access_token: token,
        }
      )

      if (!cOk || !containerData.id) {
        throw new Error(containerData.error?.message || 'Görsel container oluşturulamadı')
      }

      const { ok: pOk, data: publishData } = await callInstagramEndpoint(
        GRAPH_API_BASE,
        targetAccountId,
        'media_publish',
        {
          creation_id: containerData.id,
          access_token: token,
        }
      )

      if (!pOk || !publishData.id) {
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
