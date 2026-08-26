'use client'

import { useRef } from 'react'
import {
  Video, Compass, ClipboardCheck, Coins,
  CalendarCheck, Wallet, ShieldCheck, Eye, BellRing,
} from 'lucide-react'

/**
 * Ana sayfadaki ozellik karti.
 *
 * Eski hali duz beyaz bir kutuydu: 4px cerceve, golge yok, ikon yok.
 * Buradaki üç ekleme kimligi degistirmeden derinlik veriyor:
 *
 *   1. Imleci takip eden yumusak isik (spotlight). Renk markanin teali;
 *      disaridan bir bilesen kopyalanmadi, kendi tokenlarimizla yazildi.
 *   2. Hover'da hafif yukselme + sert golge — pixel dilimizin kendi
 *      hareketi, yabanci bir efekt degil.
 *   3. Cizgisel ikon: kartlar artik goz taramasiyla ayirt ediliyor.
 *
 * Isik yalnizca imlec varken calisiyor; dokunmatik cihazda hover
 * olmadigi icin kart sade haliyle kaliyor, bu kasitli.
 */

/**
 * Ikon BILESEN olarak degil, ANAHTAR olarak geliyor.
 *
 * page.tsx bir Server Component; oradan buraya fonksiyon (React bileseni)
 * gecirilemiyor — React onu serilestiremiyor ve calisma aninda
 * "Functions cannot be passed directly to Client Components" hatasi
 * veriyor. Dikkat: bu hatayi `npm run build` YAKALAMIYOR, yalnizca
 * calistirinca goruluyor.
 */
const IKONLAR = {
  ders: Video,
  kocluk: Compass,
  odev: ClipboardCheck,
  kredi: Coins,
  takvim: CalendarCheck,
  odeme: Wallet,
  onay: ShieldCheck,
  gorunum: Eye,
  bildirim: BellRing,
} as const

export type FeatureIcon = keyof typeof IKONLAR

interface FeatureCardProps {
  title: string
  body: string
  icon: FeatureIcon
}

export function FeatureCard({ title, body, icon }: FeatureCardProps) {
  const Icon = IKONLAR[icon]
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
      className="group relative overflow-hidden rounded-xl border-4 border-[var(--cizgi)] bg-[var(--yuzey-ic)] p-5 transition-transform duration-200 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-6"
    >
      {/* Imleci takip eden isik */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 motion-reduce:transition-none"
        style={{
          background:
            'radial-gradient(260px circle at var(--isik-x, 50%) var(--isik-y, 50%), rgba(111,168,158,0.22), transparent 68%)',
        }}
      />

      <div className="relative">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border-2 border-[var(--cizgi)] bg-[var(--zemin)]">
          <Icon className="h-5 w-5 text-[var(--yazi)]" strokeWidth={2.2} aria-hidden />
        </div>
        <p className="dl-kart-basligi mb-1.5 text-lg font-bold text-[var(--yazi)]">{title}</p>
        <p className="text-base font-semibold leading-relaxed text-[var(--yazi)]/70">{body}</p>
      </div>
    </div>
  )
}
