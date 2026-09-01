'use client'

import { useState } from 'react'
import { Sparkles, Video, Lock } from 'lucide-react'
import { campusSound } from './CampusSoundEngine'

interface Realistic3DDoorProps {
  title: string
  subtitle: string
  doorNumber: string
  accentColor?: string
  isOpen?: boolean
  onClick: () => void
}

export function Realistic3DDoor({
  title,
  subtitle,
  doorNumber,
  accentColor = '#f59e0b',
  isOpen = false,
  onClick,
}: Realistic3DDoorProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = () => {
    setIsHovered(true)
    campusSound.playHandleClick()
  }

  const handleDoorClick = () => {
    campusSound.playDoorOpen()
    onClick()
  }

  return (
    <div
      className="relative flex flex-col items-center cursor-pointer select-none group"
      style={{ perspective: '1200px' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleDoorClick}
    >
      {/* 3D Etched Brass Door Plaque */}
      <div className="mb-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/20 via-black to-amber-500/20 border border-amber-400/60 shadow-[0_4px_15px_rgba(0,0,0,0.8)] text-center backdrop-blur-md">
        <span className="text-[10px] font-mono font-bold text-amber-300 tracking-widest block">
          {doorNumber}
        </span>
        <span className="text-xs font-serif font-extrabold text-white tracking-wider block">
          {title}
        </span>
      </div>

      {/* 3D Physical Door Frame with Deep Wall Recess */}
      <div className="relative w-48 sm:w-56 h-80 sm:h-96 rounded-t-2xl bg-gradient-to-b from-[#1a0f0a] via-[#0f0805] to-black p-2.5 border-4 border-[#3d2417] shadow-[0_20px_60px_rgba(0,0,0,0.95)]">
        {/* Doorway Interior View (Classroom Warmth visible when opened) */}
        <div className="absolute inset-2.5 rounded-t-xl bg-gradient-to-b from-amber-500/25 via-slate-950 to-black overflow-hidden flex flex-col items-center justify-center p-3.5 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-400/25 border-2 border-amber-400 flex items-center justify-center text-amber-200 animate-pulse mb-2 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
            <Sparkles className="w-6 h-6" />
          </div>
          <span className="text-sm font-bold text-white font-serif tracking-wide">{title}</span>
          <span className="text-[11px] text-amber-200/90 mt-1 font-sans leading-tight">{subtitle}</span>
          <div className="mt-3 flex items-center gap-1 text-[10px] text-emerald-400 font-mono font-bold bg-black/80 px-2.5 py-1 rounded-full border border-emerald-500/40">
            <Video className="w-3 h-3" />
            <span>Canlı Meet Odası</span>
          </div>
        </div>

        {/* 3D Physical Door Leaf on Hinges */}
        <div
          className="relative w-full h-full rounded-t-xl bg-gradient-to-b from-[#3a2013] via-[#22120a] to-[#110804] border-2 border-[#5a331e] shadow-2xl transition-transform duration-700 ease-out origin-left flex flex-col justify-between p-3.5"
          style={{
            transform: isOpen
              ? 'rotateY(-85deg)'
              : isHovered
              ? 'rotateY(-28deg)'
              : 'rotateY(0deg)',
            transformStyle: 'preserve-3d',
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(245,158,11,0.04) 0px, rgba(245,158,11,0.04) 2px, transparent 2px, transparent 8px)',
          }}
        >
          {/* Top Beveled Glass Window */}
          <div className="h-28 sm:h-32 rounded-xl bg-gradient-to-b from-amber-100/15 via-white/5 to-transparent border-2 border-amber-400/50 p-2.5 flex flex-col items-center justify-center text-center shadow-inner backdrop-blur-xs">
            <span className="text-[11px] font-serif font-extrabold text-amber-200 tracking-widest uppercase">
              {title}
            </span>
            <div className="w-8 h-0.5 bg-amber-400/50 my-1 rounded-full" />
            <span className="text-[9px] font-mono text-amber-300/80">1:1 ÖZEL DERS</span>
          </div>

          {/* Bottom Traditional Architectural Wood Panels */}
          <div className="grid grid-cols-2 gap-2.5 h-28">
            <div className="rounded-lg border-2 border-[#4d2c1a]/80 bg-black/50 shadow-inner" />
            <div className="rounded-lg border-2 border-[#4d2c1a]/80 bg-black/50 shadow-inner" />
          </div>

          {/* 3D Realistic Brass Door Handle */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <div
              className={`w-3 h-8 rounded-sm bg-gradient-to-r from-amber-300 via-amber-400 to-amber-600 border border-amber-200 shadow-lg transition-transform duration-300 ${
                isHovered ? 'rotate-18' : 'rotate-0'
              }`}
            />
            <div className="w-2 h-2 rounded-full bg-amber-200 shadow-md" />
          </div>

          {/* Keyhole with subtle golden glow */}
          <div className="absolute right-4.5 top-[56%] w-1.5 h-3.5 bg-black rounded-full border border-amber-500/60 shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
        </div>
      </div>

      {/* Hover Action Tooltip */}
      <span className="mt-2.5 text-[11px] font-mono font-bold text-amber-400 group-hover:text-amber-300 transition-colors flex items-center gap-1">
        <span>{isHovered ? '✦ TIKLAYIP GİRİN ✦' : 'KAPIDAN İÇERİ GİR'}</span>
      </span>
    </div>
  )
}
