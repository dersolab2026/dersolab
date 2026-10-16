'use client'

import React, { useState } from 'react'
import { CheckCircle2, XCircle, HelpCircle, ExternalLink, Sparkles, BookOpen } from 'lucide-react'
import { playSuccessFanfare, playErrorBuzz, playClickSound } from '@/lib/soundFx'

export interface ExamQuestion {
  id: string
  exam: 'LGS' | 'TYT' | 'AYT' | 'MEB Kazanım'
  year: number | string
  subject: string
  topic: string
  questionText: string
  options: { key: 'A' | 'B' | 'C' | 'D' | 'E'; text: string }[]
  correctKey: 'A' | 'B' | 'C' | 'D' | 'E'
  explanation: string
  simulationTip: string
}

interface ExamQuestionCardProps {
  question: ExamQuestion
}

export function ExamQuestionCard({ question }: ExamQuestionCardProps) {
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState<boolean>(false)
  const [showSimTip, setShowSimTip] = useState<boolean>(false)

  const isAnswered = selectedKey !== null
  const isCorrect = selectedKey === question.correctKey

  const handleSelect = (key: 'A' | 'B' | 'C' | 'D' | 'E') => {
    if (isAnswered) return
    setSelectedKey(key)
    setShowExplanation(true)
    if (key === question.correctKey) {
      playSuccessFanfare()
    } else {
      playErrorBuzz()
    }
  }

  const examBadgeColors: Record<string, string> = {
    LGS: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    TYT: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    AYT: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    'MEB Kazanım': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl backdrop-blur-xl relative">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-black px-2.5 py-1 rounded-full border ${
              examBadgeColors[question.exam] || 'bg-slate-800 text-slate-300 border-slate-700'
            }`}
          >
            {question.year} {question.exam} Çıkmış Soru
          </span>
          <span className="text-xs text-slate-400 font-medium">
            {question.subject} · {question.topic}
          </span>
        </div>

        <button
          type="button"
          onClick={() => {
            playClickSound()
            setShowSimTip(!showSimTip)
          }}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 px-3 py-1.5 rounded-lg transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{showSimTip ? 'Simülasyon İpucunu Gizle' : 'Simülasyonda Doğrula 🧪'}</span>
        </button>
      </div>

      {/* Simulation Tip Callout */}
      {showSimTip && (
        <div className="my-3 p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-200 text-xs leading-relaxed animate-fadeIn">
          <div className="font-bold flex items-center gap-1.5 text-amber-300 mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Simülasyon Rehberi (Kendi Gözünle Gör):</span>
          </div>
          {question.simulationTip}
        </div>
      )}

      {/* Question Text */}
      <div className="mt-4 text-sm sm:text-base text-slate-100 font-medium leading-relaxed">
        {question.questionText}
      </div>

      {/* Options List */}
      <div className="mt-4 space-y-2.5">
        {question.options.map((opt) => {
          let btnStyle =
            'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40 text-slate-200'

          if (isAnswered) {
            if (opt.key === question.correctKey) {
              btnStyle =
                'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/40 font-bold'
            } else if (selectedKey === opt.key) {
              btnStyle =
                'bg-rose-950/40 border-rose-500 text-rose-200 ring-1 ring-rose-500/40 line-through'
            } else {
              btnStyle = 'opacity-40 bg-slate-950/30 border-slate-800 text-slate-400'
            }
          }

          return (
            <button
              key={opt.key}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelect(opt.key)}
              className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
            >
              <span className="w-6 h-6 rounded-lg bg-slate-800/80 border border-slate-700/80 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                {opt.key}
              </span>
              <span className="text-xs sm:text-sm leading-relaxed">{opt.text}</span>
              {isAnswered && opt.key === question.correctKey && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-auto shrink-0 mt-1" />
              )}
              {isAnswered && selectedKey === opt.key && opt.key !== question.correctKey && (
                <XCircle className="w-4 h-4 text-rose-400 ml-auto shrink-0 mt-1" />
              )}
            </button>
          )
        })}
      </div>

      {/* Explanation Box */}
      {showExplanation && (
        <div
          className={`mt-4 p-4 rounded-xl border text-xs sm:text-sm leading-relaxed ${
            isCorrect
              ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-100'
              : 'bg-rose-950/20 border-rose-500/30 text-rose-100'
          }`}
        >
          <div className="font-extrabold flex items-center gap-1.5 mb-1.5">
            {isCorrect ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300">Tebrikler! Doğru Seçenek: {question.correctKey}</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-400" />
                <span className="text-rose-300">Yanlış! Doğru Seçenek: {question.correctKey}</span>
              </>
            )}
          </div>
          <p className="text-slate-300 whitespace-pre-line">{question.explanation}</p>
        </div>
      )}
    </div>
  )
}
