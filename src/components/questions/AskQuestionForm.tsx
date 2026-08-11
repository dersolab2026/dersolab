'use client'

import { useRef, useState, useTransition } from 'react'
import Link from 'next/link'
import { Loader2, Paperclip, X } from 'lucide-react'
import { askQuestion } from '@/actions/questions'
import { uploadQuestionAttachment } from '@/lib/storage/upload-question-attachment'
import { INSTRUCTOR_SUBJECT_OPTIONS } from '@/lib/constants'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY, PIXEL_BUTTON_SECONDARY, PIXEL_INPUT } from '@/lib/theme'

interface AskQuestionFormProps {
  questionCreditsRemaining: number
}

export function AskQuestionForm({ questionCreditsRemaining }: AskQuestionFormProps) {
  const [subject, setSubject] = useState('')
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (questionCreditsRemaining <= 0) {
    return (
      <div className={`${PIXEL_CARD} p-5 space-y-2`}>
        <p className="font-semibold text-[#1B2430]">Soru kredin kalmadı.</p>
        <Link href="/dashboard/student/packages" className="text-sm font-bold text-[#DD7B3A] underline">
          Soru paketi satın al
        </Link>
      </div>
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!subject || !text.trim()) return
    setError(null)
    setSuccess(false)
    startTransition(async () => {
      const result = await askQuestion({ subject, questionText: text.trim() })
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
      setSubject('')
      setText('')
      setFile(null)
      if (inputRef.current) inputRef.current.value = ''
      setSuccess(true)
    })
  }

  return (
    <form onSubmit={handleSubmit} className={`${PIXEL_CARD} p-5 space-y-3`}>
      <p className="text-sm font-semibold text-[#1B2430]/70">Kalan soru kredin: <strong>{questionCreditsRemaining}</strong></p>

      <select value={subject} onChange={(e) => setSubject(e.target.value)} className={PIXEL_INPUT} required>
        <option value="">Branş seç</option>
        {INSTRUCTOR_SUBJECT_OPTIONS.map((s) => (
          <option key={s} value={s}>{s}</option>
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
      {success && <p className="text-sm font-semibold text-[#6FA89E]">Sorun havuza iletildi, bir eğitmen cevaplayınca haber vereceğiz.</p>}

      <button type="submit" disabled={isPending || !subject} className={`${PIXEL_BUTTON_PRIMARY} gap-2 px-4 py-2 text-sm`}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Soruyu Gönder'}
      </button>
    </form>
  )
}
