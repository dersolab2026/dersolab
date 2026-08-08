'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { createCheckoutSession } from '@/actions/packages'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { BillingInfoForm } from '@/components/packages/BillingInfoForm'
import type { BillingInfo } from '@/actions/billing'
import { PIXEL_BUTTON_PRIMARY } from '@/lib/theme'

interface PurchasePackageButtonProps {
  packageId: string
  studentId: string
  billingInfo: BillingInfo | null
  hasBillingInfo: boolean
}

export function PurchasePackageButton({ packageId, studentId, billingInfo, hasBillingInfo }: PurchasePackageButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [showBillingForm, setShowBillingForm] = useState(false)
  const [billingReady, setBillingReady] = useState(hasBillingInfo)

  function startPurchase() {
    setError(null)
    startTransition(async () => {
      const result = await createCheckoutSession({ packageId, studentId })
      if (!result.success) {
        if (result.missingBillingInfo) {
          setShowBillingForm(true)
          return
        }
        setError(result.error)
        return
      }
      window.location.href = result.checkoutUrl
    })
  }

  function handlePurchase() {
    if (!billingReady) {
      setShowBillingForm(true)
      return
    }
    startPurchase()
  }

  function handleBillingSaved() {
    setBillingReady(true)
    setShowBillingForm(false)
    startPurchase()
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <button type="button" onClick={handlePurchase} disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} w-full py-2.5`}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Satın Al'}
      </button>

      <Dialog open={showBillingForm} onOpenChange={setShowBillingForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Fatura Bilgileri</DialogTitle></DialogHeader>
          <BillingInfoForm initialInfo={billingInfo} onSaved={handleBillingSaved} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
