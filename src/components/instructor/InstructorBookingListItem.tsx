'use client'

import { Video } from 'lucide-react'
import { InstructorCancelBookingButton } from './InstructorCancelBookingButton'
import { MarkCompleteDialog } from './MarkCompleteDialog'
import { AssignHomeworkDialog } from './AssignHomeworkDialog'
import type { InstructorBookingItem } from '@/lib/bookings/get-instructor-bookings'
import { PIXEL_CARD, PIXEL_BADGE, PIXEL_BADGE_ACTIVE, PIXEL_BUTTON_SECONDARY } from '@/lib/theme'

interface InstructorBookingListItemProps {
  booking: InstructorBookingItem
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Planlandı',
  completed: 'Tamamlandı',
  cancelled: 'İptal Edildi',
  no_show: 'Gerçekleşmedi',
}

export function InstructorBookingListItem({ booking }: InstructorBookingListItemProps) {
  const statusLabel = STATUS_LABELS[booking.status] ?? booking.status
  const formattedDate = new Date(booking.startTime).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' })
  const isPastDue = booking.status === 'scheduled' && new Date(booking.startTime) < new Date()

  return (
    <div className={`${PIXEL_CARD} p-4 flex flex-wrap items-center justify-between gap-3`}>
      <div>
        <p className="font-bold text-[#1B2430]">{booking.studentName}</p>
        <p className="text-sm font-semibold text-[#1B2430]/70">{formattedDate}</p>
        {booking.instructorNotes && <p className="mt-1 text-xs font-semibold text-[#1B2430]/60">Not: {booking.instructorNotes}</p>}
      </div>

      <div className="flex items-center gap-2">
        <span className={booking.status === 'scheduled' ? PIXEL_BADGE_ACTIVE : PIXEL_BADGE}>{statusLabel}</span>

        {booking.status === 'scheduled' && !isPastDue && (
          <>
            {booking.meetLink && (
              <a
                href={booking.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`${PIXEL_BUTTON_SECONDARY} gap-2 px-3 py-1.5 text-sm`}
              >
                <Video className="h-4 w-4" />
                Derse Katıl
              </a>
            )}
            <InstructorCancelBookingButton bookingId={booking.id} />
          </>
        )}

        {isPastDue && <MarkCompleteDialog bookingId={booking.id} />}

        {booking.status === 'completed' && (
          <AssignHomeworkDialog studentId={booking.studentId} bookingId={booking.id} />
        )}
      </div>
    </div>
  )
}
