'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { resubmitForReview } from '@/actions/instructor-profile'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY } from '@/lib/theme'

export function RejectedInstructorBanner({ approvalNote }: { approvalNote: string | null }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [resubmitted, setResubmitted] = useState(false)

  function handleResubmit() {
    setError(null)
    startTransition(async () => {
      const result = await resubmitForReview()
      if (!result.success) {
        setError(result.error)
        return
      }
      setResubmitted(true)
    })
  }

  if (resubmitted) {
    return (
      <div className={`${PIXEL_CARD} p-3`}>
        <p className="text-sm font-semibold text-[var(--yazi)]">Profilin tekrar incelemeye gönderildi, sonucu e-posta ile bildireceğiz.</p>
      </div>
    )
  }

  return (
    <div className={`${PIXEL_CARD} p-4 space-y-2`}>
      <p className="font-bold text-[var(--yazi)]">Profilin onaylanmadı</p>
      <p className="text-sm font-semibold text-[var(--yazi)]/70">
        {approvalNote || 'Profilinde düzeltilmesi gereken noktalar var. Detay için lütfen bizimle iletişime geç.'}
      </p>
      <p className="text-sm font-semibold text-[var(--yazi)]/70">
        <Link href="/dashboard/instructor/profile" className="underline text-[var(--vurgu-yazi)]">Profilini düzenle</Link>,
        {' '}sonra tekrar incelemeye gönderebilirsin.
      </p>
      {error && <p className="text-sm font-semibold text-[var(--tehlike)]">{error}</p>}
      <button type="button" onClick={handleResubmit} disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm`}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Tekrar İncelemeye Gönder'}
      </button>
    </div>
  )
}
