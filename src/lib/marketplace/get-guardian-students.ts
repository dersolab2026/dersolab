import { createClient } from '@/lib/supabase/server'

export interface GuardianStudent {
  studentId: string
  name: string
}

export async function getGuardianStudents(guardianId: string): Promise<GuardianStudent[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('guardian_links')
    .select('student_id, users!guardian_links_student_id_fkey(name)')
    .eq('guardian_id', guardianId)

  if (error) throw error

  return (data ?? []).map((row: any) => ({
    studentId: row.student_id,
    name: row.users?.name ?? 'İsimsiz öğrenci',
  }))
}
