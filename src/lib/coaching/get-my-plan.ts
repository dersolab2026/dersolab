import { createClient } from '@/lib/supabase/server'
import type { PlanItem, StudyLogLite } from '@/lib/coaching/plan-progress'

export interface MyPlan {
  planItems: PlanItem[]
  planWeeks: Record<string, string>
  studyLogs: StudyLogLite[]
  kocVar: boolean
}

/**
 * Ogrencinin kendi haftalik plani.
 *
 * Gunluk sayfasinda gosteriliyor cunku kayit oraya giriliyor: plani gordugu
 * yerle kaydi girdigi yer ayni olsun istiyoruz. Gormedigi bir plana uymasi
 * beklenemez.
 */
export async function getMyPlan(): Promise<MyPlan> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { planItems: [], planWeeks: {}, studyLogs: [], kocVar: false }

  const [{ data: planRows }, { data: logRows }] = await Promise.all([
    supabase
      .from('coaching_plan_items')
      .select('id, plan_week, plan_date, plan_time, subject, topic, source, target_questions, target_minutes, status')
      .eq('student_id', user.id)
      .order('plan_date'),
    supabase
      .from('student_study_logs')
      .select('log_date, subject, hours, questions_solved')
      .eq('student_id', user.id)
      .order('log_date', { ascending: false })
      .limit(200),
  ])

  return {
    planItems: (planRows ?? []).map((p) => ({
      id: p.id,
      planDate: p.plan_date,
      planTime: p.plan_time,
      subject: p.subject,
      topic: p.topic,
      source: p.source,
      targetQuestions: p.target_questions,
      targetMinutes: p.target_minutes,
      status: p.status as PlanItem['status'],
    })),
    planWeeks: Object.fromEntries((planRows ?? []).map((p) => [p.id, p.plan_week])),
    studyLogs: (logRows ?? []).map((l) => ({
      logDate: l.log_date,
      subject: l.subject,
      hours: l.hours,
      questionsSolved: l.questions_solved,
    })),
    kocVar: (planRows ?? []).length > 0,
  }
}
