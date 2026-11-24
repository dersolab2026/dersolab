'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Panel hatası:', error)
  }, [error])

  return (
    <div className="min-h-[60vh] w-full flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl border border-white/10 bg-[#121824] p-7 text-center shadow-xl space-y-4">
        <div className="space-y-1.5">
          <h2 className="text-lg font-black text-white tracking-tight">
            Panel verisi yüklenemedi
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            Bağlantı kesintisi veya geçici bir sunucu hatası oluştu. Verileriniz güvende; tekrar deneyebilirsiniz.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm py-2.5 px-4 transition-colors cursor-pointer"
          >
            Yeniden Yükle
          </button>
          <Link
            href="/dashboard"
            className="flex-1 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-slate-200 font-semibold text-sm py-2.5 px-4 transition-colors"
          >
            Panele Dön
          </Link>
        </div>
      </div>
    </div>
  )
}
