import { createClient } from '@/lib/supabase/server'
import type { InstructorProfile } from '@/types'

interface GetInstructorsParams {
  subject?: string
}

function toInstructorProfile(row: any): InstructorProfile {
  return {
    userId: row.id,
    name: row.name,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    subjects: row.subjects,
    lessonPrice: row.lesson_price,
    introVideoUrl: row.intro_video_url,
    isCalendarConnected: row.calendar_connected,
    averageRating: Number(row.average_rating ?? 0),
    reviewCount: Number(row.review_count ?? 0),
  }
}

const INSTRUCTOR_PROFILE_COLUMNS =
  'id, name, avatar_url, bio, subjects, lesson_price, intro_video_url, calendar_connected, average_rating, review_count'

export async function getInstructors(params: GetInstructorsParams = {}): Promise<InstructorProfile[]> {
  const supabase = await createClient()
  let query = supabase.from('instructor_profiles').select(INSTRUCTOR_PROFILE_COLUMNS)

  if (params.subject) {
    query = query.contains('subjects', [params.subject])
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []).map(toInstructorProfile)
}

export async function getInstructorById(instructorId: string): Promise<InstructorProfile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('instructor_profiles')
    .select(INSTRUCTOR_PROFILE_COLUMNS)
    .eq('id', instructorId)
    .single()

  if (error || !data) return null
  return toInstructorProfile(data)
}

export async function getInstructorEducation(instructorId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('instructor_education')
    .select('id, institution, degree, field_of_study, start_year, end_year')
    .eq('instructor_id', instructorId)
    .order('display_order', { ascending: true })

  if (error) throw error
  return (data ?? []).map((row: any) => ({
    id: row.id, institution: row.institution, degree: row.degree,
    fieldOfStudy: row.field_of_study, startYear: row.start_year, endYear: row.end_year,
  }))
}
