'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, X } from 'lucide-react'
import { addEducationEntry, removeEducationEntry } from '@/actions/instructor-profile'
import { useToast } from '@/components/ui/Toast'
import type { EducationEntry } from '@/types'
import { PIXEL_CARD, INSTRUCTOR_BUTTON_PRIMARY, PIXEL_BUTTON_SECONDARY, PIXEL_INPUT } from '@/lib/theme'

interface EducationEditorProps {
  initialEntries: EducationEntry[]
}

export function EducationEditor({ initialEntries }: EducationEditorProps) {
  const router = useRouter()
  const { showToast } = useToast()
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
      showToast('Eğitim bilgin eklendi.')
      router.refresh()
    })
  }

  function handleRemove(id: string) {
    startTransition(async () => {
      await removeEducationEntry(id)
      showToast('Eğitim bilgin silindi.')
      router.refresh()
    })
  }

  return (
    <div className="space-y-3">
      {initialEntries.map((entry) => (
        <div key={entry.id} className={`${PIXEL_CARD} p-3 flex items-center justify-between`}>
          <div>
            <p className="font-bold text-slate-200">{entry.institution}</p>
            <p className="text-sm font-semibold text-slate-400">
              {[entry.degree, entry.fieldOfStudy].filter(Boolean).join(' — ')}
            </p>
          </div>
          <button onClick={() => handleRemove(entry.id)} disabled={isPending} aria-label="Kaldır">
            <X className="h-4 w-4 text-slate-400" />
          </button>
        </div>
      ))}

      {isAdding ? (
        <div className={`${PIXEL_CARD} p-3 space-y-2`}>
          <input placeholder="Kurum (örn. Boğaziçi Üniversitesi)" value={institution} onChange={(e) => setInstitution(e.target.value)} className={`${PIXEL_INPUT} py-2`} />
          <input placeholder="Derece (örn. Lisans)" value={degree} onChange={(e) => setDegree(e.target.value)} className={`${PIXEL_INPUT} py-2`} />
          <input placeholder="Bölüm (örn. Matematik Mühendisliği)" value={fieldOfStudy} onChange={(e) => setFieldOfStudy(e.target.value)} className={`${PIXEL_INPUT} py-2`} />
          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
          <div className="flex gap-2">
            <button onClick={handleAdd} disabled={isPending || !institution.trim()} className={`${INSTRUCTOR_BUTTON_PRIMARY} px-3 py-1.5 text-sm`}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kaydet'}
            </button>
            <button onClick={() => setIsAdding(false)} className={`${PIXEL_BUTTON_SECONDARY} px-3 py-1.5 text-sm`}>Vazgeç</button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setIsAdding(true)} className={`${PIXEL_BUTTON_SECONDARY} gap-2 px-3 py-1.5 text-sm`}>
          <Plus className="h-4 w-4" />
          Eğitim Bilgisi Ekle
        </button>
      )}
    </div>
  )
}
