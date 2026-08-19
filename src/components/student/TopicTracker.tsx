'use client'

import { useState, useTransition, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { BookMarked, Check } from 'lucide-react'
import { setTopicStatus, type Konu, type KonuDurumu } from '@/actions/topics'
import { useToast } from '@/components/ui/Toast'
import { EXAM_TYPE_LABELS, type ExamType } from '@/lib/exams/scoring'
import { PIXEL_CARD } from '@/lib/theme'

/**
 * Konu takip çizelgesi.
 *
 * Üç aşama ayrı tutuluyor — işlendi / soru çözüldü / tekrar edildi — çünkü
 * "konuyu bitirdim" tek bir kutu olduğunda öğrenci konu anlatımını izler
 * izlemez işaretliyor ve çizelge gerçeği göstermiyor. Üçünü ayırmak
 * öğrencinin kendine karşı dürüst olmasını kolaylaştırıyor.
 *
 * Salt okunur modda (koç görünümü) kutular tıklanmıyor.
 */

interface Props {
  examType: ExamType
  konular: Konu[]
  durumlar: KonuDurumu[]
  readOnly?: boolean
}

const GUVEN_SECENEK: { deger: 'zayif' | 'orta' | 'iyi'; etiket: string; renk: string }[] = [
  { deger: 'zayif', etiket: 'Zayıf', renk: '#DD7B3A' },
  { deger: 'orta', etiket: 'Orta', renk: '#E8C468' },
  { deger: 'iyi', etiket: 'İyi', renk: '#6FA89E' },
]

export function TopicTracker({ examType, konular, durumlar, readOnly = false }: Props) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [acikDers, setAcikDers] = useState<string | null>(null)

  const durumById = useMemo(
    () => new Map(durumlar.map((d) => [d.topicId, d])),
    [durumlar],
  )

  const dersler = useMemo(() => {
    const m = new Map<string, Konu[]>()
    for (const k of konular) {
      const liste = m.get(k.subject) ?? []
      liste.push(k)
      m.set(k.subject, liste)
    }
    return [...m.entries()]
  }, [konular])

  function degistir(topicId: string, alan: 'studied' | 'practiced' | 'reviewed', deger: boolean) {
    if (readOnly) return
    startTransition(async () => {
      const s = await setTopicStatus(topicId, { [alan]: deger })
      if (!s.success) { showToast(s.error); return }
      router.refresh()
    })
  }

  function guvenDegistir(topicId: string, deger: 'zayif' | 'orta' | 'iyi') {
    if (readOnly) return
    startTransition(async () => {
      const mevcut = durumById.get(topicId)?.confidence
      const s = await setTopicStatus(topicId, { confidence: mevcut === deger ? null : deger })
      if (!s.success) { showToast(s.error); return }
      router.refresh()
    })
  }

  if (konular.length === 0) {
    return (
      <div className={`${PIXEL_CARD} p-5`}>
        <p className="font-bold text-[#1B2430]">Konularım</p>
        <p className="text-sm font-semibold text-[#1B2430]/70">
          {EXAM_TYPE_LABELS[examType]} için konu listesi henüz yüklenmemiş.
        </p>
      </div>
    )
  }

  return (
    <div className={`${PIXEL_CARD} space-y-4 p-5`}>
      <div className="flex items-center gap-2">
        <BookMarked className="h-5 w-5 text-[#1B2430]" />
        <p className="font-bold text-[#1B2430]">
          {EXAM_TYPE_LABELS[examType]} Konuları
          <span className="ml-2 text-sm font-semibold text-[#1B2430]/60">{konular.length} konu</span>
        </p>
      </div>

      <div className="space-y-2">
        {dersler.map(([ders, dersKonulari]) => {
          const bitmis = dersKonulari.filter((k) => {
            const d = durumById.get(k.id)
            return d?.studied && d?.practiced
          }).length
          const oran = Math.round((bitmis / dersKonulari.length) * 100)
          const acik = acikDers === ders

          return (
            <div key={ders} className="rounded-xl border-2 border-[#1B2430] bg-white">
              <button
                type="button"
                onClick={() => setAcikDers(acik ? null : ders)}
                aria-expanded={acik}
                className="flex w-full items-center gap-3 p-3 text-left"
              >
                <span className="min-w-0 flex-1 truncate text-sm font-bold text-[#1B2430]">{ders}</span>
                <div className="h-4 w-24 shrink-0 overflow-hidden rounded border-2 border-[#1B2430] bg-white">
                  <div className="h-full bg-[#6FA89E]" style={{ width: `${oran}%` }} />
                </div>
                <span className="w-16 shrink-0 text-right text-xs font-bold tabular-nums text-[#1B2430]">
                  {bitmis}/{dersKonulari.length}
                </span>
              </button>

              {acik && (
                <div className="space-y-1.5 border-t-2 border-[#1B2430]/10 p-3">
                  <div className="flex gap-2 pb-1 text-xs font-bold text-[#1B2430]/50">
                    <span className="flex-1">Konu</span>
                    <span className="w-14 text-center">İşlendi</span>
                    <span className="w-14 text-center">Soru</span>
                    <span className="w-14 text-center">Tekrar</span>
                    <span className="w-24 text-center">Durum</span>
                  </div>

                  {dersKonulari.map((k) => {
                    const d = durumById.get(k.id)
                    return (
                      <div key={k.id} className="flex items-center gap-2">
                        <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#1B2430]" title={k.name}>
                          {k.name}
                        </span>
                        {(['studied', 'practiced', 'reviewed'] as const).map((alan) => {
                          const isaretli = d?.[alan] ?? false
                          return (
                            <button
                              key={alan}
                              type="button"
                              disabled={readOnly || isPending}
                              onClick={() => degistir(k.id, alan, !isaretli)}
                              aria-label={`${k.name} — ${alan}`}
                              aria-pressed={isaretli}
                              className={`flex h-7 w-14 items-center justify-center rounded border-2 border-[#1B2430] transition-all ${
                                isaretli ? 'bg-[#6FA89E]' : 'bg-white'
                              } ${readOnly ? 'cursor-default' : ''}`}
                            >
                              {isaretli && <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
                            </button>
                          )
                        })}
                        <div className="flex w-24 shrink-0 gap-0.5">
                          {GUVEN_SECENEK.map((g) => (
                            <button
                              key={g.deger}
                              type="button"
                              disabled={readOnly || isPending}
                              onClick={() => guvenDegistir(k.id, g.deger)}
                              aria-label={`${k.name} — ${g.etiket}`}
                              aria-pressed={d?.confidence === g.deger}
                              title={g.etiket}
                              className="h-7 flex-1 rounded border-2 border-[#1B2430] transition-all"
                              style={{
                                backgroundColor: d?.confidence === g.deger ? g.renk : 'white',
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p className="text-xs font-semibold text-[#1B2430]/60">
        Üç aşama ayrı: konuyu <strong>işledin</strong>, üstüne <strong>soru</strong> çözdün,
        bir süre sonra <strong>tekrar</strong> ettin. Sağdaki üç renk kendi
        değerlendirmen — zayıf, orta, iyi. İlerleme çubuğu işlenmiş ve soru
        çözülmüş konuları sayıyor.
      </p>
    </div>
  )
}
