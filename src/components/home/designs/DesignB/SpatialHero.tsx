'use client'

import Link from 'next/link'
import { ArrowRight, Terminal, Zap, Shield, Sparkles, Orbit, Radio } from 'lucide-react'
import type { PersonaType } from '../../PersonaSwitcher'

interface SpatialHeroProps {
  persona: PersonaType
}

const HERO_CONFIG: Record<
  PersonaType,
  {
    kicker: string
    titleLead: string
    titleGlow: string
    titleEnd: string
    summary: string
    ctaPrimary: { text: string; href: string }
    ctaSecondary: { text: string; href: string }
    telemetry: { label: string; value: string; color: string }[]
    hologramMode: string
  }
> = {
  student: {
    kicker: 'KUANTUM ÖĞRENME PLATFORMU',
    titleLead: 'Geleceğin eğitim alanı:',
    titleGlow: 'Bire bir canlı zekâ,',
    titleEnd: 'sıfır sınır.',
    summary:
      'LGS ve YKS hazırlığında doğrudan hedefe kilitlenen canlı seanslar. Google Meet üzerinden yüksek hızlı interaktif bağlantı, anlık soru analizi ve yapay zekâ destekli koçluk.',
    ctaPrimary: { text: '20 Dk Ücretsiz Kuantum Seansı Başlat', href: '/demo-ders' },
    ctaSecondary: { text: 'Eğitmen Matrisini İncele', href: '/instructors' },
    telemetry: [
      { label: 'CANLI BAĞLANTI', value: 'Google Meet HD', color: 'text-emerald-400' },
      { label: 'KREDİ KASASI', value: 'Süresiz Yanmaz', color: 'text-cyan-400' },
      { label: 'HEDEF SAPMA', value: '%0.00 Hassasiyet', color: 'text-purple-400' },
    ],
    hologramMode: 'ÖĞRENCİ // NEURAL LINK',
  },
  parent: {
    kicker: 'ŞEFFAF GÜVENCE PROTOKOLÜ',
    titleLead: 'Eğitimde mutlak şeffaflık:',
    titleGlow: '%100 doğrulanmış,',
    titleEnd: 'tam denetim.',
    summary:
      'Belgeleri tescilli öğretmenlerle çocuğunuzun her dakikasını tek bir radar konsolundan izleyin. Süresiz kredi garantisi ve seans sonu yazılı analizler.',
    ctaPrimary: { text: 'Veli Radar Konsolunu Aç', href: '/register?role=parent' },
    ctaSecondary: { text: 'Güvenlik Protokolleri', href: '/instructors' },
    telemetry: [
      { label: 'KADRO DENETİMİ', value: '%100 Onaylı', color: 'text-cyan-400' },
      { label: 'KREDİ KORUMA', value: 'Tam Bakiye İade', color: 'text-emerald-400' },
      { label: 'SEANS ANALİZİ', value: 'Anlık Veli Raporu', color: 'text-amber-400' },
    ],
    hologramMode: 'VELİ // GÜVENLİK RADARI',
  },
  instructor: {
    kicker: 'OTONOM EĞİTMEN KOKPİTİ',
    titleLead: 'Kendi yörüngeni çiz:',
    titleGlow: 'Otomatik operasyon,',
    titleEnd: 'doğrudan kazanç.',
    summary:
      'Müsaitlik slotlarınızı işaretleyin; Google Meet davetleri otomatik üretilip takviminize işlensin. Aylık net hakedişleriniz doğrudan banka hesabınıza transfer edilsin.',
    ctaPrimary: { text: 'Eğitmen Kokpitine Katıl', href: '/register?role=instructor' },
    ctaSecondary: { text: 'Sistem Kılavuzu', href: '/dashboard/instructor/nasil-calisir' },
    telemetry: [
      { label: 'MEET OTOMASYONU', value: 'Senkronize', color: 'text-amber-400' },
      { label: 'HAKEDİŞ TRANSFERİ', value: 'Aylık Otomatik IBAN', color: 'text-emerald-400' },
      { label: 'KOMİSYON', value: 'Sıfır Başlangıç Kesintisi', color: 'text-cyan-400' },
    ],
    hologramMode: 'EĞİTMEN // KOKPİT MODÜLÜ',
  },
}

