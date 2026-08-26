'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { claimDemoLead } from '@/actions/demo-lessons'
import { PIXEL_BUTTON_PRIMARY } from '@/lib/theme'

export function ClaimDemoLeadButton({ requestId }: { requestId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    setError(null)
    startTransition(async () => {
      const result = await claimDemoLead(requestId)
      if (!result.success) { setError(result.error); return }
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button type="button" onClick={handleClick} disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} gap-2 px-3 py-1.5 text-sm`}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
        Kabul Et
      </button>
      {error && <p className="text-xs font-bold text-[var(--tehlike)]">{error}</p>}
    </div>
  )
}
