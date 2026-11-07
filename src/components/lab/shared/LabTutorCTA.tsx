'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, ArrowRight, MessageCircle, GraduationCap, CheckCircle2 } from 'lucide-react'
import { playClickSound } from '@/lib/soundFx'

interface LabTutorCTAProps {
  branch: string
  topicName?: string
  gradeLevel?: string
}

export function LabTutorCTA({
  branch,
  topicName = 'bu konudaki',
  gradeLevel = 'LGS & YKS',
}: LabTutorCTAProps) {
  const whatsappText = encodeURIComponent(
    `Merhaba DersoLab! ${branch} laboratuvarında ${topicName} simülasyonunu inceliyordum. 20 dakikalık ücretsiz tanışma dersi hakkında bilgi alabilir miyim?`
  )

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 p-6 sm:p-8 shadow-2xl shadow-indigo-950/50">
      {/* Background Glows */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left: Mascot & Pitch */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 max-w-2xl">
          <div className="relative shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-indigo-600/20 border border-indigo-400/30 p-2 flex items-center justify-center shadow-lg">
              <Image
                src="/fox-head.png"
                alt="DersoLab Maskot"
                width={64}
                height={64}
                className="w-full h-full object-contain drop-shadow"
              />
            </div>
            <span className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-[9px] font-black text-slate-950 uppercase tracking-wider">
              Canlı
            </span>
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>20 Dakika Ücretsiz Tanışma Dersi</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">{gradeLevel}</span>
            </div>

            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {topicName ? `"${topicName}" Konusunu` : `${branch} Konularını`} Uzman Eğitmenle Birebir Pekiştir!
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Simülasyonla deney mantığını keşfettin. Şimdi MEB ve ÖSYM çıkmış yeni nesil deney sorularını,
              eksiklerini ve sınav tüyolarını <strong className="text-white">birebir canlı derste</strong> öğretmenimizle çöz.
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-[11px] text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Google Meet Birebir
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Kredi Kartı Gerekmez
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Kişiye Özel Eksik Tespiti
              </span>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto shrink-0">
          <Link
            href="/demo-lessons"
            onClick={playClickSound}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-indigo-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] text-center"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Ücretsiz Tanışma Dersi Al</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </Link>

          <div className="flex items-center gap-2">
            <Link
              href={`/marketplace?branch=${encodeURIComponent(branch.toLowerCase())}`}
              onClick={playClickSound}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-slate-500 font-bold text-xs transition-colors text-center"
            >
              <span>Eğitmenleri Gör</span>
            </Link>

            <a
              href={`https://wa.me/905000000000?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={playClickSound}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition-colors"
              title="WhatsApp İle Danış"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
