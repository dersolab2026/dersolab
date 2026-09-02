'use client'

import { useState } from 'react'
import { StudentLandingView } from '@/components/home/designs/PersonaDedicated/StudentLandingView'
import { ParentLandingView } from '@/components/home/designs/PersonaDedicated/ParentLandingView'
import { InstructorLandingView } from '@/components/home/designs/PersonaDedicated/InstructorLandingView'

export type Persona = 'student' | 'parent' | 'instructor'

export function HomeClient() {
  const [persona, setPersona] = useState<Persona>('student')
  const [examFilter, setExamFilter] = useState<'all' | 'lgs' | 'yks'>('yks')

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-slate-200 overflow-x-hidden">
      {/* Persona Selector Navbar (Sticky/Fixed) */}
      <div className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/10 flex justify-center py-3 px-4">
        <div className="flex bg-white/[0.02] border border-white/5 rounded-2xl p-1 w-full max-w-md mx-auto">
          <button
            type="button"
            onClick={() => setPersona('student')}
            className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
              persona === 'student' 
                ? 'bg-orange-500/20 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]' 
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Öğrenci
          </button>
          <button
            type="button"
            onClick={() => setPersona('parent')}
            className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
              persona === 'parent'
                ? 'bg-emerald-600/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Veli
          </button>
          <button
            type="button"
            onClick={() => setPersona('instructor')}
            className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
              persona === 'instructor'
                ? 'bg-blue-600/20 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Eğitmen
          </button>
        </div>
      </div>

      <div className="pt-20">
        {persona === 'student' && <StudentLandingView examFilter={examFilter} onExamFilterChange={setExamFilter} />}
        {persona === 'parent' && <ParentLandingView examFilter={examFilter} onExamFilterChange={setExamFilter} />}
        {persona === 'instructor' && <InstructorLandingView examFilter={examFilter} onExamFilterChange={setExamFilter} />}
      </div>
    </div>
  )
}
