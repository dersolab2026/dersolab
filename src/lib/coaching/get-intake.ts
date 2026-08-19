import { createClient } from '@/lib/supabase/server'
import { boyutSkorlari, type BoyutSkoru } from '@/lib/coaching/self-assessment'
import type { IntakeInput } from '@/actions/intake'

export interface IntakeData {
  form: IntakeInput | null
  /** Yeniden eskiye sirali olcumler. */
  olcumler: { id: string; takenOn: string; skorlar: BoyutSkoru[] }[]
}

/**
 * Tanisma formu ve olcumler. studentId verilirse o ogrencininki okunur;
 * erisimi 0087'deki politika can_view_student uzerinden siniriyor.
 */
export async function getIntake(studentId?: string): Promise<IntakeData> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const hedefId = studentId ?? user?.id
  if (!hedefId) return { form: null, olcumler: [] }

  const [{ data: formRow }, { data: olcumRows }] = await Promise.all([
    supabase.from('student_intake_forms')
      .select('goal, hard_subjects, daily_routine, tried_methods, study_environment, who_wanted, notes')
      .eq('student_id', hedefId).maybeSingle(),
    supabase.from('student_self_assessments')
      .select('id, taken_on, answers')
      .eq('student_id', hedefId)
      .order('taken_on', { ascending: false }),
  ])

  return {
    form: formRow
      ? {
          goal: formRow.goal ?? '',
          hardSubjects: formRow.hard_subjects ?? '',
          dailyRoutine: formRow.daily_routine ?? '',
          triedMethods: formRow.tried_methods ?? '',
          studyEnvironment: formRow.study_environment ?? '',
          whoWanted: formRow.who_wanted as IntakeInput['whoWanted'],
          notes: formRow.notes ?? '',
        }
      : null,
    olcumler: (olcumRows ?? []).map((o) => ({
      id: o.id,
      takenOn: o.taken_on,
      skorlar: boyutSkorlari((o.answers ?? {}) as Record<string, number>),
    })),
  }
}
