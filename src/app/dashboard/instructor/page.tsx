import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { getInstructorBookings } from '@/lib/bookings/get-instructor-bookings'
import { InstructorBookingListItem } from '@/components/instructor/InstructorBookingListItem'

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

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Derslerim</h1>
        <p className="text-muted-foreground">Rezervasyonlarını buradan yönetebilirsin.</p>
      </div>

      {instructorRow?.approval_status === 'pending' && (
        <p className="rounded-md border border-amber-400 bg-amber-50 p-3 text-sm text-amber-800">
          Profilin henüz onay bekliyor, onaylanana kadar öğrenciler seni göremez.
        </p>
      )}
      {instructorRow?.approval_status === 'approved' && !instructorRow.calendar_connected && (
        <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
          Öğrenciler rezervasyon yapabilsin diye önce{' '}
          <Link href="/dashboard/instructor/settings" className="underline">Google Takvimini bağlaman</Link> gerekiyor.
        </p>
      )}

      {needsAction.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-medium">Onay Bekleyen Dersler</h2>
          <p className="text-sm text-muted-foreground">Saati geçmiş, tamamlandı olarak işaretlemen gerekiyor.</p>
          {needsAction.map((b) => <InstructorBookingListItem key={b.id} booking={b} />)}
        </div>
      )}

      <div className="space-y-3">
        <h2 className="font-medium">Yaklaşan Dersler</h2>
        {upcoming.length === 0 ? <p className="text-sm text-muted-foreground">Planlanmış ders yok.</p> : upcoming.map((b) => <InstructorBookingListItem key={b.id} booking={b} />)}
      </div>

      <div className="space-y-3">
        <h2 className="font-medium">Geçmiş Dersler</h2>
        {past.length === 0 ? <p className="text-sm text-muted-foreground">Henüz geçmiş ders yok.</p> : past.map((b) => <InstructorBookingListItem key={b.id} booking={b} />)}
      </div>
    </div>
  )
}
