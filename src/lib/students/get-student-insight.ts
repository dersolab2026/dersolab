import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ExamResultEntry, ExamSectionEntry } from '@/actions/exam-results'
import type { ExamType } from '@/lib/exams/scoring'
import type { ExamTrack } from '@/lib/exams/structure'

export interface StudentHomework {
  id: string
  title: string
  dueDate: string | null
  status: string
  teslimSayisi: number
  createdAt: string
}

export interface StudentStudyLog {
  id: string
  logDate: string
  subject: string
  topic: string | null
  hours: number | null
  questionsSolved: number | null
  source: string | null
}

export interface StudentInsight {
  studentId: string
  name: string
  grade: number | null
  track: string | null
  schoolName: string | null
  exams: ExamResultEntry[]
  homework: StudentHomework[]
  studyLogs: StudentStudyLog[]
  /** Ders bazinda toplam calisma — gunlukten turetiliyor. */
  dersToplamlari: { subject: string; saat: number; soru: number }[]
}

/**
 * Egitmenin sectigi ogrencinin tek ekranda goreceği verisi.
 *
 * Deneme ve gunluk sorgulari NORMAL istemciyle (admin degil) yapiliyor:
 * erisim sinirini 0083'teki can_view_student politikasi belirlesin istiyoruz.
 * Admin client kullanmak bu sinirlamayi atlar ve yetkisiz bir egitmen baska
 * bir ogrencinin verisini gorebilirdi. Yalnizca ogrencinin ADI admin client
 * ile okunuyor, cunku users tablosunun politikasi bu iliskiyi kapsamiyor.
 */
export async function getStudentInsight(studentId: string): Promise<StudentInsight | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  // Yetki kontrolu veritabaninda: satir donmuyorsa bu egitmen bu ogrenciyi
  // goremiyor demektir.
  const { data: izin } = await supabase.rpc('can_view_student', { p_student_id: studentId })
  if (izin !== true) return null

  const admin = createAdminClient()
  const { data: kisi } = await admin
    .from('users').select('name').eq('id', studentId).is('deleted_at', null).maybeSingle()
  if (!kisi) return null

  // 0083'teki students_select_instructor politikasi sayesinde okunabiliyor.
  const { data: ogrenciRow } = await supabase
    .from('students').select('grade, track, school_name').eq('user_id', studentId).maybeSingle()

  const [{ data: examRows }, { data: hwRows }, { data: logRows }] = await Promise.all([
    supabase
      .from('student_exam_results')
      .select('id, exam_name, exam_type, exam_date, track, correct_count, wrong_count, obp')
      .eq('student_id', studentId)
      .order('exam_date', { ascending: false }),
    supabase
      .from('homework')
      .select('id, title, due_date, status, created_at, homework_submissions(id)')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false }),
    supabase
      .from('student_study_logs')
      .select('id, log_date, subject, topic, hours, questions_solved, source')
      .eq('student_id', studentId)
      .order('log_date', { ascending: false })
      .limit(120),
  ])

  const examIds = (examRows ?? []).map((e) => e.id)
  const { data: sectionRows } = examIds.length
    ? await supabase
        .from('student_exam_sections')
        .select('exam_result_id, section_name, correct_count, wrong_count, display_order')
        .in('exam_result_id', examIds)
        .order('display_order')
    : { data: [] }

  const bolumlerByExam = new Map<string, ExamSectionEntry[]>()
  for (const s of sectionRows ?? []) {
    const liste = bolumlerByExam.get(s.exam_result_id) ?? []
    liste.push({ name: s.section_name, correctCount: s.correct_count, wrongCount: s.wrong_count })
    bolumlerByExam.set(s.exam_result_id, liste)
  }

  const exams: ExamResultEntry[] = (examRows ?? []).map((e) => ({
    id: e.id,
    examName: e.exam_name,
    examType: e.exam_type as ExamType,
    examDate: e.exam_date,
    track: (e.track ?? null) as ExamTrack | null,
    correctCount: e.correct_count,
    wrongCount: e.wrong_count,
    obp: e.obp,
    sections: bolumlerByExam.get(e.id) ?? [],
  }))

  const homework: StudentHomework[] = (hwRows ?? []).map((h) => ({
    id: h.id,
    title: h.title,
    dueDate: h.due_date,
    status: h.status,
    teslimSayisi: Array.isArray(h.homework_submissions) ? h.homework_submissions.length : 0,
    createdAt: h.created_at,
  }))

  const studyLogs: StudentStudyLog[] = (logRows ?? []).map((l) => ({
    id: l.id,
    logDate: l.log_date,
    subject: l.subject,
    topic: l.topic,
    hours: l.hours,
    questionsSolved: l.questions_solved,
    source: l.source,
  }))

  const toplamMap = new Map<string, { saat: number; soru: number }>()
  for (const l of studyLogs) {
    const m = toplamMap.get(l.subject) ?? { saat: 0, soru: 0 }
    m.saat += Number(l.hours) || 0
    m.soru += l.questionsSolved ?? 0
    toplamMap.set(l.subject, m)
  }
  const dersToplamlari = [...toplamMap.entries()]
    .map(([subject, v]) => ({ subject, saat: Math.round(v.saat * 10) / 10, soru: v.soru }))
    .sort((a, b) => b.saat - a.saat)

  return {
    studentId,
    name: kisi.name,
    grade: ogrenciRow?.grade ?? null,
    track: ogrenciRow?.track ?? null,
    schoolName: ogrenciRow?.school_name ?? null,
    exams,
    homework,
    studyLogs,
    dersToplamlari,
  }
}
