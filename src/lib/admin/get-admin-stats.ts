import { createClient } from '@/lib/supabase/server'

export interface AdminStats {
  totalStudents: number
  totalInstructors: number
  pendingInstructors: number
  bookingsThisMonth: number
  revenueThisMonth: number
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = await createClient()

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const [
    { count: totalStudents },
    { count: totalInstructors },
    { count: pendingInstructors },
    { count: bookingsThisMonth },
    { data: purchasesThisMonth },
  ] = await Promise.all([
    supabase.from('students').select('*', { count: 'exact', head: true }),
    supabase.from('instructors').select('*', { count: 'exact', head: true }),
    supabase.from('instructors').select('*', { count: 'exact', head: true }).eq('approval_status', 'pending'),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth.toISOString()),
    supabase.from('package_purchases').select('amount_paid').eq('status', 'completed').gte('created_at', startOfMonth.toISOString()),
  ])

  const revenueThisMonth = (purchasesThisMonth ?? []).reduce((sum: number, p: any) => sum + Number(p.amount_paid), 0)

  return {
    totalStudents: totalStudents ?? 0,
    totalInstructors: totalInstructors ?? 0,
    pendingInstructors: pendingInstructors ?? 0,
    bookingsThisMonth: bookingsThisMonth ?? 0,
    revenueThisMonth,
  }
}
