'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { OdevTipi } from '@/lib/homework/types'
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
  homeworkType?: OdevTipi
  resourceId?: string | null
  resourceRange?: string | null
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
      homework_type: params.homeworkType ?? 'serbest',
      resource_id: params.resourceId ?? null,
      resource_range: params.resourceRange?.trim() || null,
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

  // Bu bir sunucu eylemi, yani HTTP ucu — arayuzde yalnizca yukleme
  // bittikten sonra cagriliyor olmasi kimseyi baglamiyor. Onceden tek
  // kapi RLS'in okuma izniydi: odevi OKUYABILEN herkes (ogrencinin
  // kendisi, hatta velisi) bildirimi tetikleyebiliyordu. Yani hic teslim
  // yapmadan egitmene "odev teslim edildi" dusurmek mumkundu.
  //
  // Artik gonderen, odevin SAHIBI ogrenci olmali ve teslim GERCEKTEN
  // kaydedilmis olmali. Ikisi de dogrulanmadan bildirim gitmiyor.
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: homework } = await supabase
    .from('homework')
    .select('title, instructor_id, student_id')
    .eq('id', homeworkId)
    .single()
  if (!homework) return
  if (homework.student_id !== user.id) return

  const { data: teslim } = await supabase
    .from('homework_submissions')
    .select('id')
    .eq('homework_id', homeworkId)
    .limit(1)
    .maybeSingle()
  if (!teslim) return

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

/**
 * Kaynak katalogu: liste ve ekleme.
 *
 * Katalog ortak — bir egitmenin ekledigi kitabi digerleri de kullaniyor.
 * Kisiye ozel katalog, ayni kitabin 17 kez girilmesi demek olurdu.
 */
export async function listResources(subject?: string) {
  const supabase = await createClient()
  let sorgu = supabase
    .from('study_resources')
    .select('id, publisher, title, subject, exam_type, total_units')
    .order('title')
  if (subject) sorgu = sorgu.eq('subject', subject)
  const { data } = await sorgu
  return data ?? []
}

export async function addResource(params: {
  publisher: string
  title: string
  subject: string | null
  examType: string | null
  totalUnits: number | null
}): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  if (!params.title.trim()) return { success: false, error: 'Kaynak adı boş olamaz' }
  if (params.totalUnits !== null && params.totalUnits <= 0) {
    return { success: false, error: 'Bölüm sayısı pozitif olmalı' }
  }

  const { error } = await supabase.from('study_resources').insert({
    publisher: params.publisher.trim() || null,
    title: params.title.trim(),
    subject: params.subject,
    exam_type: params.examType,
    total_units: params.totalUnits,
    created_by: user.id,
  })

  if (error) {
    if (error.message.includes('duplicate') || error.message.includes('unique')) {
      return { success: false, error: 'Bu kaynak katalogda zaten var' }
    }
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/instructor/homework')
  return { success: true }
}

/** Egitmenin odevi onaylarken birakabilecegi kisa geri bildirim. */
export async function saveHomeworkFeedback(
  homeworkId: string, feedback: string,
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase
    .from('homework')
    .update({ instructor_feedback: feedback.trim() || null })
    .eq('id', homeworkId)
    .eq('instructor_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/instructor/homework')
  revalidatePath('/dashboard/student/homework')
  return { success: true }
}
