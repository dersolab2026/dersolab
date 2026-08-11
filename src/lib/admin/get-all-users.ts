import { createAdminClient } from '@/lib/supabase/admin'

export interface AdminStudentRow {
  id: string
  name: string
  email: string
  createdAt: string
  gradeTrack: string | null
  creditBalance: number
  freeTrialUsed: boolean
}

export interface AdminInstructorRow {
  id: string
  name: string
  email: string
  createdAt: string
  approvalStatus: string | null
  calendarConnected: boolean
  offersFreeTrial: boolean
}

export interface AdminUsersData {
  students: AdminStudentRow[]
  instructors: AdminInstructorRow[]
}

export async function getAllStudentsAndInstructors(): Promise<AdminUsersData> {
  const admin = createAdminClient()

  const [{ data: users }, { data: students }, { data: instructors }] = await Promise.all([
    admin.from('users').select('id, name, email, role, created_at').in('role', ['student', 'instructor']),
    admin.from('students').select('user_id, grade_track, credit_balance, free_trial_used'),
    admin.from('instructors').select('user_id, approval_status, calendar_connected, offers_free_trial'),
  ])

  const studentByUserId = new Map((students ?? []).map((s) => [s.user_id, s]))
  const instructorByUserId = new Map((instructors ?? []).map((i) => [i.user_id, i]))

  const studentRows: AdminStudentRow[] = (users ?? [])
    .filter((u) => u.role === 'student')
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      createdAt: u.created_at,
      gradeTrack: studentByUserId.get(u.id)?.grade_track ?? null,
      creditBalance: studentByUserId.get(u.id)?.credit_balance ?? 0,
      freeTrialUsed: studentByUserId.get(u.id)?.free_trial_used ?? false,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const instructorRows: AdminInstructorRow[] = (users ?? [])
    .filter((u) => u.role === 'instructor')
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      createdAt: u.created_at,
      approvalStatus: instructorByUserId.get(u.id)?.approval_status ?? null,
      calendarConnected: instructorByUserId.get(u.id)?.calendar_connected ?? false,
      offersFreeTrial: instructorByUserId.get(u.id)?.offers_free_trial ?? false,
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return { students: studentRows, instructors: instructorRows }
}
