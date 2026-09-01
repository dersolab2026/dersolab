'use client'

import type { PersonaType } from '../../PersonaSwitcher'
import { GraduationCap, Users, BookOpen } from 'lucide-react'

interface HumanRoleTabsProps {
  activePersona: PersonaType
  onChange: (persona: PersonaType) => void
}

const TABS: { id: PersonaType; label: string; icon: typeof GraduationCap; desc: string }[] = [
  {
    id: 'student',
    label: 'Öğrenciler İçin',
    icon: GraduationCap,
    desc: 'Bire bir özel ders & soru çözümü',
  },
  {
    id: 'parent',
    label: 'Veliler İçin',
    icon: Users,
    desc: 'Güvenli, şeffaf & yanmayan ders kredileri',
  },
  {
    id: 'instructor',
    label: 'Eğitmenler İçin',
    icon: BookOpen,
    desc: 'Esnek saatler, hazır Google Meet & düzenli ödeme',
  },
]

export function HumanRoleTabs({ activePersona, onChange }: HumanRoleTabsProps) {
  return (
    <div className="w-full max-w-2xl mx-auto my-6">
      <div className="p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 grid grid-cols-3 gap-1 shadow-inner">
        {TABS.map((tab) => {
          const isActive = activePersona === tab.id
          const Icon = tab.icon

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-slate-950 shadow-sm border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-white/40'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
