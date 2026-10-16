'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PieChart,
  Percent,
  Sliders,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  Divide,
  Layers,
} from 'lucide-react'

export function FractionsLabModule() {
  const [numerator, setNumerator] = useState<number>(3)
  const [denominator, setDenominator] = useState<number>(4)
  const [multiplier, setMultiplier] = useState<number>(1) // For equivalent fractions

  // Effective values considering expansion
  const effNum = numerator * multiplier
  const effDen = denominator * multiplier

  // Decimal and Percent equivalents
  const decimalVal = denominator > 0 ? (numerator / denominator).toFixed(3) : '0'
  const percentVal = denominator > 0 ? ((numerator / denominator) * 100).toFixed(1) : '0'

  // Fraction Type
  const isUnitFraction = numerator === 1
  const isProper = numerator < denominator
  const isWhole = numerator === denominator
  const isImproper = numerator > denominator

  // Mixed Fraction Conversion for Improper Fractions
  const wholePart = Math.floor(numerator / denominator)
  const remainderNum = numerator % denominator

  // Presets
  const FRACTION_PRESETS = [
    { label: '1 / 2 (Yarım)', num: 1, den: 2, desc: 'En temel birim kesir; %50' },
    { label: '1 / 4 (Çeyrek)', num: 1, den: 4, desc: 'Bütünün dörtte biri; %25' },
    { label: '3 / 4 (Üç Çeyrek)', num: 3, den: 4, desc: 'Basit kesir; %75' },
    { label: '5 / 8', num: 5, den: 8, desc: 'Basit kesir modellemesi' },
    { label: '7 / 4 (Bileşik)', num: 7, den: 4, desc: '1 Tam ve 3/4 (Bileşik kesir)' },
    { label: '5 / 2 (Bileşik)', num: 5, den: 2, desc: '2 Tam ve 1/2 (Bileşik kesir)' },
  ]

  // Render Slices for Pizza / Circular Pie SVG
  const renderPieSvg = (numSlices: number, denTotal: number, radius = 60, cx = 75, cy = 75) => {
    const slices = []
    const angleStep = (2 * Math.PI) / denTotal

    for (let i = 0; i < denTotal; i++) {
      const startAngle = i * angleStep - Math.PI / 2
      const endAngle = (i + 1) * angleStep - Math.PI / 2
      const x1 = cx + radius * Math.cos(startAngle)
      const y1 = cy + radius * Math.sin(startAngle)
      const x2 = cx + radius * Math.cos(endAngle)
      const y2 = cy + radius * Math.sin(endAngle)
      const isFilled = i < numSlices

      // SVG Arc Path
      const pathData = `M ${cx},${cy} L ${x1},${y1} A ${radius},${radius} 0 0,1 ${x2},${y2} Z`

      slices.push(
        <path
          key={i}
          d={pathData}
          fill={isFilled ? '#38bdf8' : '#1e293b'}
          stroke="#0f172a"
          strokeWidth="2"
          className="transition-colors duration-150"
        />
      )
    }

    return slices
  }

  // Calculate number of whole pies needed for improper fractions
  const totalPiesNeeded = Math.ceil(numerator / denominator)

  return (
    <div className="space-y-6">
      {/* ── Subheader ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-sky-950/30 border border-cyan-500/20 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              5. Sınıf Matematik
            </span>
            <span className="text-xs text-slate-400">Kesirler, Denk Kesirler & Modelleme</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-cyan-400" />
            Kesirler, Pasta & Şerit Modeli Laboratuvarı
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Birim kesir, basit, bileşik ve tam sayılı kesirleri renkli pasta ve çikolata şerit modelleriyle somutlaştırın.
          </p>
        </div>

        {/* Fraction Type Badge */}
        <div className="self-start sm:self-auto shrink-0">
          <span
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono border ${
              isUnitFraction
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : isProper
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : isWhole
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}
          >
            {isUnitFraction
              ? '✨ Birim Kesir (Pay = 1)'
              : isProper
              ? '🟢 Basit Kesir (Pay < Payda)'
              : isWhole
              ? '🟣 Bütüne Eşit (Pay = Payda = 1)'
              : '🔴 Bileşik Kesir (Pay > Payda)'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Presets */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Örnek MEB Kesirleri
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FRACTION_PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => {
                    setNumerator(p.num)
                    setDenominator(p.den)
                    setMultiplier(1)
                  }}
                  className={`p-2 rounded-xl text-xs font-bold border transition-all cursor-pointer text-left ${
                    numerator === p.num && denominator === p.den && multiplier === 1
                      ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-sm'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="font-mono text-sm">{p.num} / {p.den}</div>
                  <div className="text-[10px] opacity-75 truncate">{p.label.split(' ')[2] || ''}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Numerator and Denominator Sliders */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Pay ve Payda Ayarları
            </span>

            {/* Numerator (Pay) Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-cyan-400">
                  Pay (Alınan Parça Sayısı):
                </span>
                <span className="font-mono font-bold text-white bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                  {numerator}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={12}
                value={numerator}
                onChange={(e) => {
                  setNumerator(Number(e.target.value))
                  setMultiplier(1)
                }}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Denominator (Payda) Slider */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-amber-400">
                  Payda (Bütünün Bölündüğü Eşit Parça):
                </span>
                <span className="font-mono font-bold text-white bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                  {denominator}
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={12}
                value={denominator}
                onChange={(e) => {
                  setDenominator(Number(e.target.value))
                  setMultiplier(1)
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Equivalent Fractions Multiplier */}
            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Denk Kesir (Genişletme):
                </span>
                <span className="font-mono text-cyan-300 font-bold">
                  {multiplier} Katı
                </span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMultiplier(m)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      multiplier === m
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    ×{m}
                  </button>
                ))}
              </div>
              {multiplier > 1 && (
                <div className="text-[11px] text-cyan-300 bg-cyan-950/30 p-2 rounded-lg border border-cyan-500/20 font-mono text-center">
                  {numerator}/{denominator} = {effNum}/{effDen} (Denk Kesir)
                </div>
              )}
            </div>
          </div>

          {/* Mathematical Conversions Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5 text-xs">
            <span className="font-bold text-slate-400 uppercase tracking-wider block">
              Dönüşümler & Eşdeğerler:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Ondalık Gösterim:</span>
                <span className="text-sm font-mono font-bold text-white">≈ {decimalVal}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Yüzde Karşılığı:</span>
                <span className="text-sm font-mono font-bold text-emerald-400">%{percentVal}</span>
              </div>
            </div>

            {/* Improper fraction mixed number info */}
            {isImproper && (
              <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-200">
                <span className="font-bold block mb-0.5">Tam Sayılı Kesir Dönüşümü:</span>
                <span className="font-mono text-sm font-bold">
                  {numerator}/{denominator} = {wholePart} Tam {remainderNum}/{denominator}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Visual Models Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
            {/* Big Fraction Display */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="inline-flex flex-col items-center justify-center font-mono font-black text-2xl text-white bg-slate-950 px-4 py-1.5 rounded-xl border border-slate-800">
                  <span className="text-cyan-400 border-b border-slate-600 px-2">{effNum}</span>
                  <span className="text-amber-400 px-2">{effDen}</span>
                </div>
                <div className="text-xs text-slate-400">
                  <span className="font-bold text-white block">
                    "{effNum} bölü {effDen}" veya "{effDen}'de {effNum}"
                  </span>
                  <span>{isProper ? '1 bütünden az' : isWhole ? 'Tam 1 bütün' : '1 bütünden fazla'}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Birim Kesir</span>
                <span className="font-mono font-bold text-amber-400 text-sm">1 / {denominator}</span>
              </div>
            </div>

            {/* Model 1: Circular Pie (Pizza) Model */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                1. Daire (Pasta/Pizza) Modeli:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-6 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                {Array.from({ length: totalPiesNeeded }).map((_, pieIdx) => {
                  const slicesInThisPie = Math.max(
                    0,
                    Math.min(denominator, numerator - pieIdx * denominator)
                  )

                  return (
                    <div key={pieIdx} className="flex flex-col items-center gap-1.5">
                      <svg width="150" height="150" className="overflow-visible">
                        {renderPieSvg(slicesInThisPie, denominator, 65, 75, 75)}
                      </svg>
                      <span className="text-[11px] font-mono font-bold text-slate-400">
                        {pieIdx + 1}. Bütün ({slicesInThisPie}/{denominator})
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Model 2: Linear Rectangle Bar (Chocolate) Model */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                2. Dikdörtgen Şerit (Çikolata) Modeli:
              </span>
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                {Array.from({ length: totalPiesNeeded }).map((_, barIdx) => {
                  const slicesInThisBar = Math.max(
                    0,
                    Math.min(denominator, numerator - barIdx * denominator)
                  )

                  return (
                    <div key={barIdx} className="space-y-1">
                      <div className="flex h-10 w-full rounded-xl overflow-hidden border-2 border-slate-700 bg-slate-900">
                        {Array.from({ length: denominator }).map((_, sIdx) => {
                          const isFilled = sIdx < slicesInThisBar
                          return (
                            <div
                              key={sIdx}
                              style={{ width: `${100 / denominator}%` }}
                              className={`h-full border-r border-slate-800 flex items-center justify-center text-xs font-mono font-bold transition-all ${
                                isFilled
                                  ? 'bg-gradient-to-r from-cyan-500 to-sky-400 text-slate-950'
                                  : 'bg-slate-900 text-slate-600'
                              }`}
                            >
                              1/{denominator}
                            </div>
                          )
                        })}
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono px-1">
                        <span>0</span>
                        <span>{barIdx + 1}. Bütün</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Educational Maarif Rule Callout */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <div className="font-bold text-white">
                  5. Sınıf Maarif Modeli Kesir Kavramı:
                </div>
                <p className="text-slate-300 leading-relaxed">
                  <strong>Payda</strong>, bir bütünün kaç eşit parçaya bölündüğünü gösterir. <strong>Pay</strong> ise bu eşit parçalardan kaç tanesinin alındığını belirtir. Payı 1 olan her kesir bir <strong>birim kesirdir</strong> (örneğin 1/{denominator}).
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
