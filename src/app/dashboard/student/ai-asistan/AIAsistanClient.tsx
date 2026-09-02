'use client'

import { useState, useRef, useEffect } from 'react'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY, PIXEL_BUTTON_SECONDARY, PIXEL_INPUT, PIXEL_BADGE } from '@/lib/theme'
import Link from 'next/link'
import { Camera, Image as ImageIcon, X, Sparkles } from 'lucide-react'

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

function parseMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^## (.*?)$/gm, '<h2 class="text-base font-black text-slate-200 mt-4 mb-2">$1</h2>')
    .replace(/^### (.*?)$/gm, '<h3 class="text-sm font-black text-slate-200 mt-3 mb-1">$1</h3>')
    .replace(/^(\d+\.) (.*?)$/gm, '<div class="flex gap-2 my-1.5"><span class="font-black text-[#DD7B3A] shrink-0">$1</span><span>$2</span></div>')
    .replace(/^→ (.*?)$/gm, '<div class="ml-6 my-1 px-3 py-1.5 rounded-lg bg-[#1B2430] text-[#F4F1E8] text-sm font-mono">→ $1</div>')
    .replace(/\n/g, '<br/>')
}

export function AIAsistanClient() {
  const [subject, setSubject] = useState('TYT Matematik')
  const [question, setQuestion] = useState('')
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string | null>(null)
  const [solution, setSolution] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [charCount, setCharCount] = useState(0)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const solutionRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setCharCount(question.length)
  }, [question])

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

  async function handleSolve() {
    const trimmed = question.trim()
    if (!trimmed && !imageBase64) {
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
        body: JSON.stringify({ question: trimmed, subject, imageBase64 }),
      })

      const data = await res.json() as {
        solution?: string
        error?: string
      }

      if (!res.ok) {
        setError(data.error ?? 'Bir hata oluştu.')
        return
      }

      setSolution(data.solution ?? '')

      // Çözüme kaydır
      setTimeout(() => {
        solutionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardPageShell
      title="AI Soru Asistanı"
      description="Gemini ile güçlendirilmiş adım adım çözüm asistanı"
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Powered by badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-white/5 bg-white/5 text-slate-200 text-xs font-bold whitespace-nowrap">
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Google Gemini AI
          </span>
          <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-white/5 bg-white/5 text-slate-200 text-xs font-bold whitespace-nowrap">
            <span>♾️</span>
            <span>Sınırsız Soru Çözümü Aktif</span>
          </span>
        </div>

        {/* Soru formu */}
        <div className={`${PIXEL_CARD} p-6 space-y-4`}>
          {/* Branş seçimi */}
          <div>
            <label className="block text-sm font-black text-slate-200 mb-2">
              Branş Seç
            </label>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className={PIXEL_INPUT}
            >
              {SUBJECTS.map(s => (
                <option key={s} value={s} className="bg-slate-900 text-slate-200">{s}</option>
              ))}
            </select>
          </div>

          {/* Soru girişi */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-black text-slate-200">
                Sorun
              </label>
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
              onChange={e => setQuestion(e.target.value)}
              onPaste={handlePaste}
              placeholder="Sorunuzu buraya yazın veya fotoğrafını ekleyin... (Pano görselini Ctrl+V ile yapıştırabilirsiniz)"
              rows={4}
              maxLength={2000}
              className={`${PIXEL_INPUT} resize-none`}
              onKeyDown={e => {
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
            <div className="p-3 rounded-xl border-2 border-red-400 bg-red-50 text-red-700 text-sm font-bold">
              {error}
            </div>
          )}

          {/* CTA */}
          <button
            type="button"
            onClick={handleSolve}
            disabled={loading || (!question.trim() && !imageBase64)}
            className={`${PIXEL_BUTTON_PRIMARY} w-full py-3.5 text-base cursor-pointer`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                Gemini düşünüyor...
              </span>
            ) : (
              'Gemini ile Çöz'
            )}
          </button>
        </div>

        {/* Çözüm */}
        {solution && (
          <div ref={solutionRef} className={`${PIXEL_CARD} p-6`}>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-white/10">
              <span className="text-lg">✨</span>
              <h2 className="font-black text-slate-200 text-base">Çözüm</h2>
              <span className={`${PIXEL_BADGE} ml-auto text-[10px]`}>
                Google Gemini AI
              </span>
            </div>
            <div
              className="text-slate-200 text-sm leading-relaxed font-medium space-y-1 prose-sm"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(solution) }}
            />
            <div className="mt-6 pt-4 border-t border-white/10 flex gap-3">
              <button
                type="button"
                onClick={() => { setSolution(''); setQuestion(''); handleRemoveImage(); }}
                className={`${PIXEL_BUTTON_SECONDARY} px-4 py-2 text-sm cursor-pointer`}
              >
                Yeni Soru
              </button>
              <Link
                href="/instructors"
                className={`${PIXEL_BUTTON_SECONDARY} px-4 py-2 text-sm cursor-pointer`}
              >
                Eğitmene Danış
              </Link>
            </div>
          </div>
        )}

        {/* Bilgi notu */}
        <div className="p-4 rounded-xl border border-white/5/20 bg-white/[0.02]/50 text-xs text-slate-200/80 font-semibold space-y-1">
          <p>💡 <strong>DersoLab Branş Kapsamı:</strong> AI Soru Asistanı sadece platformumuzdaki resmi LGS ve YKS (Matematik, Fizik, Kimya, Biyoloji, Türkçe, Tarih vb.) ders soruları için eğitilmiştir.</p>
          <p className="text-slate-200/60">DersoLab öğrencisi olarak 7/24 sınırsız soru sorabilir ve adım adım çözümlerle sınavlara eksiksiz hazırlanabilirsiniz.</p>
        </div>

      </div>
    </DashboardPageShell>
  )
}
