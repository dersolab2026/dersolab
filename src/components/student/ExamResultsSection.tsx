'use client'

import { useState, useMemo, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2, ChevronDown, ChevronUp } from 'lucide-react'
import { addExamResult, deleteExamResult, type ExamResultEntry } from '@/actions/exam-results'
import { useToast } from '@/components/ui/Toast'
import { ErrorTypeEditor } from '@/components/student/ErrorTypeEditor'
import { ExamReflection } from '@/components/student/ExamReflection'
import { DENEME_YAYINLARI, DIGER_YAYIN, ZORLUK_SECENEKLERI, ZORLUK_ETIKET, ZORLUK_RENK, zorlukUyarisi, type Zorluk } from '@/lib/exams/publishers'
import {
  EXAM_TYPES, EXAM_TYPE_LABELS, calculateNet, calculateTotalNet,
  estimateScore, estimatePlacementScore, supportsObp, type ExamType,
} from '@/lib/exams/scoring'
import {
  getExamSections, getTotalQuestions, requiresTrack, TRACK_LABELS, type ExamTrack,
} from '@/lib/exams/structure'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY, PIXEL_BUTTON_SECONDARY, PIXEL_INPUT } from '@/lib/theme'

interface ExamResultsSectionProps {
  entries: ExamResultEntry[]
}

type SayiGirisi = { dogru: string; yanlis: string }

