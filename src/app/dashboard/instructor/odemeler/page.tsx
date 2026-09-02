import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getInstructorStats } from '@/lib/instructor/get-instructor-stats'
import { GUIDANCE_SUBJECT } from '@/lib/constants'
import { PayoutInfoForm } from '@/components/instructor/PayoutInfoForm'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { PIXEL_CARD, PIXEL_BUTTON_SECONDARY } from '@/lib/theme'

interface InstructorPayoutPageProps {
  searchParams: Promise<{ from?: string; to?: string }>
}

function formatDateInput(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default async function InstructorPayoutPage({ searchParams }: InstructorPayoutPageProps) {
  const { from, to } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const now = new Date()
  const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1)
  const fromDate = from ? new Date(`${from}T00:00:00`) : defaultFrom
  const toDate = to ? new Date(`${to}T23:59:59`) : new Date(`${formatDateInput(now)}T23:59:59`)

  // Ödeme bilgisi ayrı tabloda: instructors'ın okuma politikası herkese açık
  // ve satır görünür olunca IBAN da geliyordu (0095).
  const [{ data: instructorRow }, { data: payoutRow }, stats] = await Promise.all([
    supabase.from('instructors').select('subjects').eq('user_id', user.id).single(),
    supabase.from('instructor_payout_details')
      .select('payout_name, payout_iban, payout_updated_at')
      .eq('user_id', user.id).maybeSingle(),
    getInstructorStats(user.id, fromDate, toDate),
  ])

  const isGuidance = instructorRow?.subjects?.includes(GUIDANCE_SUBJECT) ?? false

  return (
    <DashboardPageShell title="Ödemelerim" description="Ders ücretlerinin yatırılacağı hesap bilgilerini ve ders istatistiklerini yönet.">
      <div className={`${PIXEL_CARD} p-5 space-y-4`}>
        <div>
          <p className="font-bold text-slate-200">İstatistikler</p>
          <p className="text-sm font-semibold text-slate-400">
            Seçtiğin tarih aralığındaki {isGuidance ? 'seans' : 'ders'} sayısı.
          </p>
        </div>

        <form method="GET" className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="from" className="text-xs font-bold text-slate-200">Başlangıç</label>
            <input
              id="from"
              type="date"
              name="from"
              defaultValue={formatDateInput(fromDate)}
              className="p-2 rounded-lg border border-white/5 bg-white/5 outline-none focus:ring-2 focus:ring-[#6FA89E]/50"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="to" className="text-xs font-bold text-slate-200">Bitiş</label>
            <input
              id="to"
              type="date"
              name="to"
              defaultValue={formatDateInput(toDate)}
              className="p-2 rounded-lg border border-white/5 bg-white/5 outline-none focus:ring-2 focus:ring-[#6FA89E]/50"
            />
          </div>
          <button type="submit" className={`${PIXEL_BUTTON_SECONDARY} px-4 py-2 text-sm`}>Filtrele</button>
        </form>

        <div className="pt-2 border-t border-white/10">
          <p className="text-xs font-semibold text-slate-400">{isGuidance ? 'Seans Sayısı' : 'Ders Sayısı'}</p>
          <p className="text-2xl font-bold text-slate-200">{stats.lessonCount}</p>
        </div>
      </div>

      <PayoutInfoForm
        initialPayoutName={payoutRow?.payout_name ?? null}
        initialPayoutIban={payoutRow?.payout_iban ?? null}
        payoutUpdatedAt={payoutRow?.payout_updated_at ?? null}
      />
    </DashboardPageShell>
  )
}
