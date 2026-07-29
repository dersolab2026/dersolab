import { createClient } from '@/lib/supabase/client'

const MAX_VIDEO_SIZE_MB = 200
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm']

export interface UploadVideoResult {
  success: boolean
  publicUrl?: string
  error?: string
}

export async function uploadIntroVideo(userId: string, file: File): Promise<UploadVideoResult> {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return { success: false, error: 'Sadece mp4, mov veya webm yükleyebilirsin' }
  }
  if (file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) {
    return { success: false, error: `Video en fazla ${MAX_VIDEO_SIZE_MB} MB olabilir` }
  }

  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}/intro.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('instructor-videos')
    .upload(filePath, file, { upsert: true })

  if (uploadError) return { success: false, error: 'Video yüklenemedi, tekrar dener misin?' }

  const { data } = supabase.storage.from('instructor-videos').getPublicUrl(filePath)
  return { success: true, publicUrl: data.publicUrl }
}
