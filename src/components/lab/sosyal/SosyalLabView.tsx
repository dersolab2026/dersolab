'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe2,
  Scroll,
  Sparkles,
  ArrowRight,
  Compass,
} from 'lucide-react'
import { GeoAtlas } from './GeoAtlas'
import { HistoryTimeline } from './HistoryTimeline'
import { BranchNavHeader } from '../BranchNavHeader'

type SosyalTabType = 'geo' | 'history'

export function SosyalLabView() {
  const [activeTab, setActiveTab] = useState<SosyalTabType>('geo')

  const TABS = [
    {
      id: 'geo' as SosyalTabType,
      label: 'Türkiye Fiziki & İklim Atlası',
      icon: Globe2,
      badge: '5-12. Sınıf Coğrafya',
      desc: 'İklim bölgeleri, KAYIP SAKAL rüzgârları, aktif fay hatları ve masif araziler',
    },
    {
      id: 'history' as SosyalTabType,
      label: 'Tarih Zaman Şeridi & Antlaşmalar',
      icon: Scroll,
      badge: 'Kronolojik Tarih',
      desc: 'İlk Türkler, Selçuklu, Osmanlı, Kurtuluş Savaşı ve kritik antlaşmaların sınav sırları',
    },
  ]

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
                  Görsel Coğrafya & Kronolojik Tarih
                </span>
              </h1>
              <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
                Coğrafyayı ezberlemek yerine interaktif harita katmanlarıyla keşfedin, tarihi olayların kronolojik neden-sonuç bağlarını ve ÖSYM tuzaklarını görsel olarak kavrayın.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="grid grid-cols-3 gap-3 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md self-start md:self-auto">
              <div className="px-3 py-1 text-center">
                <div className="text-lg font-bold text-rose-400">2</div>
                <div className="text-[11px] text-slate-400">Görsel Modül</div>
              </div>
              <div className="px-3 py-1 text-center border-x border-slate-800">
                <div className="text-lg font-bold text-amber-400">81 İl</div>
                <div className="text-[11px] text-slate-400">Fiziki Harita</div>
              </div>
              <div className="px-3 py-1 text-center">
                <div className="text-lg font-bold text-cyan-400">Maarif</div>
                <div className="text-[11px] text-slate-400">5-12. Sınıf</div>
              </div>
            </div>
          </div>

          {/* Module Selector Tabs */}
          <div className="mt-8 flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
                    isActive
                      ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white border-rose-400/40 shadow-lg shadow-rose-500/25'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-rose-400'}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 text-[10px] rounded-md font-bold uppercase tracking-wider ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-800 text-slate-400'
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
            DersoLab Sosyal Bilimler Laboratuvarı — Coğrafya atlası ve interaktif tarih çizelgesi.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium">
            <Link
              href="/lab/biyoloji"
              className="text-slate-400 hover:text-emerald-400 transition-colors"
            >
              &larr; BiyolojiLab
            </Link>
            <span className="text-slate-700">|</span>
            <Link
              href="/lab"
              className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              Tüm Laboratuvarlar Hub &rarr;
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
