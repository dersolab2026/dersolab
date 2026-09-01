'use client'

import { Sparkles, ArrowRight, DoorOpen } from 'lucide-react'

export function CampusBuildingScene({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="relative min-h-[680px] sm:min-h-[780px] rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_80px_rgba(0,0,0,0.9)] group">
      {/* Background Image: Grand DersoLab Academy Building */}
      <img
        src="/campus-building-exterior.jpg"
        alt="DersoLab Akademi Binası"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
      />

      {/* Dark Ambient Overlay Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/60" />

      {/* Top Billboard Header */}
      <div className="relative z-10 p-6 sm:p-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold tracking-widest uppercase backdrop-blur-xl shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>İNTERAKTİF SANAL AKADEMİ KAMPÜSÜ</span>
        </div>
        <span className="hidden sm:inline-block font-mono text-xs text-amber-200/80 bg-black/60 px-3 py-1 rounded-lg border border-white/10">
          AŞAMA I: BİNA DIŞ CEPHESİ
        </span>
      </div>

      {/* Central Interactive Entrance Door Prompt */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[440px] px-4 text-center space-y-6">
        <div className="max-w-xl space-y-3">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight font-serif drop-shadow-2xl">
            DersoLab Akademi'ye Hoş Geldiniz
          </h2>
          <p className="text-sm sm:text-base text-amber-100/90 font-sans font-medium drop-shadow-md">
            1:1 canlı derslerin, uzman öğretmenlerin ve laboratuvarların yer aldığı sanal binamıza adım atın.
          </p>
        </div>

        {/* Pulsing Glowing Door Button */}
        <button
          type="button"
          onClick={onEnter}
          className="group/btn relative overflow-hidden flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 text-slate-950 font-extrabold text-base sm:text-lg shadow-[0_0_50px_rgba(245,158,11,0.8)] hover:shadow-[0_0_80px_rgba(245,158,11,1)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
          <DoorOpen className="w-6 h-6 text-slate-950 group-hover/btn:rotate-12 transition-transform" />
          <span>KAPIYI AÇ VE İÇERİ GİR</span>
          <ArrowRight className="w-5 h-5 text-slate-950 group-hover/btn:translate-x-1.5 transition-transform" />
        </button>

        <p className="text-xs text-amber-200/80 font-mono tracking-wider animate-pulse">
          ✦ TIKLAYARAK DANIŞMA & MASKOT MASASINA GEÇİN ✦
        </p>
      </div>
    </div>
  )
}
