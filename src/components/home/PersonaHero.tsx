'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, ShieldCheck, Check, Play, Star } from 'lucide-react'
import type { PersonaType } from './PersonaSwitcher'

interface PersonaHeroProps {
  persona: PersonaType
}

const HERO_CONTENT: Record<
  PersonaType,
  {
    badge: string
    titlePrefix: string
    titleAccent: string
    titleSuffix: string
    subtitle: string
    primaryCta: { text: string; href: string }
    secondaryCta: { text: string; href: string }
    stats: { value: string; label: string }[]
    highlights: string[]
  }
> = {
  student: {
    badge: 'Kişiselleştirilmiş Bire Bir Eğitim',
    titlePrefix: 'Hedefindeki Başarıya',
    titleAccent: 'Uzman Eğitmenlerle',
    titleSuffix: 'Bire Bir Ulaş.',
    subtitle:
      'LGS, YKS ve okul derslerinde takıldığın her konuyu Türkiye’nin seçkin eğitmenleriyle canlı çöz. Bireysel koçluk ve haftalık net takip sistemiyle temposunu kaybetme.',
    primaryCta: { text: '20 Dk Ücretsiz Tanışma Dersi Al', href: '/demo-ders' },
    secondaryCta: { text: 'Eğitmenleri Keşfet', href: '/instructors' },
    stats: [
      { value: '%100', label: 'Bire Bir Canlı' },
      { value: '20 Dk', label: 'Ücretsiz Tanışma' },
      { value: '4.9/5', label: 'Öğrenci Memnuniyeti' },
    ],
    highlights: ['Kart bilgisi gerekmez', 'Google Meet ile anında erişim', 'Yanmayan ders kredisi'],
  },
  parent: {
    badge: 'Şeffaf ve Güvenli Veli Deneyimi',
    titlePrefix: 'Çocuğunuzun Eğitimini',
    titleAccent: 'Tam Şeffaflıkla',
    titleSuffix: 'Güvenle Takip Edin.',
    subtitle:
      'Yalnızca belgeleri ve yetkinliği doğrulanmış seçkin öğretmenler. Çocuğunuzun ders devamlılığını, öğretmen geri bildirimlerini ve sınav netlerini tek bir veli panelinden anlık izleyin.',
    primaryCta: { text: 'Veli Hesabı Oluşturun', href: '/register?role=parent' },
    secondaryCta: { text: 'Eğitmen Kadromuzu İnceleyin', href: '/instructors' },
    stats: [
      { value: '%100', label: 'Doğrulanmış Kadro' },
      { value: '0 Sürpriz', label: 'Şeffaf Süreç' },
      { value: 'Süresiz', label: 'Geçerli Kredi' },
    ],
    highlights: ['Yazılı ders sonu raporları', 'Krediler asla yanmaz', 'Doğrudan öğretmen iletişimi'],
  },
  instructor: {
    badge: 'Eğitmenler İçin Akıllı Platform',
    titlePrefix: 'Kendi Saatlerinde Ders Ver,',
    titleAccent: 'Seçkin Öğrencilere',
    titleSuffix: 'Doğrudan Ulaş.',
    subtitle:
      'Müsaitlik takviminizi belirleyin, dersler otomatik Google Meet ve Google Takviminize bağlansın. Ödev araçları, koçluk modülü ve düzenli IBAN ödemeleri tek platformda.',
    primaryCta: { text: 'Eğitmen Başvurusu Yap', href: '/register?role=instructor' },
    secondaryCta: { text: 'Nasıl Çalışır?', href: '/dashboard/instructor/nasil-calisir' },
    stats: [
      { value: 'Otomatik', label: 'Meet & Takvim' },
      { value: 'Aylık', label: 'Düzenli IBAN Ödemesi' },
      { value: '%0', label: 'Başlangıç Kesintisi' },
    ],
    highlights: ['Esnek çalışma saatleri', 'Dilediğinde profili dondurma', 'Hazır dijital ders araçları'],
  },
}

export function PersonaHero({ persona }: PersonaHeroProps) {
  const content = HERO_CONTENT[persona]

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-white/95 via-white/85 to-[#F4F8F6]/90 backdrop-blur-xl border border-slate-200/80 shadow-[0_20px_50px_-12px_rgba(15,23,42,0.08)] p-6 sm:p-12 lg:p-16 transition-all duration-300">
      {/* Subtle Ambient Light Orbs */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 right-10 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
        {/* Subtle Live Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/[0.04] border border-slate-900/10 text-xs font-semibold text-slate-800 mb-6 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{content.badge}</span>
        </div>

        {/* Grand Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12] mb-6 text-balance">
          {content.titlePrefix}{' '}
          <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-slate-900 bg-clip-text text-transparent underline decoration-emerald-500/30 decoration-wavy decoration-1 underline-offset-8">
            {content.titleAccent}
          </span>{' '}
          {content.titleSuffix}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed mb-9 max-w-2xl">
          {content.subtitle}
        </p>

        {/* Primary and Secondary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto mb-10">
          <Link
            href={content.primaryCta.href}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-slate-950 text-white font-medium text-base shadow-xl shadow-slate-950/15 hover:bg-slate-850 hover:shadow-slate-950/25 hover:translate-y-[-1px] active:translate-y-0 transition-all duration-200 cursor-pointer"
          >
            <span>{content.primaryCta.text}</span>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href={content.secondaryCta.href}
            className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-xl bg-white/80 hover:bg-white text-slate-800 font-medium text-base border border-slate-200 shadow-sm hover:shadow hover:border-slate-300 transition-all duration-200 cursor-pointer"
          >
            {content.secondaryCta.text}
          </Link>
        </div>

        {/* Micro Highlights Chips */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-500 font-medium pt-2">
          {content.highlights.map((h, i) => (
            <div key={i} className="inline-flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
              <span>{h}</span>
            </div>
          ))}
        </div>

        {/* Stat Cards Row */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6 w-full pt-10 mt-10 border-t border-slate-200/70">
          {content.stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {stat.value}
              </span>
              <span className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
