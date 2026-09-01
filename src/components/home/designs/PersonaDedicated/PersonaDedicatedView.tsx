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
              <span>🎓 Öğrenci Deneyimi</span>
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
              <span>🛡️ Veli Deneyimi</span>
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
              <span>👨‍🏫 Eğitmen Deneyimi</span>
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
          <InstructorLandingView />
        )}

        {/* ── FOOTER SIGNATURE ── */}
        <footer className="border-t border-white/[0.08] pt-12 pb-8 text-center text-xs text-slate-500 space-y-3">
          <div className="flex items-center justify-center gap-6 text-slate-400 font-semibold">
            <Link href="/register" className="hover:text-amber-400 transition-colors">Kayıt Ol</Link>
            <Link href="/login" className="hover:text-amber-400 transition-colors">Giriş Yap</Link>
            <Link href="/privacy" className="hover:text-amber-400 transition-colors">Gizlilik Politikası</Link>
            <Link href="/terms" className="hover:text-amber-400 transition-colors">Kullanım Şartları</Link>
          </div>
          <p>© 2026 DersoLab · Butik Online Akademi ve Koçluk Sistemi. Tüm hakları saklıdır.</p>
        </footer>
      </div>
    </div>
  )
}
