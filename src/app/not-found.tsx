import Link from 'next/link'
import Image from 'next/image'
import { Home, LogIn, Sparkles, Compass } from 'lucide-react'

export const metadata = {
  title: 'Sayfa Bulunamadı — DersoLab',
  description: 'Aradığınız sayfa taşınmış veya silinmiş olabilir.',
}

export default function NotFound() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-5 bg-[#080B11] text-slate-200 relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* Ambient background glow */}
      <div className="absolute top-[-15%] left-[-10%] w-[550px] h-[550px] rounded-full bg-emerald-500/10 blur-[140px] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[550px] h-[550px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 w-full max-w-lg bg-white/[0.03] rounded-3xl p-8 sm:p-10 border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl text-center">
        {/* Brand Header */}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-3.5 mb-6 group cursor-pointer"
        >
          <div className="w-12 h-12 relative transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/fox-head.png"
              alt="DersoLab Avatar"
              fill
              sizes="48px"
              className="object-contain"
              priority
            />
          </div>
          <span className="text-3xl font-black tracking-tight text-white group-hover:scale-[1.01] transition-transform">
            Derso<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Lab</span>
          </span>
        </Link>

        {/* 404 Hologram Badge */}
        <div className="relative my-4 inline-block">
          <p className="font-mono text-7xl sm:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500/60 drop-shadow-[0_4px_24px_rgba(16,185,129,0.2)]">
            404
          </p>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent rounded-full" />
        </div>

        <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Sayfa Bulunamadı
        </h1>

        <p className="mt-3 text-sm sm:text-base font-normal text-slate-400 leading-relaxed max-w-md mx-auto">
          Aradığın sayfa taşınmış, adı değişmiş ya da hiç var olmamış olabilir. Seni doğru yola koyalım.
        </p>

        {/* Action Links */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="w-4 h-4" />
            Ana Sayfa
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-semibold text-sm border border-white/10 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogIn className="w-4 h-4 text-slate-400" />
            Giriş Yap
          </Link>
          <Link
            href="/demo-ders"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-emerald-300 font-semibold text-sm border border-emerald-500/20 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Tanışma Dersi
          </Link>
        </div>

        {/* Quick Footer Links */}
        <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-center gap-5 text-xs text-slate-500 font-medium">
          <Link href="/instructors" className="hover:text-slate-300 transition-colors inline-flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            Eğitmenler
          </Link>
          <span className="text-white/10">•</span>
          <Link href="/hakkimizda" className="hover:text-slate-300 transition-colors">
            Hakkımızda
          </Link>
          <span className="text-white/10">•</span>
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">
            Gizlilik
          </Link>
        </div>
      </div>
    </main>
  )
}
