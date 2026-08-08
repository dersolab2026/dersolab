import { createClient } from '@/lib/supabase/client'

const MAX_FILE_SIZE_MB = 25
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime', 'application/pdf']

export interface UploadResult {
  success: boolean
  error?: string
}

function deriveFileType(mime: string): 'image' | 'video' | 'pdf' {
  if (mime === 'application/pdf') return 'pdf'
  if (mime.startsWith('video')) return 'video'
  return 'image'
}

export async function uploadQuestionAttachment(
  questionId: string,
  role: 'question' | 'answer',
  file: File
): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: 'Sadece PDF, fotoğraf (jpg, png, webp) veya video (mp4, mov) yükleyebilirsin' }
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { success: false, error: `Dosya en fazla ${MAX_FILE_SIZE_MB} MB olabilir` }
  }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const fileExt = file.name.split('.').pop()
  const filePath = `${questionId}/${role}-${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage.from('question-attachments').upload(filePath, file)
  if (uploadError) return { success: false, error: 'Dosya yüklenemedi, tekrar dener misin?' }

  const { error: insertError } = await supabase.from('question_attachments').insert({
    question_id: questionId,
    uploaded_by: user.id,
    role,
    file_path: filePath,
    file_type: deriveFileType(file.type),
  })

  if (insertError) return { success: false, error: 'Dosya yüklendi ama kayıt oluşturulamadı, sayfayı yenile' }

  return { success: true }
}

export async function getQuestionAttachmentSignedUrl(filePath: string): Promise<string | null> {
  const supabase = createClient()
  const { data, error } = await supabase.storage.from('question-attachments').createSignedUrl(filePath, 3600)
  if (error || !data) return null
  return data.signedUrl
}
