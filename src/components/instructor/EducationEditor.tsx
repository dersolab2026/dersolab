'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { Loader2, Plus, X } from 'lucide-react'
import { addEducationEntry, removeEducationEntry } from '@/actions/instructor-profile'
import type { EducationEntry } from '@/types'

interface EducationEditorProps {
  initialEntries: EducationEntry[]
}

export function EducationEditor({ initialEntries }: EducationEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [institution, setInstitution] = useState('')
  const [degree, setDegree] = useState('')
  const [fieldOfStudy, setFieldOfStudy] = useState('')

  function handleAdd() {
    setError(null)
    startTransition(async () => {
      const result = await addEducationEntry({ institution, degree, fieldOfStudy })
      if (!result.success) {
        setError(result.error)
        return
      }
      setInstitution('')
      setDegree('')
      setFieldOfStudy('')
      setIsAdding(false)
      router.refresh()
    })
  }

  function handleRemove(id: string) {
    startTransition(async () => {
      await removeEducationEntry(id)
      router.refresh()
    })
  }

  return (
    <div className="space-y-3">
      {initialEntries.map((entry) => (
        <Card key={entry.id}>
          <CardContent className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">{entry.institution}</p>
              <p className="text-sm text-muted-foreground">
                {[entry.degree, entry.fieldOfStudy].filter(Boolean).join(' — ')}
              </p>
            </div>
            <button onClick={() => handleRemove(entry.id)} disabled={isPending} aria-label="Kaldır">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </CardContent>
        </Card>
      ))}

      {isAdding ? (
        <Card>
          <CardContent className="space-y-2 py-3">
            <Input placeholder="Kurum (örn. Boğaziçi Üniversitesi)" value={institution} onChange={(e) => setInstitution(e.target.value)} />
            <Input placeholder="Derece (örn. Lisans)" value={degree} onChange={(e) => setDegree(e.target.value)} />
            <Input placeholder="Bölüm (örn. Matematik Mühendisliği)" value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} disabled={isPending || !institution.trim()}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kaydet'}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>Vazgeç</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Button variant="outline" size="sm" onClick={() => setIsAdding(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Eğitim Bilgisi Ekle
        </Button>
      )}
    </div>
  )
}
