'use client'

import { useState, useTransition } from 'react'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { cancelBookingAsStudent } from '@/actions/bookings'
import { useToast } from '@/components/ui/Toast'
import { PIXEL_BUTTON_DANGER } from '@/lib/theme'

interface CancelBookingButtonProps {
  bookingId: string
  startTime: string
}

export function CancelBookingButton({ bookingId, startTime }: CancelBookingButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const hoursUntilLesson = (new Date(startTime).getTime() - Date.now()) / (1000 * 60 * 60)
  const willBeRefunded = hoursUntilLesson >= 24

  function handleConfirm() {
    setError(null)
    startTransition(async () => {
      const result = await cancelBookingAsStudent(bookingId)
      if (!result.success) { setError(result.error); return }
      showToast(willBeRefunded ? 'Ders iptal edildi, kredin iade edildi.' : 'Ders iptal edildi.')
    })
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-destructive">{error}</p>}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button type="button" className={`${PIXEL_BUTTON_DANGER} px-3 py-1.5 text-sm`}>İptal Et</button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bu dersi iptal etmek istediğine emin misin?</AlertDialogTitle>
            <AlertDialogDescription>
              {willBeRefunded
                ? 'Ders saatine 24 saatten fazla olduğu için kredin iade edilecek.'
                : 'Ders saatine 24 saatten az kaldığı için kredin iade edilmeyecek.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Vazgeç</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              Evet, iptal et
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
