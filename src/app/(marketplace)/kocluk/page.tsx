import { redirect } from 'next/navigation'
import { InstructorCard } from '@/components/marketplace/InstructorCard'
import { createClient } from '@/lib/supabase/server'
import { getInstructors } from '@/lib/marketplace/get-instructors'
import { getNextAvailableSlots } from '@/lib/availability/get-next-slots'
import { GUIDANCE_SUBJECT } from '@/lib/constants'

export default async function CoachingPage() {
  // Koç listesi de üyelere özel.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const instructors = await getInstructors({ subject: GUIDANCE_SUBJECT })
  const nextSlots = await getNextAvailableSlots(
    instructors.filter((i) => i.isCalendarConnected).map((i) => i.userId),
  )

  return (
    <div className="min-h-[calc(100vh-57px)] md:min-h-screen w-full relative">
      <div className="relative z-10 mx-auto max-w-5xl space-y-6 p-5 py-10">
        <div className="bg-white/[0.02] rounded-2xl p-6 sm:p-8 border border-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h1 className="font-sans text-2xl sm:text-3xl font-black text-white leading-snug">
            Koçluk
          </h1>
          <p className="mt-2 font-sans font-semibold text-slate-400">
            Koçlarımızla birebir seans planla.
          </p>
        </div>

        {instructors.length === 0 ? (
          <p className="font-sans font-semibold text-slate-400">Şu anda müsait koç bulunmuyor.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {instructors.map((instructor) => (
              <InstructorCard
                key={instructor.userId}
                instructor={instructor}
                sessionTypeHint="kocluk"
                nextSlot={nextSlots.get(instructor.userId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
