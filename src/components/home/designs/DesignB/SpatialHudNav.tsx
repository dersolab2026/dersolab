'use client'

import { Cpu, ShieldAlert, Radio, Activity, Sparkles } from 'lucide-react'
import type { PersonaType } from '../../PersonaSwitcher'

interface SpatialHudNavProps {
  activePersona: PersonaType
  onChange: (persona: PersonaType) => void
}

const MODES: {
  id: PersonaType
  code: string
  title: string
  tag: string
  accentColor: string
  activeRing: string
  icon: typeof Cpu
}[] = [
  {
    id: 'student',
    code: 'SYS // 01',
    title: 'ÖĞRENCİ MATRİXİ',
    tag: 'Hedef & Net Yörüngesi',
    accentColor: 'text-emerald-400',
    activeRing: 'border-emerald-500/80 shadow-[0_0_25px_rgba(16,185,129,0.25)] bg-emerald-950/40',
    icon: Cpu,
  },
  {
    id: 'parent',
    code: 'SYS // 02',
    title: 'VELİ RADARI',
    tag: 'Şeffaf Kalkan & Kredi',
    accentColor: 'text-cyan-400',
    activeRing: 'border-cyan-500/80 shadow-[0_0_25px_rgba(6,182,212,0.25)] bg-cyan-950/40',
    icon: ShieldAlert,
  },
  {
    id: 'instructor',
    code: 'SYS // 03',
    title: 'EĞİTMEN KOKPİTİ',
    tag: 'Otonom Takvim & IBAN',
    accentColor: 'text-amber-400',
    activeRing: 'border-amber-500/80 shadow-[0_0_25px_rgba(245,158,11,0.25)] bg-amber-950/40',
    icon: Radio,
  },
]

export function SpatialHudNav({ activePersona, onChange }: SpatialHudNavProps) {
  return (
    <div className="w-full max-w-4xl mx-auto my-6">
      {/* Top HUD Telemetry Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 mb-2 text-[11px] font-mono text-slate-400 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span>KUANTUM KULLANICI MODU</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-500">
          <span>LATENCY: 0.1ms</span>
          <span>BAĞLANTI: G-MEET SECURE</span>
          <span className="text-emerald-400">AKTİF ✓</span>
        </div>
      </div>

      {/* Futuristic 3-Segment Cockpit HUD Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {MODES.map((m) => {
          const isActive = activePersona === m.id
          const Icon = m.icon

          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange(m.id)}
              className={`relative overflow-hidden p-3.5 sm:p-4 rounded-2xl border backdrop-blur-2xl transition-all duration-300 cursor-pointer text-left ${
                isActive
                  ? `${m.activeRing} text-white`
                  : 'bg-black/40 border-white/10 hover:border-white/20 text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Corner Laser Notch */}
              <div className="absolute top-0 right-0 w-8 h-8 pointer-events-none">
                <div
                  className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${
                    isActive ? 'border-emerald-400' : 'border-white/20'
                  }`}
                />
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono tracking-widest text-slate-400">{m.code}</span>
                <Icon className={`w-4 h-4 ${isActive ? m.accentColor : 'text-slate-500'}`} />
              </div>

              <div className="font-mono font-black text-xs sm:text-sm tracking-wider uppercase mb-0.5">
                {m.title}
              </div>

              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isActive ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                  }`}
                />
                <span className="truncate">{m.tag}</span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
