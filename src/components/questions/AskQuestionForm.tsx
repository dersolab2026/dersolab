'use client'

import { useRef, useState, useTransition } from 'react'
import { Loader2, Paperclip, X } from 'lucide-react'
import { askQuestion } from '@/actions/questions'
import { uploadQuestionAttachment } from '@/lib/storage/upload-question-attachment'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY, PIXEL_BUTTON_SECONDARY, PIXEL_INPUT } from '@/lib/theme'

interface AskQuestionFormProps {
  instructors: { instructorId: string; name: string }[]
}

export function AskQuestionForm({ instructors }: AskQuestionFormProps) {
  const [instructorId, setInstructorId] = useState('')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (instructors.length === 0) {
    return (
      <div className={`${PIXEL_CARD} p-5`}>
        <p className="font-semibold text-[#1B2430]">
          Soru sorabilmek için önce bir eğitmenden ders almış olman gerekiyor.
        </p>
      </div>
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!instructorId || !text.trim()) return
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      const result = await askQuestion({ instructorId, questionText: text.trim() })
      if (!result.success) {
        setError(result.error)
        return
      }
      if (file) {
        const uploadResult = await uploadQuestionAttachment(result.questionId, 'question', file)
        if (!uploadResult.success) {
          setError(uploadResult.error ?? 'Dosya yüklenemedi')
          return
        }
      }
      setText('')
      setFile(null)
      if (inputRef.current) inputRef.current.value = ''
      setSuccess(true)
    })
  }

  return (
    <form onSubmit={handleSubmit} className={`${PIXEL_CARD} p-5 space-y-3`}>
      <select value={instructorId} onChange={(e) => setInstructorId(e.target.value)} className={PIXEL_INPUT} required>
        <option value="">Eğitmen seç</option>
        {instructors.map((i) => (
          <option key={i.instructorId} value={i.instructorId}>{i.name}</option>
        ))}
      </select>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Sorunu yaz..."
        rows={3}
        className={PIXEL_INPUT}
        required
      />

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,application/pdf"
        className="hidden"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
      />
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => inputRef.current?.click()} className={`${PIXEL_BUTTON_SECONDARY} gap-2 px-3 py-1.5 text-sm`}>
          <Paperclip className="h-4 w-4" />
          {file ? 'Dosyayı Değiştir' : 'PDF / Görüntü / Video Ekle'}
        </button>
        {file && (
          <span className="flex items-center gap-1 text-xs font-semibold text-[#1B2430]/70">
            {file.name}
            <button type="button" onClick={() => { setFile(null); if (inputRef.current) inputRef.current.value = '' }}>
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        )}
      </div>

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      {success && <p className="text-sm font-semibold text-[#6FA89E]">Sorun eğitmene iletildi.</p>}

      <button type="submit" disabled={isPending || !instructorId} className={`${PIXEL_BUTTON_PRIMARY} gap-2 px-4 py-2 text-sm`}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Soruyu Gönder'}
      </button>
    </form>
  )
}
