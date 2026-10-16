'use client'

import React, { useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Clock, Sparkles, CheckCircle2 } from 'lucide-react'
import { playClickSound, playSuccessFanfare, playSliderTick } from '@/lib/soundFx'

const FOCUS_DURATION = 25 * 60 // 25 minutes in seconds
const BREAK_DURATION = 5 * 60 // 5 minutes in seconds

export function StudentFocusTimer() {
  const [mode, setMode] = useState<'study' | 'break'>('study')
  const [timeLeft, setTimeLeft] = useState<number>(FOCUS_DURATION)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [completedSessions, setCompletedSessions] = useState<number>(0)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Session complete
            try {
              playSuccessFanfare()
            } catch {
              // ignore
            }
            if (mode === 'study') {
              setCompletedSessions((c) => c + 1)
              setMode('break')
              return BREAK_DURATION
            } else {
              setMode('study')
              return FOCUS_DURATION
            }
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, mode])

  const toggleTimer = () => {
    try {
      playClickSound()
    } catch {
      // ignore
    }
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    try {
      playClickSound()
    } catch {
      // ignore
    }
    setIsRunning(false)
    setTimeLeft(mode === 'study' ? FOCUS_DURATION : BREAK_DURATION)
  }

  const switchMode = (newMode: 'study' | 'break') => {
    try {
      playSliderTick()
    } catch {
      // ignore
    }
    setMode(newMode)
    setIsRunning(false)
    setTimeLeft(newMode === 'study' ? FOCUS_DURATION : BREAK_DURATION)
  }

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const totalDuration = mode === 'study' ? FOCUS_DURATION : BREAK_DURATION
  const progressPercent = Math.min(100, Math.max(0, ((totalDuration - timeLeft) / totalDuration) * 100))

  return (
    <div className="rounded-3xl bg-slate-900/80 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-xl relative overflow-hidden shadow-xl">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center border border-orange-500/30">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-white">Pomodoro Odak Masası</h3>
            <span className="text-[11px] text-slate-400">25 dk Odaklan • 5 dk Dinlen</span>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => switchMode('study')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              mode === 'study'
                ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ders
          </button>
          <button
            type="button"
            onClick={() => switchMode('break')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
              mode === 'break'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mola
          </button>
        </div>
      </div>

      {/* Timer Progress Ring & Display */}
      <div className="flex flex-col items-center justify-center my-3 relative">
        <div className="relative flex items-center justify-center w-36 h-36">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              className="text-slate-800"
              strokeWidth="6"
              stroke="currentColor"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
            />
            <circle
              className={`transition-all duration-300 ${
                mode === 'study' ? 'text-orange-500' : 'text-emerald-400'
              }`}
              strokeWidth="6"
              strokeDasharray={264}
              strokeDashoffset={264 - (264 * progressPercent) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="42"
              cx="50"
              cy="50"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="font-mono text-3xl font-black text-white tracking-wider">
              {formattedTime}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              {mode === 'study' ? 'Ders Saati' : 'Mola'}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 mt-4">
          <button
            type="button"
            onClick={toggleTimer}
            className={`px-6 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
              isRunning
                ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                : mode === 'study'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-slate-950 shadow-orange-500/20'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Duraklat</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Başlat</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={resetTimer}
            title="Sıfırla"
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Completed session counter */}
      <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Bugün Tamamlanan:</span>
        </div>
        <span className="font-mono font-bold text-white">
          {completedSessions} Odak Seansı ({completedSessions * 25} dk)
        </span>
      </div>
    </div>
  )
}
