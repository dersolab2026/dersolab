'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Key, Eye, Moon, Hourglass, ShieldCheck } from 'lucide-react'
import type { PersonaType } from '../../PersonaSwitcher'

interface SurrealHeroProps {
  persona: PersonaType
}

const SURREAL_CONFIG: Record<
  PersonaType,
  {
    kicker: string
    titleLead: string
    titleGlow: string
    titleEnd: string
    poetry: string
    ctaPrimary: { text: string; href: string }
    ctaSecondary: { text: string; href: string }
    latinMotto: string
    mysticChips: string[]
    artwork: string
    frameBadge: string
    frameCaption: string
    frameBadgeRight: string
    glowClass: string
    frameBorderClass: string
  }
> = {
  student: {
    kicker: 'SURREALİST ÖĞRENME ALANI',
    titleLead: 'Burası bilginin',
    titleGlow: 'rüyalarla büküldüğü,',
    titleEnd: 'zamanın durduğu yer.',
    poetry:
      'LGS ve YKS hazırlığında kaybolan saatlere veda et. Google Meet portalından doğrudan uzman zihinle bağlan; eriyen saatlerin içinde süresi asla bitmeyen ders kredileriyle hedefine yürü.',
    ctaPrimary: { text: '20 Dk Ücretsiz Tanışma Portalı', href: '/demo-ders' },
    ctaSecondary: { text: 'Eğitmen Galerisini Aç', href: '/instructors' },
    latinMotto: 'TEMPUS NON PERIT · SCIENTIA AETERNA',
    mysticChips: ['Google Meet Canlı Portalı', 'Yanmayan Kredi Mimarisi', 'Bireysel Koçluk Gözü'],
    artwork: '/dali-lynch-fox.jpg',
    frameBadge: 'TEMPUS · ERİYEN SAATLER',
    frameCaption: '"Zaman akıp giden bir kum tanesi değil, hedefe açılan altın bir anahtardır."',
    frameBadgeRight: '∞ KREDİ',
    glowClass: 'from-red-600/35 via-amber-600/25 to-purple-600/25',
    frameBorderClass: 'border-amber-500/50',
  },
  parent: {
    kicker: 'MUTLAK HAKİKAT VE KORUMA',
    titleLead: 'Hakikat aynasında',
    titleGlow: 'sıfır illüzyon,',
    titleEnd: 'kusursuz şeffaflık.',
    poetry:
      'Öğretmenlerin belgeleri tescilli, derslerin her dakikası kayıt altında. Çocuğunuzun eğitimini belirsizliklerin sisinden arındırılmış şeffaf bir veli gözüyle izleyin.',
    ctaPrimary: { text: 'Veli Portalına Adım At', href: '/register?role=parent' },
    ctaSecondary: { text: 'Güvence Manifestosu', href: '/instructors' },
    latinMotto: 'VERITAS ABSOLUTA · CUSTODIA FIDELIS',
    mysticChips: ['%100 Onaylı Eğitmenler', 'Yazılı Seans Raporu', 'Süresiz Kredi Güvencesi'],
    artwork: '/dali-lynch-parent.jpg',
    frameBadge: 'VERITAS · HAKİKAT AYNASI',
    frameCaption: '"Kırmızı odanın perdesi aralandığında geriye yalnızca saf gerçek kalır."',
    frameBadgeRight: '%100 ONAY',
    glowClass: 'from-emerald-600/35 via-teal-600/25 to-red-600/25',
    frameBorderClass: 'border-emerald-500/50',
  },
  instructor: {
    kicker: 'EGEMEN SAHNE VE ZAMAN',
    titleLead: 'Kendi evreninin',
    titleGlow: 'egemen efendisi ol,',
    titleEnd: 'altın anahtarı çevir.',
    poetry:
      'Müsait olduğun saatleri işaretle; Google Meet odaları kendiliğinden açılsın. Gereksiz operasyonlar eriyip yok olurken, aylık net kazancın doğrudan banka hesabına aksın.',
    ctaPrimary: { text: 'Eğitmen Kapısını Arala', href: '/register?role=instructor' },
    ctaSecondary: { text: 'Sahne Kılavuzu', href: '/dashboard/instructor/nasil-calisir' },
    latinMotto: 'DOMINUS TEMPORIS · AUREA CLAVIS',
    mysticChips: ['Otomatik Takvim Senkronizasyonu', 'Aylık Düzenli IBAN Aktarımı', 'Sıfır Komisyon Başlangıç'],
    artwork: '/dali-lynch-instructor.jpg',
    frameBadge: 'SOVEREIGN · KOZMİK SAHNE',
    frameCaption: '"Bilgi evrenin en saf enerjisidir; zamanı kendi iradenizle yönetin."',
    frameBadgeRight: 'AYLIK IBAN',
    glowClass: 'from-purple-600/35 via-amber-600/25 to-indigo-600/25',
    frameBorderClass: 'border-purple-500/50',
  },
}

