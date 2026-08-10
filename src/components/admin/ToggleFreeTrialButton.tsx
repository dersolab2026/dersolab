'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { setInstructorFreeTrial } from '@/actions/admin'
import { Button } from '@/components/ui/button'

export function ToggleFreeTrialButton({ instructorId, offersFreeTrial }: { instructorId: string; offersFreeTrial: boolean }) {
  const [isPending, startTransition] = useTransition()
  const [enabled, setEnabled] = useState(offersFreeTrial)
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    setError(null)
    const next = !enabled
    startTransition(async () => {
      const result = await setInstructorFreeTrial(instructorId, next)
      if (!result.success) {
        setError(result.error)
        return
      }
      setEnabled(next)
    })
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <Button variant={enabled ? 'default' : 'outline'} size="sm" onClick={handleClick} disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : enabled ? 'Açık' : 'Kapalı'}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
