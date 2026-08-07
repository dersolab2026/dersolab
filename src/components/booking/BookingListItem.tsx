'use client'

import { Video } from 'lucide-react'
import { CancelBookingButton } from '@/components/booking/CancelBookingButton'
import { LessonMaterials } from '@/components/booking/LessonMaterials'
import type { StudentBookingItem } from '@/lib/bookings/get-student-bookings'
import type { LessonMaterial } from '@/lib/lessons/get-lesson-materials'
import { PIXEL_CARD, PIXEL_BADGE, PIXEL_BADGE_ACTIVE, PIXEL_BUTTON_SECONDARY } from '@/lib/theme'

interface BookingListItemProps {
  booking: StudentBookingItem
  showStudentName: boolean
  materials: LessonMaterial[]
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Planlandı',
  completed: 'Tamamlandı',
  cancelled: 'İptal Edildi',
  no_show: 'Gerçekleşmedi',
}

export function BookingListItem({ booking, showStudentName, materials }: BookingListItemProps) {
  const statusLabel = STATUS_LABELS[booking.status] ?? booking.status
  const formattedDate = new Date(booking.startTime).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' })

  return (
    <div className={`${PIXEL_CARD} p-4 flex flex-wrap items-center justify-between gap-3`}>
      <div>
        {showStudentName && <p className="text-xs font-bold text-[#1B2430]/70">{booking.studentName}</p>}
        <p className="font-bold text-[#1B2430]">{booking.instructorName}</p>
        <p className="text-sm font-semibold text-[#1B2430]/70">{formattedDate}</p>
        {booking.status === 'cancelled' && (
          <p className="text-xs font-semibold text-[#1B2430]/70">
            {booking.creditRefunded ? 'Kredi iade edildi' : 'Kredi iade edilmedi'}
          </p>
        )}
        <LessonMaterials bookingId={booking.id} materials={materials} isInstructor={false} />
      </div>

      <div className="flex items-center gap-2">
        <span className={booking.status === 'scheduled' ? PIXEL_BADGE_ACTIVE : PIXEL_BADGE}>{statusLabel}</span>

        {booking.status === 'scheduled' && (
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
            <CancelBookingButton bookingId={booking.id} startTime={booking.startTime} />
          </>
        )}
      </div>
    </div>
  )
}
