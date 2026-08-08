import { createClient } from '@/lib/supabase/server'
import { getGoogleBusyBlocks } from '@/lib/google/calendar'
import { LESSON_DURATION_MINUTES } from '@/lib/constants'
import type { TimeSlot } from '@/types'

interface BusyInterval {
  start: number
  end: number
}

interface AvailabilityRule {
  day_of_week: number
  start_time: string
  end_time: string
}

// Türkiye 2016'dan beri yaz saati uygulamıyor, sabit UTC+3.
const ISTANBUL_OFFSET_MS = 3 * 60 * 60 * 1000

export async function getAvailableSlots(
  instructorId: string,
  rangeStart: Date,
  rangeEnd: Date
): Promise<TimeSlot[]> {
  const supabase = await createClient()

  const { data: rules, error: rulesError } = await supabase
    .from('instructor_availability')
    .select('day_of_week, start_time, end_time')
    .eq('instructor_id', instructorId)
    .eq('is_active', true)

  if (rulesError) throw rulesError

  const { data: existingBookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('start_time, end_time')
    .eq('instructor_id', instructorId)
    .in('status', ['scheduled', 'completed'])
    .gte('start_time', rangeStart.toISOString())
    .lte('end_time', rangeEnd.toISOString())

  if (bookingsError) throw bookingsError

  const googleBusy = await getGoogleBusyBlocks(
    instructorId,
    rangeStart.toISOString(),
    rangeEnd.toISOString()
  )

  const busyIntervals: BusyInterval[] = [
    ...(existingBookings ?? []).map((b: any) => ({
      start: new Date(b.start_time).getTime(),
      end: new Date(b.end_time).getTime(),
    })),
    ...googleBusy.map((b) => ({
      start: new Date(b.start).getTime(),
      end: new Date(b.end).getTime(),
    })),
  ]

  const candidates = generateCandidateSlots(rules ?? [], rangeStart, rangeEnd)
  return candidates.filter((slot) => !overlapsAny(slot, busyIntervals))
}

function generateCandidateSlots(
  rules: AvailabilityRule[],
  rangeStart: Date,
  rangeEnd: Date
): TimeSlot[] {
  const slots: TimeSlot[] = []
  const now = new Date()
  let cursor = new Date(rangeStart)

  while (cursor.getTime() <= rangeEnd.getTime()) {
    // cursor'u Istanbul yerel takvim gunune cevirip UTC getter'larla okuyoruz,
    // boylece sunucunun calistigi saat dilimi (ornegin Vercel'de UTC) sonucu etkilemiyor.
    const istanbulLocal = new Date(cursor.getTime() + ISTANBUL_OFFSET_MS)
    const year = istanbulLocal.getUTCFullYear()
    const month = istanbulLocal.getUTCMonth()
    const day = istanbulLocal.getUTCDate()
    const dayOfWeek = istanbulLocal.getUTCDay()

    const dayRules = rules.filter((r) => r.day_of_week === dayOfWeek)

    for (const rule of dayRules) {
      const [startH, startM] = rule.start_time.split(':').map(Number)
      const [endH, endM] = rule.end_time.split(':').map(Number)

      const windowStart = new Date(Date.UTC(year, month, day, startH, startM, 0, 0) - ISTANBUL_OFFSET_MS)
      const windowEnd = new Date(Date.UTC(year, month, day, endH, endM, 0, 0) - ISTANBUL_OFFSET_MS)

      let slotStart = new Date(windowStart)
      while (slotStart.getTime() + LESSON_DURATION_MINUTES * 60_000 <= windowEnd.getTime()) {
        const slotEnd = new Date(slotStart.getTime() + LESSON_DURATION_MINUTES * 60_000)
        if (slotStart > now) {
          slots.push({ start: slotStart.toISOString(), end: slotEnd.toISOString() })
        }
        slotStart = slotEnd
      }
    }

    cursor = new Date(cursor.getTime() + 24 * 60 * 60 * 1000)
  }

  return slots
}

function overlapsAny(slot: TimeSlot, busy: BusyInterval[]): boolean {
  const slotStart = new Date(slot.start).getTime()
  const slotEnd = new Date(slot.end).getTime()
  return busy.some((b) => slotStart < b.end && slotEnd > b.start)
}
