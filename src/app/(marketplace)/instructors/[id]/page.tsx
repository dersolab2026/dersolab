import { notFound, redirect } from 'next/navigation'
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
  if (!user) redirect('/login')

  const education = await getInstructorEducation(instructor.userId)

  const initials = instructor.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

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
              <h1 className="text-2xl font-bold text-white">{instructor.name}</h1>
              {instructor.completedLessonCount > 0 && (
                <p className="text-sm font-bold text-[#3F6E66]">{instructor.completedLessonCount} ders tamamladı</p>
              )}
              <div className="mt-1 flex flex-wrap gap-1">
                {instructor.subjects.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-lg border border-white/10 bg-white/5 text-slate-200 text-xs font-bold">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {instructor.bio && <p className="font-semibold text-slate-400">{instructor.bio}</p>}

          <IntroVideoPlayer videoUrl={instructor.introVideoUrl} />
          <EducationList entries={education} />
        </div>

        <div className="bg-white/[0.02] rounded-2xl p-6 sm:p-8 border border-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          {instructor.isCalendarConnected ? (
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
