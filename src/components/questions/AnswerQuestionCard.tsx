'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { Loader2, Paperclip, X } from 'lucide-react'
import { answerQuestion } from '@/actions/questions'
import { uploadQuestionAttachment, getQuestionAttachmentSignedUrl } from '@/lib/storage/upload-question-attachment'
import type { QuestionListItem } from '@/lib/questions/get-questions-list'
import { PIXEL_CARD, PIXEL_BADGE, PIXEL_BADGE_ACTIVE, PIXEL_BUTTON_PRIMARY, PIXEL_BUTTON_SECONDARY, PIXEL_INPUT } from '@/lib/theme'

interface AnswerQuestionCardProps {
  question: QuestionListItem
}

export function AnswerQuestionCard({ question }: AnswerQuestionCardProps) {
  const [isAnswering, setIsAnswering] = useState(false)
  const [answer, setAnswer] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit() {
    if (!answer.trim() && !file) return
    setError(null)
    startTransition(async () => {
      if (file) {
        const uploadResult = await uploadQuestionAttachment(question.id, 'answer', file)
        if (!uploadResult.success) {
          setError(uploadResult.error ?? 'Dosya yüklenemedi')
          return
        }
      }
      const result = await answerQuestion(question.id, answer.trim() || null)
      if (!result.success) {
        setError(result.error)
        return
      }
      setIsAnswering(false)
    })
  }

  return (
    <div className={`${PIXEL_CARD} p-5 space-y-2`}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold text-[#1B2430]">{question.studentName}</p>
        <span className={question.status === 'answered' ? PIXEL_BADGE_ACTIVE : PIXEL_BADGE}>
          {question.status === 'answered' ? 'Cevaplandı' : 'Bekliyor'}
        </span>
      </div>

      <p className="text-sm font-semibold text-[#1B2430]">{question.questionText}</p>
      {question.questionAttachment && <AttachmentPreview attachment={question.questionAttachment} label="Öğrencinin dosyası" />}

      {question.answerText && (
        <p className="text-sm font-semibold text-[#1B2430]/70">
          <span className="text-[#6FA89E]">Cevabın:</span> {question.answerText}
        </p>
      )}
      {question.answerAttachment && <AttachmentPreview attachment={question.answerAttachment} label="Eklediğin dosya" />}

      {question.status !== 'answered' && (
        isAnswering ? (
          <div className="space-y-2">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Cevabını yaz (isteğe bağlı, sadece dosya da yükleyebilirsin)..."
              rows={2}
              className={PIXEL_INPUT}
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
            <div className="flex gap-2">
              <button type="button" onClick={handleSubmit} disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} gap-2 px-3 py-1.5 text-sm`}>
                {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Cevapla'}
              </button>
              <button type="button" onClick={() => setIsAnswering(false)} disabled={isPending} className={`${PIXEL_BUTTON_SECONDARY} px-3 py-1.5 text-sm`}>
                Vazgeç
              </button>
            </div>
          </div>
        ) : (
          <button type="button" onClick={() => setIsAnswering(true)} className={`${PIXEL_BUTTON_PRIMARY} px-3 py-1.5 text-sm`}>
            Cevapla
          </button>
        )
      )}
    </div>
  )
}

function AttachmentPreview({ attachment, label }: { attachment: { filePath: string; fileType: 'image' | 'video' | 'pdf' }; label: string }) {
  const [url, setUrl] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false
    getQuestionAttachmentSignedUrl(attachment.filePath).then((signedUrl) => {
      if (!isCancelled) setUrl(signedUrl)
    })
    return () => { isCancelled = true }
  }, [attachment.filePath])

  if (!url) {
    return (
      <div className="flex items-center gap-2 text-xs font-semibold text-[#1B2430]/60">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        {label} yükleniyor...
      </div>
    )
  }

  if (attachment.fileType === 'image') {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        <img src={url} alt={label} className="h-32 w-auto rounded-lg border-2 border-[#1B2430] object-cover" />
      </a>
    )
  }

  if (attachment.fileType === 'video') {
    return <video src={url} controls className="h-40 w-auto rounded-lg border-2 border-[#1B2430]" />
  }

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-[#DD7B3A] underline">
      {label} (PDF) — görüntüle
    </a>
  )
}
