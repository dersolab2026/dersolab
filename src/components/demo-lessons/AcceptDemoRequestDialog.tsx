'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { BookingCalendar } from '@/components/calendar/BookingCalendar'
import { acceptDemoLessonRequest } from '@/actions/demo-lessons'
import type { TimeSlot } from '@/types'
import { PIXEL_BUTTON_PRIMARY } from '@/lib/theme'

interface AcceptDemoRequestDialogProps {
  requestId: string
  instructorId: string
}

export function AcceptDemoRequestDialog({ requestId, instructorId }: AcceptDemoRequestDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit() {
    if (!selectedSlot) return
    setError(null)
    startTransition(async () => {
      const result = await acceptDemoLessonRequest(requestId, selectedSlot)
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
          Kabul Et
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Tanışma dersi için bir saat seç</DialogTitle></DialogHeader>
        <BookingCalendar instructorId={instructorId} onSelectSlot={setSelectedSlot} />
        {error && <p className="text-sm text-destructive">{error}</p>}
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>Vazgeç</Button>
          <Button onClick={handleSubmit} disabled={isPending || !selectedSlot}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Bu saati onayla'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
