'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { addStudyLogEntry, deleteStudyLogEntry, type StudyLogEntry } from '@/actions/study-log'
import { useToast } from '@/components/ui/Toast'
import { LESSON_SUBJECTS } from '@/lib/constants'
import { PIXEL_BUTTON_PRIMARY, PIXEL_BUTTON_SECONDARY } from '@/lib/theme'

interface StudyLogSectionProps {
  logDate: string
  entries: StudyLogEntry[]
}

export function StudyLogSection({ logDate, entries }: StudyLogSectionProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [subject, setSubject] = useState('')
  const [topic, setTopic] = useState('')
  const [hours, setHours] = useState('')
  const [questionsSolved, setQuestionsSolved] = useState('')
  const [source, setSource] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!subject) { setError('Ders seçmelisin'); return }

    startTransition(async () => {
      const result = await addStudyLogEntry({
        logDate,
        subject,
        topic: topic || undefined,
        hours: hours ? Number(hours) : undefined,
        questionsSolved: questionsSolved ? Number(questionsSolved) : undefined,
        source: source || undefined,
      })
      if (!result.success) { setError(result.error); return }
      setSubject('')
      setTopic('')
      setHours('')
      setQuestionsSolved('')
      setSource('')
      setIsOpen(false)
      showToast('Çalışman günlüğüne eklendi.')
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteStudyLogEntry(id)
      showToast('Kayıt silindi.')
      router.refresh()
    })
  }

  return (
    <div className="pt-2 border-t border-white/10 space-y-2">
      <div className="flex items-center justify-between">
        <p className="font-bold text-slate-200">Çalışma Notlarım</p>
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className={`${PIXEL_BUTTON_SECONDARY} px-3 py-1 text-xs`}
        >
          {isOpen ? 'Vazgeç' : '+ Not Ekle'}
        </button>
      </div>

      {entries.length === 0 && !isOpen && (
        <p className="text-sm font-semibold text-slate-400">Bu gün için henüz bir çalışma notu yok.</p>
      )}

      {entries.length > 0 && (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-start justify-between gap-2 rounded-lg bg-[#DD7B3A]/10 border-2 border-[#DD7B3A] px-3 py-2">
              <div className="text-sm text-slate-200">
                <p className="font-bold">
                  {entry.subject}
                  {entry.topic && <span className="font-semibold"> · {entry.topic}</span>}
                </p>
                <p className="font-semibold text-slate-400">
                  {[
                    entry.hours ? `${entry.hours} saat çalıştım` : null,
                    entry.questionsSolved ? `${entry.questionsSolved} soru çözdüm` : null,
                    entry.source ? `(${entry.source})` : null,
                  ].filter(Boolean).join(' · ') || 'Not eklendi'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(entry.id)}
                disabled={isPending}
                className="text-slate-500 hover:text-red-600 shrink-0"
                aria-label="Notu sil"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl bg-white/5 border border-white/10 p-4 mt-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Ders</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-white/10 bg-black/20 text-slate-200 text-sm outline-none focus:border-[#DD7B3A]/50 transition-colors"
            >
              <option value="" disabled className="bg-slate-900 text-slate-200">Seç</option>
              {LESSON_SUBJECTS.map((s) => (
                <option key={s} value={s} className="bg-slate-900 text-slate-200">{s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Konu (isteğe bağlı)</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="ör. Türev"
              className="w-full p-2.5 rounded-lg border border-white/10 bg-black/20 text-slate-200 placeholder:text-slate-500 text-sm outline-none focus:border-[#DD7B3A]/50 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Kaç Saat Çalıştım</label>
              <input
                type="number" min="0" step="0.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                placeholder="ör. 2"
                className="w-full p-2.5 rounded-lg border border-white/10 bg-black/20 text-slate-200 placeholder:text-slate-500 text-sm outline-none focus:border-[#DD7B3A]/50 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">Kaç Soru Çözdüm</label>
              <input
                type="number" min="0"
                value={questionsSolved}
                onChange={(e) => setQuestionsSolved(e.target.value)}
                placeholder="ör. 50"
                className="w-full p-2.5 rounded-lg border border-white/10 bg-black/20 text-slate-200 placeholder:text-slate-500 text-sm outline-none focus:border-[#DD7B3A]/50 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Kaynak (isteğe bağlı)</label>
            <input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="ör. 3D Yayınları TYT Matematik"
              className="w-full p-2.5 rounded-lg border border-white/10 bg-black/20 text-slate-200 placeholder:text-slate-500 text-sm outline-none focus:border-[#DD7B3A]/50 transition-colors"
            />
          </div>

          {error && <p className="text-xs font-bold text-red-500">{error}</p>}

          <button type="submit" disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2.5 text-sm w-full mt-2 font-bold`}>
            {isPending ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
      )}
    </div>
  )
}
