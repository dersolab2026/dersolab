import { redirect } from 'next/navigation'
import { Info } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getIntake } from '@/lib/coaching/get-intake'
import { IntakeForm } from '@/components/coaching/IntakeForm'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'

export default async function KoclukFormuPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const veri = await getIntake()

  return (
    <DashboardPageShell
      title="Koçluk Formu"
      description="Koçunun seni tanıması için. Bir kere doldur, istediğinde güncelle."
    >
      <div className="flex items-start gap-2 rounded-xl border-4 border-[#1B2430] bg-[#F4F1E8] px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#1B2430]/70" />
        <p className="text-sm font-semibold text-[#1B2430]/80">
          Bu formu koçun ve ders aldığın eğitmenler görebilir.
        </p>
      </div>

      <IntakeForm mevcut={veri.form} gecmisOlcumler={veri.olcumler} />
    </DashboardPageShell>
  )
}
