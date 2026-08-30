'use client'

import Link from 'next/link'
import { Sparkles, ShieldCheck, CalendarCheck, CheckCircle2, ArrowRight } from 'lucide-react'
import type { PersonaType } from './PersonaSwitcher'

interface PersonaHeroProps {
  persona: PersonaType
}

const HERO_DATA: Record<
  PersonaType,
  {
    tag: string
    title: string
    highlight: string
    description: string
    primaryCta: { text: string; href: string }
    secondaryCta: { text: string; href: string }
    chips: string[]
    themeColor: string
  }
> = {
  student: {
    tag: '🎓 ÖĞRENCİLER İÇİN',
    title: 'Hedefindeki Liseye ve Üniversiteye',
    highlight: 'Bire Bir Canlı Derslerle Ulaş!',
    description:
      'Okul derslerinden LGS ve YKS hazırlığına kadar, alanında uzman onaylı eğitmenlerle bire bir çalış. Takıldığın her soruyu canlı çöz, haftalık koçluk desteği al.',
    primaryCta: { text: '🎁 Ücretsiz Hoş Geldin Paketini Al', href: '/demo-ders' },
    secondaryCta: { text: 'Eğitmenleri İncele →', href: '/instructors' },
    chips: ['20 Dk Ücretsiz Tanışma Dersi', 'Kart Bilgisi Gerekmez', 'Google Meet ile Anında Bağlantı'],
    themeColor: '#DD7B3A',
  },
  parent: {
    tag: '👨‍👩‍👧 VELİLER İÇİN',
    title: 'Çocuğunuzun Eğitim Yolculuğunu',
    highlight: 'Şeffaf ve Güvenle Takip Edin.',
    description:
      'Sadece yetkinliği onaylanmış öğretmenler. Çocuğunuzun ders katılımlarını, öğretmen değerlendirmelerini, ödev durumunu ve sınav netlerini tek ekrandan izleyin.',
    primaryCta: { text: '✨ Veli Hesabınızı Oluşturun', href: '/register?role=parent' },
    secondaryCta: { text: 'Eğitmen Kadromuz →', href: '/instructors' },
    chips: ['%100 Doğrulanmış Öğretmenler', 'Düzenli Gelişim Raporları', 'Yanmayan Kredi Güvencesi'],
    themeColor: '#6FA89E',
  },
  instructor: {
    tag: '👨‍🏫 EĞİTMENLER & KOÇLAR İÇİN',
    title: 'Kendi Saatlerinde Online Ders Ver,',
    highlight: 'Türkiye Çapında Öğrencilere Ulaş.',
    description:
      'Müsaitlik takvimini belirle, dersler otomatik Google Meet ve Google Takvimine bağlansın. Ödev araçları, koçluk modülü ve düzenli banka (IBAN) ödemeleri tek platformda.',
    primaryCta: { text: '🚀 Eğitmen Başvurusu Yap', href: '/register?role=instructor' },
    secondaryCta: { text: 'Nasıl Çalışır? →', href: '/dashboard/instructor/nasil-calisir' },
    chips: ['Otomatik Google Meet & Ajanda', 'Zamanında Banka (IBAN) Hakedişi', 'Komisyonsuz Başlangıç'],
    themeColor: '#DD7B3A',
  },
}

export function PersonaHero({ persona }: PersonaHeroProps) {
  const data = HERO_DATA[persona]

  return (
    <div className="rounded-2xl border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430] overflow-hidden bg-[#F4F1E8] p-6 sm:p-10 transition-all duration-300">
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
        {/* Role Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl border-3 border-[#1B2430] bg-[#DD7B3A] text-[#F4F1E8] text-xs sm:text-sm font-black shadow-[0_3px_0_#1B2430] mb-5">
          <Sparkles className="w-4 h-4" />
          <span>{data.tag}</span>
        </div>

        {/* Title */}
        <h2 className="font-sans text-2xl sm:text-4xl lg:text-5xl font-black text-[#1B2430] leading-tight mb-4 text-balance">
          {data.title} <span className="text-[#DD7B3A] underline decoration-4 decoration-[#1B2430]">{data.highlight}</span>
        </h2>

        {/* Description */}
        <p className="font-semibold text-base sm:text-lg text-[#1B2430]/85 mb-8 max-w-2xl leading-relaxed">
          {data.description}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto mb-8">
          <Link
            href={data.primaryCta.href}
            className="w-full sm:w-auto py-3.5 px-8 text-base sm:text-lg bg-[#DD7B3A] text-[#F4F1E8] font-black rounded-xl border-4 border-[#1B2430] shadow-[0_5px_0_#1B2430] hover:translate-y-[-2px] active:translate-y-1 active:shadow-none transition-all text-center"
          >
            {data.primaryCta.text}
          </Link>
          <Link
            href={data.secondaryCta.href}
            className="w-full sm:w-auto py-3.5 px-7 text-base sm:text-lg bg-white text-[#1B2430] font-black rounded-xl border-4 border-[#1B2430] shadow-[0_5px_0_#1B2430] hover:bg-[#D5EAE3] hover:translate-y-[-2px] active:translate-y-1 active:shadow-none transition-all text-center"
          >
            {data.secondaryCta.text}
          </Link>
        </div>

        {/* Trust Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-2 border-t-2 border-[#1B2430]/15 w-full">
          {data.chips.map((chip, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 bg-white/80 px-3 py-1.5 rounded-lg border-2 border-[#1B2430] text-xs sm:text-sm font-bold text-[#1B2430]"
            >
              <CheckCircle2 className="w-4 h-4 text-[#6FA89E]" />
              <span>{chip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
