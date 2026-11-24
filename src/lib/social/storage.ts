import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ALLOWED_MEDIA_MIMES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/webp': 'webp',
  'video/mp4': 'mp4',
  'video/webm': 'webm',
}

const MAX_DATA_URL_LENGTH = 34 * 1024 * 1024 // ~25 MB binary limit

async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return false

    const { data: userRow } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    return userRow?.role === 'admin'
  } catch {
    return false
  }
}

/**
 * Base64 Data URL görsellerini/videolarını yalnızca yönetici yetkisiyle Supabase Storage'a yükler.
 * SVG (image/svg+xml) XSS riskini önlemek için kabul edilmez; yalnızca raster görsel ve MP4/WebM izin verilir.
 */
export async function uploadSocialDataUrlToStorage(
  dataUrl: string,
  prefix = 'slide'
): Promise<string | null> {
  if (!(await isCurrentUserAdmin())) {
    return null
  }

  if (!dataUrl || dataUrl.length > MAX_DATA_URL_LENGTH) {
    return null
  }

  if (!dataUrl.startsWith('data:image/') && !dataUrl.startsWith('data:video/')) {
    try {
      const parsed = new URL(dataUrl)
      return parsed.protocol === 'https:' ? dataUrl : null
    } catch {
      return null
    }
  }

  try {
    const match = dataUrl.match(/^data:((?:image|video)\/[a-zA-Z0-9+.-]+)(?:;[a-zA-Z0-9=.-]+)*;base64,([A-Za-z0-9+/=]+)$/)
    if (!match) return null

    const rawMime = match[1].toLowerCase()
    const ext = ALLOWED_MEDIA_MIMES[rawMime]
    if (!ext) return null

    const safePrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32) || 'slide'
    const buffer = Buffer.from(match[2], 'base64')
    if (buffer.byteLength === 0 || buffer.byteLength > 25 * 1024 * 1024) {
      return null
    }

    const admin = createAdminClient()
    const bucketName = 'social-media'

    const { data: buckets } = await admin.storage.listBuckets()
    if (!buckets?.some((b) => b.name === bucketName)) {
      await admin.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 25 * 1024 * 1024,
      })
    }

    const contentType = rawMime === 'image/jpg' ? 'image/jpeg' : rawMime
    const fileName = `posts/${safePrefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`

    const { error: uploadError } = await admin.storage
      .from(bucketName)
      .upload(fileName, buffer, {
        contentType,
        upsert: false,
      })

    if (uploadError) return null

    const { data: publicUrlData } = admin.storage.from(bucketName).getPublicUrl(fileName)
    return publicUrlData?.publicUrl || null
  } catch {
    return null
  }
}
