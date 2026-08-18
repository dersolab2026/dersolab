import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPendingDemoRequests } from '@/lib/demo-lessons/get-pending-demo-requests'
import { AcceptDemoRequestDialog } from '@/components/demo-lessons/AcceptDemoRequestDialog'
import { ClaimDemoLeadButton } from '@/components/demo-lessons/ClaimDemoLeadButton'
import { ClaimFreeCoachingButton } from '@/components/demo-lessons/ClaimFreeCoachingButton'
import { DeclineDemoRequestButton } from '@/components/demo-lessons/DeclineDemoRequestButton'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { GUIDANCE_SUBJECT } from '@/lib/constants'
import { PIXEL_CARD } from '@/lib/theme'

export default async function DemoRequestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: instructorRow } = await supabase
    .from('instructors').select('offers_free_trial, subjects').eq('user_id', user.id).single()

  // Tanışma dersi verenler ve koçlar bu sayfayı görür; hangi talepleri
  // görecekleri RLS tarafından ayrıca filtreleniyor.
  const kocMu = (instructorRow?.subjects ?? []).includes(GUIDANCE_SUBJECT)
  if (!instructorRow?.offers_free_trial && !kocMu) redirect('/dashboard/instructor')

  const requests = await getPendingDemoRequests()

  return (
    <DashboardPageShell
      title="Hoş Geldin Talepleri"
      description="Hoş geldin paketi talepleri: tanışma dersi ve 1 haftalık koçluk — ilk üstlenen alır."
    >
      {requests.length === 0 ? (
        <p className="font-semibold text-[#1B2430]">Şu anda bekleyen talep yok.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => {
            const kocluk = r.requestType === 'coaching_week'
            return (
              <div key={r.id} className={`${PIXEL_CARD} p-4 flex flex-wrap items-center justify-between gap-3`}>
                <div>
                  <p className="font-bold text-[#1B2430]">
                    {r.studentName}
                    <span className={`ml-2 inline-block px-2 py-0.5 rounded-lg border-2 border-[#1B2430] text-xs ${kocluk ? 'bg-[#6FA89E] text-[#F4F1E8]' : 'bg-white text-[#1B2430]'}`}>
                      {kocluk ? '1 Hafta Koçluk' : 'Tanışma Dersi'}
                    </span>
                  </p>
                  {r.leadEmail && (
                    <p className="text-sm font-semibold text-[#1B2430]/70">{r.leadEmail}</p>
                  )}
                  <p className="text-sm font-semibold text-[#1B2430]/70">
                    {new Date(r.createdAt).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })} tarihinde talep edildi
                    {kocluk
                      ? ' · üstlenince öğrenciyle iletişime geçip haftayı planla'
                      : !r.studentId && ' · hesapsız, kabul edince e-posta ile iletişime geç'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <DeclineDemoRequestButton requestId={r.id} />
                  {kocluk ? (
                    <ClaimFreeCoachingButton requestId={r.id} />
                  ) : r.studentId ? (
                    <AcceptDemoRequestDialog requestId={r.id} instructorId={user.id} />
                  ) : (
                    <ClaimDemoLeadButton requestId={r.id} />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </DashboardPageShell>
  )
}
