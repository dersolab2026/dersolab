'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Languages,
  Sparkles,
  BookOpen,
  Flame,
  Mic,
  Camera,
  Layers,
  ArrowRight,
  GraduationCap,
} from 'lucide-react'
import { BranchNavHeader } from '../BranchNavHeader'
import { TinyLessonsModule } from './TinyLessonsModule'
import { SlangHangModule } from './SlangHangModule'
import { PronunciationWorkoutModule } from './PronunciationWorkoutModule'
import { VisualSceneModule } from './VisualSceneModule'

type EnglishTabType = 'tiny-lessons' | 'slang-hang' | 'pronunciation' | 'visual-scenes'

export function IngilizceLabView() {
  const [activeTab, setActiveTab] = useState<EnglishTabType>('tiny-lessons')

  const TABS = [
    {
      id: 'tiny-lessons' as EnglishTabType,
      label: 'Tiny Lessons',
      sublabel: 'Durumsal Mikro Dersler',
      icon: BookOpen,
      badge: 'Google LLL İlhamlı',
      color: 'from-sky-500 to-blue-500',
      activeBorder: 'border-sky-500/50 shadow-[0_0_20px_rgba(56,189,248,0.25)] ring-1 ring-sky-500/20',
      activeText: 'text-sky-300',
    },
    {
      id: 'slang-hang' as EnglishTabType,
      label: 'Slang Hang',
      sublabel: 'Deyimler & Sokak Dili',
      icon: Flame,
      badge: 'US 🇺🇸 • UK 🇬🇧 • AU 🇦🇺',
      color: 'from-amber-500 to-orange-500',
      activeBorder: 'border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.25)] ring-1 ring-amber-500/20',
      activeText: 'text-amber-300',
    },
    {
      id: 'pronunciation' as EnglishTabType,
      label: 'Speaking & Telaffuz',
      sublabel: 'Fonetik Antrenör',
      icon: Mic,
      badge: 'Sessiz Harf Tuzakları',
      color: 'from-emerald-500 to-teal-500',
      activeBorder: 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/20',
      activeText: 'text-emerald-300',
    },
    {
      id: 'visual-scenes' as EnglishTabType,
      label: 'Visual Explorer',
      sublabel: 'Görsel Sahne & Nesneler',
      icon: Camera,
      badge: 'Word Cam İlhamlı',
      color: 'from-cyan-500 to-indigo-500',
      activeBorder: 'border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-500/20',
      activeText: 'text-cyan-300',
    },
  ]

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-sky-500 selection:text-slate-950 font-sans">
      
      {/* ── Background Glow Effects ── */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/4 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-1/3 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* ── Top Navigation Bar ── */}
      <BranchNavHeader currentBranch="ingilizce" />

      {/* ── Hero Banner ── */}
      <div className="relative border-b border-slate-800/80 bg-gradient-to-b from-sky-950/20 via-slate-900/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-semibold mb-3">
                <Languages className="w-3.5 h-3.5" />
                DersoLab L.A.B. — İngilizce Laboratuvarı
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                İngilizceLab —{' '}
                <span className="bg-gradient-to-r from-sky-400 via-indigo-300 to-amber-400 bg-clip-text text-transparent">
                  Little Language Lessons İlhamlı
                </span>
              </h1>
              <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
                Google Labs <span className="text-sky-300 font-medium">Little Language Lessons</span> paradigmasından esinlenildi: Kuru gramer kuralları yerine durumsal mikro dersler (Tiny Lessons), doğal sokak jargonu ve deyimler (Slang Hang), fonetik tuzak antrenörü ve görsel sahne keşfi.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md self-start md:self-auto">
              <div className="px-3 py-1 text-center">
                <div className="text-lg font-bold text-sky-400">4</div>
                <div className="text-[11px] text-slate-400">Canlı Modül</div>
              </div>
              <div className="px-3 py-1 text-center border-x border-slate-800">
                <div className="text-lg font-bold text-amber-400">3 Aksan</div>
                <div className="text-[11px] text-slate-400">US, UK & AU</div>
              </div>
              <div className="px-3 py-1 text-center">
                <div className="text-lg font-bold text-emerald-400">A1 - B2</div>
                <div className="text-[11px] text-slate-400">Maarif Uyumlu</div>
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
                      ? `bg-slate-850 text-white ${tab.activeBorder}`
                      : 'bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? tab.activeText : 'text-slate-400'}`} />
                  <div className="flex flex-col text-left">
                    <span className="leading-tight">{tab.label}</span>
                    <span className="text-[10px] text-slate-500 font-normal">{tab.sublabel}</span>
                  </div>
                  <span
                    className={`ml-1 text-[10px] px-2 py-0.5 rounded-full font-semibold hidden sm:inline-block ${
                      isActive
                        ? 'bg-slate-800 text-slate-200 border border-slate-700'
                        : 'bg-slate-950 text-slate-500'
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

      {/* ── Active Module View ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'tiny-lessons' && <TinyLessonsModule />}
            {activeTab === 'slang-hang' && <SlangHangModule />}
            {activeTab === 'pronunciation' && <PronunciationWorkoutModule />}
            {activeTab === 'visual-scenes' && <VisualSceneModule />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Footer / Pedagogical Info ── */}
      <footer className="border-t border-slate-800/80 bg-slate-950/60 py-8 mt-16 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p>
            DersoLab İngilizceLab — Google Little Language Lessons (LLL) deneysel vizyonu ve MEB Maarif Modeli kazanımları harmanlanarak geliştirilmiştir.
          </p>
          <p className="text-[11px] text-slate-600">
            Kullanılan telaffuz sentezi tarayıcınızın yerel Web Speech API motoru tarafından gerçek zamanlı üretilmektedir.
          </p>
        </div>
      </footer>

    </div>
  )
}
