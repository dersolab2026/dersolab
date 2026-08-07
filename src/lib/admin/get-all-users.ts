import { createAdminClient } from '@/lib/supabase/admin'

export interface AdminUserRow {
  id: string
  name: string
  email: string
  role: 'student' | 'parent' | 'instructor'
  createdAt: string
  gradeTrack: string | null
  approvalStatus: string | null
  calendarConnected: boolean | null
}

export async function getAllStudentsAndInstructors(): Promise<AdminUserRow[]> {
  const admin = createAdminClient()

  const [{ data: users }, { data: students }, { data: instructors }] = await Promise.all([
    admin.from('users').select('id, name, email, role, created_at').in('role', ['student', 'parent', 'instructor']),
    admin.from('students').select('user_id, grade_track'),
    admin.from('instructors').select('user_id, approval_status, calendar_connected'),
  ])

  const studentByUserId = new Map((students ?? []).map((s) => [s.user_id, s]))
  const instructorByUserId = new Map((instructors ?? []).map((i) => [i.user_id, i]))

  return (users ?? [])
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role as 'student' | 'parent' | 'instructor',
      createdAt: u.created_at,
      gradeTrack: studentByUserId.get(u.id)?.grade_track ?? null,
      approvalStatus: instructorByUserId.get(u.id)?.approval_status ?? null,
      calendarConnected: instructorByUserId.get(u.id)?.calendar_connected ?? null,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}
