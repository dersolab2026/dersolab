'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createBooking } from '@/actions/bookings'
import { notifyDemoLessonRequested } from '@/lib/notifications/send-demo-lesson-notification'
import type { TimeSlot } from '@/types'

type ActionResult = { success: true } | { success: false; error: string }

export async function requestDemoLesson(studentId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const admin = createAdminClient()
  const { data: studentUser } = await admin.from('users').select('name').eq('id', studentId).single()

  const { error } = await supabase.from('demo_lesson_requests').insert({
    student_id: studentId,
    requested_by: user.id,
  })

  if (error) {
    let message = error.message
    if (error.message.includes('zaten kullanilmis')) {
      message = 'Ücretsiz tanışma dersi hakkını zaten kullandın'
    } else if (error.message.includes('zaten bekleyen bir tanisma dersi talebi')) {
      message = 'Zaten bekleyen bir tanışma dersi talebin var'
    } else if (error.message.includes('row-level security')) {
      message = 'Bu işlem için yetkin yok'
    } else if (error.code === '23503') {
      message = 'Ücretsiz tanışma dersi sadece öğrenci hesapları için geçerli'
    }
    return { success: false, error: message }
  }

  await notifyDemoLessonRequested(studentUser?.name ?? 'Bir öğrenci')

  revalidatePath('/demo-ders')
  return { success: true }
}

export async function declineDemoLessonRequest(requestId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase.from('demo_lesson_declines').insert({
    request_id: requestId,
    instructor_id: user.id,
  })

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/instructor/demo-talepleri')
  return { success: true }
}

export async function acceptDemoLessonRequest(
  requestId: string,
  slot: TimeSlot
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { data: claimed, error: claimError } = await supabase
    .from('demo_lesson_requests')
    .update({ status: 'assigned', assigned_instructor_id: user.id, resolved_at: new Date().toISOString() })
    .eq('id', requestId)
    .eq('status', 'pending')
    .select('student_id')
    .single()

  if (claimError || !claimed) {
    return { success: false, error: 'Bu talep başka bir eğitmen tarafından zaten alındı' }
  }

  const bookingResult = await createBooking({
    instructorId: user.id,
    studentId: claimed.student_id,
    slot,
    isTrial: true,
  })

  if (!bookingResult.success) {
    await supabase
      .from('demo_lesson_requests')
      .update({ status: 'pending', assigned_instructor_id: null, resolved_at: null })
      .eq('id', requestId)
    return { success: false, error: bookingResult.error }
  }

  const admin = createAdminClient()
  await admin.from('demo_lesson_requests').update({ booking_id: bookingResult.bookingId }).eq('id', requestId)

  revalidatePath('/dashboard/instructor/demo-talepleri')
  revalidatePath('/dashboard/instructor')
  revalidatePath('/demo-ders')
  return { success: true }
}
