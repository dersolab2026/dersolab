'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Video } from 'lucide-react'
import { InstructorCancelBookingButton } from './InstructorCancelBookingButton'
import { MarkCompleteDialog } from './MarkCompleteDialog'
import { AssignHomeworkDialog } from './AssignHomeworkDialog'
import type { InstructorBookingItem } from '@/lib/bookings/get-instructor-bookings'

interface InstructorBookingListItemProps {
  booking: InstructorBookingItem
}

const STATUS_LABELS: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  scheduled: { label: 'Planlandı', variant: 'default' },
  completed: { label: 'Tamamlandı', variant: 'secondary' },
  cancelled: { label: 'İptal Edildi', variant: 'destructive' },
  no_show: { label: 'Gerçekleşmedi', variant: 'outline' },
}

export function InstructorBookingListItem({ booking }: InstructorBookingListItemProps) {
  const statusInfo = STATUS_LABELS[booking.status] ?? { label: booking.status, variant: 'outline' as const }
  const formattedDate = new Date(booking.startTime).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' })
  const isPastDue = booking.status === 'scheduled' && new Date(booking.startTime) < new Date()

  return (
    <Card>
      <CardContent className="flex flex-wrap items-center justify-between gap-3 py-4">
        <div>
          <p className="font-medium">{booking.studentName}</p>
          <p className="text-sm text-muted-foreground">{formattedDate}</p>
          {booking.instructorNotes && <p className="mt-1 text-xs text-muted-foreground">Not: {booking.instructorNotes}</p>}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>

          {booking.status === 'scheduled' && !isPastDue && (
            <>
              {booking.meetLink && (
                <Button size="sm" variant="outline" asChild className="gap-2">
                  <a href={booking.meetLink} target="_blank" rel="noopener noreferrer">
                    <Video className="h-4 w-4" />
                    Derse Katıl
                  </a>
                </Button>
              )}
              <InstructorCancelBookingButton bookingId={booking.id} />
            </>
          )}

          {isPastDue && <MarkCompleteDialog bookingId={booking.id} />}

          {booking.status === 'completed' && (
            <AssignHomeworkDialog studentId={booking.studentId} bookingId={booking.id} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}
