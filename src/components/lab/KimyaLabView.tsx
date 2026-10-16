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
} from 'lucide-react'
import { PeriodicTableModule } from './PeriodicTableModule'
import { TitrationModule } from './TitrationModule'
import { ChemistryGameModule } from './ChemistryGameModule'
import { MolCalculatorModule } from './MolCalculatorModule'
import { GasLawsModule } from './GasLawsModule'
import { ReactionRateEquilibriumModule } from './ReactionRateEquilibriumModule'
import { BranchNavHeader } from './BranchNavHeader'

export type KimyaTabType =
  | 'periodic'
  | 'gas_laws'
  | 'titration'
  | 'equilibrium'
  | 'calculator'
  | 'game'

type GradeLevelFilter = 'all' | 'ortaokul' | 'lise'

export function KimyaLabView() {
  const [levelFilter, setLevelFilter] = useState<GradeLevelFilter>('ortaokul')
  const [activeTab, setActiveTab] = useState<KimyaTabType>('periodic')

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
  ]

  const visibleModules = ALL_MODULES.filter((m) => {
    if (levelFilter === 'all') return true
    return m.level === levelFilter
  })

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

            {/* Quick Stats Pill */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md self-start md:self-auto">
              <div className="px-3 py-1 text-center">
                <div className="text-lg font-bold text-cyan-400">6</div>
                <div className="text-[11px] text-slate-400">Sanal Modül</div>
              </div>
              <div className="px-3 py-1 text-center border-x border-slate-800">
                <div className="text-lg font-bold text-teal-400">3D Bohr</div>
                <div className="text-[11px] text-slate-400">WebGL & Kinetik</div>
              </div>
              <div className="px-3 py-1 text-center">
                <div className="text-lg font-bold text-emerald-400">Maarif</div>
                <div className="text-[11px] text-slate-400">7-12. Sınıf</div>
              </div>
            </div>
          </div>

          {/* Level Filter Switcher */}
          <div className="mt-6 flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-slate-800/60">
            <div className="flex items-center p-1 rounded-2xl bg-slate-950/80 border border-slate-800">
              <button
                type="button"
                onClick={() => setLevelFilter('ortaokul')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
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
                onClick={() => setLevelFilter('lise')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
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
                onClick={() => setLevelFilter('all')}
                className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  levelFilter === 'all'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Tümü (6)
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
                  onClick={() => setActiveTab(tab.id)}
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
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom Callout: Convert Student to Lesson ── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-emerald-950/40 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
              <Image
                src="/fox-head.png"
                alt="DersoLab Maskot"
                width={16}
                height={16}
                className="w-3.5 h-3.5 object-contain"
              />
              <span>DersoLab Bire Bir Kimya Atölyesi</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Kimyayı Ezberleme, Mantığıyla Öğren.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Simülasyonlarda gördüğün Bohr atom modelini, ideal gaz pistonunu, asit-baz titrasyonunu ve Le Chatelier dengesini onaylı kimya öğretmenlerimizle bire bir derste pekiştir.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/instructors?subject=Kimya"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Kimya Öğretmenlerini Keşfet</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        DersoLab L.A.B. • Türkiye Yüzyılı Maarif Modeli, Ortaokul & Lise Müfredatına Uygun 6 Kimya Simülasyonu
      </footer>
    </div>
  )
}
