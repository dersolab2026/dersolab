'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Star as StarIcon } from 'lucide-react'
import { StarRatingInput } from './StarRatingInput'
import { submitReview } from '@/actions/reviews'

interface LeaveReviewDialogProps {
  bookingId: string
  studentId: string
  instructorId: string
  instructorName: string
}

export function LeaveReviewDialog({ bookingId, studentId, instructorId, instructorName }: LeaveReviewDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit() {
    if (rating === 0) { setError('Lütfen bir puan seç'); return }
    setError(null)
    startTransition(async () => {
      const result = await submitReview({ bookingId, studentId, instructorId, rating, comment: comment.trim() || undefined })
      if (!result.success) { setError(result.error); return }
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <StarIcon className="h-4 w-4" />
          Değerlendir
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{instructorName} için değerlendirme</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <StarRatingInput value={rating} onChange={setRating} />
          <Textarea placeholder="Deneyimini kısaca anlat (opsiyonel)" value={comment} onChange={(e) => setComment(e.target.value)} />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>Vazgeç</Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Gönder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
