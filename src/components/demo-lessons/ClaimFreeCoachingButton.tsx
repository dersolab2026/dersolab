'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { claimFreeCoaching } from '@/actions/free-coaching'
import { useToast } from '@/components/ui/Toast'
import { PIXEL_BUTTON_PRIMARY } from '@/lib/theme'

export function ClaimFreeCoachingButton({ requestId }: { requestId: string }) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    setError(null)
    startTransition(async () => {
      const result = await claimFreeCoaching(requestId)
      if (!result.success) { setError(result.error); return }
      showToast('Koçluk talebini üstlendin, öğrenciyle iletişime geçebilirsin.')
      router.refresh()
    })
  }

  return (
    <div className="space-y-1">
      <button type="button" onClick={handleClick} disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-3 py-1.5 text-sm`}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Koçluğu Üstlen'}
      </button>
      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
    </div>
  )
}
