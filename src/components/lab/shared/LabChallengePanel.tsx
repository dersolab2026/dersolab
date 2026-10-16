'use client'

import React, { useState, useEffect } from 'react'
import { Trophy, CheckCircle2, AlertCircle, HelpCircle, Sparkles, Award } from 'lucide-react'
import { playSuccessFanfare, playClickSound } from '@/lib/soundFx'

export type ChallengeLevel = 'easy' | 'medium' | 'hard'

export interface LabChallenge {
  id: string
  level: ChallengeLevel
  title: string
  description: string
  targetMetric: string
  hint: string
  xp: number
  isCompleted: (state: any) => boolean
}

interface LabChallengePanelProps {
  moduleKey: string
  moduleTitle: string
  challenges: LabChallenge[]
  currentState: any
}

export function LabChallengePanel({
  moduleKey,
  moduleTitle,
  challenges,
  currentState,
}: LabChallengePanelProps) {
  const [completedIds, setCompletedIds] = useState<string[]>([])
  const [openHintId, setOpenHintId] = useState<string | null>(null)
  const [justCompletedId, setJustCompletedId] = useState<string | null>(null)

  // Load completed from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(`dersolab_challenges_${moduleKey}`)
      if (stored) {
        setCompletedIds(JSON.parse(stored))
      }
    } catch {
      // ignore
    }
  }, [moduleKey])

  // Real-time evaluation against current simulation state
  useEffect(() => {
    for (const challenge of challenges) {
      if (!completedIds.includes(challenge.id)) {
        if (challenge.isCompleted(currentState)) {
          const updated = [...completedIds, challenge.id]
          setCompletedIds(updated)
          try {
            localStorage.setItem(`dersolab_challenges_${moduleKey}`, JSON.stringify(updated))
          } catch {
            // ignore
          }
          setJustCompletedId(challenge.id)
          playSuccessFanfare()
          setTimeout(() => setJustCompletedId(null), 4000)
          break
        }
      }
    }
  }, [currentState, challenges, completedIds, moduleKey])

  const totalXP = challenges.reduce((acc, c) => acc + (completedIds.includes(c.id) ? c.xp : 0), 0)
  const maxXP = challenges.reduce((acc, c) => acc + c.xp, 0)

  const levelBadges: Record<ChallengeLevel, { label: string; color: string; border: string }> = {
    easy: {
      label: '1. Seviye: Kolay (Isınma)',
      color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      border: 'border-emerald-500/30',
    },
    medium: {
      label: '2. Seviye: Orta (Kazanım)',
      color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      border: 'border-amber-500/30',
    },
    hard: {
      label: '3. Seviye: LGS / YKS Derece',
      color: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      border: 'border-rose-500/30',
    },
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-xl">
      {/* Background Glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Meydan Okuma & Görev Sistemi</span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-white mt-1">
            {moduleTitle} — Başarı Görevleri
          </h3>
        </div>

        {/* XP Tracker */}
        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
          <Award className="w-5 h-5 text-amber-400" />
          <div className="text-right">
            <div className="text-xs text-slate-400 font-medium">Kazanılan Puan</div>
            <div className="text-sm font-extrabold text-amber-400">
              {totalXP} <span className="text-slate-500 font-normal">/ {maxXP} XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Just completed celebration alert */}
      {justCompletedId && (
        <div className="my-4 p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>Tebrikler! Bir hedef görevi başarıyla tamamladın ve XP kazandın! 🎉</span>
        </div>
      )}

      {/* Challenges List */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {challenges.map((c) => {
          const isDone = completedIds.includes(c.id)
          const badge = levelBadges[c.level]
          const isHintOpen = openHintId === c.id

          return (
            <div
              key={c.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${badge.color}`}
                  >
                    {badge.label}
                  </span>
                  <span className="text-[11px] font-bold text-amber-400/90 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                    +{c.xp} XP
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-100 flex items-start gap-2">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-400 shrink-0 mt-0.5">
                      ○
                    </span>
                  )}
                  <span>{c.title}</span>
                </h4>

                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {c.description}
                </p>

                {/* Target Metric Badge */}
                <div className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-300 bg-slate-900/90 px-2.5 py-1 rounded-md border border-slate-800">
                  <span className="text-slate-500">Hedef:</span>
                  <span className="font-semibold text-cyan-300">{c.targetMetric}</span>
                </div>
              </div>

              {/* Bottom hint toggle */}
              <div className="mt-3 pt-2.5 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound()
                    setOpenHintId(isHintOpen ? null : c.id)
                  }}
                  className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{isHintOpen ? 'İpucunu Kapat' : 'İpucu Göster'}</span>
                </button>

                {isHintOpen && (
                  <p className="mt-2 text-[11px] text-amber-200/90 bg-amber-950/30 border border-amber-500/20 p-2 rounded-lg leading-relaxed">
                    💡 {c.hint}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
