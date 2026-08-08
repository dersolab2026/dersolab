import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export interface PendingDemoRequest {
  id: string
  studentId: string
  studentName: string
  createdAt: string
}

export async function getPendingDemoRequests(): Promise<PendingDemoRequest[]> {
  const supabase = await createClient()

  const { data: requests, error } = await supabase
    .from('demo_lesson_requests')
    .select('id, student_id, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })

  if (error) throw error
  if (!requests || requests.length === 0) return []

  const admin = createAdminClient()
  const studentIds = [...new Set(requests.map((r) => r.student_id))]
  const { data: users } = await admin.from('users').select('id, name').in('id', studentIds)
  const nameById = new Map((users ?? []).map((u) => [u.id, u.name]))

  return requests.map((r) => ({
    id: r.id,
    studentId: r.student_id,
    studentName: nameById.get(r.student_id) ?? 'Öğrenci',
    createdAt: r.created_at,
  }))
}
