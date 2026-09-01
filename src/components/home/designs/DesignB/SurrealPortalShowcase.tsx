'use client'

import { useState } from 'react'
import { Key, Lock, Eye, Video, Sparkles, Moon, Flame, ShieldCheck, Compass, Orbit, Wallet, Calendar } from 'lucide-react'
import type { PersonaType } from '../../PersonaSwitcher'

interface PortalData {
  numeral: string
  title: string
  subtitle: string
  desc: string
  glyph: typeof Video
  accent: string
  glowBg: string
  color: string
}

const PORTALS_BY_PERSONA: Record<PersonaType, { headerTag: string; heading: string; portals: PortalData[] }> = {
  student: {
    headerTag: '✦ RÜYA I · ÖĞRENCİ MATRİXİ ✦',
    heading: 'Zamanın Büküldüğü 3 Boyut',
    portals: [
      {
        numeral: 'PORTAL I · RUBER',
        title: 'Kırmızı Odanın Canlı Kapısı',
        subtitle: 'Google Meet HD Seansı',
        desc: 'Rezervasyon anında perdenin arkasındaki canlı ders odası açılır. Eğitmeninizle sıfır gecikmeli, kesintisiz 1:1 bağlantı.',
        glyph: Video,
        accent: 'border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.25)]',
        glowBg: 'from-red-950/80 via-red-900/30 to-black',
        color: 'text-red-400',
      },
      {
        numeral: 'PORTAL II · AUREUS',
        title: 'Eriyen Saatlerin Altın Kasası',
        subtitle: 'Süresiz Yanmayan Kredi',
        desc: 'Ders kredileriniz zamana karşı bağışıktır. Kullanmadığınız seanslar hesabınızda güvende kalır, istediğiniz gün kullanılır.',
        glyph: Lock,
        accent: 'border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.25)]',
        glowBg: 'from-amber-950/80 via-amber-900/30 to-black',
        color: 'text-amber-400',
      },
      {
        numeral: 'PORTAL III · OCULUS',
        title: 'Görünmeyen Bilgelik Gözü',
        subtitle: 'Entegre Bireysel Koçluk',
        desc: 'Haftalık hedefler, deneme sınavı analizleri ve ödev takibi tek bir şeffaf aynada birleşir. Sınav sisini tamamen dağıtın.',
        glyph: Compass,
        accent: 'border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.25)]',
        glowBg: 'from-purple-950/80 via-red-950/30 to-black',
        color: 'text-purple-400',
      },
    ],
  },
  parent: {
    headerTag: '✦ RÜYA II · VELİ GÜVENCE KALKANI ✦',
    heading: 'Hakikat Aynasında 3 Temel İlke',
    portals: [
      {
        numeral: 'PORTAL I · VERITAS',
        title: 'Hakikat Aynası & Rapor',
        subtitle: 'Yazılı Seans Değerlendirmesi',
        desc: 'Her dersin ardından öğretmenin bıraktığı katılım, anlama ve ödev notlarını doğrudan veli panelinizden okuyun.',
        glyph: Eye,
        accent: 'border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.25)]',
        glowBg: 'from-emerald-950/80 via-teal-900/30 to-black',
        color: 'text-emerald-400',
      },
      {
        numeral: 'PORTAL II · CUSTODIA',
        title: 'Bakiye Koruma Kalkanı',
        subtitle: 'Süresiz Geçerli Kredi',
        desc: 'Satın aldığınız hiçbir paket ay sonunda yanmaz veya silinmez. Bütçeniz mutlak güvence altındadır.',
        glyph: ShieldCheck,
        accent: 'border-teal-500/50 shadow-[0_0_40px_rgba(20,184,166,0.25)]',
        glowBg: 'from-teal-950/80 via-emerald-950/30 to-black',
        color: 'text-teal-400',
      },
      {
        numeral: 'PORTAL III · DIPLOMA',
        title: 'Belgeli Öğretmen Süzgeci',
        subtitle: '%100 Onaylı Kadro',
        desc: 'Platformdaki her eğitmenin diploması ve akademik yetkinliği yönetim ekibimizce tek tek tescillenir.',
        glyph: Lock,
        accent: 'border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.25)]',
        glowBg: 'from-amber-950/80 via-red-950/30 to-black',
        color: 'text-amber-400',
      },
    ],
  },
  instructor: {
    headerTag: '✦ RÜYA III · KOZMİK EĞİTMEN SAHNESİ ✦',
    heading: 'Egemen Özgürlüğün 3 Sütunu',
    portals: [
      {
        numeral: 'PORTAL I · SYNCHRONIA',
        title: 'Göksel Takvim Eşitlemesi',
        subtitle: 'Otomatik Google Meet',
        desc: 'Müsaitlik saatlerinizi işaretleyin; öğrenci seçtiğinde takvim davetiyesi ve Meet odası kendiliğinden oluşsun.',
        glyph: Calendar,
        accent: 'border-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.25)]',
        glowBg: 'from-purple-950/80 via-indigo-900/30 to-black',
        color: 'text-purple-400',
      },
      {
        numeral: 'PORTAL II · FISCUS',
        title: 'Zamanında Banka Hakedişi',
        subtitle: 'Aylık Düzenli IBAN Transferi',
        desc: 'Verdiğiniz derslerin ödemesi her ay şeffaf ve eksiksiz biçimde doğrudan banka hesabınıza aktarılır.',
        glyph: Wallet,
        accent: 'border-amber-500/50 shadow-[0_0_40px_rgba(245,158,11,0.25)]',
        glowBg: 'from-amber-950/80 via-purple-950/30 to-black',
        color: 'text-amber-400',
      },
      {
        numeral: 'PORTAL III · LIBERTAS',
        title: 'Bağımsız Çalışma Alanı',
        subtitle: 'Sıfır Operasyon Yükü',
        desc: 'Link paylaşma veya ödeme takibi yapmadan, sadece kendi uzmanlığınıza odaklanarak özgürce ders verin.',
        glyph: Orbit,
        accent: 'border-rose-500/50 shadow-[0_0_40px_rgba(244,63,94,0.25)]',
        glowBg: 'from-rose-950/80 via-amber-950/30 to-black',
        color: 'text-rose-400',
      },
    ],
  },
}

