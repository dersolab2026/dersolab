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
import { LESSON_DURATION_MINUTES, TRIAL_LESSON_DURATION_MINUTES } from '@/lib/constants'
import type { TimeSlot, SessionType } from '@/types'

type ActionResult = { success: true } | { success: false; error: string }

interface CreateBookingParams {
  instructorId: string
  studentId: string
  slot: TimeSlot
  isTrial?: boolean
  topicNote?: string
  sessionType?: SessionType
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
  sessionType,
}: CreateBookingParams): Promise<CreateBookingResult> {
  const supabase = await createClient()
  const admin = createAdminClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { success: false, error: 'Bu işlem için giriş yapmalısın' }
  }

  const startMs = Date.parse(slot.start)
  if (!Number.isFinite(startMs)) {
    return { success: false, error: 'Geçersiz ders saati seçildi' }
  }
  if (startMs < Date.now() - 60_000) {
    return { success: false, error: 'Geçmiş bir saat için ders planlanamaz' }
  }

  const durationMins = isTrial ? TRIAL_LESSON_DURATION_MINUTES : LESSON_DURATION_MINUTES
  const startIso = new Date(startMs).toISOString()
  const endTime = new Date(startMs + durationMins * 60_000).toISOString()

  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      student_id: studentId,
      instructor_id: instructorId,
      purchased_by: user.id,
      start_time: startIso,
      end_time: endTime,
      status: 'scheduled',
      is_trial: isTrial ?? false,
      topic_note: topicNote?.trim().slice(0, 300) || null,
      session_type: sessionType === 'coaching' ? 'coaching' : 'lesson',
    })
    .select('id')
    .single()

  if (bookingError || !booking) {
    const ham = bookingError?.message ?? ''

    // Cakisma kisitlari veritabaninda (20260827120000). Kontrolu burada
    // yapmiyoruz cunku uygulama katmanindaki "once bak sonra yaz" yarisi
    // cozmuyor: iki istek ayni anda kontrolu gecip ikisi de yaziyor.
    // Kisit tek islemde, kilitle cozuyor; bize dusen ham Postgres
    // hatasini kullanicinin anlayacagi cumleye cevirmek.
    let message: string
    if (ham.includes('zaten kullanilmis')) {
      message = 'Ücretsiz tanışma dersi hakkını zaten kullandın'
    } else if (ham.includes('bookings_egitmen_cakisma')) {
      message = 'Bu saat az önce başka bir öğrenci tarafından alındı. Lütfen başka bir saat seç.'
    } else if (ham.includes('bookings_ogrenci_cakisma')) {
      message = 'Aynı saatte zaten planlanmış bir dersin var. Lütfen başka bir saat seç.'
    } else if (ham.includes('credit_balance')) {
      // check (credit_balance >= 0) kisiti: es zamanli iki rezervasyon
      // kontrolu birlikte gecip ikinci dusme bakiyeyi eksiye indirirse.
      message = 'Kredin bu ders için yetmiyor. Bakiyeni kontrol et.'
    } else {
      message = ham || 'Rezervasyon oluşturulamadı'
    }
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

    // cancelled_by BILEREK 'admin': refund_credit_on_cancel yalnizca
    // cancelled_by IN ('instructor','admin') ise ya da derse 24 saatten
    // fazla varsa krediyi iade ediyor (0017). Burasi yalnizca status
    // yaziyordu, cancelled_by NULL kaliyordu — yani derse 24 saatten az
    // kala takvim hatasi olursa kredi YANIYORDU, ekranda ise "kredin
    // iade edildi" yaziyordu. Iptali sistem yapiyor, ogrencinin kusuru
    // yok; iade her durumda dogru olan.
    await admin
      .from('bookings')
      .update({ status: 'cancelled', cancelled_by: 'admin' })
      .eq('id', booking.id)

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

  const nowIso = new Date().toISOString()
  const { data: booking, error } = await supabase
    .from('bookings')
    .update({ status: 'completed', completed_at: nowIso, instructor_notes: instructorNotes?.slice(0, 1000) ?? null })
    .eq('id', bookingId)
    .eq('instructor_id', user.id)
    .eq('status', 'scheduled')
    .lte('start_time', nowIso)
    .select('student_id, start_time')
    .single()

  if (error || !booking) return { success: false, error: 'Yalnızca başlamış ve planlı bir ders tamamlandı olarak işaretlenebilir' }

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

  const nowIso = new Date().toISOString()
  const { data: booking, error } = await supabase
    .from('bookings')
    .update({ status: 'no_show', completed_at: nowIso })
    .eq('id', bookingId)
    .eq('instructor_id', user.id)
    .eq('status', 'scheduled')
    .lte('start_time', nowIso)
    .select('student_id, start_time')
    .single()

  if (error || !booking) return { success: false, error: 'Yalnızca saati gelmiş ve planlı bir ders katılmadı olarak işaretlenebilir' }

  const { data: instructorUser2 } = await admin.from('users').select('name').eq('id', user.id).single()
  await notifyLessonMissed({
    studentId: booking.student_id, bookingId,
    instructorName: instructorUser2?.name ?? 'Eğitmen', startTime: booking.start_time,
  })

  revalidatePath('/dashboard/instructor')
  revalidatePath('/dashboard/student/bookings')
  return { success: true }
}
