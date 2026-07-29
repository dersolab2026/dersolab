'use client'

import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

interface ConnectGoogleCalendarButtonProps {
  isConnected: boolean
}

export function ConnectGoogleCalendarButton({ isConnected }: ConnectGoogleCalendarButtonProps) {
  if (isConnected) {
    return (
      <Button variant="outline" disabled className="gap-2">
        <Check className="h-4 w-4" />
        Google Takvimi bağlı
      </Button>
    )
  }

  return (
    <Button asChild>
      <a href="/api/google/authorize">Google Takvimini Bağla</a>
    </Button>
  )
}
