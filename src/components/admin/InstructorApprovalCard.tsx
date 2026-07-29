'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Check, X } from 'lucide-react'
import { approveInstructor, rejectInstructor } from '@/actions/admin'
import type { PendingInstructor } from '@/lib/admin/get-pending-instructors'

interface InstructorApprovalCardProps {
  instructor: PendingInstructor
}

export function InstructorApprovalCard({ instructor }: InstructorApprovalCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showReject, setShowReject] = useState(false)
  const [rejectNote, setRejectNote] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleApprove() {
    setError(null)
    startTransition(async () => {
      const result = await approveInstructor(instructor.userId)
      if (!result.success) { setError(result.error); return }
      router.refresh()
    })
  }

  function handleReject() {
    setError(null)
    startTransition(async () => {
      const result = await rejectInstructor(instructor.userId, rejectNote)
      if (!result.success) { setError(result.error); return }
      router.refresh()
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          {instructor.name}
          <span className="text-sm font-normal text-muted-foreground">{instructor.email}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-1">
          {instructor.subjects.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
        </div>
        {instructor.bio && <p className="text-sm text-muted-foreground">{instructor.bio}</p>}
        <p className="text-sm">{instructor.lessonPrice} ₺ / ders</p>
        {instructor.introVideoUrl && <p className="text-xs text-muted-foreground">Tanıtım videosu eklenmiş</p>}

        {error && <p className="text-sm text-destructive">{error}</p>}

        {showReject ? (
          <div className="space-y-2">
            <Textarea
              placeholder="Reddetme sebebi (öğretmene iletilecek)"
              value={rejectNote}
              onChange={(e: any) => setRejectNote(e.target.value)}
            />
            <div className="flex gap-2">
              <Button size="sm" variant="destructive" onClick={handleReject} disabled={isPending || !rejectNote.trim()}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Reddi Onayla'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowReject(false)}>Vazgeç</Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" onClick={handleApprove} disabled={isPending} className="gap-2">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Onayla
            </Button>
            <Button size="sm" variant="outline" onClick={() => setShowReject(true)} disabled={isPending} className="gap-2">
              <X className="h-4 w-4" />
              Reddet
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
