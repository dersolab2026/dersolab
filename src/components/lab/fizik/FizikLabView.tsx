'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  Eye,
  Rocket,
  ArrowRight,
  Waves,
  Scale,
  Activity,
  School,
  GraduationCap,
  Sparkles,
  FileText,
  Columns,
  Wrench,
  Trophy,
  BookOpen,
} from 'lucide-react'
import { OpticsSimulator } from './OpticsSimulator'
import { ProjectileMotion } from './ProjectileMotion'
import { CircuitsSimulator } from './CircuitsSimulator'
import { NewtonDynamicsModule } from './NewtonDynamicsModule'
import { BuoyancyPressureModule } from './BuoyancyPressureModule'
import { HarmonicWaveModule } from './HarmonicWaveModule'
import { BranchNavHeader } from '../BranchNavHeader'
import { InteractiveLabSandbox } from '../shared/InteractiveLabSandbox'
import { LabChallengePanel, type LabChallenge } from '../shared/LabChallengePanel'
import { ExamQuestionCard, type ExamQuestion } from '../shared/ExamQuestionCard'
import { LabReportModal, type MeasurementRow } from '../shared/LabReportModal'
import { LabSplitScreenModal, type SplitStateScenario } from '../shared/LabSplitScreenModal'
import { DersoAISocraticAssistant } from '../shared/DersoAISocraticAssistant'
import { playClickSound } from '@/lib/soundFx'

export type FizikTabType =
  | 'circuits'
  | 'optics'
  | 'buoyancy'
  | 'newton'
  | 'projectile'
  | 'harmonic'
  | 'sandbox'

type GradeLevelFilter = 'all' | 'ortaokul' | 'lise'

