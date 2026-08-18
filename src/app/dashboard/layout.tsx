import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardNav } from '@/components/layout/DashboardNav'
import { getNotifications } from '@/actions/notifications'
import { GUIDANCE_SUBJECT } from '@/lib/constants'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
  const role = (userRow?.role ?? 'student') as 'student' | 'instructor' | 'admin'

  let offersFreeTrial = false
  let isCoach = false
  if (role === 'instructor' || role === 'admin') {
    const { data: instructorRow } = await supabase
      .from('instructors').select('offers_free_trial, subjects').eq('user_id', user.id).single()
    offersFreeTrial = instructorRow?.offers_free_trial ?? false
    isCoach = (instructorRow?.subjects ?? []).includes(GUIDANCE_SUBJECT)
  }

  const notifications = await getNotifications()

  return (
    <div className="md:flex">
      <DashboardNav role={role} offersFreeTrial={offersFreeTrial} isCoach={isCoach} notifications={notifications} />
      <main className="md:flex-1 md:min-w-0">{children}</main>
    </div>
  )
}
