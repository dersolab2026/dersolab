import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getInstructorBookings } from '@/lib/bookings/get-instructor-bookings'
import { getLessonMaterialsForBookings } from '@/lib/lessons/get-lesson-materials'
import { InstructorBookingListItem } from '@/components/instructor/InstructorBookingListItem'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { PIXEL_CARD } from '@/lib/theme'

export default async function InstructorDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: instructorRow } = await supabase
    .from('instructors').select('approval_status, calendar_connected').eq('user_id', user.id).single()
  const bookings = await getInstructorBookings(user.id)

  const needsAction = bookings.filter((b) => b.status === 'scheduled' && new Date(b.startTime) < new Date())
  const upcoming = bookings.filter((b) => b.status === 'scheduled' && new Date(b.startTime) >= new Date())
  const past = bookings.filter((b) => b.status !== 'scheduled')
  const materialsByBooking = await getLessonMaterialsForBookings(bookings.map((b) => b.id))

  return (
    <DashboardPageShell title="Derslerim" description="Rezervasyonlarını buradan yönetebilirsin.">
      {instructorRow?.approval_status === 'pending' && (
        <div className={`${PIXEL_CARD} p-3`}>
          <p className="text-sm font-semibold text-[#1B2430]">Profilin henüz onay bekliyor, onaylanana kadar öğrenciler seni göremez.</p>
        </div>
      )}
      {instructorRow?.approval_status === 'approved' && !instructorRow.calendar_connected && (
        <div className={`${PIXEL_CARD} p-3`}>
          <p className="text-sm font-semibold text-[#1B2430]">
            Öğrenciler rezervasyon yapabilsin diye önce{' '}
            <Link href="/dashboard/instructor/settings" className="underline text-[#DD7B3A]">Google Takvimini bağlaman</Link> gerekiyor.
          </p>
        </div>
      )}

      {needsAction.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-bold text-[#1B2430]">Onay Bekleyen Dersler</h2>
          <p className="text-sm font-semibold text-[#1B2430]/70">Saati geçmiş, tamamlandı olarak işaretlemen gerekiyor.</p>
          <div className="space-y-3">
            {needsAction.map((b) => (
              <InstructorBookingListItem key={b.id} booking={b} materials={materialsByBooking[b.id] ?? []} />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h2 className="font-bold text-[#1B2430]">Yaklaşan Dersler</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm font-bold text-[#1B2430]">Planlanmış ders yok.</p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((b) => (
              <InstructorBookingListItem key={b.id} booking={b} materials={materialsByBooking[b.id] ?? []} />
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
              <InstructorBookingListItem key={b.id} booking={b} materials={materialsByBooking[b.id] ?? []} />
            ))}
          </div>
        )}
      </div>
    </DashboardPageShell>
  )
}
