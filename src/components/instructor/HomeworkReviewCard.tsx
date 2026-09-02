'use client'

import { useEffect, useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { getSubmissionSignedUrl } from '@/lib/storage/upload-homework-submission'
import { markHomeworkCompleted } from '@/actions/homework'
import type { HomeworkSubmission } from '@/types'
import { PIXEL_CARD, PIXEL_BADGE, INSTRUCTOR_BADGE_ACTIVE, INSTRUCTOR_BUTTON_PRIMARY } from '@/lib/theme'

interface HomeworkReviewCardProps {
  homeworkId: string
  title: string
  status: 'assigned' | 'submitted' | 'completed'
  submissions: HomeworkSubmission[]
}

const STATUS_LABELS: Record<string, string> = {
  assigned: 'Bekliyor',
  submitted: 'Teslim Edildi',
  completed: 'Onaylandı',
}

export function HomeworkReviewCard({ homeworkId, title, status, submissions }: HomeworkReviewCardProps) {
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({})
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function loadUrls() {
      const entries = await Promise.all(
        submissions.map(async (s) => [s.id, await getSubmissionSignedUrl(s.filePath)] as const)
      )
      setSignedUrls(Object.fromEntries(entries.filter(([, url]) => url !== null)) as Record<string, string>)
    }
    if (submissions.length > 0) loadUrls()
  }, [submissions])

  function handleApprove() {
    startTransition(async () => {
      await markHomeworkCompleted(homeworkId)
    })
  }

  return (
    <div className={`${PIXEL_CARD} p-5 space-y-3`}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold text-slate-200">{title}</p>
        <span className={status === 'completed' ? INSTRUCTOR_BADGE_ACTIVE : PIXEL_BADGE}>{STATUS_LABELS[status]}</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {submissions.map((s) => (
          <div key={s.id} className="overflow-hidden rounded-lg border border-white/5">
            {signedUrls[s.id] ? (
              s.fileType === 'video' ? (
                <video src={signedUrls[s.id]} controls className="h-24 w-full object-cover" />
              ) : (
                <a href={signedUrls[s.id]} target="_blank" rel="noopener noreferrer">
                  <img
                    src={signedUrls[s.id]}
                    alt="Ödev gönderimi"
                    className="h-24 w-full cursor-pointer object-cover transition-opacity hover:opacity-80"
                  />
                </a>
              )
            ) : (
              <div className="flex h-24 items-center justify-center bg-white">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}
          </div>
        ))}
      </div>

      {status === 'submitted' && (
        <button type="button" onClick={handleApprove} disabled={isPending} className={`${INSTRUCTOR_BUTTON_PRIMARY} px-3 py-1.5 text-sm`}>
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Onayla'}
        </button>
      )}
      {status === 'completed' && <p className="text-sm font-semibold text-slate-400">Bu ödev onaylandı.</p>}
    </div>
  )
}
