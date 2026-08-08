import Link from 'next/link'
import { InstructorCard } from '@/components/marketplace/InstructorCard'
import { getInstructors } from '@/lib/marketplace/get-instructors'
import { SUBJECT_CATEGORIES } from '@/lib/constants'

interface InstructorsPageProps {
  searchParams: Promise<{ subject?: string }>
}

export default async function InstructorsPage({ searchParams }: InstructorsPageProps) {
  const { subject } = await searchParams
  const instructors = await getInstructors({ subject })

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
        </div>

        <div className="space-y-3">
          <Link
            href="/instructors"
            className={`inline-block px-4 py-2 rounded-xl border-4 border-[#1B2430] font-bold text-sm transition-all ${
              !subject ? 'bg-[#DD7B3A] text-[#F4F1E8] shadow-[0_4px_0_#1B2430]' : 'bg-white text-[#1B2430]'
            }`}
          >
            Tümü
          </Link>
          {SUBJECT_CATEGORIES.map((category) => (
            <div key={category.label} className="space-y-1.5">
              <p className="text-xs font-bold text-[#1B2430]/60 uppercase tracking-wide">{category.label}</p>
              <div className="flex flex-wrap gap-2">
                {category.subjects.map((s) => (
                  <Link
                    key={s}
                    href={`/instructors?subject=${encodeURIComponent(s)}`}
                    className={`px-4 py-2 rounded-xl border-4 border-[#1B2430] font-bold text-sm transition-all ${
                      subject === s ? 'bg-[#DD7B3A] text-[#F4F1E8] shadow-[0_4px_0_#1B2430]' : 'bg-white text-[#1B2430]'
                    }`}
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {instructors.length === 0 ? (
          <p className="font-sans font-semibold text-[#1B2430]">Bu branşta henüz eğitmen bulunmuyor.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {instructors.map((instructor) => <InstructorCard key={instructor.userId} instructor={instructor} />)}
          </div>
        )}
      </div>
    </div>
  )
}
