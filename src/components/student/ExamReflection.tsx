'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { saveExamReflection, type ExamResultEntry } from '@/actions/exam-results'
import { useToast } from '@/components/ui/Toast'
import { PIXEL_BUTTON_PRIMARY, PIXEL_INPUT } from '@/lib/theme'

/**
 * Deneme sonrasi iki soruluk yansitma.
 *
 * Kayit aninda degil sonradan soruluyor: deneme biter bitmez ogrenci sonucu
 * girmek istiyor, o anda uc paragraf yazdirmak kayit tamamlanma oranini
 * dusururdu. Iki soru ve ikisi de istege bagli.
 */
export function ExamReflection({ entry }: { entry: ExamResultEntry }) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const [hazirlik, setHazirlik] = useState(entry.reflection?.preparation ?? '')
  const [sureDersi, setSureDersi] = useState(entry.reflection?.timePressureSubject ?? '')

  function kaydet() {
    setError(null)
    startTransition(async () => {
      const s = await saveExamReflection(entry.id, hazirlik, sureDersi)
      if (!s.success) { setError(s.error); return }
      showToast('Notların kaydedildi.')
      router.refresh()
    })
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-bold text-[var(--yazi)]/70">Deneme sonrası notların</p>

      <div>
        <label className="mb-1 block text-xs font-bold text-[var(--yazi)]">
          Bu denemeye nasıl hazırlandın?
        </label>
        <textarea value={hazirlik} onChange={(e) => setHazirlik(e.target.value)} rows={2}
          placeholder="Örn. son iki hafta sadece soru çözdüm, konu tekrarı yapmadım"
          className={`${PIXEL_INPUT} resize-y text-sm`} />
      </div>

      <div>
        <label className="mb-1 block text-xs font-bold text-[var(--yazi)]">
          Hangi derste süre yetmedi?
        </label>
        <input value={sureDersi} onChange={(e) => setSureDersi(e.target.value)}
          placeholder="Örn. Temel Matematik" className={`${PIXEL_INPUT} text-sm`} />
      </div>

      {error && <p className="text-sm font-semibold text-[var(--tehlike)]">{error}</p>}

      <button type="button" onClick={kaydet} disabled={isPending}
        className={`${PIXEL_BUTTON_PRIMARY} px-3 py-1.5 text-sm`}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Notları Kaydet'}
      </button>
    </div>
  )
}
