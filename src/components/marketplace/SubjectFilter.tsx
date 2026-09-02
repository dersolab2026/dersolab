'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SUBJECT_CATEGORIES } from '@/lib/constants'

interface SubjectFilterProps {
  activeSubject?: string
  activeCategory?: string
}

export function SubjectFilter({ activeSubject, activeCategory }: SubjectFilterProps) {
  const initialOpen =
    activeCategory ??
    SUBJECT_CATEGORIES.find((c) => (c.subjects as readonly string[]).includes(activeSubject ?? ''))?.label ??
    null
  const [openCategory, setOpenCategory] = useState<string | null>(initialOpen)

  const openSubjects = SUBJECT_CATEGORIES.find((c) => c.label === openCategory)?.subjects

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <Link
          href="/instructors"
          className={`px-4 py-2 rounded-xl border border-white/10 font-bold text-sm transition-all ${
            !activeSubject && !activeCategory ? 'bg-[#DD7B3A] text-[#F4F1E8] shadow-[0_0_15px_rgba(0,0,0,0.3)]' : 'bg-white/5 text-slate-200'
          }`}
        >
          Tümü
        </Link>
        {SUBJECT_CATEGORIES.map((category) => (
          <Link
            key={category.label}
            href={`/instructors?category=${encodeURIComponent(category.label)}`}
            onClick={() => setOpenCategory((prev) => (prev === category.label ? null : category.label))}
            className={`px-4 py-2 rounded-xl border border-white/10 font-bold text-sm transition-all ${
              activeCategory === category.label
                ? 'bg-[#DD7B3A] text-[#F4F1E8] shadow-[0_0_15px_rgba(0,0,0,0.3)]'
                : openCategory === category.label
                  ? 'bg-[#6FA89E] text-[#F4F1E8] shadow-[0_0_15px_rgba(0,0,0,0.3)]'
                  : 'bg-white/5 text-slate-200'
            }`}
          >
            {category.label}
          </Link>
        ))}
      </div>

      {openSubjects && (
        <div className="flex flex-wrap gap-2">
          {openSubjects.map((s) => (
            <Link
              key={s}
              href={`/instructors?subject=${encodeURIComponent(s)}`}
              className={`px-4 py-2 rounded-xl border border-white/10 font-bold text-sm transition-all ${
                activeSubject === s ? 'bg-[#DD7B3A] text-[#F4F1E8] shadow-[0_0_15px_rgba(0,0,0,0.3)]' : 'bg-white/5 text-slate-200'
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
