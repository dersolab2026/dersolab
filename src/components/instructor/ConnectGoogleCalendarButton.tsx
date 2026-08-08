'use client'

import { Check } from 'lucide-react'
import { PIXEL_BUTTON_PRIMARY, PIXEL_BUTTON_SECONDARY } from '@/lib/theme'

interface ConnectGoogleCalendarButtonProps {
  isConnected: boolean
}

export function ConnectGoogleCalendarButton({ isConnected }: ConnectGoogleCalendarButtonProps) {
  if (isConnected) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className={`${PIXEL_BUTTON_SECONDARY} gap-2 px-4 py-2 opacity-70`}>
          <Check className="h-4 w-4" />
          Google Takvimi bağlı
        </span>
        <a href="/api/google/authorize" className="text-sm font-bold underline text-[#1B2430]">
          Yeniden Bağla
        </a>
      </div>
    )
  }

  return (
    <a href="/api/google/authorize" className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2`}>
      Google Takvimini Bağla
    </a>
  )
}
