'use client'

import { useState, useTransition } from 'react'
import { Loader2, Download } from 'lucide-react'
import { getTercihListesiSignedUrl } from '@/actions/yok-atlas'
import { PIXEL_BUTTON_SECONDARY } from '@/lib/theme'

export function TercihListesiDownloadButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleClick() {
    setError(null)
    startTransition(async () => {
      const result = await getTercihListesiSignedUrl(id)
      if ('error' in result) {
        setError(result.error)
        return
      }
      window.open(result.url, '_blank')
    })
  }

  return (
    <div>
      <button type="button" onClick={handleClick} disabled={isPending} className={`${PIXEL_BUTTON_SECONDARY} gap-2 px-3 py-1.5 text-sm`}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
        İndir
      </button>
      {error && <p className="mt-1 text-xs font-semibold text-red-600">{error}</p>}
    </div>
  )
}
