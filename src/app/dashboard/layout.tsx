import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardNav } from '@/components/layout/DashboardNav'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
  const role = (userRow?.role ?? 'student') as 'student' | 'parent' | 'instructor' | 'admin'

  return (
    <div>
      <DashboardNav role={role} />
      <main>{children}</main>
    </div>
  )
}
