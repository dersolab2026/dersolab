import { createClient } from '@/lib/supabase/server'

export interface InstructorStats {
  lessonCount: number
}

export async function getInstructorStats(instructorId: string, from: Date, to: Date): Promise<InstructorStats> {
  const supabase = await createClient()
  const fromIso = from.toISOString()
  const toIso = to.toISOString()

  const { count: lessonCount } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('instructor_id', instructorId)
    .eq('status', 'completed')
    .gte('start_time', fromIso)
    .lte('start_time', toIso)

  return { lessonCount: lessonCount ?? 0 }
}
