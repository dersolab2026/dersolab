import { createClient } from '@/lib/supabase/server'

export interface StudentInstructorOption {
  instructorId: string
  name: string
}

export async function getStudentInstructors(studentId: string): Promise<StudentInstructorOption[]> {
  const supabase = await createClient()

  const { data: bookingRows, error } = await supabase
    .from('bookings').select('instructor_id').eq('student_id', studentId)
  if (error) throw error

  const instructorIds = [...new Set((bookingRows ?? []).map((b) => b.instructor_id))]
  if (instructorIds.length === 0) return []

  const { data: users } = await supabase.from('users').select('id, name').in('id', instructorIds)
  return (users ?? []).map((u) => ({ instructorId: u.id, name: u.name }))
}
