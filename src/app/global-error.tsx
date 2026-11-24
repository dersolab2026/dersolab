'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Beklenmeyen uygulama hatası:', error)
  }, [error])

  return (
    <html lang="tr">
      <body className="min-h-screen bg-[#080B11] text-slate-100 flex items-center justify-center p-6 font-sans antialiased">
        <div className="max-w-md w-full rounded-2xl border border-white/10 bg-[#0F141F] p-8 text-center shadow-2xl space-y-5">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
            <img src="/dersolab-mark.svg" alt="DersoLab" className="w-8 h-8 object-contain" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black text-white tracking-tight">
              Beklenmeyen bir sorun oluştu
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sayfa yüklenirken geçici bir teknik aksaklık yaşandı. Lütfen sayfayı yenileyin veya ana sayfaya dönün.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="flex-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm py-3 px-4 transition-colors cursor-pointer"
            >
              Tekrar Dene
            </button>
            <a
              href="/"
              className="flex-1 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 text-slate-200 font-semibold text-sm py-3 px-4 transition-colors"
            >
              Ana Sayfaya Dön
            </a>
          </div>
        </div>
      </body>
    </html>
  )
}
