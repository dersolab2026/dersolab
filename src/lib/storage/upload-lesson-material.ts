import { createClient } from '@/lib/supabase/client'

const MAX_FILE_SIZE_MB = 10

export interface UploadResult {
  success: boolean
  error?: string
}

export async function uploadLessonMaterial(bookingId: string, title: string, file: File): Promise<UploadResult> {
  if (file.type !== 'application/pdf') {
    return { success: false, error: 'Sadece PDF dosyası yükleyebilirsin' }
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { success: false, error: `Dosya en fazla ${MAX_FILE_SIZE_MB} MB olabilir` }
  }

  const supabase = createClient()

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('instructor_id, student_id')
    .eq('id', bookingId)
    .single()

  if (bookingError || !booking) return { success: false, error: 'Ders bulunamadı' }

  const filePath = `${bookingId}/${Date.now()}.pdf`

  const { error: uploadError } = await supabase.storage.from('lesson-materials').upload(filePath, file)
  if (uploadError) return { success: false, error: 'Dosya yüklenemedi, tekrar dener misin?' }

  const { error: insertError } = await supabase.from('lesson_materials').insert({
    booking_id: bookingId,
    instructor_id: booking.instructor_id,
    student_id: booking.student_id,
    title,
    file_path: filePath,
  })

  if (insertError) return { success: false, error: 'Dosya yüklendi ama kayıt oluşturulamadı, sayfayı yenile' }

  return { success: true }
}

export async function getLessonMaterialSignedUrl(filePath: string): Promise<string | null> {
  const supabase = createClient()
  const { data, error } = await supabase.storage.from('lesson-materials').createSignedUrl(filePath, 3600)
  if (error || !data) return null
  return data.signedUrl
}

export async function deleteLessonMaterial(materialId: string, filePath: string): Promise<UploadResult> {
  const supabase = createClient()

  const { error: storageError } = await supabase.storage.from('lesson-materials').remove([filePath])
  if (storageError) return { success: false, error: 'Dosya silinemedi' }

  const { error: deleteError } = await supabase.from('lesson_materials').delete().eq('id', materialId)
  if (deleteError) return { success: false, error: 'Kayıt silinemedi' }

  return { success: true }
}
