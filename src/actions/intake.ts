'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { gecerliAnahtarlar } from '@/lib/coaching/intake-options'

type ActionResult = { success: true } | { success: false; error: string }

/**
 * Form cevaplari secenek ANAHTARI dizileri.
 *
 * notes disindaki her alan coktan secmeli; serbest metin yalnizca
 * "eklemek istedigin baska bir sey" sorusunda kaldi.
 */
export interface IntakeInput {
  goal: string[]
  hardSubjects: string[]
  dailyRoutine: string[]
  triedMethods: string[]
  studyEnvironment: string[]
  whoWanted: 'kendim' | 'ailem' | 'ikimiz' | null
  notes: string
}

const KIM_DEGERLERI = ['kendim', 'ailem', 'ikimiz'] as const

export async function saveIntakeForm(input: IntakeInput): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  // Anahtarlar katalogla dogrulaniyor: istemciden gelen tanimsiz bir deger
  // veritabanina yazilmasin. Bos dizi null olarak saklaniyor ki "cevaplanmadi"
  // ile "hicbiri secilmedi" ayni gorunsun.
  const dizi = (alan: Parameters<typeof gecerliAnahtarlar>[0], v: string[]) => {
    const temiz = gecerliAnahtarlar(alan, Array.isArray(v) ? v : [])
    return temiz.length > 0 ? temiz : null
  }

  const satir = {
    student_id: user.id,
    goal: dizi('goal', input.goal),
    hard_subjects: dizi('hardSubjects', input.hardSubjects),
    daily_routine: dizi('dailyRoutine', input.dailyRoutine),
    tried_methods: dizi('triedMethods', input.triedMethods),
    study_environment: dizi('studyEnvironment', input.studyEnvironment),
    who_wanted: KIM_DEGERLERI.includes(input.whoWanted as never) ? input.whoWanted : null,
    notes: input.notes.trim().slice(0, 1000) || null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('student_intake_forms')
    .upsert(satir, { onConflict: 'student_id' })

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/student/kocluk-formu')
  return { success: true }
}

export async function saveSelfAssessment(answers: Record<string, number>): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const gecerli = Object.entries(answers).filter(
    ([, v]) => typeof v === 'number' && v >= 1 && v <= 5,
  )
  if (gecerli.length === 0) {
    return { success: false, error: 'En az bir soruyu cevaplamalısın' }
  }

  const { error } = await supabase.from('student_self_assessments').insert({
    student_id: user.id,
    answers: Object.fromEntries(gecerli),
  })

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/student/kocluk-formu')
  return { success: true }
}

export async function deleteSelfAssessment(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase.from('student_self_assessments').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/student/kocluk-formu')
  return { success: true }
}
