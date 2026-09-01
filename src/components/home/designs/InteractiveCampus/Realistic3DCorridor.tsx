'use client'

import { useState } from 'react'
import { ArrowLeft, Sparkles, HelpCircle } from 'lucide-react'
import { Realistic3DDoor } from './Realistic3DDoor'
import type { LabType } from './CampusCorridorScene'

interface Realistic3DCorridorProps {
  onBack: () => void
  onSelectLab: (lab: LabType) => void
}

const DOORS: {
  id: LabType
  title: string
  subtitle: string
  doorNumber: string
  accentColor: string
}[] = [
  {
    id: 'matematik',
    title: 'Matematik Labı',
    subtitle: 'Türev, İntegral & Geometri',
    doorNumber: 'LAB-101',
    accentColor: '#f59e0b',
  },
  {
    id: 'fizik',
    title: 'Fizik Labı',
    subtitle: 'Mekanik & Elektrik',
    doorNumber: 'LAB-201',
    accentColor: '#3b82f6',
  },
  {
    id: 'kimya',
    title: 'Kimya Labı',
    subtitle: 'Organik & Kimyasal Denge',
    doorNumber: 'LAB-301',
    accentColor: '#10b981',
  },
  {
    id: 'biyoloji',
    title: 'Biyoloji Labı',
    subtitle: 'Kalıtım & Fizyoloji',
    doorNumber: 'LAB-401',
    accentColor: '#a855f7',
  },
]

export function Realistic3DCorridor({ onBack, onSelectLab }: Realistic3DCorridorProps) {
  const [openingLab, setOpeningLab] = useState<LabType | null>(null)

  const handleDoorClick = (labId: LabType) => {
    setOpeningLab(labId)
    setTimeout(() => {
      onSelectLab(labId)
    }, 700)
  }

  return (
    <div className="relative min-h-[700px] sm:min-h-[820px] rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-[0_0_90px_rgba(0,0,0,0.95)] select-none">
      {/* Background Image: Corridor Perspective with Dynamic Zoom on Door Open */}
      <img
        src="/campus-corridor-labs.jpg"
        alt="DersoLab 3D Koridor"
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-in-out ${
          openingLab ? 'scale-120' : 'scale-100'
        }`}
      />

      {/* Atmospheric Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70 pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-20 p-5 sm:p-8 flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/80 hover:bg-black text-amber-300 hover:text-white border border-amber-500/40 text-xs font-bold transition-all cursor-pointer backdrop-blur-xl shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Danışma Masasına Dön</span>
        </button>

        <div className="px-4 py-2 rounded-2xl bg-black/85 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold backdrop-blur-xl shadow-lg">
          AŞAMA III: 3 BOYUTLU LABORATUVAR KORİDORU
        </div>
      </div>

      {/* Corridor Guide Prompt */}
      <div className="relative z-20 max-w-xl mx-auto px-4 text-center space-y-2 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-400/40">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>KAPIYA TIKLAYARAK LABORATUVARIN İÇİNE GİRİN</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight drop-shadow-2xl">
          Akademik Laboratuvarlar
        </h2>
      </div>

      {/* 3D Physical Doors Gallery in Perspective */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 pb-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 justify-items-center">
        {DOORS.map((d) => (
          <Realistic3DDoor
            key={d.id}
            title={d.title}
            subtitle={d.subtitle}
            doorNumber={d.doorNumber}
            accentColor={d.accentColor}
            isOpen={openingLab === d.id}
            onClick={() => handleDoorClick(d.id)}
          />
        ))}
      </div>

      {/* Bottom Corridor Floor Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-6 py-2 rounded-full bg-black/80 border border-amber-500/30 text-amber-200/90 text-xs font-mono backdrop-blur-xl">
        ✦ FİZİKSEL 3D KAPI MEKANİZMASI: ÜZERİNE GELİNCE ARALANIR, TIKLAYINCA AÇILIR ✦
      </div>
    </div>
  )
}
