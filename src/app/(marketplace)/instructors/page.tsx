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
    <div className="min-h-[calc(100vh-57px)] md:min-h-screen w-full relative">
      <div className="relative z-10 mx-auto max-w-5xl space-y-6 p-5 py-10">
        <div className="bg-white/[0.02] rounded-2xl p-6 sm:p-8 border border-white/5 backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <h1 className="font-sans text-2xl sm:text-3xl font-black text-white leading-snug">
            Eğitmenler
          </h1>
          <p className="text-sm font-semibold text-slate-400 mt-1">
            Alanında uzman eğitmenleri inceleyin, hedeflerinize uygun dersi hemen başlatın.
          </p>
        </div>

        {/* Hoş Geldin Paketi Vurgusu */}
        <div className="bg-white/[0.02] rounded-2xl p-6 sm:p-7 border border-white/5 shadow-[0_0_30px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#6FA89E]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="space-y-2 relative z-10">
            <span className="inline-block px-2.5 py-0.5 rounded-lg bg-[#6FA89E]/20 text-[#6FA89E] border border-[#6FA89E]/30 text-xs font-bold">
              🎁 HOŞ GELDİN PAKETİ
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">İlk Tanışma Dersiniz Bizden Hediye</h2>
            <p className="text-sm font-semibold text-slate-400 max-w-xl">
              Kredi harcamadan ve hiçbir kart bilgisi girmeden eğitmeninizle tanışın, hedeflerinizi birlikte planlayın.
            </p>
          </div>
          <a
            href="/demo-ders"
            className="relative z-10 shrink-0 inline-flex items-center justify-center bg-[#DD7B3A] text-white font-bold rounded-full px-6 py-3 text-sm hover:bg-[#DD7B3A]/90 transition-all shadow-[0_0_15px_rgba(221,123,58,0.3)]"
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
