'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ActionResult = { success: true } | { success: false; error: string }

interface UpdateStudentProfileParams {
  name: string
  schoolName: string
  grade: number
  track?: 'sayisal' | 'sozel' | 'ea' | 'dil'
}

export async function updateStudentProfile(params: UpdateStudentProfileParams): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }
  if (!params.name.trim()) return { success: false, error: 'Ad soyad boş olamaz' }
  if (!params.schoolName.trim()) return { success: false, error: 'Okul adı boş olamaz' }

  const gradeTrack = params.grade <= 8 ? 'lgs' : 'yks'
  const track = params.grade >= 9 ? params.track ?? null : null

  const { error: userError } = await supabase.from('users').update({ name: params.name }).eq('id', user.id)
  if (userError) return { success: false, error: userError.message }

  const { error: studentError } = await supabase
    .from('students')
    .update({ school_name: params.schoolName, grade: params.grade, grade_track: gradeTrack, track })
    .eq('user_id', user.id)
  if (studentError) return { success: false, error: studentError.message }

  revalidatePath('/dashboard/student/settings')
  return { success: true }
}
