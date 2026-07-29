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
  hasReview: boolean
}

export async function getBookingsForViewer(viewerId: string, viewerRole: string): Promise<StudentBookingItem[]> {
  const supabase = await createClient()

  let studentIds: string[] = [viewerId]

  if (viewerRole === 'parent') {
    const { data: links } = await supabase.from('guardian_links').select('student_id').eq('guardian_id', viewerId)
    studentIds = (links ?? []).map((l: any) => l.student_id)
    if (studentIds.length === 0) return []
  }

  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, student_id, instructor_id, start_time, end_time, status, meet_link, credit_refunded')
    .in('student_id', studentIds)
    .order('start_time', { ascending: false })

  if (error) throw error
  if (!bookings || bookings.length === 0) return []

  const admin = createAdminClient()
  const involvedUserIds = [...new Set(bookings.flatMap((b: any) => [b.student_id, b.instructor_id]))]

  const [{ data: users }, { data: reviews }] = await Promise.all([
    admin.from('users').select('id, name').in('id', involvedUserIds),
    supabase.from('reviews').select('booking_id').in('booking_id', bookings.map((b: any) => b.id)),
  ])

  const nameById = new Map((users ?? []).map((u: any) => [u.id, u.name]))
  const reviewedBookingIds = new Set((reviews ?? []).map((r: any) => r.booking_id))

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
    hasReview: reviewedBookingIds.has(b.id),
  }))
}
