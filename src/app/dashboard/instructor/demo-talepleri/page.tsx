import { redirect } from 'next/navigation'
import { kisaTarihSaat } from '@/lib/format/datetime'
import { createClient } from '@/lib/supabase/server'
import { getPendingDemoRequests } from '@/lib/demo-lessons/get-pending-demo-requests'
import { AcceptDemoRequestDialog } from '@/components/demo-lessons/AcceptDemoRequestDialog'
import { ClaimDemoLeadButton } from '@/components/demo-lessons/ClaimDemoLeadButton'
import { DeclineDemoRequestButton } from '@/components/demo-lessons/DeclineDemoRequestButton'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { PIXEL_CARD } from '@/lib/theme'

export default async function DemoRequestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: instructorRow } = await supabase
    .from('instructors').select('offers_free_trial').eq('user_id', user.id).single()

  // Yalnizca tanisma dersi veren egitmenler bu sayfayi gorur.
  if (!instructorRow?.offers_free_trial) redirect('/dashboard/instructor')

  const requests = await getPendingDemoRequests()

  return (
    <DashboardPageShell
      title="Hoş Geldin Talepleri"
      description="Hoş Geldin Paketi talepleri: kredisiz tanışma dersi — ilk üstlenen alır."
    >
      {requests.length === 0 ? (
        <p className="font-semibold text-slate-200">Şu anda bekleyen talep yok.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <div key={r.id} className={`${PIXEL_CARD} p-4 flex flex-wrap items-center justify-between gap-3`}>
              <div>
                <p className="font-bold text-slate-200">
                  {r.studentName}
                  <span className="ml-2 inline-block px-2 py-0.5 rounded-lg border border-white/5 bg-white text-xs text-slate-200">
                    Tanışma Dersi
                  </span>
                </p>
                {r.leadEmail && (
                  <p className="text-sm font-semibold text-slate-400">{r.leadEmail}</p>
                )}
                <p className="text-sm font-semibold text-slate-400">
                  {kisaTarihSaat(r.createdAt)} tarihinde talep edildi
                  {!r.studentId && ' · hesapsız, kabul edince e-posta ile iletişime geç'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <DeclineDemoRequestButton requestId={r.id} />
                {r.studentId ? (
                  <AcceptDemoRequestDialog requestId={r.id} instructorId={user.id} />
                ) : (
                  <ClaimDemoLeadButton requestId={r.id} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardPageShell>
  )
}
