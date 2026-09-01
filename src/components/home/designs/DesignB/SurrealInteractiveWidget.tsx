'use client'

import { useState } from 'react'
import { Sparkles, ArrowRight, ShieldCheck, Eye, Lock, Orbit, Compass, Zap, Key } from 'lucide-react'
import Link from 'next/link'
import type { PersonaType } from '../../PersonaSwitcher'

export function SurrealInteractiveWidget({ persona }: { persona: PersonaType }) {
  // Student state
  const [warpLevel, setWarpLevel] = useState(65)
  // Parent state
  const [clarityLevel, setClarityLevel] = useState(85)
  // Instructor state
  const [weeklyHours, setWeeklyHours] = useState(14)

  if (persona === 'student') {
    const clockSkew = (warpLevel - 50) * 0.45
    const meltingDripHeight = warpLevel * 0.9

    return (
      <div className="relative rounded-3xl bg-gradient-to-b from-red-950/40 via-black/85 to-black/95 border-2 border-amber-500/40 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-[0_0_70px_rgba(245,158,11,0.2)] backdrop-blur-3xl">
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl animate-pulse-glow" />

        <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center font-serif">
          <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
              <span>DALÍ ZAMAN BÜKÜCÜ // ÖĞRENCİ MATRİXİ</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Zamanı Bükün: Krediler Asla Yanmaz
            </h3>

            <p className="text-sm sm:text-base text-slate-300 font-sans font-light leading-relaxed">
              Zaman akıp giden bir kum tanesi değildir. Aldığınız ders kredileri hesabınızda dondurulur; dilediğiniz gün
              ve saatte, sınav hedefinize ulaşana dek korunur.
            </p>

            <div className="pt-2">
              <Link
                href="/demo-ders"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 text-slate-950 font-serif font-bold text-sm shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.7)] transition-all"
              >
                <span>20 Dk Ücretsiz Hoş Geldin Seansını Al</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-black/85 border-2 border-amber-500/50 p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2 text-xs sm:text-sm">
                  <span className="text-amber-200">Zaman Bükülme Seviyesi:</span>
                  <span className="text-amber-400 font-mono font-bold">%{warpLevel} (Süresiz Bakiye)</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={warpLevel}
                  onChange={(e) => setWarpLevel(Number(e.target.value))}
                  className="w-full h-2.5 bg-red-950/90 rounded-lg appearance-none cursor-pointer accent-amber-400"
                />
              </div>

              <div
                className="relative p-8 rounded-2xl bg-gradient-to-b from-red-950/60 via-black to-black border border-amber-500/40 flex flex-col items-center justify-center transition-all duration-300"
                style={{ transform: `skewY(${clockSkew}deg)` }}
              >
                <div className="relative w-32 h-32 rounded-full border-4 border-amber-400 bg-black/80 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.6)]">
                  <div
                    className="absolute -bottom-8 w-10 bg-gradient-to-b from-amber-400 via-amber-500 to-red-500 rounded-b-full opacity-90 animate-drip"
                    style={{ height: `${meltingDripHeight * 0.45}px` }}
                  />
                  <span className="absolute top-1.5 font-serif text-xs font-bold text-amber-300">XII</span>
                  <span className="absolute right-2.5 font-serif text-xs font-bold text-amber-300">III</span>
                  <span className="absolute bottom-1.5 font-serif text-xs font-bold text-amber-300">VI</span>
                  <span className="absolute left-2.5 font-serif text-xs font-bold text-amber-300">IX</span>
                  <div
                    className="w-1.5 h-10 bg-gradient-to-t from-amber-400 to-white rounded-full origin-bottom"
                    style={{ transform: `rotate(${warpLevel * 3.6}deg)` }}
                  />
                  <div
                    className="w-1 h-7 bg-red-400 rounded-full origin-bottom"
                    style={{ transform: `rotate(${-warpLevel * 2.4}deg)` }}
                  />
                </div>

                <div className="mt-8 relative flex flex-col items-center animate-pendulum">
                  <div className="w-0.5 h-10 bg-amber-500/70" />
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 border border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (persona === 'parent') {
    return (
      <div className="relative rounded-3xl bg-gradient-to-b from-emerald-950/30 via-black/85 to-black/95 border-2 border-emerald-500/40 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-[0_0_70px_rgba(16,185,129,0.2)] backdrop-blur-3xl">
        <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl animate-pulse-glow" />

        <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center font-serif">
          <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs tracking-widest uppercase">
              <Eye className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>HAKİKAT AYNASI // VELİ KALKANI</span>
            </div>

            <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Sıfır Sis: Hakikat Aynasında Tam Şeffaflık
            </h3>

            <p className="text-sm sm:text-base text-slate-300 font-sans font-light leading-relaxed">
              Özel derste soru işaretlerine yer yok. Şeffaflık kalkanını etkinleştirin; onaylı öğretmen belgelerinden
              yazılı ders sonu raporlarına kadar her gerçeği anında görün.
            </p>

            <div className="pt-2">
              <Link
                href="/register?role=parent"
                className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-serif font-bold text-sm shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_50px_rgba(16,185,129,0.7)] transition-all"
              >
                <span>Veli Hakikat Portalını Aç</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-2xl bg-black/85 border-2 border-emerald-500/50 p-6 sm:p-8 shadow-2xl space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2 text-xs sm:text-sm">
                  <span className="text-emerald-200">Şeffaflık & Netlik Oranı:</span>
                  <span className="text-emerald-400 font-mono font-bold">%{clarityLevel} (Kusursuz Denetim)</span>
                </div>
                <input
                  type="range"
                  min={30}
                  max={100}
                  value={clarityLevel}
                  onChange={(e) => setClarityLevel(Number(e.target.value))}
                  className="w-full h-2.5 bg-emerald-950/90 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                />
              </div>

              {/* Crystal Veritas Shield Simulation */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-emerald-950/40 to-black border border-emerald-500/40 space-y-3 font-sans text-xs">
                <div className="p-3.5 rounded-xl bg-black/60 border border-emerald-500/30 flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Öğretmen Belge & Kimlik Tescili:</span>
                  <span className="text-emerald-400 font-bold font-mono">%100 ONAYLI</span>
                </div>
                <div className="p-3.5 rounded-xl bg-black/60 border border-emerald-500/30 flex items-center justify-between">
                  <span className="text-slate-300 font-medium">Seans Sonu Yazılı Katılım Raporu:</span>
                  <span className="text-emerald-400 font-bold font-mono">HER DERSTE AKTİF</span>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between">
                  <span className="text-emerald-200 font-medium">Bakiye Güvencesi:</span>
                  <span className="text-emerald-300 font-bold font-mono">ASLA YANMAZ ✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Instructor
  const instructorIncome = weeklyHours * 4 * 750

  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-purple-950/30 via-black/85 to-black/95 border-2 border-purple-500/40 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-[0_0_70px_rgba(168,85,247,0.2)] backdrop-blur-3xl">
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl animate-pulse-glow" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center font-serif">
        <div className="lg:col-span-6 space-y-4 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs tracking-widest uppercase">
            <Orbit className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '14s' }} />
            <span>KOZMİK SAHNE // EĞİTMEN ÇARKI</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Kendi Evreninin Egemen Efendisi Ol
          </h3>

          <p className="text-sm sm:text-base text-slate-300 font-sans font-light leading-relaxed">
            Haftalık kaç saat ders vermek istediğinizi seçin. Göksel çarklar döner, Google Meet toplantı odalarınız
            otomatik açılır ve hakedişleriniz doğrudan banka hesabınıza aktarılır.
          </p>

          <div className="pt-2">
            <Link
              href="/register?role=instructor"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 via-amber-500 to-amber-600 text-slate-950 font-serif font-bold text-sm shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.7)] transition-all"
            >
              <span>Eğitmen Sahnesine Katıl</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="rounded-2xl bg-black/85 border-2 border-purple-500/50 p-6 sm:p-8 shadow-2xl space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2 text-xs sm:text-sm">
                <span className="text-purple-200">Haftalık Müsaitlik:</span>
                <span className="text-amber-400 font-mono font-bold">{weeklyHours} Saat / Hafta</span>
              </div>
              <input
                type="range"
                min={4}
                max={30}
                step={2}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full h-2.5 bg-purple-950/90 rounded-lg appearance-none cursor-pointer accent-purple-400"
              />
            </div>

            {/* Cosmic Earnings Calculator */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-purple-950/40 to-black border border-purple-500/40 flex items-center justify-between font-mono">
              <div>
                <span className="text-slate-400 text-xs block font-sans">Aylık Tahmini Net Hakediş:</span>
                <span className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                  ~{instructorIncome.toLocaleString('tr-TR')} ₺
                </span>
              </div>
              <span className="text-xs font-bold text-purple-300 bg-purple-950/80 px-3 py-1.5 rounded-lg border border-purple-500/40">
                Aylık IBAN Transferi
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
