'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check } from 'lucide-react'
import { requestDemoLesson } from '@/actions/demo-lessons'
import { useToast } from '@/components/ui/Toast'
import type { DemoLessonStatus } from '@/lib/demo-lessons/get-demo-lesson-status'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY } from '@/lib/theme'

interface DemoLessonRequestCardProps {
  studentId: string
  initialStatus: DemoLessonStatus
}

function DurumSatiri({ etiket, durum }: { etiket: string; durum: string }) {
  return (
    <li className="flex items-center gap-2 text-sm font-semibold text-[var(--yazi)]">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-[var(--cizgi)] bg-[var(--ikincil-zemin)]">
        <Check className="h-3 w-3 text-[var(--yazi-ters)]" strokeWidth={3} />
      </span>
      <span>{etiket} — <span className="text-[var(--yazi)]/70">{durum}</span></span>
    </li>
  )
}

export function DemoLessonRequestCard({ studentId, initialStatus }: DemoLessonRequestCardProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const s = initialStatus
  const talepVar = s.requestStatus === 'pending' || s.requestStatus === 'assigned' || s.freeTrialUsed

  function handleRequest() {
    setError(null)
    startTransition(async () => {
      const result = await requestDemoLesson(studentId)
      if (!result.success) { setError(result.error); return }
      showToast('Talebin alındı, en kısa sürede dönüş yapılacak.')
      router.refresh()
    })
  }

  if (talepVar) {
    const dersDurumu = s.requestStatus === 'assigned' || s.freeTrialUsed
      ? 'eğitmenin atandı, detaylar Derslerim sayfasında'
      : s.requestStatus === 'pending' ? 'uygun bir eğitmen bekleniyor' : 'talep açılmadı'

    return (
      <div className={`${PIXEL_CARD} p-5 space-y-3`}>
        <p className="font-bold text-[var(--yazi)]">Talebin alındı!</p>
        <ul className="space-y-2">
          <DurumSatiri etiket="Tanışma dersi" durum={dersDurumu} />
        </ul>
      </div>
    )
  }

  return (
    <div className={`${PIXEL_CARD} p-5 space-y-3`}>
      <p className="font-bold text-[var(--yazi)]">Hoş Geldin Paketin</p>
      <p className="text-sm font-semibold text-[var(--yazi)]/70">
        Her öğrenciye bir kere: ücretsiz bir tanışma dersi.
        Kredi harcamıyorsun, kart bilgisi istemiyoruz.
      </p>
      <ul className="space-y-1.5 text-sm font-semibold text-[var(--yazi)]/80 list-disc pl-5">
        <li>Uygun bir eğitmen tanışma dersini planlar.</li>
      </ul>
      {error && <p className="text-sm font-semibold text-[var(--tehlike)]">{error}</p>}
      <button type="button" onClick={handleRequest} disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm`}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Hoş Geldin Paketini Al'}
      </button>
    </div>
  )
}
