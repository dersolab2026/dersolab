'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createBooking } from '@/actions/bookings'
import { notifyDemoLessonRequested } from '@/lib/notifications/send-demo-lesson-notification'
import type { TimeSlot } from '@/types'

type ActionResult = { success: true } | { success: false; error: string }

/**
 * Hos geldin paketi: tanisma dersi ve 1 haftalik kocluk birlikte
 * veriliyor. Ogrenci tek sefer talep ediyor, arka planda iki ayri talep
 * aciliyor cunku ikisini farkli havuzlar ustleniyor: dersi tanisma dersi
 * veren egitmenler, koclugu Koçluk bransi olan koclar.
 *
 * Ogrenci haklardan birini daha once kullandiysa (ornegin eski tek hakli
 * donemden kalma) yalnizca kalan hak icin talep aciliyor.
 */
export async function requestDemoLesson(studentId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const admin = createAdminClient()
  const { data: studentUser } = await admin.from('users').select('name').eq('id', studentId).single()

  const turler = ['demo_lesson', 'coaching_week'] as const
  const hatalar: string[] = []
  let acilan = 0

  for (const tur of turler) {
    const { error } = await supabase.from('demo_lesson_requests').insert({
      student_id: studentId,
      requested_by: user.id,
      request_type: tur,
    })
    if (error) hatalar.push(error.message)
    else acilan++
  }

  // Ikisi de acilamadiysa kullaniciya sebebini soyle.
  if (acilan === 0) {
    const hepsi = hatalar.join(' | ')
    let message = hepsi
    if (hepsi.includes('zaten kullanilmis')) {
      message = 'Hoş geldin paketini zaten kullandın'
    } else if (hepsi.includes('zaten bekleyen')) {
      message = 'Zaten bekleyen bir talebin var'
    } else if (hepsi.includes('row-level security')) {
      message = 'Bu işlem için yetkin yok'
    } else if (hepsi.includes('violates foreign key')) {
      message = 'Hoş geldin paketi sadece öğrenci hesapları için geçerli'
    }
    return { success: false, error: message }
  }

  await notifyDemoLessonRequested(studentUser?.name ?? 'Bir öğrenci')

  revalidatePath('/demo-ders')
  return { success: true }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function requestDemoLessonByEmail(name: string, email: string): Promise<ActionResult> {
  const trimmedName = name.trim()
  const trimmedEmail = email.trim().toLowerCase()

  if (!trimmedName) return { success: false, error: 'İsmini girmelisin' }
  if (!EMAIL_RE.test(trimmedEmail)) return { success: false, error: 'Geçerli bir e-posta adresi gir' }

  const admin = createAdminClient()

  const { data: existingUser } = await admin.from('users').select('id').eq('email', trimmedEmail).maybeSingle()
  if (existingUser) {
    return { success: false, error: 'Bu e-posta zaten kayıtlı — giriş yapıp hoş geldin paketini talep edebilirsin' }
  }

  const { data: existingRequest } = await admin
    .from('demo_lesson_requests')
    .select('id')
    .eq('lead_email', trimmedEmail)
    .eq('status', 'pending')
    .maybeSingle()
  if (existingRequest) {
    return { success: false, error: 'Zaten bekleyen bir tanışma dersi talebin var' }
  }

  const { error } = await admin.from('demo_lesson_requests').insert({
    lead_name: trimmedName,
    lead_email: trimmedEmail,
  })

  if (error) return { success: false, error: error.message }

  await notifyDemoLessonRequested(trimmedName)

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

export async function claimDemoLead(requestId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { data: claimed, error } = await supabase
    .from('demo_lesson_requests')
    .update({ status: 'assigned', assigned_instructor_id: user.id, resolved_at: new Date().toISOString() })
    .eq('id', requestId)
    .eq('status', 'pending')
    .is('student_id', null)
    .select('id')
    .maybeSingle()

  if (error || !claimed) return { success: false, error: 'Bu talep başka bir eğitmen tarafından zaten alındı' }

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
