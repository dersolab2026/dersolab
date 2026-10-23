'use client'

import React, { useState } from 'react'
import { Award, Share2, Check, TrendingUp, BookOpen, Calendar, CheckCircle2, Flame, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

interface StudentWeeklyReportProps {
  studentName: string
  creditBalance: number
  completedBookingsCount: number
  pendingHomeworkCount: number
  submittedHomeworkCount: number
  latestExam?: {
    examType: string
    totalNet: number
    date: string
  }
}

export function StudentWeeklyReportCard({
  studentName,
  creditBalance,
  completedBookingsCount,
  pendingHomeworkCount,
  submittedHomeworkCount,
  latestExam,
}: StudentWeeklyReportProps) {
  const [copied, setCopied] = useState(false)

  const handleShare = () => {
    const text = `🎓 DersoLab Öğrenci Başarı Özeti — ${studentName}
----------------------------------------
✅ Tamamlanan Dersler: ${completedBookingsCount} Seans
📚 Ödev Durumu: ${submittedHomeworkCount} Tamamlandı (${pendingHomeworkCount} Bekleyen)
${latestExam ? `🎯 Son Deneme Neti: ${latestExam.totalNet.toFixed(1)} Net (${latestExam.examType.toUpperCase()})` : ''}
⚡ Kalan Ders Kredisi: ${creditBalance}
----------------------------------------
DersoLab L.A.B. & Koçluk Ekosistemi ile hedefe bir adım daha yakın!`

    navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Haftalık karne metni kopyalandı! WhatsApp veya mesajla paylaşabilirsiniz.')
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-[#0B101B] to-slate-950 p-6 sm:p-7 shadow-xl">
      {/* Background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Veli Özel Bilgilendirme
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Haftalık Karne
              </span>
            </div>
            <h3 className="text-lg font-black text-white mt-0.5">
              {studentName} — Gelişim & Takip Raporu
            </h3>
          </div>
        </div>

        <button
          onClick={handleShare}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm flex items-center gap-2 transition-all active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0"
        >
          {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {copied ? 'Kopyalandı!' : 'Özeti Kopyala & Paylaş'}
        </button>
      </div>

      {/* Grid İstatistikleri */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            Tamamlanan Ders
          </span>
          <div className="mt-2 text-2xl font-black text-white">
            {completedBookingsCount} <span className="text-xs text-slate-500 font-semibold">Seans</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            Ödev Durumu
          </span>
          <div className="mt-2 text-2xl font-black text-white">
            {submittedHomeworkCount} <span className="text-xs text-emerald-400 font-semibold">Teslim</span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
            Son Deneme
          </span>
          <div className="mt-2 text-2xl font-black text-white">
            {latestExam ? (
              <>
                {latestExam.totalNet.toFixed(1)}{' '}
                <span className="text-xs text-purple-400 font-semibold uppercase">{latestExam.examType}</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-slate-500">—</span>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            Kalan Bakiye
          </span>
          <div className="mt-2 text-2xl font-black text-white">
            {creditBalance} <span className="text-xs text-orange-400 font-semibold">Kredi</span>
          </div>
        </div>
      </div>

      {/* Motivasyon & Danışmanlık Mesajı */}
      <div className="mt-5 p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-slate-300 leading-relaxed font-medium">
          <span className="font-bold text-white">DersoLab Koçluk Tavsiyesi:</span> Öğrencinizin ders ve çalışma disiplini düzenli olarak takip ediliyor. Düzenli çalışma periyotları ve deneme analizleri, sınav başarısının en kritik anahtarıdır.
        </div>
      </div>
    </div>
  )
}
