'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dna,
  Layers,
  ArrowRight,
  Split,
  Sun,
  School,
  GraduationCap,
} from 'lucide-react'
import { GeneticsSimulator } from './GeneticsSimulator'
import { ProteinSynthesis } from './ProteinSynthesis'
import { CellDivisionModule } from './CellDivisionModule'
import { PhotosynthesisModule } from './PhotosynthesisModule'
import { BranchNavHeader } from '../BranchNavHeader'

export type BioTabType = 'genetics' | 'division' | 'photosynthesis' | 'protein'
type GradeLevelFilter = 'all' | 'ortaokul' | 'lise'

export function BiyolojiLabView() {
  const [levelFilter, setLevelFilter] = useState<GradeLevelFilter>('ortaokul')
  const [activeTab, setActiveTab] = useState<BioTabType>('genetics')

  const ALL_MODULES = [
    // ── Ortaokul & Temel Biyoloji (7 - 8. Sınıf & LGS) ──
    {
      id: 'genetics' as BioTabType,
      label: 'Punnett Karesi & Mendel Kalıtımı',
      level: 'ortaokul' as const,
      gradeBadge: '8. Sınıf LGS',
      icon: Dna,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      activeBorder: 'border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/20',
      desc: 'Monohibrit (Aa × Aa), AB0 kan grupları, fenotipik ve genotipik oranlar',
    },
    {
      id: 'photosynthesis' as BioTabType,
      label: 'Fotosentez & Işık Dalga Boyu',
      level: 'ortaokul' as const,
      gradeBadge: '8. Sınıf LGS',
      icon: Sun,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      activeBorder: 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/20',
      desc: 'Engelmann deneyi, ışık şiddeti, CO₂ ve sıcaklığın fotosentez hızına etkisi',
    },

    // ── Lise & YKS Biyoloji (10 - 12. Sınıf) ──
    {
      id: 'division' as BioTabType,
      label: 'Mitoz & Mayoz Hücre Bölünmesi',
      level: 'lise' as const,
      gradeBadge: '10. Sınıf TYT',
      icon: Split,
      badgeColor: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      activeBorder: 'border-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.25)] ring-1 ring-teal-500/20',
      desc: 'İnterfaz, profaz, metafaz, anafaz, krossing-over ve kromozom sayısı değişimi',
    },
    {
      id: 'protein' as BioTabType,
      label: 'DNA Protein Sentezi & Ribozom',
      level: 'lise' as const,
      gradeBadge: '12. Sınıf AYT',
      icon: Layers,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      activeBorder: 'border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/20',
      desc: 'Transkripsiyon, mRNA kodonları, tRNA antikodon eşleştirme ve polipeptit zinciri',
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
      <div className="fixed top-1/3 right-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* ── Top Navigation Bar ── */}
      <BranchNavHeader currentBranch="biyoloji" />

      {/* ── Hero Banner ── */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-emerald-950/20 via-slate-900/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
                <Dna className="w-3.5 h-3.5" />
                DersoLab L.A.B. — Biyoloji Laboratuvarı
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                BiyolojiLab —{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400 bg-clip-text text-transparent">
                  Yaşam Bilimleri & Genetik Atölyesi
                </span>
              </h1>
              <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
                Milli Eğitim müfredatındaki temel biyoloji ve genetik üniteleri: Mendel çaprazlamaları, mitoz-mayoz evreleri, fotosentez ışık spektrumu deneyi ve ribozomda protein sentezi.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md self-start md:self-auto">
              <div className="px-3 py-1 text-center">
                <div className="text-lg font-bold text-emerald-400">4</div>
                <div className="text-[11px] text-slate-400">Sanal Modül</div>
              </div>
              <div className="px-3 py-1 text-center border-x border-slate-800">
                <div className="text-lg font-bold text-teal-400">Genetik</div>
                <div className="text-[11px] text-slate-400">Canlı Simülasyon</div>
              </div>
              <div className="px-3 py-1 text-center">
                <div className="text-lg font-bold text-cyan-400">Maarif</div>
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
                    ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
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
                    ? 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Lise & YKS/AYT (10 - 12. Sınıf)</span>
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
                Tümü (4)
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
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
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
          {activeTab === 'genetics' && (
            <motion.div
              key="genetics"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <GeneticsSimulator />
            </motion.div>
          )}

          {activeTab === 'photosynthesis' && (
            <motion.div
              key="photosynthesis"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <PhotosynthesisModule />
            </motion.div>
          )}

          {activeTab === 'division' && (
            <motion.div
              key="division"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <CellDivisionModule />
            </motion.div>
          )}

          {activeTab === 'protein' && (
            <motion.div
              key="protein"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <ProteinSynthesis />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Bottom Switcher to Next Branch ── */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            DersoLab Biyoloji Laboratuvarı — Ortaokul ve Lise MEB Müfredatına Uygun 4 Sanal Simülasyon.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link
              href="/lab/matematik"
              className="text-slate-400 hover:text-emerald-400 transition-colors"
            >
              &larr; MatematikLab
            </Link>
            <span className="text-slate-700">|</span>
            <Link
              href="/lab/fizik"
              className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              FizikLab'a Geç &rarr;
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
