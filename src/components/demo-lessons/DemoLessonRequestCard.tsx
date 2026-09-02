'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Check } from 'lucide-react'
import { requestDemoLesson } from '@/actions/demo-lessons'
import { useToast } from '@/components/ui/Toast'
import type { DemoLessonStatus } from '@/lib/demo-lessons/get-demo-lesson-status'

interface DemoLessonRequestCardProps {
  studentId: string
  initialStatus: DemoLessonStatus
}

function DurumSatiri({ etiket, durum }: { etiket: string; durum: string }) {
  return (
    <li className="flex items-center gap-3 text-sm font-semibold text-white">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-500/20 shadow-[0_0_10px_rgba(37,99,235,0.3)]">
        <Check className="h-4 w-4 text-blue-400" strokeWidth={3} />
      </span>
      <span>{etiket} — <span className="text-slate-400 font-normal">{durum}</span></span>
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
      <div className="bg-[#0a0a0a] rounded-[2rem] p-8 border border-white/5 shadow-2xl space-y-5">
        <p className="font-bold text-white text-lg">Talebin alındı!</p>
        <ul className="space-y-3 bg-white/[0.02] p-4 rounded-xl border border-white/5">
          <DurumSatiri etiket="Tanışma dersi" durum={dersDurumu} />
        </ul>
      </div>
    )
  }

  return (
    <div className="bg-[#0a0a0a] rounded-[2rem] p-8 border border-white/5 shadow-2xl space-y-4">
      <p className="font-bold text-white text-lg">Hoş Geldin Paketin</p>
      <p className="text-sm font-semibold text-slate-400">
        Her öğrenciye bir kere: ücretsiz bir tanışma dersi.
        Kredi harcamıyorsun, kart bilgisi istemiyoruz.
      </p>
      <ul className="space-y-1.5 text-sm font-medium text-slate-400 list-disc pl-5">
        <li>Uygun bir eğitmen tanışma dersini planlar.</li>
      </ul>
      {error && <p className="text-sm font-bold text-red-500">{error}</p>}
      <button type="button" onClick={handleRequest} disabled={isPending} className="mt-4 w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all disabled:opacity-60 flex justify-center items-center">
        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Hoş Geldin Paketini Al'}
      </button>
    </div>
  )
}
