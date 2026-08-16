import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Eğitmen sayfaları yalnızca eğitmenlere (ve aynı zamanda ders veren
// yöneticilere) açık; öğrenciler kendi paneline yönlendirilir.
export default async function InstructorLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (userRow?.role !== 'instructor' && userRow?.role !== 'admin') redirect('/dashboard')

  return <>{children}</>
}
