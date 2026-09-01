'use client'

import Link from 'next/link'

interface CleanHeaderProps {
  isLoggedIn?: boolean
  dashboardHref?: string
}

export function CleanHeader({ isLoggedIn, dashboardHref }: CleanHeaderProps) {
  return (
    <header className="flex items-center justify-between py-4 px-2 border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-40">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <img
          src="/dersolab-logo.png"
          alt="DersoLab"
          className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-102"
        />
      </Link>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <Link href="/instructors" className="hover:text-slate-950 transition-colors">
          Eğitmenler
        </Link>
        <Link href="/demo-ders" className="hover:text-slate-950 transition-colors">
          Ücretsiz Tanışma
        </Link>
        <Link href="/hakkimizda" className="hover:text-slate-950 transition-colors">
          Nasıl Çalışır?
        </Link>
      </nav>

      {/* Auth Actions */}
      <div className="flex items-center gap-2.5">
        {!isLoggedIn ? (
          <>
            <Link
              href="/login"
              className="text-xs sm:text-sm font-medium text-slate-700 hover:text-slate-950 px-3.5 py-2 rounded-lg hover:bg-slate-100/70 transition-colors"
            >
              Giriş Yap
            </Link>
            <Link
              href="/demo-ders"
              className="text-xs sm:text-sm font-semibold text-white bg-slate-950 hover:bg-slate-800 px-4 sm:px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all"
            >
              20 Dk Ücretsiz Başla
            </Link>
          </>
        ) : (
          <Link
            href={dashboardHref || '/dashboard'}
            className="text-xs sm:text-sm font-semibold text-white bg-slate-950 hover:bg-slate-800 px-4 sm:px-5 py-2.5 rounded-xl shadow-sm transition-all"
          >
            Paneline Git →
          </Link>
        )}
      </div>
    </header>
  )
}
