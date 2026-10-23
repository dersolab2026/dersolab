import Link from 'next/link'
import { Video } from 'lucide-react'
import { CancelBookingButton } from '@/components/booking/CancelBookingButton'
import { LessonMaterials } from '@/components/booking/LessonMaterials'
import type { StudentBookingItem } from '@/lib/bookings/get-student-bookings'
import type { LessonMaterial } from '@/lib/lessons/get-lesson-materials'
import { PIXEL_CARD, PIXEL_BADGE, PIXEL_BADGE_ACTIVE, PIXEL_BUTTON_SECONDARY } from '@/lib/theme'

interface BookingListItemProps {
  booking: StudentBookingItem
  materials: LessonMaterial[]
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: 'Planlandı',
  completed: 'Tamamlandı',
  cancelled: 'İptal Edildi',
  no_show: 'Gerçekleşmedi',
}

export function BookingListItem({ booking, materials }: BookingListItemProps) {
  const statusLabel = STATUS_LABELS[booking.status] ?? booking.status
  const formattedDate = new Date(booking.startTime).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' })

  return (
    <div className={`${PIXEL_CARD} p-4 flex flex-wrap items-center justify-between gap-3`}>
      <div>
        <p className="font-bold text-slate-200">
          {booking.instructorName}
          {booking.isTrial && <span className="ml-2 text-xs font-bold text-[#9C4A0C]">Tanışma Dersi</span>}
        </p>
        <p className="text-sm font-semibold text-slate-400">{formattedDate}</p>
        {booking.status === 'cancelled' && (
          <p className="text-xs font-semibold text-slate-400">
            {booking.creditRefunded ? 'Kredi iade edildi' : 'Kredi iade edilmedi'}
          </p>
        )}
        <LessonMaterials bookingId={booking.id} materials={materials} isInstructor={false} />
      </div>

      <div className="flex items-center gap-2">
        <span className={booking.status === 'scheduled' ? PIXEL_BADGE_ACTIVE : PIXEL_BADGE}>{statusLabel}</span>

        {booking.status === 'scheduled' && (
          <>
            <Link
              href={`/canli-ders/${booking.id}`}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] active:scale-95"
            >
              <Video className="h-4 w-4 fill-current" />
              Canlı Derse Katıl
            </Link>
            {booking.meetLink && (
              <a
                href={booking.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className={`${PIXEL_BUTTON_SECONDARY} px-2.5 py-1.5 text-xs text-slate-400`}
                title="Google Meet ile Aç"
              >
                Meet
              </a>
            )}
            <CancelBookingButton bookingId={booking.id} startTime={booking.startTime} />
          </>
        )}
      </div>
    </div>
  )
}
