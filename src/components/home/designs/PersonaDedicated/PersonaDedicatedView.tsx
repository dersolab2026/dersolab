'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  GraduationCap,
  ShieldCheck,
  Briefcase,
} from 'lucide-react'
import dynamic from 'next/dynamic'
import type { PersonaType } from '../../PersonaSwitcher'

const StudentLandingView = dynamic(() => import('./StudentLandingView').then(mod => mod.StudentLandingView), { ssr: true })
const ParentLandingView = dynamic(() => import('./ParentLandingView').then(mod => mod.ParentLandingView), { ssr: true })
const InstructorLandingView = dynamic(() => import('./InstructorLandingView').then(mod => mod.InstructorLandingView), { ssr: true })

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
          <StudentLandingView
            examFilter={examFilter}
            onExamFilterChange={handleExamFilterChange}
          />
        )}

        {activePersona === 'parent' && (
          <ParentLandingView examFilter={examFilter} onExamFilterChange={handleExamFilterChange} />
        )}

        {activePersona === 'instructor' && (
          <InstructorLandingView examFilter={examFilter} onExamFilterChange={handleExamFilterChange} />
        )}

        {/* ── FOOTER SIGNATURE ── */}
        <footer className="border-t border-white/[0.08] pt-14 pb-10 text-xs text-slate-400">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {/* Sütun 1: Marka & İletişim */}
            <div className="space-y-3">
              <p className="text-base font-black text-white tracking-tight">DersoLab</p>
              <p className="text-slate-400 leading-relaxed">
                LGS ve YKS hazırlığında zorunlu abonelik dayatmayan, yanmayan kredi ve onaylı eğitmenlerle bire bir online özel ders ve koçluk platformu.
              </p>
              <p className="text-slate-400">
                İletişim:{' '}
                <a href="mailto:destek@dersolab.com" className="text-amber-400 hover:underline font-semibold">
                  destek@dersolab.com
                </a>
              </p>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href="https://www.instagram.com/dersolabegitim/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-amber-400 hover:bg-white/[0.08] hover:border-amber-400/30 transition-all duration-300"
                  aria-label="Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://www.tiktok.com/@dersolabegitim"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-amber-400 hover:bg-white/[0.08] hover:border-amber-400/30 transition-all duration-300"
                  aria-label="TikTok"
                >
                  <TikTokIcon className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Sütun 2: Platform ve Ücretsiz Araçlar */}
            <div className="space-y-2.5">
              <p className="text-white font-bold uppercase tracking-wider text-[11px]">Platform &amp; Araçlar</p>
              <ul className="space-y-2">
                <li><Link href="/instructors" className="hover:text-amber-400 transition-colors">Onaylı Eğitmenler</Link></li>
                <li><Link href="/demo-ders" className="hover:text-amber-400 transition-colors">Ücretsiz Tanışma Dersi</Link></li>
                <li><Link href="/hesaplama" className="hover:text-amber-400 transition-colors">LGS &amp; YKS Net-Puan Simülatörü</Link></li>
                <li><Link href="/kocluk" className="hover:text-amber-400 transition-colors">Akademik Sınav Koçluğu</Link></li>
                <li><Link href="/lab" className="hover:text-amber-400 transition-colors">DersoLab L.A.B. (3D Atölyeler)</Link></li>
              </ul>
            </div>

            {/* Sütun 3: Branşlar ve Dersler (SEO) */}
            <div className="space-y-2.5">
              <p className="text-white font-bold uppercase tracking-wider text-[11px]">Özel Ders Branşları</p>
              <ul className="space-y-2">
                <li><Link href="/lab/matematik" className="hover:text-amber-400 transition-colors">LGS &amp; YKS Matematik Özel Ders</Link></li>
                <li><Link href="/lab/fizik" className="hover:text-amber-400 transition-colors">TYT &amp; AYT Fizik Özel Ders</Link></li>
                <li><Link href="/lab/kimya" className="hover:text-amber-400 transition-colors">TYT &amp; AYT Kimya Özel Ders</Link></li>
                <li><Link href="/lab/biyoloji" className="hover:text-amber-400 transition-colors">TYT &amp; AYT Biyoloji Özel Ders</Link></li>
                <li><Link href="/lab/turkce" className="hover:text-amber-400 transition-colors">LGS &amp; TYT Türkçe ve Paragraf</Link></li>
                <li><Link href="/lab/sosyal" className="hover:text-amber-400 transition-colors">Tarih, Coğrafya &amp; Sosyal Bilimler</Link></li>
              </ul>
            </div>

            {/* Sütun 4: Kurumsal & Hukuki */}
            <div className="space-y-2.5">
              <p className="text-white font-bold uppercase tracking-wider text-[11px]">Kurumsal &amp; Yasal</p>
              <ul className="space-y-2">
                <li><Link href="/hakkimizda" className="hover:text-amber-400 transition-colors">Hakkımızda</Link></li>
                <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Gizlilik Politikası ve KVKK</Link></li>
                <li><Link href="/terms" className="hover:text-amber-400 transition-colors">Kullanım ve İade Şartları</Link></li>
                <li><Link href="/contact" className="hover:text-amber-400 transition-colors">İletişim</Link></li>
                <li><Link href="/register?role=instructor" className="hover:text-amber-400 transition-colors">Eğitmen Başvurusu</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.05] pt-6 text-center text-slate-500">
            <p>© 2026 DersoLab · Online Özel Ders ve Akademik Koçluk Platformu. Tüm hakları saklıdır.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
