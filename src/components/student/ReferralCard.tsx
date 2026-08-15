'use client'

import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { PIXEL_CARD } from '@/lib/theme'

interface ReferralCardProps {
  referralCode: string
}

export function ReferralCard({ referralCode }: ReferralCardProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(referralCode).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className={`${PIXEL_CARD} p-5 space-y-3`}>
      <div>
        <p className="font-bold text-[#1B2430]">Arkadaşını Davet Et</p>
        <p className="text-sm font-semibold text-[#1B2430]/70">
          Arkadaşın kayıt olurken bu kodu girsin, e-postasını onayladığında ikiniz de 1 ders kredisi kazanırsınız.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex-1 rounded-xl border-4 border-[#1B2430] bg-white px-4 py-2.5 font-mono text-lg font-bold tracking-widest text-[#1B2430]">
          {referralCode}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Davet kodunu kopyala"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-4 border-[#1B2430] bg-white shadow-[0_3px_0_#1B2430] active:translate-y-0.5 active:shadow-none transition-all"
        >
          {copied ? <Check className="h-5 w-5 text-[#6FA89E]" /> : <Copy className="h-5 w-5 text-[#1B2430]" />}
        </button>
      </div>
    </div>
  )
}
