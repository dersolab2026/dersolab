import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardRedirectPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()

  if (userRow?.role === 'instructor') redirect('/dashboard/instructor')
  if (userRow?.role === 'admin') redirect('/dashboard/admin')
  redirect('/dashboard/student/bookings')
}
