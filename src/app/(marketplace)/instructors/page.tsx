import { redirect } from 'next/navigation'
import { InstructorCard } from '@/components/marketplace/InstructorCard'
import { SubjectFilter } from '@/components/marketplace/SubjectFilter'
import { createClient } from '@/lib/supabase/server'
import { getInstructors } from '@/lib/marketplace/get-instructors'
import { getNextAvailableSlots } from '@/lib/availability/get-next-slots'
import { SayfaDeseni } from '@/components/layout/SayfaDeseni'

interface InstructorsPageProps {
  searchParams: Promise<{ subject?: string; category?: string }>
}

export default async function InstructorsPage({ searchParams }: InstructorsPageProps) {
  // Eğitmen listesi üyelere özel; giriş yapmayan göremiyor.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { subject, category } = await searchParams
  const instructors = await getInstructors({ subject, category })
  const nextSlots = await getNextAvailableSlots(
    instructors.filter((i) => i.isCalendarConnected).map((i) => i.userId),
  )

  return (
    <div className="min-h-screen w-full bg-[var(--zemin)] relative overflow-hidden">
      <SayfaDeseni />

      <div className="relative z-10 mx-auto max-w-5xl space-y-6 p-5 py-10">
        <div className="bg-[var(--yuzey)] rounded-2xl p-6 sm:p-8 border-4 border-[var(--cizgi)] shadow-[0_8px_0_var(--golge)]">
          <h1 className="font-sans text-2xl sm:text-3xl font-black text-[var(--yazi)] leading-snug">
            Eğitmenler
          </h1>
        </div>

        <SubjectFilter activeSubject={subject} activeCategory={category} />

        {instructors.length === 0 ? (
          <p className="font-sans font-semibold text-[var(--yazi)]">Bu branşta henüz eğitmen bulunmuyor.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {instructors.map((instructor) => (
              <InstructorCard
                key={instructor.userId}
                instructor={instructor}
                nextSlot={nextSlots.get(instructor.userId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
