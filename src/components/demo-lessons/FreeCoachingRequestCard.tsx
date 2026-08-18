'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { requestFreeCoaching, type FreeCoachingStatus } from '@/actions/free-coaching'
import { useToast } from '@/components/ui/Toast'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY } from '@/lib/theme'

interface FreeCoachingRequestCardProps {
  initialStatus: FreeCoachingStatus
}

export function FreeCoachingRequestCard({ initialStatus }: FreeCoachingRequestCardProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    setError(null)
    startTransition(async () => {
      const result = await requestFreeCoaching()
      if (!result.success) { setError(result.error); return }
      showToast('Koçluk talebin alındı.')
      router.refresh()
    })
  }

  if (initialStatus.requestStatus === 'assigned') {
    return (
      <div className={`${PIXEL_CARD} p-5`}>
        <p className="font-bold text-[#1B2430]">Koçun atandı!</p>
        <p className="mt-1 text-sm font-semibold text-[#1B2430]/70">
          {initialStatus.coachName
            ? `${initialStatus.coachName} seninle ilgilenecek ve haftalık planını birlikte kuracaksınız.`
            : 'Koçun seninle iletişime geçip haftalık planını birlikte kuracaksınız.'}
        </p>
      </div>
    )
  }

  if (initialStatus.requestStatus === 'pending') {
    return (
      <div className={`${PIXEL_CARD} p-5`}>
        <p className="font-bold text-[#1B2430]">Talebin alındı!</p>
        <p className="mt-1 text-sm font-semibold text-[#1B2430]/70">
          Uygun bir koçumuz talebini üstlenip seninle iletişime geçecek.
        </p>
      </div>
    )
  }

  if (initialStatus.used) {
    return (
      <div className={`${PIXEL_CARD} p-5`}>
        <p className="font-bold text-[#1B2430]">Ücretsiz koçluk hakkını kullandın</p>
        <p className="mt-1 text-sm font-semibold text-[#1B2430]/70">
          Koçluk seanslarına ders kredinle devam edebilirsin.
        </p>
      </div>
    )
  }

  return (
    <div className={`${PIXEL_CARD} p-5 space-y-3`}>
      <p className="font-bold text-[#1B2430]">1 Hafta Ücretsiz Koçluk</p>
      <p className="text-sm font-semibold text-[#1B2430]/70">
        Bir hafta boyunca bir koçun seninle ilgilensin: hedeflerini konuşun, çalışma
        programını birlikte kurun, nerede takıldığını takip etsin. Kredi harcamıyorsun.
      </p>
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <button type="button" onClick={handleClick} disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm`}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ücretsiz Koçluk Talep Et'}
      </button>
    </div>
  )
}
