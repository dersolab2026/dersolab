import { createClient } from '@/lib/supabase/server'

export interface DemoLessonStatus {
  /** Tanışma dersi hakkı kullanıldı mı. */
  freeTrialUsed: boolean
  /** 1 haftalık koçluk hakkı kullanıldı mı. */
  freeCoachingUsed: boolean
  /** Tanışma dersi talebinin durumu. */
  requestStatus: 'pending' | 'assigned' | 'cancelled' | null
  /** Koçluk talebinin durumu. */
  coachingStatus: 'pending' | 'assigned' | 'cancelled' | null
}

/**
 * Tanışma dersi ve koçluk birlikte veriliyor ama iki ayrı talep olarak
 * ilerliyor (farklı havuzlar üstleniyor), bu yüzden ikisinin durumu ayrı
 * ayrı okunuyor.
 */
export async function getDemoLessonStatus(studentId: string): Promise<DemoLessonStatus> {
  const supabase = await createClient()

  const [{ data: student }, { data: dersTalebi }, { data: koclukTalebi }] = await Promise.all([
    supabase.from('students').select('free_trial_used, free_coaching_used').eq('user_id', studentId).single(),
    supabase
      .from('demo_lesson_requests')
      .select('status')
      .eq('student_id', studentId)
      .eq('request_type', 'demo_lesson')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('demo_lesson_requests')
      .select('status')
      .eq('student_id', studentId)
      .eq('request_type', 'coaching_week')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  return {
    freeTrialUsed: student?.free_trial_used ?? false,
    freeCoachingUsed: student?.free_coaching_used ?? false,
    requestStatus: (dersTalebi?.status as DemoLessonStatus['requestStatus']) ?? null,
    coachingStatus: (koclukTalebi?.status as DemoLessonStatus['coachingStatus']) ?? null,
  }
}
