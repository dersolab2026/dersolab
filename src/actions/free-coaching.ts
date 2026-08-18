'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ActionResult = { success: true } | { success: false; error: string }

/**
 * Koc, bekleyen bir kocluk talebini ustlenir. Ders olusmaz; koc ogrenciye
 * atanir ve haftayi kendisi planlar.
 *
 * Talep acma tarafi burada degil: tanisma dersi ve kocluk birlikte
 * veriliyor, ikisini birden requestDemoLesson aciyor.
 */
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
