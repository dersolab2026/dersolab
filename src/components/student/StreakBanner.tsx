import { Flame } from 'lucide-react'
import { calismaSerisi, enUzunSeri, seriMetni } from '@/lib/coaching/streak'
import { PIXEL_CARD } from '@/lib/theme'

/**
 * Panelin ustundeki calisma serisi.
 *
 * Seri tamamen mevcut gunluk kayitlarindan turetiliyor; yeni veri yok.
 */

interface Props {
  logDates: string[]
  /** Sunucuda hesaplanan bugun; istemci saatine guvenmiyoruz. */
  bugun: string
}

export function StreakBanner({ logDates, bugun }: Props) {
  const seri = calismaSerisi(logDates, bugun)
  const rekor = enUzunSeri(logDates)

  if (logDates.length === 0) return null

  return (
        <div className={`${PIXEL_CARD} flex items-center gap-3 p-4`}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-4 border-[var(--cizgi)] bg-[var(--vurgu)]">
            <Flame className="h-5 w-5 text-[var(--yazi-ters)]" />
          </span>
          <div className="min-w-0">
            <p className="text-2xl font-black leading-none text-[var(--yazi)]">
              {seri}
              <span className="ml-1 text-sm font-bold text-[var(--yazi)]/60">gün</span>
            </p>
            <p className="truncate text-xs font-semibold text-[var(--yazi)]/70">
              {seriMetni(seri)}
              {rekor > seri && ` En uzun serin ${rekor} gün.`}
            </p>
          </div>
        </div>
  )
}
