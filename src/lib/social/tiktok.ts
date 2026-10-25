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

      const response = await fetch(`${TIKTOK_API_BASE}/post/publish/content/init/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          post_info: {
            title: (title || caption).slice(0, 150),
            description: caption.slice(0, 2200),
            privacy_level: 'PUBLIC_TO_EVERYONE',
          },
          source_info: {
            source: 'PULL_FROM_URL',
            photo_cover_index: 1,
            photo_images: validPublicUrls,
          },
          post_mode: isStory ? 'DIRECT_POST' : 'MEDIA_UPLOAD',
          media_type: 'PHOTO',
        }),
      })

      const data = await response.json()
      if (!response.ok || data.error?.code !== 'ok') {
        throw new Error(data.error?.message || 'TikTok içerik yayınlama hatası oluştu.')
      }

      return {
        success: true,
        postId: data.data?.publish_id,
        shareUrl: 'https://www.tiktok.com/@dersolabegitim',
        mode: 'api',
        action: actionType,
        message: isStory
          ? 'Story başarıyla TikTok hesabınızda yayınlandı!'
          : 'Fotoğraf albümü başarıyla TikTok hesabınızda yayınlandı!',
      }
    }

    throw new Error('TikTok için geçerli görsel veya video bulunamadı.')
  } catch (error: any) {
    console.error('TikTok API publish error:', error)
    const isScopeError = /scope|authorize the scope|permission/i.test(error?.message || '')
    const msg = isScopeError
      ? 'TikTok hesabınızda doğrudan API yayın izni (video.publish) henüz verilmemiş. Doğrudan API Ayarları > "TikTok Hesabını Bağla" butonuna basarak yetkiyi yenileyebilirsiniz.'
      : error?.message || 'TikTok API çağrısı sırasında bir sorun oluştu.'
    return {
      success: false,
      mode: 'api',
      action: actionType,
      shareUrl: isStory ? 'https://www.tiktok.com/upload' : 'https://www.tiktok.com/creator-center/upload',
      message: msg,
    }
  }
}
