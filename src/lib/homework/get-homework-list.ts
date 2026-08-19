import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { tekil } from '@/lib/exams/embed'
import type { OdevTipi } from '@/lib/homework/types'

export interface HomeworkListItem {
  id: string
  studentId: string
  studentName: string
  instructorId: string
  instructorName: string
  title: string
  description: string | null
  dueDate: string | null
  status: 'assigned' | 'submitted' | 'completed'
  homeworkType: OdevTipi
  resourceLabel: string | null
  resourceRange: string | null
  instructorFeedback: string | null
  submissions: { id: string; filePath: string; fileType: 'image' | 'video' }[]
}

export async function getHomeworkForStudent(studentIds: string[]): Promise<HomeworkListItem[]> {
  if (studentIds.length === 0) return []
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('homework')
    .select('id, student_id, instructor_id, title, description, due_date, status, homework_type, resource_range, instructor_feedback, study_resources(publisher, title)')
    .in('student_id', studentIds)
    .order('created_at', { ascending: false })
  if (error) throw error
  return enrichHomework(data ?? [])
}

export async function getHomeworkForInstructor(instructorId: string): Promise<HomeworkListItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('homework')
    .select('id, student_id, instructor_id, title, description, due_date, status, homework_type, resource_range, instructor_feedback, study_resources(publisher, title)')
    .eq('instructor_id', instructorId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return enrichHomework(data ?? [])
}

async function enrichHomework(homework: any[]): Promise<HomeworkListItem[]> {
  if (homework.length === 0) return []
  const supabase = await createClient()
  const admin = createAdminClient()

  const userIds = [...new Set(homework.flatMap((h) => [h.student_id, h.instructor_id]))]
  const homeworkIds = homework.map((h) => h.id)

  const [{ data: users }, { data: submissions }] = await Promise.all([
    admin.from('users').select('id, name').in('id', userIds),
    supabase.from('homework_submissions').select('id, homework_id, file_path, file_type').in('homework_id', homeworkIds),
  ])

  const nameById = new Map<string, string>((users ?? []).map((u: any) => [u.id, u.name] as [string, string]))

  return homework.map((h) => ({
    id: h.id, studentId: h.student_id, studentName: nameById.get(h.student_id) ?? '',
    instructorId: h.instructor_id, instructorName: nameById.get(h.instructor_id) ?? '',
    title: h.title, description: h.description, dueDate: h.due_date, status: h.status,
    homeworkType: (h.homework_type ?? 'serbest') as OdevTipi,
    resourceLabel: (() => {
      const k = tekil<{ publisher: string | null; title: string }>(h.study_resources)
      if (!k) return null
      return k.publisher ? `${k.publisher} — ${k.title}` : k.title
    })(),
    resourceRange: h.resource_range ?? null,
    instructorFeedback: h.instructor_feedback ?? null,
    submissions: (submissions ?? [])
      .filter((s: any) => s.homework_id === h.id)
      .map((s: any) => ({ id: s.id, filePath: s.file_path, fileType: s.file_type })),
  }))
}
