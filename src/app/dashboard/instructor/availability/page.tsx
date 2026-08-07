import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getInstructorSchedule } from '@/lib/availability/get-instructor-schedule'
import { WeeklyScheduleEditor } from '@/components/instructor/WeeklyScheduleEditor'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'

export default async function InstructorAvailabilityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const rules = await getInstructorSchedule(user.id)

  return (
    <DashboardPageShell title="Ajanda" description="Öğrencilerin rezervasyon yapabileceği haftalık saatlerini belirle.">
      <WeeklyScheduleEditor initialRules={rules} />
    </DashboardPageShell>
  )
}
