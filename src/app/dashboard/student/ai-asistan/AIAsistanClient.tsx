'use client'

import { useState, useRef, useEffect } from 'react'
import { DashboardPageShell } from '@/components/layout/DashboardPageShell'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY, PIXEL_BUTTON_SECONDARY, PIXEL_INPUT, PIXEL_BADGE } from '@/lib/theme'
import Link from 'next/link'

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
    .replace(/^## (.*?)$/gm, '<h2 class="text-base font-black text-[#1B2430] mt-4 mb-2">$1</h2>')
    .replace(/^### (.*?)$/gm, '<h3 class="text-sm font-black text-[#1B2430] mt-3 mb-1">$1</h3>')
    .replace(/^(\d+\.) (.*?)$/gm, '<div class="flex gap-2 my-1.5"><span class="font-black text-[#DD7B3A] shrink-0">$1</span><span>$2</span></div>')
    .replace(/^→ (.*?)$/gm, '<div class="ml-6 my-1 px-3 py-1.5 rounded-lg bg-[#1B2430] text-[#F4F1E8] text-sm font-mono">→ $1</div>')
    .replace(/\n/g, '<br/>')
}

export function AIAsistanClient() {
  const [subject, setSubject] = useState('TYT Matematik')
  const [question, setQuestion] = useState('')
  const [solution, setSolution] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [remaining, setRemaining] = useState<number | null>(null)
  const [isAnon, setIsAnon] = useState(false)
  const [charCount, setCharCount] = useState(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const solutionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCharCount(question.length)
  }, [question])

  function loadExample() {
    const ex = EXAMPLE_QUESTIONS[subject] ?? Object.values(EXAMPLE_QUESTIONS)[0]
    setQuestion(ex)
  }

  async function handleSolve() {
    if (!question.trim() || question.length < 5) {
      setError('Lütfen geçerli bir soru yazın.')
      return
    }
    setError('')
    setSolution('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, subject }),
      })

      const data = await res.json() as {
        solution?: string
        error?: string
        remaining?: number
        isAnon?: boolean
        limitReached?: boolean
      }

      if (!res.ok) {
        setError(data.error ?? 'Bir hata oluştu.')
        if (data.limitReached) {
          setIsAnon(data.isAnon ?? false)
        }
        return
      }

      setSolution(data.solution ?? '')
      setRemaining(data.remaining ?? null)
      setIsAnon(data.isAnon ?? false)

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
      title="🤖 AI Soru Asistanı"
      description="Gemini ile güçlendirilmiş adım adım çözüm asistanı"
    >
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Powered by badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border-2 border-[#1B2430] bg-white text-[#1B2430] text-xs font-bold whitespace-nowrap">
            <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#4285F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Google Gemini AI
          </span>
          <span className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border-2 border-[#1B2430] bg-white text-[#1B2430] text-xs font-bold whitespace-nowrap">
            <span>♾️</span>
            <span>Sınırsız Soru Çözümü Aktif</span>
          </span>
        </div>

        {/* Soru formu */}
        <div className={`${PIXEL_CARD} p-6 space-y-4`}>
          {/* Branş seçimi */}
          <div>
            <label className="block text-sm font-black text-[#1B2430] mb-2">
              Branş Seç
            </label>
            <select
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className={PIXEL_INPUT}
            >
              {SUBJECTS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Soru girişi */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-black text-[#1B2430]">
                Sorun
              </label>
              <button
                type="button"
                onClick={loadExample}
                className="text-xs font-bold text-[#DD7B3A] underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                Örnek soru yükle
              </button>
            </div>
            <textarea
              ref={textareaRef}
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Sorunuzu buraya yazın... Formüller, sayılar, bağlamı dahil edebilirsiniz."
              rows={5}
              maxLength={2000}
              className={`${PIXEL_INPUT} resize-none`}
              onKeyDown={e => {
                if (e.key === 'Enter' && e.ctrlKey) handleSolve()
              }}
            />
            <p className="text-xs text-[#1B2430]/50 text-right mt-1 font-semibold">
              {charCount}/2000 · Ctrl+Enter ile gönder
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl border-2 border-red-400 bg-red-50 text-red-700 text-sm font-bold">
              {error}
              {isAnon && (
                <div className="mt-2">
                  <Link href="/register" className={`${PIXEL_BUTTON_PRIMARY} px-4 py-1.5 text-xs`}>
                    Kayıt Ol — Günlük 15 Soru
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* CTA */}
          <button
            type="button"
            onClick={handleSolve}
            disabled={loading || !question.trim()}
            className={`${PIXEL_BUTTON_PRIMARY} w-full py-3.5 text-base`}
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
              '🤖 Gemini ile Çöz'
            )}
          </button>
        </div>

        {/* Çözüm */}
        {solution && (
          <div ref={solutionRef} className={`${PIXEL_CARD} p-6`}>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-[#1B2430]/10">
              <span className="text-lg">✨</span>
              <h2 className="font-black text-[#1B2430] text-base">Çözüm</h2>
              <span className={`${PIXEL_BADGE} ml-auto text-[10px]`}>
                Google Gemini AI
              </span>
            </div>
            <div
              className="text-[#1B2430] text-sm leading-relaxed font-medium space-y-1 prose-sm"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(solution) }}
            />
            <div className="mt-6 pt-4 border-t-2 border-[#1B2430]/10 flex gap-3">
              <button
                type="button"
                onClick={() => { setSolution(''); setQuestion('') }}
                className={`${PIXEL_BUTTON_SECONDARY} px-4 py-2 text-sm`}
              >
                Yeni Soru
              </button>
              <Link
                href="/instructors"
                className={`${PIXEL_BUTTON_SECONDARY} px-4 py-2 text-sm`}
              >
                Eğitmene Danış
              </Link>
            </div>
          </div>
        )}

        {/* Bilgi notu */}
        <div className="p-4 rounded-xl border-2 border-[#1B2430]/20 bg-[#F4F1E8]/50 text-xs text-[#1B2430]/80 font-semibold space-y-1">
          <p>💡 <strong>DersoLab Branş Kapsamı:</strong> AI Soru Asistanı sadece platformumuzdaki resmi LGS ve YKS (Matematik, Fizik, Kimya, Biyoloji, Türkçe, Tarih vb.) ders soruları için eğitilmiştir.</p>
          <p className="text-[#1B2430]/60">DersoLab öğrencisi olarak 7/24 sınırsız soru sorabilir ve adım adım çözümlerle sınavlara eksiksiz hazırlanabilirsiniz.</p>
        </div>

      </div>
    </DashboardPageShell>
  )
}
