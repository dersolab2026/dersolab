'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { notifyQuestionAnswered } from '@/lib/notifications/send-question-notification'

type ActionResult = { success: true; questionId: string } | { success: false; error: string }

interface AskQuestionParams {
  subject: string
  questionText: string
}

function friendlyQuestionError(message: string): string {
  if (message.includes('Soru kredin kalmadı')) return message
  if (message.includes('row-level security')) return 'Soru gönderilemedi, tekrar dener misin?'
  return message
}

export async function askQuestion(params: AskQuestionParams): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { data: question, error } = await supabase
    .from('questions')
    .insert({
      student_id: user.id,
      asked_by: user.id,
      subject: params.subject,
      question_text: params.questionText,
    })
    .select('id')
    .single()

  if (error || !question) {
    return { success: false, error: friendlyQuestionError(error?.message ?? 'Soru gönderilemedi') }
  }

  revalidatePath('/dashboard/student/questions')
  revalidatePath('/dashboard/instructor/questions')
  return { success: true, questionId: question.id }
}

type AnswerActionResult = { success: true } | { success: false; error: string }

// Acik havuzdan alma ve cevaplama tek atomik islem: instructor_id hala bos ve
// status hala 'pending' olan bir soruyu kendine atayip ayni anda cevapliyor.
// Iki egitmen ayni anda denerse sadece biri kazanir, digeri "zaten cevaplandi" gorur.
export async function answerQuestion(questionId: string, answerText: string | null): Promise<AnswerActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { data: question, error } = await supabase
    .from('questions')
    .update({ instructor_id: user.id, answer_text: answerText, status: 'answered', answered_at: new Date().toISOString() })
    .eq('id', questionId)
    .eq('status', 'pending')
    .is('instructor_id', null)
    .select('student_id, question_text')
    .maybeSingle()

  if (error) return { success: false, error: error.message }
  if (!question) return { success: false, error: 'Bu soru başka bir eğitmen tarafından zaten cevaplandı' }

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

export async function declineQuestion(questionId: string): Promise<AnswerActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase.from('question_declines').insert({ question_id: questionId, instructor_id: user.id })
  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/instructor/questions')
  return { success: true }
}
