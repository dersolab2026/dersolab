'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { addExamResult, deleteExamResult, type ExamResultEntry } from '@/actions/exam-results'
import { useToast } from '@/components/ui/Toast'
import {
  EXAM_TYPES, EXAM_TYPE_LABELS, calculateNet, estimateScore,
  estimatePlacementScore, supportsObp, type ExamType,
} from '@/lib/exams/scoring'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY, PIXEL_BUTTON_SECONDARY, PIXEL_INPUT } from '@/lib/theme'

interface ExamResultsSectionProps {
  entries: ExamResultEntry[]
}

export function ExamResultsSection({ entries }: ExamResultsSectionProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [examName, setExamName] = useState('')
  const [examType, setExamType] = useState<ExamType>('tyt')
  const [examDate, setExamDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [correct, setCorrect] = useState('')
  const [wrong, setWrong] = useState('')
  const [obp, setObp] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Form doldurulurken net ve tahmini puan anlik gorunsun.
  const onizlemeNet = correct !== '' || wrong !== ''
    ? calculateNet(examType, Number(correct) || 0, Number(wrong) || 0)
    : null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!examName.trim()) { setError('Deneme adı girmelisin'); return }

    startTransition(async () => {
      const result = await addExamResult({
        examName,
        examType,
        examDate,
        correctCount: Number(correct) || 0,
        wrongCount: Number(wrong) || 0,
        obp: obp === '' ? null : Number(obp),
      })
      if (!result.success) { setError(result.error); return }
      setExamName(''); setCorrect(''); setWrong(''); setObp(''); setIsOpen(false)
      showToast('Deneme sonucun kaydedildi.')
      router.refresh()
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteExamResult(id)
      showToast('Deneme kaydı silindi.')
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      {!isOpen ? (
        <button type="button" onClick={() => setIsOpen(true)} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2`}>
          + Deneme Ekle
        </button>
      ) : (
        <form onSubmit={handleSubmit} className={`${PIXEL_CARD} p-5 space-y-3`}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-[#1B2430] mb-1">Deneme Adı</label>
              <input
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="Örn: 3D Yayınları TYT Deneme 5"
                className={PIXEL_INPUT}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1B2430] mb-1">Deneme Türü</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value as ExamType)}
                className={PIXEL_INPUT}
              >
                {EXAM_TYPES.map((t) => (
                  <option key={t} value={t}>{EXAM_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[#1B2430] mb-1">Tarih</label>
              <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className={PIXEL_INPUT} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-bold text-[#1B2430] mb-1">Doğru</label>
                <input type="number" min={0} value={correct} onChange={(e) => setCorrect(e.target.value)} className={PIXEL_INPUT} />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1B2430] mb-1">Yanlış</label>
                <input type="number" min={0} value={wrong} onChange={(e) => setWrong(e.target.value)} className={PIXEL_INPUT} />
              </div>
            </div>
            {supportsObp(examType) && (
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-[#1B2430] mb-1">
                  OBP <span className="font-semibold text-[#1B2430]/60">(isteğe bağlı — girersen yerleştirme puanı da hesaplanır)</span>
                </label>
                <input
                  type="number" min={100} max={500} step="0.01"
                  value={obp} onChange={(e) => setObp(e.target.value)}
                  placeholder="100 – 500"
                  className={PIXEL_INPUT}
                />
              </div>
            )}
          </div>

          {onizlemeNet !== null && (
            <p className="text-sm font-bold text-[#6FA89E]">
              Net: {onizlemeNet}
              {' · '}Tahmini puan: {estimateScore(examType, onizlemeNet)}
              {obp !== '' && supportsObp(examType) &&
                ` · Tahmini yerleştirme: ${estimatePlacementScore(examType, onizlemeNet, Number(obp))}`}
            </p>
          )}

          {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

          <div className="flex gap-2">
            <button type="submit" disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm`}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kaydet'}
            </button>
            <button type="button" onClick={() => { setIsOpen(false); setError(null) }} className={`${PIXEL_BUTTON_SECONDARY} px-4 py-2 text-sm`}>
              Vazgeç
            </button>
          </div>
        </form>
      )}

      {entries.length === 0 ? (
        <p className="font-semibold text-[#1B2430]/70">
          Henüz deneme eklemedin. Denemelerini buraya girdikçe netlerinin nasıl değiştiğini göreceksin.
        </p>
      ) : (
        <div className="space-y-3">
          {entries.map((e) => {
            const net = calculateNet(e.examType, e.correctCount, e.wrongCount)
            const yerlestirme = estimatePlacementScore(e.examType, net, e.obp)
            return (
              <div key={e.id} className={`${PIXEL_CARD} p-4 flex flex-wrap items-center justify-between gap-3`}>
                <div className="min-w-0">
                  <p className="font-bold text-[#1B2430]">
                    {e.examName}
                    <span className="ml-2 inline-block px-2 py-0.5 rounded-lg border-2 border-[#1B2430] bg-white text-xs">
                      {EXAM_TYPE_LABELS[e.examType]}
                    </span>
                  </p>
                  <p className="text-sm font-semibold text-[#1B2430]/70">
                    {new Date(e.examDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {' · '}{e.correctCount} doğru · {e.wrongCount} yanlış
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#6FA89E]">
                    Net: {net} · Tahmini puan: {estimateScore(e.examType, net)}
                    {yerlestirme !== null && ` · Tahmini yerleştirme: ${yerlestirme}`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(e.id)}
                  aria-label="Denemeyi sil"
                  className="shrink-0 text-[#1B2430]/40 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
