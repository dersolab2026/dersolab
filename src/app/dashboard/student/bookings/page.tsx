import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBookingsForViewer } from '@/lib/bookings/get-student-bookings'
import { getLessonMaterialsForBookings } from '@/lib/lessons/get-lesson-materials'
import { BookingListItem } from '@/components/booking/BookingListItem'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { getDemoLessonStatus } from '@/lib/demo-lessons/get-demo-lesson-status'
import { HosGeldinSeridi } from '@/components/demo-lessons/HosGeldinSeridi'

export default async function StudentBookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [bookings, demoDurumu] = await Promise.all([
    getBookingsForViewer(user.id),
    getDemoLessonStatus(user.id),
  ])

  const upcoming = bookings.filter((b) => b.status === 'scheduled')
  const past = bookings.filter((b) => b.status !== 'scheduled')
  const materialsByBooking = await getLessonMaterialsForBookings(bookings.map((b) => b.id))

  return (
    <DashboardPageShell title="Derslerim" description="Planlanan ve geçmiş derslerin.">
      {/* Hakkı duran öğrenci paketini buradan alabiliyor; ayrı sayfaya
          gitmesi gerekmiyor. Hak kullanılmışsa şerit hiç çıkmıyor. */}
      <HosGeldinSeridi studentId={user.id} durum={demoDurumu} />

      <div className="space-y-3">
        <h2 className="font-bold text-[var(--yazi)]">Yaklaşan Dersler</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm font-bold text-[var(--yazi)]">Planlanmış ders yok.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((b) => (
              <BookingListItem key={b.id} booking={b} materials={materialsByBooking[b.id] ?? []} />
            ))}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="font-bold text-[var(--yazi)]">Geçmiş Dersler</h2>
        {past.length === 0 ? (
          <p className="text-sm font-bold text-[var(--yazi)]">Henüz geçmiş ders yok.</p>
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
