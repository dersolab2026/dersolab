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
          <div className="relative w-full h-[360px] bg-slate-950/90 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center p-4">
            
            {/* Background Map Grid */}
            <svg viewBox="0 0 800 420" className="w-full h-full">
              {/* Sea backgrounds */}
              <rect x="0" y="0" width="800" height="420" fill="#090d16" />
              
              {/* Turkey Silhouette Stylized Polyline */}
              <path
                d="M 60,140 Q 140,80 240,90 Q 360,70 520,75 Q 680,60 740,110 L 760,200 L 710,290 L 590,320 L 460,330 L 320,340 L 220,330 L 160,290 L 80,260 L 50,190 Z"
                fill="#161f30"
                stroke="#334155"
                strokeWidth="2"
              />

              {/* CLIMATE LAYER */}
              {activeLayer === 'climate' && (
                <>
                  {/* Karadeniz Strip (Top) */}
                  <path
                    d="M 120,110 Q 240,90 380,82 Q 540,78 720,110 L 700,145 Q 520,110 380,115 Q 240,120 130,135 Z"
                    fill="rgba(16, 185, 129, 0.45)"
                    stroke="#10b981"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedClimate(CLIMATE_REGIONS[0])}
                  />
                  <text x="420" y="105" fill="#34d399" fontSize="12" fontWeight="bold" textAnchor="middle">
                    Karadeniz İklimi
                  </text>

                  {/* Akdeniz & Ege Strip (South & West) */}
                  <path
                    d="M 70,160 L 120,160 Q 150,260 220,300 L 340,320 L 460,310 L 580,300 L 580,330 L 460,340 L 320,350 L 210,340 L 140,300 L 70,250 Z"
                    fill="rgba(245, 158, 11, 0.4)"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedClimate(CLIMATE_REGIONS[1])}
                  />
                  <text x="360" y="335" fill="#fbbf24" fontSize="12" fontWeight="bold" textAnchor="middle">
                    Akdeniz İklimi
                  </text>

                  {/* Erzurum-Kars (North East) */}
                  <polygon
                    points="590,130 730,110 745,190 620,195"
                    fill="rgba(6, 182, 212, 0.4)"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedClimate(CLIMATE_REGIONS[3])}
                  />
                  <text x="660" y="155" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">
                    Sert Karasal
                  </text>

                  {/* Karasal / Step (Center & Southeast) */}
                  <path
                    d="M 160,160 Q 320,140 500,140 L 600,200 L 700,210 L 690,280 L 580,280 L 460,290 L 300,280 L 180,240 Z"
                    fill="rgba(202, 138, 4, 0.35)"
                    stroke="#ca8a04"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setSelectedClimate(CLIMATE_REGIONS[2])}
                  />
                  <text x="370" y="210" fill="#facc15" fontSize="13" fontWeight="bold" textAnchor="middle">
                    İç & Güneydoğu Karasal (Step)
                  </text>
                </>
              )}

              {/* WINDS LAYER (KAYIP SAKAL) */}
              {activeLayer === 'winds' && (
                <>
                  {/* Karayel Arrow (NW) */}
                  <g className="animate-pulse">
                    <line x1="80" y1="50" x2="160" y2="120" stroke="#38bdf8" strokeWidth="3" markerEnd="url(#arrow)" />
                    <text x="70" y="45" fill="#38bdf8" fontSize="12" fontWeight="bold">Karayel (Soğuk)</text>
                  </g>

                  {/* Yıldız Arrow (N) */}
                  <g className="animate-pulse">
                    <line x1="400" y1="20" x2="400" y2="80" stroke="#38bdf8" strokeWidth="3" />
                    <text x="400" y="16" fill="#38bdf8" fontSize="12" fontWeight="bold" textAnchor="middle">Yıldız (Soğuk)</text>
                  </g>

                  {/* Poyraz Arrow (NE) */}
                  <g className="animate-pulse">
                    <line x1="720" y1="40" x2="650" y2="100" stroke="#38bdf8" strokeWidth="3" />
                    <text x="740" y="35" fill="#38bdf8" fontSize="12" fontWeight="bold">Poyraz (Ayaz)</text>
                  </g>

                  {/* Lodos Arrow (SW) */}
                  <g className="animate-pulse">
                    <line x1="60" y1="360" x2="140" y2="290" stroke="#f43f5e" strokeWidth="3" />
                    <text x="40" y="380" fill="#f43f5e" fontSize="12" fontWeight="bold">Lodos (Ilık/Nemli)</text>
                  </g>

                  {/* Kıble Arrow (S) */}
                  <g className="animate-pulse">
                    <line x1="400" y1="400" x2="400" y2="340" stroke="#f43f5e" strokeWidth="3" />
                    <text x="400" y="415" fill="#f43f5e" fontSize="12" fontWeight="bold" textAnchor="middle">Kıble (Sıcak)</text>
                  </g>

                  {/* Samyeli Arrow (SE) */}
                  <g className="animate-pulse">
                    <line x1="720" y1="380" x2="630" y2="300" stroke="#f43f5e" strokeWidth="3" />
                    <text x="690" y="400" fill="#f43f5e" fontSize="12" fontWeight="bold">Samyeli (Kurak)</text>
                  </g>

                  {/* Center Formula Box */}
                  <rect x="280" y="170" width="240" height="60" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="2" />
                  <text x="400" y="195" fill="#fbbf24" fontSize="14" fontWeight="bold" textAnchor="middle">
                    KAYIP SAKAL Şifresi
                  </text>
                  <text x="400" y="215" fill="#cbd5e1" fontSize="11" textAnchor="middle">
                    Kuzeyden Soğuk, Güneyden Sıcak Rüzgarlar
                  </text>
                </>
              )}

              {/* FAULTS LAYER */}
              {activeLayer === 'faults' && (
                <>
                  {/* KAF (Kuzey Anadolu Fay Hattı) - Saros Körfezinden Van Gölüne */}
                  <path
                    d="M 120,135 Q 260,120 400,120 Q 560,150 710,210"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="4"
                    strokeDasharray="6,3"
                  />
                  <text x="340" y="110" fill="#f87171" fontSize="12" fontWeight="bold">
                    KAF (Kuzey Anadolu Fayı)
                  </text>

                  {/* DAF (Doğu Anadolu Fay Hattı) - Hatay'dan Bingöl Karlıova'ya */}
                  <path
                    d="M 480,340 Q 530,280 620,180"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="4"
                    strokeDasharray="6,3"
                  />
                  <text x="560" y="280" fill="#fb923c" fontSize="12" fontWeight="bold">
                    DAF (Doğu Anadolu Fayı)
                  </text>

                  {/* BAF (Batı Anadolu Fay Hattı) - Ege Grabenleri */}
                  <g stroke="#eab308" strokeWidth="3" strokeDasharray="4,3">
                    <line x1="80" y1="180" x2="160" y2="190" />
                    <line x1="80" y1="210" x2="170" y2="220" />
                    <line x1="90" y1="240" x2="180" y2="250" />
                  </g>
                  <text x="90" y="165" fill="#facc15" fontSize="11" fontWeight="bold">
                    BAF (Batı Anadolu Grabenleri)
                  </text>

                  {/* Masif Araziler (Deprem Riski Az) */}
                  <circle cx="370" cy="270" r="16" fill="rgba(34, 197, 94, 0.4)" stroke="#22c55e" strokeWidth="2" />
                  <text x="370" y="274" fill="#4ade80" fontSize="9" fontWeight="bold" textAnchor="middle">Konya</text>

                  <circle cx="640" cy="300" r="16" fill="rgba(34, 197, 94, 0.4)" stroke="#22c55e" strokeWidth="2" />
                  <text x="640" y="304" fill="#4ade80" fontSize="9" fontWeight="bold" textAnchor="middle">Mardin</text>

                  <circle cx="160" cy="85" r="14" fill="rgba(34, 197, 94, 0.4)" stroke="#22c55e" strokeWidth="2" />
                  <text x="160" y="88" fill="#4ade80" fontSize="8" fontWeight="bold" textAnchor="middle">Yıldız</text>
                </>
              )}
            </svg>

            {/* Quick layer tip overlay */}
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/60 backdrop-blur-md text-[11px] text-slate-300">
              {activeLayer === 'climate' && '💡 Haritadaki iklim bölgelerine tıklayarak detaylı YKS analizini görün.'}
              {activeLayer === 'winds' && '💡 Kuzeyden esen rüzgârlar sıcaklığı düşürür, güneyden esenler yükseltir.'}
              {activeLayer === 'faults' && '💡 Yeşil halkalar 1. derece deprem riski en az olan Masif arazilerdir.'}
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
