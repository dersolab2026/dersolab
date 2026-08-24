import { redirect } from 'next/navigation'
import { TermsAcceptanceForm } from '@/components/auth/TermsAcceptanceForm'
import { AuthShell } from '@/components/auth/AuthShell'
import { TERMS_VERSION } from '@/lib/legal'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Kullanım Şartları Onayı - DersoLab',
}

export default async function AcceptTermsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: acceptance } = await supabase
    .from('terms_acceptances')
    .select('id')
    .eq('user_id', user.id)
    .eq('terms_version', TERMS_VERSION)
    .maybeSingle()
  if (acceptance) redirect('/dashboard')

  return (
    <AuthShell subtitle="Bir adım kaldı — devam etmeden önce şartları onayla">
      <TermsAcceptanceForm />
    </AuthShell>
  )
}
