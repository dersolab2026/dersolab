'use client'

import { useEffect } from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY } from '@/lib/theme'

export default function InstructorProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Instructor Profile Error:', error)
  }, [error])

  return (
    <div className="min-h-[calc(100vh-57px)] md:min-h-screen w-full relative flex items-center justify-center p-5">
      <div className={`${PIXEL_CARD} p-8 max-w-md w-full text-center space-y-6`}>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-black text-white">Bir şeyler ters gitti</h2>
          <p className="text-sm font-semibold text-slate-400">
            Eğitmen profili yüklenirken bir bağlantı hatası oluştu. Lütfen bağlantını kontrol edip tekrar dene.
          </p>
        </div>

        <button
          onClick={() => reset()}
          className={`${PIXEL_BUTTON_PRIMARY} px-6 py-2.5 w-full flex items-center justify-center gap-2`}
        >
          <RotateCcw className="h-4 w-4" />
          Yeniden Dene
        </button>
      </div>
    </div>
  )
}
