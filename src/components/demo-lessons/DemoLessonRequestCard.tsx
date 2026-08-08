'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { requestDemoLesson } from '@/actions/demo-lessons'
import type { DemoLessonStatus } from '@/lib/demo-lessons/get-demo-lesson-status'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY } from '@/lib/theme'

interface DemoLessonRequestCardProps {
  studentId: string
  initialStatus: DemoLessonStatus
}

export function DemoLessonRequestCard({ studentId, initialStatus }: DemoLessonRequestCardProps) {
  const [status, setStatus] = useState(initialStatus)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleRequest() {
    setError(null)
    startTransition(async () => {
      const result = await requestDemoLesson(studentId)
      if (!result.success) {
        setError(result.error)
        return
      }
      setStatus((prev) => ({ ...prev, requestStatus: 'pending' }))
    })
  }

  if (status.requestStatus === 'pending') {
    return (
      <div className={`${PIXEL_CARD} p-5`}>
        <p className="font-bold text-[#1B2430]">Talebin alındı!</p>
        <p className="mt-1 text-sm font-semibold text-[#1B2430]/70">
          Yakın zamanda müsait olan bir öğretmen tanışma dersi için atanacaktır.
        </p>
      </div>
    )
  }

  if (status.requestStatus === 'assigned' || status.freeTrialUsed) {
    return (
      <div className={`${PIXEL_CARD} p-5`}>
        <p className="font-bold text-[#1B2430]">Tanışma dersin planlandı!</p>
        <p className="mt-1 text-sm font-semibold text-[#1B2430]/70">
          Detayları &quot;Derslerim&quot; sayfasından görebilirsin.
        </p>
      </div>
    )
  }

  return (
    <div className={`${PIXEL_CARD} p-5 space-y-3`}>
      <p className="font-bold text-[#1B2430]">Ücretsiz Tanışma Dersi</p>
      <p className="text-sm font-semibold text-[#1B2430]/70">
        20 dakikalık, kredi kullanmadan alabileceğin bir tanışma dersi talep et. Uygun bir eğitmenimiz seninle
        iletişime geçip dersi planlayacak.
      </p>
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <button type="button" onClick={handleRequest} disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm`}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Tanışma Dersi Talep Et'}
      </button>
    </div>
  )
}
