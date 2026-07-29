'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { LESSON_DURATION_MINUTES } from '@/lib/constants'

interface AddAvailabilityRuleParams {
  dayOfWeek: number
  startTime: string
  endTime: string
}

type ActionResult = { success: true } | { success: false; error: string }

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

export async function addAvailabilityRule(
  params: AddAvailabilityRuleParams
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Giriş yapmalısın' }
  }

  if (params.startTime >= params.endTime) {
    return { success: false, error: 'Bitiş saati başlangıçtan sonra olmalı' }
  }

  if (toMinutes(params.endTime) - toMinutes(params.startTime) < LESSON_DURATION_MINUTES) {
    return { success: false, error: 'Aralık en az 40 dakika olmalı (ders süresiyle uyumlu)' }
  }

  const { data: existingRules } = await supabase
    .from('instructor_availability')
    .select('start_time, end_time')
    .eq('instructor_id', user.id)
    .eq('day_of_week', params.dayOfWeek)
    .eq('is_active', true)

  const hasOverlap = (existingRules ?? []).some(
    (rule: any) => params.startTime < rule.end_time && params.endTime > rule.start_time
  )

  if (hasOverlap) {
    return { success: false, error: 'Bu saat aralığı mevcut bir aralıkla çakışıyor' }
  }

  const { error } = await supabase.from('instructor_availability').insert({
    instructor_id: user.id,
    day_of_week: params.dayOfWeek,
    start_time: params.startTime,
    end_time: params.endTime,
  })

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/instructor/availability')
  return { success: true }
}

export async function removeAvailabilityRule(ruleId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Giriş yapmalısın' }
  }

  const { error } = await supabase
    .from('instructor_availability')
    .delete()
    .eq('id', ruleId)
    .eq('instructor_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/dashboard/instructor/availability')
  return { success: true }
}
