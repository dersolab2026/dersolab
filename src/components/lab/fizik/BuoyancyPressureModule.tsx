'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Waves,
  Droplets,
  Scale,
  Sliders,
  Sparkles,
  Info,
  ArrowDown,
  ArrowUp,
  Anchor,
  HelpCircle,
} from 'lucide-react'

interface LiquidPreset {
  id: string
  name: string
  density: number // g/cm^3
  color: string
}

interface ObjectPreset {
  id: string
  name: string
  density: number // g/cm^3
  color: string
  borderColor: string
}

const LIQUIDS: LiquidPreset[] = [
  { id: 'water', name: 'Saf Su', density: 1.0, color: '#0284c7' },
  { id: 'saltwater', name: 'Tuzlu Su (Deniz)', density: 1.15, color: '#0369a1' },
  { id: 'oil', name: 'Zeytinyağı', density: 0.9, color: '#eab308' },
  { id: 'glycerin', name: 'Gliserin', density: 1.26, color: '#14b8a6' },
]

const OBJECTS: ObjectPreset[] = [
  { id: 'wood', name: 'Tahta Takoz', density: 0.6, color: '#78350f', borderColor: '#b45309' },
  { id: 'ice', name: 'Buz Kalıbı', density: 0.9, color: '#38bdf8', borderColor: '#7dd3fc' },
  { id: 'plastic', name: 'Plastik Şamandıra', density: 0.75, color: '#ea580c', borderColor: '#fb923c' },
  { id: 'aluminum', name: 'Alüminyum Blok', density: 2.7, color: '#64748b', borderColor: '#94a3b8' },
  { id: 'iron', name: 'Demir Külçe', density: 7.8, color: '#334155', borderColor: '#64748b' },
]

