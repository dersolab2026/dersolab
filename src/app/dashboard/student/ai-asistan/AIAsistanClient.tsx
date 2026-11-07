'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY, PIXEL_BUTTON_SECONDARY, PIXEL_INPUT, PIXEL_BADGE } from '@/lib/theme'
import Link from 'next/link'
import {
  Camera,
  Image as ImageIcon,
  X,
  Sparkles,
  Copy,
  Check,
  Star,
  History,
  RotateCw,
  Trash2,
  BookMarked,
  ArrowRight,
  FlaskConical,
  GraduationCap,
  Brain,
  CheckCircle2,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  getMyAiQuestions,
  saveAiQuestion,
  toggleAiQuestionFavorite,
  deleteAiQuestion,
} from '@/actions/ai-questions'
import { getRecommendedLabForSubjectOrText } from '@/lib/exams/curriculum'
import type { SpacedQuizQuestion } from '@/app/api/ai/spaced-quiz/route'

const SUBJECTS = [
  'TYT Matematik',
  'TYT Türkçe',
  'TYT Fen Bilimleri',
  'TYT Sosyal Bilimler',
  'AYT Matematik',
  'AYT Fizik',
  'AYT Kimya',
  'AYT Biyoloji',
  'AYT Türk Dili ve Edebiyatı',
  'AYT Tarih',
  'AYT Coğrafya',
  'LGS Matematik',
  'LGS Türkçe',
  'LGS Fen Bilimleri',
  'LGS T.C. İnkılap Tarihi',
  'İngilizce',
]

const EXAMPLE_QUESTIONS: Record<string, string> = {
  'LGS Matematik': 'İki basamaklı bir sayının rakamları toplamı 11 ve basamaklar farkı 3\'tür. Bu sayıların çarpımı kaçtır?',
  'TYT Matematik': 'log₂(x+3) + log₂(x-1) = 3 denklemini sağlayan x değeri kaçtır?',
  'AYT Fizik': '2 kg kütleli bir cisim 5 m/s² ivmeyle düzgün ivmeli hareket yapıyor. Cisme etki eden net kuvvet kaç Newton\'dur?',
  'AYT Kimya': 'Saf suyun kaynama noktası neden 100°C\'dir? Bunu buhar basıncı kavramıyla açıklayın.',
  'TYT Türkçe': '"Gözlemlediği şeyleri hafızasında saklayıp uygun zamanda kullanan kişi" ifadesini tek bir kelimeyle ifade ediniz.',
}

interface SavedSolution {
  id: string
  timestamp: number
  subject: string
  question: string
  solution: string
  isFavorite?: boolean
}