export function SurrealHero({ persona }: SurrealHeroProps) {
  const data = SURREAL_CONFIG[persona]
  const [rotate, setRotate] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setRotate({ x: -y * 14, y: x * 14 })
  }

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 })
  }

  return (
    <div className="relative py-6 sm:py-12">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Surreal Poetry & Action */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          {/* Surreal Velvet Kicker */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-950/70 border border-amber-500/40 text-amber-300 text-xs font-serif tracking-widest backdrop-blur-xl shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>{data.kicker}</span>
          </div>

          {/* Avant-Garde Title with Lynchian Neon Flicker */}
          <h1 className="text-3xl sm:text-5xl lg:text-[3.35rem] font-serif font-extrabold text-white tracking-tight leading-[1.14] text-balance">
            {data.titleLead}{' '}
            <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-amber-500 bg-clip-text text-transparent italic underline decoration-amber-400/40 decoration-wavy decoration-1 underline-offset-8 animate-lynch-flicker">
              {data.titleGlow}
            </span>{' '}
            {data.titleEnd}
          </h1>

          {/* Dreamlike Narrative */}
          <p className="text-base sm:text-lg text-slate-300 font-light leading-relaxed max-w-xl mx-auto lg:mx-0 font-sans">
            {data.poetry}
          </p>

          {/* Surrealist Buttons with Pulsing Golden Aura */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
            <Link
              href={data.ctaPrimary.href}
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-red-600 text-slate-950 font-serif font-bold text-sm sm:text-base shadow-[0_0_35px_rgba(245,158,11,0.5)] hover:shadow-[0_0_60px_rgba(245,158,11,0.8)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Key className="w-4 h-4 text-slate-950 group-hover:rotate-45 transition-transform duration-500" />
              <span>{data.ctaPrimary.text}</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </Link>
            <Link
              href={data.ctaSecondary.href}
              className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-4 rounded-xl bg-black/60 text-amber-200 font-serif text-sm sm:text-base border border-amber-500/40 hover:bg-amber-950/40 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all cursor-pointer backdrop-blur-xl"
            >
              {data.ctaSecondary.text}
            </Link>
          </div>

          {/* Latin Subtext & Surreal Chips */}
          <div className="pt-4 border-t border-amber-500/20 space-y-3">
            <p className="text-[11px] font-serif tracking-[0.3em] text-amber-400/80 uppercase">
              {data.latinMotto}
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
              {data.mysticChips.map((chip, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-lg bg-black/60 border border-amber-500/20 text-xs font-sans text-amber-100/90 shadow-sm hover:border-amber-400/60 transition-colors"
                >
                  ✦ {chip}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Museum Piece with Dynamic 3D Perspective Tilt & Bespoke Role Artwork */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full max-w-sm transition-transform duration-200 ease-out"
            style={{
              transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
            }}
          >
            {/* Surreal Crimson Velvet Aura */}
            <div
              className={`pointer-events-none absolute -inset-6 bg-gradient-to-tr ${data.glowClass} rounded-3xl blur-3xl opacity-90 animate-pulse-glow`}
            />

            {/* Baroque / Avant-Garde Frame */}
            <div
              className={`relative rounded-3xl bg-black/85 border-2 ${data.frameBorderClass} p-4 shadow-[0_0_60px_rgba(245,158,11,0.3)] backdrop-blur-3xl overflow-hidden group`}
            >
              {/* Frame Header */}
              <div className="flex items-center justify-between pb-3 border-b border-amber-500/30 font-serif text-xs text-amber-300">
                <span className="tracking-widest flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '24s' }} />
                  <span>{data.frameBadge}</span>
                </span>
                <span className="font-mono text-[10px] text-amber-400/80 animate-lynch-flicker">
                  SALVADOR DALÍ × DAVID LYNCH
                </span>
              </div>

              {/* Masterpiece Image Container */}
              <div className="relative my-3 rounded-2xl overflow-hidden border border-amber-500/20 aspect-square shadow-2xl">
                <img
                  src={data.artwork}
                  alt="DersoLab Dalí x Lynch Artwork"
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                {/* Floating Dalí Melting Time Watermark Badge with Pulsing Droplet */}
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-black/80 backdrop-blur-md border border-amber-500/40 flex items-center justify-between text-xs font-serif text-amber-200 shadow-xl">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    <span>DersoLab Boyutu</span>
                  </span>
                  <span className="font-mono font-bold text-amber-400 tracking-wider">
                    {data.frameBadgeRight}
                  </span>
                </div>
              </div>

              <p className="text-[11px] font-serif text-center text-amber-100/70 italic pt-1">
                {data.frameCaption}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
