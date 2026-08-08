'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SUBJECT_CATEGORIES } from '@/lib/constants'

interface SubjectFilterProps {
  activeSubject?: string
}

export function SubjectFilter({ activeSubject }: SubjectFilterProps) {
  const initialOpen = SUBJECT_CATEGORIES.find((c) => (c.subjects as readonly string[]).includes(activeSubject ?? ''))?.label ?? null
  const [openCategory, setOpenCategory] = useState<string | null>(initialOpen)

  const openSubjects = SUBJECT_CATEGORIES.find((c) => c.label === openCategory)?.subjects

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Link
          href="/instructors"
          className={`px-4 py-2 rounded-xl border-4 border-[#1B2430] font-bold text-sm transition-all ${
            !activeSubject ? 'bg-[#DD7B3A] text-[#F4F1E8] shadow-[0_4px_0_#1B2430]' : 'bg-white text-[#1B2430]'
          }`}
        >
          Tümü
        </Link>
        {SUBJECT_CATEGORIES.map((category) => (
          <button
            key={category.label}
            type="button"
            onClick={() => setOpenCategory((prev) => (prev === category.label ? null : category.label))}
            className={`px-4 py-2 rounded-xl border-4 border-[#1B2430] font-bold text-sm transition-all ${
              openCategory === category.label ? 'bg-[#6FA89E] text-[#F4F1E8] shadow-[0_4px_0_#1B2430]' : 'bg-white text-[#1B2430]'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {openSubjects && (
        <div className="flex flex-wrap gap-2">
          {openSubjects.map((s) => (
            <Link
              key={s}
              href={`/instructors?subject=${encodeURIComponent(s)}`}
              className={`px-4 py-2 rounded-xl border-4 border-[#1B2430] font-bold text-sm transition-all ${
                activeSubject === s ? 'bg-[#DD7B3A] text-[#F4F1E8] shadow-[0_4px_0_#1B2430]' : 'bg-white text-[#1B2430]'
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
