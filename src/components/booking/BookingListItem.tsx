'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Video } from 'lucide-react'
import { CancelBookingButton } from '@/components/booking/CancelBookingButton'
import { LeaveReviewDialog } from '@/components/reviews/LeaveReviewDialog'
import type { StudentBookingItem } from '@/lib/bookings/get-student-bookings'

interface BookingListItemProps {
  booking: StudentBookingItem
  showStudentName: boolean
}

const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  scheduled: { label: 'Planlandı', variant: 'default' },
  completed: { label: 'Tamamlandı', variant: 'secondary' },
  cancelled: { label: 'İptal Edildi', variant: 'destructive' },
  no_show: { label: 'Gerçekleşmedi', variant: 'outline' },
}

export function BookingListItem({ booking, showStudentName }: BookingListItemProps) {
  const statusInfo = STATUS_LABELS[booking.status] ?? { label: booking.status, variant: 'outline' as const }
  const formattedDate = new Date(booking.startTime).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' })

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div>
          {showStudentName && <p className="text-xs text-muted-foreground">{booking.studentName}</p>}
          <p className="font-medium">{booking.instructorName}</p>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
          {booking.status === 'cancelled' && (
            <p className="text-xs text-muted-foreground">
              {booking.creditRefunded ? 'Kredi iade edildi' : 'Kredi iade edilmedi'}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>

          {booking.status === 'scheduled' && (
            <>
              {booking.meetLink && (
                <Button size="sm" variant="outline" asChild className="gap-2">
                  <a href={booking.meetLink} target="_blank" rel="noopener noreferrer">
                    <Video className="h-4 w-4" />
                    Derse Katıl
                  </a>
                </Button>
              )}
              <CancelBookingButton bookingId={booking.id} startTime={booking.startTime} />
            </>
          )}

          {booking.status === 'completed' && !booking.hasReview && (
            <LeaveReviewDialog
              bookingId={booking.id}
              studentId={booking.studentId}
              instructorId={booking.instructorId}
              instructorName={booking.instructorName}
            />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
