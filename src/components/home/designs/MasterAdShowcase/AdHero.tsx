'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle2,
  Clock,
  Video,
  Award,
  Flame,
  Zap,
} from 'lucide-react'

export function AdHero() {
  const [examType, setExamType] = useState<'yks' | 'lgs' | 'school'>('yks')
  const [targetNet, setTargetNet] = useState(32)

  return (
    <div className="relative py-10 sm:py-16 overflow-hidden text-center lg:text-left">
      {/* Background Mesh Glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-indigo-500/15 rounded-full blur-[140px] animate-pulse-glow" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Headline & Main Offer */}
        <div className="lg:col-span-7 space-y-6">
          {/* Glamour Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-purple-500/15 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-wide backdrop-blur-xl shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>TÜRKİYE'NİN EN SEÇKİN 1:1 ÖZEL DERS PLATFORMU</span>
          </div>

          {/* Grand Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-white tracking-tight leading-[1.12] text-balance font-serif">
            Geleceğin Derece Öğrencileri,{' '}
            <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-amber-500 bg-clip-text text-transparent italic underline decoration-amber-400/40 decoration-wavy decoration-2 underline-offset-8">
              Uzman Öğretmenlerle
            </span>{' '}
            1:1 Canlı Seanslarda.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-xl mx-auto lg:mx-0 font-sans">
            LGS ve YKS hazırlığında kalabalık sınıflarda kaybolmayın. Google Meet üzerinden bire bir canlı derslerle
            takıldığınız her soruyu çözün; süresi asla bitmeyen ders kredileriyle hedefinize ulaşın.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
            <Link
              href="/demo-ders"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-9 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 text-slate-950 font-bold text-sm sm:text-base shadow-[0_0_35px_rgba(245,158,11,0.4)] hover:shadow-[0_0_50px_rgba(245,158,11,0.7)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Zap className="w-4 h-4 text-slate-950 fill-current" />
              <span>20 Dk Ücretsiz Tanışma Dersi Al</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/instructors"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-2xl bg-white/[0.07] hover:bg-white/[0.12] text-slate-200 font-semibold text-sm sm:text-base border border-white/15 transition-all cursor-pointer backdrop-blur-xl"
            >
              Eğitmen Kadrosunu İncele
            </Link>
          </div>

          {/* Social Proof Trust Bar */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
              <div className="flex items-center gap-1 text-amber-400 text-xs font-bold mb-0.5">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>4.9 / 5.0</span>
              </div>
              <span className="text-[11px] text-slate-400">Veli & Öğrenci Memnuniyeti</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>%100 Onaylı</span>
              </div>
              <span className="text-[11px] text-slate-400">Diplomalı Öğretmenler</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
              <div className="flex items-center gap-1 text-blue-400 text-xs font-bold mb-0.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Süresiz</span>
              </div>
              <span className="text-[11px] text-slate-400">Yanmayan Kredi Güvencesi</span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
              <div className="flex items-center gap-1 text-rose-400 text-xs font-bold mb-0.5">
                <Video className="w-3.5 h-3.5" />
                <span>Google Meet</span>
              </div>
              <span className="text-[11px] text-slate-400">Kesintisiz Canlı Seans</span>
            </div>
          </div>
        </div>

        {/* Right Billboard Card: Live Interactive Target Net Calculator */}
        <div className="lg:col-span-5">
          <div className="relative rounded-3xl bg-gradient-to-b from-slate-900/90 via-black to-slate-950 border-2 border-amber-500/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.2)] backdrop-blur-3xl space-y-6">
            {/* Top Glow Ribbon */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-amber-300 font-mono tracking-wider">
                  CANLI HEDEF SİMÜLATÖRÜ
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">1:1 ÖZEL DERS</span>
            </div>

            {/* Exam Selector */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-slate-300 text-left block">
                Hedeflediğiniz Sınav:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'yks', label: 'YKS (TYT/AYT)' },
                  { id: 'lgs', label: 'LGS Hazırlık' },
                  { id: 'school', label: 'Okula Destek' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setExamType(item.id as any)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      examType === item.id
                        ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 shadow-md scale-[1.02]'
                        : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.1] border border-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Net Slider */}
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold">Hedef Net Seviyeniz:</span>
                <span className="text-amber-400 font-mono font-bold text-sm">
                  {targetNet} Net / 40 Soru
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={40}
                value={targetNet}
                onChange={(e) => setTargetNet(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>15 Net (Temel)</span>
                <span>30 Net (İyi)</span>
                <span>40 Net (Tam Puan / Derece)</span>
              </div>
            </div>

            {/* Projected Success Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-500/30 space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-200 font-semibold">Önerilen Bire Bir Program:</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  Haftada 2 Seans
                </span>
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                DersoLab eğitmenleriyle bire bir soru çözümünde ortalama net artışı: <strong className="text-white">+{Math.round((targetNet - 15) * 0.7)} Net</strong>
              </p>
            </div>

            {/* Direct Billboard CTA */}
            <Link
              href="/demo-ders"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs shadow-lg transition-all"
            >
              <span>İlk 20 Dakikalık Seansı Ücretsiz Başlat</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
