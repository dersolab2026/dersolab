import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { StudyRoomClient } from '@/components/student/StudyRoomClient'

export const metadata = {
  title: 'Odaklanma & Pomodoro Odası — DersoLab',
  description: 'Zihnini topla, arka plan sesleriyle derin odağa gir ve çalışma sürelerini günlüğüne kaydet.',
}

export default async function OdaklanmaPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <DashboardPageShell
      title="Odaklanma & Pomodoro Odası"
      description="Zihnini topla, arka plan ambiyansıyla dikkatini dağıtan her şeyden uzaklaş ve hedefine adım adım ilerle."
    >
      <StudyRoomClient />
    </DashboardPageShell>
  )
}
