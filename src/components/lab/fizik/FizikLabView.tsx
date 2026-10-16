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
} from 'lucide-react'
import { OpticsSimulator } from './OpticsSimulator'
import { ProjectileMotion } from './ProjectileMotion'
import { CircuitsSimulator } from './CircuitsSimulator'
import { NewtonDynamicsModule } from './NewtonDynamicsModule'
import { BuoyancyPressureModule } from './BuoyancyPressureModule'
import { HarmonicWaveModule } from './HarmonicWaveModule'
import { BranchNavHeader } from '../BranchNavHeader'

export type FizikTabType =
  | 'circuits'
  | 'optics'
  | 'buoyancy'
  | 'newton'
  | 'projectile'
  | 'harmonic'

type GradeLevelFilter = 'all' | 'ortaokul' | 'lise'

export function FizikLabView() {
  const [levelFilter, setLevelFilter] = useState<GradeLevelFilter>('ortaokul')
  const [activeTab, setActiveTab] = useState<FizikTabType>('circuits')

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
  ]

  const visibleModules = ALL_MODULES.filter((m) => {
    if (levelFilter === 'all') return true
    return m.level === levelFilter
  })

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

            {/* Quick Stats Pill */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md self-start md:self-auto">
              <div className="px-3 py-1 text-center">
                <div className="text-lg font-bold text-blue-400">6</div>
                <div className="text-[11px] text-slate-400">Sanal Modül</div>
              </div>
              <div className="px-3 py-1 text-center border-x border-slate-800">
                <div className="text-lg font-bold text-cyan-400">60 FPS</div>
                <div className="text-[11px] text-slate-400">Fizik Motoru</div>
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
                    ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
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
                    ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Lise & YKS/AYT (9 - 12. Sınıf)</span>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        </AnimatePresence>
      </main>

      {/* ── Bottom Switcher to Next Branch ── */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            DersoLab Fizik Laboratuvarı — Ortaokul ve Lise MEB Müfredatına Uygun 6 Sanal Simülasyon.
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
