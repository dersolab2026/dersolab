import { createClient } from '@/lib/supabase/client'

const MAX_FILE_SIZE_MB = 25
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime']

export interface UploadResult {
  success: boolean
  error?: string
}

export async function uploadHomeworkSubmission(homeworkId: string, file: File): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: 'Sadece fotoğraf (jpg, png, webp) veya video (mp4, mov) yükleyebilirsin' }
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { success: false, error: `Dosya en fazla ${MAX_FILE_SIZE_MB} MB olabilir` }
  }

  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const filePath = `${homeworkId}/${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage.from('homework-submissions').upload(filePath, file)
  if (uploadError) return { success: false, error: 'Dosya yüklenemedi, tekrar dener misin?' }

  const fileType = file.type.startsWith('video') ? 'video' : 'image'
  const { error: insertError } = await supabase
    .from('homework_submissions')
    .insert({ homework_id: homeworkId, file_path: filePath, file_type: fileType })

  if (insertError) return { success: false, error: 'Dosya yüklendi ama kayıt oluşturulamadı, sayfayı yenile' }

  return { success: true }
}

export async function getSubmissionSignedUrl(filePath: string): Promise<string | null> {
  const supabase = createClient()
  const { data, error } = await supabase.storage.from('homework-submissions').createSignedUrl(filePath, 3600)
  if (error || !data) return null
  return data.signedUrl
}
