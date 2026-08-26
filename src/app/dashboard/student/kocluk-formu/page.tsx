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

  // Zorlandığı dersler listesi LGS/YKS'ye göre değişiyor; öğrenciye
  // görmeyeceği dersleri göstermemek için sınıf düzeyi okunuyor.
  const [veri, { data: studentRow }] = await Promise.all([
    getIntake(),
    supabase.from('students').select('grade_track').eq('user_id', user.id).maybeSingle(),
  ])
  const gradeTrack = studentRow?.grade_track === 'lgs' ? 'lgs' : 'yks'

  return (
    <DashboardPageShell
      title="Koçluk Formu"
      description="Koçunun seni tanıması için. Bir kere doldur, istediğinde güncelle."
    >
      <div className="flex items-start gap-2 rounded-xl border-4 border-[var(--cizgi)] bg-[var(--yuzey)] px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--yazi)]/70" />
        <p className="text-sm font-semibold text-[var(--yazi)]/80">
          Bu formu koçun ve ders aldığın eğitmenler görebilir.
        </p>
      </div>

      <IntakeForm mevcut={veri.form} gecmisOlcumler={veri.olcumler} gradeTrack={gradeTrack} />
    </DashboardPageShell>
  )
}
