'use client'

import { useState } from 'react'
import { Video, Calendar, ShieldCheck, Coins, Sparkles, Check, ArrowRight } from 'lucide-react'
import type { PersonaType } from './PersonaSwitcher'

export function AbstractMotionShowcase({ persona }: { persona: PersonaType }) {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      id: 0,
      title: 'Akıllı Eşleşme & Takvim',
      desc: 'İhtiyacınız olan branşı seçin, uygun tarih ve saat aralığını tek tıkla belirleyin.',
      icon: Calendar,
      tag: '01 / Planlama',
      accent: 'from-emerald-500/20 to-teal-500/5',
      indicator: 'Müsaitlik Doğrulandı',
    },
    {
      id: 1,
      title: 'Otomatik Google Meet Odası',
      desc: 'Rezervasyon anında Google Meet bağlantınız üretilir, takviminize ve e-postanıza işlenir.',
      icon: Video,
      tag: '02 / Bağlantı',
      accent: 'from-teal-500/20 to-sky-500/5',
      indicator: 'HD Canlı Oda Hazır',
    },
    {
      id: 2,
      title: 'Süresiz Bakiye & Gelişim Takibi',
      desc: 'Ders kredileriniz asla yanmaz. Seans sonrasında notlar ve çalışma raporları panelinize kaydedilir.',
      icon: Coins,
      tag: '03 / Güvence',
      accent: 'from-amber-500/20 to-emerald-500/5',
      indicator: 'Kredi Bakiyesi Güvencede',
    },
  ]

  const current = steps[activeStep]
  const CurrentIcon = current.icon

  return (
    <div className="relative rounded-3xl bg-slate-900/60 backdrop-blur-2xl border border-white/10 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
      {/* Animated Ambient background blur */}
      <div className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none absolute -left-20 -bottom-20 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse-glow" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Interactive Step Selector */}
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-emerald-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kusursuz Dijital Altyapı</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Karmaşık Süreçler Yok. Yalnızca Öğrenme Odaklı.
          </h2>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Link gönderme, takvim çakışmaları ve kaybolan ders saatleri geride kaldı. DersoLab mimarisi tüm teknik
            operasyonu arka planda otomatik yönetir.
          </p>

          {/* Step Pill Buttons */}
          <div className="space-y-2.5 pt-3">
            {steps.map((step) => {
              const isSelected = activeStep === step.id
              const StepIcon = step.icon

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStep(step.id)}
                  className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left ${
                    isSelected
                      ? 'bg-white/[0.08] border-white/20 shadow-lg shadow-black/20 translate-x-1'
                      : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] text-slate-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/[0.04] text-slate-500'
                      }`}
                    >
                      <StepIcon className="w-4 h-4" />
                    </div>
                    <div>
                      <span
                        className={`block font-bold text-sm leading-tight ${
                          isSelected ? 'text-white' : 'text-slate-300'
                        }`}
                      >
                        {step.title}
                      </span>
                      <span className="text-[11px] text-slate-500">{step.tag}</span>
                    </div>
                  </div>

                  <span
                    className={`text-xs font-mono transition-opacity ${
                      isSelected ? 'text-emerald-400 opacity-100' : 'opacity-0'
                    }`}
                  >
                    Aktif ↗
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right: Abstract Animated Dynamic Node Canvas */}
        <div className="lg:col-span-6 relative">
          <div className="relative rounded-2xl bg-slate-950/80 border border-white/10 p-6 sm:p-8 aspect-[4/3] flex flex-col justify-between overflow-hidden shadow-2xl">
            {/* Ambient inner glow */}
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${current.accent} opacity-60 transition-all duration-500`} />

            {/* Header of node visual */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.06] text-xs font-mono text-slate-300 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {current.indicator}
              </span>
              <span className="text-xs font-mono text-slate-500">DersoLab Core v2.4</span>
            </div>

            {/* Center Animated Icon Glyph */}
            <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center space-y-3 py-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-white/[0.08] border border-white/15 backdrop-blur-xl flex items-center justify-center text-white shadow-2xl animate-float-slow">
                <CurrentIcon className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
              </div>
              <h4 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                {current.title}
              </h4>
              <p className="text-xs sm:text-sm text-slate-400 max-w-sm leading-relaxed">
                {current.desc}
              </p>
            </div>

            {/* Bottom Status Bar */}
            <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-white/[0.08]">
              <span className="flex items-center gap-1.5 font-medium text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Otomatik Senkronizasyon
              </span>
              <span className="font-mono text-[11px] text-slate-500">SSL 256-Bit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
