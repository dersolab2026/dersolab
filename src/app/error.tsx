'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Sayfa hatası:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] w-full bg-[#080B11] text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-2xl border border-white/10 bg-[#0F141F] p-8 text-center shadow-xl space-y-5">
        <div className="mx-auto w-12 h-12 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
          <img src="/dersolab-mark.svg" alt="DersoLab" className="w-7 h-7 object-contain" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-black text-white tracking-tight">
            Bu sayfa şu anda açılamadı
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            İşleminiz sırasında geçici bir hata oluştu. Tekrar deneyebilir veya ana sayfaya geçebilirsiniz.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            type="button"
            onClick={() => reset()}
            className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm py-2.5 px-4 transition-colors cursor-pointer"
          >
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="flex-1 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-slate-200 font-semibold text-sm py-2.5 px-4 transition-colors"
          >
            Ana Sayfa
          </Link>
        </div>
      </div>
    </div>
  )
}
