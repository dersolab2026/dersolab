'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  GraduationCap,
  Calendar,
  Award,
  Sparkles,
  CheckCircle2,
  Brain,
  ArrowRight,
  Target,
  ShieldCheck,
  Video,
  ChevronRight,
  Star,
} from 'lucide-react'
import { AIShowcaseSection } from './AIShowcaseSection'

interface StudentLandingViewProps {
  examFilter: 'all' | 'lgs' | 'yks'
  onExamFilterChange: (filter: 'all' | 'lgs' | 'yks') => void
}

export function StudentLandingView({ examFilter, onExamFilterChange }: StudentLandingViewProps) {
  const [selectedSlot, setSelectedSlot] = useState<string>('18:00')
  const [selectedHabitOption, setSelectedHabitOption] = useState<number | null>(4)

  return (
    <div className="space-y-16 py-6">
      {/* ── EXAM TOGGLE PILL ── */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <span className="text-xs font-mono text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5" /> Hedef Sınavını Seç:
        </span>
        <div className="inline-flex p-1 rounded-2xl bg-white/[0.04] border border-white/[0.1] backdrop-blur-xl">
          <button
            type="button"
            onClick={() => onExamFilterChange('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              examFilter === 'all'
                ? 'bg-amber-400 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.35)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tüm Sınavlar
          </button>
          <button
            type="button"
            onClick={() => onExamFilterChange('yks')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              examFilter === 'yks'
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-[0_0_20px_rgba(251,191,36,0.35)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🎓 YKS</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 font-mono">TYT · AYT</span>
          </button>
          <button
            type="button"
            onClick={() => onExamFilterChange('lgs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              examFilter === 'lgs'
                ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-[0_0_20px_rgba(52,211,153,0.35)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>📘 LGS</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/20 font-mono">8. Sınıf</span>
          </button>
        </div>
      </div>

      {/* ── HERO SECTION ── */}
      <section className="relative text-center max-w-5xl mx-auto px-4">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-medium mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Butik & Birebir Online Hazırlık Sistemi</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1] mb-6">
          {examFilter === 'yks' ? (
            <>
              Hayalindeki Üniversite İçin{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
                1:1 Canlı Ders ve Koçluk
              </span>
            </>
          ) : examFilter === 'lgs' ? (
            <>
              Hedefindeki Fen ve Anadolu Lisesi İçin{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Birebir LGS Mentorluğu
              </span>
            </>
          ) : (
            <>
              Sınav Maratonunda Seni Anlayan{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">
                Özel Eğitmen Kadrosu
              </span>
            </>
          )}
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
          {examFilter === 'yks'
            ? 'TYT & AYT deneme netlerini takip et, 20 soruluk koçluk envanteriyle odaklanma sorunlarını çöz, Google Takvim ile istediğin saatte 1:1 derse bağlan.'
            : examFilter === 'lgs'
            ? 'Yeni nesil LGS sorularında takılma. Haftalık çalışma günlüğünü koçunla paylaş, yanmayan kredilerinle eksik konularını nokta atışı tamamla.'
            : 'YKS ve LGS için özel seçilmiş eğitmenler, kişisel deneme net takibi, çalışma günlüğü ve asla yanmayan ders kredisi sistemi.'}
        </p>

        {/* CTA BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/register"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-base transition-all shadow-[0_0_30px_rgba(251,191,36,0.35)] hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>Ücretsiz Tanışma Seansı Ayarla</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-bold text-base transition-all flex items-center justify-center gap-2"
          >
            <span>Giriş Yap</span>
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-12 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white">Yanmayan Kredi</p>
              <p className="text-[11px] text-slate-400">Sene sonuna devreder</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white">Google Takvim</p>
              <p className="text-[11px] text-slate-400">Tek tıkla anında seans</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-400/10 flex items-center justify-center shrink-0">
              <Brain className="w-5 h-5 text-sky-400" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white">Koçluk Envanteri</p>
              <p className="text-[11px] text-slate-400">20 soruluk analiz</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-400/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-rose-400" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white">Butik Kadro</p>
              <p className="text-[11px] text-slate-400">Teyitli & referanslı</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE FEATURE 1: HEDEF VE NET TAKİP SİMÜLATÖRÜ ── */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-b from-[#131722] to-[#0d1017] border border-white/[0.08] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-[90px] pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-mono text-amber-400 tracking-wider uppercase font-bold">DersoLab Özel Araçları</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                {examFilter === 'lgs' ? 'Hedef Lise ve Deneme Takibi' : 'YÖK Atlas Uyumlu Hedef & Net Takibi'}
              </h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-400/10 text-amber-300 text-xs font-mono border border-amber-400/20">
              Panel İçi Canlı Önizleme
            </span>
          </div>

          {/* Target Card Simulation */}
          <div className="p-5 rounded-2xl bg-black/40 border border-white/[0.08] mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-white text-base">
                    {examFilter === 'lgs'
                      ? 'Galatasaray Lisesi (İstanbul)'
                      : 'Hacettepe Üniversitesi · Tıp (İngilizce)'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {examFilter === 'lgs'
                      ? 'Yüzdelik Dilim: %0.04 · Taban Puan: 494.50'
                      : 'Puan Türü: SAY · Taban Puan: 534.82 · Başarı Sırası: 1.169'}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                Hedef Aktif
              </span>
            </div>

            {/* Trial exam inputs simulator */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              {examFilter === 'lgs' ? (
                <>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <span className="text-[11px] text-slate-400">Türkçe (20)</span>
                    <p className="text-lg font-black text-amber-400">19 D · 1 Y</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <span className="text-[11px] text-slate-400">Matematik (20)</span>
                    <p className="text-lg font-black text-amber-400">18 D · 2 Y</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <span className="text-[11px] text-slate-400">Fen Bilimleri (20)</span>
                    <p className="text-lg font-black text-emerald-400">20 D · 0 Y</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <span className="text-[11px] text-slate-400">Toplam Net</span>
                    <p className="text-lg font-black text-white">85.67 Net</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <span className="text-[11px] text-slate-400">TYT Türkçe (40)</span>
                    <p className="text-lg font-black text-amber-400">36 D · 4 Y</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <span className="text-[11px] text-slate-400">Temel Mat (40)</span>
                    <p className="text-lg font-black text-amber-400">38 D · 2 Y</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <span className="text-[11px] text-slate-400">AYT Matematik (40)</span>
                    <p className="text-lg font-black text-emerald-400">37 D · 1 Y</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
                    <span className="text-[11px] text-slate-400">AYT Fen (40)</span>
                    <p className="text-lg font-black text-emerald-400">36 D · 3 Y</p>
                  </div>
                </>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-400 text-center">
            💡 Girdiğin her deneme sonucu koçun ve eğitmenlerin tarafından anında analiz edilir; dersler eksik olduğun konulara göre şekillenir.
          </p>
        </div>
      </section>

      {/* ── INTERACTIVE FEATURE 2: 20 SORULUK ALIŞKANLIK & KOÇLUK ENVENTERİ ── */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="grid sm:grid-cols-2 gap-6 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-mono mb-3">
              <Brain className="w-3.5 h-3.5" /> Pedagojik Koçluk Desteği
            </div>
            <h2 className="text-3xl font-black text-white leading-tight mb-4">
              Sadece Ders Değil, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-400">
                Sınav Psikolojisi ve Alışkanlık Yönetimi
              </span>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Erteleme, odaklanma kaybı ve sınav kaygısı genellikle bilgi eksikliğinden değil, çalışma alışkanlıklarından kaynaklanır.
              DersoLab Koçluk Envanteri ile eksik yönlerini bilimsel olarak tespit ediyoruz.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>20 soruluk Likert çalışma alışkanlıkları ölçeği</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Haftalık birebir çalışma planı ve soru hedefi</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Öğretmen ve koçun ortak takip ettiği çalışma günlüğü</span>
              </li>
            </ul>
          </div>

          {/* Interactive questionnaire card */}
          <div className="p-6 rounded-3xl bg-[#12151f] border border-white/[0.08] shadow-xl space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/[0.06] pb-3">
              <span className="font-mono font-bold text-sky-400">Örnek Soru 01/20</span>
              <span>Koçluk Formu</span>
            </div>
            <p className="text-sm font-semibold text-white">
              "Haftalık bir çalışma programı yapar ve genelde ona uyarım."
            </p>
            <div className="flex justify-between items-center gap-2 pt-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSelectedHabitOption(val)}
                  className={`w-11 h-11 rounded-xl text-sm font-black transition-all cursor-pointer ${
                    selectedHabitOption === val
                      ? 'bg-sky-400 text-slate-950 shadow-[0_0_15px_rgba(56,189,248,0.4)] scale-110'
                      : 'bg-white/[0.05] text-slate-300 hover:bg-white/[0.1] border border-white/[0.08]'
                  }`}
                >
                  {val}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 px-1">
              <span>1 = Hiç katılmıyorum</span>
              <span>5 = Tamamen katılıyorum</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── GOOGLE TAKVİM & RANDEVU DENEYİMİ ── */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 border border-amber-500/20 text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto mb-2 border border-amber-400/30">
              <Video className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Google Takvim ile Sıfır Zaman Kaybı
            </h2>
            <p className="text-sm text-slate-300">
              WhatsApp'ta mesajlaşarak saat uydurmaya son. Eğitmenin boş takvimine tıkla, Google Meet linki anında takvimine düşsün.
            </p>

            {/* Time Slot Picker Simulator */}
            <div className="pt-4 flex flex-wrap justify-center gap-2">
              {['16:00', '17:00', '18:00', '19:30', '20:30'].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedSlot === slot
                      ? 'bg-amber-400 text-slate-950 font-black shadow-[0_0_15px_rgba(251,191,36,0.4)] scale-105'
                      : 'bg-white/[0.05] text-slate-300 border border-white/[0.08] hover:bg-white/[0.1]'
                  }`}
                >
                  Bugün {slot}
                </button>
              ))}
            </div>

            <div className="pt-6">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm transition-all shadow-lg"
              >
                <span>Hemen İlk Dersini Planla</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI SORU ASİSTANI SHOWCASE ── */}
      <AIShowcaseSection />
    </div>
  )
}

