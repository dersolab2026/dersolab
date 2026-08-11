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

  const [{ data: instructorRow }, stats] = await Promise.all([
    supabase.from('instructors').select('payout_name, payout_iban, payout_updated_at, subjects').eq('user_id', user.id).single(),
    getInstructorStats(user.id, fromDate, toDate),
  ])

  const isGuidance = instructorRow?.subjects?.includes(GUIDANCE_SUBJECT) ?? false

  return (
    <DashboardPageShell title="Ödemelerim" description="Ders ücretlerinin yatırılacağı hesap bilgilerini ve ders/soru istatistiklerini yönet.">
      <div className={`${PIXEL_CARD} p-5 space-y-4`}>
        <div>
          <p className="font-bold text-[#1B2430]">İstatistikler</p>
          <p className="text-sm font-semibold text-[#1B2430]/70">
            Seçtiğin tarih aralığındaki {isGuidance ? 'seans' : 'ders'} ve cevapladığın soru sayısı.
          </p>
        </div>

        <form method="GET" className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="from" className="text-xs font-bold text-[#1B2430]">Başlangıç</label>
            <input
              id="from"
              type="date"
              name="from"
              defaultValue={formatDateInput(fromDate)}
              className="p-2 rounded-lg border-2 border-[#1B2430] bg-white outline-none focus:ring-2 focus:ring-[#6FA89E]/50"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="to" className="text-xs font-bold text-[#1B2430]">Bitiş</label>
            <input
              id="to"
              type="date"
              name="to"
              defaultValue={formatDateInput(toDate)}
              className="p-2 rounded-lg border-2 border-[#1B2430] bg-white outline-none focus:ring-2 focus:ring-[#6FA89E]/50"
            />
          </div>
          <button type="submit" className={`${PIXEL_BUTTON_SECONDARY} px-4 py-2 text-sm`}>Filtrele</button>
        </form>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t-2 border-[#1B2430]/10">
          <div>
            <p className="text-xs font-semibold text-[#1B2430]/60">{isGuidance ? 'Seans Sayısı' : 'Ders Sayısı'}</p>
            <p className="text-2xl font-bold text-[#1B2430]">{stats.lessonCount}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-[#1B2430]/60">Çözülen Soru Sayısı</p>
            <p className="text-2xl font-bold text-[#1B2430]">{stats.answeredQuestionCount}</p>
          </div>
        </div>
      </div>

      <PayoutInfoForm
        initialPayoutName={instructorRow?.payout_name ?? null}
        initialPayoutIban={instructorRow?.payout_iban ?? null}
        payoutUpdatedAt={instructorRow?.payout_updated_at ?? null}
      />
    </DashboardPageShell>
  )
}
