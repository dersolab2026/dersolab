'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Globe2,
  Wind,
  Activity,
  Sun,
  CloudRain,
  Mountain,
  Sparkles,
  Info,
  CheckCircle2,
  Layers,
} from 'lucide-react'

import { TURKEY_CITIES, TURKEY_MAP_VIEWBOX, TurkeyCity } from './turkeyMapData'

type GeoLayer = 'climate' | 'faults' | 'winds'

interface RegionInfo {
  id: string
  name: string
  badge: string
  color: string
  desc: string
  vegetation: string
  rainRegime: string
  examTip: string
}

const CLIMATE_REGIONS: RegionInfo[] = [
  {
    id: 'karadeniz',
    name: 'Karadeniz İklimi',
    badge: 'Her Mevsim Yağışlı',
    color: 'border-emerald-500 bg-emerald-950/40 text-emerald-300',
    desc: 'Yıllık sıcaklık farkı en az olan iklimdir. Bulutluluk ve nem oranı en yüksektir. Kimyasal çözünme çok güçlüdür.',
    vegetation: 'Geniş ve iğne yapraklı karışık ormanlar.',
    rainRegime: 'Düzenli (En çok sonbaharda yağış alır).',
    examTip: 'ÖSYM Soru Tipi: Çay ve fındık tarımı, kahverengi orman toprakları ve heyelan riski en yüksek bölgedir!',
  },
  {
    id: 'akdeniz',
    name: 'Akdeniz İklimi',
    badge: 'Yaz Sıcak/Kurak, Kış Ilık/Yağışlı',
    color: 'border-amber-500 bg-amber-950/40 text-amber-300',
    desc: 'Kış aylarında cephesel (frontal) yağışlar etkilidir. Don olayları çok nadir görülür. Kırmızı renkli Terra-Rossa toprakları yaygındır.',
    vegetation: 'Kızılçam ormanlarının tahribiyle oluşan Maki (Zeytin, defne, mersin, zakkum).',
    rainRegime: 'Düzensiz (En çok kış aylarında yağış alır).',
    examTip: 'ÖSYM Soru Tipi: Seracılık ve kış turizmi en erken başlar. Karstik şekiller (lapya, dolin, polye) yaygındır.',
  },
  {
    id: 'karasal',
    name: 'İç & Güneydoğu Karasal İklim',
    badge: 'Yaz Sıcak, Kış Soğuk & Ayaz',
    color: 'border-yellow-600 bg-yellow-950/40 text-yellow-300',
    desc: 'Deniz etkisinden uzak, nem az olduğu için günlük ve yıllık sıcaklık farkı yüksektir. Fiziksel (mekanik) ufalanma şiddetlidir.',
    vegetation: 'İlkbahar yağışlarıyla yeşeren, yazın kuruyan Bozkır (Step).',
    rainRegime: 'Düzensiz (En çok ilkbaharda Konveksiyonel / Kırkikindi yağışları).',
    examTip: 'ÖSYM Soru Tipi: Tahıl (buğday, arpa) ve küçükbaş hayvancılık yaygındır. Rüzgâr erozyonu belirgindir.',
  },
  {
    id: 'sert-karasal',
    name: 'Erzurum — Kars Sert Karasal',
    badge: 'Yaz Yağışlı, Kış Çok Sert/Karlı',
    color: 'border-cyan-500 bg-cyan-950/40 text-cyan-300',
    desc: 'Yükseltinin en fazla olduğu bölgedir. Kış mevsimi 6 ay sürer, sıcaklıklar -35°C lere kadar düşer. Çernezyom (kara toprak) bulunur.',
    vegetation: 'Yaz yağışlarıyla boy atan gür Çayırlar ve iğne yapraklı sarıçam ormanları.',
    rainRegime: 'En çok yaz mevsiminde konveksiyonel yağış alır.',
    examTip: 'ÖSYM Soru Tipi: Yaz yağışları sayesinde mera ve büyükbaş hayvancılık (sığır) gelişmiştir. Toprağı verimli olsa da iklim sertliğinden tarım kısıtlıdır.',
  },
]

