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

  // Silinmis hesaplarin students/instructors satiri duruyor. instructors ile
  // users arasinda birden fazla iliski oldugu icin PostgREST embed'i
  // kullanamiyoruz; canli kullanici kumesini alip kesisim aliyoruz. Boylece
  // Kullanicilar sayfasiyla ayni sayilar cikiyor.
  const [
    { data: liveUsers },
    { data: instructorRows },
    { count: bookingsThisMonth },
    { data: purchasesThisMonth },
  ] = await Promise.all([
    supabase.from('users').select('id, role').is('deleted_at', null),
    supabase.from('instructors').select('user_id, approval_status'),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).gte('created_at', startOfMonth.toISOString()),
    supabase.from('package_purchases').select('amount_paid').eq('status', 'completed').gte('created_at', startOfMonth.toISOString()),
  ])

  const liveUserIds = new Set((liveUsers ?? []).map((u: any) => u.id))
  const liveInstructors = (instructorRows ?? []).filter((i: any) => liveUserIds.has(i.user_id))

  const revenueThisMonth = (purchasesThisMonth ?? []).reduce((sum: number, p: any) => sum + Number(p.amount_paid), 0)

  return {
    totalStudents: (liveUsers ?? []).filter((u: any) => u.role === 'student').length,
    totalInstructors: liveInstructors.length,
    pendingInstructors: liveInstructors.filter((i: any) => i.approval_status === 'pending').length,
    bookingsThisMonth: bookingsThisMonth ?? 0,
    revenueThisMonth,
  }
}
