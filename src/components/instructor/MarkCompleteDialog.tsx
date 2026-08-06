'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { markBookingCompleted } from '@/actions/bookings'
import { PIXEL_BUTTON_PRIMARY } from '@/lib/theme'

interface MarkCompleteDialogProps {
  bookingId: string
}

export function MarkCompleteDialog({ bookingId }: MarkCompleteDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit() {
    setError(null)
    startTransition(async () => {
      const result = await markBookingCompleted(bookingId, notes.trim() || undefined)
      if (!result.success) { setError(result.error); return }
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className={`${PIXEL_BUTTON_PRIMARY} gap-2 px-3 py-1.5 text-sm`}>
          <CheckCircle2 className="h-4 w-4" />
          Tamamlandı Olarak İşaretle
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Dersi tamamlandı olarak işaretle</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <Textarea
            placeholder="Ders notu (opsiyonel) — sadece sen ve öğrenci/veli görebilir"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>Vazgeç</Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Onayla'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
