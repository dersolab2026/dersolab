import { notFound, redirect } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { createClient } from '@/lib/supabase/server'
import { getInstructorById, getInstructorEducation } from '@/lib/marketplace/get-instructors'
import { InstructorBookingSection } from '@/components/booking/InstructorBookingSection'
import { EducationList } from '@/components/marketplace/EducationList'
import { IntroVideoPlayer } from '@/components/marketplace/IntroVideoPlayer'

interface InstructorDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function InstructorDetailPage({ params }: InstructorDetailPageProps) {
  const { id } = await params
  const instructor = await getInstructorById(id)
  if (!instructor) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const education = await getInstructorEducation(instructor.userId)

  const initials = instructor.name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="min-h-screen w-full bg-[#D5EAE3] relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(45deg, #6FA89E 25%, transparent 25%), linear-gradient(-45deg, #6FA89E 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #6FA89E 75%), linear-gradient(-45deg, transparent 75%, #6FA89E 75%)',
          backgroundSize: '40px 40px', backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl space-y-6 p-5 py-10">
        <div className="bg-[#F4F1E8] rounded-2xl p-6 sm:p-8 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430] space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-[#1B2430]">
              <AvatarImage src={instructor.avatarUrl ?? undefined} alt={instructor.name} />
              <AvatarFallback className="bg-white text-[#1B2430] font-bold">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold text-[#1B2430]">{instructor.name}</h1>
              <div className="mt-1 flex flex-wrap gap-1">
                {instructor.subjects.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded-lg border-2 border-[#1B2430] bg-white text-[#1B2430] text-xs font-bold">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {instructor.bio && <p className="font-semibold text-[#1B2430]/70">{instructor.bio}</p>}

          <IntroVideoPlayer videoUrl={instructor.introVideoUrl} />
          <EducationList entries={education} />
        </div>

        <div className="bg-[#F4F1E8] rounded-2xl p-6 sm:p-8 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430]">
          {instructor.isCalendarConnected ? (
            <InstructorBookingSection instructorId={instructor.userId} studentId={user.id} />
          ) : (
            <p className="font-semibold text-[#1B2430]">
              Bu eğitmen henüz takvimini bağlamadı, rezervasyon şu anda açık değil.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
