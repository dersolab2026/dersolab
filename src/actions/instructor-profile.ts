'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { parseVideoUrl } from '@/lib/video/parse-video-url'

type ActionResult = { success: true } | { success: false; error: string }

interface AddEducationParams {
  institution: string
  degree?: string
  fieldOfStudy?: string
  startYear?: number
  endYear?: number
}

export async function addEducationEntry(params: AddEducationParams): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }
  if (!params.institution.trim()) return { success: false, error: 'Kurum adı boş olamaz' }

  const { error } = await supabase.from('instructor_education').insert({
    instructor_id: user.id,
    institution: params.institution,
    degree: params.degree ?? null,
    field_of_study: params.fieldOfStudy ?? null,
    start_year: params.startYear ?? null,
    end_year: params.endYear ?? null,
  })

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/instructor/profile')
  return { success: true }
}

export async function removeEducationEntry(entryId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase
    .from('instructor_education')
    .delete()
    .eq('id', entryId)
    .eq('instructor_id', user.id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/instructor/profile')
  return { success: true }
}

const BIO_MAX_LENGTH = 400

export async function updateInstructorBio(bio: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const temiz = bio.trim()
  if (temiz.length > BIO_MAX_LENGTH) {
    return { success: false, error: `Tanıtım yazısı en fazla ${BIO_MAX_LENGTH} karakter olabilir` }
  }

  const { error } = await supabase.from('instructors').update({ bio: temiz || null }).eq('user_id', user.id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/instructor/profile')
  revalidatePath('/instructors')
  return { success: true }
}

export async function updateInstructorSubjects(subjects: string[]): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase.from('instructors').update({ subjects }).eq('user_id', user.id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/instructor/profile')
  revalidatePath('/instructors')
  return { success: true }
}

export async function updateInstructorPayoutInfo(payoutName: string, payoutIban: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const trimmedName = payoutName.trim()
  if (!trimmedName) return { success: false, error: 'Ad soyad boş olamaz' }

  const normalizedIban = payoutIban.replace(/\s+/g, '').toUpperCase()
  if (!/^TR\d{24}$/.test(normalizedIban)) {
    return { success: false, error: 'Geçerli bir IBAN gir (TR ile başlayan, 26 haneli)' }
  }

  // Odeme bilgisi instructors'ta degil ayri tabloda: o tablonun okuma
  // politikasi herkese acik ve satir gorunur olunca IBAN da geliyordu (0095).
  const { data: updated, error } = await supabase
    .from('instructor_payout_details')
    .upsert({
      user_id: user.id,
      payout_name: trimmedName,
      payout_iban: normalizedIban,
      payout_updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    .select('user_id')
    .maybeSingle()

  if (error) return { success: false, error: error.message }
  if (!updated) return { success: false, error: 'Kaydedilemedi, oturumun sona ermiş olabilir — sayfayı yenileyip tekrar dener misin?' }

  revalidatePath('/dashboard/instructor/odemeler')
  revalidatePath('/dashboard/admin/muhasebe')
  return { success: true }
}

export async function setInstructorPaused(paused: boolean): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase.from('instructors').update({ paused }).eq('user_id', user.id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/instructor/settings')
  revalidatePath('/instructors')
  return { success: true }
}

export async function resubmitForReview(): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error, count } = await supabase
    .from('instructors')
    .update({ approval_status: 'pending', approval_note: null, reviewed_at: null, reviewed_by: null }, { count: 'exact' })
    .eq('user_id', user.id)
    .eq('approval_status', 'rejected')

  if (error) return { success: false, error: error.message }
  if (!count) return { success: false, error: 'Sadece reddedilmiş bir profil tekrar incelemeye gönderilebilir' }

  revalidatePath('/dashboard/instructor')
  return { success: true }
}

export async function updateIntroVideo(videoUrl: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const trimmedUrl = videoUrl.trim()

  if (trimmedUrl === '') {
    const { error } = await supabase.from('instructors').update({ intro_video_url: null }).eq('user_id', user.id)
    if (error) return { success: false, error: error.message }
    revalidatePath('/dashboard/instructor/profile')
    return { success: true }
  }

  const ownStorageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/instructor-videos/`
  const isEmbed = parseVideoUrl(trimmedUrl) !== null
  const isOwnUpload = trimmedUrl.startsWith(ownStorageUrl)

  if (!isEmbed && !isOwnUpload) {
    return { success: false, error: 'Sadece YouTube/Vimeo linki ya da doğrudan yüklenen video kabul ediliyor' }
  }

  const { error } = await supabase.from('instructors').update({ intro_video_url: trimmedUrl }).eq('user_id', user.id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/instructor/profile')
  revalidatePath('/instructors')
  return { success: true }
}
