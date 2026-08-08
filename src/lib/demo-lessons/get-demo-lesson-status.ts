import { createClient } from '@/lib/supabase/server'

export interface DemoLessonStatus {
  freeTrialUsed: boolean
  requestStatus: 'pending' | 'assigned' | 'cancelled' | null
}

export async function getDemoLessonStatus(studentId: string): Promise<DemoLessonStatus> {
  const supabase = await createClient()

  const [{ data: student }, { data: request }] = await Promise.all([
    supabase.from('students').select('free_trial_used').eq('user_id', studentId).single(),
    supabase
      .from('demo_lesson_requests')
      .select('status')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  return {
    freeTrialUsed: student?.free_trial_used ?? false,
    requestStatus: (request?.status as DemoLessonStatus['requestStatus']) ?? null,
  }
}
