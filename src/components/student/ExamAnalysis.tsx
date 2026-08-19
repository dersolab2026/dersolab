'use client'

import { useMemo, useState } from 'react'
import { LineChart, ListFilter } from 'lucide-react'
import type { ExamResultEntry } from '@/actions/exam-results'
import {
  EXAM_TYPE_LABELS, calculateNet, calculateTotalNet, type ExamType,
} from '@/lib/exams/scoring'
import {
  getExamSections, getTotalQuestions, requiresTrack, TRACK_LABELS, type ExamTrack,
} from '@/lib/exams/structure'
import { PIXEL_CARD } from '@/lib/theme'

/**
 * Netlerim'in analiz bolumu: secilen denemelerden net gelisim grafigi ve
 * ders bazinda guclu/zayif dokumu.
 *
 * Neden tek bir sinav turu (ve AYT'de alan) uzerinde calisiyor: farkli
 * turlerin netleri ayni eksende kiyaslanamaz. TYT'de 120 soru var, AYT'de 80;
 * ayni grafige koymak yaniltici bir egri uretir. Bu yuzden once tur seciliyor,
 * grafik o turun denemeleri uzerinden ciziliyor.
 *
 * Grafik elle yazilmis SVG: tek ihtiyacimiz iki basit gorsel ve harici bir
 * grafik kutuphanesi hem paket boyutu hem gorsel dil acisindan fazla gelirdi.
 */

interface ExamAnalysisProps {
  entries: ExamResultEntry[]
}

interface Nokta {
  id: string
  ad: string
  tarih: string
  net: number
}

const CIZGI = '#1B2430'
const TEAL = '#6FA89E'
const TURUNCU = '#DD7B3A'

function tarihKisa(iso: string): string {
  const d = new Date(iso)
  return `${d.getDate()}.${d.getMonth() + 1}`
}

