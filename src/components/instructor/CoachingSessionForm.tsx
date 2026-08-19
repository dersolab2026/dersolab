'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Trash2, ClipboardList } from 'lucide-react'
import { saveSessionNote, deleteSessionNote } from '@/actions/coaching'
import { useToast } from '@/components/ui/Toast'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY, PIXEL_INPUT } from '@/lib/theme'

/**
 * Koçluk oturum formu.
 *
 * Serbest metin bir not kutusu yerine sabit alanlar var; amaç koçun her
 * görüşmede aynı dört soruyu sorması ve bir sonraki görüşmenin geçen
 * haftanın taahhüdüyle açılması. Öğrencinin özgüven puanı zaman içinde
 * netten bağımsız bir sinyal veriyor.
 */

export interface SessionNote {
  id: string
  sessionDate: string
  planFollowed: string | null
  obstacle: string | null
  studentCommitment: string | null
  coachDecisions: string | null
  confidence: number | null
}

const PLAN_SECENEK: { deger: 'evet' | 'kismen' | 'hayir'; etiket: string }[] = [
  { deger: 'evet', etiket: 'Uydu' },
  { deger: 'kismen', etiket: 'Kısmen' },
  { deger: 'hayir', etiket: 'Uymadı' },
]

const PLAN_ETIKET: Record<string, string> = {
  evet: 'Plana uydu', kismen: 'Plana kısmen uydu', hayir: 'Plana uymadı',
}

interface Props {
  studentId: string
  notes: SessionNote[]
  /** Koç değilse form gizleniyor, geçmiş notlar yine görünüyor. */
  canWrite: boolean
}

