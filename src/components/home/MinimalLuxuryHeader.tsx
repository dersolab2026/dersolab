'use client'

import Link from 'next/link'

interface MinimalLuxuryHeaderProps {
  isLoggedIn?: boolean
  dashboardHref?: string
}

export function MinimalLuxuryHeader({ isLoggedIn, dashboardHref }: MinimalLuxuryHeaderProps) {
  return (
    <header className="flex items-center justify-between py-4 px-2 sm:px-4 border-b border-white/[0.06] backdrop-blur-xl">
      {/* Brand Logo Mark */}
      <Link href="/" className="group flex items-center gap-3 transition-opacity">
        <div className="relative">
          <div className="absolute -inset-1.5 bg-emerald-500/25 rounded-2xl blur-md group-hover:bg-emerald-500/40 transition-colors" />
          <img
            src="/luxury-fox-emblem.jpg"
            alt="DersoLab"
            className="relative h-10 w-10 sm:h-11 sm:w-11 rounded-xl object-cover border border-white/20 shadow-lg"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-extrabold text-base sm:text-lg tracking-wider text-white uppercase leading-none font-mono">
            DERSO<span className="text-emerald-400">LAB</span>
          </span>
          <span className="text-[10px] font-medium text-slate-400 tracking-widest uppercase">
            Canlı Özel Ders
          </span>
        </div>
      </Link>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Platform Aktif</span>
        </div>

        {!isLoggedIn ? (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-3.5 py-2 rounded-xl transition-colors"
            >
              Giriş
            </Link>
            <Link
              href="/register"
              className="text-xs sm:text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 px-4 sm:px-5 py-2 rounded-xl shadow-lg shadow-white/5 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Kayıt Ol
            </Link>
          </div>
        ) : (
          <Link
            href={dashboardHref || '/dashboard'}
            className="text-xs sm:text-sm font-semibold text-slate-950 bg-white hover:bg-slate-100 px-4 sm:px-5 py-2 rounded-xl shadow-lg shadow-white/5 transition-all"
          >
            Paneline Git →
          </Link>
        )}
      </div>
    </header>
  )
}
