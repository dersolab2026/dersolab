'use client'

import { useState, useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, BookPlus } from 'lucide-react'
import { assignHomework, listResources } from '@/actions/homework'
import { ODEV_TIPLERI, odevTipi, type OdevTipi } from '@/lib/homework/types'
import { PIXEL_BUTTON_SECONDARY } from '@/lib/theme'

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
  const [tip, setTip] = useState<OdevTipi>('serbest')
  const [kaynakId, setKaynakId] = useState('')
  const [aralik, setAralik] = useState('')
  const [kaynaklar, setKaynaklar] = useState<{ id: string; publisher: string | null; title: string }[]>([])
  const [error, setError] = useState<string | null>(null)

  const tipTanim = odevTipi(tip)

  // Kaynak listesi yalnizca gerektiginde cekiliyor.
  useEffect(() => {
    if (!open || !tipTanim.kaynakGerekir || kaynaklar.length > 0) return
    listResources().then(setKaynaklar).catch(() => setKaynaklar([]))
  }, [open, tipTanim.kaynakGerekir, kaynaklar.length])

  function resetForm() {
    setTitle('')
    setDescription('')
    setDueDate('')
    setTip('serbest')
    setKaynakId('')
    setAralik('')
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
        homeworkType: tip,
        resourceId: kaynakId || null,
        resourceRange: aralik || null,
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
        <button type="button" className={`${PIXEL_BUTTON_SECONDARY} gap-2 px-3 py-1.5 text-sm`}>
          <BookPlus className="h-4 w-4" />
          {triggerLabel}
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ödev Ver</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Ödev Tipi</Label>
            <div className="flex flex-wrap gap-1.5">
              {ODEV_TIPLERI.map((t) => (
                <button
                  key={t.deger}
                  type="button"
                  onClick={() => setTip(t.deger)}
                  aria-pressed={tip === t.deger}
                  title={t.aciklama}
                  className={`rounded-lg border-2 border-[#1B2430] px-2.5 py-1 text-xs font-bold transition-all ${
                    tip === t.deger ? 'bg-[#DD7B3A] text-[#F4F1E8]' : 'bg-white text-[#1B2430]'
                  }`}
                >
                  {t.etiket}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{tipTanim.aciklama}</p>
          </div>

          {tipTanim.kaynakGerekir && (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="homework-resource">Kaynak</Label>
                <select
                  id="homework-resource"
                  value={kaynakId}
                  onChange={(e) => setKaynakId(e.target.value)}
                  className="w-full rounded-lg border-2 border-[#1B2430] bg-white px-3 py-2 text-sm"
                >
                  <option value="">Seç…</option>
                  {kaynaklar.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.publisher ? `${k.publisher} — ` : ''}{k.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="homework-range">Bölüm / aralık</Label>
                <Input id="homework-range" placeholder="Örn. 3. bölüm, 1-40"
                  value={aralik} onChange={(e) => setAralik(e.target.value)} />
              </div>
            </div>
          )}

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
