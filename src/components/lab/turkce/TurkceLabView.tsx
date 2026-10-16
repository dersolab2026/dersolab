'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  BookOpen,
  Zap,
  Layers,
  BookMarked,
  Tag,
  FlaskConical,
} from 'lucide-react'
import { BionicSpeedReader } from './BionicSpeedReader'
import { PhoneticInspector } from './PhoneticInspector'
import { TdkWordOfTheDay } from './TdkWordOfTheDay'
import { SocialCommunityBar } from '@/components/home/SocialCommunityBar'

import { BranchNavHeader } from '../BranchNavHeader'

export type TurkceTabType = 'bionic' | 'phonetics' | 'tdk'

export function TurkceLabView() {
  const [activeTab, setActiveTab] = useState<TurkceTabType>('bionic')
  const [sessionSeconds, setSessionSeconds] = useState(0)

  // Focus timer on TurkceLab
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60)
    const secs = totalSec % 60
    if (mins === 0) return `${secs} sn`
    return `${mins} dk ${secs} sn`
  }

  const TABS = [
    {
      id: 'bionic' as TurkceTabType,
      label: 'Paragraf Hız Antrenörü',
      badge: 'Okuma & Kavrama',
      icon: Zap,
    },
    {
      id: 'phonetics' as TurkceTabType,
      label: 'Ses Olayları & Yazım Kuralları',
      badge: 'Yazım Kuralları',
      icon: Layers,
    },
    {
      id: 'tdk' as TurkceTabType,
      label: 'Günün Kelimesi & TDK Sözlük',
      badge: 'Canlı TDK',
      icon: BookMarked,
    },
  ]

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans">
      
      {/* ── Background Glow Effects (GPU Optimized) ── */}
      <div className="fixed top-0 right-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed top-1/3 left-1/4 w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ── Top Navigation Bar ── */}
      <BranchNavHeader currentBranch="turkce" />

      {/* ── Secondary Tab Navigation Pill Bar ── */}
      <div className="sticky top-16 z-40 backdrop-blur-2xl bg-slate-950/85 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto gizli-kaydirma w-full sm:w-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-800 text-white border border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                    isActive ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-slate-500'
                  }`}>
                    {tab.badge}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Sitede Vakit Geçirme / Odak Süresi Sayacı */}
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-semibold text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">TürkçeLab Odak Süreniz:</span>
            <span className="font-mono font-bold text-amber-400">{formatTimer(sessionSeconds)}</span>
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
            {activeTab === 'bionic' && <BionicSpeedReader />}
            {activeTab === 'phonetics' && <PhoneticInspector />}
            {activeTab === 'tdk' && <TdkWordOfTheDay />}
          </motion.div>
        </AnimatePresence>

        {/* ── Bottom Callout: Convert Student to Lesson ── */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/40 via-slate-900/90 to-orange-950/40 border border-amber-500/30 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <Image
                src="/fox-head.png"
                alt="DersoLab Maskot"
                width={16}
                height={16}
                className="w-3.5 h-3.5 object-contain"
              />
              <span>DersoLab Bire Bir Türkçe Atölyesi</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Paragraf ve Yazım Kurallarında Netlerini Katla.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Hızlı okuma, odaklı kavrama, ses olayları ve yazım kurallarını Türkiye&apos;nin en iyi öğretmenleriyle bire bir canlı derste çalış.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/instructors?subject=Türkçe"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(245,158,11,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Türkçe Öğretmenlerini Keşfet</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ── Sosyal Topluluk Alanı ── */}
        <SocialCommunityBar />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-500">
        DersoLab L.A.B. • Türkiye Yüzyılı Maarif Modeli, Ortaokul & Lise Müfredatına Uygun İnteraktif Türkçe Atölyeleri
      </footer>
    </div>
  )
}
