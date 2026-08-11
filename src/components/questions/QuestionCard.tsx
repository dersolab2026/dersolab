'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { getQuestionAttachmentSignedUrl } from '@/lib/storage/upload-question-attachment'
import type { QuestionListItem } from '@/lib/questions/get-questions-list'
import { PIXEL_CARD, PIXEL_BADGE, PIXEL_BADGE_ACTIVE } from '@/lib/theme'

interface QuestionCardProps {
  question: QuestionListItem
}

export function QuestionCard({ question }: QuestionCardProps) {
  return (
    <div className={`${PIXEL_CARD} p-5 space-y-2`}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-bold text-[#1B2430]">
          {question.instructorName || question.subject || 'Genel'}
        </p>
        <span className={question.status === 'answered' ? PIXEL_BADGE_ACTIVE : PIXEL_BADGE}>
          {question.status === 'answered' ? 'Cevaplandı' : 'Havuzda bekliyor'}
        </span>
      </div>

      <p className="text-sm font-semibold text-[#1B2430]">{question.questionText}</p>
      {question.questionAttachment && <AttachmentPreview attachment={question.questionAttachment} label="Eklediğin dosya" />}

      {question.answerText && (
        <p className="text-sm font-semibold text-[#1B2430]/70">
          <span className="text-[#6FA89E]">Cevap:</span> {question.answerText}
        </p>
      )}
      {question.answerAttachment && <AttachmentPreview attachment={question.answerAttachment} label="Eğitmenin dosyası" />}
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
