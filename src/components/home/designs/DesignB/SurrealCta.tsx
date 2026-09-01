'use client'

import Link from 'next/link'
import { Key, ArrowRight, Sparkles, Flame } from 'lucide-react'
import type { PersonaType } from '../../PersonaSwitcher'

export function SurrealCta({ persona }: { persona: PersonaType }) {
  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-black via-red-950/50 to-black border-2 border-amber-500/50 p-8 sm:p-16 text-center overflow-hidden shadow-[0_0_90px_rgba(245,158,11,0.3)] font-serif">
      {/* Ambient Crimson Pulsing Light */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[32rem] h-48 bg-red-600/25 rounded-full blur-3xl animate-pulse-glow" />

      {/* Floating Golden Key Graphic with Pulsing Shimmer Ring */}
      <div className="relative z-10 mx-auto w-28 h-28 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-2 border-amber-400 p-1.5 shadow-[0_0_50px_rgba(245,158,11,0.6)] mb-8 animate-float-slow group">
        <div className="relative w-full h-full rounded-2xl overflow-hidden">
          <img
            src="/dali-lynch-portal.jpg"
            alt="Surrealist Golden Key"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-transparent to-red-500/20 pointer-events-none" />
        </div>
      </div>

      <div className="relative z-10 max-w-xl mx-auto space-y-5">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/80 border border-amber-500/40 text-amber-300 text-xs tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>✦ IL MYSTÈRE · AUREA CLAVIS ✦</span>
        </div>

        <h3 className="text-2xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-serif">
          Kadife Perdeyi Aralayın, Kendi Geleceğinizi Çizin
        </h3>

        <p className="text-sm sm:text-base text-slate-300 font-sans font-light leading-relaxed">
          20 dakikalık ücretsiz tanışma seansı kapısı açık. Altın anahtarı çevirin ve DersoLab deneyimine hemen adım
          atın.
        </p>

        <div className="pt-4">
          <Link
            href="/demo-ders"
            className="group relative inline-flex items-center justify-center gap-3.5 px-10 py-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-red-500 text-slate-950 font-serif font-extrabold text-base sm:text-lg shadow-[0_0_40px_rgba(245,158,11,0.6)] hover:shadow-[0_0_65px_rgba(245,158,11,0.85)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer overflow-hidden"
          >
            {/* Shimmering Light Sweep */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Key className="w-5 h-5 text-slate-950 group-hover:rotate-90 transition-transform duration-500" />
            <span>20 Dk Ücretsiz Tanışma Seansı Başlat</span>
            <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <p className="text-xs text-amber-200/60 font-sans pt-2">
          Kredi kartı gerekmez · Süresiz ve asla yanmayan ders kredisi garantisi
        </p>
      </div>
    </div>
  )
}
