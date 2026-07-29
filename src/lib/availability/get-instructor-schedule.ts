import { createClient } from '@/lib/supabase/server'
import type { AvailabilityRule } from '@/types'

export async function getInstructorSchedule(instructorId: string): Promise<AvailabilityRule[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('instructor_availability')
    .select('id, day_of_week, start_time, end_time, is_active')
    .eq('instructor_id', instructorId)
    .eq('is_active', true)
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) throw error

  return (data ?? []).map((row: any) => ({
    id: row.id,
    dayOfWeek: row.day_of_week,
    startTime: row.start_time.slice(0, 5),
    endTime: row.end_time.slice(0, 5),
    isActive: row.is_active,
  }))
}
