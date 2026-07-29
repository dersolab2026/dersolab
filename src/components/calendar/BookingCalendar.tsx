'use client'

import { useEffect, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import type { TimeSlot } from '@/types'

interface BookingCalendarProps {
  instructorId: string
  onSelectSlot: (slot: TimeSlot | null) => void
}

export function BookingCalendar({ instructorId, onSelectSlot }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false

    async function fetchSlots() {
      setIsLoading(true)
      setError(null)
      try {
        const dateParam = selectedDate.toISOString().split('T')[0]
        const response = await fetch(
          `/api/instructors/${instructorId}/availability?date=${dateParam}`
        )
        if (!response.ok) throw new Error('İstek başarısız oldu')
        const data = await response.json()
        if (!isCancelled) setSlots(data.slots ?? [])
      } catch {
        if (!isCancelled) setError('Müsait saatler yüklenemedi, tekrar dener misin?')
      } finally {
        if (!isCancelled) setIsLoading(false)
      }
    }

    fetchSlots()
    return () => {
      isCancelled = true
    }
  }, [instructorId, selectedDate])

  const slotsForSelectedDay = slots.filter((slot) => {
    const slotDate = new Date(slot.start)
    return (
      slotDate.getFullYear() === selectedDate.getFullYear() &&
      slotDate.getMonth() === selectedDate.getMonth() &&
      slotDate.getDate() === selectedDate.getDate()
    )
  })

  function handleSlotClick(slot: TimeSlot) {
    setSelectedSlot(slot)
    onSelectSlot(slot)
  }

  return (
    <div className="grid gap-6 md:grid-cols-[auto_1fr]">
      <Card>
        <CardContent className="p-2">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (!date) return
              setSelectedDate(date)
              setSelectedSlot(null)
              onSelectSlot(null)
            }}
            disabled={{ before: new Date() }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            {selectedDate.toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              weekday: 'long',
            })}{' '}
            için müsait saatler
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Yükleniyor...
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          {!isLoading && !error && slotsForSelectedDay.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Bu tarihte müsait saat bulunmuyor.
            </p>
          )}

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slotsForSelectedDay.map((slot) => (
              <Button
                key={slot.start}
                variant={selectedSlot?.start === slot.start ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleSlotClick(slot)}
              >
                {new Date(slot.start).toLocaleTimeString('tr-TR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}