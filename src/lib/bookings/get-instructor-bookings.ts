import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export interface InstructorBookingItem {
  id: string
  studentId: string
  studentName: string
  startTime: string
  endTime: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  meetLink: string | null
  instructorNotes: string | null
}

export async function getInstructorBookings(instructorId: string): Promise<InstructorBookingItem[]> {
  const supabase = await createClient()

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, student_id, start_time, end_time, status, meet_link, instructor_notes')
    .eq('instructor_id', instructorId)
    .order('start_time', { ascending: false })

  if (error) throw error
  if (!bookings || bookings.length === 0) return []

  const admin = createAdminClient()
  const studentIds = [...new Set(bookings.map((b: any) => b.student_id))]
  const { data: users } = await admin.from('users').select('id, name').in('id', studentIds)
  const nameById = new Map((users ?? []).map((u: any) => [u.id, u.name]))

  return bookings.map((b: any) => ({
    id: b.id,
    studentId: b.student_id,
    studentName: nameById.get(b.student_id) ?? '',
    startTime: b.start_time,
    endTime: b.end_time,
    status: b.status,
    meetLink: b.meet_link,
    instructorNotes: b.instructor_notes,
  }))
}
