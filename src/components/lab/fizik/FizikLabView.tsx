'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap,
  Eye,
  Rocket,
  ArrowRight,
  Sliders,
  Atom,
  Globe2,
} from 'lucide-react'
import { OpticsSimulator } from './OpticsSimulator'
import { ProjectileMotion } from './ProjectileMotion'
import { CircuitsSimulator } from './CircuitsSimulator'
import { BranchNavHeader } from '../BranchNavHeader'

type FizikTabType = 'circuits' | 'optics' | 'projectile'

export function FizikLabView() {
  const [activeTab, setActiveTab] = useState<FizikTabType>('circuits')

  const TABS = [
    {
      id: 'circuits' as FizikTabType,
      label: 'Elektrik Devresi & Ohm Yasası',
      icon: Zap,
      badge: '7-10. Sınıf',
      desc: 'Seri/paralel devreler, akan elektronlar, lamba parlaklığı',
    },
    {
      id: 'optics' as FizikTabType,
      label: 'Mercekler & Işın İzleme (Optik)',
      icon: Eye,
      badge: 'Optik & Işık',
      desc: 'İnce & kalın kenarlı mercekler, odak uzaklığı, ters/düz görüntü',
    },
    {
      id: 'projectile' as FizikTabType,
      label: 'Eğik Atış & Balistik Simülatörü',
      icon: Rocket,
      badge: 'Mekanik & Hareket',
      desc: 'Fırlatma açısı, ilk hız, uçuş süresi, menzil ve tepe noktası',
    },
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
                Formülleri ezberlemeyi bırak! Merceklerin odak kırılmasını gözünle gör, elektronların kablodaki akışını canlandır, eğik atışın tepe noktasını fırlatarak hesapla.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md self-start md:self-auto">
              <div className="px-3 py-1 text-center">
                <div className="text-lg font-bold text-blue-400">3</div>
                <div className="text-[11px] text-slate-400">Sanal Modül</div>
              </div>
              <div className="px-3 py-1 text-center border-x border-slate-800">
                <div className="text-lg font-bold text-cyan-400">60 FPS</div>
                <div className="text-[11px] text-slate-400">Fizik Motoru</div>
              </div>
              <div className="px-3 py-1 text-center">
                <div className="text-lg font-bold text-emerald-400">Maarif</div>
                <div className="text-[11px] text-slate-400">5-12. Sınıf</div>
              </div>
            </div>
          </div>

          {/* Module Selector Tabs */}
          <div className="mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3 border-t border-slate-800/60 pt-5">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-white border border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.3)] ring-1 ring-blue-500/20'
                      : 'bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-slate-800/80 text-slate-400'
                    }`}
                  >
                    {tab.badge}
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
        </AnimatePresence>
      </main>

      {/* ── Bottom Switcher to Next Branch ── */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            DersoLab Fizik Laboratuvarı — Eğik atış, optik kırılma ve elektrik simülasyonları.
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
