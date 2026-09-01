'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Terminal } from 'lucide-react'
import type { PersonaType } from '../../PersonaSwitcher'

export function SpatialCta({ persona }: { persona: PersonaType }) {
  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-black/80 via-emerald-950/20 to-black/90 border border-emerald-500/40 p-8 sm:p-14 text-center overflow-hidden shadow-[0_0_60px_rgba(16,185,129,0.2)] font-mono">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-cyan-500/15 rounded-full blur-3xl animate-pulse-glow" />

      <div className="relative z-10 max-w-xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
          SPATIAL LAUNCHPAD // 2026
        </span>
        <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          Geleceğin Bire Bir Eğitim Matrisine Katılın
        </h3>
        <p className="text-sm sm:text-base text-slate-400 font-sans leading-relaxed">
          20 dakikalık ücretsiz tanışma seansı ile sistemi deneyimleyin, hedeflerinize sıfır engelle ulaşın.
        </p>
        <div className="pt-3">
          <Link
            href="/demo-ders"
            className="inline-flex items-center gap-2.5 px-9 py-4 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-bold text-sm sm:text-base shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_45px_rgba(16,185,129,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer font-mono"
          >
            <span>Kuantum Hesabınızı Başlatın</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </Link>
        </div>
        <p className="text-xs text-slate-500 font-sans pt-2">
          Kredi kartı gerekmez · 100% Güvenli 256-bit şifreli altyapı
        </p>
      </div>
    </div>
  )
}
