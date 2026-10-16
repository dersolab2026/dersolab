'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Scale,
  Gauge,
  Flame,
} from 'lucide-react'

type SurfaceMode = 'horizontal' | 'inclined'

export function NewtonDynamicsModule() {
  const [surfaceMode, setSurfaceMode] = useState<SurfaceMode>('horizontal')
  const [mass, setMass] = useState<number>(4) // kg
  const [appliedForce, setAppliedForce] = useState<number>(30) // N
  const [frictionCoeff, setFrictionCoeff] = useState<number>(0.25) // k (0 - 0.8)
  const [inclineAngleDeg, setInclineAngleDeg] = useState<number>(25) // degrees
  const [showVectors, setShowVectors] = useState<boolean>(true)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  
  // Realtime simulation state
  const [time, setTime] = useState<number>(0)
  const [position, setPosition] = useState<number>(0) // meters
  const [velocity, setVelocity] = useState<number>(0) // m/s
  const animRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)

  const g = 10 // m/s^2 MEB standardı

  // Physics calculations
  const weight = mass * g // N
  const angleRad = (inclineAngleDeg * Math.PI) / 180

  let normalForce = 0
  let parallelForce = 0
  let maxStaticFriction = 0
  let netForce = 0
  let acceleration = 0
  let motionState: 'stationary' | 'accelerating' | 'constant_speed' = 'stationary'

  if (surfaceMode === 'horizontal') {
    normalForce = weight
    parallelForce = appliedForce
    maxStaticFriction = frictionCoeff * normalForce
    if (appliedForce > maxStaticFriction) {
      netForce = appliedForce - maxStaticFriction
      acceleration = netForce / mass
      motionState = 'accelerating'
    } else if (appliedForce === maxStaticFriction && velocity > 0) {
      netForce = 0
      acceleration = 0
      motionState = 'constant_speed'
    } else {
      netForce = 0
      acceleration = 0
      motionState = 'stationary'
    }
  } else {
    // Inclined Plane
    normalForce = weight * Math.cos(angleRad)
    const gravityParallel = weight * Math.sin(angleRad)
    parallelForce = appliedForce + gravityParallel // assuming force applied down or up
    maxStaticFriction = frictionCoeff * normalForce
    
    // Total driving down: gravityParallel - appliedForce (if pulling upward)
    // Let's standardise: applied force is directed UP the ramp
    const drivingForce = appliedForce - gravityParallel
    if (Math.abs(drivingForce) > maxStaticFriction) {
      const frictionDir = drivingForce > 0 ? -1 : 1
      netForce = drivingForce + (frictionDir * maxStaticFriction)
      acceleration = netForce / mass
      motionState = 'accelerating'
    } else {
      netForce = 0
      acceleration = 0
      motionState = 'stationary'
    }
  }

  // Animation frame loop
  useEffect(() => {
    if (isPlaying && acceleration !== 0) {
      const tick = (now: number) => {
        if (lastTimeRef.current === null) {
          lastTimeRef.current = now
        }
        const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05) // max 50ms step
        lastTimeRef.current = now

        setTime((prevT) => prevT + dt)
        setVelocity((prevV) => Math.max(0, prevV + acceleration * dt))
        setPosition((prevX) => Math.max(0, Math.min(25, prevX + velocity * dt + 0.5 * acceleration * dt * dt)))

        animRef.current = requestAnimationFrame(tick)
      }
      animRef.current = requestAnimationFrame(tick)
    } else {
      lastTimeRef.current = null
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [isPlaying, acceleration, velocity])

  const handleReset = () => {
    setIsPlaying(false)
    setTime(0)
    setPosition(0)
    setVelocity(0)
    lastTimeRef.current = null
  }

  return (
    <div className="space-y-6">
      {/* ── Header Card ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
              9. Sınıf Dinamik & 11. Sınıf AYT
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              F = m · a
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Newton’ın Hareket Yasaları & Sürtünmeli Düzlem
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Cismin kütlesini, uygulanan kuvveti ve yüzey sürtünme katsayısını değiştirerek serbest cisim diyagramını, net kuvvet vektörlerini ve ivmeli hareketi canlı gözlemleyin.
          </p>
        </div>

        {/* Surface Mode Toggle */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setSurfaceMode('horizontal')
              handleReset()
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              surfaceMode === 'horizontal'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Yatay Zemin
          </button>
          <button
            type="button"
            onClick={() => {
              setSurfaceMode('inclined')
              handleReset()
            }}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              surfaceMode === 'inclined'
                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Eğimli Düzlem
          </button>
        </div>
      </div>

      {/* ── Main Canvas & Controls Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Simulation Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="relative h-[340px] sm:h-[400px] w-full rounded-3xl bg-[#030712] border border-slate-800/90 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
            {/* Top Toolbar overlay */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isPlaying
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  }`}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                  <span>{isPlaying ? 'Durdur' : 'Hareketi Başlat'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Sıfırla"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={showVectors}
                  onChange={(e) => setShowVectors(e.target.checked)}
                  className="rounded border-slate-700 text-blue-500 focus:ring-0"
                />
                <span>Kuvvet Vektörleri</span>
              </label>
            </div>

            {/* Canvas Graphic */}
            <div className="relative flex-1 w-full flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 600 300">
                <defs>
                  <marker
                    id="arrowhead-blue"
                    markerWidth="8"
                    markerHeight="6"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3, 0 6" fill="#3b82f6" />
                  </marker>
                  <marker
                    id="arrowhead-red"
                    markerWidth="8"
                    markerHeight="6"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3, 0 6" fill="#ef4444" />
                  </marker>
                  <marker
                    id="arrowhead-green"
                    markerWidth="8"
                    markerHeight="6"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3, 0 6" fill="#10b981" />
                  </marker>
                  <marker
                    id="arrowhead-amber"
                    markerWidth="8"
                    markerHeight="6"
                    refX="7"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 8 3, 0 6" fill="#f59e0b" />
                  </marker>
                  <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
                  </pattern>
                </defs>

                <rect width="600" height="300" fill="url(#grid)" />

                {surfaceMode === 'horizontal' ? (
                  /* Horizontal Surface Simulation */
                  <g>
                    {/* Ground line */}
                    <line x1="20" y1="220" x2="580" y2="220" stroke="#334155" strokeWidth="4" />
                    {/* Hatch lines for ground friction */}
                    {Array.from({ length: 28 }).map((_, i) => (
                      <line
                        key={i}
                        x1={30 + i * 20}
                        y1={222}
                        x2={20 + i * 20}
                        y2={236}
                        stroke="#1e293b"
                        strokeWidth="2"
                      />
                    ))}

                    {/* Block: moves with position */}
                    {(() => {
                      const blockW = 80 + mass * 4
                      const blockH = 55 + mass * 3
                      const startX = 60
                      const blockX = startX + (position / 25) * 380
                      const blockY = 220 - blockH
                      const centerX = blockX + blockW / 2
                      const centerY = blockY + blockH / 2

                      return (
                        <g>
                          {/* Box body */}
                          <rect
                            x={blockX}
                            y={blockY}
                            width={blockW}
                            height={blockH}
                            rx="6"
                            fill="#1e293b"
                            stroke="#3b82f6"
                            strokeWidth="2.5"
                          />
                          {/* Mass label inside box */}
                          <text
                            x={centerX}
                            y={centerY + 5}
                            fill="#93c5fd"
                            fontSize="13"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            m = {mass} kg
                          </text>

                          {/* Free Body Vectors */}
                          {showVectors && (
                            <g>
                              {/* Weight (G = mg) down */}
                              <line
                                x1={centerX}
                                y1={centerY}
                                x2={centerX}
                                y2={centerY + 55}
                                stroke="#f59e0b"
                                strokeWidth="2.5"
                                markerEnd="url(#arrowhead-amber)"
                              />
                              <text
                                x={centerX + 8}
                                y={centerY + 50}
                                fill="#f59e0b"
                                fontSize="11"
                                fontWeight="bold"
                              >
                                G = {weight} N
                              </text>

                              {/* Normal Force (N) up */}
                              <line
                                x1={centerX}
                                y1={centerY}
                                x2={centerX}
                                y2={centerY - 55}
                                stroke="#10b981"
                                strokeWidth="2.5"
                                markerEnd="url(#arrowhead-green)"
                              />
                              <text
                                x={centerX + 8}
                                y={centerY - 45}
                                fill="#10b981"
                                fontSize="11"
                                fontWeight="bold"
                              >
                                N = {normalForce.toFixed(0)} N
                              </text>

                              {/* Applied Force (F) right */}
                              {appliedForce > 0 && (
                                <>
                                  <line
                                    x1={centerX + blockW / 2}
                                    y1={centerY}
                                    x2={centerX + blockW / 2 + Math.min(appliedForce * 2.2, 100)}
                                    y2={centerY}
                                    stroke="#3b82f6"
                                    strokeWidth="3"
                                    markerEnd="url(#arrowhead-blue)"
                                  />
                                  <text
                                    x={centerX + blockW / 2 + 15}
                                    y={centerY - 8}
                                    fill="#60a5fa"
                                    fontSize="11"
                                    fontWeight="bold"
                                  >
                                    F = {appliedForce} N
                                  </text>
                                </>
                              )}

                              {/* Friction Force (fs) left */}
                              {maxStaticFriction > 0 && (
                                <>
                                  <line
                                    x1={centerX - blockW / 2}
                                    y1={centerY + blockH / 4}
                                    x2={centerX - blockW / 2 - Math.min(maxStaticFriction * 2.2, 80)}
                                    y2={centerY + blockH / 4}
                                    stroke="#ef4444"
                                    strokeWidth="2.5"
                                    markerEnd="url(#arrowhead-red)"
                                  />
                                  <text
                                    x={centerX - blockW / 2 - 60}
                                    y={centerY + blockH / 4 - 6}
                                    fill="#f87171"
                                    fontSize="10"
                                    fontWeight="bold"
                                  >
                                    fs = {maxStaticFriction.toFixed(1)} N
                                  </text>
                                </>
                              )}
                            </g>
                          )}
                        </g>
                      )
                    })()}
                  </g>
                ) : (
                  /* Inclined Plane Simulation */
                  <g>
                    {/* Ramp Polygon */}
                    {(() => {
                      const rampBaseX = 80
                      const rampBaseY = 240
                      const rampLength = 420
                      const rampEndX = rampBaseX + rampLength * Math.cos(angleRad)
                      const rampEndY = rampBaseY - rampLength * Math.sin(angleRad)

                      return (
                        <g>
                          {/* Triangle ramp fill */}
                          <polygon
                            points={`${rampBaseX},${rampBaseY} ${rampEndX},${rampEndY} ${rampEndX},${rampBaseY}`}
                            fill="#0f172a"
                            stroke="#334155"
                            strokeWidth="2"
                          />
                          {/* Angle arc */}
                          <path
                            d={`M ${rampBaseX + 45} ${rampBaseY} A 45 45 0 0 0 ${rampBaseX + 45 * Math.cos(angleRad)} ${rampBaseY - 45 * Math.sin(angleRad)}`}
                            fill="none"
                            stroke="#38bdf8"
                            strokeWidth="2"
                          />
                          <text
                            x={rampBaseX + 55}
                            y={rampBaseY - 12}
                            fill="#38bdf8"
                            fontSize="11"
                            fontWeight="bold"
                          >
                            α = {inclineAngleDeg}°
                          </text>

                          {/* Block on Ramp */}
                          {(() => {
                            const slideDist = (position / 25) * (rampLength - 100)
                            const distFromBottom = 160 + slideDist
                            const bx = rampBaseX + distFromBottom * Math.cos(angleRad)
                            const by = rampBaseY - distFromBottom * Math.sin(angleRad)

                            return (
                              <g transform={`translate(${bx}, ${by}) rotate(${-inclineAngleDeg})`}>
                                <rect
                                  x="-35"
                                  y="-40"
                                  width="70"
                                  height="40"
                                  rx="4"
                                  fill="#1e293b"
                                  stroke="#3b82f6"
                                  strokeWidth="2.5"
                                />
                                <text
                                  x="0"
                                  y="-15"
                                  fill="#93c5fd"
                                  fontSize="11"
                                  fontWeight="bold"
                                  textAnchor="middle"
                                >
                                  {mass} kg
                                </text>

                                {showVectors && (
                                  <g>
                                    {/* Normal Force N up */}
                                    <line
                                      x1="0"
                                      y1="-20"
                                      x2="0"
                                      y2="-75"
                                      stroke="#10b981"
                                      strokeWidth="2"
                                      markerEnd="url(#arrowhead-green)"
                                    />
                                    <text x="5" y="-60" fill="#10b981" fontSize="10" fontWeight="bold">
                                      N = {normalForce.toFixed(0)} N
                                    </text>

                                    {/* Applied Force up the ramp */}
                                    {appliedForce > 0 && (
                                      <line
                                        x1="35"
                                        y1="-20"
                                        x2={35 + Math.min(appliedForce * 1.5, 70)}
                                        y2="-20"
                                        stroke="#3b82f6"
                                        strokeWidth="2.5"
                                        markerEnd="url(#arrowhead-blue)"
                                      />
                                    )}
                                  </g>
                                )}
                              </g>
                            )
                          })()}
                        </g>
                      )
                    })()}
                  </g>
                )}
              </svg>
            </div>

            {/* Bottom Live Metrics */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 bg-slate-950/60 p-2.5 rounded-2xl z-10">
              <div className="text-center">
                <div className="text-[10px] text-slate-400 font-semibold">Net Kuvvet (Fnet)</div>
                <div className={`text-sm sm:text-base font-extrabold ${netForce > 0 ? 'text-blue-400' : 'text-slate-400'}`}>
                  {netForce.toFixed(1)} N
                </div>
              </div>
              <div className="text-center border-l border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold">İvme (a)</div>
                <div className={`text-sm sm:text-base font-extrabold ${acceleration > 0 ? 'text-cyan-400' : 'text-slate-400'}`}>
                  {acceleration.toFixed(2)} m/s²
                </div>
              </div>
              <div className="text-center border-l border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold">Anlık Hız (v)</div>
                <div className="text-sm sm:text-base font-extrabold text-emerald-400">
                  {velocity.toFixed(2)} m/s
                </div>
              </div>
              <div className="text-center border-l border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold">Yol (x)</div>
                <div className="text-sm sm:text-base font-extrabold text-amber-400">
                  {position.toFixed(2)} m
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              <span>Dinamik Parametreleri</span>
            </h3>

            {/* Mass Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-400">Cismin Kütlesi (m):</span>
                <span className="text-blue-400 font-bold">{mass} kg</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={mass}
                onChange={(e) => {
                  setMass(Number(e.target.value))
                  handleReset()
                }}
                className="w-full accent-blue-500"
              />
            </div>

            {/* Applied Force Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-400">Uygulanan Kuvvet (F):</span>
                <span className="text-blue-400 font-bold">{appliedForce} N</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                step="2"
                value={appliedForce}
                onChange={(e) => {
                  setAppliedForce(Number(e.target.value))
                  handleReset()
                }}
                className="w-full accent-blue-500"
              />
            </div>

            {/* Friction Coefficient Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-400">Sürtünme Katsayısı (k):</span>
                <span className="text-amber-400 font-bold">{frictionCoeff.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={frictionCoeff}
                onChange={(e) => {
                  setFrictionCoeff(Number(e.target.value))
                  handleReset()
                }}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Inclined Angle Slider (only in inclined mode) */}
            {surfaceMode === 'inclined' && (
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-400">Eğim Açısı (α):</span>
                  <span className="text-cyan-400 font-bold">{inclineAngleDeg}°</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="1"
                  value={inclineAngleDeg}
                  onChange={(e) => {
                    setInclineAngleDeg(Number(e.target.value))
                    handleReset()
                  }}
                  className="w-full accent-cyan-500"
                />
              </div>
            )}

            {/* Statik vs Kinetik Sürtünme Durumu */}
            <div className={`p-3.5 rounded-2xl border text-xs leading-relaxed ${
              motionState === 'accelerating'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
            }`}>
              <div className="font-bold mb-1 flex items-center gap-1.5">
                <Gauge className="w-3.5 h-3.5" />
                {motionState === 'accelerating'
                  ? 'Kuvvet Sürtünmeyi Yendi: İvmeli Hareket!'
                  : 'Statik Sürtünme Sınırı Aşılamadı: Cisim Durgun'}
              </div>
              <p className="text-[11px] text-slate-300">
                {motionState === 'accelerating'
                  ? `Uygulanan kuvvet (${appliedForce} N), maksimum sürtünme eşiğinden (${maxStaticFriction.toFixed(1)} N) büyük olduğu için cisim a = ${acceleration.toFixed(2)} m/s² ivmeyle hızlanıyor.`
                  : `Cismin harekete geçmesi için F > k · N (${maxStaticFriction.toFixed(1)} N) olmalıdır. Kuvveti artırın veya sürtünmeyi azaltın.`}
              </p>
            </div>
          </div>

          {/* MEB / YKS Formula Quick Card */}
          <div className="p-4 rounded-3xl bg-slate-900/50 border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>YKS & Lise Temel Formül Kartı</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-slate-400">2. Yasa:</div>
                <div className="font-mono text-blue-400 font-bold">Fnet = m · a</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-slate-400">Sürtünme:</div>
                <div className="font-mono text-amber-400 font-bold">fs = k · N</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-slate-400">Eğim Yolu:</div>
                <div className="font-mono text-cyan-400 font-bold">Gx = m·g·sin(α)</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-slate-400">Ramp Tepkisi:</div>
                <div className="font-mono text-emerald-400 font-bold">N = m·g·cos(α)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