export function ExamAnalysis({ entries }: ExamAnalysisProps) {
  // Hangi tur + alan kombinasyonlari var?
  const gruplar = useMemo(() => {
    const m = new Map<string, { examType: ExamType; track: ExamTrack | null; adet: number }>()
    for (const e of entries) {
      const track = requiresTrack(e.examType) ? e.track : null
      const anahtar = `${e.examType}|${track ?? ''}`
      const mevcut = m.get(anahtar)
      if (mevcut) mevcut.adet++
      else m.set(anahtar, { examType: e.examType, track, adet: 1 })
    }
    return [...m.entries()]
      .map(([anahtar, v]) => ({ anahtar, ...v }))
      .sort((a, b) => b.adet - a.adet)
  }, [entries])

  const [seciliGrup, setSeciliGrup] = useState(() => gruplar[0]?.anahtar ?? '')
  const [haricTutulan, setHaricTutulan] = useState<Set<string>>(new Set())

  const grup = gruplar.find((g) => g.anahtar === seciliGrup) ?? gruplar[0]

  const grubunDenemeleri = useMemo(() => {
    if (!grup) return []
    return entries
      .filter((e) => {
        const track = requiresTrack(e.examType) ? e.track : null
        return e.examType === grup.examType && track === grup.track
      })
      .sort((a, b) => a.examDate.localeCompare(b.examDate))
  }, [entries, grup])

  const secililer = grubunDenemeleri.filter((e) => !haricTutulan.has(e.id))

  const dersler = grup ? getExamSections(grup.examType, grup.track) : []
  const toplamSoru = grup ? getTotalQuestions(grup.examType, grup.track) : 0

  const noktalar: Nokta[] = useMemo(
    () =>
      secililer.map((e) => ({
        id: e.id,
        ad: e.examName,
        tarih: e.examDate,
        net: calculateTotalNet(e.examType, e.sections.map((s) => ({
          name: s.name, correct: s.correctCount, wrong: s.wrongCount,
        }))),
      })),
    [secililer],
  )

  // Ders bazinda basari orani: secilen denemelerdeki netin, o derste
  // sorulabilecek toplam net'e orani.
  const dersDurumu = useMemo(() => {
    if (!grup) return []
    return dersler
      .map((d) => {
        let net = 0
        let denemeSayisi = 0
        for (const e of secililer) {
          const b = e.sections.find((s) => s.name === d.name)
          if (!b) continue
          net += calculateNet(e.examType, b.correctCount, b.wrongCount)
          denemeSayisi++
        }
        if (denemeSayisi === 0) return null
        const ortalamaNet = net / denemeSayisi
        return {
          ad: d.name,
          soru: d.questionCount,
          ortalamaNet: Math.round(ortalamaNet * 100) / 100,
          oran: Math.max(0, Math.min(1, ortalamaNet / d.questionCount)),
        }
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => b.oran - a.oran)
  }, [dersler, secililer, grup])

  function toggle(id: string) {
    setHaricTutulan((p) => {
      const y = new Set(p)
      if (y.has(id)) y.delete(id)
      else y.add(id)
      return y
    })
  }

  if (entries.length === 0) return null

  if (gruplar.length === 0 || !grup) return null

  return (
    <div className={`${PIXEL_CARD} p-5 space-y-5`}>
      <div className="flex items-center gap-2">
        <LineChart className="h-5 w-5 text-[#1B2430]" />
        <p className="font-bold text-[#1B2430]">Deneme Analizi</p>
      </div>

      {/* Sinav turu secimi */}
      {gruplar.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {gruplar.map((g) => (
            <button
              key={g.anahtar}
              type="button"
              onClick={() => { setSeciliGrup(g.anahtar); setHaricTutulan(new Set()) }}
              className={`rounded-lg border-4 border-[#1B2430] px-3 py-1.5 text-sm font-bold transition-all ${
                g.anahtar === grup.anahtar
                  ? 'bg-[#DD7B3A] text-[#F4F1E8]'
                  : 'bg-white text-[#1B2430]'
              }`}
            >
              {EXAM_TYPE_LABELS[g.examType]}
              {g.track ? ` · ${TRACK_LABELS[g.track]}` : ''}
              <span className="ml-1.5 opacity-70">({g.adet})</span>
            </button>
          ))}
        </div>
      )}

      {/* Grafige hangi denemeler girsin */}
      <div>
        <div className="mb-2 flex items-center gap-1.5">
          <ListFilter className="h-4 w-4 text-[#1B2430]/60" />
          <p className="text-sm font-bold text-[#1B2430]/70">
            Grafiğe girecek denemeler ({secililer.length}/{grubunDenemeleri.length})
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {grubunDenemeleri.map((e) => {
            const secili = !haricTutulan.has(e.id)
            return (
              <button
                key={e.id}
                type="button"
                onClick={() => toggle(e.id)}
                aria-pressed={secili}
                className={`rounded-lg border-2 border-[#1B2430] px-2.5 py-1 text-xs font-bold transition-all ${
                  secili ? 'bg-[#6FA89E] text-[#F4F1E8]' : 'bg-white text-[#1B2430]/50 line-through'
                }`}
              >
                {e.examName}
              </button>
            )
          })}
        </div>
      </div>

      {secililer.length < 2 ? (
        <p className="text-sm font-semibold text-[#1B2430]/60">
          Gelişim grafiği için en az iki deneme seçmelisin.
        </p>
      ) : (
        <NetGrafigi noktalar={noktalar} enYuksek={toplamSoru} />
      )}

      {dersDurumu.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-bold text-[#1B2430]/70">
            Ders ders durumun — {secililer.length} denemenin ortalaması
          </p>
          {dersDurumu.map((d, i) => {
            const guclu = i < Math.ceil(dersDurumu.length / 3)
            const zayif = i >= dersDurumu.length - Math.ceil(dersDurumu.length / 3)
            return (
              <div key={d.ad} className="flex items-center gap-3">
                <span className="w-40 shrink-0 truncate text-sm font-bold text-[#1B2430]" title={d.ad}>
                  {d.ad}
                </span>
                <div className="h-6 flex-1 overflow-hidden rounded-md border-2 border-[#1B2430] bg-white">
                  <div
                    className="h-full transition-all"
                    style={{
                      width: `${Math.round(d.oran * 100)}%`,
                      backgroundColor: guclu ? TEAL : zayif ? TURUNCU : '#B9CFC8',
                    }}
                  />
                </div>
                <span className="w-24 shrink-0 text-right text-sm font-bold tabular-nums text-[#1B2430]">
                  {d.ortalamaNet.toFixed(1)}/{d.soru}
                </span>
              </div>
            )
          })}
          <p className="pt-1 text-xs font-semibold text-[#1B2430]/60">
            Yeşil barlar en güçlü, turuncular en zayıf derslerin. Sayı, o dersteki
            ortalama netinin toplam soru sayısına oranı.
          </p>
        </div>
      )}
    </div>
  )
}

