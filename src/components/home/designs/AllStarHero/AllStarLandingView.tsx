'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GraduationCap,
  ShieldCheck,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Video,
  Mic,
  Calendar,
  Sparkles,
  Clock,
  Star,
  Zap,
  TrendingUp,
  XCircle,
  HelpCircle,
  ChevronRight,
  BookOpen,
  Award
} from 'lucide-react'

// Real instructors from DersoLab Supabase database
const ALL_STAR_INSTRUCTORS = [
  {
    name: 'Gökçe Lale',
    title: 'Fizik Öğretmeni (19 Yıllık Deneyim)',
    badge: '19 Yıl Deneyim',
    university: 'Fizik & Fen Bilimleri',
    avatar: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/9397685d-4845-4557-aefe-652b86827117/avatar.jpg',
    tags: ['YKS Fizik', '11-12. Sınıf', 'Mezun'],
    highlight: 'Soru çözümlerinde püf noktalar ve sınav stratejisi odaklı program.',
  },
  {
    name: 'Selva Şahin',
    title: 'Türk Dili ve Edebiyatı & YKS Koçu',
    badge: 'Doğrulanmış Eğitmen',
    university: 'Türk Dili ve Edebiyatı',
    avatar: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/d96a9da2-0057-4c2e-9d74-91c07a5ea9ee/avatar.jpeg',
    tags: ['TYT Paragraf', 'AYT Edebiyat', 'Birebir Koçluk'],
    highlight: 'Paragraf taktikleri ve sınav psikolojisiyle net artırma metodu.',
  },
  {
    name: 'Nurcan Karaağaç',
    title: 'Lise & Ortaokul Türkçe / Koçluk',
    badge: 'Doğrulanmış Eğitmen',
    university: 'Türkçe & Eğitim Koçluğu',
    avatar: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/14082db7-203e-48a2-9911-986f3059aff1/avatar.jpeg',
    tags: ['LGS Türkçe', 'TYT Türkçe', 'Öğrenci Koçluğu'],
    highlight: 'Kişiye özel çalışma planı ve eksik konu bazlı nokta atışı.',
  },
  {
    name: 'Gamze Budak',
    title: 'Tarih, Coğrafya & Sosyal Bilimler',
    badge: 'Doğrulanmış Eğitmen',
    university: 'Tarih & Sosyal Bilgiler',
    avatar: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/5e24812e-7a53-430d-b79d-93136b185229/avatar.png',
    tags: ['TYT Sosyal', 'AYT Tarih', 'LGS İnkılap'],
    highlight: 'Hafıza teknikleriyle kalıcı sosyal bilimler full tekrarı.',
  },
]

// Mock live lesson states for interactive demo
const LIVE_DEMO_SUBJECTS = {
  matematik: {
    title: 'TYT Matematik — Fonksiyonlar & Grafikler',
    code: 'MAT-204',
    teacher: 'Selva Hoca',
    role: 'YKS All-Star Eğitmeni',
    teacherImg: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/d96a9da2-0057-4c2e-9d74-91c07a5ea9ee/avatar.jpeg',
    problem: 'Soru: f(x) = 2x² - 8x + k parabolünün tepe noktası y = 3 doğrusu üzerinde olduğuna göre k kaçtır?',
    steps: [
      '1. Tepe noktası apsisi: r = -b / (2a) = -(-8) / 4 = 2',
      '2. y = 3 doğrusu üzerinde ise ordinat k = f(2) = 3 olmalıdır.',
      '3. f(2) = 2(2)² - 8(2) + k = 8 - 16 + k = -8 + k = 3  ⇒  k = 11'
    ],
    verifiedTag: 'ÖSYM 2023 Benzeri',
    time: '42. Dakika / Canlı'
  },
  fizik: {
    title: 'AYT Fizik — İtme ve Çizgisel Momentum',
    code: 'FIZ-301',
    teacher: 'Gökçe Lale',
    role: '19 Yıllık Fizik Zümre Bşk.',
    teacherImg: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/9397685d-4845-4557-aefe-652b86827117/avatar.jpg',
    problem: 'Soru: Sürtünmesiz yatay düzlemde 3m kütleli cisim v hızıyla giderken iç patlamayla ikiye ayrılıyor...',
    steps: [
      '1. Dış kuvvet F_net = 0 olduğu için momentum korunur: P_ilk = P_son',
      '2. Vektörel bileşenleri x ve y ekseninde ayrı ayrı eşitleyelim.',
      '3. Patlama anında kinetik enerji korunmak zorunda değildir, potansiyel eklenir.'
    ],
    verifiedTag: 'ÖSYM Çıkmış Model',
    time: '28. Dakika / Canlı'
  },
  turkce: {
    title: 'LGS / TYT — Paragrafta Anlam & Hız Taktikleri',
    code: 'TRK-102',
    teacher: 'Nurcan Hoca',
    role: 'Eğitim & Sınav Koçu',
    teacherImg: 'https://nkqifjcyudvwfaehgtgp.supabase.co/storage/v1/object/public/avatars/14082db7-203e-48a2-9911-986f3059aff1/avatar.jpeg',
    problem: 'Taktik: Soru kökünde "değinilmemiştir / çıkarılamaz" varsa önce şıklar, sonra metin taranır.',
    steps: [
      '1. Şıklardaki anahtar kelimelerin altını 3 saniyede çiz.',
      '2. Paragrafı okurken şıklarla eşleşen cümleleri doğrudan ele.',
      '3. Kalan tek seçenek doğru yanıttır — tüm metni 2 kere okuma süren cebinde kalsın.'
    ],
    verifiedTag: 'Süre Kazandıran Yöntem',
    time: '15. Dakika / Canlı'
  }
}

