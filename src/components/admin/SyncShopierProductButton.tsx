'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { syncPackageWithShopier } from '@/actions/admin'

export function SyncShopierProductButton({ packageId }: { packageId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    setError(null)
    startTransition(async () => {
      const result = await syncPackageWithShopier(packageId)
      if (!result.success) { setError(result.error); return }
      router.refresh()
    })
  }

  return (
    <div className="space-y-1">
      <Button variant="outline" size="sm" className="gap-2" onClick={handleClick} disabled={isPending}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        Shopier&apos;e Senkronize Et
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
