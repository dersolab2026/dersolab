import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export interface QuestionAttachment {
  filePath: string
  fileType: 'image' | 'video' | 'pdf'
}

export interface QuestionListItem {
  id: string
  studentId: string
  studentName: string
  instructorId: string
  instructorName: string
  questionText: string
  answerText: string | null
  status: 'pending' | 'answered'
  createdAt: string
  questionAttachment: QuestionAttachment | null
  answerAttachment: QuestionAttachment | null
}

export async function getQuestionsForStudent(studentId: string): Promise<QuestionListItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('questions')
    .select('id, student_id, instructor_id, question_text, answer_text, status, created_at')
    .eq('student_id', studentId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return enrichQuestions(data ?? [])
}

export async function getQuestionsForInstructor(instructorId: string): Promise<QuestionListItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('questions')
    .select('id, student_id, instructor_id, question_text, answer_text, status, created_at')
    .eq('instructor_id', instructorId)
    .order('status', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return enrichQuestions(data ?? [])
}

async function enrichQuestions(questions: {
  id: string
  student_id: string
  instructor_id: string
  question_text: string
  answer_text: string | null
  status: string
  created_at: string
}[]): Promise<QuestionListItem[]> {
  if (questions.length === 0) return []
  const admin = createAdminClient()

  const userIds = [...new Set(questions.flatMap((q) => [q.student_id, q.instructor_id]))]
  const questionIds = questions.map((q) => q.id)

  const [{ data: users }, { data: attachments }] = await Promise.all([
    admin.from('users').select('id, name').in('id', userIds),
    admin.from('question_attachments').select('question_id, role, file_path, file_type').in('question_id', questionIds),
  ])

  const nameById = new Map<string, string>((users ?? []).map((u) => [u.id, u.name]))

  return questions.map((q) => {
    const questionAttachmentRow = (attachments ?? []).find((a) => a.question_id === q.id && a.role === 'question')
    const answerAttachmentRow = (attachments ?? []).find((a) => a.question_id === q.id && a.role === 'answer')

    return {
      id: q.id,
      studentId: q.student_id,
      studentName: nameById.get(q.student_id) ?? '',
      instructorId: q.instructor_id,
      instructorName: nameById.get(q.instructor_id) ?? '',
      questionText: q.question_text,
      answerText: q.answer_text,
      status: q.status as 'pending' | 'answered',
      createdAt: q.created_at,
      questionAttachment: questionAttachmentRow
        ? { filePath: questionAttachmentRow.file_path, fileType: questionAttachmentRow.file_type as 'image' | 'video' | 'pdf' }
        : null,
      answerAttachment: answerAttachmentRow
        ? { filePath: answerAttachmentRow.file_path, fileType: answerAttachmentRow.file_type as 'image' | 'video' | 'pdf' }
        : null,
    }
  })
}
