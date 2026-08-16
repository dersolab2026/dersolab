import { InstructorCard } from '@/components/marketplace/InstructorCard'
import { getInstructors } from '@/lib/marketplace/get-instructors'
import { getNextAvailableSlots } from '@/lib/availability/get-next-slots'
import { GUIDANCE_SUBJECT } from '@/lib/constants'

export default async function CoachingPage() {
  const instructors = await getInstructors({ subject: GUIDANCE_SUBJECT })
  const nextSlots = await getNextAvailableSlots(
    instructors.filter((i) => i.isCalendarConnected).map((i) => i.userId),
  )

  return (
    <div className="min-h-screen w-full bg-[#D5EAE3] relative overflow-hidden">
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(45deg, #6FA89E 25%, transparent 25%), linear-gradient(-45deg, #6FA89E 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #6FA89E 75%), linear-gradient(-45deg, transparent 75%, #6FA89E 75%)',
          backgroundSize: '40px 40px', backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px'
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl space-y-6 p-5 py-10">
        <div className="bg-[#F4F1E8] rounded-2xl p-6 sm:p-8 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430]">
          <h1 className="font-sans text-2xl sm:text-3xl font-black text-[#1B2430] leading-snug">
            Koçluk
          </h1>
          <p className="mt-2 font-sans font-semibold text-[#1B2430]">
            Koçlarımızla birebir seans planla.
          </p>
        </div>

        {instructors.length === 0 ? (
          <p className="font-sans font-semibold text-[#1B2430]">Şu anda müsait koç bulunmuyor.</p>
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
