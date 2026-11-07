import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ShieldCheck, FlaskConical, CheckCircle2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/server'
import { GUIDANCE_SUBJECT } from '@/lib/constants'
import { getInstructorById, getInstructorEducation } from '@/lib/marketplace/get-instructors'
import { InstructorBookingSection } from '@/components/booking/InstructorBookingSection'
import { EducationList } from '@/components/marketplace/EducationList'
import { IntroVideoPlayer } from '@/components/marketplace/IntroVideoPlayer'

interface InstructorDetailPageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ tur?: string }>
}

export default async function InstructorDetailPage({ params, searchParams }: InstructorDetailPageProps) {
  const { id } = await params
  const { tur } = await searchParams
  const instructor = await getInstructorById(id)
  if (!instructor) notFound()

  const offersCoaching = instructor.subjects.includes(GUIDANCE_SUBJECT)
  const offersLessons = instructor.subjects.some((s) => s !== GUIDANCE_SUBJECT)
  // Koçluk sayfasından gelindiyse koçluk, aksi halde eğitmenin verdiği tek tür.
  const defaultSessionType =
    (tur === 'kocluk' && offersCoaching) || !offersLessons ? 'coaching' : 'lesson'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const education = await getInstructorEducation(instructor.userId)

  const initials = instructor.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()
  const redirectPath = `/instructors/${instructor.userId}${tur ? `?tur=${tur}` : ''}`

  return (
    <div className="min-h-[calc(100vh-57px)] md:min-h-screen w-full relative">
      <div className="relative z-10 mx-auto max-w-3xl space-y-6 p-5 py-10">
        <div className="bg-white/[0.02] rounded-2xl p-6 sm:p-8 border border-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border border-white/10">
              <AvatarImage src={instructor.avatarUrl ?? undefined} alt={instructor.name} />
              <AvatarFallback className="bg-white/10 text-white font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold text-white">{instructor.name}</h1>
                {instructor.isCalendarConnected && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Onaylı Takvim
                  </span>
                )}
              </div>
              {instructor.completedLessonCount > 0 && (
                <p className="text-sm font-bold text-[#6FA89E]">{instructor.completedLessonCount} ders tamamladı</p>
              )}
              <div className="mt-1.5 flex flex-wrap gap-1">
                {instructor.subjects.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-lg border border-white/10 bg-white/5 text-slate-200 text-xs font-bold">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {instructor.bio && <p className="font-semibold text-slate-300 leading-relaxed">{instructor.bio}</p>}

          <IntroVideoPlayer videoUrl={instructor.introVideoUrl} />
          <EducationList entries={education} />

          {/* DersoLab Güvence Bandı */}
          <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <span className="font-bold text-white block">%100 Eğitmen Değişim Garantisi</span>
                Kredileriniz tek bir eğitmene bağlı değildir, tüm branşlarda özgürce kullanılır.
              </div>
            </div>
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-start gap-2.5">
              <FlaskConical className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300">
                <span className="font-bold text-white block">Canlı L.A.B. & Ortak Soru Tahtası</span>
                Dersler 3D simülasyonlar ve interaktif soru tahtası eşliğinde işlenir.
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.02] rounded-2xl p-6 sm:p-8 border border-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          {!user ? (
            <div className="space-y-4 text-center py-2">
              <h2 className="text-lg font-black text-white">
                {instructor.name} ile Ders veya Koçluk Planla
              </h2>
              <p className="text-sm font-semibold text-slate-400 max-w-md mx-auto">
                Müsait saatleri görmek ve hemen bire bir seans oluşturmak için ücretsiz hesabına giriş yap veya kayıt ol.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <Link
                  href={`/register?redirect=${encodeURIComponent(redirectPath)}`}
                  className="inline-flex items-center justify-center bg-[#DD7B3A] text-white font-bold rounded-full px-6 py-2.5 text-sm hover:bg-[#DD7B3A]/90 transition-all shadow-[0_0_15px_rgba(221,123,58,0.3)]"
                >
                  Ücretsiz Kayıt Ol →
                </Link>
                <Link
                  href={`/login?redirect=${encodeURIComponent(redirectPath)}`}
                  className="inline-flex items-center justify-center bg-white/5 border border-white/10 text-slate-200 font-bold rounded-full px-6 py-2.5 text-sm hover:bg-white/10 transition-all"
                >
                  Giriş Yap
                </Link>
              </div>
            </div>
          ) : instructor.isCalendarConnected ? (
            <InstructorBookingSection
              instructorId={instructor.userId}
              studentId={user.id}
              offersLessons={offersLessons}
              offersCoaching={offersCoaching}
              defaultSessionType={defaultSessionType}
            />
          ) : (
            <p className="font-semibold text-slate-400">
              Bu eğitmen henüz takvimini bağlamadı, rezervasyon şu anda açık değil.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
