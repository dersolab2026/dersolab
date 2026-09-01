'use client'

import { Key, Eye, Hourglass, Sparkles } from 'lucide-react'
import type { PersonaType } from '../../PersonaSwitcher'

interface SurrealPersonaDialProps {
  activePersona: PersonaType
  onChange: (persona: PersonaType) => void
}

const RITES: {
  id: PersonaType
  numeral: string
  title: string
  subtitle: string
  glyph: typeof Key
  glow: string
  borderActive: string
}[] = [
  {
    id: 'student',
    numeral: 'RÜYA I · TEMPUS',
    title: 'Zaman Bükücü (Öğrenci)',
    subtitle: 'Zaman burada akmaz, hedefe kilitlenir.',
    glyph: Key,
    glow: 'text-amber-300',
    borderActive: 'border-amber-500/80 bg-gradient-to-r from-red-950/60 via-amber-950/30 to-black/80 shadow-[0_0_35px_rgba(245,158,11,0.25)]',
  },
  {
    id: 'parent',
    numeral: 'RÜYA II · VERITAS',
    title: 'Kadife Göz (Veli)',
    subtitle: 'Sıfır yanılsama, mutlak şeffaflık.',
    glyph: Eye,
    glow: 'text-red-400',
    borderActive: 'border-red-500/80 bg-gradient-to-r from-red-950/60 via-red-900/30 to-black/80 shadow-[0_0_35px_rgba(239,68,68,0.25)]',
  },
  {
    id: 'instructor',
    numeral: 'RÜYA III · SOVEREIGN',
    title: 'Egemen Sahne (Eğitmen)',
    subtitle: 'Kendi evreninin egemen saati ve kazancı.',
    glyph: Hourglass,
    glow: 'text-purple-300',
    borderActive: 'border-purple-500/80 bg-gradient-to-r from-purple-950/60 via-amber-950/30 to-black/80 shadow-[0_0_35px_rgba(168,85,247,0.25)]',
  },
]

export function SurrealPersonaDial({ activePersona, onChange }: SurrealPersonaDialProps) {
  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      {/* Mystical Roman Numeral Header */}
      <div className="flex items-center justify-between px-4 py-1.5 mb-2 text-xs font-serif tracking-widest text-amber-500/70 border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="uppercase">SURREALİST PERSONA PORTALI · XII // 2026</span>
        </div>
        <span className="hidden sm:inline-block font-mono text-[11px] text-slate-500">
          DALÍ & LYNCH DENEYSEL MATRİKSİ
        </span>
      </div>

      {/* 3 Surreal Archetype Portals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {RITES.map((r) => {
          const isActive = activePersona === r.id
          const Glyph = r.glyph

          return (
            <button
              key={r.id}
              type="button"
              onClick={() => onChange(r.id)}
              className={`relative overflow-hidden p-4 rounded-2xl border backdrop-blur-2xl transition-all duration-500 cursor-pointer text-left ${
                isActive
                  ? `${r.borderActive} text-white scale-[1.02]`
                  : 'bg-black/50 border-white/10 hover:border-amber-500/30 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-serif tracking-[0.25em] text-amber-400/80">
                  {r.numeral}
                </span>
                <Glyph className={`w-4 h-4 ${isActive ? r.glow : 'text-slate-600'}`} />
              </div>

              <div className="font-serif font-bold text-sm sm:text-base tracking-wide text-white mb-1">
                {r.title}
              </div>

              <div className="text-[11px] font-sans text-slate-400 font-light leading-snug">
                {r.subtitle}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
