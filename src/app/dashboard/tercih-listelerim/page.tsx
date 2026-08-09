import { getMyTercihListeleri } from '@/actions/yok-atlas'
import { TercihListesiDownloadButton } from '@/components/tercih-robotu/TercihListesiDownloadButton'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { PIXEL_CARD } from '@/lib/theme'

export default async function TercihListelerimPage() {
  const listeler = await getMyTercihListeleri()

  return (
    <DashboardPageShell title="Tercih Listelerim" description="Sana gönderilen ya da senin gönderdiğin tercih listeleri.">
      {listeler.length === 0 ? (
        <p className={`${PIXEL_CARD} p-5 text-sm font-semibold text-[#1B2430]`}>Henüz bir tercih listesi yok.</p>
      ) : (
        <div className="space-y-3">
          {listeler.map((l) => (
            <div key={l.id} className={`${PIXEL_CARD} p-4 flex flex-wrap items-center justify-between gap-3`}>
              <div>
                <p className="font-bold text-[#1B2430]">{l.programCount} bölüm</p>
                <p className="text-sm font-semibold text-[#1B2430]/70">
                  {l.senderName} → {l.recipientName}
                </p>
                <p className="text-xs font-semibold text-[#1B2430]/60">
                  {new Date(l.createdAt).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
              <TercihListesiDownloadButton id={l.id} />
            </div>
          ))}
        </div>
      )}
    </DashboardPageShell>
  )
}