export function CoachingSessionForm({ studentId, notes, canWrite }: Props) {
  const router = useRouter()
  const { showToast } = useToast()
  const [acik, setAcik] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [sessionDate, setSessionDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [planFollowed, setPlanFollowed] = useState<'evet' | 'kismen' | 'hayir' | null>(null)
  const [obstacle, setObstacle] = useState('')
  const [commitment, setCommitment] = useState('')
  const [decisions, setDecisions] = useState('')
  const [confidence, setConfidence] = useState('')

  const sonTaahhut = notes.find((n) => n.studentCommitment)?.studentCommitment ?? null

  function kaydet() {
    setError(null)
    startTransition(async () => {
      const sonuc = await saveSessionNote({
        studentId,
        sessionDate,
        planFollowed,
        obstacle,
        studentCommitment: commitment,
        coachDecisions: decisions,
        confidence: confidence ? Number(confidence) : null,
      })
      if (!sonuc.success) { setError(sonuc.error); return }
      showToast('Oturum notu kaydedildi.')
      setAcik(false)
      setPlanFollowed(null); setObstacle(''); setCommitment(''); setDecisions(''); setConfidence('')
      router.refresh()
    })
  }

  function sil(id: string) {
    startTransition(async () => {
      const sonuc = await deleteSessionNote(id, studentId)
      if (!sonuc.success) { showToast(sonuc.error); return }
      router.refresh()
    })
  }

  return (
    <div className={`${PIXEL_CARD} space-y-4 p-5`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-[#1B2430]" />
          <p className="font-bold text-[#1B2430]">Koçluk Görüşmeleri</p>
        </div>
        {canWrite && !acik && (
          <button type="button" onClick={() => setAcik(true)} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm`}>
            Görüşme Notu Ekle
          </button>
        )}
      </div>

      {/* Bir onceki taahhut, yeni gorusmenin acilis sorusu olsun diye en ustte */}
      {sonTaahhut && (
        <div className="rounded-xl border-4 border-[#1B2430] bg-[#F4F1E8] px-4 py-3">
          <p className="text-xs font-bold uppercase tracking-wide text-[#1B2430]/60">
            Geçen görüşmedeki taahhüdü
          </p>
          <p className="text-sm font-semibold text-[#1B2430]">{sonTaahhut}</p>
        </div>
      )}

      {acik && canWrite && (
        <div className="space-y-3 rounded-xl border-4 border-[#1B2430] bg-white p-4">
          <div>
            <label className="mb-1 block text-sm font-bold text-[#1B2430]">Görüşme tarihi</label>
            <input type="date" value={sessionDate} onChange={(e) => setSessionDate(e.target.value)} className={PIXEL_INPUT} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-[#1B2430]">Bu hafta plana uydu mu?</label>
            <div className="flex gap-2">
              {PLAN_SECENEK.map((s) => (
                <button
                  key={s.deger}
                  type="button"
                  onClick={() => setPlanFollowed(planFollowed === s.deger ? null : s.deger)}
                  aria-pressed={planFollowed === s.deger}
                  className={`rounded-lg border-4 border-[#1B2430] px-3 py-1.5 text-sm font-bold transition-all ${
                    planFollowed === s.deger ? 'bg-[#DD7B3A] text-[#F4F1E8]' : 'bg-white text-[#1B2430]'
                  }`}
                >
                  {s.etiket}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-[#1B2430]">Engel neydi?</label>
            <textarea value={obstacle} onChange={(e) => setObstacle(e.target.value)} rows={2}
              placeholder="Örn. okul sınavları, motivasyon düşüklüğü, konu ağırdı"
              className={`${PIXEL_INPUT} resize-y`} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-[#1B2430]">
              Öğrencinin gelecek hafta taahhüdü
            </label>
            <textarea value={commitment} onChange={(e) => setCommitment(e.target.value)} rows={2}
              placeholder="Öğrencinin kendi cümlesiyle: bu hafta ne yapacak?"
              className={`${PIXEL_INPUT} resize-y`} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-[#1B2430]">Kararların</label>
            <textarea value={decisions} onChange={(e) => setDecisions(e.target.value)} rows={3}
              placeholder="En fazla 3 madde — bu hafta neyi değiştiriyoruz?"
              className={`${PIXEL_INPUT} resize-y`} />
          </div>

          <div>
            <label className="mb-1 block text-sm font-bold text-[#1B2430]">
              &quot;Bunu yapabilirim&quot; puanı (1–10)
            </label>
            <input type="number" min={1} max={10} value={confidence}
              onChange={(e) => setConfidence(e.target.value)}
              placeholder="Öğrenci kendine kaç veriyor?"
              className={`${PIXEL_INPUT} max-w-[160px]`} />
          </div>

          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

          <div className="flex gap-2">
            <button type="button" onClick={kaydet} disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm`}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kaydet'}
            </button>
            <button type="button" onClick={() => { setAcik(false); setError(null) }}
              className="rounded-xl border-4 border-[#1B2430] bg-white px-4 py-2 text-sm font-bold text-[#1B2430]">
              Vazgeç
            </button>
          </div>
        </div>
      )}

      {notes.length === 0 ? (
        <p className="text-sm font-semibold text-[#1B2430]/70">Henüz görüşme notu yok.</p>
      ) : (
        <div className="space-y-2">
          {notes.map((n) => (
            <div key={n.id} className="rounded-xl border-2 border-[#1B2430] bg-white p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-bold text-[#1B2430]">
                  {new Date(n.sessionDate).toLocaleDateString('tr-TR')}
                  {n.planFollowed && (
                    <span className={`ml-2 rounded-lg border-2 border-[#1B2430] px-2 py-0.5 text-xs ${
                      n.planFollowed === 'evet' ? 'bg-[#6FA89E] text-[#F4F1E8]'
                        : n.planFollowed === 'kismen' ? 'bg-[#E8C468] text-[#1B2430]'
                        : 'bg-[#DD7B3A] text-[#F4F1E8]'
                    }`}>
                      {PLAN_ETIKET[n.planFollowed]}
                    </span>
                  )}
                  {n.confidence !== null && (
                    <span className="ml-2 text-xs font-bold text-[#1B2430]/60">
                      özgüven {n.confidence}/10
                    </span>
                  )}
                </p>
                {canWrite && (
                  <button type="button" onClick={() => sil(n.id)} aria-label="Notu sil"
                    className="text-[#1B2430]/40 transition-colors hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              {n.obstacle && (
                <p className="mt-1 text-sm text-[#1B2430]/80"><strong>Engel:</strong> {n.obstacle}</p>
              )}
              {n.studentCommitment && (
                <p className="mt-1 text-sm text-[#1B2430]/80"><strong>Taahhüdü:</strong> {n.studentCommitment}</p>
              )}
              {n.coachDecisions && (
                <p className="mt-1 text-sm text-[#1B2430]/80"><strong>Kararlar:</strong> {n.coachDecisions}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
