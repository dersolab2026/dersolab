import Link from 'next/link'
import { veliyeBagliOgrenciler } from '@/actions/guardian'
import { getGuardianStudentSummaries } from '@/lib/guardian/get-student-overview'
import { kisaTarihSaat } from '@/lib/format/datetime'
import { LinkStudentForm } from '@/components/guardian/LinkStudentForm'
import { UnlinkStudentButton } from '@/components/guardian/UnlinkStudentButton'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { PIXEL_CARD } from '@/lib/theme'

function Kutu({ etiket, deger, vurgu }: { etiket: string; deger: string; vurgu?: 'iyi' | 'dikkat' }) {
  const renk = vurgu === 'iyi' ? 'text-[#2F8570]' : vurgu === 'dikkat' ? 'text-[#C2682F]' : 'text-slate-200'
  return (
    <div className="rounded-xl border border-white/5/15 bg-white px-3 py-2">
      <p className="text-xs font-semibold text-slate-400">{etiket}</p>
      <p className={`text-lg font-bold tabular-nums ${renk}`}>{deger}</p>
    </div>
  )
}

export default async function ParentHomePage() {
  const [ogrenciler, ozetler] = await Promise.all([
    veliyeBagliOgrenciler(),
    getGuardianStudentSummaries(),
  ])
  const ozetById = new Map(ozetler.map((o) => [o.studentId, o]))

  return (
    <DashboardPageShell
      title="Öğrencilerim"
      description="Ders, ödev ve deneme durumunu tek ekranda takip edin."
    >
      {ogrenciler.length === 0 ? (
        <>
          <LinkStudentForm />
          <div className={`${PIXEL_CARD} p-5`}>
            <p className="font-semibold text-slate-400">
              Henüz bağlı bir öğrenciniz yok. Yukarıdaki alana öğrencinizden aldığınız kodu girin.
            </p>
          </div>
        </>
      ) : (
        <div className="space-y-3">
          {ogrenciler.map((o) => {
            const z = ozetById.get(o.personId)
            return (
              <div key={o.id} className={`${PIXEL_CARD} space-y-4 p-5`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <Link
                      href={`/dashboard/parent/${o.personId}`}
                      className="text-lg font-bold text-slate-200 underline decoration-2 underline-offset-2"
                    >
                      {o.personName}
                    </Link>
                    <p className="text-sm font-semibold text-slate-400">{o.personEmail}</p>
                  </div>
                  <UnlinkStudentButton studentId={o.personId} studentName={o.personName} />
                </div>

                {z?.siradakiDers ? (
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Sıradaki ders</p>
                    <p className="font-bold text-slate-200">
                      {z.siradakiDers.instructorName}
                      <span className="font-semibold text-slate-400">
                        {' · '}{kisaTarihSaat(z.siradakiDers.startTime)}
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="text-sm font-semibold text-slate-400">Planlanmış ders yok.</p>
                )}

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  <Kutu etiket="Kredi" deger={String(z?.creditBalance ?? 0)} />
                  <Kutu etiket="Bu ay ders" deger={String(z?.buAyDers ?? 0)} />
                  <Kutu
                    etiket="Katılım"
                    deger={z?.katilimYuzde === null || z === undefined ? '—' : `%${z.katilimYuzde}`}
                    vurgu={
                      z?.katilimYuzde === null || z === undefined
                        ? undefined
                        : z.katilimYuzde >= 90 ? 'iyi' : z.katilimYuzde < 70 ? 'dikkat' : undefined
                    }
                  />
                  <Kutu
                    etiket="Bekleyen ödev"
                    deger={String(z?.bekleyenOdev ?? 0)}
                    vurgu={(z?.bekleyenOdev ?? 0) > 0 ? 'dikkat' : 'iyi'}
                  />
                </div>

                <Link
                  href={`/dashboard/parent/${o.personId}`}
                  className="inline-block text-sm font-bold text-[#9C4A0C] hover:underline"
                >
                  Ayrıntıya bak →
                </Link>
              </div>
            )
          })}

          <LinkStudentForm />
        </div>
      )}

      <div className={`${PIXEL_CARD} p-5`}>
        <p className="font-bold text-slate-200">Neyi görebilirsiniz?</p>
        <p className="mt-1 text-sm font-semibold text-slate-400">
          Ders takvimi ve katılım, ödev durumu, deneme netleri, kredi bakiyesi ve ödeme geçmişi.
          Ders planlandığında, tamamlandığında ya da katılım olmadığında size de bildirim gelir.
        </p>
        <p className="mt-2 text-sm font-semibold text-slate-400">
          Öğrencinizin günlüğü ve koçluk formu cevapları size kapalıdır — bunlar öğrencinin
          koçuyla arasındaki alandır. Açık olsaydı öğrenci dürüst cevap veremezdi.
        </p>
      </div>
    </DashboardPageShell>
  )
}