const WINDS_DATA = [
  { name: 'Karayel', code: 'Ka', dir: 'Kuzeybatı', type: 'Soğuk & Kuru', desc: 'Balkanlar üzerinden gelir, sıcaklığı hızla düşürür.' },
  { name: 'Yıldız', code: 'Yı', dir: 'Kuzey', type: 'Soğuk', desc: 'Karadeniz üzerinden gelir, kıyılara bol yağış bırakır.' },
  { name: 'Poyraz', code: 'P', dir: 'Kuzeydoğu', type: 'Çok Soğuk & Kuru', desc: 'Sibirya kökenlidir, kışın dondurucu ayaz getirir.' },
  { name: 'Samyeli (Keşişleme)', code: 'Sa', dir: 'Güneydoğu', type: 'Sıcak & Kurak', desc: 'Suriye-Irak çöllerinden gelir, buharlaşmayı ve kuraklığı artırır.' },
  { name: 'Kıble', code: 'K', dir: 'Güney', type: 'Sıcak & Nemli', desc: 'Akdeniz üzerinden gelir, güney yamaçlara yağış bırakır.' },
  { name: 'Lodos', code: 'L', dir: 'Güneybatı', type: 'Ilık & Yağışlı', desc: 'Gözü yaşlı lodos; karları eritir, soba zehirlenmelerine sebep olur!' },
]

