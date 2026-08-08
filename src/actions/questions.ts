'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { notifyQuestionAsked, notifyQuestionAnswered } from '@/lib/notifications/send-question-notification'

type ActionResult = { success: true; questionId: string } | { success: false; error: string }

interface AskQuestionParams {
  instructorId: string
  questionText: string
}

export async function askQuestion(params: AskQuestionParams): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { data: question, error } = await supabase
    .from('questions')
    .insert({
      student_id: user.id,
      instructor_id: params.instructorId,
      asked_by: user.id,
      question_text: params.questionText,
    })
    .select('id')
    .single()

  if (error || !question) {
    let message = error?.message ?? 'Soru gönderilemedi'
    if (error?.message.includes('row-level security')) {
      message = 'Bu eğitmene soru soramazsın, önce bir ders almış olman gerekiyor'
    }
    return { success: false, error: message }
  }

  const admin = createAdminClient()
  const { data: studentUser } = await admin.from('users').select('name').eq('id', user.id).single()
  await notifyQuestionAsked({
    instructorId: params.instructorId,
    studentName: studentUser?.name ?? 'Bir öğrenci',
    questionText: params.questionText,
  })

  revalidatePath('/dashboard/student/questions')
  revalidatePath('/dashboard/instructor/questions')
  return { success: true, questionId: question.id }
}

type AnswerActionResult = { success: true } | { success: false; error: string }

export async function answerQuestion(questionId: string, answerText: string | null): Promise<AnswerActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { data: question, error } = await supabase
    .from('questions')
    .update({ answer_text: answerText, status: 'answered', answered_at: new Date().toISOString() })
    .eq('id', questionId)
    .eq('instructor_id', user.id)
    .select('student_id, question_text')
    .single()

  if (error || !question) return { success: false, error: error?.message ?? 'Soru güncellenemedi' }

  const admin = createAdminClient()
  const { data: instructorUser } = await admin.from('users').select('name').eq('id', user.id).single()
  await notifyQuestionAnswered({
    studentId: question.student_id,
    instructorName: instructorUser?.name ?? 'Eğitmen',
    questionText: question.question_text,
    answerText: answerText ?? '(dosya eklendi)',
  })

  revalidatePath('/dashboard/student/questions')
  revalidatePath('/dashboard/instructor/questions')
  return { success: true }
}
