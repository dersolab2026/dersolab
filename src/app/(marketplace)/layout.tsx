import type { UserRole } from '@/types'
import type { ReactNode } from 'react'
import { createClient } from '@/lib/supabase/server'
import { DashboardNav } from '@/components/layout/DashboardNav'
import { getNotifications } from '@/actions/notifications'

export default async function MarketplaceLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return <>{children}</>

  const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
  const role = (userRow?.role ?? 'student') as UserRole

  let offersFreeTrial = false
  if (role === 'instructor' || role === 'admin') {
    const { data: instructorRow } = await supabase
      .from('instructors').select('offers_free_trial').eq('user_id', user.id).single()
    offersFreeTrial = instructorRow?.offers_free_trial ?? false
  }

  const notifications = await getNotifications()

  return (
    <div className="dark md:flex min-h-screen bg-[#0a0a0a] text-slate-200 relative">
      {/* Global Background Orbs */}
      <div className="fixed top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[120px] pointer-events-none z-0" />
      
      <div className="relative z-50 md:shrink-0">
        <DashboardNav role={role} offersFreeTrial={offersFreeTrial} notifications={notifications} />
      </div>
      <main className="relative z-10 md:flex-1 md:min-w-0">{children}</main>
    </div>
  )
}
