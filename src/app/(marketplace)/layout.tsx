import type { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import { DashboardNav } from '@/components/layout/DashboardNav'
import { MascotNotificationToast } from '@/components/layout/MascotNotificationToast'
import { getNotifications } from '@/actions/notifications'

export default async function MarketplaceLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return <>{children}</>

  const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
  const role = (userRow?.role ?? 'student') as 'student' | 'parent' | 'instructor' | 'admin'

  let offersFreeTrial = false
  if (role === 'instructor' || role === 'admin') {
    const { data: instructorRow } = await supabase
      .from('instructors').select('offers_free_trial').eq('user_id', user.id).single()
    offersFreeTrial = instructorRow?.offers_free_trial ?? false
  }

  const notifications = await getNotifications()

  return (
    <div>
      <DashboardNav role={role} offersFreeTrial={offersFreeTrial} notifications={notifications} />
      {children}
      <MascotNotificationToast />
    </div>
  )
}
