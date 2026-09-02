import type { BoyutSkoru } from '@/lib/coaching/self-assessment'

/**
 * Öz-değerlendirme profilinin radar grafiği.
 *
 * İki ölçüm verilirse üst üste biniyor: koçluğun etkisini netten bağımsız
 * gösterebilen tek çıktı bu. Elle yazılmış SVG — beş köşeli tek bir şekil
 * için harici kütüphane fazla gelirdi.
 */

const TEAL = '#6FA89E'
const TURUNCU = '#DD7B3A'
const CIZGI = '#1B2430'

interface Props {
  guncel: BoyutSkoru[]
  /** Varsa ilk ölçüm; soluk çizilip karşılaştırma yapılıyor. */
  ilk?: BoyutSkoru[] | null
  ilkTarih?: string | null
  guncelTarih?: string | null
}

export function SelfAssessmentRadar({ guncel, ilk, ilkTarih, guncelTarih }: Props) {
  const B = 300
  const merkez = B / 2
  const yaricap = 96
  const n = guncel.length
  if (n === 0) return null

  // Tepe noktasi yukari baksin diye -90 derece kaydiriliyor.
  const aci = (i: number) => (i / n) * Math.PI * 2 - Math.PI / 2
  const nokta = (i: number, oran: number) => {
    const r = yaricap * Math.max(0.02, oran)
    return [merkez + r * Math.cos(aci(i)), merkez + r * Math.sin(aci(i))]
  }

  const cokgen = (skorlar: BoyutSkoru[]) =>
    skorlar.map((s, i) => nokta(i, s.oran).map((v) => v.toFixed(1)).join(',')).join(' ')

  const halkalar = [0.25, 0.5, 0.75, 1]

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${B} ${B}`} className="mx-auto h-auto w-full max-w-[320px]"
          role="img"
          aria-label={`Çalışma alışkanlıkları profili: ${guncel.map((s) => `${s.ad} ${s.puan}`).join(', ')}`}
        >
          {halkalar.map((h) => (
            <polygon
              key={h}
              points={guncel.map((_, i) => nokta(i, h).map((v) => v.toFixed(1)).join(',')).join(' ')}
              fill="none" stroke={CIZGI} strokeOpacity="0.15" strokeWidth="2"
            />
          ))}

          {guncel.map((_, i) => {
            const [x, y] = nokta(i, 1)
            return <line key={i} x1={merkez} y1={merkez} x2={x} y2={y}
              stroke={CIZGI} strokeOpacity="0.15" strokeWidth="2" />
          })}

          {ilk && ilk.length === n && (
            <polygon points={cokgen(ilk)} fill={TURUNCU} fillOpacity="0.15"
              stroke={TURUNCU} strokeWidth="3" strokeDasharray="6 4" />
          )}

          <polygon points={cokgen(guncel)} fill={TEAL} fillOpacity="0.3"
            stroke={TEAL} strokeWidth="4" strokeLinejoin="round" />

          {guncel.map((s, i) => {
            const [x, y] = nokta(i, 1.28)
            return (
              <text key={s.boyut} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                fontSize="10" fontWeight="700" fill={CIZGI}>
                {s.ad.length > 16 ? s.ad.slice(0, 15) + '…' : s.ad}
              </text>
            )
          })}
        </svg>
      </div>

      {ilk && (
        <div className="flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm border-2" style={{ borderColor: TURUNCU, backgroundColor: `${TURUNCU}30` }} />
            İlk ölçüm{ilkTarih ? ` · ${new Date(ilkTarih).toLocaleDateString('tr-TR')}` : ''}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm border-2" style={{ borderColor: TEAL, backgroundColor: `${TEAL}50` }} />
            Son ölçüm{guncelTarih ? ` · ${new Date(guncelTarih).toLocaleDateString('tr-TR')}` : ''}
          </span>
        </div>
      )}

      <div className="space-y-1">
        {guncel.map((s) => (
          <div key={s.boyut} className="flex items-center gap-2 text-sm">
            <span className="w-44 shrink-0 truncate font-bold text-slate-200">{s.ad}</span>
            <div className="h-4 flex-1 overflow-hidden rounded border border-white/5 bg-white">
              <div className="h-full bg-[#6FA89E]" style={{ width: `${Math.round(s.oran * 100)}%` }} />
            </div>
            <span className="w-12 shrink-0 text-right font-bold tabular-nums text-slate-200">
              {s.cevaplanan > 0 ? s.puan.toFixed(1) : '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
