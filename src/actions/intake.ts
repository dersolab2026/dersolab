'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ActionResult = { success: true } | { success: false; error: string }

export interface IntakeInput {
  goal: string
  hardSubjects: string
  dailyRoutine: string
  triedMethods: string
  studyEnvironment: string
  whoWanted: 'kendim' | 'ailem' | 'ikimiz' | null
  notes: string
}

export async function saveIntakeForm(input: IntakeInput): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const satir = {
    student_id: user.id,
    goal: input.goal.trim() || null,
    hard_subjects: input.hardSubjects.trim() || null,
    daily_routine: input.dailyRoutine.trim() || null,
    tried_methods: input.triedMethods.trim() || null,
    study_environment: input.studyEnvironment.trim() || null,
    who_wanted: input.whoWanted,
    notes: input.notes.trim() || null,
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
