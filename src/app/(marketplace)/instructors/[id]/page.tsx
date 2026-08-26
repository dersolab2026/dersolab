import { notFound, redirect } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/server'
import { GUIDANCE_SUBJECT } from '@/lib/constants'
import { getInstructorById, getInstructorEducation } from '@/lib/marketplace/get-instructors'
import { InstructorBookingSection } from '@/components/booking/InstructorBookingSection'
import { EducationList } from '@/components/marketplace/EducationList'
import { IntroVideoPlayer } from '@/components/marketplace/IntroVideoPlayer'
import { SayfaDeseni } from '@/components/layout/SayfaDeseni'

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
    <div className="min-h-screen w-full bg-[var(--zemin)] relative overflow-hidden">
      <SayfaDeseni />

      <div className="relative z-10 mx-auto max-w-3xl space-y-6 p-5 py-10">
        <div className="bg-[var(--yuzey)] rounded-2xl p-6 sm:p-8 border-4 border-[var(--cizgi)] shadow-[0_8px_0_var(--golge)] space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-[var(--cizgi)]">
              <AvatarImage src={instructor.avatarUrl ?? undefined} alt={instructor.name} />
              <AvatarFallback className="bg-[var(--yuzey-ic)] text-[var(--yazi)] font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-[var(--yazi)]">{instructor.name}</h1>
              {instructor.completedLessonCount > 0 && (
                <p className="text-sm font-bold text-[var(--ikincil-yazi)]">{instructor.completedLessonCount} ders tamamladı</p>
              )}
              <div className="mt-1 flex flex-wrap gap-1">
                {instructor.subjects.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-lg border-2 border-[var(--cizgi)] bg-[var(--yuzey-ic)] text-[var(--yazi)] text-xs font-bold">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {instructor.bio && <p className="font-semibold text-[var(--yazi)]/70">{instructor.bio}</p>}

          <IntroVideoPlayer videoUrl={instructor.introVideoUrl} />
          <EducationList entries={education} />
        </div>

        <div className="bg-[var(--yuzey)] rounded-2xl p-6 sm:p-8 border-4 border-[var(--cizgi)] shadow-[0_8px_0_var(--golge)]">
          {instructor.isCalendarConnected ? (
            <InstructorBookingSection
              instructorId={instructor.userId}
              studentId={user.id}
              offersLessons={offersLessons}
              offersCoaching={offersCoaching}
              defaultSessionType={defaultSessionType}
            />
          ) : (
            <p className="font-semibold text-[var(--yazi)]">
              Bu eğitmen henüz takvimini bağlamadı, rezervasyon şu anda açık değil.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
