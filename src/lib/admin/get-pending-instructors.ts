import { createAdminClient } from '@/lib/supabase/admin'

export interface PendingInstructor {
  userId: string
  name: string
  email: string
  bio: string | null
  subjects: string[]
  lessonPrice: number
  introVideoUrl: string | null
}

export async function getPendingInstructors(): Promise<PendingInstructor[]> {
  const admin = createAdminClient()

  const { data: instructors, error } = await admin
    .from('instructors')
    .select('user_id, bio, subjects, lesson_price, intro_video_url')
    .eq('approval_status', 'pending')

  if (error) throw error
  if (!instructors || instructors.length === 0) return []

  const userIds = instructors.map((i) => i.user_id)
  const { data: users } = await admin
    .from('users')
    .select('id, name, email')
    .in('id', userIds)
    .is('deleted_at', null)

  const userById = new Map((users ?? []).map((u) => [u.id, u]))

  return instructors
    .filter((row) => userById.has(row.user_id))
    .map((row) => ({
      userId: row.user_id,
      name: userById.get(row.user_id)?.name ?? '',
      email: userById.get(row.user_id)?.email ?? '',
      bio: row.bio,
      subjects: row.subjects,
      lessonPrice: row.lesson_price,
      introVideoUrl: row.intro_video_url,
    }))
}