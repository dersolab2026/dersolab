'use client'

import { useState } from 'react'
import {
  ArrowLeft,
  Sparkles,
  ArrowRight,
  BookOpen,
  Atom,
  FlaskConical,
  Dna,
  HelpCircle,
  CheckCircle2,
} from 'lucide-react'
import type { LabType } from './CampusCorridorScene'

interface CorridorSceneEnhancedProps {
  onBack: () => void
  onSelectLab: (lab: LabType) => void
}

const LAB_DOORS: {
  id: LabType
  title: string
  subtitle: string
  icon: typeof Atom
  activeTeachers: number
  topics: string[]
  accentBorder: string
  accentGlow: string
  gradient: string
}[] = [
  {
    id: 'matematik',
    title: 'Matematik Laboratuvarı',
    subtitle: 'TYT & AYT Fonksiyonlar, Türev, İntegral, Geometri',
    icon: BookOpen,
    activeTeachers: 4,
    topics: ['Türev & İntegral', 'Fonksiyonlar', 'Geometri', 'Trigonometri'],
    accentBorder: 'border-amber-400',
    accentGlow: 'shadow-[0_0_35px_rgba(245,158,11,0.5)]',
    gradient: 'from-amber-500/20 via-amber-900/40 to-black',
  },
  {
    id: 'fizik',
    title: 'Fizik Laboratuvarı',
    subtitle: 'Mekanik, Elektrik, Manyetizma, Modern Fizik Seansları',
    icon: Atom,
    activeTeachers: 3,
    topics: ['Dinamik & Newton', 'Elektrik & Manyetizma', 'Dalgalar', 'Optik'],
    accentBorder: 'border-blue-400',
    accentGlow: 'shadow-[0_0_35px_rgba(59,130,246,0.5)]',
    gradient: 'from-blue-500/20 via-blue-900/40 to-black',
  },
  {
    id: 'kimya',
    title: 'Kimya Laboratuvarı',
    subtitle: 'Organik Kimya, Gazlar, Asit-Baz Dengesi, Çözeltiler',
    icon: FlaskConical,
    activeTeachers: 3,
    topics: ['Organik Kimya', 'Kimyasal Denge', 'Gazlar & Sıvılar', 'Elektrokimya'],
    accentBorder: 'border-emerald-400',
    accentGlow: 'shadow-[0_0_35px_rgba(16,185,129,0.5)]',
    gradient: 'from-emerald-500/20 via-emerald-900/40 to-black',
  },
  {
    id: 'biyoloji',
    title: 'Biyoloji Laboratuvarı',
    subtitle: 'Kalıtım, Hücre Bölünmeleri, Sistemler, Ekoloji',
    icon: Dna,
    activeTeachers: 2,
    topics: ['İnsan Fizyolojisi', 'Kalıtım & Genetik', 'Hücre Solunumu', 'Fotosentez'],
    accentBorder: 'border-purple-400',
    accentGlow: 'shadow-[0_0_35px_rgba(168,85,247,0.5)]',
    gradient: 'from-purple-500/20 via-purple-900/40 to-black',
  },
]

export function CorridorSceneEnhanced({ onBack, onSelectLab }: CorridorSceneEnhancedProps) {
  const [hoveredDoor, setHoveredDoor] = useState<LabType | null>(null)
  const [showBulletinBoard, setShowBulletinBoard] = useState(false)

  return (
    <div className="relative min-h-[700px] sm:min-h-[820px] rounded-3xl overflow-hidden border-2 border-amber-500/50 shadow-[0_0_90px_rgba(0,0,0,0.95)] select-none">
      {/* Background Image: High-Tech Laboratory Corridor */}
      <img
        src="/campus-corridor-labs.jpg"
        alt="DersoLab Akademik Koridor"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Atmospheric Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70 pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-20 p-5 sm:p-8 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/80 hover:bg-black text-amber-300 hover:text-white border border-amber-500/40 text-xs font-bold transition-all cursor-pointer backdrop-blur-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Danışma Masasına Dön</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Bulletin Board Button */}
          <button
            type="button"
            onClick={() => setShowBulletinBoard(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 text-blue-200 text-xs font-bold transition-all cursor-pointer backdrop-blur-xl"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>Koridor Soru Panosu 📋</span>
          </button>
        </div>
      </div>

      {/* Corridor Guide Prompt */}
      <div className="relative z-20 max-w-xl mx-auto px-4 text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-mono font-bold border border-amber-400/30">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>BİR LABORATUVAR SEÇİN VE KAPISINDAN GİRİN</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white font-serif tracking-tight drop-shadow-xl">
          Hangi Alanda Özel Ders Almak İstersiniz?
        </h2>
      </div>

      {/* Interactive Laboratory Doors Grid */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 pb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {LAB_DOORS.map((door) => {
          const Icon = door.icon
          const isHovered = hoveredDoor === door.id

          return (
            <button
              key={door.id}
              type="button"
              onMouseEnter={() => setHoveredDoor(door.id)}
              onMouseLeave={() => setHoveredDoor(null)}
              onClick={() => onSelectLab(door.id)}
              className={`p-6 rounded-3xl bg-gradient-to-br ${door.gradient} bg-black/90 border-2 ${door.accentBorder} ${door.accentGlow} backdrop-blur-2xl text-left space-y-4 hover:scale-[1.03] active:scale-98 transition-all cursor-pointer group`}
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-black/50 border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    ● {door.activeTeachers} Eğitmen Canlı
                  </span>
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-300 font-mono group-hover:translate-x-1 transition-transform">
                    <span>GİRİŞ</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white font-serif tracking-wide">{door.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-light mt-1">{door.subtitle}</p>
              </div>

              {/* Topic Chips */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {door.topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-white/[0.06] text-amber-200 border border-white/10 font-mono"
                  >
                    ✦ {t}
                  </span>
                ))}
              </div>
            </button>
          )
        })}
      </div>

      {/* Bulletin Board Modal */}
      {showBulletinBoard && (
        <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-3xl bg-slate-950 border-2 border-blue-500/50 p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📋</span>
                <h3 className="text-lg font-bold text-white font-serif">Koridor Soru & Hedef Panosu</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowBulletinBoard(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕ Kapat
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-white/[0.05] border border-white/10 space-y-1">
                <span className="text-amber-300 font-bold font-mono">Ali K. (YKS 2026):</span>
                <p>"İntegral hacim formülünü bir türlü oturtamıyordum, Selim Hoca ile 45 dakikalık Meet seansında 3 farklı soru tipini tek formüle bağladık."</p>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.05] border border-white/10 space-y-1">
                <span className="text-blue-300 font-bold font-mono">Elif S. (LGS 2026):</span>
                <p>"Makaralar ve eğik düzlem karma sorularını Ahmet Hoca tahtada simülasyonla gösterince kafamda tam oturdu!"</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowBulletinBoard(false)
                onSelectLab('matematik')
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-amber-500 text-slate-950 font-bold text-xs cursor-pointer shadow-lg"
            >
              Matematik Laboratuvarına Geç →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
