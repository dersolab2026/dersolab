'use client'

import { useState } from 'react'
import { Hourglass, Sparkles, Clock, Key, ShieldCheck, ArrowRight, Flame } from 'lucide-react'
import Link from 'next/link'

export function SurrealMeltingClock() {
  const [warpLevel, setWarpLevel] = useState(65)

  // Calculate surreal distortion parameters
  const clockSkew = (warpLevel - 50) * 0.45
  const meltingDripHeight = warpLevel * 0.9

  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-red-950/40 via-black/85 to-black/95 border-2 border-amber-500/40 p-6 sm:p-10 lg:p-12 overflow-hidden shadow-[0_0_70px_rgba(245,158,11,0.2)] backdrop-blur-3xl">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl animate-pulse-glow" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 bg-red-600/15 rounded-full blur-3xl animate-pulse-glow" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-6 space-y-4 text-center lg:text-left font-serif">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
            <span>DALÍ ZAMAN BÜKÜCÜ // CANLI İNTERAKTİF SİMÜLASYON</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Zamanı Bükün: Ders Kredileri Asla Yanmaz
          </h3>

          <p className="text-sm sm:text-base text-slate-300 font-sans font-light leading-relaxed">
            Geleneksel eğitim kurumlarındaki "kullanmadığın ay yanan bakiye" illüzyonuna son. DersoLab'da aldığınız her
            ders kredisi zamana meydan okur; dilediğiniz gün, dilediğiniz saatte kullanılmak üzere sonsuza dek korunur.
          </p>

          <div className="pt-2">
            <Link
              href="/demo-ders"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-red-600 text-slate-950 font-serif font-bold text-sm shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>20 Dk Ücretsiz Hoş Geldin Seansını Al</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Interactive Melting Clock Canvas Card */}
        <div className="lg:col-span-6">
          <div className="rounded-2xl bg-black/85 border-2 border-amber-500/50 p-6 sm:p-8 shadow-[0_0_40px_rgba(0,0,0,0.8)] space-y-6">
            {/* Slider Control */}
            <div>
              <div className="flex justify-between items-center mb-2 font-serif text-xs sm:text-sm">
                <span className="text-amber-200">Zaman Bükülme Seviyesi:</span>
                <span className="text-amber-400 font-mono font-bold tracking-wider">
                  %{warpLevel} (Süresiz Bakiye)
                </span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={warpLevel}
                onChange={(e) => setWarpLevel(Number(e.target.value))}
                className="w-full h-2.5 bg-red-950/90 rounded-lg appearance-none cursor-pointer accent-amber-400 shadow-inner"
              />
              <div className="flex justify-between text-[10px] text-amber-500/80 font-serif mt-1.5">
                <span>Durgun Zaman</span>
                <span>Bükülmüş Dalí Boyutu</span>
                <span>Sonsuz Bakiye ✦</span>
              </div>
            </div>

            {/* Visual Melting Clock Graphic with Real-time Dripping Molten Droplets */}
            <div
              className="relative p-8 rounded-2xl bg-gradient-to-b from-red-950/60 via-black to-black border border-amber-500/40 flex flex-col items-center justify-center transition-all duration-300 overflow-hidden"
              style={{
                transform: `skewY(${clockSkew}deg)`,
              }}
            >
              {/* Pulsing Light Glow Behind Clock */}
              <div className="absolute w-36 h-36 bg-amber-500/20 rounded-full blur-2xl animate-pulse-glow pointer-events-none" />

              <div className="relative w-32 h-32 rounded-full border-4 border-amber-400 bg-black/80 flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.6)]">
                {/* Real-time Molten Dripping Drips */}
                <div
                  className="absolute -bottom-8 w-10 bg-gradient-to-b from-amber-400 via-amber-500 to-red-500 rounded-b-full opacity-90 animate-drip shadow-[0_0_15px_rgba(245,158,11,0.8)]"
                  style={{ height: `${meltingDripHeight * 0.45}px` }}
                />
                <div
                  className="absolute -bottom-12 w-3.5 h-3.5 bg-amber-400 rounded-full animate-ping opacity-75"
                  style={{ animationDuration: '3s' }}
                />

                {/* Roman Numerals */}
                <span className="absolute top-1.5 font-serif text-xs font-bold text-amber-300 animate-lynch-flicker">
                  XII
                </span>
                <span className="absolute right-2.5 font-serif text-xs font-bold text-amber-300">III</span>
                <span className="absolute bottom-1.5 font-serif text-xs font-bold text-amber-300">VI</span>
                <span className="absolute left-2.5 font-serif text-xs font-bold text-amber-300">IX</span>

                {/* Clock Hands Rotating with Reverse Surreal Distortion */}
                <div
                  className="w-1.5 h-10 bg-gradient-to-t from-amber-400 to-white rounded-full origin-bottom"
                  style={{ transform: `rotate(${warpLevel * 3.6}deg)` }}
                />
                <div
                  className="w-1 h-7 bg-red-400 rounded-full origin-bottom"
                  style={{ transform: `rotate(${-warpLevel * 2.4}deg)` }}
                />

                {/* Center Pin */}
                <div className="absolute w-3 h-3 bg-amber-300 rounded-full border-2 border-black" />
              </div>

              {/* Swinging Surreal Pendulum Under Clock */}
              <div className="mt-8 relative flex flex-col items-center animate-pendulum">
                <div className="w-0.5 h-12 bg-amber-500/70" />
                <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 border border-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.8)]" />
              </div>

              <span className="text-xs font-serif text-amber-200 mt-3 tracking-widest text-center animate-lynch-flicker">
                ✦ DERSOLAB: ZAMAN BİRİKİR, ASLA TÜKENMEZ ✦
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
