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
        <CheckCircle2 className="h-5 w-5 shrink-0 text-[#3F6E66]" />
        <p className="text-sm font-bold text-slate-200">
          Dikkat çeken bir durum yok.
        </p>
      </div>
    )
  }

  return (
    <div className={`${PIXEL_CARD} space-y-3 p-5`}>
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-[#C2410C]" />
        <p className="font-bold text-slate-200">
          Dikkat Edilecekler
          <span className="ml-2 text-sm font-semibold text-slate-400">{sinyaller.length} sinyal</span>
        </p>
      </div>

      <div className="space-y-2">
        {sinyaller.map((s) => (
          <div key={s.kod} className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/5 p-3">
            <span className="mt-1 inline-block h-3 w-3 shrink-0 rounded-full border border-white/5"
              style={{ backgroundColor: AGIRLIK_RENK[s.agirlik] }} />
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-200">{s.baslik}</p>
              <p className="text-xs font-semibold text-slate-400">{s.neden}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs font-semibold text-slate-400">
        Sinyaller sabit kurallardan üretiliyor, bir tahmin ya da puanlama değil.
        Eşikler bilerek geniş tutuldu; yanlış alarm üreten bir liste bir süre
        sonra hiç okunmuyor.
      </p>
    </div>
  )
}
