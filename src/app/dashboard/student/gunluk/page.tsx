import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBookingsForViewer } from '@/lib/bookings/get-student-bookings'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { DailyAgenda } from '@/components/student/DailyAgenda'

export default async function StudentGunlukPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const bookings = await getBookingsForViewer(user.id)

  return (
    <DashboardPageShell title="Günlük" description="Bir gün seç, o güne ait derslerini gör.">
      <DailyAgenda bookings={bookings} />
    </DashboardPageShell>
  )
}
