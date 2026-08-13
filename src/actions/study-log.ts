'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ActionResult = { success: true } | { success: false; error: string }

export interface StudyLogEntry {
  id: string
  logDate: string
  subject: string
  topic: string | null
  hours: number | null
  questionsSolved: number | null
  source: string | null
}

interface AddStudyLogParams {
  logDate: string
  subject: string
  topic?: string
  hours?: number
  questionsSolved?: number
  source?: string
}

export async function getMyStudyLogs(): Promise<StudyLogEntry[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('student_study_logs')
    .select('id, log_date, subject, topic, hours, questions_solved, source')
    .eq('student_id', user.id)
    .order('log_date', { ascending: false })

  return (data ?? []).map((row) => ({
    id: row.id,
    logDate: row.log_date,
    subject: row.subject,
    topic: row.topic,
    hours: row.hours,
    questionsSolved: row.questions_solved,
    source: row.source,
  }))
}

export async function addStudyLogEntry(params: AddStudyLogParams): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }
  if (!params.subject.trim()) return { success: false, error: 'Ders seçmelisin' }

  const { error } = await supabase.from('student_study_logs').insert({
    student_id: user.id,
    log_date: params.logDate,
    subject: params.subject,
    topic: params.topic?.trim() || null,
    hours: params.hours ?? null,
    questions_solved: params.questionsSolved ?? null,
    source: params.source?.trim() || null,
  })

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/student/gunluk')
  return { success: true }
}

export async function deleteStudyLogEntry(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase.from('student_study_logs').delete().eq('id', id).eq('student_id', user.id)
  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/student/gunluk')
  return { success: true }
}
