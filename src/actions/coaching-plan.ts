'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type ActionResult = { success: true } | { success: false; error: string }

export interface PlanItemInput {
  studentId: string
  planWeek: string
  planDate: string
  planTime: string | null
  subject: string
  topic: string | null
  source: string | null
  targetQuestions: number | null
  targetMinutes: number | null
}

export async function addPlanItem(input: PlanItemInput): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  if (!input.subject.trim()) return { success: false, error: 'Ders seçmelisin' }
  if (!input.planDate) return { success: false, error: 'Gün seçmelisin' }

  const { data: iliski } = await supabase
    .from('coaching_relationships')
    .select('id')
    .eq('student_id', input.studentId).eq('coach_id', user.id).eq('status', 'active')
    .maybeSingle()

  const { error } = await supabase.from('coaching_plan_items').insert({
    student_id: input.studentId,
    coach_id: user.id,
    relationship_id: iliski?.id ?? null,
    plan_week: input.planWeek,
    plan_date: input.planDate,
    plan_time: input.planTime || null,
    subject: input.subject.trim(),
    topic: input.topic?.trim() || null,
    source: input.source?.trim() || null,
    target_questions: input.targetQuestions,
    target_minutes: input.targetMinutes,
  })

  if (error) {
    if (error.message.includes('row-level security')) {
      return { success: false, error: 'Plan yazmak için branşlarında Koçluk olmalı' }
    }
    return { success: false, error: error.message }
  }

  revalidatePath(`/dashboard/instructor/ogrencilerim/${input.studentId}`)
  revalidatePath('/dashboard/student/gunluk')
  return { success: true }
}

export async function deletePlanItem(id: string, studentId: string): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase.from('coaching_plan_items').delete().eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath(`/dashboard/instructor/ogrencilerim/${studentId}`)
  return { success: true }
}

export async function setPlanItemStatus(
  id: string, studentId: string, status: 'planned' | 'done' | 'skipped',
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase.from('coaching_plan_items').update({ status }).eq('id', id)
  if (error) return { success: false, error: error.message }

  revalidatePath(`/dashboard/instructor/ogrencilerim/${studentId}`)
  return { success: true }
}

/**
 * Gecen haftanin planini bu haftaya kopyala.
 *
 * Kocun her hafta ayni satirlari sifirdan yazmasi en buyuk terk sebebi;
 * plan genelde haftadan haftaya kucuk degisiklerle ilerliyor.
 */
export async function copyPreviousWeek(
  studentId: string, oncekiHafta: string, yeniHafta: string,
): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { data: eskiler } = await supabase
    .from('coaching_plan_items')
    .select('plan_date, plan_time, subject, topic, source, target_questions, target_minutes, relationship_id')
    .eq('student_id', studentId).eq('coach_id', user.id).eq('plan_week', oncekiHafta)

  if (!eskiler || eskiler.length === 0) {
    return { success: false, error: 'Geçen hafta için plan bulunamadı' }
  }

  // Gun kaymasi: her satiri tam 7 gun ileri tasi.
  const yeniler = eskiler.map((e) => {
    const d = new Date(e.plan_date + 'T00:00:00Z')
    d.setUTCDate(d.getUTCDate() + 7)
    return {
      student_id: studentId,
      coach_id: user.id,
      relationship_id: e.relationship_id,
      plan_week: yeniHafta,
      plan_date: d.toISOString().slice(0, 10),
      plan_time: e.plan_time,
      subject: e.subject,
      topic: e.topic,
      source: e.source,
      target_questions: e.target_questions,
      target_minutes: e.target_minutes,
    }
  })

  const { error } = await supabase.from('coaching_plan_items').insert(yeniler)
  if (error) return { success: false, error: error.message }

  revalidatePath(`/dashboard/instructor/ogrencilerim/${studentId}`)
  return { success: true }
}
