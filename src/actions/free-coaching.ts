'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type ActionResult = { success: true } | { success: false; error: string }

/** Ogrenci 1 haftalik ucretsiz kocluk talebi acar. */
export async function requestFreeCoaching(): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase.from('demo_lesson_requests').insert({
    student_id: user.id,
    requested_by: user.id,
    request_type: 'coaching_week',
  })

  if (error) {
    let message = error.message
    if (error.message.includes('row-level security')) {
      // Politika hem "hak kullanildi" hem "bekleyen talep var" durumunu kapsiyor.
      message = 'Ücretsiz koçluk hakkını zaten kullandın ya da bekleyen bir talebin var'
    } else if (error.code === '23503') {
      message = 'Ücretsiz koçluk sadece öğrenci hesapları için geçerli'
    }
    return { success: false, error: message }
  }

  revalidatePath('/ucretsiz-kocluk')
  return { success: true }
}

/** Koc bekleyen bir kocluk talebini ustlenir; ders olusmaz, koc ogrenciye atanir. */
export async function claimFreeCoaching(requestId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { data: claimed, error } = await supabase
    .from('demo_lesson_requests')
    .update({ status: 'assigned', assigned_instructor_id: user.id, resolved_at: new Date().toISOString() })
    .eq('id', requestId)
    .eq('status', 'pending')
    .eq('request_type', 'coaching_week')
    .select('id')
    .maybeSingle()

  if (error || !claimed) {
    return { success: false, error: 'Bu talep başka bir koç tarafından zaten alındı' }
  }

  revalidatePath('/dashboard/instructor/demo-talepleri')
  return { success: true }
}

/** Koc talebi kendi havuzundan gizler; talep diger koclar icin acik kalir. */
export async function declineFreeCoaching(requestId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase
    .from('demo_lesson_declines')
    .insert({ request_id: requestId, instructor_id: user.id })

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/instructor/demo-talepleri')
  return { success: true }
}

export interface FreeCoachingStatus {
  used: boolean
  requestStatus: 'pending' | 'assigned' | 'cancelled' | null
  coachName: string | null
}

export async function getFreeCoachingStatus(studentId: string): Promise<FreeCoachingStatus> {
  const supabase = await createClient()

  const [{ data: student }, { data: request }] = await Promise.all([
    supabase.from('students').select('free_coaching_used').eq('user_id', studentId).single(),
    supabase
      .from('demo_lesson_requests')
      .select('status, assigned_instructor_id')
      .eq('student_id', studentId)
      .eq('request_type', 'coaching_week')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  let coachName: string | null = null
  if (request?.assigned_instructor_id) {
    const admin = createAdminClient()
    const { data: koc } = await admin
      .from('users').select('name').eq('id', request.assigned_instructor_id).single()
    coachName = koc?.name ?? null
  }

  return {
    used: student?.free_coaching_used ?? false,
    requestStatus: (request?.status as FreeCoachingStatus['requestStatus']) ?? null,
    coachName,
  }
}
