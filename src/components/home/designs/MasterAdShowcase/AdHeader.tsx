'use client'

import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

export function AdHeader({ isLoggedIn, dashboardHref }: { isLoggedIn?: boolean; dashboardHref?: string }) {
  return (
    <header className="sticky top-3 z-50 max-w-6xl mx-auto px-3 sm:px-6">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <img
            src="/dersolab-logo.png"
            alt="DersoLab"
            className="h-8 sm:h-9 w-auto object-contain brightness-110 group-hover:scale-105 transition-transform"
          />
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/30 text-[10px] font-bold text-amber-300 tracking-wider uppercase">
            1:1 Canlı Özel Ders
          </span>
        </Link>

        {/* Quick Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300">
          <Link href="/instructors" className="hover:text-amber-300 transition-colors">
            Eğitmen Kadrosu
          </Link>
          <Link href="/demo-ders" className="hover:text-amber-300 transition-colors">
            20 Dk Ücretsiz Tanışma
          </Link>
          <Link href="/hakkimizda" className="hover:text-amber-300 transition-colors">
            Nasıl Çalışır?
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
              >
                Giriş
              </Link>
              <Link
                href="/demo-ders"
                className="relative group overflow-hidden flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 text-slate-950 font-bold text-xs shadow-[0_0_25px_rgba(245,158,11,0.4)] hover:shadow-[0_0_35px_rgba(245,158,11,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                <span>Ücretsiz Tanışma Başlat</span>
              </Link>
            </>
          ) : (
            <Link
              href={dashboardHref || '/dashboard'}
              className="flex items-center gap-1.5 px-4 sm:px-5 py-2.5 rounded-xl bg-white text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              <span>Paneline Git</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
