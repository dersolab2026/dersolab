import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getStudentInsight } from '@/lib/students/get-student-insight'
import { getMyTargets } from '@/lib/students/get-my-targets'
import { TargetPanel } from '@/components/student/TargetPanel'
import { requiresTrack } from '@/lib/exams/structure'
import { ExamAnalysis } from '@/components/student/ExamAnalysis'
import { CoachingPlanPanel } from '@/components/coaching/CoachingPlanPanel'
import { CoachingSessionForm } from '@/components/instructor/CoachingSessionForm'
import { StudentHomeworkSummary } from '@/components/instructor/StudentHomeworkSummary'
import { StudentStudyLogSummary } from '@/components/instructor/StudentStudyLogSummary'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { calculateTotalNet, EXAM_TYPE_LABELS } from '@/lib/exams/scoring'
import { TRACK_LABELS, type ExamTrack } from '@/lib/exams/structure'
import { LESSON_SUBJECTS } from '@/lib/constants'
import { PIXEL_CARD } from '@/lib/theme'

export default async function StudentInsightPage({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const veri = await getStudentInsight(studentId)
  if (!veri) notFound()

  const targets = await getMyTargets(studentId)
  const enSikTur = veri.exams.length > 0 ? veri.exams[0].examType : 'tyt'
  const enSikTrack = requiresTrack(enSikTur) ? (veri.exams[0]?.track ?? 'sayisal') : null

  const sonDeneme = veri.exams[0]
  const sonNet = sonDeneme
    ? calculateTotalNet(sonDeneme.examType, sonDeneme.sections.map((s) => ({
        name: s.name, correct: s.correctCount, wrong: s.wrongCount,
      })))
    : null

  const kimlik = [
    veri.grade ? `${veri.grade}. sınıf` : null,
    veri.track ? TRACK_LABELS[veri.track as ExamTrack] ?? veri.track : null,
    veri.schoolName,
  ].filter(Boolean).join(' · ')

  return (
    <DashboardPageShell
      title={veri.name}
      description={kimlik || 'Öğrencinin deneme sonuçları, ödev durumu ve çalışma günlüğü.'}
    >
      <Link
        href="/dashboard/instructor/ogrencilerim"
        className="text-sm font-bold text-[#DD7B3A] hover:underline"
      >
        ← Öğrencilerim
      </Link>

      {/* Ozet serit */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className={`${PIXEL_CARD} p-4`}>
          <p className="text-xs font-bold uppercase tracking-wide text-[#1B2430]/60">Kayıtlı deneme</p>
          <p className="text-2xl font-black text-[#1B2430]">{veri.exams.length}</p>
          {sonDeneme && sonNet !== null && (
            <p className="text-xs font-semibold text-[#1B2430]/70">
              Son: {EXAM_TYPE_LABELS[sonDeneme.examType]} · {sonNet.toFixed(2)} net
            </p>
          )}
        </div>
        <div className={`${PIXEL_CARD} p-4`}>
          <p className="text-xs font-bold uppercase tracking-wide text-[#1B2430]/60">Ödev</p>
          <p className="text-2xl font-black text-[#1B2430]">
            {veri.homework.filter((h) => h.status === 'completed').length}
            <span className="text-base text-[#1B2430]/50">/{veri.homework.length}</span>
          </p>
          <p className="text-xs font-semibold text-[#1B2430]/70">tamamlanan</p>
        </div>
        <div className={`${PIXEL_CARD} p-4`}>
          <p className="text-xs font-bold uppercase tracking-wide text-[#1B2430]/60">Kayıtlı çalışma</p>
          <p className="text-2xl font-black text-[#1B2430]">
            {veri.dersToplamlari.reduce((t, d) => t + d.saat, 0).toFixed(1)}
            <span className="text-base text-[#1B2430]/50"> sa</span>
          </p>
          <p className="text-xs font-semibold text-[#1B2430]/70">
            {veri.dersToplamlari.reduce((t, d) => t + d.soru, 0)} soru
          </p>
        </div>
      </div>

      {veri.exams.length === 0 ? (
        <p className={`${PIXEL_CARD} p-4 font-semibold text-[#1B2430]`}>
          Öğrenci henüz deneme sonucu kaydetmemiş.
        </p>
      ) : (
        <ExamAnalysis entries={veri.exams} targetNets={targets.nets} />
      )}

      {(targets.program || targets.nets.length > 0) && (
        <TargetPanel targets={targets} examType={enSikTur} track={enSikTrack} readOnly />
      )}

      <CoachingPlanPanel
        studentId={veri.studentId}
        planItems={veri.planItems}
        planWeeks={veri.planWeeks}
        studyLogs={veri.studyLogs.map((l) => ({
          logDate: l.logDate, subject: l.subject, hours: l.hours, questionsSolved: l.questionsSolved,
        }))}
        subjects={LESSON_SUBJECTS as unknown as string[]}
        canEdit={veri.isCoach}
      />

      <CoachingSessionForm
        studentId={veri.studentId}
        notes={veri.sessionNotes}
        canWrite={veri.isCoach}
      />

      <StudentHomeworkSummary items={veri.homework} />

      <StudentStudyLogSummary
        logs={veri.studyLogs}
        dersToplamlari={veri.dersToplamlari}
      />
    </DashboardPageShell>
  )
}