const STORAGE_KEY = 'dersolab_ai_solutions_history'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function parseMarkdown(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-base font-black text-slate-200 mt-4 mb-2">$1</h2>')
    .replace(/^### (.*?)$/gm, '<h3 class="text-sm font-black text-slate-200 mt-3 mb-1">$1</h3>')
    .replace(/^(\d+\.) (.*?)$/gm, '<div class="flex gap-2 my-1.5"><span class="font-black text-[#DD7B3A] shrink-0">$1</span><span>$2</span></div>')
    .replace(/^→ (.*?)$/gm, '<div class="ml-6 my-1 px-3 py-1.5 rounded-lg bg-[#1B2430] text-[#F4F1E8] text-sm font-mono">→ $1</div>')
    .replace(/\n/g, '<br/>')
}

export function AIAsistanClient() {
  const [activeTab, setActiveTab] = useState<'solver' | 'history' | 'quiz'>('solver')
  const [subject, setSubject] = useState('TYT Matematik')
  const [question, setQuestion] = useState('')
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string | null>(null)
  const [solution, setSolution] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatingSimilar, setGeneratingSimilar] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  // Çözüm Geçmişi (Soru Defterim)
  const [history, setHistory] = useState<SavedSolution[]>([])

  // Aralıklı Tekrar Mini Sınavı (Spaced Repetition Quiz)
  const [quizQuestions, setQuizQuestions] = useState<SpacedQuizQuestion[]>([])
  const [quizLoading, setQuizLoading] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const solutionRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Çözülen soruya göre dinamik L.A.B. simülasyonu ve eğitmen önerisi
  const recommendedLab = useMemo(
    () => getRecommendedLabForSubjectOrText(subject, `${question} ${solution}`),
    [subject, question, solution],
  )

  // Yerel hafızadan ve buluttan (Supabase) geçmişi yükle
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setHistory(JSON.parse(stored))
      }
    } catch {
      // LocalStorage hatasını yut
    }

    getMyAiQuestions().then((remoteItems) => {
      if (remoteItems && remoteItems.length > 0) {
        setHistory((prev) => {
          const mergedMap = new Map<string, SavedSolution>()
          for (const item of remoteItems) {
            mergedMap.set(item.question, item)
          }
          for (const item of prev) {
            if (!mergedMap.has(item.question)) {
              mergedMap.set(item.question, item)
            }
          }
          const merged = Array.from(mergedMap.values())
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, 50)
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
          } catch {}
          return merged
        })
      }
    })
  }, [])

  // Geçmişi kaydet (hem yerel önbellek hem Supabase bulut)
  const saveToHistory = (newEntry: SavedSolution) => {
    setHistory((prev) => {
      const filtered = prev.filter((item) => item.question !== newEntry.question)
      const updated = [newEntry, ...filtered].slice(0, 50)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {}
      return updated
    })

    saveAiQuestion({
      subject: newEntry.subject,
      question: newEntry.question,
      solution: newEntry.solution,
    }).then((res) => {
      if (res.success && res.id) {
        setHistory((prev) => {
          const updated = prev.map((item) =>
            item.id === newEntry.id ? { ...item, id: res.id! } : item
          )
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
          } catch {}
          return updated
        })
      }
    })
  }

  const toggleFavorite = (id: string) => {
    let nextState = false
    setHistory((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          nextState = !item.isFavorite
          return { ...item, isFavorite: nextState }
        }
        return item
      })
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {}
      return updated
    })
    toggleAiQuestionFavorite(id, nextState)
  }

  const deleteFromHistory = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch {}
      toast.success('Soru defterinden silindi.')
      return updated
    })
    deleteAiQuestion(id)
  }

  function loadExample() {
    const ex = EXAMPLE_QUESTIONS[subject] ?? Object.values(EXAMPLE_QUESTIONS)[0]
    setQuestion(ex)
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  function processFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Lütfen yalnızca resim dosyası (JPG, PNG, WEBP) seçiniz.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Fotoğraf boyutu en fazla 5 MB olabilir.')
      return
    }
    setError('')
    const reader = new FileReader()
    reader.onload = (event) => {
      setImageBase64(event.target?.result as string)
      setImageName(file.name)
    }
    reader.readAsDataURL(file)
  }

  function handleRemoveImage() {
    setImageBase64(null)
    setImageName(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile()
        if (file) {
          processFile(file)
          break
        }
      }
    }
  }

  async function handleSolve(overrideQuestion?: string) {
    const targetQuestion = (overrideQuestion || question).trim()
    if (!targetQuestion && !imageBase64) {
      setError('Lütfen bir soru yazın veya soru fotoğrafı yükleyin.')
      return
    }
    setError('')
    setSolution('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: targetQuestion, subject, imageBase64 }),
      })

      const data = (await res.json()) as {
        solution?: string
        error?: string
      }

      if (!res.ok) {
        setError(data.error ?? 'Bir hata oluştu.')
        return
      }

      const sol = data.solution ?? ''
      setSolution(sol)

      // Geçmişe ekle
      saveToHistory({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        subject,
        question: targetQuestion,
        solution: sol,
      })

      // Çözüme kaydır
      setTimeout(() => {
        solutionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
      setGeneratingSimilar(false)
    }
  }

  // 🎯 Benzer Soru Üret (Pekiştirme)
  const handleGenerateSimilar = async () => {
    if (!solution) return
    setGeneratingSimilar(true)
    const prompt = `Az önce çözdüğün "${question || subject}" sorusunun mantığını ve kazanımını test eden, aynı konuda ve sınav zorluğunda ÖZGÜN YENİ BİR BENZER SORU YAZ ve adım adım numaralandırarak çözünüz.`
    setQuestion(prompt)
    handleRemoveImage()
    await handleSolve(prompt)
  }

  // 🧠 Aralıklı Tekrar Mini Sınavı Üret
  const handleGenerateSpacedQuiz = async () => {
    setQuizLoading(true)
    setQuizSubmitted(false)
    setQuizAnswers({})
    try {
      const recentQuestions = history.slice(0, 6).map((h) => ({
        subject: h.subject,
        question: h.question,
      }))
      const res = await fetch('/api/ai/spaced-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, recentQuestions }),
      })
      const data = await res.json()
      if (Array.isArray(data?.questions)) {
        setQuizQuestions(data.questions)
      }
    } catch {
      toast.error('Mini sınav oluşturulurken bir hata oluştu.')
    } finally {
      setQuizLoading(false)
    }
  }

  // Çözümü panoya kopyala
  const handleCopySolution = () => {
    if (!solution) return
    navigator.clipboard.writeText(solution)
    setCopied(true)
    toast.success('Çözüm panoya kopyalandı!')
    setTimeout(() => setCopied(false), 2000)
  }

  const charCount = question.length

  const quizCorrectCount = quizQuestions.reduce((acc, q) => {
    return acc + (quizAnswers[q.id] === q.correctIndex ? 1 : 0)
  }, 0)

  return (
    <DashboardPageShell
      title="AI Soru Asistanı & Soru Defterim"
      description="Google Gemini ile LGS ve YKS müfredatında adım adım çözüm asistanı, L.A.B. simülasyon köprüsü ve aralıklı tekrar sınavı"
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Üst Sekmeler */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('solver')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'solver'
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Soru Çöz
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'history'
                  ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <History className="w-4 h-4" />
              Soru Defterim
              {history.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] bg-white/20 text-white">
                  {history.length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab('quiz')
                if (quizQuestions.length === 0 && !quizLoading) {
                  handleGenerateSpacedQuiz()
                }
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                activeTab === 'quiz'
                  ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.35)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Brain className="w-4 h-4" />
              Mini Tekrar Testi
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Gemini 3.8 Flash Aktif
          </div>
        </div>

        {activeTab === 'solver' ? (
          <>
            {/* Soru formu */}
            <div className={`${PIXEL_CARD} p-6 space-y-4`}>
              {/* Branş seçimi */}
              <div>
                <label className="block text-sm font-black text-slate-200 mb-2">Branş Seç</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className={PIXEL_INPUT}
                >
                  {SUBJECTS.map((s) => (
                    <option key={s} value={s} className="bg-slate-900 text-slate-200">
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Soru girişi */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-black text-slate-200">Sorun</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold text-slate-200 hover:text-[#DD7B3A] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Fotoğraf Yükle</span>
                    </button>
                    <button
                      type="button"
                      onClick={loadExample}
                      className="text-xs font-bold text-[#DD7B3A] underline underline-offset-2 hover:opacity-70 transition-opacity"
                    >
                      Örnek soru
                    </button>
                  </div>
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />

                <textarea
                  ref={textareaRef}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onPaste={handlePaste}
                  placeholder="Sorunuzu buraya yazın veya fotoğrafını ekleyin... (Pano görselini Ctrl+V ile yapıştırabilirsiniz)"
                  rows={4}
                  maxLength={2000}
                  className={`${PIXEL_INPUT} resize-none`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) handleSolve()
                  }}
                />

                {/* Uploaded Image Preview */}
                {imageBase64 && (
                  <div className="mt-3 p-3 rounded-xl border border-white/5 bg-black/40 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageBase64}
                        alt="Soru görseli"
                        className="w-14 h-14 object-cover rounded-lg border border-white/5 bg-white shrink-0"
                      />
                      <div className="text-xs truncate">
                        <p className="font-bold text-slate-200 truncate">{imageName ?? 'Soru Fotoğrafı'}</p>
                        <p className="text-[11px] text-slate-400">Görsel eklendi (Gemini analiz edecek)</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 rounded-lg border border-white/5 bg-white hover:bg-red-50 text-red-600 transition-colors shrink-0"
                      title="Fotoğrafı kaldır"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-200/60 mt-1 font-semibold">
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-3.5 h-3.5" />
                    Fotoğraf desteği: JPG, PNG, WEBP (Max 5MB)
                  </span>
                  <span>{charCount}/2000 · Ctrl+Enter</span>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 rounded-xl border-2 border-red-400 bg-red-500/10 text-red-400 text-sm font-bold">
                  {error}
                </div>
              )}

              {/* CTA */}
              <button
                type="button"
                onClick={() => handleSolve()}
                disabled={loading || (!question.trim() && !imageBase64)}
                className={`${PIXEL_BUTTON_PRIMARY} w-full py-3.5 text-base cursor-pointer`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 animate-spin text-slate-950" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <span>Gemini soruyu adım adım çözüyor...</span>
                  </span>
                ) : (
                  'Gemini ile Adım Adım Çöz'
                )}
              </button>
            </div>

            {/* Çözüm Kartı */}
            {solution && (
              <div ref={solutionRef} className={`${PIXEL_CARD} p-6 relative space-y-6`}>
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">✨</span>
                    <h2 className="font-black text-slate-200 text-base">Adım Adım Çözüm</h2>
                    <span className={`${PIXEL_BADGE} text-[10px]`}>ÖSYM & MEB Müfredatı</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopySolution}
                      title="Çözümü Kopyala"
                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div
                  className="text-slate-200 text-sm leading-relaxed font-medium space-y-1 prose-sm"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(solution) }}
                />

                {/* 🔬 L.A.B. Simülasyon & Birebir Eğitmen Köprüsü */}
                <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 p-4 sm:p-5 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-cyan-400 text-slate-950 font-black text-[10px] tracking-wider">
                        L.A.B. KÖPRÜSÜ
                      </span>
                      <span className="text-xs font-bold text-cyan-300">
                        {recommendedLab.badge}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-slate-400">
                      Ezberleme, Simüle Ederek Öğren
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm sm:text-base font-black text-white">
                      {recommendedLab.moduleTitle}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {recommendedLab.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 pt-1">
                    <Link
                      href={recommendedLab.href}
                      className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(34,211,238,0.25)]"
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>{recommendedLab.branchName} Simülasyonunda Dene →</span>
                    </Link>

                    <Link
                      href="/demo-ders"
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                      <span>20 Dk Ücretsiz Tanışma Dersinde Hocaya Sor</span>
                    </Link>
                  </div>
                </div>

                {/* Gelişmiş Aksiyonlar */}
                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleGenerateSimilar}
                      disabled={loading || generatingSimilar}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all active:scale-95 disabled:opacity-50"
                    >
                      <RotateCw className={`w-4 h-4 ${generatingSimilar ? 'animate-spin' : ''}`} />
                      🎯 Benzer Bir Soru Üret (Pekiştir)
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSolution('')
                        setQuestion('')
                        handleRemoveImage()
                      }}
                      className={`${PIXEL_BUTTON_SECONDARY} px-4 py-2 text-xs sm:text-sm`}
                    >
                      Yeni Soru
                    </button>
                  </div>

                  <Link
                    href="/instructors"
                    className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
                  >
                    <span>Onaylı {recommendedLab.marketplaceSubject} Eğitmenlerini Gör</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : activeTab === 'history' ? (
          /* Soru Defterim (Çözüm Geçmişi) */
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-3xl border border-white/10 bg-white/[0.02]">
                <BookMarked className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-300">Henüz soru defterinde kayıt yok</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                  Çözdürdüğün tüm sorular otomatik olarak burada birikir; sınavdan önce tekrar etmek için geri dönebilirsin.
                </p>
                <button
                  onClick={() => setActiveTab('solver')}
                  className="mt-4 px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  İlk Sorunu Çöz
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 px-1 font-semibold">
                  <span>Kaydedilen {history.length} soru (Son çözümlerin en üsttedir)</span>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab('quiz')
                      handleGenerateSpacedQuiz()
                    }}
                    className="px-3 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    <Brain className="w-3.5 h-3.5" />
                    <span>Defterimden Mini Test Oluştur</span>
                  </button>
                </div>

                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-2xl border border-white/10 bg-[#0E131F] hover:border-white/20 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/5 text-amber-400 border border-amber-400/20">
                        {item.subject}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFavorite(item.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            item.isFavorite
                              ? 'text-amber-400 bg-amber-400/10'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title="Yıldızla"
                        >
                          <Star className="w-4 h-4 fill-current" />
                        </button>
                        <button
                          onClick={() => deleteFromHistory(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="text-sm font-bold text-white line-clamp-2">
                      {item.question}
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                      <span className="text-slate-500">
                        {new Date(item.timestamp).toLocaleDateString('tr-TR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>

                      <button
                        onClick={() => {
                          setSubject(item.subject)
                          setQuestion(item.question)
                          setSolution(item.solution)
                          setActiveTab('solver')
                          setTimeout(() => {
                            solutionRef.current?.scrollIntoView({ behavior: 'smooth' })
                          }, 100)
                        }}
                        className="font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                      >
                        Çözümü Gör <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Aralıklı Tekrar (Spaced Repetition) Mini Test Modülü */
          <div className="space-y-4">
            <div className={`${PIXEL_CARD} p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4`}>
              <div>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-violet-400" />
                  <h2 className="font-black text-white text-base">
                    Aralıklı Tekrar (Unutma Eğrisi) Mini Sınavı
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Soru defterinde biriken veya seçtiğin branştaki kazanımları kalıcı hafızaya aktarmak için 3 özgün soruyla kendini sına.
                </p>
              </div>
              <button
                type="button"
                onClick={handleGenerateSpacedQuiz}
                disabled={quizLoading}
                className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-black text-xs flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <RotateCw className={`w-4 h-4 ${quizLoading ? 'animate-spin' : ''}`} />
                <span>{quizLoading ? 'Sorular Hazırlanıyor...' : 'Yeni Mini Test Üret'}</span>
              </button>
            </div>

            {quizLoading ? (
              <div className="p-12 rounded-2xl border border-white/10 bg-[#0E131F] text-center space-y-3">
                <RotateCw className="w-8 h-8 text-violet-400 animate-spin mx-auto" />
                <p className="text-sm font-bold text-white">
                  Gemini Soru Defterindeki Kazanımları Analiz Ediyor...
                </p>
                <p className="text-xs text-slate-400">
                  Sana özel 3 soruluk pekiştirme testi hazırlanıyor.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {quizQuestions.map((q, qIdx) => {
                  const selected = quizAnswers[q.id]
                  return (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl border border-white/10 bg-[#0E131F] space-y-4"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold">
                          Soru {qIdx + 1} · {q.subject} ({q.topic})
                        </span>
                        {quizSubmitted && (
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-black ${
                              selected === q.correctIndex ? 'text-emerald-400' : 'text-red-400'
                            }`}
                          >
                            {selected === q.correctIndex ? (
                              <>
                                <CheckCircle2 className="w-4 h-4" /> Doğru
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4" /> Yanlış / Boş
                              </>
                            )}
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-bold text-slate-100 leading-relaxed">
                        {q.questionText}
                      </p>

                      <div className="grid gap-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selected === optIdx
                          const isCorrect = q.correctIndex === optIdx
                          let btnStyle =
                            'border-white/10 bg-white/[0.03] text-slate-200 hover:bg-white/10'
                          if (quizSubmitted) {
                            if (isCorrect) {
                              btnStyle =
                                'border-emerald-500/60 bg-emerald-500/20 text-emerald-200 font-black'
                            } else if (isSelected && !isCorrect) {
                              btnStyle = 'border-red-500/60 bg-red-500/20 text-red-200'
                            }
                          } else if (isSelected) {
                            btnStyle =
                              'border-violet-500 bg-violet-600/25 text-white font-black'
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              disabled={quizSubmitted}
                              onClick={() =>
                                setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))
                              }
                              className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm transition-all ${btnStyle}`}
                            >
                              {opt}
                            </button>
                          )
                        })}
                      </div>

                      {quizSubmitted && (
                        <div className="p-3.5 rounded-xl bg-slate-950 border border-white/10 text-xs text-slate-300 leading-relaxed">
                          <span className="font-black text-emerald-400 block mb-1">
                            💡 Çözüm Açıklaması:
                          </span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  )
                })}

                {quizQuestions.length > 0 && (
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    {!quizSubmitted ? (
                      <button
                        type="button"
                        onClick={() => setQuizSubmitted(true)}
                        className={`${PIXEL_BUTTON_PRIMARY} px-6 py-3 text-sm cursor-pointer`}
                      >
                        Testi Bitir ve Sonuçları Kontrol Et
                      </button>
                    ) : (
                      <div className="flex flex-wrap items-center justify-between w-full gap-3 p-4 rounded-2xl border border-emerald-500/30 bg-emerald-950/20">
                        <div>
                          <p className="text-sm font-black text-white">
                            Sonuç: {quizCorrectCount} / {quizQuestions.length} Doğru!
                          </p>
                          <p className="text-xs text-slate-300">
                            {quizCorrectCount === quizQuestions.length
                              ? 'Harika! Bu kazanımları tam olarak pekiştirmişsin.'
                              : 'Kaçırdığın soruların açıklamalarını inceleyip L.A.B. simülasyonunda tekrar yapabilirsin.'}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleGenerateSpacedQuiz}
                          className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs"
                        >
                          Yeni 3 Soru Getir →
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardPageShell>
  )
}
