'use client'

import { useState, useTransition } from 'react'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { cancelBookingAsInstructor } from '@/actions/bookings'

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
          <Button variant="outline" size="sm">İptal Et</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bu dersi iptal etmek istediğine emin misin?</AlertDialogTitle>
            <AlertDialogDescription>
              Öğrencinin kredisi süre farketmeksizin iade edilecek ve kendisine bilgi verilecek.
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
