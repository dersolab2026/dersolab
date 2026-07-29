import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getInstructorSchedule } from '@/lib/availability/get-instructor-schedule'
import { WeeklyScheduleEditor } from '@/components/instructor/WeeklyScheduleEditor'

export default async function InstructorAvailabilityPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const rules = await getInstructorSchedule(user.id)

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Müsaitlik Takvimi</h1>
        <p className="text-muted-foreground">Öğrencilerin rezervasyon yapabileceği haftalık saatlerini belirle.</p>
      </div>
      <WeeklyScheduleEditor initialRules={rules} />
    </div>
  )
}