export function SpatialHero({ persona }: SpatialHeroProps) {
  const config = HERO_CONFIG[persona]

  return (
    <div className="relative py-4 sm:py-10">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Futuristic Copy */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Cyber Terminal Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono backdrop-blur-xl">
            <Terminal className="w-3.5 h-3.5 animate-pulse" />
            <span>{config.kicker}</span>
          </div>

          {/* Grand Cyber Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-[3.35rem] font-extrabold text-white tracking-tight leading-[1.12] text-balance font-mono">
            {config.titleLead}{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent underline decoration-cyan-400/40 decoration-wavy decoration-1 underline-offset-8">
              {config.titleGlow}
            </span>{' '}
            {config.titleEnd}
          </h1>

          <p className="text-base sm:text-lg text-slate-400 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
            {config.summary}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
            <Link
              href={config.ctaPrimary.href}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm sm:text-base font-mono shadow-[0_0_30px_rgba(16,185,129,0.35)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{config.ctaPrimary.text}</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href={config.ctaSecondary.href}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-xl bg-white/[0.03] text-slate-300 font-mono font-semibold text-sm border border-white/15 hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer"
            >
              {config.ctaSecondary.text}
            </Link>
          </div>

          {/* Real-time Telemetry Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/[0.08]">
            {config.telemetry.map((stat, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-black/50 border border-white/[0.08] backdrop-blur-xl text-center sm:text-left font-mono"
              >
                <span className="text-[10px] text-slate-500 block uppercase tracking-wider">{stat.label}</span>
                <span className={`text-xs sm:text-sm font-bold ${stat.color} block mt-0.5`}>
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 3D Spatial Hologram Pod */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-sm">
            {/* Pulsing Hologram Glow Sphere */}
            <div className="pointer-events-none absolute -inset-6 bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-purple-500/15 rounded-full blur-3xl opacity-90 animate-pulse-glow" />

            <div className="relative rounded-3xl bg-black/80 border border-emerald-500/30 backdrop-blur-3xl p-6 shadow-[0_0_50px_rgba(16,185,129,0.15)] overflow-hidden space-y-4">
              {/* Top Cockpit Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 font-mono text-xs">
                <span className="inline-flex items-center gap-1.5 text-emerald-400">
                  <Orbit className="w-4 h-4 animate-spin text-emerald-400" style={{ animationDuration: '10s' }} />
                  <span className="font-bold tracking-wider">{config.hologramMode}</span>
                </span>
                <span className="text-[11px] text-slate-500">HOLOGRAM ACTIVE</span>
              </div>

              {/* 3D Fox Mascot with Holographic Scanner Frame */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-emerald-950/40 via-slate-950 to-cyan-950/40 border border-white/15 p-3 aspect-square flex items-center justify-center">
                {/* Horizontal Laser Scanning Line */}
                <div
                  className="pointer-events-none absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#06b6d4] opacity-80 animate-bounce"
                  style={{ animationDuration: '3s' }}
                />

                <img
                  src="/luxury-fox-mascot.jpg"
                  alt="DersoLab Spatial Mascot"
                  className="w-full h-full object-cover rounded-xl shadow-2xl animate-float-slow"
                />
              </div>

              {/* Audio / Laser Waveform Visualizer */}
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between font-mono text-xs">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                  <span className="text-slate-300 text-[11px]">Meet Frekansı: Senkron</span>
                </div>
                {/* Visual equalizer bars */}
                <div className="flex items-end gap-1 h-4">
                  <span className="w-1 bg-emerald-400 rounded-full h-2 animate-pulse" />
                  <span className="w-1 bg-cyan-400 rounded-full h-4 animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1 bg-emerald-400 rounded-full h-3 animate-pulse" style={{ animationDelay: '0.4s' }} />
                  <span className="w-1 bg-purple-400 rounded-full h-4 animate-pulse" style={{ animationDelay: '0.1s' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
