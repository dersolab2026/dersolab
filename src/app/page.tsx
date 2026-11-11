import type { Metadata } from 'next'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import { PersonaDedicatedView } from '@/components/home/designs/PersonaDedicated/PersonaDedicatedView'

export const metadata: Metadata = {
  alternates: {
    canonical: '/',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-[#080B11] text-slate-100 relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950 font-sans">
      <PersonaDedicatedView initialPersona="student" />

      {/* Alternatif Tasarım Hızlı Geçiş Butonu */}
      <Link
        href="/tasarim4"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-2xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all duration-200 border border-amber-300"
      >
        <Sparkles className="w-4 h-4 text-slate-950" />
        <span>Alternatif Tasarımı Aç (3D & GSAP)</span>
      </Link>
    </div>
  )
}
