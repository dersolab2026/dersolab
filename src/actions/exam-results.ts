'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { EXAM_TYPES, supportsObp, type ExamType } from '@/lib/exams/scoring'

type ActionResult = { success: true } | { success: false; error: string }

export interface ExamResultEntry {
  id: string
  examName: string
  examType: ExamType
  examDate: string
  correctCount: number
  wrongCount: number
  obp: number | null
}

interface AddExamResultParams {
  examName: string
  examType: ExamType
  examDate: string
  correctCount: number
  wrongCount: number
  obp?: number | null
}

export async function addExamResult(params: AddExamResultParams): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  if (!params.examName.trim()) return { success: false, error: 'Deneme adı boş olamaz' }
  if (!EXAM_TYPES.includes(params.examType)) return { success: false, error: 'Geçersiz deneme türü' }
  if (params.correctCount < 0 || params.wrongCount < 0) {
    return { success: false, error: 'Doğru ve yanlış sayısı negatif olamaz' }
  }
  if (params.obp != null && (params.obp < 100 || params.obp > 500)) {
    return { success: false, error: 'OBP 100 ile 500 arasında olmalı' }
  }

  const { error } = await supabase.from('student_exam_results').insert({
    student_id: user.id,
    exam_name: params.examName.trim(),
    exam_type: params.examType,
    exam_date: params.examDate,
    correct_count: params.correctCount,
    wrong_count: params.wrongCount,
    obp: supportsObp(params.examType) ? params.obp ?? null : null,
  })

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/student/netlerim')
  return { success: true }
}

export async function deleteExamResult(id: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase
    .from('student_exam_results').delete().eq('id', id).eq('student_id', user.id)

  if (error) return { success: false, error: error.message }
  revalidatePath('/dashboard/student/netlerim')
  return { success: true }
}

export async function getExamResults(): Promise<ExamResultEntry[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('student_exam_results')
    .select('id, exam_name, exam_type, exam_date, correct_count, wrong_count, obp')
    .eq('student_id', user.id)
    .order('exam_date', { ascending: false })

  return (data ?? []).map((r: any) => ({
    id: r.id,
    examName: r.exam_name,
    examType: r.exam_type as ExamType,
    examDate: r.exam_date,
    correctCount: r.correct_count,
    wrongCount: r.wrong_count,
    obp: r.obp === null ? null : Number(r.obp),
  }))
}
