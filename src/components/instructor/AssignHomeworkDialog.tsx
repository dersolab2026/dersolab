'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, BookPlus } from 'lucide-react'
import { assignHomework } from '@/actions/homework'

interface AssignHomeworkDialogProps {
  studentId: string
  bookingId?: string
  triggerLabel?: string
}

export function AssignHomeworkDialog({ studentId, bookingId, triggerLabel = 'Ödev Ver' }: AssignHomeworkDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState<string | null>(null)

  function resetForm() {
    setTitle('')
    setDescription('')
    setDueDate('')
    setError(null)
  }

  function handleSubmit() {
    if (!title.trim()) {
      setError('Ödev başlığı boş olamaz')
      return
    }
    setError(null)
    startTransition(async () => {
      const result = await assignHomework({
        studentId,
        bookingId,
        title: title.trim(),
        description: description.trim() || undefined,
        dueDate: dueDate || undefined,
      })
      if (!result.success) {
        setError(result.error)
        return
      }
      resetForm()
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { setOpen(next); if (!next) resetForm() }}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BookPlus className="h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ödev Ver</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="homework-title">Başlık</Label>
            <Input id="homework-title" placeholder="Örn. Türev alıştırmaları 1-15" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="homework-description">Açıklama (opsiyonel)</Label>
            <Textarea id="homework-description" placeholder="Öğrenciye görünecek ek talimatlar" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="homework-due-date">Son Tarih (opsiyonel)</Label>
            <Input id="homework-due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>Vazgeç</Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ödevi Gönder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
