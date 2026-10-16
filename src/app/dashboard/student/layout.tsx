import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// Öğrenci sayfaları yalnızca öğrencilere açık; eğitmen ve yöneticiler
// kendi paneline yönlendirilir.
export default async function StudentLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (userRow?.role !== 'student') redirect('/dashboard')

  return <>{children}</>
}
