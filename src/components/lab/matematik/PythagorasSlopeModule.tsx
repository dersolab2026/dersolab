'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Triangle,
  TrendingUp,
  Sliders,
  CheckCircle2,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Compass,
  ArrowRight,
  Maximize2,
  Layers,
} from 'lucide-react'

export function PythagorasSlopeModule() {
  const [subTab, setSubTab] = useState<'pythagoras' | 'slope'>('pythagoras')

  // ── Pythagoras State ──
  const [a, setA] = useState<number>(6)
  const [b, setB] = useState<number>(8)
  const [showSquares, setShowSquares] = useState<boolean>(true)
  const [activeScenario, setActiveScenario] = useState<'free' | 'ladder' | 'tree' | 'distance'>('free')

  // Calculate hypotenuse c = sqrt(a^2 + b^2)
  const aSquare = a * a
  const bSquare = b * b
  const cSquare = aSquare + bSquare
  const cExact = Math.sqrt(cSquare)
  const isPerfectSquare = Number.isInteger(cExact)
  const cDisplay = isPerfectSquare ? `${cExact}` : `√${cSquare} ≈ ${cExact.toFixed(2)}`

  // ── Slope State ──
  const [x1, setX1] = useState<number>(1)
  const [y1, setY1] = useState<number>(2)
  const [x2, setX2] = useState<number>(5)
  const [y2, setY2] = useState<number>(8)

  const deltaX = x2 - x1
  const deltaY = y2 - y1
  const isVertical = deltaX === 0
  const isHorizontal = deltaY === 0
  const slopeValue = !isVertical ? deltaY / deltaX : null

  // Special Triple Presets
  const SPECIAL_TRIPLES = [
    { label: '3 - 4 - 5', a: 3, b: 4, name: 'Temel Pisagor Üçgeni' },
    { label: '6 - 8 - 10', a: 6, b: 8, name: '3-4-5 (2 Katı)' },
    { label: '5 - 12 - 13', a: 5, b: 12, name: 'Özel Kenarlı Üçgen' },
    { label: '8 - 15 - 17', a: 8, b: 15, name: 'Özel Kenarlı Üçgen' },
    { label: '7 - 24 - 25', a: 7, b: 24, name: 'Özel Kenarlı Üçgen' },
    { label: 'İkizkenar (5-5-5√2)', a: 5, b: 5, name: '45°-45°-90° Üçgeni' },
  ]

  // Scenarios for LGS Real Life Questions
  const SCENARIOS = {
    ladder: {
      title: 'İtfaiye / Duvar Merdiveni Problemi',
      desc: 'Bir itfaiye merdiveni, duvardan b metre uzağa koyulup a metre yükseklikteki yangına uzatılacaktır. Merdivenin boyu en az kaç metre olmalıdır?',
      aLabel: 'Bina / Yangın Yüksekliği (a)',
      bLabel: 'Zemin Mesafesi (b)',
      cLabel: 'Merdiven Boyu (c)',
      icon: '🚒',
    },
    tree: {
      title: 'Fırtınada Kırılan Direk / Ağaç Problemi',
      desc: 'b metre boyundaki sağlam gövdeden kırılan bir sokak lambası direğinin tepesi, zemine b metre uzakta değmiştir. Kırılan parçanın ve direğin ilk boyunu bulunuz.',
      aLabel: 'Ayakta Kalan Direk (a)',
      bLabel: 'Uç Noktanın Zemine Uzaklığı (b)',
      cLabel: 'Kırılan Eğik Parça (c)',
      icon: '🌳',
    },
    distance: {
      title: 'Koordinat Düzleminde İki Nokta Arası Kuş Uçuşu Mesafe',
      desc: 'Koordinat sisteminde A ve B noktaları arasındaki en kısa mesafe, aralarındaki yatay (Δx) ve dikey (Δy) farklar kullanılarak Pisagor bağıntısı ile hesaplanır.',
      aLabel: 'Dikey Uzaklık |y2 - y1|',
      bLabel: 'Yatay Uzaklık |x2 - x1|',
      cLabel: 'Kuş Uçuşu Mesafe (Hipotenüs)',
      icon: '📍',
    },
  }

  // SVG dimensions for Triangle
  const svgWidth = 440
  const svgHeight = 320
  const scale = 14
  const originX = 70
  const originY = 260
  const pA = { x: originX, y: originY - a * scale } // Top
  const pC = { x: originX, y: originY } // Right angle corner
  const pB = { x: originX + b * scale, y: originY } // Right

  return (
    <div className="space-y-6">
      {/* ── Sub-module Switcher Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-violet-950/40 via-slate-900 to-indigo-950/30 border border-violet-500/20 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              8. Sınıf & LGS Matematik
            </span>
            <span className="text-xs text-slate-400">Üçgenler & Doğrusal Denklemler Ünitesi</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Triangle className="w-5 h-5 text-violet-400" />
            Pisagor Bağıntısı & Koordinat Eğimi Laboratuvarı
          </h3>
        </div>

        {/* Sub-tab Pills */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setSubTab('pythagoras')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'pythagoras'
                ? 'bg-violet-500 text-slate-950 shadow-md shadow-violet-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Triangle className="w-3.5 h-3.5" />
            <span>Pisagor (a² + b² = c²)</span>
          </button>
          <button
            onClick={() => setSubTab('slope')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              subTab === 'slope'
                ? 'bg-violet-500 text-slate-950 shadow-md shadow-violet-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Doğrunun Eğimi (m)</span>
          </button>
        </div>
      </div>

      {/* ── SUB-TAB 1: PYTHAGORAS ── */}
      {subTab === 'pythagoras' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls & Scenarios (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Real Life LGS Scenarios */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  LGS Gerçek Hayat Problemleri
                </span>
                <button
                  onClick={() => setActiveScenario('free')}
                  className={`text-[11px] px-2 py-0.5 rounded font-bold cursor-pointer ${
                    activeScenario === 'free'
                      ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  Serbest Mod
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {(['ladder', 'tree', 'distance'] as const).map((sc) => {
                  const s = SCENARIOS[sc]
                  const isCur = activeScenario === sc
                  return (
                    <button
                      key={sc}
                      onClick={() => {
                        setActiveScenario(sc)
                        if (sc === 'ladder') {
                          setA(12)
                          setB(9)
                        } else if (sc === 'tree') {
                          setA(8)
                          setB(6)
                        } else if (sc === 'distance') {
                          setA(5)
                          setB(12)
                        }
                      }}
                      className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                        isCur
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-200 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="text-xl mb-0.5">{s.icon}</div>
                      <div className="text-[10px] font-bold truncate">{s.title.split(' ')[0]}</div>
                    </button>
                  )
                })}
              </div>

              {activeScenario !== 'free' && (
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
                  <span className="font-bold block text-amber-300 mb-1">
                    {SCENARIOS[activeScenario].icon} {SCENARIOS[activeScenario].title}:
                  </span>
                  {SCENARIOS[activeScenario].desc}
                </div>
              )}
            </div>

            {/* Quick Special Triples */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Özel LGS Dik Üçgenleri (Ezberlemeden Gör)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SPECIAL_TRIPLES.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => {
                      setA(t.a)
                      setB(t.b)
                      setActiveScenario('free')
                    }}
                    className={`px-2.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${
                      a === t.a && b === t.b
                        ? 'bg-violet-500 text-slate-950 border-violet-400 shadow-sm'
                        : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="font-mono text-xs">{t.label}</div>
                    <div className="text-[10px] opacity-75 font-normal truncate">{t.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Dimension Sliders */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Kenar Uzunlukları Ayarı
                </span>
                <button
                  onClick={() => setShowSquares(!showSquares)}
                  className={`text-[11px] px-2 py-0.5 rounded font-bold transition-all cursor-pointer ${
                    showSquares
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {showSquares ? 'Alan Kareleri Açık' : 'Kareleri Göster'}
                </button>
              </div>

              {/* a slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-rose-400">
                    Dikey Dik Kenar (a):
                  </span>
                  <span className="font-mono font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    a = {a} br
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={16}
                  value={a}
                  onChange={(e) => setA(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>

              {/* b slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-sky-400">
                    Yatay Dik Kenar (b):
                  </span>
                  <span className="font-mono font-bold text-white bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    b = {b} br
                  </span>
                </div>
                <input
                  type="range"
                  min={3}
                  max={20}
                  value={b}
                  onChange={(e) => setB(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              {/* Mathematical Proof Card */}
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="text-slate-400 text-[11px] font-sans font-bold uppercase tracking-wider">
                  Adım Adım Pisagor Hesabı:
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>a² = {a}² =</span>
                  <span className="text-rose-400 font-bold">{aSquare} br²</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>b² = {b}² =</span>
                  <span className="text-sky-400 font-bold">{bSquare} br²</span>
                </div>
                <div className="border-t border-slate-800 pt-1 flex items-center justify-between font-bold">
                  <span className="text-slate-200">c² = a² + b² =</span>
                  <span className="text-emerald-400">
                    {aSquare} + {bSquare} = {cSquare} br²
                  </span>
                </div>
                <div className="bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30 flex items-center justify-between text-emerald-300 font-bold">
                  <span>Hipotenüs (c) =</span>
                  <span className="text-sm font-black">{cDisplay} br</span>
                </div>
              </div>
            </div>
          </div>

          {/* Canvas & Geometric Display (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Canlı Geometrik Çizim & Alan İspatı
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold font-mono">
                  c = {cDisplay}
                </span>
              </div>

              {/* Interactive SVG Triangle Canvas */}
              <div className="w-full overflow-x-auto flex justify-center py-4">
                <svg
                  width={svgWidth}
                  height={svgHeight}
                  className="bg-slate-950/80 rounded-2xl border border-slate-800/80"
                >
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />

                  {/* ── Area Squares on Edges (Visual Proof) ── */}
                  {showSquares && (
                    <>
                      {/* Square on a (left of vertical side) */}
                      <rect
                        x={originX - Math.min(60, a * 5)}
                        y={pA.y}
                        width={Math.min(60, a * 5)}
                        height={pC.y - pA.y}
                        fill="rgba(244, 63, 94, 0.15)"
                        stroke="rgba(244, 63, 94, 0.6)"
                        strokeDasharray="3 3"
                      />
                      <text
                        x={originX - Math.min(60, a * 5) / 2}
                        y={pA.y + (pC.y - pA.y) / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#f43f5e"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        a²={aSquare}
                      </text>

                      {/* Square on b (below horizontal side) */}
                      <rect
                        x={originX}
                        y={originY}
                        width={pB.x - pC.x}
                        height={Math.min(50, b * 4)}
                        fill="rgba(56, 189, 248, 0.15)"
                        stroke="rgba(56, 189, 248, 0.6)"
                        strokeDasharray="3 3"
                      />
                      <text
                        x={originX + (pB.x - pC.x) / 2}
                        y={originY + Math.min(50, b * 4) / 2}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#38bdf8"
                        fontSize="11"
                        fontWeight="bold"
                      >
                        b²={bSquare}
                      </text>
                    </>
                  )}

                  {/* ── The Right Triangle ── */}
                  <polygon
                    points={`${pA.x},${pA.y} ${pC.x},${pC.y} ${pB.x},${pB.y}`}
                    fill="rgba(139, 92, 246, 0.2)"
                    stroke="#a78bfa"
                    strokeWidth="3"
                  />

                  {/* Right Angle Symbol at pC */}
                  <rect
                    x={originX}
                    y={originY - 14}
                    width="14"
                    height="14"
                    fill="none"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />
                  <circle cx={originX + 7} cy={originY - 7} r="2" fill="#94a3b8" />

                  {/* Edge a Label */}
                  <text
                    x={originX - 12}
                    y={pA.y + (pC.y - pA.y) / 2}
                    textAnchor="end"
                    fill="#fb7185"
                    fontSize="13"
                    fontWeight="bold"
                  >
                    a = {a}
                  </text>

                  {/* Edge b Label */}
                  <text
                    x={originX + (pB.x - pC.x) / 2}
                    y={originY + 18}
                    textAnchor="middle"
                    fill="#38bdf8"
                    fontSize="13"
                    fontWeight="bold"
                  >
                    b = {b}
                  </text>

                  {/* Hypotenuse c Label (middle of hypotenuse) */}
                  <text
                    x={(pA.x + pB.x) / 2 + 10}
                    y={(pA.y + pB.y) / 2 - 10}
                    textAnchor="start"
                    fill="#34d399"
                    fontSize="14"
                    fontWeight="bold"
                  >
                    c = {cDisplay}
                  </text>

                  {/* Corner Vertex Points */}
                  <circle cx={pA.x} cy={pA.y} r="5" fill="#f43f5e" />
                  <circle cx={pB.x} cy={pB.y} r="5" fill="#38bdf8" />
                  <circle cx={pC.x} cy={pC.y} r="5" fill="#a78bfa" />
                </svg>
              </div>

              {/* Educational Rule Callout */}
              <div className="w-full mt-2 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
                <HelpCircle className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-white">
                    Maarif Modeli Geometrik İspat Kuralı:
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Bir dik üçgende 90 derecelik açıyı oluşturan dik kenarların karelerinin toplamı (kırmızı ve mavi alanlar), daima hipotenüsün üzerine kurulan yeşil karenin alanına eşittir:{' '}
                    <strong className="text-violet-300 font-mono">
                      {aSquare} + {bSquare} = {cSquare}
                    </strong>
                    . Hipotenüs her zaman bir dik üçgenin en uzun kenarıdır.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SUB-TAB 2: SLOPE & COORDINATES ── */}
      {subTab === 'slope' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Noktaların Koordinatları
              </span>

              {/* Point A */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-rose-400">
                  <span>A Noktası (x₁, y₁)</span>
                  <span className="font-mono">({x1}, {y1})</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-slate-400 block text-[10px]">x₁ = {x1}</label>
                    <input
                      type="range"
                      min={-4}
                      max={6}
                      value={x1}
                      onChange={(e) => setX1(Number(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block text-[10px]">y₁ = {y1}</label>
                    <input
                      type="range"
                      min={-4}
                      max={6}
                      value={y1}
                      onChange={(e) => setY1(Number(e.target.value))}
                      className="w-full accent-rose-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Point B */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-sky-400">
                  <span>B Noktası (x₂, y₂)</span>
                  <span className="font-mono">({x2}, {y2})</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-slate-400 block text-[10px]">x₂ = {x2}</label>
                    <input
                      type="range"
                      min={-4}
                      max={8}
                      value={x2}
                      onChange={(e) => setX2(Number(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block text-[10px]">y₂ = {y2}</label>
                    <input
                      type="range"
                      min={-4}
                      max={8}
                      value={y2}
                      onChange={(e) => setY2(Number(e.target.value))}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Slope Math Calculation */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2.5 text-xs">
                <div className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
                  Eğim Formülü (LGS 8. Sınıf):
                </div>
                <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 font-mono text-center text-sm font-bold text-amber-300">
                  m = Dikey Uzunluk (Δy) / Yatay Uzunluk (Δx)
                </div>
                <div className="space-y-1 font-mono text-slate-300 pt-1">
                  <div className="flex justify-between">
                    <span>Δy (y₂ - y₁) =</span>
                    <span className="text-white font-bold">{y2} - ({y1}) = {deltaY}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Δx (x₂ - x₁) =</span>
                    <span className="text-white font-bold">{x2} - ({x1}) = {deltaX}</span>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-2 flex items-center justify-between">
                  <span className="font-bold text-slate-300">Doğrunun Eğimi (m):</span>
                  {isVertical ? (
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                      Tanımsız (Dikey Duvar)
                    </span>
                  ) : isHorizontal ? (
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30 font-bold">
                      m = 0 (Yatay Zemin)
                    </span>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-mono font-black ${
                        slopeValue! > 0
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      m = {slopeValue!.toFixed(2)} ({slopeValue! > 0 ? 'Pozitif / Sağa Yatık' : 'Negatif / Sola Yatık'})
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Coordinate Plane Visual (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-slate-400 uppercase tracking-wider">
                  Kartezyen Koordinat Düzlemi (x, y)
                </span>
                <span className="text-amber-400 font-bold">
                  {slopeValue !== null
                    ? slopeValue > 0
                      ? '📈 Sağa Yatık (Pozitif Yokuş)'
                      : '📉 Sola Yatık (Negatif İniş)'
                    : 'Tanımsız Eğim'}
                </span>
              </div>

              {/* Coordinate Grid SVG */}
              <div className="w-full flex justify-center py-2">
                <svg
                  width={400}
                  height={320}
                  className="bg-slate-950/90 rounded-2xl border border-slate-800"
                >
                  {/* Origin at (200, 160), grid step = 20 */}
                  <defs>
                    <pattern id="coordGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#coordGrid)" />

                  {/* Axes */}
                  <line x1="0" y1="160" x2="400" y2="160" stroke="#475569" strokeWidth="2" />
                  <line x1="200" y1="0" x2="200" y2="320" stroke="#475569" strokeWidth="2" />
                  <text x="390" y="152" fill="#94a3b8" fontSize="11" fontWeight="bold">x</text>
                  <text x="208" y="16" fill="#94a3b8" fontSize="11" fontWeight="bold">y</text>

                  {/* Points coordinates converted to SVG coords */}
                  {(() => {
                    const cX1 = 200 + x1 * 20
                    const cY1 = 160 - y1 * 20
                    const cX2 = 200 + x2 * 20
                    const cY2 = 160 - y2 * 20

                    // Line extended across
                    const dx = cX2 - cX1
                    const dy = cY2 - cY1

                    return (
                      <>
                        {/* Slope Triangle (Rise over Run) */}
                        <polygon
                          points={`${cX1},${cY1} ${cX2},${cY1} ${cX2},${cY2}`}
                          fill="rgba(245, 158, 11, 0.15)"
                          stroke="rgba(245, 158, 11, 0.5)"
                          strokeDasharray="3 3"
                        />

                        {/* Extended Line */}
                        <line
                          x1={cX1 - dx * 2}
                          y1={cY1 - dy * 2}
                          x2={cX2 + dx * 2}
                          y2={cY2 + dy * 2}
                          stroke="#a855f7"
                          strokeWidth="3"
                        />

                        {/* Point A */}
                        <circle cx={cX1} cy={cY1} r="6" fill="#f43f5e" />
                        <text x={cX1 - 10} y={cY1 - 10} fill="#f43f5e" fontSize="11" fontWeight="bold">
                          A({x1}, {y1})
                        </text>

                        {/* Point B */}
                        <circle cx={cX2} cy={cY2} r="6" fill="#38bdf8" />
                        <text x={cX2 + 8} y={cY2 - 8} fill="#38bdf8" fontSize="11" fontWeight="bold">
                          B({x2}, {y2})
                        </text>
                      </>
                    )
                  })()}
                </svg>
              </div>

              {/* LGS Tip Box */}
              <div className="w-full mt-3 p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
                <span className="font-bold text-amber-300 block mb-0.5">
                  💡 LGS Eğim Tüyosu:
                </span>
                Sağa yatık doğruların eğimi daima <strong>pozitiftir (+)</strong>. Sola yatık doğruların eğimi <strong>negatiftir (-)</strong>. Yatay doğruların eğimi sıfırdır ($m = 0$), dikey doğruların eğimi ise payda 0 olacağı için tanımsızdır.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
