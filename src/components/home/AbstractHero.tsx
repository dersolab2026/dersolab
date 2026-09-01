'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Check, Video, ShieldCheck, Calendar } from 'lucide-react'
import type { PersonaType } from './PersonaSwitcher'

interface AbstractHeroProps {
  persona: PersonaType
}

const HERO_DATA: Record<
  PersonaType,
  {
    tag: string
    titleLead: string
    titleAccent: string
    titleEnd: string
    description: string
    primaryCta: { text: string; href: string }
    secondaryCta: { text: string; href: string }
    mascotQuote: string
    mascotBadge: string
    features: { label: string; sub: string }[]
  }
> = {
  student: {
    tag: 'Bire Bir Online Eğitim',
    titleLead: 'Bire bir canlı öğrenme alanı.',
    titleAccent: 'Hedefe doğrudan,',
    titleEnd: 'eksiksiz ve kişisel.',
    description:
      'LGS, YKS ve okul derslerinde takıldığın her konuyu Google Meet üzerinden canlı seanslarla çöz. Bireysel koçluk ve dijital ödev takibiyle zaman kaybetme.',
    primaryCta: { text: '20 Dk Ücretsiz Tanışma Paketi Al', href: '/demo-ders' },
    secondaryCta: { text: 'Eğitmenleri Keşfet', href: '/instructors' },
    mascotQuote: '20 Dk Ücretsiz Tanışma Paketin Hazır!',
    mascotBadge: 'Öğrenci Asistanı',
    features: [
      { label: 'Google Meet HD', sub: 'Anında canlı bağlantı' },
      { label: 'Yanmayan Kredi', sub: 'Süresiz geçerli bakiye' },
      { label: 'Koçluk Desteği', sub: 'Kişisel gelişim planı' },
    ],
  },
  parent: {
    tag: 'Şeffaf ve Güvenli Süreç',
    titleLead: 'Eğitimde sıfır belirsizlik.',
    titleAccent: 'Tam kontrol ve',
    titleEnd: 'kesintisiz güven.',
    description:
      'Yetkinliği onaylanmış öğretmenlerle çocuğunuzun gelişimini tek bir veli panelinden izleyin. Ders raporları, ödevler ve asla yanmayan kredi güvencesi.',
    primaryCta: { text: 'Veli Hesabı Oluştur', href: '/register?role=parent' },
    secondaryCta: { text: 'Platformu İncele', href: '/instructors' },
    mascotQuote: 'Tüm Öğretmenler Belgeli ve Onaylı',
    mascotBadge: 'Veli Güvencesi',
    features: [
      { label: '%100 Doğrulanmış Kadro', sub: 'Belgeleri onaylı öğretmenler' },
      { label: 'Yazılı Ders Raporu', sub: 'Her seans sonu bildirim' },
      { label: 'Güvenli Bütçe', sub: 'Taahhütsüz esnek krediler' },
    ],
  },
  instructor: {
    tag: 'Eğitmenler İçin Akıllı Platform',
    titleLead: 'Özgür çalışma modeli.',
    titleAccent: 'Sıfır operasyon yükü,',
    titleEnd: 'düzenli hakediş.',
    description:
      'Müsaitlik takviminizi belirleyin; Google Meet davetiyeleri otomatik oluşturulsun. Tamamlanan derslerinizin hakedişleri her ay doğrudan banka hesabınıza aktarılsın.',
    primaryCta: { text: 'Eğitmen Başvurusu Yap', href: '/register?role=instructor' },
    secondaryCta: { text: 'Nasıl Çalışır?', href: '/dashboard/instructor/nasil-calisir' },
    mascotQuote: 'Otomatik Takvim ve Meet Entegrasyonu',
    mascotBadge: 'Eğitmen Asistanı',
    features: [
      { label: 'Otomatik Takvim', sub: 'Google Meet & Calendar eşitlemesi' },
      { label: 'Aylık Düzenli IBAN', sub: 'Gecikmesiz net hakediş' },
      { label: 'Esnek Program', sub: 'Kendi saatlerini sen belirle' },
    ],
  },
}

export function AbstractHero({ persona }: AbstractHeroProps) {
  const data = HERO_DATA[persona]

  return (
    <div className="relative py-4 sm:py-8">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/[0.08] rounded-full blur-[140px] animate-pulse-glow" />

      <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Typography & CTAs */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-xs font-medium text-slate-300 backdrop-blur-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{data.tag}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white tracking-tight leading-[1.12]">
            {data.titleLead}{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-white bg-clip-text text-transparent">
              {data.titleAccent}
            </span>{' '}
            {data.titleEnd}
          </h1>

          <p className="text-base sm:text-lg text-slate-400 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
            {data.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            <Link
              href={data.primaryCta.href}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-slate-950 font-semibold text-sm sm:text-base shadow-xl shadow-white/10 hover:bg-slate-100 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>{data.primaryCta.text}</span>
              <ArrowRight className="w-4 h-4 text-emerald-800" />
            </Link>
            <Link
              href={data.secondaryCta.href}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white/[0.04] text-slate-300 font-semibold text-sm sm:text-base border border-white/10 hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer"
            >
              {data.secondaryCta.text}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-white/[0.08]">
            {data.features.map((f, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl text-center sm:text-left"
              >
                <span className="block font-bold text-xs sm:text-sm text-white tracking-tight">{f.label}</span>
                <span className="block text-[11px] text-slate-400 mt-0.5">{f.sub}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: 3D Luxury Animated Mascot Card */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-sm">
            {/* Ambient Background Aura */}
            <div className="pointer-events-none absolute -inset-4 bg-gradient-to-tr from-emerald-500/20 via-teal-500/15 to-amber-500/10 rounded-3xl blur-2xl opacity-80" />

            <div className="relative rounded-3xl bg-slate-950/70 border border-white/10 backdrop-blur-2xl p-6 shadow-2xl overflow-hidden group">
              {/* Top Mascot Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold">
                  <Sparkles className="w-3 h-3" />
                  <span>{data.mascotBadge}</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">DersoLab 3D</span>
              </div>

              {/* 3D Mascot Image with subtle float */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900/60 border border-white/10 aspect-square flex items-center justify-center p-2">
                <img
                  src="/luxury-fox-mascot.jpg"
                  alt="DersoLab Maskotu"
                  className="w-full h-full object-cover rounded-xl transition-transform duration-700 ease-out group-hover:scale-105 animate-float-slow"
                />
              </div>

              {/* Dynamic Role Quote Banner */}
              <div className="mt-4 p-3 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-md flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                <p className="text-xs font-semibold text-slate-200 leading-snug">
                  {data.mascotQuote}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
