import { redirect } from 'next/navigation'
import { AuthShell } from '@/components/auth/AuthShell'
import { AccountTypeForm } from '@/components/auth/AccountTypeForm'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Hesap Türü - DersoLab',
}

export default async function AccountTypePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Turu belli olan kullanici buraya hic gelmemeli; dogrudan URL ile
  // gelirse geri yolluyoruz.
  const { data: satir } = await supabase
    .from('users')
    .select('role_confirmed')
    .eq('id', user.id)
    .maybeSingle()

  if (satir?.role_confirmed !== false) redirect('/dashboard')

  return (
    <AuthShell baslik="Hesap Türünü Seç" subtitle="Bir adım kaldı">
      <AccountTypeForm />
    </AuthShell>
  )
}
