'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  CheckCircle2,
  Calendar,
  Video,
  ShieldCheck,
  Clock,
  Sparkles,
  Award,
  Wallet,
} from 'lucide-react'
import type { PersonaType } from '../../PersonaSwitcher'

interface HumanHeroProps {
  persona: PersonaType
}

const HERO_CONTENT: Record<
  PersonaType,
  {
    badge: string
    title: string
    titleHighlight: string
    subtitle: string
    primaryCta: { text: string; href: string }
    secondaryCta: { text: string; href: string }
    bullets: string[]
  }
> = {
  student: {
    badge: 'LGS & YKS Hazırlığı İçin Bire Bir Özel Ders',
    title: 'Anlamadığın konuyu erteleme,',
    titleHighlight: 'uzman öğretmenle bire bir çöz.',
    subtitle:
      'Google Meet üzerinden 1:1 canlı derslerle takıldığın soruları anında sor. Satın aldığın dersler hesabında kalır, süresi dolup yanmaz.',
    primaryCta: { text: '20 Dk Ücretsiz Tanışma Dersi Al', href: '/demo-ders' },
    secondaryCta: { text: 'Eğitmenleri İncele', href: '/instructors' },
    bullets: [
      'İlk 20 dakika tamamen ücretsiz',
      'Kredi kartı gerekmez',
      'Ders kredileri asla yanmaz',
    ],
  },
  parent: {
    badge: 'Veliler İçin Güvenli & Şeffaf Eğitim',
    title: 'Çocuğunuzun eğitimini',
    titleHighlight: 'şeffaf ve güvenle takip edin.',
    subtitle:
      'Diploması ve yetkinliği doğrulanmış öğretmenlerle çalışın. Her dersin ardından yazılı ilerleme raporu alın, yanmayan kredi garantisiyle bütçenizi koruyun.',
    primaryCta: { text: 'Veli Hesabı Oluştur', href: '/register?role=parent' },
    secondaryCta: { text: 'Öğretmen Kadromuz', href: '/instructors' },
    bullets: [
      '%100 belgeli ve onaylı öğretmenler',
      'Her ders sonrası yazılı gelişim raporu',
      'Süresi dolmayan, yanmayan bakiye',
    ],
  },
  instructor: {
    badge: 'Eğitmenler İçin Bağımsız Çalışma Alanı',
    title: 'Kendi programını belirle,',
    titleHighlight: 'öğrencilerinle doğrudan buluş.',
    subtitle:
      'Takvimindeki uygun saatleri işaretle; Google Meet odaları ve ders davetiyeleri kendiliğinden oluşsun. Ödemelerini her ay düzenli ve eksiksiz al.',
    primaryCta: { text: 'Eğitmen Olarak Başvur', href: '/register?role=instructor' },
    secondaryCta: { text: 'Nasıl Çalışır?', href: '/dashboard/instructor/nasil-calisir' },
    bullets: [
      'Otomatik takvim & Google Meet entegrasyonu',
      'Aylık düzenli IBAN transferi',
      'Sıfır başlangıç komisyonu',
    ],
  },
}

export function HumanHero({ persona }: HumanHeroProps) {
  const data = HERO_CONTENT[persona]
  const [selectedSubject, setSelectedSubject] = useState('Matematik')

  return (
    <div className="py-8 sm:py-14">
      <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        {/* Left Column: Clear, Honest Copy */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Subtle Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span>{data.badge}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-bold text-slate-950 tracking-tight leading-[1.18] text-balance">
            {data.title}{' '}
            <span className="text-blue-600 underline decoration-blue-200 decoration-4 underline-offset-4">
              {data.titleHighlight}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
            {data.subtitle}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
            <Link
              href={data.primaryCta.href}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>{data.primaryCta.text}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={data.secondaryCta.href}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base border border-slate-200 transition-all cursor-pointer"
            >
              {data.secondaryCta.text}
            </Link>
          </div>

          {/* Trust Bullets */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-slate-600">
            {data.bullets.map((b, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Real Tangible Interactive Product Mockup */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-xl shadow-slate-200/50 space-y-5">
            {persona === 'student' && (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold text-slate-700">1:1 Canlı Ders Kartı</span>
                  </div>
                  <span className="text-[11px] font-mono font-medium text-slate-400">Google Meet HD</span>
                </div>

                {/* Subject Selector */}
                <div className="space-y-2">
                  <span className="text-xs font-medium text-slate-500">Ders Seçin:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {['Matematik', 'Fizik', 'Kimya'].map((subj) => (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => setSelectedSubject(subj)}
                        className={`py-2 px-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          selectedSubject === subj
                            ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-xs'
                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                        }`}
                      >
                        {subj}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time & Teacher Mockup */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Müsait Seans:</span>
                    <span className="font-semibold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Bugün 19:00 - 19:45
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Seans Türü:</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      20 Dk Ücretsiz Tanışma
                    </span>
                  </div>
                </div>

                {/* Live Meet Action */}
                <Link
                  href="/demo-ders"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all"
                >
                  <Video className="w-4 h-4 text-emerald-400" />
                  <span>Tanışma Seansını Başlat</span>
                </Link>
              </>
            )}

            {persona === 'parent' && (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-semibold text-slate-700">Veli Takip Özeti</span>
                  </div>
                  <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    Aktif & Güvende
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <span className="text-slate-600">Mevcut Ders Kredisi:</span>
                    <span className="font-bold text-slate-950 font-mono text-sm">8 Kredi (Süresiz)</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex items-center justify-between font-medium">
                      <span className="text-slate-800">Son Ders: TYT Matematik (Fonksiyonlar)</span>
                      <span className="text-emerald-600">%100 Katılım</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">
                      Öğretmen Raporu: "Konu kavrandı, 15 pekiştirme sorusu ödev verildi."
                    </p>
                  </div>
                </div>

                <Link
                  href="/register?role=parent"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-all"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Veli Paneline Kayıt Ol</span>
                </Link>
              </>
            )}

            {persona === 'instructor' && (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-semibold text-slate-700">Eğitmen Takvim Kartı</span>
                  </div>
                  <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    Otomatik Senkron
                  </span>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
                    <span className="text-slate-600">Haftalık Müsaitlik:</span>
                    <span className="font-semibold text-slate-900 font-mono">14 Saat / Hafta</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-blue-50/50 border border-blue-200/60 flex items-center justify-between">
                    <span className="text-slate-700 font-medium">Tahmini Aylık Kazanç:</span>
                    <span className="font-bold text-blue-700 text-sm font-mono">~10.500 ₺</span>
                  </div>
                </div>

                <Link
                  href="/register?role=instructor"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-all"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Eğitmen Başvurusunu Tamamla</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