export function GeoAtlas() {
  const [activeLayer, setActiveLayer] = useState<GeoLayer>('climate')
  const [selectedClimate, setSelectedClimate] = useState<RegionInfo>(CLIMATE_REGIONS[0])
  const [hoveredCity, setHoveredCity] = useState<TurkeyCity | null>(null)

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-rose-950/40 via-pink-950/20 to-slate-900/60 border border-rose-500/20 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Maarif Modeli & MEB
            </span>
            <span className="text-xs text-slate-400">5 - 12. Sınıf Coğrafya & Harita</span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Globe2 className="w-6 h-6 text-rose-400" />
            İnteraktif Türkiye Fiziki & İklim Atlası
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            İklim kuşaklarını, aktif fay hatlarını ve <span className="font-mono text-amber-300 font-bold">KAYIP SAKAL</span> yerel
            rüzgarlar formülünü görsel harita katmanları üzerinde canlı keşfedin!
          </p>
        </div>

        {/* Layer Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-700/60 self-start md:self-auto">
          <button
            onClick={() => setActiveLayer('climate')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeLayer === 'climate'
                ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            İklim Tipleri
          </button>
          <button
            onClick={() => setActiveLayer('winds')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeLayer === 'winds'
                ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Rüzgarlar (KAYIP SAKAL)
          </button>
          <button
            onClick={() => setActiveLayer('faults')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeLayer === 'faults'
                ? 'bg-rose-600 text-white font-bold shadow-md shadow-rose-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Fay Hatları & Deprem
          </button>
        </div>
      </div>

      {/* ── Main Atlas Layer Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Map View */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl bg-slate-900/70 border border-slate-800 p-5 shadow-xl relative space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-rose-400" />
              {activeLayer === 'climate' && 'Türkiye İklim Tipleri Haritası'}
              {activeLayer === 'winds' && 'Türkiye Yerel Rüzgârları (KAYIP SAKAL)'}
              {activeLayer === 'faults' && 'Aktif Fay Hatları & Masif Araziler'}
            </span>
            <span className="text-[11px] text-slate-500">İnteraktif Katman</span>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full h-[400px] sm:h-[480px] bg-slate-950/95 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center p-2 sm:p-4 shadow-inner">
            
            {/* Active Hover Tooltip */}
            {hoveredCity && (
              <div className="absolute top-3 left-3 z-20 px-3.5 py-1.5 rounded-xl bg-slate-900/95 border border-slate-700/80 backdrop-blur-md shadow-2xl flex items-center gap-2 pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-black text-white">
                  {hoveredCity.name} <span className="text-slate-400 font-mono">({hoveredCity.plate})</span>
                </span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    hoveredCity.climate === 'karadeniz'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : hoveredCity.climate === 'akdeniz'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : hoveredCity.climate === 'sert-karasal'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                  }`}
                >
                  {hoveredCity.climate === 'karadeniz' && 'Karadeniz İklimi'}
                  {hoveredCity.climate === 'akdeniz' && 'Akdeniz İklimi'}
                  {hoveredCity.climate === 'karasal' && 'Karasal İklim'}
                  {hoveredCity.climate === 'sert-karasal' && 'Sert Karasal'}
                </span>
              </div>
            )}

            {/* High Precision Turkey Map Canvas */}
            <svg viewBox={TURKEY_MAP_VIEWBOX} className="w-full h-full select-none">
              <defs>
                {/* Arrow markers for winds */}
                <marker id="coldArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#38bdf8" />
                </marker>
                <marker id="warmArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
                </marker>
              </defs>

              {/* Water background */}
              <rect x="0" y="0" width="1008" height="528" fill="#080c14" />

              {/* All 81 Provinces of Turkey */}
              <g id="turkey-provinces">
                {TURKEY_CITIES.map((city) => {
                  let fillColor = '#1e293b'
                  let strokeColor = '#334155'
                  let strokeWidth = '0.7'
                  let opacity = 0.9

                  if (activeLayer === 'climate') {
                    if (city.climate === 'karadeniz') {
                      fillColor = selectedClimate.id === 'karadeniz' ? '#059669' : '#064e3b'
                      strokeColor = selectedClimate.id === 'karadeniz' ? '#34d399' : '#10b981'
                      opacity = selectedClimate.id === 'karadeniz' ? 0.95 : 0.6
                    } else if (city.climate === 'akdeniz') {
                      fillColor = selectedClimate.id === 'akdeniz' ? '#d97706' : '#78350f'
                      strokeColor = selectedClimate.id === 'akdeniz' ? '#fbbf24' : '#f59e0b'
                      opacity = selectedClimate.id === 'akdeniz' ? 0.95 : 0.6
                    } else if (city.climate === 'karasal') {
                      fillColor = selectedClimate.id === 'karasal' ? '#ca8a04' : '#713f12'
                      strokeColor = selectedClimate.id === 'karasal' ? '#fde047' : '#eab308'
                      opacity = selectedClimate.id === 'karasal' ? 0.95 : 0.6
                    } else if (city.climate === 'sert-karasal') {
                      fillColor = selectedClimate.id === 'sert-karasal' ? '#0891b2' : '#164e63'
                      strokeColor = selectedClimate.id === 'sert-karasal' ? '#38bdf8' : '#06b6d4'
                      opacity = selectedClimate.id === 'sert-karasal' ? 0.95 : 0.6
                    }
                  } else if (activeLayer === 'faults') {
                    if (city.fault === 'kaf') {
                      fillColor = '#dc2626'
                      strokeColor = '#f87171'
                      opacity = 0.85
                    } else if (city.fault === 'daf') {
                      fillColor = '#ea580c'
                      strokeColor = '#fb923c'
                      opacity = 0.85
                    } else if (city.fault === 'baf') {
                      fillColor = '#d97706'
                      strokeColor = '#facc15'
                      opacity = 0.85
                    } else {
                      fillColor = '#1e293b'
                      strokeColor = '#334155'
                      opacity = 0.55
                    }
                  } else if (activeLayer === 'winds') {
                    fillColor = '#161f30'
                    strokeColor = '#293548'
                    opacity = 0.85
                  }

                  const isHovered = hoveredCity?.id === city.id

                  return (
                    <g
                      key={city.id}
                      className="cursor-pointer transition-all duration-150"
                      onMouseEnter={() => setHoveredCity(city)}
                      onMouseLeave={() => setHoveredCity(null)}
                      onClick={() => {
                        if (activeLayer === 'climate') {
                          const matched = CLIMATE_REGIONS.find((c) => c.id === city.climate)
                          if (matched) setSelectedClimate(matched)
                        }
                      }}
                    >
                      {city.paths.map((p, pIdx) => (
                        <path
                          key={pIdx}
                          d={p}
                          fill={isHovered ? '#38bdf8' : fillColor}
                          stroke={isHovered ? '#ffffff' : strokeColor}
                          strokeWidth={isHovered ? '2' : strokeWidth}
                          fillOpacity={isHovered ? 1 : opacity}
                        />
                      ))}
                    </g>
                  )
                })}
              </g>

              {/* ── OVERLAYS: WINDS (KAYIP SAKAL) ── */}
              {activeLayer === 'winds' && (
                <>
                  {/* Karayel Arrow (NW) */}
                  <g className="animate-pulse">
                    <line x1="70" y1="30" x2="160" y2="105" stroke="#38bdf8" strokeWidth="3.5" markerEnd="url(#coldArrow)" />
                    <rect x="35" y="10" width="115" height="22" rx="6" fill="#090d16" stroke="#38bdf8" strokeWidth="1" />
                    <text x="92" y="25" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">Karayel (Soğuk)</text>
                  </g>

                  {/* Yıldız Arrow (N) */}
                  <g className="animate-pulse">
                    <line x1="500" y1="10" x2="500" y2="70" stroke="#38bdf8" strokeWidth="3.5" markerEnd="url(#coldArrow)" />
                    <rect x="450" y="2" width="100" height="22" rx="6" fill="#090d16" stroke="#38bdf8" strokeWidth="1" />
                    <text x="500" y="17" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">Yıldız (Soğuk)</text>
                  </g>

                  {/* Poyraz Arrow (NE) */}
                  <g className="animate-pulse">
                    <line x1="940" y1="30" x2="850" y2="95" stroke="#38bdf8" strokeWidth="3.5" markerEnd="url(#coldArrow)" />
                    <rect x="875" y="10" width="115" height="22" rx="6" fill="#090d16" stroke="#38bdf8" strokeWidth="1" />
                    <text x="932" y="25" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">Poyraz (Ayaz)</text>
                  </g>

                  {/* Lodos Arrow (SW) */}
                  <g className="animate-pulse">
                    <line x1="60" y1="440" x2="150" y2="360" stroke="#f43f5e" strokeWidth="3.5" markerEnd="url(#warmArrow)" />
                    <rect x="20" y="445" width="130" height="22" rx="6" fill="#090d16" stroke="#f43f5e" strokeWidth="1" />
                    <text x="85" y="460" fill="#f43f5e" fontSize="11" fontWeight="bold" textAnchor="middle">Lodos (Ilık/Nemli)</text>
                  </g>

                  {/* Kıble Arrow (S) */}
                  <g className="animate-pulse">
                    <line x1="560" y1="510" x2="560" y2="445" stroke="#f43f5e" strokeWidth="3.5" markerEnd="url(#warmArrow)" />
                    <rect x="515" y="500" width="90" height="22" rx="6" fill="#090d16" stroke="#f43f5e" strokeWidth="1" />
                    <text x="560" y="515" fill="#f43f5e" fontSize="11" fontWeight="bold" textAnchor="middle">Kıble (Sıcak)</text>
                  </g>

                  {/* Samyeli Arrow (SE) */}
                  <g className="animate-pulse">
                    <line x1="930" y1="480" x2="830" y2="410" stroke="#f43f5e" strokeWidth="3.5" markerEnd="url(#warmArrow)" />
                    <rect x="855" y="480" width="135" height="22" rx="6" fill="#090d16" stroke="#f43f5e" strokeWidth="1" />
                    <text x="922" y="495" fill="#f43f5e" fontSize="11" fontWeight="bold" textAnchor="middle">Samyeli (Kurak/Çöl)</text>
                  </g>

                  {/* Center Mnemonic Formula Box */}
                  <rect x="375" y="200" width="260" height="65" rx="14" fill="#0b1120" stroke="#f59e0b" strokeWidth="2" opacity="0.95" />
                  <text x="505" y="225" fill="#fbbf24" fontSize="14" fontWeight="900" textAnchor="middle" letterSpacing="2">
                    KAYIP SAKAL ŞİFRESİ
                  </text>
                  <text x="505" y="247" fill="#cbd5e1" fontSize="11" textAnchor="middle">
                    Kuzeyden Soğuk (Ka-Yı-P), Güneyden Sıcak (Sa-K-L)
                  </text>
                </>
              )}

              {/* ── OVERLAYS: FAULTS (KAF, DAF, BAF) ── */}
              {activeLayer === 'faults' && (
                <>
                  {/* KAF - Kuzey Anadolu Fayı (Saros Körfezinden Karlıova'ya) */}
                  <path
                    d="M 150,155 Q 260,135 375,130 Q 510,130 650,170 Q 730,195 810,240"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="4.5"
                    strokeDasharray="8,4"
                    className="drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                  />
                  <rect x="380" y="100" width="165" height="22" rx="6" fill="#450a0a" stroke="#ef4444" strokeWidth="1" />
                  <text x="462" y="115" fill="#fca5a5" fontSize="11" fontWeight="bold" textAnchor="middle">
                    KAF (Kuzey Anadolu Fayı)
                  </text>

                  {/* DAF - Doğu Anadolu Fayı (Hatay'dan Karlıova'ya) */}
                  <path
                    d="M 565,450 Q 590,370 655,315 Q 730,270 810,240"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="4.5"
                    strokeDasharray="8,4"
                    className="drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]"
                  />
                  <rect x="655" y="335" width="165" height="22" rx="6" fill="#431407" stroke="#f97316" strokeWidth="1" />
                  <text x="737" y="350" fill="#fdba74" fontSize="11" fontWeight="bold" textAnchor="middle">
                    DAF (Doğu Anadolu Fayı)
                  </text>

                  {/* BAF - Batı Anadolu Fay Kuşağı (Ege Grabenleri) */}
                  <g stroke="#facc15" strokeWidth="3" strokeDasharray="5,3" className="drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]">
                    <line x1="100" y1="210" x2="220" y2="230" />
                    <line x1="90" y1="250" x2="230" y2="265" />
                    <line x1="100" y1="285" x2="240" y2="295" />
                    <line x1="110" y1="320" x2="250" y2="330" />
                  </g>
                  <rect x="85" y="175" width="165" height="22" rx="6" fill="#422006" stroke="#facc15" strokeWidth="1" />
                  <text x="167" y="190" fill="#fef08a" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                    BAF (Batı Anadolu Grabenleri)
                  </text>

                  {/* Masif Araziler (1. Derece Deprem Riski En Az Alanlar) */}
                  <g className="animate-pulse">
                    <circle cx="400" cy="350" r="24" fill="rgba(34, 197, 94, 0.45)" stroke="#22c55e" strokeWidth="2.5" />
                    <text x="400" y="354" fill="#4ade80" fontSize="10" fontWeight="black" textAnchor="middle">Konya</text>

                    <circle cx="800" cy="380" r="22" fill="rgba(34, 197, 94, 0.45)" stroke="#22c55e" strokeWidth="2.5" />
                    <text x="800" y="384" fill="#4ade80" fontSize="10" fontWeight="black" textAnchor="middle">Mardin</text>

                    <circle cx="130" cy="85" r="18" fill="rgba(34, 197, 94, 0.45)" stroke="#22c55e" strokeWidth="2" />
                    <text x="130" y="89" fill="#4ade80" fontSize="9" fontWeight="black" textAnchor="middle">Yıldız</text>

                    <circle cx="530" cy="80" r="16" fill="rgba(34, 197, 94, 0.45)" stroke="#22c55e" strokeWidth="2" />
                    <text x="530" y="84" fill="#4ade80" fontSize="9" fontWeight="black" textAnchor="middle">Sinop</text>
                  </g>
                </>
              )}
            </svg>

            {/* Quick layer tip overlay */}
            <div className="absolute bottom-3 left-3 z-20 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/60 backdrop-blur-md text-[11px] text-slate-300 pointer-events-none">
              {activeLayer === 'climate' && '💡 İllere tıklayarak veya üzerine gelerek iklim analizini anında görün.'}
              {activeLayer === 'winds' && '💡 Kuzeyden esenler (KAYIP) soğutur, güneyden esenler (SAKAL) ısıtır.'}
              {activeLayer === 'faults' && '💡 Kırmızı & turuncu çizgiler ana fay hatları, yeşil halkalar kararlı Masif arazilerdir.'}
            </div>
          </div>

          {/* Quick Select Buttons for Climates */}
          {activeLayer === 'climate' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {CLIMATE_REGIONS.map((region) => (
                <button
                  key={region.id}
                  onClick={() => setSelectedClimate(region)}
                  className={`p-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                    selectedClimate.id === region.id
                      ? region.color + ' ring-2 ring-rose-500/30'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {region.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Selected Region / Wind / Fault Info Card */}
        <div className="lg:col-span-4 space-y-4">
          {activeLayer === 'climate' && (
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {selectedClimate.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono">İklim Analizi</span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">{selectedClimate.name}</h3>
                <p className="text-xs text-slate-300 leading-relaxed">{selectedClimate.desc}</p>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Doğal Bitki Örtüsü:</span>
                  <strong className="text-emerald-300">{selectedClimate.vegetation}</strong>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                  <span className="text-slate-400 block mb-0.5">Yağış Rejimi & Türü:</span>
                  <strong className="text-cyan-300">{selectedClimate.rainRegime}</strong>
                </div>
              </div>

              {/* Exam Tip */}
              <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-rose-400 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>ÖSYM Sınav Hapı</span>
                </div>
                <p className="text-slate-200 leading-relaxed">{selectedClimate.examTip}</p>
              </div>
            </div>
          )}

          {activeLayer === 'winds' && (
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Wind className="w-4 h-4 text-amber-400" />
                KAYIP SAKAL Rüzgâr Cetveli
              </h3>

              <div className="space-y-2 text-xs max-h-[360px] overflow-y-auto pr-1 no-scrollbar">
                {WINDS_DATA.map((w) => (
                  <div
                    key={w.name}
                    className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <strong className="text-white text-sm">
                        {w.name} <span className="text-[10px] text-amber-400">({w.dir})</span>
                      </strong>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          w.type.includes('Soğuk')
                            ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {w.type}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{w.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeLayer === 'faults' && (
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-red-400" />
                Türkiye Deprem & Fay Hatları Bilgisi
              </h3>

              <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
                <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30">
                  <strong className="text-red-300 block mb-1">KAF (Kuzey Anadolu Fayı):</strong>
                  Dünyanın en hızlı ve en tehlikeli doğrultu atımlı fay hatlarından biridir. Saros Körfezinden başlar, Marmara Denizi, Bolu, Tokat, Erzincan üzerinden Karlıova&apos;ya uzanır.
                </div>

                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30">
                  <strong className="text-amber-300 block mb-1">DAF (Doğu Anadolu Fayı):</strong>
                  Hatay grabeninden başlayıp Kahramanmaraş, Malatya, Elazığ, Bingöl üzerinden KAF ile birleşir.
                </div>

                <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                  <strong className="text-emerald-300 block mb-1">Deprem Riski En Düşük Masifler:</strong>
                  Konya-Karaman Ovası, Tuz Gölü güneyi, Mardin Eşiği, Sinop çevresi ve Yıldız Dağları 1. derece deprem kuşağı dışındadır.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
