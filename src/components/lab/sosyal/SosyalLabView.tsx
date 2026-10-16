'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe2,
  Scroll,
  ArrowRight,
  Compass,
  Sun,
  Users,
  School,
  GraduationCap,
} from 'lucide-react'
import { GeoAtlas } from './GeoAtlas'
import { HistoryTimeline } from './HistoryTimeline'
import { SeasonsOrbitModule } from './SeasonsOrbitModule'
import { PopulationPyramidModule } from './PopulationPyramidModule'
import { BranchNavHeader } from '../BranchNavHeader'

export type SosyalTabType = 'geo' | 'seasons' | 'pyramids' | 'history'
type GradeLevelFilter = 'all' | 'ortaokul' | 'lise'

export function SosyalLabView() {
  const [levelFilter, setLevelFilter] = useState<GradeLevelFilter>('ortaokul')
  const [activeTab, setActiveTab] = useState<SosyalTabType>('geo')

  const ALL_MODULES = [
    // ── Ortaokul & Temel Sosyal Bilgiler (5 - 8. Sınıf) ──
    {
      id: 'geo' as SosyalTabType,
      label: 'Türkiye Fiziki & İklim Atlası',
      level: 'ortaokul' as const,
      gradeBadge: '5-12. Sınıf',
      icon: Globe2,
      badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      activeBorder: 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.25)] ring-1 ring-rose-500/20',
      desc: 'İklim bölgeleri, KAYIP SAKAL rüzgârları, aktif fay hatları ve masif araziler',
    },
    {
      id: 'seasons' as SosyalTabType,
      label: 'Mevsimlerin Oluşumu & Yörünge',
      level: 'ortaokul' as const,
      gradeBadge: '8. Sınıf LGS',
      icon: Sun,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      activeBorder: 'border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/20',
      desc: '23° 27\' eksen eğikliği, gün dönümleri, güneş açısı ve gölge boyu simülatörü',
    },

    // ── Lise Coğrafya & Tarih (9 - 12. Sınıf) ──
    {
      id: 'pyramids' as SosyalTabType,
      label: 'Nüfus Piramitleri & Demografi',
      level: 'lise' as const,
      gradeBadge: '10. Sınıf Lise',
      icon: Users,
      badgeColor: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
      activeBorder: 'border-pink-500/50 shadow-[0_0_15px_rgba(236,72,153,0.25)] ring-1 ring-pink-500/20',
      desc: 'Doğum/ölüm oranları, gelişmişlik piramitleri, aktif ve bağımlı nüfus analizleri',
    },
    {
      id: 'history' as SosyalTabType,
      label: 'Tarih Zaman Şeridi & Antlaşmalar',
      level: 'lise' as const,
      gradeBadge: 'Kronolojik Tarih',
      icon: Scroll,
      badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      activeBorder: 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.25)] ring-1 ring-orange-500/20',
      desc: 'İlk Türkler, Selçuklu, Osmanlı, Kurtuluş Savaşı ve kritik antlaşmaların sınav sırları',
    },
  ]

  const visibleModules = ALL_MODULES.filter((m) => {
    if (levelFilter === 'all') return true
    return m.level === levelFilter
  })

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-rose-500 selection:text-slate-950 font-sans">
      
      {/* ── Background Glow Effects ── */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* ── Top Navigation Bar ── */}
      <BranchNavHeader currentBranch="sosyal" />

      {/* ── Hero Banner ── */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-rose-950/20 via-slate-900/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold mb-3">
                <Globe2 className="w-3.5 h-3.5" />
                DersoLab L.A.B. — Sosyal Bilimler Laboratuvarı
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                SosyalLab —{' '}
                <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-amber-400 bg-clip-text text-transparent">
                  Görsel Coğrafya, Tarih & Demografi
                </span>
              </h1>
              <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
                Milli Eğitim müfredatındaki temel sosyal bilimler üniteleri: İnteraktif Türkiye atlası, eksen eğikliği ve mevsimler, nüfus piramitleri ile kronolojik tarih zaman şeridi.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md self-start md:self-auto">
              <div className="px-3 py-1 text-center">
                <div className="text-lg font-bold text-rose-400">4</div>
                <div className="text-[11px] text-slate-400">Sanal Modül</div>
              </div>
              <div className="px-3 py-1 text-center border-x border-slate-800">
                <div className="text-lg font-bold text-amber-400">81 İl</div>
                <div className="text-[11px] text-slate-400">Canlı Katman</div>
              </div>
              <div className="px-3 py-1 text-center">
                <div className="text-lg font-bold text-emerald-400">Maarif</div>
                <div className="text-[11px] text-slate-400">5-12. Sınıf</div>
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
                    ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <School className="w-4 h-4" />
                <span>Ortaokul & LGS (5 - 8. Sınıf)</span>
              </button>
              <button
                type="button"
                onClick={() => setLevelFilter('lise')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  levelFilter === 'lise'
                    ? 'bg-rose-600 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Lise & YKS/TYT (9 - 12. Sınıf)</span>
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
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-400' : 'text-slate-400'}`} />
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
          {activeTab === 'geo' && (
            <motion.div
              key="geo"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <GeoAtlas />
            </motion.div>
          )}

          {activeTab === 'seasons' && (
            <motion.div
              key="seasons"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <SeasonsOrbitModule />
            </motion.div>
          )}

          {activeTab === 'pyramids' && (
            <motion.div
              key="pyramids"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <PopulationPyramidModule />
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <HistoryTimeline />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Bottom Switcher to Next Branch ── */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            DersoLab Sosyal Bilimler Laboratuvarı — Ortaokul ve Lise MEB Müfredatına Uygun 4 Sanal Simülasyon.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link
              href="/lab/turkce"
              className="text-slate-400 hover:text-amber-400 transition-colors"
            >
              &larr; TürkçeLab
            </Link>
            <span className="text-slate-700">|</span>
            <Link
              href="/lab/ingilizce"
              className="text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-1"
            >
              İngilizceLab'a Geç &rarr;
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
