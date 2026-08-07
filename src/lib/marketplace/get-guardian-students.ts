import { createClient } from '@/lib/supabase/server'

export interface GuardianStudent {
  studentId: string
  name: string
  freeTrialUsed: boolean
}

export async function getGuardianStudents(guardianId: string): Promise<GuardianStudent[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('guardian_links')
    .select('student_id, users!guardian_links_student_id_fkey(name)')
    .eq('guardian_id', guardianId)

  if (error) throw error
  if (!data || data.length === 0) return []

  const studentIds = data.map((row: any) => row.student_id)
  const { data: studentRows } = await supabase.from('students').select('user_id, free_trial_used').in('user_id', studentIds)
  const trialUsedById = new Map((studentRows ?? []).map((s: any) => [s.user_id, s.free_trial_used]))

  return data.map((row: any) => ({
    studentId: row.student_id,
    name: row.users?.name ?? 'İsimsiz öğrenci',
    freeTrialUsed: trialUsedById.get(row.student_id) ?? true,
  }))
}
