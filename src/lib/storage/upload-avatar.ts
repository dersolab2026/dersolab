import { createClient } from '@/lib/supabase/client'

const MAX_AVATAR_SIZE_MB = 5
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export interface UploadAvatarResult {
  success: boolean
  publicUrl?: string
  error?: string
}

export async function uploadAvatar(userId: string, file: File): Promise<UploadAvatarResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: 'Sadece jpg, png veya webp yükleyebilirsin' }
  }
  if (file.size > MAX_AVATAR_SIZE_MB * 1024 * 1024) {
    return { success: false, error: `Dosya en fazla ${MAX_AVATAR_SIZE_MB} MB olabilir` }
  }

  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const filePath = `${userId}/avatar.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true })

  if (uploadError) return { success: false, error: 'Fotoğraf yüklenemedi, tekrar dener misin?' }

  const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)

  const { error: updateError } = await supabase
    .from('users')
    .update({ avatar_url: data.publicUrl })
    .eq('id', userId)

  if (updateError) return { success: false, error: 'Fotoğraf yüklendi ama profil güncellenemedi' }

  return { success: true, publicUrl: data.publicUrl }
}
