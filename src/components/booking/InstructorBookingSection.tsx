'use client'

import { useState, useTransition } from 'react'
import { BookingCalendar } from '@/components/calendar/BookingCalendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { createBooking } from '@/actions/bookings'
import type { TimeSlot } from '@/types'

interface InstructorBookingSectionProps {
  instructorId: string
  studentId: string
}

export function InstructorBookingSection({ instructorId, studentId }: InstructorBookingSectionProps) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  function handleConfirm() {
    if (!selectedSlot) return
    setResult(null)
    startTransition(async () => {
      const res = await createBooking({ instructorId, studentId, slot: selectedSlot })
      if (res.success) {
        setResult({ success: true, message: 'Ders başarıyla planlandı! Meet linki e-postana gönderildi.' })
        setSelectedSlot(null)
      } else {
        setResult({ success: false, message: res.error })
      }
    })
  }

  return (
    <div className="space-y-4">
      <BookingCalendar instructorId={instructorId} onSelectSlot={setSelectedSlot} />

      {selectedSlot && (
        <Card>
          <CardContent className="flex items-center justify-between py-4">
            <p className="text-sm">
              Seçilen saat:{' '}
              <strong>{new Date(selectedSlot.start).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' })}</strong>
            </p>
            <Button onClick={handleConfirm} disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Rezervasyonu Onayla'}
            </Button>
          </CardContent>
        </Card>
      )}

      {result && (
        <p className={result.success ? 'text-sm text-green-600' : 'text-sm text-destructive'}>{result.message}</p>
      )}
    </div>
  )
}
