'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { setInstructorPaused } from '@/actions/instructor-profile'
import { useToast } from '@/components/ui/Toast'
import { PIXEL_BUTTON_SECONDARY } from '@/lib/theme'

export function PauseProfileButton({ paused }: { paused: boolean }) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    setError(null)
    startTransition(async () => {
      const result = await setInstructorPaused(!paused)
      if (!result.success) { setError(result.error); return }
      showToast(paused ? 'Profilin tekrar aktif.' : 'Profilin donduruldu.')
      router.refresh()
    })
  }

  return (
    <div className="space-y-1.5">
      <button type="button" onClick={handleClick} disabled={isPending} className={`${PIXEL_BUTTON_SECONDARY} gap-2 px-4 py-2`}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : paused ? 'Profili Aktifleştir' : 'Profili Dondur'}
      </button>
      <p className="text-xs font-semibold text-[#1B2430]/60">
        {paused
          ? 'Profilin şu anda dondurulmuş — pazar yerinde görünmüyor ve yeni rezervasyon alamıyorsun.'
          : 'Dondurunca profilin pazar yerinden geçici olarak kalkar, yeni rezervasyon alamazsın. Dilediğinde tekrar aktifleştirebilirsin.'}
      </p>
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
    </div>
  )
}
