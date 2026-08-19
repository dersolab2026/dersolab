import { Flame, CalendarClock } from 'lucide-react'
import { calismaSerisi, enUzunSeri, kalanGun, seriMetni } from '@/lib/coaching/streak'
import { PIXEL_CARD } from '@/lib/theme'

/**
 * Panelin ustundeki seri ve geri sayim seridi.
 *
 * Ikisi de mevcut veriden turetiliyor: seri gunluk kayitlarindan, geri
 * sayim ogrencinin kendi girdigi hedef sinav tarihinden. Yeni veri yok.
 */

interface Props {
  logDates: string[]
  targetExamDate: string | null
  /** Sunucuda hesaplanan bugun; istemci saatine guvenmiyoruz. */
  bugun: string
}

export function StreakBanner({ logDates, targetExamDate, bugun }: Props) {
  const seri = calismaSerisi(logDates, bugun)
  const rekor = enUzunSeri(logDates)
  const kalan = kalanGun(targetExamDate, bugun)

  if (seri === 0 && kalan === null) return null

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {(seri > 0 || logDates.length > 0) && (
        <div className={`${PIXEL_CARD} flex items-center gap-3 p-4`}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-4 border-[#1B2430] bg-[#DD7B3A]">
            <Flame className="h-5 w-5 text-[#F4F1E8]" />
          </span>
          <div className="min-w-0">
            <p className="text-2xl font-black leading-none text-[#1B2430]">
              {seri}
              <span className="ml-1 text-sm font-bold text-[#1B2430]/60">gün</span>
            </p>
            <p className="truncate text-xs font-semibold text-[#1B2430]/70">
              {seriMetni(seri)}
              {rekor > seri && ` En uzun serin ${rekor} gün.`}
            </p>
          </div>
        </div>
      )}

      {kalan !== null && (
        <div className={`${PIXEL_CARD} flex items-center gap-3 p-4`}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-4 border-[#1B2430] bg-[#6FA89E]">
            <CalendarClock className="h-5 w-5 text-[#F4F1E8]" />
          </span>
          <div className="min-w-0">
            <p className="text-2xl font-black leading-none text-[#1B2430]">
              {kalan}
              <span className="ml-1 text-sm font-bold text-[#1B2430]/60">gün</span>
            </p>
            <p className="truncate text-xs font-semibold text-[#1B2430]/70">
              {kalan === 0 ? 'Sınav bugün. Bol şans!' : 'Hedeflediğin sınava kaldı.'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
