import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getBookingsForViewer } from '@/lib/bookings/get-student-bookings'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { WeeklyAgenda } from '@/components/student/WeeklyAgenda'

export default async function StudentAjandaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const bookings = await getBookingsForViewer(user.id)

  return (
    <DashboardPageShell title="Ajanda" description="Bu haftaki ve gelecek haftaki derslerini tek bakışta gör.">
      <WeeklyAgenda bookings={bookings} />
    </DashboardPageShell>
  )
}
