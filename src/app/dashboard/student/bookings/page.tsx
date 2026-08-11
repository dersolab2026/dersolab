import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBookingsForViewer } from '@/lib/bookings/get-student-bookings'
import { getLessonMaterialsForBookings } from '@/lib/lessons/get-lesson-materials'
import { BookingListItem } from '@/components/booking/BookingListItem'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'

export default async function StudentBookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const bookings = await getBookingsForViewer(user.id)

  const upcoming = bookings.filter((b) => b.status === 'scheduled')
  const past = bookings.filter((b) => b.status !== 'scheduled')
  const materialsByBooking = await getLessonMaterialsForBookings(bookings.map((b) => b.id))

  return (
    <DashboardPageShell title="Derslerim" description="Planlanan ve geçmiş derslerin.">
      <div className="space-y-3">
        <h2 className="font-bold text-[#1B2430]">Yaklaşan Dersler</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm font-bold text-[#1B2430]">Planlanmış ders yok.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((b) => (
              <BookingListItem key={b.id} booking={b} materials={materialsByBooking[b.id] ?? []} />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="font-bold text-[#1B2430]">Geçmiş Dersler</h2>
        {past.length === 0 ? (
          <p className="text-sm font-bold text-[#1B2430]">Henüz geçmiş ders yok.</p>
        ) : (
          <div className="space-y-3">
            {past.map((b) => (
              <BookingListItem key={b.id} booking={b} materials={materialsByBooking[b.id] ?? []} />
            ))}
          </div>
        )}
      </div>
    </DashboardPageShell>
  )
}
