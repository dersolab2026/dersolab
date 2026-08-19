import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { ExamResultEntry, ExamSectionEntry } from '@/actions/exam-results'
import type { SessionNote } from '@/components/instructor/CoachingSessionForm'
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
  sessionNotes: SessionNote[]
  /** Bu egitmenin bu ogrenciyle aktif kocluk iliskisi (varsa). */
  coaching: { id: string; startedOn: string; weeklyRhythm: string | null } | null
  /** Giren kisi bu ogrencinin kocu mu — oturum notu yazabilir mi. */
  isCoach: boolean
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
        .select('exam_result_id, section_name, correct_count, wrong_count, display_order, wrong_knowledge, wrong_careless, wrong_misread, wrong_timeout')
        .in('exam_result_id', examIds)
        .order('display_order')
    : { data: [] }

  const bolumlerByExam = new Map<string, ExamSectionEntry[]>()
  for (const s of sectionRows ?? []) {
    const liste = bolumlerByExam.get(s.exam_result_id) ?? []
    liste.push({
      name: s.section_name,
      correctCount: s.correct_count,
      wrongCount: s.wrong_count,
      errorTypes: (s.wrong_knowledge ?? s.wrong_careless ?? s.wrong_misread ?? s.wrong_timeout) === null
        ? undefined
        : {
            knowledge: s.wrong_knowledge ?? 0,
            careless: s.wrong_careless ?? 0,
            misread: s.wrong_misread ?? 0,
            timeout: s.wrong_timeout ?? 0,
          },
    })
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

  const [{ data: noteRows }, { data: relRow }] = await Promise.all([
    supabase
      .from('coaching_session_notes')
      .select('id, session_date, plan_followed, obstacle, student_commitment, coach_decisions, confidence')
      .eq('student_id', studentId)
      .order('session_date', { ascending: false }),
    supabase
      .from('coaching_relationships')
      .select('id, started_on, weekly_rhythm')
      .eq('student_id', studentId).eq('coach_id', user.id).eq('status', 'active')
      .maybeSingle(),
  ])

  const sessionNotes: SessionNote[] = (noteRows ?? []).map((n) => ({
    id: n.id,
    sessionDate: n.session_date,
    planFollowed: n.plan_followed,
    obstacle: n.obstacle,
    studentCommitment: n.student_commitment,
    coachDecisions: n.coach_decisions,
    confidence: n.confidence,
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
    sessionNotes,
    coaching: relRow
      ? { id: relRow.id, startedOn: relRow.started_on, weeklyRhythm: relRow.weekly_rhythm }
      : null,
    // Koçluk branşı olan eğitmen not yazabilir; ilişki henüz kurulmamış olsa
    // bile (tanışma görüşmesi de bir oturum).
    isCoach: (await supabase.rpc('is_coach', { p_user_id: user.id })).data === true,
  }
}
