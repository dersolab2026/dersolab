'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, Upload, Loader2, X } from 'lucide-react'
import {
  uploadLessonMaterial,
  getLessonMaterialSignedUrl,
  deleteLessonMaterial,
} from '@/lib/storage/upload-lesson-material'
import type { LessonMaterial } from '@/lib/lessons/get-lesson-materials'
import { useToast } from '@/components/ui/Toast'
import { PIXEL_BUTTON_SECONDARY, PIXEL_BADGE } from '@/lib/theme'

interface LessonMaterialsProps {
  bookingId: string
  materials: LessonMaterial[]
  isInstructor: boolean
}

export function LessonMaterials({ bookingId, materials, isInstructor }: LessonMaterialsProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError(null)
    startTransition(async () => {
      const title = file.name.replace(/\.pdf$/i, '')
      const result = await uploadLessonMaterial(bookingId, title, file)
      if (!result.success) {
        setError(result.error ?? 'Yükleme başarısız oldu')
        return
      }
      if (inputRef.current) inputRef.current.value = ''
      showToast('Ders notu yüklendi.')
      router.refresh()
    })
  }

  async function handleDownload(filePath: string) {
    const url = await getLessonMaterialSignedUrl(filePath)
    if (url) window.open(url, '_blank', 'noopener,noreferrer')
  }

  function handleDelete(materialId: string, filePath: string) {
    setPendingDeleteId(materialId)
    startTransition(async () => {
      const result = await deleteLessonMaterial(materialId, filePath)
      setPendingDeleteId(null)
      if (!result.success) {
        setError(result.error ?? 'Silinemedi')
        return
      }
      showToast('Ders notu silindi.')
      router.refresh()
    })
  }

  if (materials.length === 0 && !isInstructor) return null

  return (
    <div className="mt-2 space-y-1.5">
      {materials.map((m) => (
        <div key={m.id} className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => handleDownload(m.filePath)}
            className={`${PIXEL_BADGE} gap-1.5 flex items-center max-w-[220px] truncate`}
          >
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{m.title}</span>
          </button>
          {isInstructor && (
            <button
              type="button"
              onClick={() => handleDelete(m.id, m.filePath)}
              disabled={isPending && pendingDeleteId === m.id}
              aria-label="Dosyayı sil"
            >
              {isPending && pendingDeleteId === m.id ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <X className="h-3.5 w-3.5 text-[#1B2430]/60" />
              )}
            </button>
          )}
        </div>
      ))}

      {isInstructor && (
        <>
          <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isPending && !pendingDeleteId}
            className={`${PIXEL_BUTTON_SECONDARY} gap-1.5 px-2.5 py-1 text-xs`}
          >
            {isPending && !pendingDeleteId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            Ders Notu Yükle
          </button>
        </>
      )}

      {error && <p className="text-xs font-semibold text-red-600">{error}</p>}
    </div>
  )
}
