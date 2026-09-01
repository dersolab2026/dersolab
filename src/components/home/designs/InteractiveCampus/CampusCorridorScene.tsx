'use client'

import { ArrowLeft, Sparkles, ArrowRight, BookOpen, Atom, FlaskConical, Dna } from 'lucide-react'

export type LabType = 'matematik' | 'fizik' | 'kimya' | 'biyoloji'

interface CampusCorridorSceneProps {
  onBack: () => void
  onSelectLab: (lab: LabType) => void
}

const LAB_DOORS: {
  id: LabType
  title: string
  subtitle: string
  icon: typeof Atom
  accentBorder: string
  accentGlow: string
  gradient: string
}[] = [
  {
    id: 'matematik',
    title: 'Matematik Laboratuvarı',
    subtitle: 'TYT & AYT Fonksiyonlar, Türev, İntegral, Geometri',
    icon: BookOpen,
    accentBorder: 'border-amber-400',
    accentGlow: 'shadow-[0_0_35px_rgba(245,158,11,0.5)]',
    gradient: 'from-amber-500/20 via-amber-900/40 to-black',
  },
  {
    id: 'fizik',
    title: 'Fizik Laboratuvarı',
    subtitle: 'Mekanik, Elektrik, Optik, Modern Fizik Seansları',
    icon: Atom,
    accentBorder: 'border-blue-400',
    accentGlow: 'shadow-[0_0_35px_rgba(59,130,246,0.5)]',
    gradient: 'from-blue-500/20 via-blue-900/40 to-black',
  },
  {
    id: 'kimya',
    title: 'Kimya Laboratuvarı',
    subtitle: 'Organik Kimya, Gazlar, Asit-Baz Dengesi, Çözeltiler',
    icon: FlaskConical,
    accentBorder: 'border-emerald-400',
    accentGlow: 'shadow-[0_0_35px_rgba(16,185,129,0.5)]',
    gradient: 'from-emerald-500/20 via-emerald-900/40 to-black',
  },
  {
    id: 'biyoloji',
    title: 'Biyoloji Laboratuvarı',
    subtitle: 'Kalıtım, Hücre Bölünmeleri, Sistemler, Ekoloji',
    icon: Dna,
    accentBorder: 'border-purple-400',
    accentGlow: 'shadow-[0_0_35px_rgba(168,85,247,0.5)]',
    gradient: 'from-purple-500/20 via-purple-900/40 to-black',
  },
]

export function CampusCorridorScene({ onBack, onSelectLab }: CampusCorridorSceneProps) {
  return (
    <div className="relative min-h-[680px] sm:min-h-[780px] rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_80px_rgba(0,0,0,0.9)]">
      {/* Background Image: Futuristic Laboratory Corridor */}
      <img
        src="/campus-corridor-labs.jpg"
        alt="DersoLab Akademik Koridor"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Ambience */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />

      {/* Header Bar */}
      <div className="relative z-10 p-6 sm:p-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/70 hover:bg-black/90 text-amber-300 hover:text-white border border-amber-500/30 text-xs font-bold transition-all cursor-pointer backdrop-blur-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Danışma Masasına Dön</span>
        </button>

        <span className="font-mono text-xs text-amber-200/90 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10">
          AŞAMA III: AKADEMİK KORİDOR
        </span>
      </div>

      {/* Corridor Guide Prompt */}
      <div className="relative z-10 max-w-xl mx-auto px-4 text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>BİR LABORATUVAR SEÇİN VE KAPISINDAN GİRİN</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight drop-shadow-xl">
          Hangi Alanda Özel Ders Almak İstersiniz?
        </h2>
      </div>

      {/* Interactive Laboratory Doors Grid */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 pb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {LAB_DOORS.map((door) => {
          const Icon = door.icon

          return (
            <button
              key={door.id}
              type="button"
              onClick={() => onSelectLab(door.id)}
              className={`p-6 rounded-3xl bg-gradient-to-br ${door.gradient} bg-black/85 border-2 ${door.accentBorder} ${door.accentGlow} backdrop-blur-2xl text-left space-y-4 hover:scale-102 active:scale-98 transition-all cursor-pointer group`}
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-black/40 border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="flex items-center gap-1 text-xs font-bold text-amber-300 font-mono group-hover:translate-x-1 transition-transform">
                  <span>KAPIYI AÇ</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white font-serif tracking-wide">{door.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light mt-1">{door.subtitle}</p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-amber-200/80 font-mono">
                <span>✦ Canlı Eğitmenler Aktif</span>
                <span>Google Meet 1:1</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
