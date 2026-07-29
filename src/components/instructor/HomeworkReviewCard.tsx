'use client'

import { useEffect, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { getSubmissionSignedUrl } from '@/lib/storage/upload-homework-submission'
import { markHomeworkCompleted } from '@/actions/homework'
import type { HomeworkSubmission } from '@/types'

interface HomeworkReviewCardProps {
  homeworkId: string
  title: string
  status: 'assigned' | 'submitted' | 'completed'
  submissions: HomeworkSubmission[]
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          {title}
          <span className="text-xs font-normal text-muted-foreground">{status}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {submissions.map((s) => (
            <div key={s.id} className="overflow-hidden rounded-md border">
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
                <div className="flex h-24 items-center justify-center bg-muted">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
            </div>
          ))}
        </div>

        {status === 'submitted' && (
          <Button size="sm" onClick={handleApprove} disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Onayla'}
          </Button>
        )}
        {status === 'completed' && <p className="text-sm text-muted-foreground">Bu ödev onaylandı.</p>}
      </CardContent>
    </Card>
  )
}