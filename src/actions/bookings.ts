'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createCalendarEventWithMeet } from '@/lib/google/create-calendar-event'
import { deleteCalendarEvent } from '@/lib/google/delete-calendar-event'
import {
  notifyBookingCreated,
  notifyBookingCancelled,
  notifyLessonCompleted,
  notifyLessonMissed,
} from '@/lib/notifications/send-guardian-notification'
import { TRIAL_LESSON_DURATION_MINUTES } from '@/lib/constants'
import type { TimeSlot } from '@/types'

type ActionResult = { success: true } | { success: false; error: string }

interface CreateBookingParams {
  instructorId: string
  studentId: string
  slot: TimeSlot
  isTrial?: boolean
  topicNote?: string
}

type CreateBookingResult =
  | { success: true; bookingId: string; meetLink: string }
  | { success: false; error: string }

export async function createBooking({
  instructorId,
  studentId,
  slot,
  isTrial,
  topicNote,
}: CreateBookingParams): Promise<CreateBookingResult> {
  const supabase = await createClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Bu işlem için giriş yapmalısın' }
  }

  const endTime = isTrial
    ? new Date(new Date(slot.start).getTime() + TRIAL_LESSON_DURATION_MINUTES * 60_000).toISOString()
    : slot.end

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      student_id: studentId,
      instructor_id: instructorId,
      purchased_by: user.id,
      start_time: slot.start,
      end_time: endTime,
      status: 'scheduled',
      is_trial: isTrial ?? false,
      topic_note: topicNote?.trim() || null,
    })
    .select('id')
    .single()

  if (bookingError || !booking) {
    const message = bookingError?.message.includes('zaten kullanilmis')
      ? 'Ücretsiz tanışma dersi hakkını zaten kullandın'
      : bookingError?.message ?? 'Rezervasyon oluşturulamadı'
    return { success: false, error: message }
  }

  const { data: studentUser } = await admin.from('users').select('name').eq('id', studentId).single()
  const { data: instructorUser } = await admin.from('users').select('name').eq('id', instructorId).single()

  try {
    const { eventId, meetLink } = await createCalendarEventWithMeet({
      instructorId,
      studentName: studentUser?.name ?? 'Öğrenci',
      startTime: slot.start,
      endTime,
      bookingId: booking.id,
    })

    const { error: updateError } = await admin
      .from('bookings')
      .update({ meet_link: meetLink, google_event_id: eventId })
      .eq('id', booking.id)

    if (updateError) throw updateError

    await notifyBookingCreated({
      studentId,
      instructorId,
      bookingId: booking.id,
      instructorName: instructorUser?.name ?? 'Eğitmen',
      studentName: studentUser?.name ?? 'Öğrenci',
      startTime: slot.start,
      meetLink,
    })

    revalidatePath('/dashboard/student/bookings')
    revalidatePath('/dashboard/instructor')

    return { success: true, bookingId: booking.id, meetLink }
  } catch (err) {
    console.error('Google Calendar event oluşturma hatası:', err)
    await admin.from('bookings').update({ status: 'cancelled' }).eq('id', booking.id)

    if (isTrial) {
      await admin.from('students').update({ free_trial_used: false }).eq('user_id', studentId)
    }

    return {
      success: false,
      error: isTrial
        ? 'Ders linki oluşturulamadı, ücretsiz tanışma dersi hakkın tekrar açıldı. Lütfen tekrar dene.'
        : 'Ders linki oluşturulamadı, kredin iade edildi. Lütfen tekrar dene.',
    }
  }
}

async function handlePostCancellation(bookingId: string, cancelledBy: 'student' | 'instructor') {
  const admin = createAdminClient()

  const { data: booking } = await admin
    .from('bookings')
    .select('instructor_id, student_id, google_event_id, credit_refunded, start_time')
    .eq('id', bookingId)
    .single()

  if (!booking) return

  if (booking.google_event_id) {
    await deleteCalendarEvent(booking.instructor_id, booking.google_event_id)
  }

  const { data: instructorUser } = await admin
    .from('users')
    .select('name')
    .eq('id', booking.instructor_id)
    .single()

  const { data: studentUser } = await admin
    .from('users')
    .select('name')
    .eq('id', booking.student_id)
    .single()

  await notifyBookingCancelled({
    studentId: booking.student_id,
    instructorId: booking.instructor_id,
    bookingId,
    instructorName: instructorUser?.name ?? 'Eğitmen',
    studentName: studentUser?.name ?? 'Öğrenci',
    startTime: booking.start_time,
    creditRefunded: booking.credit_refunded ?? false,
    cancelledBy,
  })
}

export async function cancelBookingAsStudent(bookingId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase.rpc('cancel_booking', {
    p_booking_id: bookingId,
    p_as_role: 'student',
  })
  if (error) return { success: false, error: error.message }

  await handlePostCancellation(bookingId, 'student')
  revalidatePath('/dashboard/student/bookings')
  revalidatePath('/dashboard/instructor')
  return { success: true }
}

export async function cancelBookingAsInstructor(bookingId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase.rpc('cancel_booking', {
    p_booking_id: bookingId,
    p_as_role: 'instructor',
  })
  if (error) return { success: false, error: error.message }

  await handlePostCancellation(bookingId, 'instructor')
  revalidatePath('/dashboard/instructor')
  revalidatePath('/dashboard/student/bookings')
  return { success: true }
}

export async function markBookingCompleted(bookingId: string, instructorNotes?: string): Promise<ActionResult> {
  const supabase = await createClient()
  const admin = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { data: booking, error } = await supabase
    .from('bookings')
    .update({ status: 'completed', completed_at: new Date().toISOString(), instructor_notes: instructorNotes ?? null })
    .eq('id', bookingId)
    .eq('instructor_id', user.id)
    .select('student_id, start_time')
    .single()

  if (error || !booking) return { success: false, error: error?.message ?? 'Rezervasyon güncellenemedi' }

  const { data: instructorUser } = await admin.from('users').select('name').eq('id', user.id).single()
  await notifyLessonCompleted({
    studentId: booking.student_id, bookingId,
    instructorName: instructorUser?.name ?? 'Eğitmen', startTime: booking.start_time,
  })

  revalidatePath('/dashboard/instructor')
  revalidatePath('/dashboard/student/bookings')
  return { success: true }
}

export async function markBookingNoShow(bookingId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const admin = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { data: booking, error } = await supabase
    .from('bookings')
    .update({ status: 'no_show', completed_at: new Date().toISOString() })
    .eq('id', bookingId)
    .eq('instructor_id', user.id)
    .select('student_id, start_time')
    .single()

  if (error || !booking) return { success: false, error: error?.message ?? 'Rezervasyon güncellenemedi' }

  const { data: instructorUser2 } = await admin.from('users').select('name').eq('id', user.id).single()
  await notifyLessonMissed({
    studentId: booking.student_id, bookingId,
    instructorName: instructorUser2?.name ?? 'Eğitmen', startTime: booking.start_time,
  })

  revalidatePath('/dashboard/instructor')
  revalidatePath('/dashboard/student/bookings')
  return { success: true }
}
