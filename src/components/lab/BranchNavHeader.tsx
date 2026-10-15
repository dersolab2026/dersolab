'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  FlaskConical,
  BookOpen,
  Zap,
  Calculator,
  Dna,
  Globe2,
  Languages,
  Home,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

export type BranchId = 'kimya' | 'turkce' | 'fizik' | 'matematik' | 'biyoloji' | 'sosyal' | 'ingilizce'

interface BranchNavHeaderProps {
  currentBranch?: BranchId
}

export const BRANCHES = [
  {
    id: 'kimya' as BranchId,
    name: 'KimyaLab',
    href: '/lab/kimya',
    icon: FlaskConical,
    color: 'from-cyan-500 to-teal-400',
    borderActive: 'border-cyan-500/50 text-cyan-300 bg-cyan-950/40',
    accentColor: 'text-cyan-400',
    tag: '3D Atom & Titrasyon',
  },
  {
    id: 'turkce' as BranchId,
    name: 'TürkçeLab',
    href: '/lab/turkce',
    icon: BookOpen,
    color: 'from-amber-500 to-orange-400',
    borderActive: 'border-amber-500/50 text-amber-300 bg-amber-950/40',
    accentColor: 'text-amber-400',
    tag: 'Bionic Hız & TDK',
  },
  {
    id: 'fizik' as BranchId,
    name: 'FizikLab',
    href: '/lab/fizik',
    icon: Zap,
    color: 'from-blue-500 to-cyan-400',
    borderActive: 'border-blue-500/50 text-blue-300 bg-blue-950/40',
    accentColor: 'text-blue-400',
    tag: 'Optik, Atış & Devre',
  },
  {
    id: 'matematik' as BranchId,
    name: 'MatematikLab',
    href: '/lab/matematik',
    icon: Calculator,
    color: 'from-violet-500 to-indigo-400',
    borderActive: 'border-violet-500/50 text-violet-300 bg-violet-950/40',
    accentColor: 'text-violet-400',
    tag: 'Birim Çember & Türev',
  },
  {
    id: 'biyoloji' as BranchId,
    name: 'BiyolojiLab',
    href: '/lab/biyoloji',
    icon: Dna,
    color: 'from-emerald-500 to-teal-400',
    borderActive: 'border-emerald-500/50 text-emerald-300 bg-emerald-950/40',
    accentColor: 'text-emerald-400',
    tag: 'Punnett & DNA Translasyon',
  },
  {
    id: 'sosyal' as BranchId,
    name: 'SosyalLab',
    href: '/lab/sosyal',
    icon: Globe2,
    color: 'from-rose-500 to-amber-400',
    borderActive: 'border-rose-500/50 text-rose-300 bg-rose-950/40',
    accentColor: 'text-rose-400',
    tag: 'Türkiye Atlası & Tarih',
  },
  {
    id: 'ingilizce' as BranchId,
    name: 'İngilizceLab',
    href: '/lab/ingilizce',
    icon: Languages,
    color: 'from-sky-500 to-indigo-500',
    borderActive: 'border-sky-500/50 text-sky-300 bg-sky-950/40',
    accentColor: 'text-sky-400',
    tag: 'Pratik Konuşma & Dil',
  },
]

export function BranchNavHeader({ currentBranch }: BranchNavHeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#07090E]/85 border-b border-slate-800/80">
      <div className="max-w-[1440px] mx-auto px-2.5 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-16 gap-2 lg:gap-3">
          
          {/* Logo -> Hesabımın Ana Sayfası (/dashboard) */}
          <div className="flex items-center gap-2 lg:gap-2.5 shrink-0">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 group transition-opacity hover:opacity-95 shrink-0"
              title="Hesabımın Ana Sayfasına (Dashboard) Dön"
            >
              <Image
                src="/fox-head.png"
                alt="DersoLab Maskot"
                width={36}
                height={36}
                className="w-8 h-8 object-contain drop-shadow-md group-hover:scale-110 transition-transform shrink-0"
                priority
              />
              <div className="flex items-baseline gap-1.5">
                <div className="flex items-baseline">
                  <span className="text-base sm:text-lg font-black tracking-tight text-white">Derso</span>
                  <span className="text-base sm:text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                    Lab
                  </span>
                </div>
                <span className="text-[10px] font-black tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                  L.A.B.
                </span>
              </div>
            </Link>

            <span className="hidden xl:inline-block text-slate-700 text-sm">/</span>

            <Link
              href="/lab"
              title="L.A.B. Simülasyon Merkezi"
              className={`hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 ${
                !currentBranch
                  ? 'text-cyan-300 bg-cyan-950/50 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>L.A.B. Merkezi</span>
            </Link>
          </div>

          {/* Quick Branch Tabs - Compact to fit all cleanly */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {BRANCHES.map((b) => {
              const Icon = b.icon
              const isActive = currentBranch === b.id
              return (
                <Link
                  key={b.id}
                  href={b.href}
                  className={`flex items-center gap-1 px-2 py-1 xl:px-2.5 xl:py-1.5 rounded-lg xl:rounded-xl text-[11px] xl:text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
                    isActive
                      ? b.borderActive + ' shadow-md'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? b.accentColor : 'text-slate-500'}`} />
                  <span>{b.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Hesabımın Ana Sayfasına Dön (/dashboard) */}
          <div className="flex items-center shrink-0">
            <Link
              href="/dashboard"
              className="text-[11px] sm:text-xs font-bold text-slate-200 hover:text-white transition-all flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/50 hover:bg-slate-800 shadow-sm whitespace-nowrap"
              title="Hesabımın Ana Sayfasına (Dashboard) Dön"
            >
              <span>Panelime Dön</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </Link>
          </div>

        </div>
      </div>
    </header>
  )
}
