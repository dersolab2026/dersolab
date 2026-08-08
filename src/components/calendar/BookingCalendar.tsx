'use client'

import { useEffect, useState } from 'react'
import { tr } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Loader2 } from 'lucide-react'
import type { TimeSlot } from '@/types'
import { PIXEL_CARD, PIXEL_BADGE_ACTIVE, PIXEL_BUTTON_SECONDARY } from '@/lib/theme'

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
        const dateParam = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
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
      <div className={`${PIXEL_CARD} p-2`}>
        <Calendar
          mode="single"
          locale={tr}
          selected={selectedDate}
          onSelect={(date) => {
            if (!date) return
            setSelectedDate(date)
            setSelectedSlot(null)
            onSelectSlot(null)
          }}
          disabled={{ before: new Date() }}
        />
      </div>

      <div className={`${PIXEL_CARD} p-5`}>
        <p className="font-bold text-[#1B2430] mb-3">
          {selectedDate.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'long',
            weekday: 'long',
          })}{' '}
          için müsait saatler
        </p>

        {isLoading && (
          <div className="flex items-center gap-2 font-semibold text-[#1B2430]/70">
            <Loader2 className="h-4 w-4 animate-spin" />
            Yükleniyor...
          </div>
        )}

        {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

        {!isLoading && !error && slotsForSelectedDay.length === 0 && (
          <p className="text-sm font-semibold text-[#1B2430]/70">
            Bu tarihte müsait saat bulunmuyor.
          </p>
        )}

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {slotsForSelectedDay.map((slot) => (
            <button
              key={slot.start}
              type="button"
              onClick={() => handleSlotClick(slot)}
              className={`${selectedSlot?.start === slot.start ? PIXEL_BADGE_ACTIVE : PIXEL_BUTTON_SECONDARY} px-2 py-1.5 text-sm`}
            >
              {new Date(slot.start).toLocaleTimeString('tr-TR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
