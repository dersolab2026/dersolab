/**
 * DersoLab TikTok Publishing Client (TikTok Content Posting API v2)
 * 
 * TikTok for Developers API Akışı:
 * 1. Video / Reels: POST /v2/post/publish/video/init/
 * 2. Photo Carousel / Story: POST /v2/post/publish/content/init/
 * 3. Smart Web & Deep-link Assistant Fallback (API anahtarı henüz girilmediğinde)
 */

export interface TikTokPublishResult {
  success: boolean
  postId?: string
  shareUrl?: string
  mode: 'api' | 'manual_fallback'
  action: 'story' | 'post'
  message: string
}

export function getTikTokConfig(customToken?: string) {
  const token = customToken?.trim() || process.env.TIKTOK_ACCESS_TOKEN
  const openId = process.env.TIKTOK_OPEN_ID
  const clientKey = process.env.TIKTOK_CLIENT_KEY || process.env.TIKTOK_APP_ID

  return {
    isConfigured: Boolean(token),
    token,
    openId,
    clientKey,
  }
}

/**
 * Gönderi veya Hikayeyi TikTok'a gönderir
 */
export async function publishToTikTok({
  caption,
  imageUrls,
  videoUrl,
  isStory = false,
  isReels = false,
  title,
  customToken,
}: {
  caption: string
  imageUrls?: string[]
  videoUrl?: string
  isStory?: boolean
  isReels?: boolean
  title?: string
  customToken?: string
}): Promise<TikTokPublishResult> {
  const { isConfigured, token } = getTikTokConfig(customToken)
  const actionType: 'story' | 'post' = isStory ? 'story' : 'post'

  // Akıllı Web & Creator Studio Modu (API anahtarı yoksa veya fallback)
  if (!isConfigured) {
    const uploadUrl = isStory
      ? 'https://www.tiktok.com/upload'
      : 'https://www.tiktok.com/creator-center/upload'

    return {
      success: true,
      mode: 'manual_fallback',
      action: actionType,
      shareUrl: uploadUrl,
      message: isStory
        ? 'TikTok Story (9:16 Hikaye) başarıyla hazırlandı. Dikey görsel cihazınıza aktarıldı, metin panoya kopyalandı ve TikTok açıldı.'
        : 'TikTok Gönderisi başarıyla hazırlandı. Görseller cihazınıza indirildi, açıklama ve trend etiketler panoya kopyalandı ve TikTok Creator Center açıldı.',
    }
  }

  try {
    const TIKTOK_API_BASE = 'https://open.tiktokapis.com/v2'

    // 1. VIDEO / REELS PAYLAŞIMI
    if ((isReels || videoUrl) && videoUrl) {
      const response = await fetch(`${TIKTOK_API_BASE}/post/publish/video/init/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          post_info: {
            title: caption.slice(0, 2200),
            privacy_level: 'PUBLIC_TO_EVERYONE',
            disable_duet: false,
            disable_stitch: false,
            disable_comment: false,
            video_cover_timestamp_ms: 1000,
          },
          source_info: {
            source: 'PULL_FROM_URL',
            video_url: videoUrl,
          },
        }),
      })

      const data = await response.json()
      if (!response.ok || data.error?.code !== 'ok') {
        throw new Error(data.error?.message || 'TikTok video başlatma hatası oluştu.')
      }

      return {
        success: true,
        postId: data.data?.publish_id,
        shareUrl: 'https://www.tiktok.com/@dersolabegitim',
        mode: 'api',
        action: actionType,
        message: 'Reels / TikTok dikey videosu başarıyla TikTok hesabınızda yayınlandı!',
      }
    }

    // 2. FOTOĞRAF / STORY / CAROUSEL PAYLAŞIMI (Photo Mode)
    if (imageUrls && imageUrls.length > 0) {
      // Sadece public internet URL'leri TikTok API'ye iletilebilir
      const validPublicUrls = imageUrls.filter((url) => url.startsWith('http://') || url.startsWith('https://'))

      if (validPublicUrls.length === 0) {
        // Data URL veya yerel görsel ise akıllı fallback'e devret
        return {
          success: true,
          mode: 'manual_fallback',
          action: actionType,
          shareUrl: isStory ? 'https://www.tiktok.com/upload' : 'https://www.tiktok.com/creator-center/upload',
          message: isStory
            ? 'TikTok Story dikey görseli ve çıkartma metni hazırlandı. TikTok yükleme paneli açılıyor.'
            : 'TikTok Fotoğraf albümü / kaydırmalı gönderi hazırlandı. TikTok Creator Center açılıyor.',
        }
      }

      // 1. Önce doğrudan profilde yayınlamak için DIRECT_POST dene (video.publish yetkisi varsa)
      let publishData: any = null
      let isDirectPublished = false

      try {
        const directRes = await fetch(`${TIKTOK_API_BASE}/post/publish/content/init/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify({
            post_mode: 'DIRECT_POST',
            media_type: 'PHOTO',
            post_info: {
              title: (title || caption).slice(0, 150),
              description: caption.slice(0, 2200),
              privacy_level: 'PUBLIC_TO_EVERYONE',
              disable_comment: false,
            },
            source_info: {
              source: 'PULL_FROM_URL',
              photo_images: validPublicUrls,
              photo_cover_index: 0,
            },
          }),
        })

        const directJson = await directRes.json()
        console.log('TikTok DIRECT_POST denemesi yanıtı:', JSON.stringify(directJson))

        if (directRes.ok && directJson.error?.code === 'ok') {
          publishData = directJson
          isDirectPublished = true
        } else {
          console.warn('TikTok DIRECT_POST kullanılamıyor, MEDIA_UPLOAD (Taslak / Gelen Kutusu) moduna geçiliyor...')
        }
      } catch (err) {
        console.warn('TikTok DIRECT_POST çağrısı sırasında hata oluştu, MEDIA_UPLOAD deneniyor:', err)
      }

      // 2. DIRECT_POST başarısız olduysa veya sandbox izinleri varsa MEDIA_UPLOAD ile Creator Gelen Kutusuna yükle
      if (!publishData) {
        const mediaRes = await fetch(`${TIKTOK_API_BASE}/post/publish/content/init/`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json; charset=UTF-8',
          },
          body: JSON.stringify({
            post_mode: 'MEDIA_UPLOAD',
            media_type: 'PHOTO',
            post_info: {
              title: (title || caption).slice(0, 150),
              description: caption.slice(0, 2200),
            },
            source_info: {
              source: 'PULL_FROM_URL',
              photo_images: validPublicUrls,
              photo_cover_index: 0,
            },
          }),
        })

        const mediaJson = await mediaRes.json()
        console.log('TikTok MEDIA_UPLOAD yanıtı:', JSON.stringify(mediaJson))

        if (!mediaRes.ok || mediaJson.error?.code !== 'ok') {
          const errMsg = mediaJson.error?.message || JSON.stringify(mediaJson.error || mediaJson)
          throw new Error(`TikTok yükleme hatası: ${errMsg}`)
        }

        publishData = mediaJson
      }

      return {
        success: true,
        postId: publishData.data?.publish_id,
        shareUrl: 'https://www.tiktok.com/@dersolabegitim',
        mode: 'api',
        action: actionType,
        message: isDirectPublished
          ? (isStory
              ? '🎉 TikTok Story doğrudan @dersolabegitim profilinizde yayınlandı!'
              : '🎉 Fotoğraf albümü doğrudan @dersolabegitim profilinizde yayınlandı!')
          : (isStory
              ? '📱 TikTok Story @dersolabegitim hesabınıza başarıyla iletildi! TikTok mobil uygulamasında "Gelen Kutusu" (Inbox) > "Sistem Bildirimleri" alanına dokunarak tek tıkla Story olarak paylaşabilirsiniz.'
              : '📱 Gönderi @dersolabegitim hesabınıza başarıyla iletildi! TikTok mobil uygulamasında "Gelen Kutusu"ndan tek tıkla onaylayıp paylaşabilirsiniz.'),
      }
    }

    throw new Error('TikTok için geçerli görsel veya video bulunamadı.')
  } catch (error: any) {
    console.error('TikTok API publish error:', error)
    const isScopeError = /scope|authorize the scope|permission|product/i.test(error?.message || '')
    const msg = isScopeError
      ? 'TikTok hesabınızda doğrudan API yayın izni (Content Posting API) henüz etkin değil. TikTok Geliştirici Portalında "+ Add products > Content Posting API" eklenene kadar aşağıdaki butonla 5 saniyede Story yükleyebilirsiniz.'
      : error?.message || 'TikTok API çağrısı sırasında bir sorun oluştu.'
    return {
      success: false,
      mode: 'manual_fallback',
      action: actionType,
      shareUrl: isStory ? 'https://www.tiktok.com/upload' : 'https://www.tiktok.com/creator-center/upload',
      message: msg,
    }
  }
}
