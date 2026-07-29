'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { createCheckoutSession } from '@/actions/packages'

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
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button onClick={handlePurchase} disabled={isPending} className="w-full">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Satın Al'}
      </Button>
    </div>
  )
}
