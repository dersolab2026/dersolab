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
