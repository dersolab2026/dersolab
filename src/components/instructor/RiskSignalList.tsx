import { AlertTriangle, CheckCircle2 } from 'lucide-react'
import { AGIRLIK_RENK, type RiskSinyali } from '@/lib/coaching/risk-signals'
import { PIXEL_CARD } from '@/lib/theme'

/**
 * Kocun ogrenci detayinda gordugu sinyal listesi.
 *
 * Her satirda NEDEN yaziyor. Gerekcesiz bir uyari ("bu ogrenciye bak")
 * kocun ne yapacagini soylemiyor ve bir sure sonra goz ardi ediliyor.
 */
export function RiskSignalList({ sinyaller }: { sinyaller: RiskSinyali[] }) {
  if (sinyaller.length === 0) {
    return (
      <div className={`${PIXEL_CARD} flex items-center gap-2 p-4`}>
        <CheckCircle2 className="h-5 w-5 shrink-0 text-[#6FA89E]" />
        <p className="text-sm font-bold text-[#1B2430]">
          Dikkat çeken bir durum yok.
        </p>
      </div>
    )
  }

  return (
    <div className={`${PIXEL_CARD} space-y-3 p-5`}>
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-[#C2410C]" />
        <p className="font-bold text-[#1B2430]">
          Dikkat Edilecekler
          <span className="ml-2 text-sm font-semibold text-[#1B2430]/60">{sinyaller.length} sinyal</span>
        </p>
      </div>

      <div className="space-y-2">
        {sinyaller.map((s) => (
          <div key={s.kod} className="flex items-start gap-2.5 rounded-xl border-2 border-[#1B2430] bg-white p-3">
            <span className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full border-2 border-[#1B2430]"
              style={{ backgroundColor: AGIRLIK_RENK[s.agirlik] }} />
            <div className="min-w-0">
              <p className="text-sm font-bold text-[#1B2430]">{s.baslik}</p>
              <p className="text-xs font-semibold text-[#1B2430]/70">{s.neden}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs font-semibold text-[#1B2430]/60">
        Sinyaller sabit kurallardan üretiliyor, bir tahmin ya da puanlama değil.
        Eşikler bilerek geniş tutuldu; yanlış alarm üreten bir liste bir süre
        sonra hiç okunmuyor.
      </p>
    </div>
  )
}
