import { createClient } from '@/lib/supabase/server'

export interface InstructorReview {
  id: string
  studentName: string
  rating: number
  comment: string | null
  createdAt: string
}

export async function getInstructorReviews(instructorId: string): Promise<InstructorReview[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_reviews_for_instructor', { p_instructor_id: instructorId })

  if (error) throw error

  return (data ?? []).map((row: any) => ({
    id: row.id,
    studentName: row.student_display_name,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
  }))
}