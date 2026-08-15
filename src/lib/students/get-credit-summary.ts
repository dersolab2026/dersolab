import { createClient } from '@/lib/supabase/server'

export interface StudentCreditSummary {
  remaining: number
  lessonCount: number
  lessonCreditsUsed: number
  guidanceCount: number
  guidanceCreditsUsed: number
}

export async function getStudentCreditSummary(studentId: string): Promise<StudentCreditSummary> {
  const supabase = await createClient()

  const { data: studentRow } = await supabase.from('students').select('credit_balance').eq('user_id', studentId).single()

  const { data: bookings } = await supabase
    .from('bookings')
    .select('credits_used, status, credit_refunded, session_type')
    .eq('student_id', studentId)

  // Iade edilmis (gec olmayan) iptaller haric, gercekten harcanmis krediler.
  const usedBookings = (bookings ?? []).filter((b) => !(b.status === 'cancelled' && b.credit_refunded === true))

  let lessonCount = 0
  let lessonCreditsUsed = 0
  let guidanceCount = 0
  let guidanceCreditsUsed = 0

  for (const b of usedBookings) {
    if (b.session_type === 'coaching') {
      guidanceCount += 1
      guidanceCreditsUsed += b.credits_used
    } else {
      lessonCount += 1
      lessonCreditsUsed += b.credits_used
    }
  }

  return {
    remaining: studentRow?.credit_balance ?? 0,
    lessonCount,
    lessonCreditsUsed,
    guidanceCount,
    guidanceCreditsUsed,
  }
}
