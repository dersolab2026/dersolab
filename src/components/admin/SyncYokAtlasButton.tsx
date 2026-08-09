'use client'

import { useState, useTransition } from 'react'
import { Loader2, RefreshCw } from 'lucide-react'
import { syncYokAtlasData } from '@/actions/admin'
import { Button } from '@/components/ui/button'

export function SyncYokAtlasButton() {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    setError(null)
    setMessage(null)
    startTransition(async () => {
      const result = await syncYokAtlasData()
      if (!result.success) {
        setError(result.error)
        return
      }
      setMessage(`${result.fetched} kayıt çekildi, ${result.upserted} tanesi kaydedildi.`)
    })
  }

  return (
    <div className="space-y-2">
      <Button onClick={handleClick} disabled={isPending} className="gap-2">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
        YÖK Atlas Verisini Senkronize Et
      </Button>
      {message && <p className="text-sm text-green-600">{message}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
