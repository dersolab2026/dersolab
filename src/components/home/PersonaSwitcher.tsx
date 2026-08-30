'use client'

export type PersonaType = 'student' | 'parent' | 'instructor'

interface PersonaSwitcherProps {
  activePersona: PersonaType
  onChange: (persona: PersonaType) => void
}

const PERSONAS: { id: PersonaType; label: string; icon: string; tag: string }[] = [
  { id: 'student', label: 'Öğrenciyim', icon: '🎓', tag: 'LGS & YKS & Okul' },
  { id: 'parent', label: 'Veliyim', icon: '👨‍👩‍👧', tag: 'Gelişim & Takip' },
  { id: 'instructor', label: 'Eğitmenim', icon: '👨‍🏫', tag: 'Ders Ver & Kazan' },
]

export function PersonaSwitcher({ activePersona, onChange }: PersonaSwitcherProps) {
  return (
    <div className="bg-[#F4F1E8] rounded-2xl p-3 sm:p-4 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430]">
      <div className="text-center mb-2.5">
        <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#1B2430]/70">
          Sizin İçin En Uygun Deneyimi Seçin:
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {PERSONAS.map((p) => {
          const isActive = activePersona === p.id
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onChange(p.id)}
              className={`relative flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5 py-2.5 sm:py-3.5 px-2 sm:px-4 rounded-xl border-4 border-[#1B2430] font-black text-sm sm:text-base transition-all duration-150 cursor-pointer text-center ${
                isActive
                  ? 'bg-[#DD7B3A] text-[#F4F1E8] shadow-[0_4px_0_#1B2430] translate-y-[-2px]'
                  : 'bg-white text-[#1B2430] hover:bg-[#D5EAE3] shadow-[0_2px_0_#1B2430] active:translate-y-0.5'
              }`}
            >
              <span className="text-lg sm:text-xl leading-none">{p.icon}</span>
              <div className="flex flex-col items-center sm:items-start">
                <span className="leading-tight">{p.label}</span>
                <span
                  className={`text-[10px] sm:text-xs font-semibold hidden sm:inline-block leading-none mt-0.5 ${
                    isActive ? 'text-[#F4F1E8]/90' : 'text-[#1B2430]/60'
                  }`}
                >
                  {p.tag}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
