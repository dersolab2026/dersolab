import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export interface StudentBookingItem {
  id: string
  studentId: string
  studentName: string
  instructorId: string
  instructorName: string
  startTime: string
  endTime: string
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  meetLink: string | null
  creditRefunded: boolean | null
  isTrial: boolean
}

export async function getBookingsForViewer(viewerId: string): Promise<StudentBookingItem[]> {
  const supabase = await createClient()

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, student_id, instructor_id, start_time, end_time, status, meet_link, credit_refunded, is_trial')
    .eq('student_id', viewerId)
    .order('start_time', { ascending: false })

  if (error) throw error
  if (!bookings || bookings.length === 0) return []

  const admin = createAdminClient()
  const involvedUserIds = [...new Set(bookings.flatMap((b: any) => [b.student_id, b.instructor_id]))]

  const { data: users } = await admin.from('users').select('id, name').in('id', involvedUserIds)

  const nameById = new Map((users ?? []).map((u: any) => [u.id, u.name]))

  return bookings.map((b: any) => ({
    id: b.id,
    studentId: b.student_id,
    studentName: nameById.get(b.student_id) ?? '',
    instructorId: b.instructor_id,
    instructorName: nameById.get(b.instructor_id) ?? '',
    startTime: b.start_time,
    endTime: b.end_time,
    status: b.status,
    meetLink: b.meet_link,
    creditRefunded: b.credit_refunded,
    isTrial: b.is_trial,
  }))
}
