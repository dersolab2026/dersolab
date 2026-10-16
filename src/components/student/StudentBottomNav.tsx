'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  FlaskConical,
  Calendar,
  LineChart,
  Sparkles,
} from 'lucide-react'
import { playClickSound } from '@/lib/soundFx'

interface NavTab {
  href: string
  label: string
  icon: React.ElementType
  color: string
  activeGlow: string
  exact?: boolean
}

const TABS: NavTab[] = [
  {
    href: '/dashboard/student',
    label: 'Ana Sayfa',
    icon: Home,
    color: 'text-orange-400',
    activeGlow: 'bg-orange-500/20 text-orange-400 border-orange-500/40 shadow-[0_0_15px_rgba(249,115,22,0.35)]',
    exact: true,
  },
  {
    href: '/lab',
    label: 'L.A.B.',
    icon: FlaskConical,
    color: 'text-cyan-400',
    activeGlow: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.35)]',
    exact: false,
  },
  {
    href: '/dashboard/student/bookings',
    label: 'Derslerim',
    icon: Calendar,
    color: 'text-emerald-400',
    activeGlow: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.35)]',
    exact: false,
  },
  {
    href: '/dashboard/student/netlerim',
    label: 'Netlerim',
    icon: LineChart,
    color: 'text-blue-400',
    activeGlow: 'bg-blue-500/20 text-blue-400 border-blue-500/40 shadow-[0_0_15px_rgba(59,130,246,0.35)]',
    exact: false,
  },
  {
    href: '/dashboard/student/ai-asistan',
    label: 'AI Soru',
    icon: Sparkles,
    color: 'text-violet-400',
    activeGlow: 'bg-violet-500/20 text-violet-400 border-violet-500/40 shadow-[0_0_15px_rgba(139,92,246,0.35)]',
    exact: false,
  },
]

export function StudentBottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Mobil Öğrenci Menüsü"
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#0a0a0a]/92 backdrop-blur-2xl border-t border-white/10 px-2 pt-2 pb-[max(env(safe-area-inset-bottom),0.65rem)] shadow-[0_-5px_25px_rgba(0,0,0,0.8)]"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 items-center justify-between gap-1">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname === tab.href || pathname.startsWith(tab.href + '/')

          return (
            <Link
              key={tab.href}
              href={tab.href}
              onClick={() => {
                try {
                  playClickSound()
                } catch {
                  // ignore
                }
              }}
              className="flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 group relative"
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? `${tab.activeGlow} border scale-105`
                    : 'text-slate-400 group-hover:text-slate-200 group-active:scale-95'
                }`}
              >
                <Icon className="w-5 h-5 transition-transform" />
              </div>
              <span
                className={`text-[10px] font-bold mt-1 tracking-tight transition-colors ${
                  isActive ? 'text-white font-black' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-white absolute -bottom-0.5 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
