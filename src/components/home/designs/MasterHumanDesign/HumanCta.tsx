'use client'

import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import type { PersonaType } from '../../PersonaSwitcher'

export function HumanCta({ persona }: { persona: PersonaType }) {
  return (
    <div className="my-12 rounded-3xl bg-slate-950 text-white p-8 sm:p-14 text-center space-y-6 shadow-xl">
      <div className="max-w-xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
          Hemen Tanışın
        </span>
        <h3 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
          20 Dakikalık Ücretsiz Tanışma Dersiyle Başlayın
        </h3>
        <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
          Hedeflerinizi anlatın, öğretmeninizle tanışın ve DersoLab'ın 1:1 eğitim konforunu bizzat test edin.
        </p>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
        <Link
          href="/demo-ders"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm sm:text-base shadow-md transition-all cursor-pointer"
        >
          <span>Ücretsiz Tanışma Seansını Al</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/instructors"
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm sm:text-base transition-all cursor-pointer"
        >
          Eğitmenleri İncele
        </Link>
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Kredi kartı gerekmez
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Taahhüt yok
        </span>
        <span className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Yanmayan ders kredisi
        </span>
      </div>
    </div>
  )
}
