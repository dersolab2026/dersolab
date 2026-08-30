'use client'

import { useRef } from 'react'
import {
  Video,
  Compass,
  ClipboardCheck,
  Coins,
  ShieldCheck,
  TrendingUp,
  CalendarDays,
  Wallet,
  Target,
  Award,
  Users,
  Sparkles,
} from 'lucide-react'

const IKONLAR = {
  ders: Video,
  kocluk: Compass,
  odev: ClipboardCheck,
  kredi: Coins,
  guvenlik: ShieldCheck,
  rapor: TrendingUp,
  takvim: CalendarDays,
  odeme: Wallet,
  hedef: Target,
  rozet: Award,
  topluluk: Users,
  parilti: Sparkles,
} as const

export type FeatureIcon = keyof typeof IKONLAR

interface FeatureCardProps {
  title: string
  body: string
  icon: FeatureIcon
  badge?: string
}

export function FeatureCard({ title, body, icon, badge }: FeatureCardProps) {
  const Icon = IKONLAR[icon] || Sparkles
  const ref = useRef<HTMLDivElement>(null)

  function imlecTakip(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const kutu = el.getBoundingClientRect()
    el.style.setProperty('--isik-x', `${e.clientX - kutu.left}px`)
    el.style.setProperty('--isik-y', `${e.clientY - kutu.top}px`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={imlecTakip}
      className="group relative overflow-hidden rounded-xl border-4 border-[#1B2430] bg-white p-5 transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-[0_6px_0_#1B2430] shadow-[0_3px_0_#1B2430] sm:p-6"
    >
      {/* Imleci takip eden isik */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
        style={{
          background:
            'radial-gradient(260px circle at var(--isik-x, 50%) var(--isik-y, 50%), rgba(111,168,158,0.25), transparent 68%)',
        }}
      />

      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[#1B2430] bg-[#D5EAE3] text-[#1B2430] group-hover:bg-[#DD7B3A] group-hover:text-[#F4F1E8] transition-colors">
            <Icon className="h-5 w-5" strokeWidth={2.2} aria-hidden />
          </div>
          {badge && (
            <span className="text-xs font-black uppercase px-2.5 py-1 rounded-md border-2 border-[#1B2430] bg-[#F4F1E8] text-[#1B2430]">
              {badge}
            </span>
          )}
        </div>
        <p className="mb-1.5 text-lg font-bold text-[#1B2430]">{title}</p>
        <p className="text-base font-semibold leading-relaxed text-[#1B2430]/75">{body}</p>
      </div>
    </div>
  )
}
