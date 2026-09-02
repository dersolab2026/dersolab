'use client'

import { GraduationCap, ShieldCheck, Briefcase } from 'lucide-react'

export type PersonaType = 'student' | 'parent' | 'instructor'

interface PersonaSwitcherProps {
  activePersona: PersonaType
  onChange: (persona: PersonaType) => void
}

const PERSONAS: { id: PersonaType; label: string; icon: typeof GraduationCap }[] = [
  { id: 'student', label: 'Öğrenci', icon: GraduationCap },
  { id: 'parent', label: 'Veli', icon: ShieldCheck },
  { id: 'instructor', label: 'Eğitmen', icon: Briefcase },
]

export function PersonaSwitcher({ activePersona, onChange }: PersonaSwitcherProps) {
  return (
    <div className="flex justify-center my-4">
      {/* Sleek Floating Glass Pill */}
      <div className="relative inline-flex items-center p-1 rounded-full bg-slate-900/80 backdrop-blur-2xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
        {PERSONAS.map((p) => {
          const isActive = activePersona === p.id
          const Icon = p.icon

          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(p.id)}
              className={`relative flex items-center gap-2 px-5 sm:px-7 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer ${
                isActive
                  ? 'text-slate-950 bg-white shadow-lg shadow-white/10 font-bold scale-[1.02]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-emerald-700' : 'text-slate-500'}`} />
              <span className="tracking-tight">{p.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
