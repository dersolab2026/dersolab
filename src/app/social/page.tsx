import type { Metadata } from 'next'
import SocialStudioPage from '@/app/dashboard/admin/social/page'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sosyal Medya Asistanı — DersoLab',
  description: 'DersoLab Instagram & TikTok içerik asistanı, kaydırmalı carousel ve reels senaryo oluşturucu.',
}

export default function StandaloneSocialPage() {
  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-orange-500 selection:text-white font-sans relative">
      {/* Üst Navigasyon Çubuğu */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Panele Dön</span>
          </Link>

          <div className="flex items-center gap-2">
            <img src="/fox-head.png" alt="DersoLab" className="w-7 h-7 object-contain" />
            <span className="font-black text-white text-base tracking-tight">
              Derso<span className="text-orange-400">Lab</span>
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-orange-500/15 border border-orange-500/30 text-orange-400 text-[10px] font-bold">
              SOSYAL MEDYA ASİSTANI
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://www.instagram.com/dersolabegitim/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-pink-400 transition-colors"
          >
            <span>@dersolabegitim</span>
          </a>
        </div>
      </header>

      {/* Ana Gövde */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <SocialStudioPage />
      </main>
    </div>
  )
}
