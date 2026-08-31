'use client'

import { useRef, useState, useTransition } from 'react'
import { Loader2, Upload, CheckCircle2 } from 'lucide-react'
import { uploadHomeworkSubmission } from '@/lib/storage/upload-homework-submission'
import { notifyHomeworkSubmitted } from '@/actions/homework'
import { useToast } from '@/components/ui/Toast'
import { PIXEL_BUTTON_SECONDARY } from '@/lib/theme'

interface HomeworkSubmissionUploaderProps {
  homeworkId: string
  onUploaded?: () => void
}

export function HomeworkSubmissionUploader({ homeworkId, onUploaded }: HomeworkSubmissionUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setSuccess(false)

    startTransition(async () => {
      const result = await uploadHomeworkSubmission(homeworkId, file)
      if (!result.success) {
        setError(result.error ?? 'Yükleme başarısız oldu')
        return
      }
      setSuccess(true)
      showToast('Ödevin teslim edildi, eğitmenine bildirildi.')
      await notifyHomeworkSubmitted(homeworkId)
      onUploaded?.()
      if (inputRef.current) inputRef.current.value = ''
    })
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
        className="hidden"
        onChange={handleFileChange}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isPending}
        className={`${PIXEL_BUTTON_SECONDARY} gap-2 px-3 py-1.5 text-sm`}
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : success ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Upload className="h-4 w-4" />}
        {isPending ? 'Yükleniyor...' : success ? 'Yüklendi' : 'Fotoğraf / Video Yükle'}
      </button>
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <p className="text-xs font-semibold text-[#1B2430]/70">JPG, PNG, WEBP, MP4 veya MOV — en fazla 25 MB</p>
    </div>
  )
}
