import { createClient } from '@/lib/supabase/server'

export interface DemoLessonStatus {
  /** Tanışma dersi hakkı kullanıldı mı. */
  freeTrialUsed: boolean
  /** Tanışma dersi talebinin durumu. */
  requestStatus: 'pending' | 'assigned' | 'cancelled' | null
}

/**
 * Ogrencinin hos geldin paketi (ucretsiz tanisma dersi) durumu.
 */
export async function getDemoLessonStatus(studentId: string): Promise<DemoLessonStatus> {
  const supabase = await createClient()

  const [{ data: student }, { data: dersTalebi }] = await Promise.all([
    supabase.from('students').select('free_trial_used').eq('user_id', studentId).single(),
    supabase
      .from('demo_lesson_requests')
      .select('status')
      .eq('student_id', studentId)
      .eq('request_type', 'demo_lesson')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  return {
    freeTrialUsed: student?.free_trial_used ?? false,
    requestStatus: (dersTalebi?.status as DemoLessonStatus['requestStatus']) ?? null,
  }
}
