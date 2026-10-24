import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FlaskConical, Sparkles, Flame, TrendingUp, Calendar, BookOpen, Coins, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getBookingsForViewer } from '@/lib/bookings/get-student-bookings'
import { getLessonMaterialsForBookings } from '@/lib/lessons/get-lesson-materials'
import { getStudentCreditSummary } from '@/lib/students/get-credit-summary'
import { getHomeworkForStudent } from '@/lib/homework/get-homework-list'
import { getMyStudyLogs } from '@/actions/study-log'
import { BookingListItem } from '@/components/booking/BookingListItem'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { ExamCountdownHero } from '@/components/student/ExamCountdownHero'
import { StreakBanner } from '@/components/student/StreakBanner'
import { PIXEL_CARD } from '@/lib/theme'

export default async function StudentDashboardRootPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [bookings, creditSummary, homeworkList, studyLogs] = await Promise.all([
    getBookingsForViewer(user.id),
    getStudentCreditSummary(user.id),
    getHomeworkForStudent([user.id]).catch(() => []),
    getMyStudyLogs(),
  ])

  const upcoming = bookings.filter((b) => b.status === 'scheduled')
  const nextBookings = upcoming.slice(0, 2)
  const materialsByBooking = await getLessonMaterialsForBookings(nextBookings.map((b) => b.id))

  const pendingHomeworkCount = homeworkList.filter((h) => h.status === 'assigned').length
  const totalQuestionsSolved = studyLogs.reduce((acc, l) => acc + (l.questionsSolved ?? 0), 0)
  const bugun = new Date().toISOString().slice(0, 10)

  return (
    <DashboardPageShell
      title="Öğrenci Kokpiti"
      description="Sınav sayacın, çalışma serin, yaklaşan derslerin ve yapay zeka araçların tek ekranda."
    >
      {/* Sınav Geri Sayımı & Hızlı Başlatıcı */}
      <ExamCountdownHero />

      {/* Çalışma Serisi */}
      <StreakBanner logDates={studyLogs.map((l) => l.logDate)} bugun={bugun} />

      {/* Özet Metrik Kartları */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Link href="/dashboard/student/packages" className={`${PIXEL_CARD} p-4 hover:border-orange-500/40 transition-all group`}>
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wide">Kalan Kredi</span>
            <Coins className="w-4 h-4 text-orange-400" />
          </div>
          <p className="text-2xl font-black text-white">{creditSummary.remaining}</p>
          <p className="text-xs font-semibold text-orange-400 group-hover:underline mt-0.5">Kredi Yükle →</p>
        </Link>

        <Link href="/dashboard/student/bookings" className={`${PIXEL_CARD} p-4 hover:border-cyan-500/40 transition-all group`}>
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wide">Planlı Ders</span>
            <Calendar className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-white">{upcoming.length}</p>
          <p className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 mt-0.5">
            Toplam {creditSummary.lessonCount + creditSummary.guidanceCount} seans
          </p>
        </Link>

        <Link href="/dashboard/student/homework" className={`${PIXEL_CARD} p-4 hover:border-amber-500/40 transition-all group`}>
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wide">Bekleyen Ödev</span>
            <BookOpen className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-white">{pendingHomeworkCount}</p>
          <p className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 mt-0.5">
            Ödevlerini incele →
          </p>
        </Link>

        <Link href="/dashboard/student/gunluk" className={`${PIXEL_CARD} p-4 hover:border-emerald-500/40 transition-all group`}>
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-bold uppercase tracking-wide">Çözülen Soru</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-white">{totalQuestionsSolved}</p>
          <p className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 mt-0.5">
            Günlüğe soru ekle →
          </p>
        </Link>
      </div>

      {/* Hızlı Çalışma ve Deney Araçları */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href="/lab"
          className="p-4 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-slate-900/80 hover:border-cyan-400/60 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">3D L.A.B. Deneyleri</h3>
              <p className="text-xs text-slate-400">Formülleri simülasyonla keşfet</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/dashboard/student/ai-asistan"
          className="p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-slate-900/80 hover:border-amber-400/60 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">AI Soru Asistanı</h3>
              <p className="text-xs text-slate-400">Fotoğraf çek, adım adım çöz</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link
          href="/dashboard/student/odaklanma"
          className="p-4 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-slate-900/80 hover:border-emerald-400/60 transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Pomodoro Odak Odası</h3>
              <p className="text-xs text-slate-400">Ambiyans sesleriyle çalış</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Yaklaşan Dersler */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-200">Yaklaşan Derslerin</h2>
          <Link href="/dashboard/student/bookings" className="text-xs font-bold text-orange-400 hover:underline">
            Tüm Derslerim ({bookings.length}) →
          </Link>
        </div>
        {nextBookings.length === 0 ? (
          <div className={`${PIXEL_CARD} p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
            <div>
              <p className="text-sm font-bold text-slate-200">Henüz planlanmış bir dersin bulunmuyor.</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Uzman eğitmenlerimizle hemen bire bir canlı ders veya koçluk seansı planlayabilirsin.
              </p>
            </div>
            <Link
              href="/instructors"
              className="shrink-0 px-4 py-2 rounded-xl bg-[#DD7B3A] text-white text-xs font-bold hover:bg-[#DD7B3A]/90 transition-all"
            >
              Eğitmenleri İncele →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {nextBookings.map((b) => (
              <BookingListItem key={b.id} booking={b} materials={materialsByBooking[b.id] ?? []} />
            ))}
          </div>
        )}
      </div>
    </DashboardPageShell>
  )
}
