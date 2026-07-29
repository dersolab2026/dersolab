'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import {
  notifyHomeworkAssigned,
  notifyHomeworkCompleted,
  notifyHomeworkSubmitted as sendHomeworkSubmittedNotification,
} from '@/lib/notifications/send-guardian-notification'

type ActionResult = { success: true } | { success: false; error: string }

interface AssignHomeworkParams {
  studentId: string
  bookingId?: string
  title: string
  description?: string
  dueDate?: string
}

export async function assignHomework(params: AssignHomeworkParams): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { data: homework, error } = await supabase
    .from('homework')
    .insert({
      booking_id: params.bookingId ?? null,
      student_id: params.studentId,
      instructor_id: user.id,
      title: params.title,
      description: params.description ?? null,
      due_date: params.dueDate ?? null,
    })
    .select('id')
    .single()

  if (error || !homework) return { success: false, error: error?.message ?? 'Ödev oluşturulamadı' }

  await notifyHomeworkAssigned({
    studentId: params.studentId, homeworkId: homework.id, title: params.title, dueDate: params.dueDate ?? null,
  })

  revalidatePath('/dashboard/student/homework')
  revalidatePath('/dashboard/instructor/homework')
  return { success: true }
}

export async function notifyHomeworkSubmitted(homeworkId: string): Promise<void> {
  const supabase = await createClient()
  const { data: homework } = await supabase.from('homework').select('title, instructor_id').eq('id', homeworkId).single()
  if (!homework) return

  await sendHomeworkSubmittedNotification({
    homeworkId, instructorId: homework.instructor_id, title: homework.title,
  })
  revalidatePath('/dashboard/instructor/homework')
}

export async function markHomeworkCompleted(homeworkId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { data: homework, error } = await supabase
    .from('homework')
    .update({ status: 'completed', completed_at: new Date().toISOString() })
    .eq('id', homeworkId)
    .eq('instructor_id', user.id)
    .select('student_id, title')
    .single()

  if (error || !homework) return { success: false, error: error?.message ?? 'Ödev güncellenemedi' }

  await notifyHomeworkCompleted({ studentId: homework.student_id, homeworkId, title: homework.title })

  revalidatePath('/dashboard/student/homework')
  revalidatePath('/dashboard/instructor/homework')
  return { success: true }
}
