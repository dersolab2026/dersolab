import { createClient } from '@/lib/supabase/server'
import { GUIDANCE_SUBJECT } from '@/lib/constants'

export interface StudentCreditSummary {
  remaining: number
  lessonCount: number
  lessonCreditsUsed: number
  guidanceCount: number
  guidanceCreditsUsed: number
  questionCreditsRemaining: number
  questionsAsked: number
}

export async function getStudentCreditSummary(studentId: string): Promise<StudentCreditSummary> {
  const supabase = await createClient()

  const [{ data: studentRow }, { count: questionsAsked }] = await Promise.all([
    supabase.from('students').select('credit_balance, question_credit_balance').eq('user_id', studentId).single(),
    supabase.from('questions').select('id', { count: 'exact', head: true }).eq('student_id', studentId),
  ])

  const { data: bookings } = await supabase
    .from('bookings')
    .select('instructor_id, credits_used, status, credit_refunded')
    .eq('student_id', studentId)

  // Iade edilmis (gec olmayan) iptaller haric, gercekten harcanmis krediler.
  const usedBookings = (bookings ?? []).filter((b) => !(b.status === 'cancelled' && b.credit_refunded === true))

  const instructorIds = [...new Set(usedBookings.map((b) => b.instructor_id))]
  const { data: instructors } = instructorIds.length
    ? await supabase.from('instructors').select('user_id, subjects').in('user_id', instructorIds)
    : { data: [] as { user_id: string; subjects: string[] }[] }

  const guidanceInstructorIds = new Set(
    (instructors ?? []).filter((i) => i.subjects?.includes(GUIDANCE_SUBJECT)).map((i) => i.user_id)
  )

  let lessonCount = 0
  let lessonCreditsUsed = 0
  let guidanceCount = 0
  let guidanceCreditsUsed = 0

  for (const b of usedBookings) {
    if (guidanceInstructorIds.has(b.instructor_id)) {
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
    questionCreditsRemaining: studentRow?.question_credit_balance ?? 0,
    questionsAsked: questionsAsked ?? 0,
  }
}
