'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  GraduationCap,
  ShieldCheck,
  Briefcase,
} from 'lucide-react'
import type { PersonaType } from '../../PersonaSwitcher'
import { StudentLandingView } from './StudentLandingView'
import { ParentLandingView } from './ParentLandingView'
import { InstructorLandingView } from './InstructorLandingView'

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
    </svg>
  )
}

interface PersonaDedicatedViewProps {
  initialPersona?: PersonaType
}

export function PersonaDedicatedView({ initialPersona = 'student' }: PersonaDedicatedViewProps) {
  const [activePersona, setActivePersona] = useState<PersonaType>(initialPersona)
  const [examFilter, setExamFilter] = useState<'all' | 'lgs' | 'yks'>('all')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const roleParam = params.get('role') as PersonaType | null
      if (roleParam && ['student', 'parent', 'instructor'].includes(roleParam)) {
        setActivePersona(roleParam)
      }
      const examParam = params.get('exam')
      if (examParam === 'lgs' || examParam === 'yks') {
        setExamFilter(examParam)
      }
    }
  }, [])

  function handlePersonaChange(newPersona: PersonaType) {
    setActivePersona(newPersona)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('role', newPersona)
      window.history.replaceState({}, '', url.toString())
    }
  }

  function handleExamFilterChange(filter: 'all' | 'lgs' | 'yks') {
    setExamFilter(filter)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (filter === 'all') url.searchParams.delete('exam')
      else url.searchParams.set('exam', filter)
      window.history.replaceState({}, '', url.toString())
    }
  }

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-amber-400 selection:text-slate-950 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* ── TOP AUDIENCE SWITCHER (FLOATING MASTER PILL) ── */}
        <div className="flex justify-center">
          <div className="inline-flex items-center p-1.5 rounded-full bg-slate-900/90 backdrop-blur-2xl border-2 border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.6)] gap-1">
            {/* Student Button */}
            <button
              type="button"
              onClick={() => handlePersonaChange('student')}
              className={`flex items-center gap-2 px-5 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
                activePersona === 'student'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-[0_0_25px_rgba(251,191,36,0.5)] scale-[1.03]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>🎓 Öğrenci</span>
            </button>

            {/* Parent Button */}
            <button
              type="button"
              onClick={() => handlePersonaChange('parent')}
              className={`flex items-center gap-2 px-5 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
                activePersona === 'parent'
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 shadow-[0_0_25px_rgba(52,211,153,0.5)] scale-[1.03]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>🛡️ Veli</span>
            </button>

            {/* Instructor Button */}
            <button
              type="button"
              onClick={() => handlePersonaChange('instructor')}
              className={`flex items-center gap-2 px-5 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-black transition-all duration-300 cursor-pointer ${
                activePersona === 'instructor'
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-[0_0_25px_rgba(59,130,246,0.5)] scale-[1.03]'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>👨‍🏫 Eğitmen</span>
            </button>
          </div>
        </div>

        {/* ── ACTIVE PERSONA CONTENT ── */}
        {activePersona === 'student' && (
          <StudentLandingView examFilter={examFilter} onExamFilterChange={handleExamFilterChange} />
        )}

        {activePersona === 'parent' && (
          <ParentLandingView examFilter={examFilter} onExamFilterChange={handleExamFilterChange} />
        )}

        {activePersona === 'instructor' && (
          <InstructorLandingView examFilter={examFilter} onExamFilterChange={handleExamFilterChange} />
        )}

        {/* ── FOOTER SIGNATURE ── */}
        <footer className="border-t border-white/[0.08] pt-12 pb-8 flex flex-col items-center justify-center space-y-6 text-xs text-slate-500">
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/dersolabegitim/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-amber-400 hover:bg-white/[0.08] hover:border-amber-400/30 transition-all duration-300"
              aria-label="Instagram"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a
              href="https://www.tiktok.com/@dersolabegitim"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-amber-400 hover:bg-white/[0.08] hover:border-amber-400/30 transition-all duration-300"
              aria-label="TikTok"
            >
              <TikTokIcon className="w-5 h-5" />
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 text-slate-400 font-semibold">
            <Link href="/about" className="hover:text-amber-400 transition-colors">Hakkımızda</Link>
            <Link href="/privacy" className="hover:text-amber-400 transition-colors">Gizlilik Politikası</Link>
            <Link href="/terms" className="hover:text-amber-400 transition-colors">Kullanım Şartları</Link>
          </div>
          <p className="opacity-80">© 2026 DersoLab · Butik Online Akademi ve Koçluk Sistemi. Tüm hakları saklıdır.</p>
        </footer>
      </div>
    </div>
  )
}