export function AllStarLandingView() {
  const [activePersona, setActivePersona] = useState<'student' | 'parent' | 'instructor'>('student')
  const [selectedSubjectKey, setSelectedSubjectKey] = useState<'matematik' | 'fizik' | 'turkce'>('matematik')

  const currentLesson = LIVE_DEMO_SUBJECTS[selectedSubjectKey]

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 selection:bg-amber-400 selection:text-slate-950 font-sans overflow-x-hidden">
      
      {/* ── TOP BADGE & LIVE STATUS TICKER ── */}
      <div className="border-b border-white/[0.08] bg-[#0A0E18]/80 backdrop-blur-md px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-slate-300 font-medium">
              Bugün <strong className="text-amber-400">14 Canlı Ders</strong> Tamamlandı
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">%100 Doğrulanmış Branş Öğretmenleri</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Krediler Asla Yanmaz
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:flex items-center gap-1.5 text-amber-400 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              İlk 20 Dk Ücretsiz Tanışma
            </span>
          </div>
        </div>
      </div>

      {/* ── ROLE SWITCHER (ÖĞRENCİ / VELİ / EĞİTMEN) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-2">
        <div className="flex justify-center">
          <div className="inline-flex items-center p-1.5 rounded-2xl bg-[#0F1424] border border-white/10 shadow-2xl gap-1">
            <button
              type="button"
              onClick={() => setActivePersona('student')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activePersona === 'student'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Öğrenci & YKS/LGS</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePersona('parent')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activePersona === 'parent'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Veli & Takip</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePersona('instructor')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activePersona === 'instructor'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>Eğitmen Başvurusu</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── 1. HERO SECTION (ALL-STAR DYNAMIC HUD) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-16 lg:py-16">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Authentic, Punchy Copy */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold tracking-wide uppercase">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>LGS & YKS Butik Hazırlık Ekosistemi</span>
            </div>

            {/* Main Headline */}
            {activePersona === 'student' && (
              <>
                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08]">
                  Hedeflediğin Derece İçin,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-amber-300">
                    Öğretmeninle 1:1 Canlı Çöz.
                  </span>
                </h1>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
                  Sadece video izleyerek sınav kazanılmaz. Takıldığın soruyu ve anlamadığın konuyu aç; 
                  Boğaziçi ve ODTÜ mezunu uzman hocalarla Google Meet üzerinden bire bir canlı derste anında hallet.
                </p>
              </>
            )}

            {activePersona === 'parent' && (
              <>
                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08]">
                  Çocuğunuzun Sınav Hazırlığı,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                    Şeffaf ve Güvende.
                  </span>
                </h1>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
                  Her ders sonrası öğretmenin hazırladığı detaylı gelişim ve ödev raporu veli panelinize gelsin.
                  Ay sonunda silinmeyen, yanmayan ders kredileriyle bütçeniz tam koruma altında olsun.
                </p>
              </>
            )}

            {activePersona === 'instructor' && (
              <>
                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08]">
                  Kendi Ders Takvimini Yönet,{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                    Öğrencilerinle Buluş.
                  </span>
                </h1>
                <p className="text-slate-300 text-base sm:text-lg leading-relaxed font-normal">
                  Google Calendar entegrasyonuyla boş saatlerini belirle. Ders linkleri ve davetiyeler otomatik üretilsin,
                  aylık hak ediş ödemelerini düzenli olarak IBAN hesabına eksiksiz al.
                </p>
              </>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/demo-ders"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/25 transition-all transform hover:-translate-y-0.5"
              >
                <span>20 Dk Ücretsiz Tanışma Seansı</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/instructors"
                className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-xl bg-[#0F1424] hover:bg-[#161D32] border border-white/10 text-white font-bold text-base transition-all"
              >
                Eğitmen Kadrosu
              </Link>
            </div>

            {/* Proof Points */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-center lg:justify-start gap-5 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                Kredi kartı gerekmez
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                Yanmayan bakiye garantisi
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                Doğrudan Google Meet
              </span>
            </div>
          </div>

          {/* Right Column: REALISTIC ALL-STAR LIVE CLASSROOM HUD */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl bg-[#0B0F1C] border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
              
              {/* Terminal / Meet Topbar */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-[#080B14] border-b border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono font-bold text-slate-400">dersolab.meet // Canlı Stüdyo</span>
                </div>

                <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-bold text-emerald-400">{currentLesson.time}</span>
                </div>
              </div>

              {/* Subject Switcher Tab (Interactive) */}
              <div className="p-3 bg-[#0E1322] border-b border-white/5 flex gap-2">
                {(['matematik', 'fizik', 'turkce'] as const).map((key) => {
                  const s = LIVE_DEMO_SUBJECTS[key]
                  const isSelected = selectedSubjectKey === key
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedSubjectKey(key)}
                      className={`flex-1 py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer truncate ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 shadow-md'
                          : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08]'
                      }`}
                    >
                      {key === 'matematik' && '📐 TYT Matematik'}
                      {key === 'fizik' && '⚡ AYT Fizik'}
                      {key === 'turkce' && '📖 LGS/TYT Türkçe'}
                    </button>
                  )
                })}
              </div>

              {/* Board / Question Canvas */}
              <div className="p-6 space-y-4 bg-radial from-[#10172B] to-[#0A0E18]">
                
                {/* Header of the lesson */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">{currentLesson.code}</span>
                    <h3 className="text-base font-bold text-white">{currentLesson.title}</h3>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                    {currentLesson.verifiedTag}
                  </span>
                </div>

                {/* Problem Statement Box */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 font-mono text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <div className="text-amber-400 font-bold mb-1">SORU:</div>
                  {currentLesson.problem}
                </div>

                {/* Step-by-step Solution Board */}
                <div className="p-4 rounded-xl bg-white/[0.02] border border-emerald-500/20 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      Canlı Çözüm Adımları (Eğitmen Notu)
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Meet Akışı</span>
                  </div>

                  <div className="space-y-1.5 font-mono text-xs text-slate-300">
                    {currentLesson.steps.map((st, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">›</span>
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Teacher Cam Feed Overlay */}
                <div className="pt-2 flex items-center justify-between border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={currentLesson.teacherImg}
                        alt={currentLesson.teacher}
                        className="w-11 h-11 rounded-full object-cover border-2 border-amber-400 shadow-md"
                      />
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0B0F1C]" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{currentLesson.teacher}</span>
                        <Mic className="w-3 h-3 text-emerald-400" />
                      </div>
                      <div className="text-[11px] text-slate-400">{currentLesson.role}</div>
                    </div>
                  </div>

                  <Link
                    href="/demo-ders"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition-all"
                  >
                    <span>Dersi Dene</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── 2. REAL ALL-STAR INSTRUCTOR ROSTER (CANLI VİTRİN) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t border-white/[0.08]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
              <Award className="w-4 h-4" />
              <span>Sertifikalı Zümre Başkanları & Sınav Koçları</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Öğretmen Kadromuzla Tanışın
            </h2>
          </div>
          <Link
            href="/instructors"
            className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 group"
          >
            <span>Tüm Eğitmenleri Listele ({ALL_STAR_INSTRUCTORS.length}+ Aktif)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ALL_STAR_INSTRUCTORS.map((teacher, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#0B0F1C] border border-white/10 hover:border-amber-400/40 p-5 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-xl group"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="relative">
                    <img
                      src={teacher.avatar}
                      alt={teacher.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-white/10 shadow-md group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#0B0F1C]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base leading-tight group-hover:text-amber-300 transition-colors">
                      {teacher.name}
                    </h3>
                    <p className="text-xs text-amber-400/90 font-medium mt-0.5">{teacher.badge}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {teacher.tags.map((tg, i) => (
                    <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-white/[0.05] text-slate-300 border border-white/5">
                      {tg}
                    </span>
                  ))}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-normal mb-4">
                  "{teacher.highlight}"
                </p>
              </div>

              <Link
                href="/demo-ders"
                className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-amber-400 hover:text-slate-950 text-white font-bold text-xs text-center border border-white/10 hover:border-amber-400 transition-all"
              >
                Tanışma Randevusu Al
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. DERSOLAB VS. GELENEKSEL KURSLAR (NET VE SOMUT KARŞILAŞTIRMA) ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Neden Dershane Değil, <span className="text-amber-400">DersoLab?</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto font-normal">
            Eski usul kalabalık sınıflarda kaybolmak yerine, doğrudan kendi eksiklerine odaklanan modern eğitim modeli.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Geleneksel Kurslar Box */}
          <div className="p-8 rounded-3xl bg-rose-950/10 border border-rose-500/20 space-y-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-sm uppercase tracking-wider">
              <XCircle className="w-5 h-5 text-rose-400" />
              <span>Geleneksel Kurslar & Dershaneler</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">✕</span>
                <span>25-30 kişilik sınıflarda soru sormaya çekinen öğrenci profili.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Gitmediğin haftanın ders ücreti ve saati boşa gider, yanar.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Veli sadece dönem sonu notlarını görür; ders bazlı takip imkansızdır.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Trafikte ve yolda harcanan haftalık 6-8 saatlik çalışma vakti kaybı.</span>
              </li>
            </ul>
          </div>

          {/* DersoLab All-Star Box */}
          <div className="p-8 rounded-3xl bg-[#0D1424] border border-amber-400/30 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
              <span>DersoLab 1:1 All-Star Sistemi</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-200">
              <li className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold">✓</span>
                <span><strong>%100 Bire Bir Canlı:</strong> Öğretmen tüm dikkatiyle sadece senin eksiklerine odaklanır.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Yanmayan Ders Kredisi:</strong> Aldığın dersler hesabında kalır, ister yarın ister sınavdan 2 gün önce kullan.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-blue-400 font-bold">✓</span>
                <span><strong>Yazılı Veli Raporu:</strong> Her dersten sonra öğretmenin değerlendirme notu anında panele düşer.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-amber-400 font-bold">✓</span>
                <span><strong>7/24 Gemini Soru Desteği:</strong> Gece 23:00'te takıldığın soruya saniyeler içinde ipucu desteği.</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* ── 4. CONVERSION HERO CTA ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-amber-500/20 via-[#0E1528] to-orange-500/20 border border-amber-400/30 p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
              Sıfır Risk • Taahhüt Yok
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              20 Dakikalık Ücretsiz Tanışma Seansını Başlat
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-normal">
              Eğitmeninizle tanışın, hedeflerinizi paylaşın ve DersoLab'ın birebir canlı ders kalitesini ilk elden deneyimleyin.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/demo-ders"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/30 transition-all transform hover:scale-[1.02]"
            >
              <span>Ücretsiz Tanışma Seansını Al</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/instructors"
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-white font-bold text-base transition-all"
            >
              Eğitmenleri İncele
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 font-medium pt-2">
            <span>✓ Kredi kartı istenmez</span>
            <span>✓ 20 Dakika kesintisiz Meet seansı</span>
            <span>✓ Memnun kalmazsanız hiçbir yükümlülük yok</span>
          </div>
        </div>
      </section>

    </div>
  )
}