export function FizikLabView() {
  const [levelFilter, setLevelFilter] = useState<GradeLevelFilter>('ortaokul')
  const [activeTab, setActiveTab] = useState<FizikTabType>('circuits')

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false)

  const ALL_MODULES = [
    // ── Ortaokul & Temel Fizik Üniteleri (7 - 8. Sınıf & LGS) ──
    {
      id: 'circuits' as FizikTabType,
      label: 'Elektrik Devresi & Ohm Yasası',
      level: 'ortaokul' as const,
      gradeBadge: '7-10. Sınıf',
      icon: Zap,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      activeBorder: 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/20',
      desc: 'Seri/paralel devreler, akan elektronlar, V = I · R ve lamba parlaklığı',
    },
    {
      id: 'buoyancy' as FizikTabType,
      label: 'Kaldırma Kuvveti & Basınç',
      level: 'ortaokul' as const,
      gradeBadge: '8. Sınıf LGS',
      icon: Waves,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      activeBorder: 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/20',
      desc: 'Arşimet prensibi, yoğunluk karşılaştırması (dc vs ds) ve sıvı basıncı (P = h·d·g)',
    },
    {
      id: 'optics' as FizikTabType,
      label: 'Mercekler & Işın İzleme (Optik)',
      level: 'ortaokul' as const,
      gradeBadge: '8-10. Sınıf',
      icon: Eye,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      activeBorder: 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.25)] ring-1 ring-blue-500/20',
      desc: 'İnce & kalın kenarlı mercekler, odak uzaklığı, ışığın kırılması ve sanal/gerçek görüntü',
    },

    // ── Lise & YKS/AYT Fizik Üniteleri (9 - 12. Sınıf) ──
    {
      id: 'newton' as FizikTabType,
      label: 'Newton Hareket Yasaları & Dinamik',
      level: 'lise' as const,
      gradeBadge: '9. & 11. Sınıf',
      icon: Scale,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      activeBorder: 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/20',
      desc: 'Fnet = m · a, sürtünmeli eğimli düzlem, serbest cisim diyagramı ve ivmeli hareket',
    },
    {
      id: 'projectile' as FizikTabType,
      label: 'Eğik Atış & Balistik Mekanik',
      level: 'lise' as const,
      gradeBadge: '11. Sınıf AYT',
      icon: Rocket,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      activeBorder: 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.25)] ring-1 ring-rose-500/20',
      desc: 'Fırlatma açısı, ilk hız bileşenleri, tepe noktası (hMax), uçuş süresi ve menzil',
    },
    {
      id: 'harmonic' as FizikTabType,
      label: 'Basit Harmonik Hareket & Dalgalar',
      level: 'lise' as const,
      gradeBadge: '12. Sınıf AYT',
      icon: Activity,
      badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
      activeBorder: 'border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.25)] ring-1 ring-violet-500/20',
      desc: 'T = 2π√(m/k) yay sarkacı, ipli sarkaç, dalga boyu ve enerji dönüşümü',
    },
    {
      id: 'sandbox' as FizikTabType,
      label: 'Serbest Deney Tezgâhı (Sandbox)',
      level: 'ortaokul' as const,
      gradeBadge: 'Serbest Mod',
      icon: Wrench,
      badgeColor: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
      activeBorder: 'border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.25)] ring-1 ring-amber-400/20',
      desc: 'Kendi elektrik devreni veya kimyasal reaksiyonunu sıfırdan kurup test et',
    },
  ]

  const visibleModules = ALL_MODULES.filter((m) => {
    if (levelFilter === 'all') return true
    return m.level === levelFilter || m.id === 'sandbox'
  })

  // ── CHALLENGES DATA FOR ACTIVE TOPIC ──
  const BUOYANCY_CHALLENGES: LabChallenge[] = [
    {
      id: 'buoyancy-c1',
      level: 'easy',
      title: 'Cismi Sıvıda Yüzdür',
      description: 'Cismin yoğunluğunu sıvının yoğunluğundan küçük tutarak cisme etki eden kaldırma kuvvetinin cisim ağırlığına eşit olmasını sağla.',
      targetMetric: 'dc < ds (Yüzen Cisim)',
      hint: 'Cisim yoğunluğu sürgüsünü 0.8 g/cm³ altına çekin veya sıvı yoğunluğunu artırın.',
      xp: 50,
      isCompleted: () => true,
    },
    {
      id: 'buoyancy-c2',
      level: 'medium',
      title: 'Sıvı Basıncını 2 Katına Çıkar',
      description: 'Sıvı derinliğini (h) artırarak tabana uygulanan hidrostatik sıvı basıncını 2000 Pa üzerine çıkar.',
      targetMetric: 'P_sıvı ≥ 2000 Pa',
      hint: 'P = h · d · g formülünde derinlik (h) ile basınç doğru orantılıdır.',
      xp: 100,
      isCompleted: () => true,
    },
    {
      id: 'buoyancy-c3',
      level: 'hard',
      title: 'LGS Derece: Ağır Sıvıda Askıda Kalma',
      description: 'Cismin yoğunluğu ile sıvının yoğunluğunu tam olarak eşitleyerek cismin askıda kalma dengesini yakala.',
      targetMetric: 'dc = ds (Fk = G)',
      hint: 'Her iki yoğunluk değeri birbirine eşit olduğunda batan hacim cismin tüm hacmine eşit olur.',
      xp: 150,
      isCompleted: () => true,
    },
  ]

  // ── EXAM QUESTIONS DATA ──
  const BUOYANCY_EXAM_QUESTION: ExamQuestion = {
    id: 'lgs-2023-kaldirma',
    exam: 'LGS',
    year: '2023',
    subject: 'Fen Bilimleri',
    topic: 'Madde ve Basınç / Sıvıların Kaldırma Kuvveti',
    questionText:
      'Özdeş K ve L cisimleri, yoğunlukları sırasıyla d ve 2d olan sıvılara bırakıldığında K cismi yüzmekte, L cismi ise sıvının tam ortasında askıda kalmaktadır. Buna göre cisimlere etki eden kaldırma kuvvetleri (F_K ve F_L) arasındaki ilişki nasıldır?',
    options: [
      { key: 'A', text: 'F_K > F_L çünkü K cismi yüzmektedir.' },
      { key: 'B', text: 'F_L > F_K çünkü L cisminin battığı sıvının yoğunluğu 2 kat daha fazladır.' },
      { key: 'C', text: 'F_K = F_L çünkü her iki durumda da kaldırma kuvveti cismin kendi ağırlığına eşittir.' },
      { key: 'D', text: 'F_K = 2 · F_L çünkü K cismi sıvı yüzeyine daha yakındır.' },
    ],
    correctKey: 'C',
    explanation:
      'Hem yüzen hem de askıda kalan cisimlerde düşeyde net kuvvet sıfırdır. Bu nedenle her iki durumda da kaldırma kuvveti cismin kendi ağırlığına (G) eşittir. Cisimler özdeş olduğundan (G_K = G_L), F_K = F_L olur. Sıvı yoğunluğunun farklı olması batan hacmi değiştirir, kaldırma kuvvetinin büyüklüğünü değiştirmez!',
    simulationTip:
      'Simülasyonda cisim yoğunluğunu 0.8 yapıp sıvıyı su (1.0) ve ardından yoğun tuzlu su (1.3) seçin. Her iki durumda da dinamometrenin 0 gösterdiğini ve Fk = G dengesini gözlemleyin!',
  }

  // ── SPLIT SCREEN SCENARIOS ──
  const BUOYANCY_SPLIT_SCENARIOS = {
    title: 'Kaldırma Kuvveti: Saf Su vs. Yoğun Cıva Karşılaştırması',
    stateA: {
      label: 'Saf Su Deneyi',
      subtitle: 'Standart Oda Koşulları (ds = 1.0 g/cm³)',
      badgeColor: 'border-blue-500/40 text-blue-300',
      params: [
        { name: 'Sıvı Yoğunluğu (ds)', value: '1.0', unit: 'g/cm³' },
        { name: 'Cisim Yoğunluğu (dc)', value: '2.5', unit: 'g/cm³' },
        { name: 'Cisim Hacmi (V)', value: '100', unit: 'cm³' },
        { name: 'Yerçekimi (g)', value: '10', unit: 'm/s²' },
      ],
      results: [
        { name: 'Cisim Ağırlığı (G)', value: '2.5', unit: 'N' },
        { name: 'Kaldırma Kuvveti (Fk)', value: '1.0', unit: 'N', highlight: true },
        { name: 'Dinamometre Değeri', value: '1.5', unit: 'N' },
        { name: 'Hareket Durumu', value: 'Tabana Batar', unit: '' },
      ],
      visualNote: 'Cisim yoğunluğu (2.5) sıvıdan (1.0) büyük olduğu için cisim dibe çöker ve dinamometrede 1.5 N net ağırlık kalır.',
    },
    stateB: {
      label: 'Yoğun Cıva Deneyi',
      subtitle: 'Ağır Sıvı Ortamı (ds = 13.6 g/cm³)',
      badgeColor: 'border-amber-500/40 text-amber-300',
      params: [
        { name: 'Sıvı Yoğunluğu (ds)', value: '13.6', unit: 'g/cm³' },
        { name: 'Cisim Yoğunluğu (dc)', value: '2.5', unit: 'g/cm³' },
        { name: 'Cisim Hacmi (V)', value: '100', unit: 'cm³' },
        { name: 'Yerçekimi (g)', value: '10', unit: 'm/s²' },
      ],
      results: [
        { name: 'Cisim Ağırlığı (G)', value: '2.5', unit: 'N' },
        { name: 'Kaldırma Kuvveti (Fk)', value: '2.5', unit: 'N', highlight: true },
        { name: 'Dinamometre Değeri', value: '0.0', unit: 'N' },
        { name: 'Hareket Durumu', value: 'Yüzer (Sıvı Üstü)', unit: '' },
      ],
      visualNote: 'Sıvı yoğunluğu (13.6) cisimden çok büyük olduğu için cisim batamaz, hacminin sadece %18.4 ü batarak yüzeyde yüzer.',
    },
    deltaInsights: [
      'Aynı cisim suda tabana batarken cıvada yüzeyde yüzer; çünkü sıvının yoğunluğu arttıkça birim hacme uygulanan kaldırma kuvveti katlanarak artar.',
      'Yüzen durumda dinamometredeki gerilme sıfırlanır; cisim ağırlığının tamamı kaldırma kuvveti tarafından dengelenir (G = Fk).',
      'LGS ve YKS Sınav Notu: Batan cisimlerde Fk < G iken, yüzen ve askıda kalan cisimlerde her zaman Fk = G bağıntısı geçerlidir.',
    ],
  }

  // ── REPORT MEASUREMENTS ──
  const CURRENT_MEASUREMENTS: MeasurementRow[] = [
    { parameter: 'Cisim Kütlesi (m)', value: '250', unit: 'gram', description: 'm = dc · V' },
    { parameter: 'Cisim Hacmi (V)', value: '100', unit: 'cm³', description: 'Taşırma kabı ile ölçülen hacim' },
    { parameter: 'Sıvı Özkütlesi (ds)', value: '1.0', unit: 'g/cm³', description: 'Saf Su referans değeri' },
    { parameter: 'Kaldırma Kuvveti (Fk)', value: '1.0', unit: 'Newton', description: 'Fk = V_batan · ds · g' },
    { parameter: 'Sıvı Derinliği (h)', value: '25', unit: 'cm', description: 'Dalgıç sensör mesafesi' },
    { parameter: 'Taban Sıvı Basıncı (P)', value: '2500', unit: 'Pascal', description: 'P = h · ds · g' },
  ]

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-blue-500 selection:text-slate-950 font-sans">
      {/* ── Background Glow Effects ── */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* ── Top Navigation Bar ── */}
      <BranchNavHeader currentBranch="fizik" />

      {/* ── Hero Banner ── */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-blue-950/20 via-slate-900/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-semibold mb-3">
                <Zap className="w-3.5 h-3.5" />
                DersoLab L.A.B. — Fizik Laboratuvarı
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                FizikLab —{' '}
                <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-sky-400 bg-clip-text text-transparent">
                  Görsel & İnteraktif Deney Alanı
                </span>
              </h1>
              <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
                Milli Eğitim müfredatındaki tüm fizik üniteleri için interaktif sanal deneyler: Kaldırma kuvveti, elektrik devreleri, optik kırılma, Newton dinamik yasaları, eğik atış ve dalga mekaniği.
              </p>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => {
                  playClickSound()
                  setIsReportModalOpen(true)
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-amber-300 text-xs font-bold transition-all shadow-md cursor-pointer hover:border-amber-400/40"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>MEB Deney Raporu (PDF)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound()
                  setIsSplitModalOpen(true)
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 text-xs font-bold transition-all shadow-md cursor-pointer hover:border-cyan-400/40"
              >
                <Columns className="w-4 h-4 text-cyan-400" />
                <span>Karşılaştırma Modu</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playClickSound()
                  setActiveTab('sandbox')
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-amber-400" />
                <span>Serbest Tezgâh</span>
              </button>
            </div>
          </div>

          {/* Level Filter Switcher */}
          <div className="mt-6 flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-slate-800/60">
            <div className="flex items-center p-1 rounded-2xl bg-slate-950/80 border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  playClickSound()
                  setLevelFilter('ortaokul')
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  levelFilter === 'ortaokul'
                    ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <School className="w-4 h-4" />
                <span>Ortaokul & LGS (7 - 8. Sınıf)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound()
                  setLevelFilter('lise')
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  levelFilter === 'lise'
                    ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Lise & YKS/AYT (9 - 12. Sınıf)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound()
                  setLevelFilter('all')
                }}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  levelFilter === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tümü (7)
              </button>
            </div>
          </div>

          {/* Module Selector Tabs */}
          <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3">
            {visibleModules.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playClickSound()
                    setActiveTab(tab.id)
                  }}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? `bg-slate-800 text-white ${tab.activeBorder}`
                      : 'bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${tab.badgeColor}`}
                  >
                    {tab.gradeBadge}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Active Module Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <AnimatePresence mode="wait">
          {activeTab === 'circuits' && (
            <motion.div
              key="circuits"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <CircuitsSimulator />
            </motion.div>
          )}

          {activeTab === 'buoyancy' && (
            <motion.div
              key="buoyancy"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <BuoyancyPressureModule />
            </motion.div>
          )}

          {activeTab === 'optics' && (
            <motion.div
              key="optics"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <OpticsSimulator />
            </motion.div>
          )}

          {activeTab === 'newton' && (
            <motion.div
              key="newton"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <NewtonDynamicsModule />
            </motion.div>
          )}

          {activeTab === 'projectile' && (
            <motion.div
              key="projectile"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <ProjectileMotion />
            </motion.div>
          )}

          {activeTab === 'harmonic' && (
            <motion.div
              key="harmonic"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <HarmonicWaveModule />
            </motion.div>
          )}

          {activeTab === 'sandbox' && (
            <motion.div
              key="sandbox"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <InteractiveLabSandbox />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── INTERACTIVE ENHANCEMENT SECTION (Challenges + Exam Question + Socratic AI) ── */}
        {activeTab !== 'sandbox' && (
          <div className="space-y-6 pt-4 border-t border-slate-800">
            {/* 1. Görev & Meydan Okuma Sistemi (Challenges) */}
            <LabChallengePanel
              moduleKey={`fizik_${activeTab}`}
              moduleTitle="Kaldırma Kuvveti & Sıvı Basıncı"
              challenges={BUOYANCY_CHALLENGES}
              currentState={{ dc: 0.8, ds: 1.0, h: 25, V: 100 }}
            />

            {/* 2. Çıkmış Soru Entegrasyonu (LGS & YKS) */}
            <ExamQuestionCard question={BUOYANCY_EXAM_QUESTION} />

            {/* 3. DersoAI Sokratik Deney Asistanı */}
            <DersoAISocraticAssistant
              branch="Fizik"
              moduleTitle="Kaldırma Kuvveti & Basınç Simülatörü"
              currentState={{
                'Cisim Yoğunluğu (dc)': '0.8 g/cm³',
                'Sıvı Yoğunluğu (ds)': '1.0 g/cm³',
                'Kaldırma Kuvveti (Fk)': '1.0 N',
                'Sıvı Basıncı (P)': '2500 Pa',
              }}
            />
          </div>
        )}
      </main>

      {/* ── MODALS ── */}
      <LabReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        branch="Fizik (8. Sınıf LGS / 10. Sınıf)"
        experimentTitle="Kaldırma Kuvveti ve Sıvı Basıncının İncelenmesi"
        measurements={CURRENT_MEASUREMENTS}
        independentVar="Cismin Batan Hacmi ve Sıvı Özkütlesi"
        dependentVar="Dinamometredeki Hafifleme (Kaldırma Kuvveti Fk)"
        controlledVars="Yerçekimi ivmesi (g = 10 m/s²), Sıvı Sıcaklığı"
      />

      <LabSplitScreenModal
        isOpen={isSplitModalOpen}
        onClose={() => setIsSplitModalOpen(false)}
        title={BUOYANCY_SPLIT_SCENARIOS.title}
        branch="Fizik"
        stateA={BUOYANCY_SPLIT_SCENARIOS.stateA}
        stateB={BUOYANCY_SPLIT_SCENARIOS.stateB}
        deltaInsights={BUOYANCY_SPLIT_SCENARIOS.deltaInsights}
      />

      {/* ── Bottom Switcher to Next Branch ── */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            DersoLab Fizik Laboratuvarı — MEB Müfredatı İnteraktif Deneyler, Görev Sistemi ve Sokratik AI Koçu.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link
              href="/lab/kimya"
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              &larr; KimyaLab
            </Link>
            <span className="text-slate-700">|</span>
            <Link
              href="/lab/matematik"
              className="text-slate-400 hover:text-violet-400 transition-colors flex items-center gap-1"
            >
              MatematikLab'a Geç &rarr;
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
