'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dna,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Globe2,
} from 'lucide-react'
import { GeneticsSimulator } from './GeneticsSimulator'
import { ProteinSynthesis } from './ProteinSynthesis'
import { BranchNavHeader } from '../BranchNavHeader'

type BioTabType = 'genetics' | 'protein'

export function BiyolojiLabView() {
  const [activeTab, setActiveTab] = useState<BioTabType>('genetics')

  const TABS = [
    {
      id: 'genetics' as BioTabType,
      label: 'Punnett Karesi & Genetik Çaprazlama',
      icon: Dna,
      badge: '8-10. Sınıf & Maarif',
      desc: 'Monohibrit (Aa × Aa), AB0 kan grupları, fenotipik ve genotipik oranlar',
    },
    {
      id: 'protein' as BioTabType,
      label: 'DNA Protein Sentezi & Ribozom Atölyesi',
      icon: Layers,
      badge: 'Moleküler Biyoloji',
      desc: 'Transkripsiyon, mRNA kodonları, tRNA antikodon eşleştirme ve polipeptit zinciri',
    },
  ]

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
                  Canlı Mekanizmaları & Genetik Simülatörü
                </span>
              </h1>
              <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
                Kalıtımın karmaşık çaprazlamalarını tek tıkla Punnett karesinde çözün, ribozomda kodon-antikodon eşleştirerek protein sentezinin canlı biyokimyasal adımlarını deneyimleyin.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md self-start md:self-auto">
              <div className="px-3 py-1 text-center">
                <div className="text-lg font-bold text-emerald-400">2</div>
                <div className="text-[11px] text-slate-400">Canlı Simülasyon</div>
              </div>
              <div className="px-3 py-1 text-center border-x border-slate-800">
                <div className="text-lg font-bold text-teal-400">64 Kodon</div>
                <div className="text-[11px] text-slate-400">Genetik Sözlük</div>
              </div>
              <div className="px-3 py-1 text-center">
                <div className="text-lg font-bold text-cyan-400">Mendel</div>
                <div className="text-[11px] text-slate-400">Oran Garantisi</div>
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
                      ? 'bg-slate-800 text-white border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)] ring-1 ring-emerald-500/20'
                      : 'bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
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
            DersoLab Biyoloji Laboratuvarı — Mendel kalıtımı ve protein sentezi simülatörleri.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link
              href="/lab/matematik"
              className="text-slate-400 hover:text-violet-400 transition-colors"
            >
              &larr; MatematikLab
            </Link>
            <span className="text-slate-700">|</span>
            <Link
              href="/lab/sosyal"
              className="text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1"
            >
              SosyalLab'a Geç &rarr;
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
