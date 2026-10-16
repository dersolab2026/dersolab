'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Activity,
  Sliders,
  Sparkles,
  ArrowRight,
  HelpCircle,
  Maximize2,
} from 'lucide-react'

export function ParabolaModule() {
  const [a, setA] = useState<number>(1) // a parameter (cannot be 0)
  const [b, setB] = useState<number>(-2) // b parameter
  const [c, setC] = useState<number>(-3) // c parameter

  // Vertex: r = -b / (2a), k = f(r)
  const r = -b / (2 * a)
  const k = a * r * r + b * r + c

  // Discriminant: Delta = b^2 - 4ac
  const delta = b * b - 4 * a * c

  // Roots
  let roots: number[] = []
  if (delta > 0) {
    const sqrtDelta = Math.sqrt(delta)
    const x1 = (-b - sqrtDelta) / (2 * a)
    const x2 = (-b + sqrtDelta) / (2 * a)
    roots = [Math.min(x1, x2), Math.max(x1, x2)]
  } else if (delta === 0) {
    roots = [r]
  }

  // Cartesian plane setup
  // svg 400x300, center (200, 150), scale 20 px per unit
  const originX = 200
  const originY = 150
  const scale = 20

  const toSvgX = (x: number) => originX + x * scale
  const toSvgY = (y: number) => originY - y * scale

  // Generate parabola path
  let pathD = ''
  for (let px = -8; px <= 8; px += 0.2) {
    const py = a * px * px + b * px + c
    const sx = toSvgX(px)
    const sy = toSvgY(py)
    if (px === -8) {
      pathD = `M ${sx} ${sy}`
    } else {
      pathD += ` L ${sx} ${sy}`
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Header Card ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-bold">
              10. Sınıf Maarif & AYT
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              f(x) = ax² + bx + c
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            İkinci Dereceden Fonksiyonlar & Parabol Simülatörü
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Tepe noktası T(r, k), simetri ekseni x = r, diskriminant (Δ = b² - 4ac) ve kolların yönünü katsayıları kaydırarak anında görselleştirin.
          </p>
        </div>

        {/* Delta Status Badge */}
        <div className={`px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 ${
          delta > 0
            ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
            : delta === 0
            ? 'bg-amber-500/15 border-amber-500/35 text-amber-300'
            : 'bg-rose-500/15 border-rose-500/35 text-rose-300'
        }`}>
          <Maximize2 className="w-4 h-4" />
          <span>
            {delta > 0 ? 'Δ > 0 (2 Farklı Reel Kök)' : delta === 0 ? 'Δ = 0 (Çift Katlı Kök, Teğet)' : 'Δ < 0 (Reel Kök Yok)'}
          </span>
        </div>
      </div>

      {/* ── Main Canvas & Controls Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Parabola Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="relative h-[360px] sm:h-[420px] w-full rounded-3xl bg-[#030712] border border-slate-800/90 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between z-10">
              <div className="text-xs font-bold text-violet-300 font-mono bg-violet-950/40 border border-violet-800/60 px-3 py-1.5 rounded-xl">
                f(x) = {a}x² {b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`}x {c >= 0 ? `+ ${c}` : `- ${Math.abs(c)}`}
              </div>

              {/* Vertex Pill */}
              <div className="text-xs font-bold text-slate-300 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
                Tepe Noktası T(r, k): <span className="text-amber-400 font-mono">({r.toFixed(1)}, {k.toFixed(1)})</span>
              </div>
            </div>

            {/* Coordinate Plane SVG */}
            <div className="relative flex-1 w-full flex items-center justify-center">
              <svg className="w-full h-full max-w-[460px]" viewBox="0 0 400 300">
                <defs>
                  <pattern id="paraGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  </pattern>
                </defs>

                <rect width="400" height="300" fill="url(#paraGrid)" />

                {/* X and Y Axes */}
                <line x1="20" y1={originY} x2="380" y2={originY} stroke="#475569" strokeWidth="2" />
                <line x1={originX} y1="20" x2={originX} y2="280" stroke="#475569" strokeWidth="2" />
                <text x="385" y={originY + 4} fill="#94a3b8" fontSize="10" fontWeight="bold">x</text>
                <text x={originX - 4} y="15" fill="#94a3b8" fontSize="10" fontWeight="bold">y</text>

                {/* Axis of Symmetry: x = r */}
                <line
                  x1={toSvgX(r)}
                  y1="20"
                  x2={toSvgX(r)}
                  y2="280"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeDasharray="4,4"
                />
                <text x={toSvgX(r) + 5} y="30" fill="#fbbf24" fontSize="9" fontWeight="bold">
                  x = {r.toFixed(1)}
                </text>

                {/* Parabola Curve */}
                <path d={pathD} fill="none" stroke="#8b5cf6" strokeWidth="3.5" />

                {/* Vertex Point T(r, k) */}
                <circle cx={toSvgX(r)} cy={toSvgY(k)} r="6" fill="#f59e0b" stroke="#ffffff" strokeWidth="2" />

                {/* Roots Points on X Axis (if any) */}
                {roots.map((root, idx) => (
                  <g key={idx}>
                    <circle cx={toSvgX(root)} cy={originY} r="5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
                    <text x={toSvgX(root)} y={originY - 8} fill="#6ee7b7" fontSize="10" fontWeight="bold" textAnchor="middle">
                      x{idx + 1}={root.toFixed(1)}
                    </text>
                  </g>
                ))}
              </svg>
            </div>

            {/* Bottom Live Metrics */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 bg-slate-950/70 p-2.5 rounded-2xl z-10 text-center">
              <div>
                <div className="text-[10px] text-slate-400">Diskriminant (Δ)</div>
                <div className={`text-sm sm:text-base font-extrabold font-mono ${delta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {delta.toFixed(1)}
                </div>
              </div>
              <div className="border-x border-slate-800">
                <div className="text-[10px] text-slate-400">Tepe Noktası T(r, k)</div>
                <div className="text-sm sm:text-base font-extrabold text-amber-400 font-mono">
                  ({r.toFixed(1)}, {k.toFixed(1)})
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Kolların Yönü</div>
                <div className="text-sm sm:text-base font-extrabold text-violet-400">
                  {a > 0 ? 'Yukarı (∪ min k)' : 'Aşağı (∩ maks k)'}
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
              <span>Parabol Katsayıları</span>
            </h3>

            {/* a Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-400">Kolların Açıklığı & Yönü (a):</span>
                <span className="text-violet-400 font-bold">{a}</span>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.5"
                value={a}
                onChange={(e) => {
                  const val = Number(e.target.value)
                  setA(val === 0 ? 0.5 : val)
                }}
                className="w-full accent-violet-500"
              />
            </div>

            {/* b Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-400">Simetri Ekseni Kaydırıcı (b):</span>
                <span className="text-amber-400 font-bold">{b}</span>
              </div>
              <input
                type="range"
                min="-6"
                max="6"
                step="0.5"
                value={b}
                onChange={(e) => setB(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* c Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-400">y Eksenini Kesme Noktası (c):</span>
                <span className="text-cyan-400 font-bold">{c}</span>
              </div>
              <input
                type="range"
                min="-6"
                max="6"
                step="0.5"
                value={c}
                onChange={(e) => setC(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>

          {/* Formül & AYT Bilgi Kartı */}
          <div className="p-4 rounded-3xl bg-slate-900/50 border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>AYT Parabol Formül Kartı</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-slate-400">Tepe Apsisi:</div>
                <div className="font-mono text-amber-400 font-bold">r = -b / (2a)</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-slate-400">Diskriminant:</div>
                <div className="font-mono text-emerald-400 font-bold">Δ = b² - 4ac</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-slate-400">Kökler Toplamı:</div>
                <div className="font-mono text-cyan-400 font-bold">x1 + x2 = -b / a</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-slate-400">Kökler Çarpımı:</div>
                <div className="font-mono text-violet-400 font-bold">x1 · x2 = c / a</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
