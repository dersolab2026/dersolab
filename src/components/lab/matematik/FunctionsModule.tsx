'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Activity,
  Sliders,
  Sparkles,
  ArrowRight,
  Layers,
  HelpCircle,
  RotateCcw,
} from 'lucide-react'

type FunctionType = 'linear' | 'absolute' | 'quadratic'

export function FunctionsModule() {
  const [fnType, setFnType] = useState<FunctionType>('linear')
  const [slopeA, setSlopeA] = useState<number>(1.5) // a parameter
  const [interceptB, setInterceptB] = useState<number>(1) // b parameter
  const [shiftX, setShiftX] = useState<number>(0) // horizontal shift (x - r)
  const [inputVal, setInputVal] = useState<number>(2) // test input x

  // Evaluate function for given x
  const evaluate = (x: number): number => {
    const adjustedX = x - shiftX
    if (fnType === 'linear') {
      return slopeA * adjustedX + interceptB
    } else if (fnType === 'absolute') {
      return Math.abs(slopeA * adjustedX) + interceptB
    } else {
      return slopeA * Math.pow(adjustedX, 2) + interceptB
    }
  }

  const outputVal = evaluate(inputVal)

  // Canvas bounds: x from -6 to +6, y from -6 to +6
  // SVG size 400x300. center is (200, 150). scale: 22 px per unit.
  const originX = 200
  const originY = 150
  const scale = 22

  const toSvgX = (x: number) => originX + x * scale
  const toSvgY = (y: number) => originY - y * scale

  // Generate curve path
  let pathD = ''
  for (let px = -7; px <= 7; px += 0.2) {
    const py = evaluate(px)
    const sx = toSvgX(px)
    const sy = toSvgY(py)
    if (px === -7) {
      pathD = `M ${sx} ${sy}`
    } else {
      pathD += ` L ${sx} ${sy}`
    }
  }

  // Characteristics
  const yIntercept = evaluate(0)
  const xIntercept = fnType === 'linear' && slopeA !== 0 ? shiftX - interceptB / slopeA : null

  return (
    <div className="space-y-6">
      {/* ── Header Card ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-bold">
              9. Sınıf Maarif Modeli & TYT
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              f(x) = a · (x - r) + b
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Fonksiyonlar, Tanım/Değer Kümesi & Grafik Dönüşümleri
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Doğrusal, mutlak değerli ve kuadratik fonksiyonlarda eğim (a), öteleme (r, b) parametrelerinin grafiğe etkisini, eksen kesişimlerini ve girdi-çıktı makinesini inceleyin.
          </p>
        </div>

        {/* Function Type Selector */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <button
            type="button"
            onClick={() => setFnType('linear')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              fnType === 'linear'
                ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Doğrusal f(x)
          </button>
          <button
            type="button"
            onClick={() => setFnType('absolute')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              fnType === 'absolute'
                ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            |f(x)| Mutlak Değer
          </button>
          <button
            type="button"
            onClick={() => setFnType('quadratic')}
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              fnType === 'quadratic'
                ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kuvvet f(x²)
          </button>
        </div>
      </div>

      {/* ── Main Canvas & Controls Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Graph Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="relative h-[360px] sm:h-[420px] w-full rounded-3xl bg-[#030712] border border-slate-800/90 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between z-10">
              <div className="text-xs font-bold text-violet-300 font-mono bg-violet-950/40 border border-violet-800/60 px-3 py-1.5 rounded-xl">
                {fnType === 'linear' && `f(x) = ${slopeA}x + ${interceptB}`}
                {fnType === 'absolute' && `f(x) = |${slopeA}x| + ${interceptB}`}
                {fnType === 'quadratic' && `f(x) = ${slopeA}x² + ${interceptB}`}
              </div>

              {/* Point on curve indicator */}
              <div className="text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                Nokta: <span className="text-cyan-400">({inputVal}, {outputVal.toFixed(1)})</span>
              </div>
            </div>

            {/* Cartesian Coordinate Plane SVG */}
            <div className="relative flex-1 w-full flex items-center justify-center">
              <svg className="w-full h-full max-w-[460px]" viewBox="0 0 400 300">
                <defs>
                  <pattern id="mathGrid" width="22" height="22" patternUnits="userSpaceOnUse">
                    <path d="M 22 0 L 0 0 0 22" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  </pattern>
                </defs>

                <rect width="400" height="300" fill="url(#mathGrid)" />

                {/* X and Y Axes */}
                <line x1="20" y1={originY} x2="380" y2={originY} stroke="#475569" strokeWidth="2" />
                <line x1={originX} y1="20" x2={originX} y2="280" stroke="#475569" strokeWidth="2" />
                <text x="385" y={originY + 4} fill="#94a3b8" fontSize="10" fontWeight="bold">x</text>
                <text x={originX - 4} y="15" fill="#94a3b8" fontSize="10" fontWeight="bold">y</text>

                {/* Tick numbers */}
                {[-5, -3, -1, 1, 3, 5].map((val) => (
                  <g key={val}>
                    <line x1={toSvgX(val)} y1={originY - 3} x2={toSvgX(val)} y2={originY + 3} stroke="#64748b" strokeWidth="1.5" />
                    <text x={toSvgX(val)} y={originY + 14} fill="#64748b" fontSize="9" textAnchor="middle">{val}</text>

                    <line x1={originX - 3} y1={toSvgY(val)} x2={originX + 3} y2={toSvgY(val)} stroke="#64748b" strokeWidth="1.5" />
                    <text x={originX - 10} y={toSvgY(val) + 3} fill="#64748b" fontSize="9" textAnchor="end">{val}</text>
                  </g>
                ))}

                {/* Function Graph Line */}
                <path d={pathD} fill="none" stroke="#8b5cf6" strokeWidth="3" />

                {/* Interactive Highlighted Point (x, f(x)) */}
                <g>
                  <circle cx={toSvgX(inputVal)} cy={toSvgY(outputVal)} r="6" fill="#06b6d4" stroke="#ffffff" strokeWidth="2" />
                  {/* Projection dashed lines to axes */}
                  <line
                    x1={toSvgX(inputVal)}
                    y1={originY}
                    x2={toSvgX(inputVal)}
                    y2={toSvgY(outputVal)}
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                  />
                  <line
                    x1={originX}
                    y1={toSvgY(outputVal)}
                    x2={toSvgX(inputVal)}
                    y2={toSvgY(outputVal)}
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                  />
                </g>
              </svg>
            </div>

            {/* Bottom Realtime Intercepts */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 bg-slate-950/70 p-2.5 rounded-2xl z-10 text-center">
              <div>
                <div className="text-[10px] text-slate-400">y Eksenini Kesim (f(0))</div>
                <div className="text-sm sm:text-base font-extrabold text-violet-400 font-mono">
                  (0, {yIntercept.toFixed(1)})
                </div>
              </div>
              <div className="border-x border-slate-800">
                <div className="text-[10px] text-slate-400">x Eksenini Kesim (f(x)=0)</div>
                <div className="text-sm sm:text-base font-extrabold text-cyan-400 font-mono">
                  {xIntercept !== null ? `(${xIntercept.toFixed(1)}, 0)` : 'Yok'}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Doğru Eğimi (m)</div>
                <div className="text-sm sm:text-base font-extrabold text-emerald-400 font-mono">
                  {slopeA}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-violet-400" />
              <span>Fonksiyon Parametreleri</span>
            </h3>

            {/* Slope A Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-400">Eğim / Kat Sayı (a):</span>
                <span className="text-violet-400 font-bold">{slopeA}</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.5"
                value={slopeA}
                onChange={(e) => setSlopeA(Number(e.target.value))}
                className="w-full accent-violet-500"
              />
            </div>

            {/* Intercept B Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-400">Düşey Öteleme (b):</span>
                <span className="text-cyan-400 font-bold">{interceptB}</span>
              </div>
              <input
                type="range"
                min="-4"
                max="4"
                step="0.5"
                value={interceptB}
                onChange={(e) => setInterceptB(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>

            {/* Horizontal Shift Slider (x - r) */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-400">Yatay Öteleme (r):</span>
                <span className="text-emerald-400 font-bold">{shiftX}</span>
              </div>
              <input
                type="range"
                min="-3"
                max="3"
                step="1"
                value={shiftX}
                onChange={(e) => setShiftX(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Input x test slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-400">Nokta İncele (x):</span>
                <span className="text-amber-400 font-bold">{inputVal}</span>
              </div>
              <input
                type="range"
                min="-4"
                max="4"
                step="0.5"
                value={inputVal}
                onChange={(e) => setInputVal(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          {/* Fonksiyon Makinesi Kartı */}
          <div className="p-4 rounded-3xl bg-slate-900/50 border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>Girdi-Çıktı Fonksiyon Makinesi</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/80 border border-slate-800 font-mono">
              <div className="text-center">
                <div className="text-[10px] text-slate-400">Girdi (x)</div>
                <div className="text-sm font-bold text-amber-400">{inputVal}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600" />
              <div className="text-center px-2 py-1 rounded-xl bg-violet-500/20 text-violet-300 font-bold text-xs">
                f(x)
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600" />
              <div className="text-center">
                <div className="text-[10px] text-slate-400">Çıktı y=f(x)</div>
                <div className="text-sm font-bold text-cyan-400">{outputVal.toFixed(1)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
