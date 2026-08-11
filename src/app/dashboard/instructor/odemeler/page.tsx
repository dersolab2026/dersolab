import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PayoutInfoForm } from '@/components/instructor/PayoutInfoForm'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'

export default async function InstructorPayoutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: instructorRow } = await supabase
    .from('instructors')
    .select('payout_name, payout_iban, payout_updated_at')
    .eq('user_id', user.id)
    .single()

  return (
    <DashboardPageShell title="Ödemelerim" description="Ders ücretlerinin yatırılacağı hesap bilgilerini yönet.">
      <PayoutInfoForm
        initialPayoutName={instructorRow?.payout_name ?? null}
        initialPayoutIban={instructorRow?.payout_iban ?? null}
        payoutUpdatedAt={instructorRow?.payout_updated_at ?? null}
      />
    </DashboardPageShell>
  )
}