/** Net gelisimini gosteren basit cizgi grafigi. */
function NetGrafigi({ noktalar, enYuksek }: { noktalar: Nokta[]; enYuksek: number }) {
  const G = 640
  const Y = 240
  const solBosluk = 44
  const altBosluk = 30
  const ustBosluk = 12
  const sagBosluk = 12

  const cizimG = G - solBosluk - sagBosluk
  const cizimY = Y - ustBosluk - altBosluk

  // Ekseni verinin kendisine gore olcekle; tavan hep toplam soru sayisi olursa
  // dusuk netlerde egri duz bir cizgi gibi gorunuyor ve degisim okunmuyor.
  const netler = noktalar.map((n) => n.net)
  const enBuyukNet = Math.max(...netler)
  const tavan = Math.max(5, Math.min(enYuksek, Math.ceil((enBuyukNet * 1.15) / 5) * 5))

  const x = (i: number) =>
    solBosluk + (noktalar.length === 1 ? cizimG / 2 : (i / (noktalar.length - 1)) * cizimG)
  const y = (net: number) => ustBosluk + cizimY - (net / tavan) * cizimY

  const cizgi = noktalar.map((n, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(n.net)}`).join(' ')
  const izgaralar = [0, 0.25, 0.5, 0.75, 1]

  const ilk = noktalar[0].net
  const son = noktalar[noktalar.length - 1].net
  const fark = Math.round((son - ilk) * 100) / 100

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <p className="text-sm font-bold text-[#1B2430]/70">Net gelişimi</p>
        <p className="text-sm font-bold tabular-nums" style={{ color: fark >= 0 ? TEAL : TURUNCU }}>
          {fark >= 0 ? '▲' : '▼'} {Math.abs(fark).toFixed(2)} net
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border-4 border-[#1B2430] bg-white">
        <svg
          viewBox={`0 0 ${G} ${Y}`}
          className="h-auto w-full min-w-[520px]"
          role="img"
          aria-label={`Net gelişim grafiği: ${noktalar.length} deneme, ilk ${ilk.toFixed(2)} net, son ${son.toFixed(2)} net`}
        >
          {izgaralar.map((o) => {
            const gy = ustBosluk + cizimY - o * cizimY
            return (
              <g key={o}>
                <line
                  x1={solBosluk} y1={gy} x2={G - sagBosluk} y2={gy}
                  stroke={CIZGI} strokeOpacity="0.15" strokeWidth="2"
                />
                <text
                  x={solBosluk - 8} y={gy + 4} textAnchor="end"
                  fontSize="11" fontWeight="700" fill={CIZGI} fillOpacity="0.6"
                >
                  {Math.round(tavan * o)}
                </text>
              </g>
            )
          })}

          <path d={cizgi} fill="none" stroke={TURUNCU} strokeWidth="4"
            strokeLinecap="round" strokeLinejoin="round" />

          {noktalar.map((n, i) => (
            <g key={n.id}>
              <rect
                x={x(i) - 6} y={y(n.net) - 6} width="12" height="12"
                fill="#F4F1E8" stroke={CIZGI} strokeWidth="3"
              />
              <text
                x={x(i)} y={Y - 10} textAnchor="middle"
                fontSize="11" fontWeight="700" fill={CIZGI} fillOpacity="0.7"
              >
                {tarihKisa(n.tarih)}
              </text>
              <title>{`${n.ad} — ${n.net.toFixed(2)} net`}</title>
            </g>
          ))}
        </svg>
      </div>
    </div>
  )
}
