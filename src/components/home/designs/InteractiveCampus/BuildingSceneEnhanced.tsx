'use client'

import { useState } from 'react'
import { Sparkles, ArrowRight, Bell, Moon, Sun, ShieldCheck, Video, Award } from 'lucide-react'

export function BuildingSceneEnhanced({ onEnter }: { onEnter: () => void }) {
  const [intercomActive, setIntercomActive] = useState(false)
  const [nightMode, setNightMode] = useState(true)

  return (
    <div className="relative min-h-[700px] sm:min-h-[820px] rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-[0_0_90px_rgba(0,0,0,0.95)] select-none">
      {/* Background Image: Grand DersoLab Academy Building */}
      <img
        src="/campus-building-exterior.jpg"
        alt="DersoLab Akademi Binası"
        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${
          nightMode ? 'brightness-95 contrast-105' : 'brightness-110 contrast-100'
        }`}
      />

      {/* Atmospheric Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70 pointer-events-none" />

      {/* Top HUD Bar */}
      <div className="relative z-20 p-5 sm:p-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/80 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold backdrop-blur-xl shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>DERSOLAB SANAL KAMPÜSÜ // AŞAMA 1: DIŞ CEPHE</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Day / Twilight Toggle */}
          <button
            type="button"
            onClick={() => setNightMode(!nightMode)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/70 border border-white/15 text-xs text-amber-200 hover:text-white cursor-pointer backdrop-blur-xl transition-all"
          >
            {nightMode ? <Moon className="w-3.5 h-3.5 text-amber-400" /> : <Sun className="w-3.5 h-3.5 text-yellow-400" />}
            <span className="hidden sm:inline">{nightMode ? 'Alacakaranlık Işıkları' : 'Gündüz Işığı'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Hotspot 1: Grand Central Entrance Doors */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center text-center space-y-5">
        <div className="max-w-xl px-4 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-400/40 shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>1:1 CANLI ÖZEL DERS AKADEMİSİ</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight font-serif drop-shadow-[0_10px_30px_rgba(0,0,0,0.9)]">
            DersoLab Akademi
          </h2>

          <p className="text-sm sm:text-base text-amber-100 font-sans font-medium drop-shadow-lg max-w-md mx-auto">
            Türkiye'nin seçkin öğretmenleriyle 1:1 canlı ders odalarına ve laboratuvarlara adım atın.
          </p>
        </div>

        {/* Big Glowing Entrance Door Button with Pulse Ring */}
        <div className="relative group/door pt-2">
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 via-rose-500 to-amber-500 rounded-3xl blur-xl opacity-75 group-hover/door:opacity-100 transition-opacity animate-pulse-glow" />

          <button
            type="button"
            onClick={onEnter}
            className="relative flex items-center gap-3.5 px-10 sm:px-12 py-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 text-slate-950 font-extrabold text-base sm:text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer overflow-hidden border-2 border-white/40"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover/door:translate-x-full transition-transform duration-1000" />
            <span className="text-xl">🚪</span>
            <span>KAPIDAN İÇERİ GİR</span>
            <ArrowRight className="w-5 h-5 text-slate-950 group-hover/door:translate-x-1.5 transition-transform" />
          </button>
        </div>

        {/* Secondary Hotspot: Ring Intercom Bell Button */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setIntercomActive(!intercomActive)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/80 hover:bg-black text-amber-300 hover:text-amber-200 border border-amber-500/40 text-xs font-mono font-bold transition-all cursor-pointer backdrop-blur-xl shadow-lg"
          >
            <Bell className="w-4 h-4 text-amber-400 animate-bounce" />
            <span>Danışma Zilini Çal 🔔</span>
          </button>
        </div>
      </div>

      {/* Intercom Popup Message */}
      {intercomActive && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 max-w-md w-full px-4 animate-in fade-in zoom-in duration-300">
          <div className="p-5 rounded-3xl bg-slate-950/95 border-2 border-amber-400 shadow-2xl backdrop-blur-2xl text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-amber-300 font-bold text-sm">
              <span className="text-xl">🦊</span>
              <span>DERSOLAB DANIŞMA MASKOTU BAĞLANDI:</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
              "Kapıdaki zili duydum! Lobiye gel, sana 20 dakikalık ücretsiz tanışma seansını ve laboratuvarları gezdireyim!"
            </p>
            <button
              type="button"
              onClick={onEnter}
              className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Tamam, İçeri Geliyorum →
            </button>
          </div>
        </div>
      )}

      {/* Bottom Live Activity Ticker */}
      <div className="absolute bottom-4 inset-x-4 sm:inset-x-8 z-20 p-3 rounded-2xl bg-black/70 border border-white/10 backdrop-blur-xl flex flex-wrap items-center justify-around gap-3 text-xs text-slate-300 font-mono">
        <span className="flex items-center gap-1.5 text-amber-300 font-bold">
          <Video className="w-3.5 h-3.5 text-emerald-400" />
          <span>Şu An 14 Canlı Seans Aktif</span>
        </span>
        <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>%100 Onaylı Öğretmen Kadrosu</span>
        </span>
        <span className="flex items-center gap-1.5 text-rose-300 font-bold">
          <Award className="w-3.5 h-3.5 text-rose-400" />
          <span>20 Dk Ücretsiz Tanışma Açık</span>
        </span>
      </div>
    </div>
  )
}
