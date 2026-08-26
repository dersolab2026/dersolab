'use client'

import { useState, useTransition } from 'react'
import { BookingCalendar } from '@/components/calendar/BookingCalendar'
import { Loader2 } from 'lucide-react'
import { createBooking } from '@/actions/bookings'
import type { TimeSlot, SessionType } from '@/types'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY } from '@/lib/theme'

interface InstructorBookingSectionProps {
  instructorId: string
  studentId: string
  /** Eğitmen hem ders hem koçluk veriyorsa öğrenci seans türünü kendisi seçer. */
  offersLessons: boolean
  offersCoaching: boolean
  defaultSessionType: SessionType
}

const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  lesson: 'Ders',
  coaching: 'Koçluk Seansı',
}

export function InstructorBookingSection({
  instructorId, studentId, offersLessons, offersCoaching, defaultSessionType,
}: InstructorBookingSectionProps) {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [topicNote, setTopicNote] = useState('')
  const [sessionType, setSessionType] = useState<SessionType>(defaultSessionType)
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const canChooseType = offersLessons && offersCoaching

  function handleConfirm() {
    if (!selectedSlot) return
    setResult(null)
    startTransition(async () => {
      const res = await createBooking({ instructorId, studentId, slot: selectedSlot, topicNote, sessionType })
      if (res.success) {
        setResult({
          success: true,
          message: sessionType === 'coaching'
            ? 'Koçluk seansın planlandı! Meet linki e-postana gönderildi.'
            : 'Ders başarıyla planlandı! Meet linki e-postana gönderildi.',
        })
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
          <p className="text-sm font-semibold text-[var(--yazi)]">
            Seçilen saat:{' '}
            <strong>{new Date(selectedSlot.start).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' })}</strong>
          </p>
          {canChooseType && (
            <div>
              <label className="block text-sm font-bold text-[var(--yazi)] mb-1">Ne planlamak istiyorsun?</label>
              <div className="grid grid-cols-2 gap-2">
                {(['lesson', 'coaching'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSessionType(type)}
                    className={`py-2 rounded-xl border-2 border-[var(--cizgi)] font-bold text-sm transition-all ${
                      sessionType === type ? 'bg-[var(--vurgu)] text-[var(--yazi-ters)]' : 'bg-[var(--yuzey-ic)] text-[var(--yazi)]'
                    }`}
                  >
                    {SESSION_TYPE_LABELS[type]}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-[var(--yazi)] mb-1">
              Hangi konuda yardım istiyorsun? <span className="font-semibold text-[var(--yazi)]/60">(isteğe bağlı)</span>
            </label>
            <textarea
              value={topicNote}
              onChange={(e) => setTopicNote(e.target.value)}
              rows={2}
              placeholder="Örn: Türev konusunda takıldığım sorular var"
              className="w-full p-2 rounded-xl border-2 border-[var(--cizgi)] bg-[var(--yuzey-ic)] text-sm outline-none focus:ring-4 focus:ring-[var(--ikincil-yazi)]/50 transition-all resize-none"
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
        <p className={`text-sm font-semibold ${result.success ? 'text-[var(--ikincil-yazi)]' : 'text-[var(--tehlike)]'}`}>{result.message}</p>
      )}
    </div>
  )
}
