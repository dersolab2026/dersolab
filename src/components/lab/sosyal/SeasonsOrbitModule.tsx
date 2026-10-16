'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Sun,
  Globe2,
  Calendar,
  Compass,
  Sparkles,
  Info,
  Clock,
  ArrowRight,
  HelpCircle,
} from 'lucide-react'

type OrbitPosition = 'june' | 'september' | 'december' | 'march'

interface PositionData {
  id: OrbitPosition
  name: string
  date: string
  sunRayTarget: string
  northHemisphere: string
  southHemisphere: string
  dayNightInfo: string
  sunAngleNorth: number // degrees
  shadowLength: string
  desc: string
}

const POSITIONS: Record<OrbitPosition, PositionData> = {
  june: {
    id: 'june',
    name: '21 Haziran (Yaz Gündönümü)',
    date: '21 Haziran',
    sunRayTarget: 'Yengeç Dönencesi (23° 27\' K)',
    northHemisphere: 'YAZ Başlangıcı (En uzun gündüz, en kısa gece)',
    southHemisphere: 'KIŞ Başlangıcı (En uzun gece, en kısa gündüz)',
    dayNightInfo: 'Kuzey Kutup Dairesi\'nde 24 saat gündüz (Gece yarısı güneşi).',
    sunAngleNorth: 73.5,
    shadowLength: 'En Kısa Gölge Boyu',
    desc: 'Güneş ışınları öğle vakti Yengeç Dönencesi’ne 90° dik açıyla düşer. Birim yüzeye aktarılan ısı enerjisi Kuzey Yarımküre’de maksimumdur.',
  },
  september: {
    id: 'september',
    name: '23 Eylül (Sonbahar Ekinoksu)',
    date: '23 Eylül',
    sunRayTarget: 'Ekvator (0°)',
    northHemisphere: 'SONBAHAR Başlangıcı',
    southHemisphere: 'İLKBAHAR Başlangıcı',
    dayNightInfo: 'Tüm Dünya\'da 12 saat gece, 12 saat gündüz eşitliği (Ekinoks).',
    sunAngleNorth: 50.0,
    shadowLength: 'Orta Seviye Gölge Boyu',
    desc: 'Güneş ışınları Ekvator’a dik açıyla düşer. Aydınlanma çemberi kutup noktalarından teğet geçer. Her iki yarımkürede de gece-gündüz eşittir.',
  },
  december: {
    id: 'december',
    name: '21 Aralık (Kış Gündönümü)',
    date: '21 Aralık',
    sunRayTarget: 'Oğlak Dönencesi (23° 27\' G)',
    northHemisphere: 'KIŞ Başlangıcı (En uzun gece, en kısa gündüz)',
    southHemisphere: 'YAZ Başlangıcı (En uzun gündüz, en kısa gece)',
    dayNightInfo: 'Kuzey Kutup Dairesi\'nde 24 saat gece; Güney Kutbu\'nda 24 saat gündüz.',
    sunAngleNorth: 26.5,
    shadowLength: 'En Uzun Gölge Boyu',
    desc: 'Güneş ışınları öğle vakti Oğlak Dönencesi’ne 90° dik açıyla düşer. Kuzey Yarımküre’ye eğik açıyla geldiği için birim yüzeye düşen enerji minimumdur.',
  },
  march: {
    id: 'march',
    name: '21 Mart (İlkbahar Ekinoksu)',
    date: '21 Mart',
    sunRayTarget: 'Ekvator (0°)',
    northHemisphere: 'İLKBAHAR Başlangıcı',
    southHemisphere: 'SONBAHAR Başlangıcı',
    dayNightInfo: 'Tüm Dünya\'da 12 saat gece, 12 saat gündüz eşitliği (Ekinoks).',
    sunAngleNorth: 50.0,
    shadowLength: 'Orta Seviye Gölge Boyu',
    desc: 'Güneş ışınları Ekvator çizgisine 90° dik açıyla düşer. Kuzey Yarımküre’de kış biter, ilkbahar başlar.',
  },
}

