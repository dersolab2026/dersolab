'use client'

import Link from 'next/link'
import {
  ArrowRight,
  ShieldCheck,
  Video,
  Star,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  TrendingUp,
  Clock,
  Zap,
} from 'lucide-react'
import type { PersonaType } from './PersonaSwitcher'

interface SplitHeroProps {
  persona: PersonaType
}

export function SplitHero({ persona }: SplitHeroProps) {
  if (persona === 'student') {
    return (
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center py-4 sm:py-8">
        {/* Left Content */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>20 Dk Ücretsiz Tanışma Paketiyle Başlayın</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-slate-950 tracking-tight leading-[1.12]">
            Hedefindeki başarıya{' '}
            <span className="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 bg-clip-text text-transparent underline decoration-emerald-400/40 decoration-wavy decoration-1 underline-offset-8">
              seçkin eğitmenlerle
            </span>{' '}
            bire bir canlı derslerle ulaş.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
            LGS, YKS ve okul derslerinde takıldığın her soruyu alanında uzman eğitmenlerle anında çöz. Bireysel koçluk,
            deneme sınavı net analizi ve eksiksiz ödev takibiyle hedefine adım adım ilerle.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
            <Link
              href="/demo-ders"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-slate-950 text-white font-semibold text-base shadow-xl shadow-slate-950/10 hover:bg-slate-850 hover:shadow-slate-950/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>Ücretsiz Tanışma Dersi Al</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </Link>
            <Link
              href="/instructors"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white text-slate-800 font-semibold text-base border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
            >
              Eğitmenleri Keşfet
            </Link>
          </div>

          {/* Trust Chips */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3 text-xs sm:text-sm text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Kart bilgisi gerekmez</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Google Meet ile anında erişim</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Yanmayan ders kredisi</span>
            </div>
          </div>
        </div>

        {/* Right Interactive Mockup Visual */}
        <div className="lg:col-span-5 relative">
          {/* Ambient Glow */}
          <div className="pointer-events-none absolute -inset-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-3xl blur-2xl opacity-70" />

          <div className="relative rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] space-y-4">
            {/* Live Video Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                    AY
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">Ahmet Yılmaz</h4>
                  <p className="text-xs text-slate-500">Boğaziçi Üniv. · YKS Matematik Eğitmeni</p>
                </div>
              </div>
              <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 text-amber-700 font-bold text-xs">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>5.0</span>
              </div>
            </div>

            {/* Video Lesson Preview Frame */}
            <div className="relative rounded-xl overflow-hidden bg-slate-950 text-white p-5 aspect-[16/10] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold backdrop-blur-md border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Canlı Ders Odası · Google Meet
                </span>
                <span className="text-[11px] font-mono text-slate-300 bg-white/10 px-2 py-0.5 rounded backdrop-blur-md">
                  42:15
                </span>
              </div>

              {/* Interactive Waveform / Subject Box */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-lg p-3">
                <p className="text-xs font-semibold text-white mb-1">Türev & İntegral Soru Çözüm Analizi</p>
                <div className="flex items-center justify-between text-[11px] text-slate-300">
                  <span>Öğrenci: Zeynep K.</span>
                  <span className="text-emerald-400 font-bold">12 Soru Çözüldü ✓</span>
                </div>
              </div>
            </div>

            {/* Floating Micro Highlights */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <span className="text-slate-500 block text-[10px]">Hedef Sıralama</span>
                <span className="font-bold text-slate-900">İTÜ Bilgisayar (İlk 1000)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70">
                <span className="text-emerald-700 block text-[10px]">Net Değişimi</span>
                <span className="font-bold text-emerald-900">+14.5 Net Gelişim ↗</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (persona === 'parent') {
    return (
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center py-4 sm:py-8">
        {/* Left Content */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-sky-800 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
            <span>%100 Doğrulanmış Kadro & Şeffaf Veli Paneli</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-slate-950 tracking-tight leading-[1.12]">
            Çocuğunuzun eğitimini{' '}
            <span className="bg-gradient-to-r from-sky-600 via-indigo-700 to-slate-900 bg-clip-text text-transparent underline decoration-sky-400/40 decoration-wavy decoration-1 underline-offset-8">
              tam şeffaflıkla
            </span>{' '}
            ve güvenle takip edin.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
            Diplomaları ve yetkinlikleri incelenmiş onaylı öğretmenler. Çocuğunuzun ders devamlılığını, öğretmen
            değerlendirme notlarını ve sınav gelişimini tek bir veli panelinden anlık izleyin.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
            <Link
              href="/register?role=parent"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-slate-950 text-white font-semibold text-base shadow-xl shadow-slate-950/10 hover:bg-slate-850 hover:shadow-slate-950/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
            >
              <span>Veli Hesabınızı Oluşturun</span>
              <ArrowRight className="w-4 h-4 text-sky-400" />
            </Link>
            <Link
              href="/instructors"
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white text-slate-800 font-semibold text-base border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
            >
              Öğretmen Kadromuzu İnceleyin
            </Link>
          </div>

          {/* Trust Chips */}
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3 text-xs sm:text-sm text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              <span>Yazılı ders sonu raporları</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              <span>Krediler süresizdir, asla yanmaz</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-sky-600" />
              <span>Güvenli 256-bit ödeme altyapısı</span>
            </div>
          </div>
        </div>

        {/* Right Parent Mockup Visual */}
        <div className="lg:col-span-5 relative">
          <div className="pointer-events-none absolute -inset-4 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 rounded-3xl blur-2xl opacity-70" />

          <div className="relative rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center font-bold text-sm border border-sky-200">
                  MY
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">Mehmet Yılmaz (Veli)</h4>
                  <p className="text-xs text-slate-500">Öğrenci: Ali Yılmaz · 12. Sınıf Sayısal</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Bağlantı Aktif
              </span>
            </div>

            {/* Parent Dashboard Snapshot */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">Kalan Ders Bakiyesi</span>
                  <span className="font-bold text-base text-slate-900">8 Ders Kredisi</span>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  Süresiz & Güvende
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200/70">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-xs text-sky-950">Fizik Dersi Öğretmen Raporu</span>
                  <span className="text-[10px] text-sky-700">Dün 18:00</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  "Kuvvet ve Hareket konusundaki soru çözüm performansı mükemmeldi. Ödev teslim edildi, haftaya elektrik konusuna geçiyoruz."
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                  <span className="text-slate-500 text-[10px] block">Derse Devamlılık</span>
                  <span className="font-bold text-slate-900">%100 Tam Katılım</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                  <span className="text-slate-500 text-[10px] block">Ödev Tamamlama</span>
                  <span className="font-bold text-emerald-700">14 / 14 Tamamlandı</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Instructor
  return (
    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center py-4 sm:py-8">
      {/* Left Content */}
      <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-amber-600" />
          <span>Otomatik Google Meet & Takvim Entegrasyonu</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-slate-950 tracking-tight leading-[1.12]">
          Kendi saatlerinde ders ver,{' '}
          <span className="bg-gradient-to-r from-amber-600 via-orange-700 to-slate-900 bg-clip-text text-transparent underline decoration-amber-400/40 decoration-wavy decoration-1 underline-offset-8">
            seçkin öğrencilere
          </span>{' '}
          doğrudan ulaş.
        </h1>

        <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
          Müsaitlik takviminizi belirleyin, dersler otomatik Google Meet ve Google Takviminize bağlansın. Ödev araçları,
          koçluk modülü ve düzenli banka (IBAN) ödemeleri tek platformda.
        </p>

        {/* CTA Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
          <Link
            href="/register?role=instructor"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-slate-950 text-white font-semibold text-base shadow-xl shadow-slate-950/10 hover:bg-slate-850 hover:shadow-slate-950/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            <span>Eğitmen Başvurusu Yap</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
          <Link
            href="/dashboard/instructor/nasil-calisir"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-white text-slate-800 font-semibold text-base border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all cursor-pointer"
          >
            Nasıl Çalışır?
          </Link>
        </div>

        {/* Trust Chips */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3 text-xs sm:text-sm text-slate-600 font-medium">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>Otomatik Google Meet oluşturma</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>Düzenli aylık IBAN hakedişi</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
            <span>Dilediğinde profili dondurma</span>
          </div>
        </div>
      </div>

      {/* Right Instructor Mockup Visual */}
      <div className="lg:col-span-5 relative">
        <div className="pointer-events-none absolute -inset-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-3xl blur-2xl opacity-70" />

        <div className="relative rounded-2xl bg-white border border-slate-200/90 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm border border-amber-200">
                EY
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 leading-tight">Eğitmen Paneli</h4>
                <p className="text-xs text-slate-500">Google Takvim & Meet Bağlı</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Senkronize ✓
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">Gelecek Ders: Bugün 18:00</span>
                <span className="text-emerald-700 font-semibold">Onaylandı</span>
              </div>
              <p className="text-xs text-slate-600">Öğrenci: Melisa D. · TYT Geometri</p>
              <div className="pt-1 flex items-center gap-2 text-xs font-medium text-slate-700">
                <Video className="w-3.5 h-3.5 text-emerald-600" />
                <span className="underline text-emerald-700">meet.google.com/abc-xyz</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-amber-800 block">Bu Ayki Tamamlanan Ders</span>
                <span className="font-bold text-base text-amber-950">14 Ders Tamamlandı</span>
              </div>
              <span className="text-xs font-semibold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-amber-300">
                IBAN Aktarımı Hazır
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
