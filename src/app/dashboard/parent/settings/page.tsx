import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { ChangePasswordForm } from '@/components/account/ChangePasswordForm'
import { DeleteAccountButton } from '@/components/instructor/DeleteAccountButton'
import { PIXEL_CARD } from '@/lib/theme'

export default async function ParentSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <DashboardPageShell title="Ayarlar" description="Hesabınızı buradan yönetin.">
      <ChangePasswordForm />

      <div className={`${PIXEL_CARD} p-5 space-y-4`}>
        <div>
          <p className="font-bold text-[var(--yazi)]">Hesap Ayarları</p>
          <p className="text-sm font-semibold text-[var(--yazi)]/70">
            Hesabınızı tamamen silebilirsiniz. Hesabınız silinince öğrencilerinizle
            bağlantınız da kalkar; öğrencilerin hesapları etkilenmez.
          </p>
        </div>
        <DeleteAccountButton />
      </div>
    </DashboardPageShell>
  )
}
