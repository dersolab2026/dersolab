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
  Home,
  Sparkles,
} from 'lucide-react'

export type BranchId = 'kimya' | 'turkce' | 'fizik' | 'matematik' | 'biyoloji' | 'sosyal'

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
]

export function BranchNavHeader({ currentBranch }: BranchNavHeaderProps) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#07090E]/85 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Hub Link */}
          <div className="flex items-center gap-3">
            <Link
              href="/lab"
              className="flex items-center gap-2 group transition-opacity hover:opacity-95"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <div className="flex items-baseline">
                  <span className="text-lg font-black tracking-tight text-white">Derso</span>
                  <span className="text-lg font-black tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                    Lab
                  </span>
                </div>
                <span className="text-[10px] font-black tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                  L.A.B.
                </span>
              </div>
            </Link>

            <span className="hidden sm:inline-block text-slate-700 text-sm">/</span>

            <Link
              href="/lab"
              title="Laboratuvar Destekli Akademik Başarı"
              className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                !currentBranch
                  ? 'text-cyan-300 bg-cyan-950/50 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              L.A.B. Ana Merkez
            </Link>
          </div>

          {/* Quick Branch Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {BRANCHES.map((b) => {
              const Icon = b.icon
              const isActive = currentBranch === b.id
              return (
                <Link
                  key={b.id}
                  href={b.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
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

          {/* Return to main site */}
          <div className="hidden md:flex items-center">
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1"
            >
              Ana Sayfa &rarr;
            </Link>
          </div>

        </div>
      </div>
    </header>
  )
}
