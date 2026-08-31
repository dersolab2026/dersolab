import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getGuardianStudentOverview } from '@/lib/guardian/get-student-overview'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { kisaTarihSaat } from '@/lib/format/datetime'
import { EXAM_TYPE_LABELS } from '@/lib/exams/scoring'
import { PIXEL_CARD } from '@/lib/theme'

const BOOKING_LABELS: Record<string, string> = {
  scheduled: 'Planlandı',
  completed: 'Tamamlandı',
  cancelled: 'İptal edildi',
  no_show: 'Katılım olmadı',
}

const HOMEWORK_LABELS: Record<string, string> = {
  assigned: 'Bekliyor',
  submitted: 'Teslim edildi',
  completed: 'Onaylandı',
}

function Rozet({ metin, vurgu }: { metin: string; vurgu?: boolean }) {
  return (
    <span
      className={`inline-block rounded-lg border-2 border-[#1B2430] px-2 py-0.5 text-xs font-bold ${
        vurgu ? 'bg-[#6FA89E] text-[#F4F1E8]' : 'bg-white text-[#1B2430]'
      }`}
    >
      {metin}
    </span>
  )
}

function Bolum({ baslik, bos, children }: { baslik: string; bos: string; children: React.ReactNode }) {
  return (
    <div className={`${PIXEL_CARD} space-y-3 p-5`}>
      <p className="font-bold text-[#1B2430]">{baslik}</p>
      {children ?? <p className="text-sm font-semibold text-[#1B2430]/70">{bos}</p>}
    </div>
  )
}

export default async function ParentStudentDetailPage({
  params,
}: {
  params: Promise<{ studentId: string }>
}) {
  const { studentId } = await params
  const veri = await getGuardianStudentOverview(studentId)
  if (!veri) notFound()

  const yaklasan = veri.bookings.filter((b) => b.status === 'scheduled')
  const gecmis = veri.bookings.filter((b) => b.status !== 'scheduled').slice(0, 10)
  const bekleyenOdev = veri.homework.filter((h) => h.status !== 'completed')

  return (
    <DashboardPageShell
      title={veri.studentName}
      description={`${veri.studentEmail} · ${veri.creditBalance} ders kredisi`}
    >
      <Link href="/dashboard/parent" className="text-sm font-bold text-[#1B2430]/70 hover:underline">
        &larr; Öğrencilerim
      </Link>

      <Bolum baslik="Yaklaşan Dersler" bos="Planlanmış ders yok.">
        {yaklasan.length > 0 ? (
          <ul className="space-y-2">
            {yaklasan.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1B2430]/10 pb-2 last:border-0">
                <span className="text-sm font-semibold text-[#1B2430]">
                  {b.instructorName} · {kisaTarihSaat(b.startTime)}
                </span>
                {b.isTrial && <Rozet metin="Tanışma Dersi" vurgu />}
              </li>
            ))}
          </ul>
        ) : null}
      </Bolum>

      <Bolum baslik="Bekleyen Ödevler" bos="Bekleyen ödev yok.">
        {bekleyenOdev.length > 0 ? (
          <ul className="space-y-2">
            {bekleyenOdev.map((h) => (
              <li key={h.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1B2430]/10 pb-2 last:border-0">
                <span className="text-sm font-semibold text-[#1B2430]">
                  {h.title}
                  {h.dueDate && (
                    <span className="text-[#1B2430]/70">
                      {' '}· son tarih {new Date(h.dueDate).toLocaleDateString('tr-TR', { dateStyle: 'medium' })}
                    </span>
                  )}
                </span>
                <Rozet metin={HOMEWORK_LABELS[h.status] ?? h.status} />
              </li>
            ))}
          </ul>
        ) : null}
      </Bolum>

      <Bolum baslik="Son Denemeler" bos="Henüz kayıtlı deneme yok.">
        {veri.examResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm">
              <thead>
                <tr className="border-b-2 border-[#1B2430] text-left">
                  <th className="py-1.5 pr-2 font-bold text-[#1B2430]">Deneme</th>
                  <th className="py-1.5 px-2 font-bold text-[#1B2430]">Tür</th>
                  <th className="py-1.5 px-2 font-bold text-[#1B2430]">Tarih</th>
                  <th className="py-1.5 pl-2 text-right font-bold text-[#1B2430]">Net</th>
                </tr>
              </thead>
              <tbody>
                {veri.examResults.slice(0, 10).map((e) => (
                  <tr key={e.id} className="border-b border-[#1B2430]/15">
                    <td className="py-1.5 pr-2 font-semibold text-[#1B2430]">{e.examName}</td>
                    <td className="py-1.5 px-2 font-semibold text-[#1B2430]/70">{EXAM_TYPE_LABELS[e.examType]}</td>
                    <td className="py-1.5 px-2 font-semibold text-[#1B2430]/70">
                      {new Date(e.examDate).toLocaleDateString('tr-TR', { dateStyle: 'medium' })}
                    </td>
                    <td className="py-1.5 pl-2 text-right font-bold tabular-nums text-[#1B2430]">
                      {e.net.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </Bolum>

      <Bolum baslik="Geçmiş Dersler" bos="Geçmiş ders yok.">
        {gecmis.length > 0 ? (
          <ul className="space-y-2">
            {gecmis.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1B2430]/10 pb-2 last:border-0">
                <span className="text-sm font-semibold text-[#1B2430]">
                  {b.instructorName} · {kisaTarihSaat(b.startTime)}
                </span>
                <Rozet metin={BOOKING_LABELS[b.status] ?? b.status} />
              </li>
            ))}
          </ul>
        ) : null}
      </Bolum>

      <Bolum baslik="Ödeme Geçmişi" bos="Henüz ödeme kaydı yok.">
        {veri.purchases.length > 0 ? (
          <ul className="space-y-2">
            {veri.purchases.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1B2430]/10 pb-2 last:border-0">
                <span className="text-sm font-semibold text-[#1B2430]">
                  {kisaTarihSaat(p.createdAt)} · {p.creditsGranted} kredi
                  {p.amountPaid !== null && (
                    <span className="text-[#1B2430]/70"> · {p.amountPaid.toLocaleString('tr-TR')} ₺</span>
                  )}
                </span>
                <Rozet metin={p.status === 'completed' ? 'Tamamlandı' : p.status} />
              </li>
            ))}
          </ul>
        ) : null}
      </Bolum>
    </DashboardPageShell>
  )
}
