'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2, CalendarDays, Copy, Check, SkipForward } from 'lucide-react'
import { addPlanItem, deletePlanItem, setPlanItemStatus, copyPreviousWeek } from '@/actions/coaching-plan'
import { useToast } from '@/components/ui/Toast'
import {
  GUN_ADLARI, haftaninGunleri, planTutturma, type PlanItemProgress,
} from '@/lib/coaching/plan-progress'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY, PIXEL_INPUT } from '@/lib/theme'

/**
 * Haftalik kocluk plani.
 *
 * Koc satir satir plan yaziyor; ogrencinin Gunluk girisi ayni gun + ayni ders
 * uzerinden bu satirlara kendiliginden bagleniyor. Ogrenciden ek veri
 * istenmiyor — yeni bir alaskanlik talep etmek en pahali seydir.
 *
 * canEdit=false ise ayni bilesen ogrenciye salt okunur gosteriliyor:
 * gormedigi bir plana uymasi beklenemez.
 */

interface Props {
  studentId: string
  planWeek: string
  items: PlanItemProgress[]
  subjects: string[]
  canEdit: boolean
  onWeekChange?: (week: string) => void
}

function haftaKaydir(pazartesi: string, yon: 1 | -1): string {
  const d = new Date(pazartesi + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + 7 * yon)
  return d.toISOString().slice(0, 10)
}

function tarihEtiket(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z')
  return `${d.getUTCDate()}.${d.getUTCMonth() + 1}`
}