export function BuoyancyPressureModule() {
  const [liquidDensity, setLiquidDensity] = useState<number>(1.0)
  const [objectDensity, setObjectDensity] = useState<number>(0.6)
  const [objectVolume, setObjectVolume] = useState<number>(100) // cm^3
  const [selectedLiquidId, setSelectedLiquidId] = useState<string>('water')
  const [selectedObjectId, setSelectedObjectId] = useState<string>('wood')
  const [depthProbe, setDepthProbe] = useState<number>(15) // cm

  const g = 10 // m/s^2

  // Object weight in Air
  // mass = V * d (in grams) -> kg = (V * d) / 1000
  const massGrams = objectVolume * objectDensity
  const weightInAir = (massGrams * g) / 1000 // N

  // Buoyancy calculation
  let submergedVolume = 0
  let floatState: 'floating' | 'suspended' | 'sunk' = 'floating'
  let buoyancyForce = 0
  let bottomNormalForce = 0

  if (objectDensity < liquidDensity) {
    floatState = 'floating'
    // V_batan / V_cisim = d_cisim / d_sıvı
    submergedVolume = objectVolume * (objectDensity / liquidDensity)
    buoyancyForce = weightInAir // When floating, F_k = G
    bottomNormalForce = 0
  } else if (Math.abs(objectDensity - liquidDensity) < 0.01) {
    floatState = 'suspended'
    submergedVolume = objectVolume
    buoyancyForce = weightInAir
    bottomNormalForce = 0
  } else {
    floatState = 'sunk'
    submergedVolume = objectVolume
    // F_k = V_batan * d_sıvı * g
    buoyancyForce = (submergedVolume * liquidDensity * g) / 1000
    bottomNormalForce = weightInAir - buoyancyForce // normal force from container floor
  }

  // Liquid Pressure at probe depth: P = h * d * g
  // h in meters = depthProbe / 100, d in kg/m^3 = liquidDensity * 1000
  const liquidPressurePascal = (depthProbe / 100) * (liquidDensity * 1000) * g

  // Apparent weight in water (scale reading if suspended by string)
  const scaleReading = floatState === 'sunk' ? weightInAir - buoyancyForce : 0

  const handleLiquidPreset = (l: LiquidPreset) => {
    setSelectedLiquidId(l.id)
    setLiquidDensity(l.density)
  }

  const handleObjectPreset = (o: ObjectPreset) => {
    setSelectedObjectId(o.id)
    setObjectDensity(o.density)
  }

  return (
    <div className="space-y-6">
      {/* ── Header Card ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
              8. Sınıf LGS & 10. Sınıf TYT
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              Fk = Vbatan · d · g
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Sıvıların Kaldırma Kuvveti & Sıvı Basıncı Laboratuvarı
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Arşimet prensibini görselleştirin: Cisimlerin yoğunluğuna göre yüzme, askıda kalma ve batma durumlarını, dinamometrede hafiflemeyi ve derinliğe bağlı sıvı basıncını inceleyin.
          </p>
        </div>

        {/* State Badge */}
        <div className={`px-4 py-2.5 rounded-2xl border text-xs sm:text-sm font-black flex items-center gap-2 ${
          floatState === 'floating'
            ? 'bg-cyan-500/15 border-cyan-500/35 text-cyan-300'
            : floatState === 'suspended'
            ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
            : 'bg-rose-500/15 border-rose-500/35 text-rose-300'
        }`}>
          <Waves className="w-4 h-4" />
          <span>
            {floatState === 'floating'
              ? 'YÜZÜYOR (dc < ds)'
              : floatState === 'suspended'
              ? 'ASKIDA (dc = ds)'
              : 'BATIYOR (dc > ds)'}
          </span>
        </div>
      </div>

      {/* ── Main Canvas & Controls Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simulation Tank Graphic (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="relative h-[360px] sm:h-[420px] w-full rounded-3xl bg-[#030712] border border-slate-800/90 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
            
            {/* Top Stat Pills */}
            <div className="grid grid-cols-3 gap-2 z-10">
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">Havadaki Ağırlık (G)</div>
                <div className="text-sm sm:text-base font-extrabold text-amber-400">
                  {weightInAir.toFixed(2)} N
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">Kaldırma Kuvveti (Fk)</div>
                <div className="text-sm sm:text-base font-extrabold text-cyan-400">
                  {buoyancyForce.toFixed(2)} N
                </div>
              </div>
              <div className="p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">Batan Hacim (Vb)</div>
                <div className="text-sm sm:text-base font-extrabold text-emerald-400">
                  {submergedVolume.toFixed(0)} / {objectVolume} cm³
                </div>
              </div>
            </div>

            {/* Tank SVG */}
            <div className="relative flex-1 w-full flex items-center justify-center">
              <svg className="w-full h-full max-w-[500px]" viewBox="0 0 500 320">
                <defs>
                  {/* Liquid Gradient */}
                  <linearGradient id="liquidGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#0369a1" stopOpacity="0.8" />
                  </linearGradient>
                  <marker id="arrowUp" markerWidth="6" markerHeight="6" refX="3" refY="0" orient="auto">
                    <path d="M0,6 L3,0 L6,6 Z" fill="#06b6d4" />
                  </marker>
                  <marker id="arrowDown" markerWidth="6" markerHeight="6" refX="3" refY="6" orient="auto">
                    <path d="M0,0 L3,6 L6,0 Z" fill="#f59e0b" />
                  </marker>
                </defs>

                {/* Glass Beaker Container */}
                <rect x="80" y="40" width="340" height="260" rx="8" fill="none" stroke="#475569" strokeWidth="4" />
                {/* Measuring Rulers on Beaker */}
                {[0, 1, 2, 3, 4, 5].map((tick) => (
                  <g key={tick}>
                    <line x1="80" y1={80 + tick * 38} x2="95" y2={80 + tick * 38} stroke="#64748b" strokeWidth="2" />
                    <text x="100" y={84 + tick * 38} fill="#64748b" fontSize="10" fontWeight="bold">
                      {(25 - tick * 5)} cm
                    </text>
                  </g>
                ))}

                {/* Liquid Body (surface at y = 90) */}
                <rect x="82" y="90" width="336" height="208" rx="4" fill="url(#liquidGrad)" />
                {/* Animated Liquid Surface Wave */}
                <path
                  d="M 82 90 Q 166 87, 250 90 T 418 90"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                {/* Submerged Object */}
                {(() => {
                  const boxW = 80
                  const boxH = 80
                  const centerX = 250

                  // Calculate Y position based on float state
                  let boxY = 90 // default at liquid surface
                  if (floatState === 'floating') {
                    const submergedHeight = (submergedVolume / objectVolume) * boxH
                    boxY = 90 - (boxH - submergedHeight)
                  } else if (floatState === 'suspended') {
                    boxY = 160 // centered in middle of liquid
                  } else {
                    boxY = 298 - boxH // sitting on beaker bottom
                  }

                  const activeObj = OBJECTS.find((o) => o.id === selectedObjectId)
                  const objColor = activeObj ? activeObj.color : '#64748b'
                  const borderColor = activeObj ? activeObj.borderColor : '#94a3b8'

                  return (
                    <g>
                      {/* Box */}
                      <rect
                        x={centerX - boxW / 2}
                        y={boxY}
                        width={boxW}
                        height={boxH}
                        rx="6"
                        fill={objColor}
                        stroke={borderColor}
                        strokeWidth="3"
                      />
                      <text
                        x={centerX}
                        y={boxY + boxH / 2 + 4}
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {objectDensity} g/cm³
                      </text>

                      {/* Buoyancy force vector (upwards) */}
                      <line
                        x1={centerX - 15}
                        y1={boxY + boxH / 2}
                        x2={centerX - 15}
                        y2={boxY + boxH / 2 - Math.min(buoyancyForce * 35, 75)}
                        stroke="#06b6d4"
                        strokeWidth="3"
                        markerEnd="url(#arrowUp)"
                      />
                      <text
                        x={centerX - 48}
                        y={boxY + boxH / 2 - 25}
                        fill="#22d3ee"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        Fk
                      </text>

                      {/* Gravity force vector (downwards) */}
                      <line
                        x1={centerX + 15}
                        y1={boxY + boxH / 2}
                        x2={centerX + 15}
                        y2={boxY + boxH / 2 + Math.min(weightInAir * 35, 75)}
                        stroke="#f59e0b"
                        strokeWidth="3"
                        markerEnd="url(#arrowDown)"
                      />
                      <text
                        x={centerX + 22}
                        y={boxY + boxH / 2 + 35}
                        fill="#fbbf24"
                        fontSize="10"
                        fontWeight="bold"
                      >
                        G
                      </text>
                    </g>
                  )
                })()}

                {/* Pressure Probe sensor (movable with depth) */}
                {(() => {
                  const probeY = 90 + (depthProbe / 25) * 200
                  return (
                    <g>
                      <line x1="380" y1="40" x2="380" y2={probeY} stroke="#f43f5e" strokeWidth="2" strokeDasharray="3,3" />
                      <circle cx="380" cy={probeY} r="7" fill="#f43f5e" stroke="#fff" strokeWidth="2" />
                      <rect x="390" y={probeY - 14} width="95" height="28" rx="6" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.5" />
                      <text x="437" y={probeY + 4} fill="#fecdd3" fontSize="10" fontWeight="bold" textAnchor="middle">
                        P = {liquidPressurePascal.toFixed(0)} Pa
                      </text>
                    </g>
                  )
                })()}
              </svg>
            </div>

            {/* Depth Slider & Quick Summary */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between gap-4 z-10">
              <div className="flex-1">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">Manometre Basınç Derinliği (h):</span>
                  <span className="text-rose-400 font-bold">{depthProbe} cm</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="25"
                  value={depthProbe}
                  onChange={(e) => setDepthProbe(Number(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>
              <div className="text-right pl-3 border-l border-slate-800">
                <div className="text-[10px] text-slate-400">P = h · d · g</div>
                <div className="text-xs sm:text-sm font-black text-rose-300">
                  {liquidPressurePascal.toFixed(0)} Pa
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls & Presets (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Liquid Selector */}
          <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span>Sıvı Yoğunluğu Seçimi (ds)</span>
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {LIQUIDS.map((liq) => (
                <button
                  key={liq.id}
                  type="button"
                  onClick={() => handleLiquidPreset(liq)}
                  className={`p-2.5 rounded-2xl border text-left transition-all ${
                    selectedLiquidId === liq.id
                      ? 'bg-cyan-500/20 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold">{liq.name}</div>
                  <div className="text-[11px] text-cyan-400 font-mono">{liq.density} g/cm³</div>
                </button>
              ))}
            </div>

            {/* Custom Density Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-400">Hassas Sıvı Yoğunluğu:</span>
                <span className="text-cyan-400 font-bold">{liquidDensity.toFixed(2)} g/cm³</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.05"
                value={liquidDensity}
                onChange={(e) => {
                  setSelectedLiquidId('custom')
                  setLiquidDensity(Number(e.target.value))
                }}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>

          {/* Object Selector */}
          <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Anchor className="w-4 h-4 text-amber-400" />
              <span>Cismin Maddesi & Yoğunluğu (dc)</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {OBJECTS.map((obj) => (
                <button
                  key={obj.id}
                  type="button"
                  onClick={() => handleObjectPreset(obj)}
                  className={`p-2 rounded-xl border text-left transition-all ${
                    selectedObjectId === obj.id
                      ? 'bg-amber-500/20 border-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="text-[11px] font-bold truncate">{obj.name}</div>
                  <div className="text-[10px] text-amber-400 font-mono">{obj.density} g/cm³</div>
                </button>
              ))}
            </div>

            {/* Custom Object Density Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-slate-400">Hassas Cisim Yoğunluğu:</span>
                <span className="text-amber-400 font-bold">{objectDensity.toFixed(2)} g/cm³</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="8.0"
                step="0.1"
                value={objectDensity}
                onChange={(e) => {
                  setSelectedObjectId('custom')
                  setObjectDensity(Number(e.target.value))
                }}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          {/* LGS & TYT Kazanım Notu */}
          <div className="p-4 rounded-3xl bg-slate-900/50 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Kritik Sınav Notu (LGS & TYT)</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
              <li>
                <strong>Yüzen ve askıda kalan</strong> cisimlerde kaldırma kuvveti cismin ağırlığına daima eşittir: <code className="text-cyan-300 font-mono">Fk = G</code>.
              </li>
              <li>
                <strong>Batan cisimlerde</strong> kaldırma kuvveti ağırlıktan küçüktür (<code className="text-rose-300 font-mono">Fk &lt; G</code>) ve aradaki fark tabana tepki kuvveti (<code className="text-amber-300 font-mono">N</code>) olarak aktarılır.
              </li>
              <li>
                Batan hacim oranı doğrudan yoğunluk oranına eşittir: <code className="text-emerald-300 font-mono">Vbatan / Vtoplam = dc / ds</code>.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