export function SeasonsOrbitModule() {
  const [activePos, setActivePos] = useState<OrbitPosition>('june')
  const cur = POSITIONS[activePos]

  return (
    <div className="space-y-6">
      {/* ── Header Card ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              8. Sınıf LGS 1. Ünite & 9. Sınıf Coğrafya
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              Eksen Eğikliği: 23° 27&apos;
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Mevsimlerin Oluşumu & Dünya’nın Yıllık Hareketi
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            23° 27&apos; eksen eğikliği ve elips yörüngede dolanma hareketinin mevsimlere, güneş ışınlarının geliş açısına, gölge boyuna ve gece-gündüz sürelerine etkisini simüle edin.
          </p>
        </div>

        {/* Date Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
          {(Object.keys(POSITIONS) as OrbitPosition[]).map((posKey) => (
            <button
              key={posKey}
              type="button"
              onClick={() => setActivePos(posKey)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activePos === posKey
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {POSITIONS[posKey].date}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Canvas & Controls Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Orbit Visualization (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="relative h-[360px] sm:h-[420px] w-full rounded-3xl bg-[#030712] border border-slate-800/90 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between z-10">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-400" />
                {cur.name}
              </span>
              <span className="text-xs font-bold text-slate-300 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800">
                Güneş Açısı (Türkiye): <strong className="text-amber-400">{cur.sunAngleNorth}°</strong>
              </span>
            </div>

            {/* Orbit SVG Graphic */}
            <div className="relative flex-1 w-full flex items-center justify-center">
              <svg className="w-full h-full max-w-[460px]" viewBox="0 0 460 260">
                <defs>
                  <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" />
                    <stop offset="40%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Elliptical Orbit Track */}
                <ellipse cx="230" cy="130" rx="190" ry="85" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="4,4" />

                {/* Sun in Center */}
                <circle cx="230" cy="130" r="38" fill="url(#sunGlow)" />
                <circle cx="230" cy="130" r="22" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
                <text x="230" y="134" fill="#78350f" fontSize="10" fontWeight="bold" textAnchor="middle">
                  GÜNEŞ
                </text>

                {/* 4 Orbital Positions on Ellipse */}
                {/* 1. June (Left) */}
                <g
                  className="cursor-pointer"
                  onClick={() => setActivePos('june')}
                  opacity={activePos === 'june' ? 1 : 0.45}
                >
                  <circle cx="50" cy="130" r="20" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                  {/* Earth Tilted Axis (23.5 degrees) */}
                  <line x1="42" y1="102" x2="58" y2="158" stroke="#f59e0b" strokeWidth="2" />
                  <text x="50" y="172" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                    21 Haziran
                  </text>
                </g>

                {/* 2. September (Top) */}
                <g
                  className="cursor-pointer"
                  onClick={() => setActivePos('september')}
                  opacity={activePos === 'september' ? 1 : 0.45}
                >
                  <circle cx="230" cy="45" r="20" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="222" y1="17" x2="238" y2="73" stroke="#f59e0b" strokeWidth="2" />
                  <text x="230" y="80" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                    23 Eylül
                  </text>
                </g>

                {/* 3. December (Right) */}
                <g
                  className="cursor-pointer"
                  onClick={() => setActivePos('december')}
                  opacity={activePos === 'december' ? 1 : 0.45}
                >
                  <circle cx="410" cy="130" r="20" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="402" y1="102" x2="418" y2="158" stroke="#f59e0b" strokeWidth="2" />
                  <text x="410" y="172" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                    21 Aralık
                  </text>
                </g>

                {/* 4. March (Bottom) */}
                <g
                  className="cursor-pointer"
                  onClick={() => setActivePos('march')}
                  opacity={activePos === 'march' ? 1 : 0.45}
                >
                  <circle cx="230" cy="215" r="20" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="222" y1="187" x2="238" y2="243" stroke="#f59e0b" strokeWidth="2" />
                  <text x="230" y="250" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                    21 Mart
                  </text>
                </g>
              </svg>
            </div>

            {/* Bottom Target Pill */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between text-xs z-10">
              <span className="text-slate-400">Işınların Dik Düştüğü Enlem:</span>
              <span className="text-amber-400 font-bold font-mono">{cur.sunRayTarget}</span>
            </div>
          </div>
        </div>

        {/* Detailed Stats Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-amber-400" />
              <span>Yarımküreler & Gece-Gündüz Durumu</span>
            </h3>

            {/* North Hemisphere */}
            <div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-1">
              <div className="text-xs font-bold text-blue-300">Kuzey Yarımküre (Türkiye):</div>
              <div className="text-xs font-extrabold text-white">{cur.northHemisphere}</div>
              <div className="text-[11px] text-slate-300">Gölge Boyu: <strong>{cur.shadowLength}</strong></div>
            </div>

            {/* South Hemisphere */}
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
              <div className="text-xs font-bold text-emerald-300">Güney Yarımküre:</div>
              <div className="text-xs font-extrabold text-white">{cur.southHemisphere}</div>
            </div>

            {/* Day / Night distribution */}
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>Aydınlanma Çemberi & Süreler:</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {cur.dayNightInfo}
              </p>
            </div>
          </div>

          {/* LGS & Coğrafya Taktik Kartı */}
          <div className="p-4 rounded-3xl bg-slate-900/50 border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>LGS 1. Ünite Soru Tuzakları</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
              <li>
                Mevsimlerin oluşmasında <strong>Dünya&apos;nın Güneş&apos;e olan mesafesi (yakınlığı/uzaklığı) ETKİLİ DEĞİLDİR!</strong> En yakın olduğumuz tarih 3 Ocak’tır ama Kuzey Yarımküre kış yaşar.
              </li>
              <li>
                Temel iki neden: <strong>23° 27&apos; eksen eğikliği</strong> ve <strong>Güneş etrafında dolanma</strong> hareketidir.
              </li>
              <li>
                Işık dik (90°) düştükçe birim alana aktarılan enerji artar ve sıcaklık yükselir; eğik düştükçe gölge uzar ve sıcaklık düşer.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
