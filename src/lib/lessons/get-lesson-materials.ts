import { createClient } from '@/lib/supabase/server'

export interface LessonMaterial {
  id: string
  title: string
  filePath: string
  createdAt: string
}

export async function getLessonMaterialsForBookings(bookingIds: string[]): Promise<Record<string, LessonMaterial[]>> {
  if (bookingIds.length === 0) return {}

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('lesson_materials')
    .select('id, booking_id, title, file_path, created_at')
    .in('booking_id', bookingIds)
    .order('created_at', { ascending: false })

  if (error || !data) return {}

  const grouped: Record<string, LessonMaterial[]> = {}
  for (const row of data) {
    const list = grouped[row.booking_id] ?? []
    list.push({ id: row.id, title: row.title, filePath: row.file_path, createdAt: row.created_at })
    grouped[row.booking_id] = list
  }
  return grouped
}
