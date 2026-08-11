'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CopyIbanButton({ iban }: { iban: string }) {
  const [copied, setCopied] = useState(false)

  function handleClick() {
    navigator.clipboard.writeText(iban).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={handleClick} aria-label="IBAN'ı kopyala">
      {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
    </Button>
  )
}
