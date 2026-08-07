'use client'

import { useState, useTransition } from 'react'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { cancelBookingAsInstructor } from '@/actions/bookings'
import { PIXEL_BUTTON_DANGER } from '@/lib/theme'

interface InstructorCancelBookingButtonProps {
  bookingId: string
}

export function InstructorCancelBookingButton({ bookingId }: InstructorCancelBookingButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleConfirm() {
    setError(null)
    startTransition(async () => {
      const result = await cancelBookingAsInstructor(bookingId)
      if (!result.success) setError(result.error)
    })
  }

  return (
    <div className="space-y-1">
      {error && <p className="text-sm text-destructive">{error}</p>}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button type="button" className={`${PIXEL_BUTTON_DANGER} px-3 py-1.5 text-sm`}>İptal Et</button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bu dersi iptal etmek istediğine emin misin?</AlertDialogTitle>
            <AlertDialogDescription>
              Öğrencinin kredisi süre fark etmeksizin iade edilecek ve kendisine bilgi verilecek.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>Evet, iptal et</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
