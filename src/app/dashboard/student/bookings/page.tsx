import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBookingsForViewer } from '@/lib/bookings/get-student-bookings'
import { BookingListItem } from '@/components/booking/BookingListItem'

export default async function StudentBookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
  const role = userRow?.role ?? 'student'

  const bookings = await getBookingsForViewer(user.id, role)
  const showStudentName = role === 'parent' && new Set(bookings.map((b) => b.studentId)).size > 1

  const upcoming = bookings.filter((b) => b.status === 'scheduled')
  const past = bookings.filter((b) => b.status !== 'scheduled')

  return (
    <div className="mx-auto max-w-2xl space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Derslerim</h1>
        <p className="text-muted-foreground">Planlanan ve geçmiş derslerin.</p>
      </div>

      <div className="space-y-3">
        <h2 className="font-medium">Yaklaşan Dersler</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">Planlanmış ders yok.</p>
        ) : (
          upcoming.map((b) => <BookingListItem key={b.id} booking={b} showStudentName={showStudentName} />)
        )}
      </div>

      <div className="space-y-3">
        <h2 className="font-medium">Geçmiş Dersler</h2>
        {past.length === 0 ? (
          <p className="text-sm text-muted-foreground">Henüz geçmiş ders yok.</p>
        ) : (
          past.map((b) => <BookingListItem key={b.id} booking={b} showStudentName={showStudentName} />)
        )}
      </div>
    </div>
  )
}
