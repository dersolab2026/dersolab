import { redirect } from 'next/navigation'
import { Info } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getBookingsForViewer } from '@/lib/bookings/get-student-bookings'
import { getMyStudyLogs } from '@/actions/study-log'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { DailyAgenda } from '@/components/student/DailyAgenda'

export default async function StudentGunlukPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [bookings, studyLogs] = await Promise.all([
    getBookingsForViewer(user.id),
    getMyStudyLogs(),
  ])

  return (
    <DashboardPageShell title="Günlük" description="Bir gün seç, o güne ait derslerini ve çalışma notlarını gör.">
      {/* Ogrenci, gunlugunu kimin gordugunu bilsin: kocluk iliskisinin dogal
          parcasi ama sessizce olmasi dogru degil. */}
      <div className="flex items-start gap-2 rounded-xl border-4 border-[#1B2430] bg-[#F4F1E8] px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#1B2430]/70" />
        <p className="text-sm font-semibold text-[#1B2430]/80">
          Ders aldığın eğitmenler ve koçun bu sayfayı görebilir — çalışmanı takip edip
          sana daha iyi yol gösterebilmeleri için.
        </p>
      </div>

      <DailyAgenda bookings={bookings} studyLogs={studyLogs} />
    </DashboardPageShell>
  )
}
