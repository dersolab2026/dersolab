'use client'

import Link from 'next/link'
import { Sparkles, ArrowRight, Zap, CheckCircle2 } from 'lucide-react'

export function AdFinalGrandCta() {
  return (
    <div className="my-14 relative rounded-3xl bg-gradient-to-r from-amber-500 via-rose-600 to-purple-700 p-1 shadow-[0_0_80px_rgba(245,158,11,0.3)]">
      <div className="rounded-[22px] bg-slate-950/95 p-8 sm:p-14 text-center space-y-6 backdrop-blur-2xl">
        <div className="max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold font-mono tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>SIFIR RİSKLİ BAŞLANGIÇ</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight font-serif">
            60 Saniyede İlk Ücretsiz Tanışma Seansınızı Ayarlayın
          </h3>

          <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed">
            Hedeflerinizi paylaşın, öğretmeninizle tanışın ve DersoLab'ın 1:1 canlı özel ders ayrıcalığını bizzat
            deneyimleyin.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/demo-ders"
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 text-slate-950 font-extrabold text-base shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:shadow-[0_0_50px_rgba(245,158,11,0.8)] hover:scale-105 transition-all cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Zap className="w-5 h-5 text-slate-950 fill-current" />
            <span>20 Dk Ücretsiz Tanışma Dersi Al</span>
            <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="pt-3 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Kredi kartı gerekmez
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Taahhüt & Sözleşme yok
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Süresiz geçerli ders kredisi
          </span>
        </div>
      </div>
    </div>
  )
}
