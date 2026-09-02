import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getStudentInsight } from '@/lib/students/get-student-insight'
import { getMyTargets } from '@/lib/students/get-my-targets'
import { getIntake } from '@/lib/coaching/get-intake'
import { StudentIntakeSummary } from '@/components/instructor/StudentIntakeSummary'
import { RiskSignalList } from '@/components/instructor/RiskSignalList'
import { riskSinyalleri } from '@/lib/coaching/risk-signals'
import { haftaninPazartesi } from '@/lib/coaching/plan-progress'
import { TargetPanel } from '@/components/student/TargetPanel'
import { requiresTrack } from '@/lib/exams/structure'
import { ExamAnalysis } from '@/components/student/ExamAnalysis'
import { CoachingPlanPanel } from '@/components/coaching/CoachingPlanPanel'
import { CoachingSessionForm } from '@/components/instructor/CoachingSessionForm'
import { WeeklyReportPanel } from '@/components/coaching/WeeklyReportPanel'
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

  const [targets, intake] = await Promise.all([getMyTargets(studentId), getIntake(studentId)])


  // Sinyaller sunucuda hesaplaniyor; bugun de sunucudan.
  const bugun = new Date().toISOString().slice(0, 10)
  const sinyaller = riskSinyalleri({
    insight: veri,
    planItems: veri.planItems,
    planWeeks: veri.planWeeks,
    hafta: haftaninPazartesi(new Date()),
    bugun,
  })
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
        className="text-sm font-bold text-[#9C4A0C] hover:underline"
      >
        ← Öğrencilerim
      </Link>

      {/* Ozet serit */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className={`${PIXEL_CARD} p-4`}>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Kayıtlı deneme</p>
          <p className="text-2xl font-black text-slate-200">{veri.exams.length}</p>
          {sonDeneme && sonNet !== null && (
            <p className="text-xs font-semibold text-slate-400">
              Son: {EXAM_TYPE_LABELS[sonDeneme.examType]} · {sonNet.toFixed(2)} net
            </p>
          )}
        </div>
        <div className={`${PIXEL_CARD} p-4`}>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Ödev</p>
          <p className="text-2xl font-black text-slate-200">
            {veri.homework.filter((h) => h.status === 'completed').length}
            <span className="text-base text-slate-400">/{veri.homework.length}</span>
          </p>
          <p className="text-xs font-semibold text-slate-400">tamamlanan</p>
        </div>
        <div className={`${PIXEL_CARD} p-4`}>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Kayıtlı çalışma</p>
          <p className="text-2xl font-black text-slate-200">
            {veri.dersToplamlari.reduce((t, d) => t + d.saat, 0).toFixed(1)}
            <span className="text-base text-slate-400"> sa</span>
          </p>
          <p className="text-xs font-semibold text-slate-400">
            {veri.dersToplamlari.reduce((t, d) => t + d.soru, 0)} soru
          </p>
        </div>
      </div>

      <RiskSignalList sinyaller={sinyaller} />

      {veri.exams.length === 0 ? (
        <p className={`${PIXEL_CARD} p-4 font-semibold text-slate-200`}>
          Öğrenci henüz deneme sonucu kaydetmemiş.
        </p>
      ) : (
        <ExamAnalysis entries={veri.exams} targetNets={targets.nets} />
      )}

      {(targets.program || targets.nets.length > 0) && (
        <TargetPanel targets={targets} examType={enSikTur} track={enSikTrack} readOnly />
      )}

      <StudentIntakeSummary veri={intake} />

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

      {veri.isCoach && <WeeklyReportPanel studentId={veri.studentId} />}

      <StudentHomeworkSummary items={veri.homework} />

      <StudentStudyLogSummary
        logs={veri.studyLogs}
        dersToplamlari={veri.dersToplamlari}
      />
    </DashboardPageShell>
  )
}
