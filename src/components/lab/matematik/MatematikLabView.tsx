'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Calculator,
  Compass,
  Activity,
  Triangle,
  Scale,
  Thermometer,
  PieChart,
  GraduationCap,
  Sparkles,
  School,
  ArrowRight,
} from 'lucide-react'
import { TrigCircle } from './TrigCircle'
import { DerivativeTangent } from './DerivativeTangent'
import { PythagorasSlopeModule } from './PythagorasSlopeModule'
import { EquationBalanceModule } from './EquationBalanceModule'
import { IntegersModule } from './IntegersModule'
import { FractionsLabModule } from './FractionsLabModule'
import { BranchNavHeader } from '../BranchNavHeader'

export type MathTabType =
  | 'pythagoras'
  | 'equation'
  | 'integers'
  | 'fractions'
  | 'trig'
  | 'derivative'

type GradeLevelFilter = 'all' | 'ortaokul' | 'lise'

export function MatematikLabView() {
  const [levelFilter, setLevelFilter] = useState<GradeLevelFilter>('ortaokul')
  const [activeTab, setActiveTab] = useState<MathTabType>('pythagoras')

  const ALL_MODULES = [
    // ── Ortaokul Modülleri (5 - 8. Sınıf & LGS) ──
    {
      id: 'pythagoras' as MathTabType,
      label: 'Pisagor Bağıntısı & Eğim',
      level: 'ortaokul' as const,
      gradeBadge: '8. Sınıf LGS',
      icon: Triangle,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      activeBorder: 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/20',
      desc: 'a² + b² = c² geometrik alan ispatı, özel üçgenler ve m = Δy/Δx koordinat eğimi',
    },
    {
      id: 'equation' as MathTabType,
      label: 'Denklem Terazisi & Eşitlik',
      level: 'ortaokul' as const,
      gradeBadge: '7. Sınıf',
      icon: Scale,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      activeBorder: 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/20',
      desc: 'Eşit kollu terazi, eşitliğin korunumu ve adım adım 1. dereceden denklem çözümü',
    },
    {
      id: 'integers' as MathTabType,
      label: 'Tam Sayılar & Sayı Doğrusu',
      level: 'ortaokul' as const,
      gradeBadge: '6. Sınıf',
      icon: Thermometer,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      activeBorder: 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.25)] ring-1 ring-blue-500/20',
      desc: 'Yönlü sayılar, termometre, deniz seviyesi irtifası, mutlak değer ve sayı pulları',
    },
    {
      id: 'fractions' as MathTabType,
      label: 'Kesirler & Pasta/Şerit Modeli',
      level: 'ortaokul' as const,
      gradeBadge: '5. Sınıf',
      icon: PieChart,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      activeBorder: 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/20',
      desc: 'Birim kesir, basit/bileşik/tam sayılı kesirler ve denk kesir genişletmesi',
    },

    // ── Lise Modülleri (11 - 12. Sınıf & YKS/AYT) ──
    {
      id: 'trig' as MathTabType,
      label: 'Trigonometrik Birim Çember (360°)',
      level: 'lise' as const,
      gradeBadge: '11. Sınıf Lise',
      icon: Compass,
      badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
      activeBorder: 'border-violet-500/50 shadow-[0_0_15px_rgba(139,92,246,0.25)] ring-1 ring-violet-500/20',
      desc: 'Sin, cos, tan eksen izdüşümleri, bölgeler ve canlı sinüs dalgası oluşumu',
    },
    {
      id: 'derivative' as MathTabType,
      label: 'Türev & Teğet Simülatörü',
      level: 'lise' as const,
      gradeBadge: '12. Sınıf AYT',
      icon: Activity,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      activeBorder: 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.25)] ring-1 ring-purple-500/20',
      desc: 'Teğet doğrusu eğimi m = f\'(x), yerel ekstremum f\'(x) = 0 tepe tespiti',
    },
  ]

  // Filter modules based on selected grade level
  const displayedModules = ALL_MODULES.filter((m) => {
    if (levelFilter === 'all') return true
    return m.level === levelFilter
  })

  // Handle grade level filter switch
  const handleLevelFilterChange = (lvl: GradeLevelFilter) => {
    setLevelFilter(lvl)
    if (lvl === 'ortaokul' && !['pythagoras', 'equation', 'integers', 'fractions'].includes(activeTab)) {
      setActiveTab('pythagoras')
    } else if (lvl === 'lise' && !['trig', 'derivative'].includes(activeTab)) {
      setActiveTab('trig')
    }
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-violet-500 selection:text-slate-950 font-sans">
      {/* ── Background Glow Effects ── */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/4 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* ── Top Navigation Bar ── */}
      <BranchNavHeader currentBranch="matematik" />

      {/* ── Hero Banner ── */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-violet-950/20 via-slate-900/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold mb-3">
                <Calculator className="w-3.5 h-3.5" />
                DersoLab L.A.B. — Matematik Laboratuvarı
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                MatematikLab —{' '}
                <span className="bg-gradient-to-r from-violet-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent">
                  Kademeli & MEB Maarif Modeli Laboratuvarı
                </span>
              </h1>
              <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
                Her sınıf seviyesine özel hazırlanmış somutlaştırılmış matematik simülasyonları: 5. sınıf kesirlerinden 8. sınıf LGS Pisagor ve eğimine, 11. sınıf birim çemberinden 12. sınıf AYT türevine kadar tam müfredat uyumlu.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md self-start md:self-auto">
              <div className="px-3 py-1 text-center">
                <div className="text-lg font-bold text-violet-400">6</div>
                <div className="text-[11px] text-slate-400">Sanal Atölye</div>
              </div>
              <div className="px-3 py-1 text-center border-x border-slate-800">
                <div className="text-lg font-bold text-amber-400">5-8. Sınıf</div>
                <div className="text-[11px] text-slate-400">Ortaokul LGS</div>
              </div>
              <div className="px-3 py-1 text-center">
                <div className="text-lg font-bold text-emerald-400">9-12. Sınıf</div>
                <div className="text-[11px] text-slate-400">Lise YKS/AYT</div>
              </div>
            </div>
          </div>

          {/* ── Grade Level Filter (Ortaokul vs Lise) ── */}
          <div className="mt-8 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/90 border border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 px-2">Kademe:</span>
              <button
                onClick={() => handleLevelFilterChange('ortaokul')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  levelFilter === 'ortaokul'
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <School className="w-3.5 h-3.5" />
                <span>🎒 Ortaokul (5, 6, 7, 8. Sınıf & LGS)</span>
              </button>

              <button
                onClick={() => handleLevelFilterChange('lise')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  levelFilter === 'lise'
                    ? 'bg-violet-500 text-slate-950 shadow-md shadow-violet-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>🎓 Lise (11 & 12. Sınıf AYT)</span>
              </button>

              <button
                onClick={() => handleLevelFilterChange('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  levelFilter === 'all'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                🌟 Tüm Sınıflar (5-12)
              </button>
            </div>

            <div className="text-xs text-slate-400">
              {levelFilter === 'ortaokul' ? (
                <span className="text-amber-300 font-semibold">
                  🎒 Ortaokul Müfredatı: Kesirler, Tam Sayılar, Denklem Terazisi ve Pisagor/Eğim gösteriliyor.
                </span>
              ) : levelFilter === 'lise' ? (
                <span className="text-violet-300 font-semibold">
                  🎓 Lise Müfredatı: 11. Sınıf Trigonometri ve 12. Sınıf AYT Türevi gösteriliyor.
                </span>
              ) : (
                <span>Tüm kademelerdeki 6 matematik simülasyonu listeleniyor.</span>
              )}
            </div>
          </div>

          {/* Module Selector Tabs */}
          <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3">
            {displayedModules.map((tab) => {
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
                  <Icon className={`w-4 h-4 ${isActive ? 'text-violet-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${
                      tab.badgeColor
                    }`}
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'pythagoras' && (
            <motion.div
              key="pythagoras"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <PythagorasSlopeModule />
            </motion.div>
          )}

          {activeTab === 'equation' && (
            <motion.div
              key="equation"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <EquationBalanceModule />
            </motion.div>
          )}

          {activeTab === 'integers' && (
            <motion.div
              key="integers"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <IntegersModule />
            </motion.div>
          )}

          {activeTab === 'fractions' && (
            <motion.div
              key="fractions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <FractionsLabModule />
            </motion.div>
          )}

          {activeTab === 'trig' && (
            <motion.div
              key="trig"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <TrigCircle />
            </motion.div>
          )}

          {activeTab === 'derivative' && (
            <motion.div
              key="derivative"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <DerivativeTangent />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Bottom Switcher to Next Branch ── */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            DersoLab Matematik Laboratuvarı — Maarif Modeli 5-8. sınıf ortaokul ve 9-12. sınıf lise kazanımları.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link
              href="/lab/fizik"
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              &larr; FizikLab
            </Link>
            <span className="text-slate-700">|</span>
            <Link
              href="/lab/biyoloji"
              className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              BiyolojiLab'a Geç &rarr;
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
