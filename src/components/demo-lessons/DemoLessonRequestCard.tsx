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
    <li className="flex items-center gap-2 text-sm font-semibold text-[#1B2430]">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 border-[#1B2430] bg-[#6FA89E]">
        <Check className="h-3 w-3 text-white" strokeWidth={3} />
      </span>
      <span>{etiket} — <span className="text-[#1B2430]/70">{durum}</span></span>
    </li>
  )
}

export function DemoLessonRequestCard({ studentId, initialStatus }: DemoLessonRequestCardProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const s = initialStatus
  const dersHareket = s.requestStatus === 'pending' || s.requestStatus === 'assigned' || s.freeTrialUsed
  const koclukHareket = s.coachingStatus === 'pending' || s.coachingStatus === 'assigned' || s.freeCoachingUsed
  const talepVar = dersHareket || koclukHareket

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
    const koclukDurumu = s.coachingStatus === 'assigned' || s.freeCoachingUsed
      ? 'koçun atandı, seninle iletişime geçecek'
      : s.coachingStatus === 'pending' ? 'uygun bir koç bekleniyor' : 'talep açılmadı'

    return (
      <div className={`${PIXEL_CARD} p-5 space-y-3`}>
        <p className="font-bold text-[#1B2430]">Talebin alındı!</p>
        <ul className="space-y-2">
          <DurumSatiri etiket="Ücretsiz tanışma dersi" durum={dersDurumu} />
          <DurumSatiri etiket="1 haftalık koçluk" durum={koclukDurumu} />
        </ul>
      </div>
    )
  }

  return (
    <div className={`${PIXEL_CARD} p-5 space-y-3`}>
      <p className="font-bold text-[#1B2430]">Ücretsiz Başlangıç Paketin</p>
      <p className="text-sm font-semibold text-[#1B2430]/70">
        Tek talep, iki hak: 20 dakikalık bir tanışma dersi ve bir hafta boyunca koçluk desteği.
        Kredi harcamıyorsun, kart bilgisi istemiyoruz.
      </p>
      <ul className="space-y-1.5 text-sm font-semibold text-[#1B2430]/80 list-disc pl-5">
        <li>Uygun bir eğitmen tanışma dersini planlar.</li>
        <li>Bir koç seninle iletişime geçip haftalık programını kurar.</li>
      </ul>
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <button type="button" onClick={handleRequest} disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm`}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ücretsiz Başlangıcı Talep Et'}
      </button>
    </div>
  )
}
