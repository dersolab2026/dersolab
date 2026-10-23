'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, Sparkles, Flame, ArrowRight, Zap, Target, BookOpen } from 'lucide-react'

const EXAM_DATES = {
  yks: {
    title: 'YKS 2027 (TYT & AYT)',
    date: '2027-06-19T10:15:00+03:00',
    target: 'Üniversite Yerleştirme Sınavı',
  },
  lgs: {
    title: 'LGS 2027',
    date: '2027-06-06T09:30:00+03:00',
    target: 'Liselere Geçiş Sınavı',
  },
}

const STRATEGIES = [
  '“Turlama Taktiği: İlk turda sadece 1 dakikada çözebileceğin soruları yap. Zor sorulara ikinci turda dön.”',
  '“Her gün düzenli çözülen 20 paragraf sorusu, sınav anında sana en az 25 dakika kazandırır.”',
  '“Yanlış yaptığın sorular en büyük öğretmenindir. Onları hemen AI Asistan ile adım adım analiz et.”',
  '“Soru çözerken saatini masaya koy. Gerçek sınavda zaman baskısını yönetenler kazanır.”',
  '“Zor bir formülü ezberlemek yerine L.A.B. simülasyonunda mantığını görsel olarak keşfet.”',
]

export function ExamCountdownHero() {
  const [examType, setExamType] = useState<'yks' | 'lgs'>('yks')
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  // Günün stratejisi
  const [strategyIndex, setStrategyIndex] = useState(0)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('dersolab_preferred_exam')
      if (saved === 'yks' || saved === 'lgs') setExamType(saved)
    } catch {}
  }, [])

  const handleExamChange = (type: 'yks' | 'lgs') => {
    setExamType(type)
    try {
      localStorage.setItem('dersolab_preferred_exam', type)
    } catch {}
  }

  useEffect(() => {
    const updateCountdown = () => {
      const targetTime = new Date(EXAM_DATES[examType].date).getTime()
      const now = Date.now()
      const diff = Math.max(0, targetTime - now)

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft({ days, hours, minutes, seconds })
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [examType])

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0F172A] via-[#090D16] to-[#04060A] p-6 sm:p-8 shadow-2xl mb-6">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-orange-500/15 via-emerald-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Sol: Başlık ve Geri Sayım */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-black uppercase tracking-wider">
              <Target className="w-3.5 h-3.5" />
              <span>Sınav Hedef Sayacı</span>
            </div>

            {/* Sınav Tipi Seçici */}
            <div className="flex items-center p-1 rounded-xl bg-white/5 border border-white/10">
              <button
                onClick={() => handleExamChange('yks')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  examType === 'yks'
                    ? 'bg-orange-500 text-slate-950 shadow-[0_0_10px_rgba(249,115,22,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                YKS (TYT-AYT)
              </button>
              <button
                onClick={() => handleExamChange('lgs')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  examType === 'lgs'
                    ? 'bg-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                LGS (8. Sınıf)
              </button>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {EXAM_DATES[examType].title} — <span className="text-slate-400 font-semibold text-lg">{EXAM_DATES[examType].target}</span>
          </h2>

          {/* Sayaç Blokları */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex flex-col items-center justify-center w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">{timeLeft.days}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gün</span>
            </div>

            <span className="text-xl font-black text-slate-600">:</span>

            <div className="flex flex-col items-center justify-center w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Saat</span>
            </div>

            <span className="text-xl font-black text-slate-600">:</span>

            <div className="flex flex-col items-center justify-center w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-2xl sm:text-3xl font-black text-white font-mono">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Dakika</span>
            </div>

            <span className="text-xl font-black text-slate-600">:</span>

            <div className="flex flex-col items-center justify-center w-16 sm:w-20 h-16 sm:h-20 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <span className="text-2xl sm:text-3xl font-black text-orange-400 font-mono">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[10px] font-bold text-orange-400/80 uppercase tracking-wider">Saniye</span>
            </div>
          </div>
        </div>

        {/* Sağ: Hızlı Aksiyon & Günün Sınav Taktiği */}
        <div className="w-full lg:max-w-md space-y-3">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-amber-400">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Günün Sınav & Koçluk Taktiği
              </span>
              <button
                onClick={() => setStrategyIndex((prev) => (prev + 1) % STRATEGIES.length)}
                className="text-[11px] text-slate-400 hover:text-white underline underline-offset-2"
              >
                Sonraki
              </button>
            </div>
            <p className="text-xs text-slate-300 italic leading-relaxed">
              {STRATEGIES[strategyIndex]}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/dashboard/student/odaklanma"
              className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.25)] transition-all active:scale-95 text-center"
            >
              <Flame className="w-4 h-4 shrink-0" />
              <span>Pomodoro Başlat</span>
            </Link>

            <Link
              href="/dashboard/student/ai-asistan"
              className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 text-center"
            >
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Soru Çözdür</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
