'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, UserPlus } from 'lucide-react'
import { addChildStudent } from '@/actions/family'

export function AddChildDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [gradeTrack, setGradeTrack] = useState<'lgs' | 'yks'>('lgs')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit() {
    if (!name.trim()) { setError('İsim boş olamaz'); return }
    setError(null)
    startTransition(async () => {
      const result = await addChildStudent({ name: name.trim(), gradeTrack })
      if (!result.success) { setError(result.error); return }
      setName('')
      setOpen(false)
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Öğrenci Ekle
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Öğrenci Profili Ekle</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="child-name">Öğrencinin Adı</Label>
            <Input id="child-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Sınav Türü</Label>
            <Select value={gradeTrack} onValueChange={(v: string) => setGradeTrack(v as 'lgs' | 'yks')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="lgs">LGS</SelectItem>
                <SelectItem value="yks">YKS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>Vazgeç</Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ekle'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
