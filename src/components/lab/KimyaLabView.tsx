'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  Droplet,
  Gamepad2,
  Calculator,
  ArrowRight,
  GraduationCap,
  FlaskConical,
  Atom,
  Wind,
  Activity,
  School,
  Sparkles,
  FileText,
  Columns,
  Wrench,
  Trophy,
} from 'lucide-react'
import { PeriodicTableModule } from './PeriodicTableModule'
import { TitrationModule } from './TitrationModule'
import { ChemistryGameModule } from './ChemistryGameModule'
import { MolCalculatorModule } from './MolCalculatorModule'
import { GasLawsModule } from './GasLawsModule'
import { ReactionRateEquilibriumModule } from './ReactionRateEquilibriumModule'
import { BranchNavHeader } from './BranchNavHeader'
import { InteractiveLabSandbox } from './shared/InteractiveLabSandbox'
import { LabChallengePanel, type LabChallenge } from './shared/LabChallengePanel'
import { ExamQuestionCard, type ExamQuestion } from './shared/ExamQuestionCard'
import { LabReportModal, type MeasurementRow } from './shared/LabReportModal'
import { LabSplitScreenModal } from './shared/LabSplitScreenModal'
import { DersoAISocraticAssistant } from './shared/DersoAISocraticAssistant'
import { playClickSound } from '@/lib/soundFx'

export type KimyaTabType =
  | 'periodic'
  | 'gas_laws'
  | 'titration'
  | 'equilibrium'
  | 'calculator'
  | 'game'
  | 'sandbox'

type GradeLevelFilter = 'all' | 'ortaokul' | 'lise'

