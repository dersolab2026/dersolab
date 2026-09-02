'use client'

import { useState } from 'react'
import { Sparkles, ArrowRight, Bell, Video, ShieldCheck, Award, Volume2, VolumeX } from 'lucide-react'
import { campusSound } from './CampusSoundEngine'

export function Realistic3DBuildingEntrance({ onEnter }: { onEnter: () => void }) {
  const [doorOpen, setDoorOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: -y * 8, y: x * 8 })
  }

  const handleDoorClick = () => {
    campusSound.playDoorOpen()
    setDoorOpen(true)
    setTimeout(() => {
      onEnter()
    }, 750)
  }

  const handleBellRing = () => {
    campusSound.playBellChime()
  }

  const toggleSound = () => {
    const next = !soundEnabled
    setSoundEnabled(next)
    campusSound.enabled = next
  }

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-[720px] sm:min-h-[840px] rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-[0_0_100px_rgba(0,0,0,0.95)] select-none"
    >
      {/* Background Image: Grand Building with Zoom & Parallax */}
      <img
        src="/campus-building-exterior.jpg"
        alt="DersoLab Akademi Binası"
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-in-out ${
          doorOpen ? 'scale-130' : 'scale-100'
        }`}
        style={{
          transform: !doorOpen ? `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : undefined,
        }}
      />

      {/* Atmospheric Vignette */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70 transition-opacity duration-700 pointer-events-none ${
          doorOpen ? 'opacity-95' : 'opacity-70'
        }`}
      />

      {/* Top HUD Header */}
      <div className="relative z-20 p-5 sm:p-8 flex items-center justify-between">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-black/85 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold backdrop-blur-xl shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>DERSOLAB AKADEMİ // 3 BOYUTLU ANA GİRİŞ KAPISI</span>
        </div>

        {/* Audio Toggle */}
        <button
          type="button"
          onClick={toggleSound}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/80 border border-white/15 text-xs text-amber-200 hover:text-white cursor-pointer backdrop-blur-xl transition-all"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          <span className="hidden sm:inline">{soundEnabled ? 'Ses Açık' : 'Sessiz'}</span>
        </button>
      </div>

      {/* Center 3D Double Doors on Building Entrance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center text-center space-y-4">
        {/* Title Badge */}
        <div className="space-y-1">
          <span className="text-xs font-mono text-amber-300 font-bold uppercase tracking-widest bg-black/80 px-3.5 py-1 rounded-full border border-amber-400/50 shadow-md">
            ✦ DERSOLAB SANAL KAMPÜSÜ ✦
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif drop-shadow-[0_10px_25px_rgba(0,0,0,1)]">
            Giriş İçin Kapıyı Tıklayın
          </h2>
        </div>

        {/* 3D Physical Double Door Container */}
        <div
          className="relative w-64 sm:w-84 h-76 sm:h-96 rounded-t-2xl p-2.5 bg-black/90 border-4 border-amber-500 shadow-[0_0_70px_rgba(245,158,11,0.7)] cursor-pointer group"
          style={{ perspective: '1200px' }}
          onMouseEnter={() => {
            setIsHovered(true)
            campusSound.playHandleClick()
          }}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleDoorClick}
        >
          {/* Glowing Interior Lobby behind the doors */}
          <div className="absolute inset-2.5 rounded-t-xl bg-gradient-to-b from-amber-400/40 via-amber-950 to-black flex flex-col items-center justify-center p-4 text-center overflow-hidden">
            <div className="w-14 h-14 rounded-full bg-amber-400/30 border-2 border-amber-300 flex items-center justify-center text-amber-200 animate-pulse mb-2 shadow-[0_0_25px_rgba(245,158,11,0.6)]">
              <Sparkles className="w-8 h-8" />
            </div>
            <span className="text-sm font-bold text-white font-serif tracking-wide">Danışma & Lobiye Geçiş</span>
            <span className="text-xs text-amber-200 mt-1 font-sans">Maskot seni bekliyor!</span>
          </div>

          {/* Left 3D Door Wing on Hinges */}
          <div
            className="absolute left-2.5 top-2.5 bottom-2.5 w-[calc(50%-10px)] rounded-tl-xl bg-gradient-to-b from-[#3d2315] via-[#22120a] to-[#0f0704] border-r border-amber-500/60 border-2 border-[#5a331e] shadow-2xl transition-transform duration-700 ease-out origin-left flex flex-col justify-between p-2.5"
            style={{
              transform: doorOpen
                ? 'rotateY(-90deg)'
                : isHovered
                ? 'rotateY(-32deg)'
                : 'rotateY(0deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="h-20 rounded-md bg-amber-100/10 border border-amber-400/50 p-1 flex items-center justify-center shadow-inner">
              <span className="text-[11px] font-serif font-extrabold text-amber-300 tracking-wider">DERSO</span>
            </div>
            <div className="h-24 rounded-md bg-black/50 border border-amber-800/50 shadow-inner" />

            {/* Left Brass Door Handle */}
            <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2.5 h-9 rounded-sm bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 border border-amber-200 shadow-md" />
          </div>

          {/* Right 3D Door Wing on Hinges */}
          <div
            className="absolute right-2.5 top-2.5 bottom-2.5 w-[calc(50%-10px)] rounded-tr-xl bg-gradient-to-b from-[#3d2315] via-[#22120a] to-[#0f0704] border-l border-amber-500/60 border-2 border-[#5a331e] shadow-2xl transition-transform duration-700 ease-out origin-right flex flex-col justify-between p-2.5"
            style={{
              transform: doorOpen
                ? 'rotateY(90deg)'
                : isHovered
                ? 'rotateY(32deg)'
                : 'rotateY(0deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="h-20 rounded-md bg-amber-100/10 border border-amber-400/50 p-1 flex items-center justify-center shadow-inner">
              <span className="text-[11px] font-serif font-extrabold text-amber-300 tracking-wider">LAB</span>
            </div>
            <div className="h-24 rounded-md bg-black/50 border border-amber-800/50 shadow-inner" />

            {/* Right Brass Door Handle */}
            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-2.5 h-9 rounded-sm bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 border border-amber-200 shadow-md" />
          </div>
        </div>

        {/* Action Prompt */}
        <div className="flex items-center gap-3 pt-2">
          <span className="text-xs font-mono text-amber-300 font-bold tracking-wider animate-pulse">
            {isHovered ? '✦ KAPIYI İTMEK İÇİN TIKLAYIN ✦' : 'KAPIYA DOKUNUN VEYA TIKLAYIN'}
          </span>
          <button
            type="button"
            onClick={handleBellRing}
            className="px-3 py-1 rounded-lg bg-black/80 border border-amber-500/40 text-amber-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1 shadow-md cursor-pointer"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Zil 🔔</span>
          </button>
        </div>
      </div>

      {/* Bottom Live Activity Bar */}
      <div className="absolute bottom-4 inset-x-4 sm:inset-x-8 z-20 p-3 rounded-2xl bg-black/80 border border-white/15 backdrop-blur-xl flex flex-wrap items-center justify-around gap-3 text-xs text-slate-300 font-mono shadow-2xl">
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
