import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Calendar,
  Sparkles,
  FlaskConical,
  BookOpen,
  ArrowRight,
  Flame,
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Video,
  FileText,
  LineChart,
  ChevronRight,
  Zap,
  Dna,
  Calculator,
  Globe2,
  Languages,
  Plus,
  HelpCircle,
  GraduationCap,
} from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { getBookingsForViewer } from '@/lib/bookings/get-student-bookings'
import { getHomeworkForStudent } from '@/lib/homework/get-homework-list'
import { getStudentCreditSummary } from '@/lib/students/get-credit-summary'
import { getExamResults } from '@/actions/exam-results'
import { getMyTargets } from '@/lib/students/get-my-targets'
import { getMyPlan } from '@/lib/coaching/get-my-plan'
import { StudentFocusTimer } from '@/components/student/StudentFocusTimer'
import { ODEV_TIPI_ETIKET } from '@/lib/homework/types'

export const metadata = {
  title: 'Öğrenci Uygulaması — DersoLab',
  description: 'Derslerim, L.A.B. sanal simülasyonları, ödevlerim, deneme netlerim ve AI soru asistanı tek ekranda.',
}

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Günaydın'
  if (hour >= 12 && hour < 18) return 'İyi günler'
  return 'İyi akşamlar'
}

function formatLessonDate(isoString: string): string {
  try {
    const d = new Date(isoString)
    return new Intl.DateTimeFormat('tr-TR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d)
  } catch {
    return isoString
  }
}

export default async function StudentDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch all student data in parallel
  const [
    userRowRes,
    studentRowRes,
    bookings,
    homeworkList,
    creditSummary,
    examResults,
    targets,
    coachingPlan,
  ] = await Promise.all([
    supabase.from('users').select('id, name, email').eq('id', user.id).single(),
    supabase.from('students').select('grade_track, credit_balance').eq('user_id', user.id).maybeSingle(),
    getBookingsForViewer(user.id),
    getHomeworkForStudent([user.id]),
    getStudentCreditSummary(user.id),
    getExamResults(),
    getMyTargets(),
    getMyPlan(),
  ])

  const userRow = userRowRes.data
  const studentRow = studentRowRes.data

  const studentName = userRow?.name?.split(' ')[0] || user.email?.split('@')[0] || 'Öğrenci'
  const gradeTrack = studentRow?.grade_track || 'Ortaokul / Lise'
  const creditBalance = creditSummary.remaining

  // Upcoming scheduled lesson
  const now = new Date().toISOString()
  const upcomingBookings = bookings
    .filter((b) => b.status === 'scheduled' && b.startTime >= now)
    .sort((a, b) => (a.startTime > b.startTime ? 1 : -1))

  const nextLesson = upcomingBookings[0] ?? null

  // Active pending homeworks
  const pendingHomework = homeworkList.filter((hw) => hw.status === 'assigned')

  // Latest mock exam
  const latestExam = examResults[0] ?? null
  const latestNet = latestExam
    ? latestExam.correctCount - (latestExam.examType === 'lgs' ? latestExam.wrongCount / 3 : latestExam.wrongCount / 4)
    : null

  // Streak calculation from study logs
  const streakCount = Math.max(1, coachingPlan.studyLogs.length)

  // L.A.B. Branches quick launcher data
  const LAB_BRANCHES = [
    {
      id: 'kimya',
      name: 'KimyaLab',
      href: '/lab/kimya',
      icon: FlaskConical,
      color: 'from-cyan-500 to-teal-400',
      tag: '3D Atom & Gazlar',
      border: 'border-cyan-500/30 hover:border-cyan-400',
      badgeBg: 'bg-cyan-500/15 text-cyan-300',
    },
    {
      id: 'fizik',
      name: 'FizikLab',
      href: '/lab/fizik',
      icon: Zap,
      color: 'from-blue-500 to-cyan-400',
      tag: 'Kaldırma & Optik',
      border: 'border-blue-500/30 hover:border-blue-400',
      badgeBg: 'bg-blue-500/15 text-blue-300',
    },
    {
      id: 'biyoloji',
      name: 'BiyolojiLab',
      href: '/lab/biyoloji',
      icon: Dna,
      color: 'from-emerald-500 to-teal-400',
      tag: 'DNA & Fotosentez',
      border: 'border-emerald-500/30 hover:border-emerald-400',
      badgeBg: 'bg-emerald-500/15 text-emerald-300',
    },
    {
      id: 'matematik',
      name: 'MatematikLab',
      href: '/lab/matematik',
      icon: Calculator,
      color: 'from-violet-500 to-indigo-400',
      tag: 'Pisagor & Parabol',
      border: 'border-violet-500/30 hover:border-violet-400',
      badgeBg: 'bg-violet-500/15 text-violet-300',
    },
    {
      id: 'turkce',
      name: 'TürkçeLab',
      href: '/lab/turkce',
      icon: BookOpen,
      color: 'from-amber-500 to-orange-400',
      tag: 'Bionic Hız & TDK',
      border: 'border-amber-500/30 hover:border-amber-400',
      badgeBg: 'bg-amber-500/15 text-amber-300',
    },
    {
      id: 'sosyal',
      name: 'SosyalLab',
      href: '/lab/sosyal',
      icon: Globe2,
      color: 'from-rose-500 to-amber-400',
      tag: 'Tarih Atlası',
      border: 'border-rose-500/30 hover:border-rose-400',
      badgeBg: 'bg-rose-500/15 text-rose-300',
    },
    {
      id: 'ingilizce',
      name: 'İngilizceLab',
      href: '/lab/ingilizce',
      icon: Languages,
      color: 'from-sky-500 to-indigo-500',
      tag: '5-12. MEB Üniteleri',
      border: 'border-sky-500/30 hover:border-sky-400',
      badgeBg: 'bg-sky-500/15 text-sky-300',
    },
  ]

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 pb-28 md:pb-16 font-sans">
      
      {/* ── Background Glow Effects ── */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8">

        {/* ── Header: Profil Kartı & Rozetler ── */}
        <section className="p-5 sm:p-7 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 p-0.5 shadow-lg shadow-orange-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center overflow-hidden">
                  <Image
                    src="/fox-head.png"
                    alt="DersoLab Maskot"
                    width={44}
                    height={44}
                    className="w-10 h-10 sm:w-11 sm:h-11 object-contain drop-shadow"
                    priority
                  />
                </div>
              </div>
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 absolute -bottom-0.5 -right-0.5" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-400">{getGreeting()},</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {gradeTrack}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {studentName} 👋
              </h1>
            </div>
          </div>

          {/* Gamified Badges Strip */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
            {/* Streak Counter */}
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/25">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400 animate-pulse" />
              <div>
                <span className="text-[10px] text-amber-300/80 uppercase font-black tracking-wider block leading-tight">
                  Çalışma Serisi
                </span>
                <span className="text-xs font-black text-amber-300 font-mono">
                  {streakCount} Gün 🔥
                </span>
              </div>
            </div>

            {/* Lesson Credits */}
            <Link
              href="/dashboard/student/packages"
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-orange-500/10 border border-orange-500/25 hover:bg-orange-500/20 transition-all cursor-pointer"
            >
              <Award className="w-4 h-4 text-orange-400" />
              <div>
                <span className="text-[10px] text-orange-300/80 uppercase font-black tracking-wider block leading-tight">
                  Kredi Bakiyesi
                </span>
                <span className="text-xs font-black text-orange-300 font-mono">
                  {creditBalance} Ders
                </span>
              </div>
            </Link>

            {/* L.A.B. Level */}
            <Link
              href="/lab"
              className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-cyan-500/10 border border-cyan-500/25 hover:bg-cyan-500/20 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="text-[10px] text-cyan-300/80 uppercase font-black tracking-wider block leading-tight">
                  L.A.B. Seviyesi
                </span>
                <span className="text-xs font-black text-cyan-300 font-mono">
                  Deney Uzmanı
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* ── Quick App Action Grid (Mobile-First Touch Launchers) ── */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <Link
            href="/lab"
            className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 hover:border-cyan-400 p-4 flex items-center gap-3 transition-all group shadow-lg hover:shadow-cyan-500/10 active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-white block group-hover:text-cyan-300 transition-colors">
                L.A.B. Simülasyon
              </span>
              <span className="text-[10px] text-slate-400">7 Branş Sanal Deney</span>
            </div>
          </Link>

          <Link
            href="/dashboard/student/ai-asistan"
            className="p-4 rounded-2xl bg-gradient-to-br from-violet-950/40 via-slate-900 to-slate-900 border border-violet-500/30 hover:border-violet-400 p-4 flex items-center gap-3 transition-all group shadow-lg hover:shadow-violet-500/10 active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-white block group-hover:text-violet-300 transition-colors">
                AI Soru Asistanı
              </span>
              <span className="text-[10px] text-slate-400">Gemini ile Çözüm</span>
            </div>
          </Link>

          <Link
            href="/dashboard/student/homework"
            className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 hover:border-emerald-400 p-4 flex items-center gap-3 transition-all group shadow-lg hover:shadow-emerald-500/10 active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-white block group-hover:text-emerald-300 transition-colors">
                Ödev Masası
              </span>
              <span className="text-[10px] text-slate-400">
                {pendingHomework.length > 0 ? `${pendingHomework.length} Bekleyen Ödev` : 'Tümü Tamam'}
              </span>
            </div>
          </Link>

          <Link
            href="/dashboard/student/netlerim"
            className="p-4 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/30 hover:border-blue-400 p-4 flex items-center gap-3 transition-all group shadow-lg hover:shadow-blue-500/10 active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <LineChart className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs sm:text-sm font-black text-white block group-hover:text-blue-300 transition-colors">
                Netlerim & Hedef
              </span>
              <span className="text-[10px] text-slate-400">
                {latestNet !== null ? `Son: ${latestNet.toFixed(1)} Net` : 'Deneme Takibi'}
              </span>
            </div>
          </Link>
        </section>

        {/* ── Canlı Ders & Bugünkü Program Hero Kartı ── */}
        <section className="rounded-3xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950/90 border border-slate-800/90 p-5 sm:p-7 shadow-xl backdrop-blur-xl relative overflow-hidden">
          {nextLesson ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                    Yaklaşan Canlı Dersin
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  {formatLessonDate(nextLesson.startTime)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-white">
                    {nextLesson.instructorName} ile Bire Bir Canlı Ders
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Görüntülü ve interaktif beyaz tahta eşliğinde online ders.
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {nextLesson.meetLink ? (
                    <a
                      href={nextLesson.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 hover:brightness-110 transition-all cursor-pointer"
                    >
                      <Video className="w-4 h-4" />
                      <span>Derse Katıl</span>
                    </a>
                  ) : (
                    <span className="text-xs font-bold text-slate-400 bg-slate-800/80 px-3 py-2 rounded-xl border border-slate-700">
                      Link Ders Başında Açılacak
                    </span>
                  )}

                  <Link
                    href="/dashboard/student/bookings"
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <span>Detay</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Ders Programın</span>
                </div>
                <h2 className="text-base sm:text-lg font-black text-white">
                  Yakın zamanda planlanmış bir canlı dersin bulunmuyor.
                </h2>
                <p className="text-xs text-slate-400 max-w-xl">
                  LGS veya YKS hedefin için eksik olduğun konuları tespit et ve hemen onaylı eğitmenlerimizle bire bir ders planla!
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                <Link
                  href="/instructors"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 hover:brightness-110 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Eğitmen Bul & Ders Ayırt</span>
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* ── L.A.B. Simülasyon Merkezi: 7 Branş Atölyesi ── */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-black uppercase tracking-wider">
                <FlaskConical className="w-4 h-4" />
                <span>L.A.B. Sanal Deney Merkezi</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                Dokun, Dene ve Keşfet
              </h2>
            </div>

            <Link
              href="/lab"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 group transition-colors"
            >
              <span>Tüm Atölyeler</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Quick Laboratory Horizontal Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {LAB_BRANCHES.map((b) => {
              const Icon = b.icon
              return (
                <Link
                  key={b.id}
                  href={b.href}
                  className={`p-3.5 rounded-2xl bg-slate-900/70 border ${b.border} hover:scale-[1.03] transition-all flex flex-col justify-between gap-3 group shadow-lg active:scale-95`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${b.color} flex items-center justify-center text-slate-950 shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-cyan-300 transition-colors">
                      {b.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {b.tag}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* ── İki Sütunlu Çalışma & Takip Alanı (Ödevler + Pomodoro) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 1. Ödevlerim & Teslim Bekleyenler */}
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-xl flex flex-col justify-between shadow-xl space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white">Aktif Ödevlerim</h3>
                    <span className="text-[11px] text-slate-400">Eğitmen görevleri ve teslimler</span>
                  </div>
                </div>

                <Link
                  href="/dashboard/student/homework"
                  className="text-xs font-bold text-emerald-400 hover:underline"
                >
                  Tümü ({homeworkList.length})
                </Link>
              </div>

              {/* Homework List Items */}
              <div className="pt-3 space-y-2.5">
                {pendingHomework.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-center space-y-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                    <p className="text-xs font-bold text-white">Teslim bekleyen ödevin yok!</p>
                    <p className="text-[11px] text-slate-400">Tüm ödevlerin tamamlandı veya kontrol edildi.</p>
                  </div>
                ) : (
                  pendingHomework.slice(0, 3).map((hw) => (
                    <Link
                      key={hw.id}
                      href="/dashboard/student/homework"
                      className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-3 text-xs transition-colors group block"
                    >
                      <div className="space-y-0.5">
                        <span className="font-bold text-white group-hover:text-emerald-300 transition-colors block">
                          {hw.title}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {hw.instructorName} • {ODEV_TIPI_ETIKET[hw.homeworkType] || 'Ödev'}
                        </span>
                      </div>
                      <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Teslim Bekliyor
                      </span>
                    </Link>
                  ))
                )}
              </div>
            </div>

            <Link
              href="/dashboard/student/homework"
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Ödev Masasına Git</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* 2. Pomodoro Odak Masası */}
          <StudentFocusTimer />
        </div>

        {/* ── DersoAI Sokratik Soru Çözüm Çağrısı ── */}
        <section className="rounded-3xl bg-gradient-to-r from-violet-950/50 via-slate-900 to-indigo-950/50 border border-violet-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google Gemini Güçlü AI Soru Asistanı</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Takıldığın Soruyu Birlikte Adım Adım Çözelim.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Sorunun fotoğrafını yükle veya yaz; DersoAI cevabı doğrudan vermek yerine sokratik ipuçlarıyla soruyu senin çözmeni sağlasın.
            </p>
          </div>

          <Link
            href="/dashboard/student/ai-asistan"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-white font-black text-xs sm:text-sm shadow-lg shadow-violet-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <span>Hemen Soru Sor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </section>

      </div>
    </div>
  )
}
