'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, Plus, Pencil } from 'lucide-react'
import { upsertPackage } from '@/actions/admin'

interface PackageFormDialogProps {
  packageId?: string
  initialTitle?: string
  initialDescription?: string
  initialCreditAmount?: number
  initialPrice?: number
  initialIsActive?: boolean
}

export function PackageFormDialog({
  packageId,
  initialTitle = '',
  initialDescription = '',
  initialCreditAmount = 10,
  initialPrice = 0,
  initialIsActive = true,
}: PackageFormDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [creditAmount, setCreditAmount] = useState(String(initialCreditAmount))
  const [price, setPrice] = useState(String(initialPrice))
  const [isActive, setIsActive] = useState(initialIsActive)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit() {
    setError(null)
    startTransition(async () => {
      const result = await upsertPackage({
        id: packageId,
        title,
        description,
        creditAmount: Number(creditAmount),
        price: Number(price),
        isActive,
      })
      if (!result.success) { setError(result.error); return }
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={packageId ? 'outline' : 'default'} size="sm" className="gap-2">
          {packageId ? <Pencil className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {packageId ? 'Düzenle' : 'Yeni Paket'}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>{packageId ? 'Paketi Düzenle' : 'Yeni Paket Oluştur'}</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="pkg-title">Başlık</Label>
            <Input id="pkg-title" placeholder="Örn. 10'lu Paket" value={title} onChange={(e: any) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pkg-description">Açıklama (opsiyonel)</Label>
            <Textarea id="pkg-description" value={description} onChange={(e: any) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="pkg-credits">Kredi Miktarı</Label>
              <Input id="pkg-credits" type="number" min="1" value={creditAmount} onChange={(e: any) => setCreditAmount(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pkg-price">Fiyat (₺)</Label>
              <Input id="pkg-price" type="number" min="0" step="0.01" value={price} onChange={(e: any) => setPrice(e.target.value)} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e: any) => setIsActive(e.target.checked)} />
            Satışta (öğrenciler görebilsin)
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>Vazgeç</Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending || !title.trim() || Number(creditAmount) <= 0 || Number(price) <= 0}
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kaydet'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
