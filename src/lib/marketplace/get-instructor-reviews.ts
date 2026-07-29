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

  const { data, error } = await supabase
    .from('review_details')
    .select('id, rating, comment, created_at, student_display_name')
    .eq('instructor_id', instructorId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return (data ?? []).map((row: any) => ({
    id: row.id,
    studentName: row.student_display_name,
    rating: row.rating,
    comment: row.comment,
    createdAt: row.created_at,
  }))
}
