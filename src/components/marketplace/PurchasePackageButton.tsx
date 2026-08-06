'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { createCheckoutSession } from '@/actions/packages'
import { PIXEL_BUTTON_PRIMARY } from '@/lib/theme'

interface PurchasePackageButtonProps {
  packageId: string
  studentId: string
}

export function PurchasePackageButton({ packageId, studentId }: PurchasePackageButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handlePurchase() {
    setError(null)
    startTransition(async () => {
      const result = await createCheckoutSession({ packageId, studentId })
      if (!result.success) {
        setError(result.error)
        return
      }
      window.location.href = result.checkoutUrl
    })
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <button type="button" onClick={handlePurchase} disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} w-full py-2.5`}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Satın Al'}
      </button>
    </div>
  )
}
