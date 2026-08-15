'use client'

import { useState, useTransition } from 'react'
import { BookingCalendar } from '@/components/calendar/BookingCalendar'
import { Loader2 } from 'lucide-react'
import { createBooking } from '@/actions/bookings'
import type { TimeSlot } from '@/types'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY } from '@/lib/theme'

interface InstructorBookingSectionProps {
  instructorId: string
  studentId: string
}

export function InstructorBookingSection({ instructorId, studentId }: InstructorBookingSectionProps) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [topicNote, setTopicNote] = useState('')
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  function handleConfirm() {
    if (!selectedSlot) return
    setResult(null)
    startTransition(async () => {
      const res = await createBooking({ instructorId, studentId, slot: selectedSlot, topicNote })
      if (res.success) {
        setResult({ success: true, message: 'Ders başarıyla planlandı! Meet linki e-postana gönderildi.' })
        setSelectedSlot(null)
        setTopicNote('')
      } else {
        setResult({ success: false, message: res.error })
      }
    })
  }

  return (
    <div className="space-y-4">
      <BookingCalendar instructorId={instructorId} onSelectSlot={setSelectedSlot} />

      {selectedSlot && (
        <div className={`${PIXEL_CARD} p-4 space-y-3`}>
          <p className="text-sm font-semibold text-[#1B2430]">
            Seçilen saat:{' '}
            <strong>{new Date(selectedSlot.start).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' })}</strong>
          </p>
          <div>
            <label className="block text-sm font-bold text-[#1B2430] mb-1">
              Hangi konuda yardım istiyorsun? <span className="font-semibold text-[#1B2430]/60">(isteğe bağlı)</span>
            </label>
            <textarea
              value={topicNote}
              onChange={(e) => setTopicNote(e.target.value)}
              rows={2}
              placeholder="Örn: Türev konusunda takıldığım sorular var"
              className="w-full p-2 rounded-xl border-2 border-[#1B2430] bg-white text-sm outline-none focus:ring-4 focus:ring-[#6FA89E]/50 transition-all resize-none"
            />
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={handleConfirm} disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm`}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Rezervasyonu Onayla'}
            </button>
          </div>
        </div>
      )}

      {result && (
        <p className={`text-sm font-semibold ${result.success ? 'text-[#6FA89E]' : 'text-red-600'}`}>{result.message}</p>
      )}
    </div>
  )
}
