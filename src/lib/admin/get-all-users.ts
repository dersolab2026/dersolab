import { createAdminClient } from '@/lib/supabase/admin'

export interface AdminStudentRow {
  id: string
  name: string
  email: string
  createdAt: string
  gradeTrack: string | null
  creditBalance: number
}

export interface AdminInstructorRow {
  id: string
  name: string
  email: string
  createdAt: string
  approvalStatus: string | null
  calendarConnected: boolean
}

export interface AdminParentRow {
  id: string
  name: string
  email: string
  createdAt: string
  students: { id: string; name: string; gradeTrack: string | null }[]
}

export interface AdminUsersData {
  students: AdminStudentRow[]
  parents: AdminParentRow[]
  instructors: AdminInstructorRow[]
}

export async function getAllStudentsAndInstructors(): Promise<AdminUsersData> {
  const admin = createAdminClient()

  const [{ data: users }, { data: students }, { data: instructors }, { data: guardianLinks }] = await Promise.all([
    admin.from('users').select('id, name, email, role, created_at').in('role', ['student', 'parent', 'instructor']),
    admin.from('students').select('user_id, grade_track, credit_balance'),
    admin.from('instructors').select('user_id, approval_status, calendar_connected'),
    admin.from('guardian_links').select('guardian_id, student_id'),
  ])

  const usersById = new Map((users ?? []).map((u) => [u.id, u]))
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
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const studentsByGuardian = new Map<string, { id: string; name: string; gradeTrack: string | null }[]>()
  for (const link of guardianLinks ?? []) {
    const student = usersById.get(link.student_id)
    if (!student) continue
    const list = studentsByGuardian.get(link.guardian_id) ?? []
    list.push({ id: student.id, name: student.name, gradeTrack: studentByUserId.get(student.id)?.grade_track ?? null })
    studentsByGuardian.set(link.guardian_id, list)
  }

  const parentRows: AdminParentRow[] = (users ?? [])
    .filter((u) => u.role === 'parent')
    .map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      createdAt: u.created_at,
      students: studentsByGuardian.get(u.id) ?? [],
    }))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return { students: studentRows, parents: parentRows, instructors: instructorRows }
}