export function SurrealPortalShowcase({ persona }: { persona: PersonaType }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const data = PORTALS_BY_PERSONA[persona]

  return (
    <div className="space-y-6 font-serif">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-serif tracking-[0.35em] uppercase text-amber-400/90 animate-lynch-flicker">
          {data.headerTag}
        </span>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
          {data.heading}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.portals.map((p, idx) => {
          const Glyph = p.glyph
          const isHovered = hoveredIdx === idx

          return (
            <div
              key={p.numeral}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`group relative overflow-hidden rounded-3xl bg-black/80 border-2 ${p.accent} backdrop-blur-3xl p-6 sm:p-8 transition-all duration-500 ${
                isHovered ? '-translate-y-2 scale-[1.02] shadow-[0_0_50px_rgba(245,158,11,0.3)]' : ''
              }`}
            >
              <div
                className={`pointer-events-none absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br ${p.glowBg} rounded-full blur-2xl transition-opacity duration-500 ${
                  isHovered ? 'opacity-90' : 'opacity-40'
                }`}
              />

              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-[11px] font-serif tracking-widest text-amber-300/90 font-bold">{p.numeral}</span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-white/[0.06] text-amber-200 border border-amber-500/20">
                  {p.subtitle}
                </span>
              </div>

              <div className="relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br from-red-950 via-black to-amber-950 border border-amber-500/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-xl">
                <Glyph className={`w-7 h-7 ${p.color}`} />
              </div>

              <h3 className="relative z-10 text-xl font-bold text-white font-serif mb-2 tracking-wide">
                {p.title}
              </h3>

              <p className="relative z-10 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans font-light">
                {p.desc}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
