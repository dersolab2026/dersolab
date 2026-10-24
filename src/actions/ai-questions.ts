'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export interface AiQuestionEntry {
  id: string
  timestamp: number
  subject: string
  question: string
  solution: string
  isFavorite: boolean
}

export async function getMyAiQuestions(): Promise<AiQuestionEntry[]> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('student_ai_questions')
      .select('id, subject, question, solution, is_favorite, created_at')
      .eq('student_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error || !data) return []

    return data.map((row) => ({
      id: row.id,
      timestamp: new Date(row.created_at).getTime(),
      subject: row.subject,
      question: row.question,
      solution: row.solution,
      isFavorite: Boolean(row.is_favorite),
    }))
  } catch {
    return []
  }
}

export async function saveAiQuestion(params: {
  subject: string
  question: string
  solution: string
}): Promise<{ success: boolean; id?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { success: false }

    const { data, error } = await supabase
      .from('student_ai_questions')
      .insert({
        student_id: user.id,
        subject: params.subject,
        question: params.question.slice(0, 2000),
        solution: params.solution,
        is_favorite: false,
      })
      .select('id')
      .single()

    if (error || !data) return { success: false }
    revalidatePath('/dashboard/student/ai-asistan')
    return { success: true, id: data.id }
  } catch {
    return { success: false }
  }
}

export async function toggleAiQuestionFavorite(
  id: string,
  isFavorite: boolean,
): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { success: false }

    const { error } = await supabase
      .from('student_ai_questions')
      .update({ is_favorite: isFavorite })
      .eq('id', id)
      .eq('student_id', user.id)

    if (error) return { success: false }
    return { success: true }
  } catch {
    return { success: false }
  }
}

export async function deleteAiQuestion(id: string): Promise<{ success: boolean }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return { success: false }

    const { error } = await supabase
      .from('student_ai_questions')
      .delete()
      .eq('id', id)
      .eq('student_id', user.id)

    if (error) return { success: false }
    return { success: true }
  } catch {
    return { success: false }
  }
}

export async function getStudentAiQuestions(studentId: string): Promise<AiQuestionEntry[]> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return []

    const { data, error } = await supabase
      .from('student_ai_questions')
      .select('id, subject, question, solution, is_favorite, created_at')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(15)

    if (error || !data) return []

    return data.map((row) => ({
      id: row.id,
      timestamp: new Date(row.created_at).getTime(),
      subject: row.subject,
      question: row.question,
      solution: row.solution,
      isFavorite: Boolean(row.is_favorite),
    }))
  } catch {
    return []
  }
}
