'use client'

import { Building2, Sparkles, Users2, Leaf, Zap, LayoutTemplate } from 'lucide-react'

export type DesignVersion = 'persona-dedicated' | 'campus' | 'master-ad' | 'clean-human' | 'design-a' | 'design-c'

interface DesignVersionSwitcherProps {
  currentVersion: DesignVersion
  onVersionChange: (version: DesignVersion) => void
}

export function DesignVersionSwitcher({ currentVersion, onVersionChange }: DesignVersionSwitcherProps) {
  return (
    <aside
      aria-label="Tasarım Karşılaştırma Paneli"
      className="fixed bottom-5 right-5 z-50 flex flex-wrap items-center p-1.5 rounded-2xl bg-black/95 text-slate-100 backdrop-blur-2xl border-2 border-amber-500/40 shadow-2xl gap-1.5"
    >
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono font-bold text-amber-300 border-r border-amber-500/30">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span>VİTRİN SEÇİCİ:</span>
      </div>

      {/* Persona Dedicated (Öğrenci / Veli / Eğitmen · LGS & YKS) */}
      <button
        type="button"
        onClick={() => onVersionChange('persona-dedicated')}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          currentVersion === 'persona-dedicated'
            ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-slate-950 shadow-[0_0_25px_rgba(251,191,36,0.8)] scale-105'
            : 'text-amber-400 hover:text-white hover:bg-white/[0.08] border border-amber-400/30'
        }`}
      >
        <Users2 className="w-3.5 h-3.5" />
        <span>🎯 Öğrenci · Veli · Eğitmen (LGS & YKS)</span>
      </button>

      {/* Interactive Virtual Campus (Bina & Danışma Deneyimi) */}
      <button
        type="button"
        onClick={() => onVersionChange('campus')}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          currentVersion === 'campus'
            ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.8)] scale-105'
            : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
        }`}
      >
        <Building2 className="w-3.5 h-3.5 text-slate-950 fill-current" />
        <span>🏛️ Sanal Bina & Danışma Deneyimi</span>
      </button>

      {/* Master Advertising Showcase */}
      <button
        type="button"
        onClick={() => onVersionChange('master-ad')}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          currentVersion === 'master-ad'
            ? 'bg-blue-600 text-white shadow-sm scale-105'
            : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
        }`}
      >
        <Zap className="w-3.5 h-3.5" />
        <span>Süslü Reklam Vitrini</span>
      </button>

      {/* Clean Human Design */}
      <button
        type="button"
        onClick={() => onVersionChange('clean-human')}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          currentVersion === 'clean-human'
            ? 'bg-white text-slate-950 shadow-sm scale-105'
            : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
        }`}
      >
        <Leaf className="w-3.5 h-3.5" />
        <span>Yalın & Sade</span>
      </button>

      {/* Design A */}
      <button
        type="button"
        onClick={() => onVersionChange('design-a')}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          currentVersion === 'design-a'
            ? 'bg-emerald-500 text-slate-950 shadow-sm scale-105'
            : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>Obsidyen Lüks</span>
      </button>

      {/* Design C — Conventional Platform */}
      <button
        type="button"
        onClick={() => onVersionChange('design-c')}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          currentVersion === 'design-c'
            ? 'bg-sky-500 text-white shadow-sm scale-105'
            : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
        }`}
      >
        <LayoutTemplate className="w-3.5 h-3.5" />
        <span>Konvansiyonel Platform</span>
      </button>
    </aside>
  )
}