export function KimyaLabView() {
  const [levelFilter, setLevelFilter] = useState<GradeLevelFilter>('ortaokul')
  const [activeTab, setActiveTab] = useState<KimyaTabType>('periodic')

  // Modals state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false)

  const ALL_MODULES = [
    // ── Ortaokul & Temel Kimya Üniteleri (7 - 8. Sınıf & LGS) ──
    {
      id: 'periodic' as KimyaTabType,
      label: 'Periyodik Tablo & 3D Bohr Atom',
      level: 'ortaokul' as const,
      gradeBadge: '7-9. Sınıf',
      icon: Atom,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      activeBorder: 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/20',
      desc: 'Katman elektron dağılımı (2-8-8 kuralı), grup-periyot tespiti ve 3D atom modeli',
    },
    {
      id: 'titration' as KimyaTabType,
      label: 'Sanal Asit-Baz Titrasyonu & pH',
      level: 'ortaokul' as const,
      gradeBadge: '8. Sınıf LGS',
      icon: Droplet,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      activeBorder: 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/20',
      desc: 'Büret musluğuyla damla damla titrasyon, fenolftalein dönüm noktası ve pH cetveli (0-14)',
    },
    {
      id: 'game' as KimyaTabType,
      label: 'Günün Elementi (Kimya-Le)',
      level: 'ortaokul' as const,
      gradeBadge: 'Keşif & Oyun',
      icon: Gamepad2,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      activeBorder: 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/20',
      desc: 'Element ipuçlarıyla günlük element bulmaca ve grup özelliklerini pekiştirme',
    },

    // ── Lise & YKS Kimya Üniteleri (10 - 11. Sınıf) ──
    {
      id: 'gas_laws' as KimyaTabType,
      label: 'İdeal Gaz Yasaları & Pistonlu Kap',
      level: 'lise' as const,
      gradeBadge: '11. Sınıf AYT',
      icon: Wind,
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      activeBorder: 'border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.25)] ring-1 ring-sky-500/20',
      desc: 'P · V = n · R · T, hareketli piston, sıcaklık ateşi, Boyle, Charles ve Gay-Lussac yasaları',
    },
    {
      id: 'equilibrium' as KimyaTabType,
      label: 'Tepkime Hızı & Le Chatelier Dengesi',
      level: 'lise' as const,
      gradeBadge: '11. Sınıf AYT',
      icon: Activity,
      badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
      activeBorder: 'border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.25)] ring-1 ring-violet-500/20',
      desc: 'Aktivasyon enerjisi (Eai, Eag), katalizör etkisi ve Haber-Bosch denge kaymaları',
    },
    {
      id: 'calculator' as KimyaTabType,
      label: 'Mol & Çözelti Konsantrasyon Aracı',
      level: 'lise' as const,
      gradeBadge: '10. Sınıf TYT/AYT',
      icon: Calculator,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      activeBorder: 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.25)] ring-1 ring-indigo-500/20',
      desc: 'M = n/V molarite, kütlece yüzde derişim ve çözelti seyreltme hesaplayıcı',
    },
    {
      id: 'sandbox' as KimyaTabType,
      label: 'Serbest Kimya Masası (Sandbox)',
      level: 'ortaokul' as const,
      gradeBadge: 'Serbest Mod',
      icon: Wrench,
      badgeColor: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30',
      activeBorder: 'border-emerald-400/50 shadow-[0_0_15px_rgba(52,211,153,0.25)] ring-1 ring-emerald-400/20',
      desc: 'Behere asit, baz, indikatör ve çinko ekleyerek ekzotermik reaksiyonları gözlemle',
    },
  ]

  const visibleModules = ALL_MODULES.filter((m) => {
    if (levelFilter === 'all') return true
    return m.level === levelFilter || m.id === 'sandbox'
  })

  // ── CHEMISTRY CHALLENGES ──
  const CHEMISTRY_CHALLENGES: LabChallenge[] = [
    {
      id: 'chem-c1',
      level: 'easy',
      title: 'Boyle Yasası Basınç Artışı',
      description: 'Pistonu sıkıştırarak veya molekül ekleyerek gaz basıncını 2.0 atm değerinin üzerine çıkar.',
      targetMetric: 'P ≥ 2.0 atm',
      hint: 'Hacim küçüldükçe birim yüzeye çarpan gaz molekülü sayısı artar, dolayısıyla basınç yükselir.',
      xp: 50,
      isCompleted: () => true,
    },
    {
      id: 'chem-c2',
      level: 'medium',
      title: 'Charles Yasası: Termal Genleşme',
      description: 'Isıtıcı alevini artırarak gaz sıcaklığını 500 Kelvin üzerine çıkar ve pistonun yükselişini izle.',
      targetMetric: 'T ≥ 500 K',
      hint: 'V / T = sabit bağıntısına göre mutlak sıcaklık arttıkça kinetik enerji ve hacim artar.',
      xp: 100,
      isCompleted: () => true,
    },
    {
      id: 'chem-c3',
      level: 'hard',
      title: 'AYT Derece: Sabit Basınçta Maksimum İş',
      description: 'Serbest pistonlu kapta sıcaklığı artırırken gazın dış basınca karşı yaptığı genleşme işini maksimize et.',
      targetMetric: 'W = P · ΔV (Pozitif İş)',
      hint: 'Piston serbestken basınç daima dış basınca eşit kalır (P = sabit); hacim sıcaklıkla doğrusal genişler.',
      xp: 150,
      isCompleted: () => true,
    },
  ]

  // ── CHEMISTRY EXAM QUESTION ──
  const CHEMISTRY_EXAM_QUESTION: ExamQuestion = {
    id: 'ayt-2023-gazlar',
    exam: 'AYT',
    year: '2023',
    subject: 'Kimya',
    topic: 'Gazlar / İdeal Gaz Yasası ve Kinetik Teori',
    questionText:
      'Sürtünmesiz ideal hareketli bir pistona sahip kapalı bir kapta 1 mol ideal He gazı bulunmaktadır. Bu kaba sıcaklık sabit tutularak 1 mol daha He gazı ilave edilirse; I. Gaz basıncı, II. Gaz hacmi, III. Birim hacimdeki tanecik sayısı niceliklerinden hangileri değişmez?',
    options: [
      { key: 'A', text: 'Yalnız I' },
      { key: 'B', text: 'Yalnız II' },
      { key: 'C', text: 'I ve III' },
      { key: 'D', text: 'II ve III' },
      { key: 'E', text: 'I, II ve III' },
    ],
    correctKey: 'C',
    explanation:
      'İdeal sürtünmesiz pistonlu kaplarda iç basınç her zaman dış basınca eşittir. Bu nedenle mol sayısı 2 katına çıktığında gaz hacmi de 2 katına çıkar (V1/n1 = V2/n2). Basınç değişmez (I değişmez). Birim hacimdeki tanecik sayısı n/V oranıdır; hem n hem V iki katına çıktığı için n/V oranı da sabit kalır (III değişmez). Gaz hacmi ise 2 katına çıkar.',
    simulationTip:
      'Simülasyonda hareketli piston moduna geçin. Sıcaklığı sabit tutup mol sayısını 1 molden 2 mole çıkarın. Basıncın 1.0 atm sabit kaldığını ve hacmin tam 2 katına çıktığını canlı piston animasyonunda görün!',
  }

  // ── SPLIT SCREEN SCENARIOS ──
  const CHEMISTRY_SPLIT_SCENARIOS = {
    title: 'İdeal Gazlar: Oda Sıcaklığı (300K) vs. Isıtılmış Kap (600K)',
    stateA: {
      label: 'Oda Sıcaklığı (300 K)',
      subtitle: 'Standart Kinetik Enerji',
      badgeColor: 'border-cyan-500/40 text-cyan-300',
      params: [
        { name: 'Sıcaklık (T)', value: '300', unit: 'Kelvin' },
        { name: 'Madde Miktarı (n)', value: '1.0', unit: 'mol' },
        { name: 'Hacim (V)', value: '22.4', unit: 'Litre' },
        { name: 'Ortalama Hız (v_ort)', value: '450', unit: 'm/s' },
      ],
      results: [
        { name: 'Gaz Basıncı (P)', value: '1.0', unit: 'atm' },
        { name: 'Ortalama Kinetik Enerji', value: '3.74', unit: 'kJ/mol' },
        { name: 'Çarpışma Frekansı', value: 'Standart', unit: '' },
      ],
      visualNote: 'Moleküller orta hızda hareket etmekte ve piston dengede kalmaktadır.',
    },
    stateB: {
      label: 'Isıtılmış Kap (600 K)',
      subtitle: 'Yüksek Termal Enerji (T 2 Katına Çıktı)',
      badgeColor: 'border-amber-500/40 text-amber-300',
      params: [
        { name: 'Sıcaklık (T)', value: '600', unit: 'Kelvin' },
        { name: 'Madde Miktarı (n)', value: '1.0', unit: 'mol' },
        { name: 'Hacim (V)', value: '44.8', unit: 'Litre' },
        { name: 'Ortalama Hız (v_ort)', value: '636', unit: 'm/s' },
      ],
      results: [
        { name: 'Gaz Basıncı (P)', value: '1.0', unit: 'atm' },
        { name: 'Ortalama Kinetik Enerji', value: '7.48', unit: 'kJ/mol', highlight: true },
        { name: 'Çarpışma Şiddeti', value: '2 Kat Şiddetli', unit: '' },
      ],
      visualNote: 'Sıcaklık 2 katına çıktığında ortalama kinetik enerji de tam 2 katına çıkar; hareketli piston yukarı itilerek hacim genişler.',
    },
    deltaInsights: [
      'Gazların ortalama kinetik enerjisi yalnızca mutlak sıcaklığa (Kelvin) bağlıdır (Ek = 3/2 · k · T). Sıcaklık 300 K\'den 600 K\'e çıktığında kinetik enerji tam 2 katına çıkar.',
      'Moleküllerin ortalama difüzyon hızı sıcaklığın kareköküyle orantılıdır (√600 / √300 = √2 ≈ 1.41 kat artar).',
      'Hareketli pistonlu kapta dış basınç sabit kaldığından, Charles Yasası gereği hacim de 22.4 L\'den 44.8 L\'ye fırlar.',
    ],
  }

  const CHEMISTRY_MEASUREMENTS: MeasurementRow[] = [
    { parameter: 'Gaz Basıncı (P)', value: '1.0', unit: 'atm', description: 'P = n·R·T / V' },
    { parameter: 'Gaz Hacmi (V)', value: '24.6', unit: 'Litre', description: 'Piston gösterge hacmi' },
    { parameter: 'Madde Miktarı (n)', value: '1.0', unit: 'mol He', description: 'Kaba eklenen ideal gaz' },
    { parameter: 'Mutlak Sıcaklık (T)', value: '300', unit: 'Kelvin', description: 'Termometre okuması' },
    { parameter: 'İdeal Gaz Sabiti (R)', value: '0.0821', unit: 'L·atm/(mol·K)', description: 'Evrensel gaz sabiti' },
  ]

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* ── Background Glow Effects ── */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* ── Top Navigation Bar ── */}
      <BranchNavHeader currentBranch="kimya" />

      {/* ── Hero Banner ── */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-cyan-950/20 via-slate-900/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
                <FlaskConical className="w-3.5 h-3.5" />
                DersoLab L.A.B. — Kimya Laboratuvarı
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                KimyaLab —{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                  İnteraktif Kimya Simülasyonları
                </span>
              </h1>
              <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
                Milli Eğitim müfredatındaki tüm kimya üniteleri: 3D Bohr atom modeli, asit-baz titrasyon deneyi, ideal gaz yasaları, tepkime hız-denge eğrileri ve mol hesaplayıcı.
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
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Wrench className="w-4 h-4 text-emerald-400" />
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
                    ? 'bg-cyan-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]'
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
                    ? 'bg-cyan-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Lise & YKS/AYT (10 - 11. Sınıf)</span>
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
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
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

      {/* ── Main Content Container ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'periodic' && <PeriodicTableModule />}
            {activeTab === 'gas_laws' && <GasLawsModule />}
            {activeTab === 'titration' && <TitrationModule />}
            {activeTab === 'equilibrium' && <ReactionRateEquilibriumModule />}
            {activeTab === 'game' && <ChemistryGameModule />}
            {activeTab === 'calculator' && <MolCalculatorModule />}
            {activeTab === 'sandbox' && <InteractiveLabSandbox />}
          </motion.div>
        </AnimatePresence>

        {/* ── ENHANCEMENT SUITE (Challenges, Exam Question & Socratic AI) ── */}
        {activeTab !== 'sandbox' && (
          <div className="space-y-6 pt-4 border-t border-slate-800">
            {/* Challenges */}
            <LabChallengePanel
              moduleKey={`kimya_${activeTab}`}
              moduleTitle="İdeal Gaz Yasaları & Pistonlu Kap"
              challenges={CHEMISTRY_CHALLENGES}
              currentState={{ P: 1.0, V: 24.6, T: 300, n: 1.0 }}
            />

            {/* Exam Question */}
            <ExamQuestionCard question={CHEMISTRY_EXAM_QUESTION} />

            {/* Socratic AI Coach */}
            <DersoAISocraticAssistant
              branch="Kimya"
              moduleTitle="İdeal Gaz Yasaları Simülatörü"
              currentState={{
                'Basınç (P)': '1.0 atm',
                'Hacim (V)': '24.6 L',
                'Sıcaklık (T)': '300 K',
                'Mol Sayısı (n)': '1.0 mol',
              }}
            />
          </div>
        )}
      </main>

      {/* ── MODALS ── */}
      <LabReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        branch="Kimya (11. Sınıf AYT)"
        experimentTitle="İdeal Gazlarda Basınç-Hacim-Sıcaklık İlişkisinin İncelenmesi"
        measurements={CHEMISTRY_MEASUREMENTS}
        independentVar="Gazın Sıcaklığı (T) ve Mol Miktarı (n)"
        dependentVar="Gazın Hacmi (V) ve Basıncı (P)"
        controlledVars="İdeal Gaz Sabiti (R = 0.0821), Atmosferik Dış Basınç"
      />

      <LabSplitScreenModal
        isOpen={isSplitModalOpen}
        onClose={() => setIsSplitModalOpen(false)}
        title={CHEMISTRY_SPLIT_SCENARIOS.title}
        branch="Kimya"
        stateA={CHEMISTRY_SPLIT_SCENARIOS.stateA}
        stateB={CHEMISTRY_SPLIT_SCENARIOS.stateB}
        deltaInsights={CHEMISTRY_SPLIT_SCENARIOS.deltaInsights}
      />

      {/* ── Footer ── */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        DersoLab L.A.B. • Türkiye Yüzyılı Maarif Modeli, Ortaokul & Lise Müfredatına Uygun 7 Kimya Simülasyonu
      </footer>
    </div>
  )
}
