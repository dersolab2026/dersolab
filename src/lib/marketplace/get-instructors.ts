import { createClient } from '@/lib/supabase/server'
import type { InstructorProfile, EducationEntry } from '@/types'

interface GetInstructorsParams {
  subject?: string
}

interface InstructorProfileRow {
  id: string
  name: string
  avatar_url: string | null
  bio: string | null
  subjects: string[]
  lesson_price: number
  intro_video_url: string | null
  calendar_connected: boolean
  average_rating: number
  review_count: number
}

function toInstructorProfile(row: InstructorProfileRow): InstructorProfile {
  return {
    userId: row.id,
    name: row.name,
    avatarUrl: row.avatar_url,
    bio: row.bio,
    subjects: row.subjects,
    lessonPrice: row.lesson_price,
    introVideoUrl: row.intro_video_url,
    isCalendarConnected: row.calendar_connected,
    averageRating: row.average_rating,
    reviewCount: row.review_count,
  }
}

export async function getInstructors(params: GetInstructorsParams = {}): Promise<InstructorProfile[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_instructor_profiles', { p_subject: params.subject ?? null })

  if (error) throw error
  return (data ?? []).map(toInstructorProfile)
}

export async function getInstructorById(instructorId: string): Promise<InstructorProfile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_instructor_profile_by_id', { p_id: instructorId })

  if (error || !data || data.length === 0) return null
  return toInstructorProfile(data[0])
}

export async function getInstructorEducation(instructorId: string): Promise<EducationEntry[]> {
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