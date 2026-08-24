import Link from 'next/link'
import { veliyeBagliOgrenciler } from '@/actions/guardian'
import { LinkStudentForm } from '@/components/guardian/LinkStudentForm'
import { UnlinkStudentButton } from '@/components/guardian/UnlinkStudentButton'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { PIXEL_CARD } from '@/lib/theme'

export default async function ParentHomePage() {
  const ogrenciler = await veliyeBagliOgrenciler()

  return (
    <DashboardPageShell
      title="Öğrencilerim"
      description="Bağlı olduğunuz öğrencilerin ders, ödev ve deneme durumunu buradan takip edin."
    >
      <LinkStudentForm />

      {ogrenciler.length === 0 ? (
        <div className={`${PIXEL_CARD} p-5`}>
          <p className="font-semibold text-[#1B2430]/70">
            Henüz bağlı bir öğrenciniz yok. Yukarıdaki alana öğrencinizden aldığınız kodu girin.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {ogrenciler.map((o) => (
            <div key={o.id} className={`${PIXEL_CARD} p-5 flex flex-wrap items-center justify-between gap-3`}>
              <div>
                <Link
                  href={`/dashboard/parent/${o.personId}`}
                  className="font-bold text-[#1B2430] underline decoration-2 underline-offset-2"
                >
                  {o.personName}
                </Link>
                <p className="text-sm font-semibold text-[#1B2430]/70">{o.personEmail}</p>
              </div>
              <UnlinkStudentButton studentId={o.personId} studentName={o.personName} />
            </div>
          ))}
        </div>
      )}

      <div className={`${PIXEL_CARD} p-5`}>
        <p className="font-bold text-[#1B2430]">Neyi görebilirsiniz?</p>
        <p className="mt-1 text-sm font-semibold text-[#1B2430]/70">
          Ders takvimi ve katılım, ödev durumu, deneme netleri, kredi bakiyesi ve ödeme geçmişi.
          Öğrencinizin günlüğü ve koçluk formu cevapları size kapalıdır — bunlar öğrencinin
          koçuyla arasındaki alandır, açık olsa öğrenci dürüst cevap veremezdi.
        </p>
      </div>
    </DashboardPageShell>
  )
}