export function ExamResultsSection({ entries }: ExamResultsSectionProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [examName, setExamName] = useState('')
  const [examType, setExamType] = useState<ExamType>('tyt')
  const [track, setTrack] = useState<ExamTrack>('sayisal')
  const [examDate, setExamDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [obp, setObp] = useState('')
  const [yayin, setYayin] = useState('')
  const [zorluk, setZorluk] = useState<Zorluk | ''>('')
  const [sure, setSure] = useState('')
  const [girisler, setGirisler] = useState<Record<string, SayiGirisi>>({})
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [acikKayit, setAcikKayit] = useState<string | null>(null)

  const dersler = useMemo(
    () => getExamSections(examType, requiresTrack(examType) ? track : null),
    [examType, track],
  )

  const bolumler = dersler.map((d) => ({
    name: d.name,
    questionCount: d.questionCount,
    correct: Number(girisler[d.name]?.dogru) || 0,
    wrong: Number(girisler[d.name]?.yanlis) || 0,
  }))

  const toplamNet = calculateTotalNet(examType, bolumler)
  const aktifTrack = requiresTrack(examType) ? track : null
  const birSeyGirildi = bolumler.some((b) => b.correct > 0 || b.wrong > 0)

  function setGiris(ders: string, alan: 'dogru' | 'yanlis', deger: string) {
    setGirisler((p) => {
      const mevcut = p[ders] ?? { dogru: '', yanlis: '' }
      return { ...p, [ders]: { ...mevcut, [alan]: deger } }
    })
  }

  function turDegisti(yeni: ExamType) {
    setExamType(yeni)
    setGirisler({})   // ders listesi degisiyor, girilenler artik gecersiz
    setError(null)
  }

  function alanDegisti(yeni: ExamTrack) {
    setTrack(yeni)
    setGirisler({})
    setError(null)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!examName.trim()) { setError('Deneme adı girmelisin'); return }

    const asan = bolumler.find((b) => b.correct + b.wrong > b.questionCount)
    if (asan) {
      setError(`${asan.name}: doğru + yanlış toplamı ${asan.questionCount} soruyu aşamaz`)
      return
    }

    startTransition(async () => {
      const result = await addExamResult({
        examName, examType, examDate, track: aktifTrack,
        sections: bolumler.map((b) => ({ name: b.name, correctCount: b.correct, wrongCount: b.wrong })),
        obp: obp === '' ? null : Number(obp),
        publisher: yayin || null,
        difficulty: zorluk || null,
        durationMinutes: sure ? Number(sure) : null,
      })
      if (!result.success) { setError(result.error); return }
      setExamName(''); setObp(''); setGirisler({}); setIsOpen(false)
      setYayin(''); setZorluk(''); setSure('')
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
        <form onSubmit={handleSubmit} className={`${PIXEL_CARD} p-5 space-y-4`}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-bold text-[var(--yazi)] mb-1">Deneme Adı</label>
              <input
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="Örn: 3D Yayınları TYT Deneme 5"
                className={PIXEL_INPUT}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--yazi)] mb-1">Deneme Türü</label>
              <select value={examType} onChange={(e) => turDegisti(e.target.value as ExamType)} className={PIXEL_INPUT}>
                {EXAM_TYPES.map((t) => <option key={t} value={t}>{EXAM_TYPE_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--yazi)] mb-1">Tarih</label>
              <input type="date" value={examDate} onChange={(e) => setExamDate(e.target.value)} className={PIXEL_INPUT} />
            </div>
            {requiresTrack(examType) && (
              <div>
                <label className="block text-sm font-bold text-[var(--yazi)] mb-1">Alan</label>
                <select value={track} onChange={(e) => alanDegisti(e.target.value as ExamTrack)} className={PIXEL_INPUT}>
                  {(Object.keys(TRACK_LABELS) as ExamTrack[]).map((t) => (
                    <option key={t} value={t}>{TRACK_LABELS[t]}</option>
                  ))}
                </select>
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-[var(--yazi)] mb-1">Yayın</label>
              <select value={yayin} onChange={(e) => setYayin(e.target.value)} className={PIXEL_INPUT}>
                <option value="">Belirtme</option>
                {DENEME_YAYINLARI.map((y) => <option key={y} value={y}>{y}</option>)}
                <option value={DIGER_YAYIN}>{DIGER_YAYIN}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-[var(--yazi)] mb-1">Süre (dakika)</label>
              <input type="number" min={1} max={600} value={sure} onChange={(e) => setSure(e.target.value)}
                placeholder="Kaç dakikada bitirdin?" className={PIXEL_INPUT} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[var(--yazi)] mb-1">Deneme sana nasıl geldi?</label>
            <div className="flex flex-wrap gap-2">
              {ZORLUK_SECENEKLERI.map((z) => (
                <button key={z.deger} type="button"
                  onClick={() => setZorluk(zorluk === z.deger ? '' : z.deger)}
                  aria-pressed={zorluk === z.deger}
                  className={`rounded-lg border-4 border-[var(--cizgi)] px-3 py-1.5 text-sm font-bold transition-all ${
                    zorluk === z.deger ? 'bg-[var(--vurgu)] text-[var(--yazi-ters)]' : 'bg-[var(--yuzey-ic)] text-[var(--yazi)]'
                  }`}>
                  {z.etiket}
                </button>
              ))}
            </div>
            <p className="mt-1 text-xs font-semibold text-[var(--yazi)]/50">
              Zorluğu kaydedersen, farklı zorlukta denemeleri karşılaştırırken uyarı gösterilir.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-bold text-[var(--yazi)]">
              Ders Ders Doğru / Yanlış
              <span className="ml-2 font-semibold text-[var(--yazi)]/60">
                toplam {getTotalQuestions(examType, aktifTrack)} soru
              </span>
            </p>
            <div className="space-y-2">
              {dersler.map((d) => {
                const g = girisler[d.name] ?? { dogru: '', yanlis: '' }
                const dogru = Number(g.dogru) || 0
                const yanlis = Number(g.yanlis) || 0
                const asiyor = dogru + yanlis > d.questionCount
                const net = calculateNet(examType, dogru, yanlis)
                return (
                  <div key={d.name} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2">
                    <span className="min-w-0 truncate text-sm font-bold text-[var(--yazi)]" title={d.name}>
                      {d.name}
                      <span className="ml-1 font-semibold text-[var(--yazi)]/50">({d.questionCount})</span>
                    </span>
                    <input
                      type="number" min={0} max={d.questionCount} placeholder="D"
                      value={g.dogru} onChange={(e) => setGiris(d.name, 'dogru', e.target.value)}
                      aria-label={`${d.name} doğru`}
                      className={`w-16 p-2 rounded-lg border-2 bg-[var(--yuzey-ic)] text-sm text-center outline-none focus:ring-2 focus:ring-[var(--ikincil-yazi)]/50 ${asiyor ? 'border-[var(--tehlike)]' : 'border-[var(--cizgi)]'}`}
                    />
                    <input
                      type="number" min={0} max={d.questionCount} placeholder="Y"
                      value={g.yanlis} onChange={(e) => setGiris(d.name, 'yanlis', e.target.value)}
                      aria-label={`${d.name} yanlış`}
                      className={`w-16 p-2 rounded-lg border-2 bg-[var(--yuzey-ic)] text-sm text-center outline-none focus:ring-2 focus:ring-[var(--ikincil-yazi)]/50 ${asiyor ? 'border-[var(--tehlike)]' : 'border-[var(--cizgi)]'}`}
                    />
                    <span className="w-16 text-right text-sm font-bold text-[var(--ikincil-yazi)]">
                      {dogru || yanlis ? net : '—'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {supportsObp(examType) && (
            <div>
              <label className="block text-sm font-bold text-[var(--yazi)] mb-1">
                OBP <span className="font-semibold text-[var(--yazi)]/60">(isteğe bağlı — girersen yerleştirme puanı da hesaplanır)</span>
              </label>
              <input
                type="number" min={100} max={500} step="0.01"
                value={obp} onChange={(e) => setObp(e.target.value)}
                placeholder="100 – 500" className={PIXEL_INPUT}
              />
            </div>
          )}

          {birSeyGirildi && (
            <p className="text-sm font-bold text-[var(--ikincil-yazi)]">
              Toplam net: {toplamNet}
              {' · '}Tahmini puan: {estimateScore(examType, toplamNet, aktifTrack)}
              {obp !== '' && supportsObp(examType) &&
                ` · Tahmini yerleştirme: ${estimatePlacementScore(examType, toplamNet, Number(obp), aktifTrack)}`}
            </p>
          )}

          {error && <p className="text-sm font-semibold text-[var(--tehlike)]">{error}</p>}

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
        <p className="font-semibold text-[var(--yazi)]/70">
          Henüz deneme eklemedin. Denemelerini buraya girdikçe netlerinin nasıl değiştiğini göreceksin.
        </p>
      ) : (
        <div className="space-y-3">
          {entries.map((e) => {
            const bolumSkorlari = e.sections.map((s) => ({ name: s.name, correct: s.correctCount, wrong: s.wrongCount }))
            const net = calculateTotalNet(e.examType, bolumSkorlari)
            const yerlestirme = estimatePlacementScore(e.examType, net, e.obp, e.track)
            const acik = acikKayit === e.id
            return (
              <div key={e.id} className={`${PIXEL_CARD} p-4 space-y-2`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-[var(--yazi)]">
                      {e.examName}
                      <span className="ml-2 inline-block px-2 py-0.5 rounded-lg border-2 border-[var(--cizgi)] bg-[var(--yuzey-ic)] text-xs">
                        {EXAM_TYPE_LABELS[e.examType]}{e.track ? ` · ${TRACK_LABELS[e.track]}` : ''}
                      </span>
                    </p>
                    <p className="text-sm font-semibold text-[var(--yazi)]/70">
                      {new Date(e.examDate).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      {' · '}{e.correctCount} doğru · {e.wrongCount} yanlış
                      {e.publisher && ` · ${e.publisher}`}
                      {e.durationMinutes && ` · ${e.durationMinutes} dk`}
                      {e.difficulty && (
                        <span className="ml-2 inline-block rounded border-2 border-[var(--cizgi)] px-1.5 text-xs font-bold text-[var(--yazi)]"
                          style={{ backgroundColor: ZORLUK_RENK[e.difficulty] }}>
                          {ZORLUK_ETIKET[e.difficulty]}
                        </span>
                      )}
                    </p>
                    <p className="mt-1 text-sm font-bold text-[var(--ikincil-yazi)]">
                      Toplam net: {net} · Tahmini puan: {estimateScore(e.examType, net, e.track)}
                      {yerlestirme !== null && ` · Tahmini yerleştirme: ${yerlestirme}`}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {e.sections.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setAcikKayit(acik ? null : e.id)}
                        aria-label={acik ? 'Ders detayını gizle' : 'Ders detayını göster'}
                        className="text-[var(--yazi)]/60 hover:text-[var(--yazi)]"
                      >
                        {acik ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    )}
                    <button
                      type="button" onClick={() => handleDelete(e.id)}
                      aria-label="Denemeyi sil" className="text-[var(--yazi)]/40 hover:text-[var(--tehlike)]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {acik && e.sections.length > 0 && (
                  <div className="space-y-3 border-t-2 border-[var(--cizgi)]/10 pt-2">
                    <ul className="space-y-1">
                      {e.sections.map((s) => (
                        <li key={s.name} className="flex items-center justify-between gap-2 text-sm">
                          <span className="font-semibold text-[var(--yazi)]">{s.name}</span>
                          <span className="font-semibold text-[var(--yazi)]/70">
                            {s.correctCount}D · {s.wrongCount}Y
                            <strong className="ml-2 text-[var(--ikincil-yazi)]">
                              {calculateNet(e.examType, s.correctCount, s.wrongCount)} net
                            </strong>
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="rounded-xl border-2 border-[var(--cizgi)] bg-[var(--yuzey-ic)] p-3">
                      <ErrorTypeEditor entry={e} />
                    </div>

                    <div className="rounded-xl border-2 border-[var(--cizgi)] bg-[var(--yuzey-ic)] p-3">
                      <ExamReflection entry={e} />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
