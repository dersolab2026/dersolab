'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ActionResult = { success: true } | { success: false; error: string }

interface SubmitReviewParams {
  bookingId: string
  studentId: string
  instructorId: string
  rating: number
  comment?: string
}

export async function submitReview(params: SubmitReviewParams): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  if (params.rating < 1 || params.rating > 5) {
    return { success: false, error: 'Puan 1 ile 5 arasında olmalı' }
  }

  const { error } = await supabase.from('reviews').insert({
    booking_id: params.bookingId,
    student_id: params.studentId,
    instructor_id: params.instructorId,
    rating: params.rating,
    comment: params.comment ?? null,
  })

  if (error) {
    if (error.code === '23505') return { success: false, error: 'Bu dersi zaten değerlendirdin' }
    return { success: false, error: error.message }
  }

  revalidatePath('/dashboard/student/bookings')
  revalidatePath(`/instructors/${params.instructorId}`)
  revalidatePath('/instructors')
  return { success: true }
}
