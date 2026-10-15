'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Layers,
  Droplet,
  Gamepad2,
  Calculator,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  FlaskConical,
  Atom,
  BookOpen,
} from 'lucide-react'
import { PeriodicTableModule } from './PeriodicTableModule'
import { TitrationModule } from './TitrationModule'
import { ChemistryGameModule } from './ChemistryGameModule'
import { MolCalculatorModule } from './MolCalculatorModule'
import { BranchNavHeader } from './BranchNavHeader'

type TabType = 'periodic' | 'titration' | 'game' | 'calculator'

export function KimyaLabView() {
  const [activeTab, setActiveTab] = useState<TabType>('periodic')

  const TABS = [
    {
      id: 'periodic' as TabType,
      label: 'Periyodik Tablo & 3D Atom',
      icon: Atom,
      badge: '3D Canlı',
    },
    {
      id: 'titration' as TabType,
      label: 'Sanal Titrasyon Deneyi',
      icon: Droplet,
      badge: 'İnteraktif',
    },
    {
      id: 'game' as TabType,
      label: 'Günün Elementi (Kimya-Le)',
      icon: Gamepad2,
      badge: 'Mini Oyun',
    },
    {
      id: 'calculator' as TabType,
      label: 'Mol & Çözelti Hesaplayıcı',
      icon: Calculator,
      badge: 'YKS Aracı',
    },
  ]

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-emerald-500 selection:text-slate-950 font-sans">
      
      {/* ── Background Glow Effects ── */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* ── Top Navigation Bar ── */}
      <BranchNavHeader currentBranch="kimya" />

      {/* ── Secondary Tab Navigation Pill Bar ── */}
      <div className="sticky top-16 z-40 backdrop-blur-2xl bg-slate-950/80 border-b border-slate-800/80">

        {/* ── Secondary Tab Navigation Pill Bar ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 overflow-x-auto gizli-kaydirma">
          <div className="flex items-center gap-2 min-w-max">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-white border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`text-[9px] px-1.5 py-0.2 rounded-full font-semibold uppercase ${
                      isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
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

      {/* ── Main Content Container ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* Active Tab View with Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'periodic' && <PeriodicTableModule />}
            {activeTab === 'titration' && <TitrationModule />}
            {activeTab === 'game' && <ChemistryGameModule />}
            {activeTab === 'calculator' && <MolCalculatorModule />}
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom Callout: Convert Student to Lesson ── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900/90 to-cyan-950/40 border border-emerald-500/30 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DersoLab 1-e-1 Kimya Atölyesi</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Kimyayı Ezberleme, Mantığıyla Öğren.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Simülasyonlarda gördüğün atomun katman elektron dağılımı (Bohr modeli), periyodik cetvel, asit-baz titrasyonları ve mol hesaplarını onaylı kimya öğretmenlerimizle birebir derste pekiştir.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/instructors"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Kimya Öğretmenlerini Keşfet</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        DersoLab L.A.B. • Türkiye Yüzyılı Maarif Modeli, Ortaokul & Lise Müfredatına Uygun Simülasyonlar
      </footer>
    </div>
  )
}
