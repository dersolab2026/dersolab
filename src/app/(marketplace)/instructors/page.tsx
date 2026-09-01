import { redirect } from 'next/navigation'
import { InstructorCard } from '@/components/marketplace/InstructorCard'
import { SubjectFilter } from '@/components/marketplace/SubjectFilter'
import { createClient } from '@/lib/supabase/server'
import { getInstructors } from '@/lib/marketplace/get-instructors'
import { getNextAvailableSlots } from '@/lib/availability/get-next-slots'

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
            Eğitmenler
          </h1>
          <p className="text-sm font-semibold text-[#1B2430]/70 mt-1">
            Alanında uzman eğitmenleri inceleyin, hedeflerinize uygun dersi hemen başlatın.
          </p>
        </div>

        {/* Hoş Geldin Paketi Vurgusu */}
        <div className="bg-[#6FA89E] rounded-2xl p-6 sm:p-7 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430] text-[#F4F1E8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <span className="inline-block px-2.5 py-0.5 rounded-lg border-2 border-[#1B2430] bg-[#F4F1E8] text-[#1B2430] text-xs font-black">
              🎁 HOŞ GELDİN PAKETİ
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-[#F4F1E8]">İlk Tanışma Dersiniz Bizden Hediye</h2>
            <p className="text-sm font-semibold text-[#F4F1E8]/90 max-w-xl">
              Kredi harcamadan ve hiçbir kart bilgisi girmeden eğitmeninizle tanışın, hedeflerinizi birlikte planlayın.
            </p>
          </div>
          <a
            href="/demo-ders"
            className="shrink-0 inline-flex items-center justify-center bg-[#DD7B3A] text-[#1B2430] font-black rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] px-5 py-3 text-sm hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all"
          >
            Ücretsiz Dersi Başlat →
          </a>
        </div>

        <SubjectFilter activeSubject={subject} activeCategory={category} />

        {instructors.length === 0 ? (
          <p className="font-sans font-semibold text-[#1B2430]">Bu branşta henüz eğitmen bulunmuyor.</p>
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