export function WeeklyPlan({ studentId, planWeek, items, subjects, canEdit, onWeekChange }: Props) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [acik, setAcik] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [gun, setGun] = useState('')
  const [saat, setSaat] = useState('')
  const [ders, setDers] = useState(subjects[0] ?? '')
  const [konu, setKonu] = useState('')
  const [kaynak, setKaynak] = useState('')
  const [hedefSoru, setHedefSoru] = useState('')
  const [hedefDakika, setHedefDakika] = useState('')

  const gunler = haftaninGunleri(planWeek)
  const tutturma = planTutturma(items)

  function ekle() {
    setError(null)
    startTransition(async () => {
      const sonuc = await addPlanItem({
        studentId, planWeek,
        planDate: gun || gunler[0],
        planTime: saat || null,
        subject: ders,
        topic: konu, source: kaynak,
        targetQuestions: hedefSoru ? Number(hedefSoru) : null,
        targetMinutes: hedefDakika ? Number(hedefDakika) : null,
      })
      if (!sonuc.success) { setError(sonuc.error); return }
      setKonu(''); setKaynak(''); setHedefSoru(''); setHedefDakika('')
      showToast('Plana eklendi.')
      router.refresh()
    })
  }

  function sil(id: string) {
    startTransition(async () => {
      const s = await deletePlanItem(id, studentId)
      if (!s.success) showToast(s.error)
      router.refresh()
    })
  }

  function durum(id: string, yeni: 'planned' | 'done' | 'skipped') {
    startTransition(async () => {
      const s = await setPlanItemStatus(id, studentId, yeni)
      if (!s.success) showToast(s.error)
      router.refresh()
    })
  }

  function kopyala() {
    startTransition(async () => {
      const s = await copyPreviousWeek(studentId, haftaKaydir(planWeek, -1), planWeek)
      if (!s.success) { showToast(s.error); return }
      showToast('Geçen haftanın planı kopyalandı.')
      router.refresh()
    })
  }

  return (
    <div className={`${PIXEL_CARD} space-y-4 p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-[#1B2430]" />
          <p className="font-bold text-[#1B2430]">Haftalık Plan</p>
        </div>

        <div className="flex items-center gap-2">
          {onWeekChange && (
            <>
              <button type="button" onClick={() => onWeekChange(haftaKaydir(planWeek, -1))}
                aria-label="Önceki hafta"
                className="rounded-lg border-2 border-[#1B2430] bg-white px-2 py-1 text-sm font-bold">‹</button>
              <span className="text-sm font-bold tabular-nums text-[#1B2430]">
                {tarihEtiket(gunler[0])} – {tarihEtiket(gunler[6])}
              </span>
              <button type="button" onClick={() => onWeekChange(haftaKaydir(planWeek, 1))}
                aria-label="Sonraki hafta"
                className="rounded-lg border-2 border-[#1B2430] bg-white px-2 py-1 text-sm font-bold">›</button>
            </>
          )}
        </div>
      </div>

      {items.length > 0 && (
        <div className="flex items-center gap-3">
          <div className="h-6 flex-1 overflow-hidden rounded-md border-2 border-[#1B2430] bg-white">
            <div
              className="h-full transition-all"
              style={{
                width: `${tutturma.yuzde}%`,
                backgroundColor: tutturma.yuzde >= 70 ? '#6FA89E' : tutturma.yuzde >= 40 ? '#E8C468' : '#DD7B3A',
              }}
            />
          </div>
          <span className="shrink-0 text-sm font-black tabular-nums text-[#1B2430]">
            %{tutturma.yuzde}
          </span>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm font-semibold text-[#1B2430]/70">
          {canEdit ? 'Bu hafta için henüz plan yok.' : 'Koçun bu hafta için plan girmemiş.'}
        </p>
      ) : (
        <div className="space-y-3">
          {gunler.map((g, i) => {
            const gunun = items.filter((x) => x.planDate === g)
            if (gunun.length === 0) return null
            return (
              <div key={g}>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-[#1B2430]/70">
                  {GUN_ADLARI[i]} · {tarihEtiket(g)}
                </p>
                <div className="space-y-1.5">
                  {gunun.map((it) => {
                    const tam = it.status === 'done' || (it.oran !== null ? it.oran >= 1 : it.eslesti)
                    const kismi = !tam && (it.eslesti || (it.oran !== null && it.oran > 0))
                    return (
                      <div key={it.id}
                        className={`flex flex-wrap items-center gap-2 rounded-xl border-2 border-[#1B2430] px-3 py-2 ${
                          it.status === 'skipped' ? 'bg-[#1B2430]/5 opacity-60'
                            : tam ? 'bg-[#6FA89E]/15' : kismi ? 'bg-[#E8C468]/20' : 'bg-white'
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-[#1B2430]">
                            {it.planTime && <span className="mr-1.5 tabular-nums text-[#1B2430]/70">{it.planTime.slice(0, 5)}</span>}
                            {it.subject}
                            {it.topic && <span className="font-semibold text-[#1B2430]/70"> — {it.topic}</span>}
                            {it.status === 'skipped' && <span className="ml-2 text-xs">(atlandı)</span>}
                          </p>
                          <p className="text-xs font-semibold text-[#1B2430]/70">
                            {it.source && <span>{it.source} · </span>}
                            {it.targetQuestions ? `${it.gerceklesenSoru}/${it.targetQuestions} soru` : null}
                            {it.targetQuestions && it.targetMinutes ? ' · ' : null}
                            {it.targetMinutes ? `${it.gerceklesenDakika}/${it.targetMinutes} dk` : null}
                            {!it.targetQuestions && !it.targetMinutes
                              ? (it.eslesti ? 'çalışıldı' : 'kayıt yok') : null}
                          </p>
                        </div>

                        {canEdit && (
                          <div className="flex shrink-0 items-center gap-1">
                            <button type="button" onClick={() => durum(it.id, it.status === 'done' ? 'planned' : 'done')}
                              aria-label="Tamamlandı işaretle" title="Tamamlandı"
                              className={`rounded-lg border-2 border-[#1B2430] p-1 ${it.status === 'done' ? 'bg-[#6FA89E] text-white' : 'bg-white text-[#1B2430]'}`}>
                              <Check className="h-3.5 w-3.5" />
                            </button>
                            <button type="button" onClick={() => durum(it.id, it.status === 'skipped' ? 'planned' : 'skipped')}
                              aria-label="Atlandı işaretle" title="Atlandı"
                              className={`rounded-lg border-2 border-[#1B2430] p-1 ${it.status === 'skipped' ? 'bg-[#1B2430] text-white' : 'bg-white text-[#1B2430]'}`}>
                              <SkipForward className="h-3.5 w-3.5" />
                            </button>
                            <button type="button" onClick={() => sil(it.id)} aria-label="Satırı sil"
                              className="p-1 text-[#1B2430]/55 hover:text-red-600">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {canEdit && (
        <div className="flex flex-wrap gap-2">
          {!acik && (
            <button type="button" onClick={() => { setAcik(true); setGun(gunler[0]) }}
              className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm`}>
              Satır Ekle
            </button>
          )}
          {items.length === 0 && (
            <button type="button" onClick={kopyala} disabled={isPending}
              className="flex items-center gap-1.5 rounded-xl border-4 border-[#1B2430] bg-white px-4 py-2 text-sm font-bold text-[#1B2430]">
              <Copy className="h-4 w-4" /> Geçen Haftayı Kopyala
            </button>
          )}
        </div>
      )}

      {acik && canEdit && (
        <div className="space-y-3 rounded-xl border-4 border-[#1B2430] bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-bold text-[#1B2430]">Gün</label>
              <select value={gun} onChange={(e) => setGun(e.target.value)} className={PIXEL_INPUT}>
                {gunler.map((g, i) => (
                  <option key={g} value={g}>{GUN_ADLARI[i]} · {tarihEtiket(g)}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-[#1B2430]">Saat (isteğe bağlı)</label>
              <input type="time" value={saat} onChange={(e) => setSaat(e.target.value)} className={PIXEL_INPUT} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-[#1B2430]">Ders</label>
              <select value={ders} onChange={(e) => setDers(e.target.value)} className={PIXEL_INPUT}>
                {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-[#1B2430]">Konu</label>
              <input value={konu} onChange={(e) => setKonu(e.target.value)} placeholder="Örn. Türev" className={PIXEL_INPUT} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold text-[#1B2430]">Kaynak</label>
              <input value={kaynak} onChange={(e) => setKaynak(e.target.value)} placeholder="Örn. 3D Soru Bankası" className={PIXEL_INPUT} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-sm font-bold text-[#1B2430]">Hedef soru</label>
                <input type="number" min={0} value={hedefSoru} onChange={(e) => setHedefSoru(e.target.value)} className={PIXEL_INPUT} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-bold text-[#1B2430]">Hedef dk</label>
                <input type="number" min={0} value={hedefDakika} onChange={(e) => setHedefDakika(e.target.value)} className={PIXEL_INPUT} />
              </div>
            </div>
          </div>

          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

          <div className="flex gap-2">
            <button type="button" onClick={ekle} disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm`}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ekle'}
            </button>
            <button type="button" onClick={() => { setAcik(false); setError(null) }}
              className="rounded-xl border-4 border-[#1B2430] bg-white px-4 py-2 text-sm font-bold text-[#1B2430]">
              Kapat
            </button>
          </div>
        </div>
      )}

      {items.length > 0 && (
        <p className="text-xs font-semibold text-[#1B2430]/70">
          Satırlar öğrencinin Günlük kayıtlarıyla aynı gün ve aynı ders üzerinden
          kendiliğinden eşleşiyor; öğrencinin ayrıca bir şey işaretlemesi gerekmiyor.
        </p>
      )}
    </div>
  )
}
