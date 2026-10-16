'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  Sparkles,
  Zap,
  Globe2,
} from 'lucide-react'

type OscillatorType = 'spring' | 'pendulum' | 'wave'

export function HarmonicWaveModule() {
  const [oscType, setOscType] = useState<OscillatorType>('spring')
  const [isPlaying, setIsPlaying] = useState<boolean>(true)

  // Spring parameters
  const [springMass, setSpringMass] = useState<number>(2) // kg (0.5 - 5)
  const [springK, setSpringK] = useState<number>(50) // N/m (10 - 150)
  const [amplitude, setAmplitude] = useState<number>(15) // cm (5 - 30)

  // Pendulum parameters
  const [pendulumLength, setPendulumLength] = useState<number>(1.2) // meters (0.5 - 3)
  const [gravity, setGravity] = useState<number>(9.8) // m/s^2 (Earth 9.8, Moon 1.6, Mars 3.7, Jupiter 24.8)

  // Wave parameters
  const [frequency, setFrequency] = useState<number>(1.5) // Hz
  const [waveSpeed, setWaveSpeed] = useState<number>(60) // cm/s

  // Live simulation time
  const [simTime, setSimTime] = useState<number>(0)
  const animRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)

  // Spring physics
  // T = 2 * pi * sqrt(m / k)
  const springOmega = Math.sqrt(springK / springMass)
  const springPeriod = (2 * Math.PI) / springOmega
  const springFreq = 1 / springPeriod

  // Pendulum physics
  // T = 2 * pi * sqrt(L / g)
  const pendulumOmega = Math.sqrt(gravity / pendulumLength)
  const pendulumPeriod = (2 * Math.PI) / pendulumOmega
  const pendulumFreq = 1 / pendulumPeriod

  // Wave physics
  // lambda = v / f
  const waveLength = waveSpeed / frequency

  useEffect(() => {
    if (isPlaying) {
      const loop = (now: number) => {
        if (lastTimeRef.current === null) {
          lastTimeRef.current = now
        }
        const dt = (now - lastTimeRef.current) / 1000
        lastTimeRef.current = now
        setSimTime((prev) => prev + dt)
        animRef.current = requestAnimationFrame(loop)
      }
      animRef.current = requestAnimationFrame(loop)
    } else {
      lastTimeRef.current = null
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
    }
  }, [isPlaying])

  const handleReset = () => {
    setSimTime(0)
    lastTimeRef.current = null
  }

  // Calculate instant positions
  // x(t) = r * cos(omega * t)
  const activeOmega = oscType === 'spring' ? springOmega : pendulumOmega
  const currentDisplacement = amplitude * Math.cos(activeOmega * simTime)
  const maxVelocity = (amplitude / 100) * activeOmega // m/s
  const currentVelocity = -(amplitude / 100) * activeOmega * Math.sin(activeOmega * simTime)

  // Energy fraction
  // Ek = 1/2 m v^2, Ep = 1/2 k x^2 -> Ek / Etotal = sin^2(omega * t), Ep / Etotal = cos^2(omega * t)
  const potentialEnergyRatio = Math.pow(Math.cos(activeOmega * simTime), 2)
  const kineticEnergyRatio = Math.pow(Math.sin(activeOmega * simTime), 2)

  return (
    <div className="space-y-6">
      {/* ── Header Card ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-bold">
              10. Sınıf Dalgalar & 12. Sınıf AYT
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              T = 2π√(m/k) & T = 2π√(L/g)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Basit Harmonik Hareket & Dalga Simülatörü
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Yay sarkacı ve ipli basit sarkacın periyot formüllerini, denge konumu etrafındaki salınımını, kinetik-potansiyel enerji dönüşümünü ve enine dalgaları canlı inceleyin.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setOscType('spring')
              handleReset()
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              oscType === 'spring'
                ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Yay Sarkacı
          </button>
          <button
            type="button"
            onClick={() => {
              setOscType('pendulum')
              handleReset()
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              oscType === 'pendulum'
                ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Basit Sarkaç
          </button>
          <button
            type="button"
            onClick={() => {
              setOscType('wave')
              handleReset()
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              oscType === 'wave'
                ? 'bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Harmonik Dalga
          </button>
        </div>
      </div>

      {/* ── Main Canvas & Controls Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Simulation Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="relative h-[360px] sm:h-[420px] w-full rounded-3xl bg-[#030712] border border-slate-800/90 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
            
            {/* Top Toolbar */}
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
                  <span>{isPlaying ? 'Durdur' : 'Salınımı Başlat'}</span>
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

              {/* Energy bar mini overlay */}
              {oscType !== 'wave' && (
                <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
                  <span className="text-amber-400 font-bold">Ep</span>
                  <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden flex">
                    <div
                      className="bg-amber-400 h-full transition-all duration-75"
                      style={{ width: `${potentialEnergyRatio * 100}%` }}
                    />
                    <div
                      className="bg-cyan-400 h-full transition-all duration-75"
                      style={{ width: `${kineticEnergyRatio * 100}%` }}
                    />
                  </div>
                  <span className="text-cyan-400 font-bold">Ek</span>
                </div>
              )}
            </div>

            {/* Canvas Graphic */}
            <div className="relative flex-1 w-full flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 600 300">
                {oscType === 'spring' && (
                  /* Spring Oscillator */
                  <g>
                    {/* Fixed ceiling */}
                    <line x1="200" y1="20" x2="400" y2="20" stroke="#475569" strokeWidth="4" />
                    {Array.from({ length: 11 }).map((_, i) => (
                      <line
                        key={i}
                        x1={210 + i * 18}
                        y1="20"
                        x2={200 + i * 18}
                        y2="8"
                        stroke="#334155"
                        strokeWidth="2"
                      />
                    ))}

                    {/* Dotted Equilibrium Line */}
                    <line
                      x1="120"
                      y1="160"
                      x2="480"
                      y2="160"
                      stroke="#3b82f6"
                      strokeWidth="1.5"
                      strokeDasharray="4,4"
                    />
                    <text x="490" y="164" fill="#60a5fa" fontSize="10" fontWeight="bold">
                      Denge (x=0)
                    </text>

                    {/* Spring coils from y=20 to y=blockTop */}
                    {(() => {
                      const equilibriumY = 160
                      const blockH = 50 + springMass * 4
                      const blockW = 60 + springMass * 3
                      const blockY = equilibriumY + (currentDisplacement / 30) * 80 - blockH / 2
                      const springTop = 20
                      const springBottom = blockY
                      const numCoils = 14
                      const coilH = (springBottom - springTop) / numCoils

                      // Generate zigzag spring path
                      let pathD = `M 300 ${springTop}`
                      for (let i = 0; i < numCoils; i++) {
                        const y1 = springTop + i * coilH + coilH * 0.25
                        const y2 = springTop + i * coilH + coilH * 0.75
                        const y3 = springTop + (i + 1) * coilH
                        pathD += ` L 320 ${y1} L 280 ${y2} L 300 ${y3}`
                      }

                      return (
                        <g>
                          <path d={pathD} fill="none" stroke="#94a3b8" strokeWidth="2.5" />

                          {/* Suspended Mass */}
                          <rect
                            x={300 - blockW / 2}
                            y={blockY}
                            width={blockW}
                            height={blockH}
                            rx="8"
                            fill="#1e1b4b"
                            stroke="#8b5cf6"
                            strokeWidth="3"
                          />
                          <text
                            x="300"
                            y={blockY + blockH / 2 + 5}
                            fill="#ddd6fe"
                            fontSize="12"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            m = {springMass} kg
                          </text>

                          {/* Displacement arrow */}
                          <line
                            x1="220"
                            y1="160"
                            x2="220"
                            y2={blockY + blockH / 2}
                            stroke="#f59e0b"
                            strokeWidth="2"
                          />
                          <circle cx="220" cy="160" r="3" fill="#f59e0b" />
                          <circle cx="220" cy={blockY + blockH / 2} r="3" fill="#f59e0b" />
                          <text x="180" y="160" fill="#fbbf24" fontSize="10" fontWeight="bold">
                            x = {currentDisplacement.toFixed(1)} cm
                          </text>
                        </g>
                      )
                    })()}
                  </g>
                )}

                {oscType === 'pendulum' && (
                  /* Simple Pendulum */
                  <g>
                    {/* Fixed Pivot */}
                    <line x1="250" y1="30" x2="350" y2="30" stroke="#475569" strokeWidth="4" />
                    <circle cx="300" cy="30" r="5" fill="#f87171" stroke="#fff" strokeWidth="2" />

                    {/* Dotted Center Vertical */}
                    <line x1="300" y1="30" x2="300" y2="270" stroke="#334155" strokeWidth="1.5" strokeDasharray="3,3" />

                    {(() => {
                      const maxAngleDeg = 15 // small angle approx
                      const thetaDeg = maxAngleDeg * Math.cos(pendulumOmega * simTime)
                      const thetaRad = (thetaDeg * Math.PI) / 180
                      const ropePixelLength = 60 + pendulumLength * 55

                      const bobX = 300 + ropePixelLength * Math.sin(thetaRad)
                      const bobY = 30 + ropePixelLength * Math.cos(thetaRad)

                      return (
                        <g>
                          {/* Rope */}
                          <line x1="300" y1="30" x2={bobX} y2={bobY} stroke="#94a3b8" strokeWidth="2" />
                          {/* Pendulum Bob */}
                          <circle
                            cx={bobX}
                            cy={bobY}
                            r="18"
                            fill="#4338ca"
                            stroke="#818cf8"
                            strokeWidth="3"
                          />
                          <text
                            x={bobX}
                            y={bobY + 4}
                            fill="#ffffff"
                            fontSize="9"
                            fontWeight="bold"
                            textAnchor="middle"
                          >
                            L={pendulumLength}m
                          </text>

                          {/* Velocity Vector arrow */}
                          <line
                            x1={bobX}
                            y1={bobY}
                            x2={bobX + currentVelocity * 50 * Math.cos(thetaRad)}
                            y2={bobY - currentVelocity * 50 * Math.sin(thetaRad)}
                            stroke="#06b6d4"
                            strokeWidth="2.5"
                          />
                        </g>
                      )
                    })()}
                  </g>
                )}

                {oscType === 'wave' && (
                  /* Harmonic Transverse Wave */
                  <g>
                    {/* Center axis */}
                    <line x1="40" y1="150" x2="560" y2="150" stroke="#334155" strokeWidth="1.5" strokeDasharray="4,4" />

                    {/* Continuous Sine Wave Path */}
                    {(() => {
                      const k = (2 * Math.PI) / waveLength
                      const omega = 2 * Math.PI * frequency
                      let pathD = 'M 40 150'

                      for (let x = 40; x <= 560; x += 4) {
                        const waveX = x - 40
                        const y = 150 - amplitude * 2 * Math.sin(k * waveX - omega * simTime)
                        pathD += ` L ${x} ${y}`
                      }

                      return (
                        <g>
                          <path d={pathD} fill="none" stroke="#8b5cf6" strokeWidth="3.5" />
                          {/* Wavelength Indicator */}
                          <line x1="120" y1="60" x2={120 + waveLength} y2="60" stroke="#f59e0b" strokeWidth="2" />
                          <circle cx="120" cy="60" r="3" fill="#f59e0b" />
                          <circle cx={120 + waveLength} cy="60" r="3" fill="#f59e0b" />
                          <text x={120 + waveLength / 2} y="52" fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="middle">
                            λ = {waveLength.toFixed(1)} cm
                          </text>
                        </g>
                      )
                    })()}
                  </g>
                )}
              </svg>
            </div>

            {/* Live Metrics Grid */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 bg-slate-950/60 p-2.5 rounded-2xl z-10">
              <div className="text-center">
                <div className="text-[10px] text-slate-400 font-semibold">Periyot (T)</div>
                <div className="text-sm sm:text-base font-extrabold text-violet-400">
                  {oscType === 'spring' ? springPeriod.toFixed(2) : pendulumPeriod.toFixed(2)} s
                </div>
              </div>
              <div className="text-center border-l border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold">Frekans (f)</div>
                <div className="text-sm sm:text-base font-extrabold text-cyan-400">
                  {oscType === 'spring' ? springFreq.toFixed(2) : pendulumFreq.toFixed(2)} Hz
                </div>
              </div>
              <div className="text-center border-l border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold">Maks Hız (Vmax)</div>
                <div className="text-sm sm:text-base font-extrabold text-emerald-400">
                  {maxVelocity.toFixed(2)} m/s
                </div>
              </div>
              <div className="text-center border-l border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold">Açısal Hız (ω)</div>
                <div className="text-sm sm:text-base font-extrabold text-amber-400">
                  {activeOmega.toFixed(2)} rad/s
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
              <span>Salınım & Dalga Değişkenleri</span>
            </h3>

            {oscType === 'spring' && (
              <>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-400">Kütle (m):</span>
                    <span className="text-violet-400 font-bold">{springMass} kg</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5"
                    step="0.5"
                    value={springMass}
                    onChange={(e) => setSpringMass(Number(e.target.value))}
                    className="w-full accent-violet-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-400">Yay Sabiti (k):</span>
                    <span className="text-cyan-400 font-bold">{springK} N/m</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="120"
                    step="5"
                    value={springK}
                    onChange={(e) => setSpringK(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </>
            )}

            {oscType === 'pendulum' && (
              <>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-400">İp Uzunluğu (L):</span>
                    <span className="text-violet-400 font-bold">{pendulumLength} m</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={pendulumLength}
                    onChange={(e) => setPendulumLength(Number(e.target.value))}
                    className="w-full accent-violet-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-slate-400">Gezegen / Yerçekimi (g):</span>
                    <span className="text-amber-400 font-bold">{gravity} m/s²</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { name: 'Dünya', g: 9.8 },
                      { name: 'Ay', g: 1.6 },
                      { name: 'Jüpiter', g: 24.8 },
                    ].map((p) => (
                      <button
                        key={p.name}
                        type="button"
                        onClick={() => setGravity(p.g)}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                          gravity === p.g
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {p.name} ({p.g})
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {oscType === 'wave' && (
              <>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-400">Frekans (f):</span>
                    <span className="text-cyan-400 font-bold">{frequency} Hz</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={frequency}
                    onChange={(e) => setFrequency(Number(e.target.value))}
                    className="w-full accent-cyan-500"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-400">Dalga Hızı (v):</span>
                    <span className="text-emerald-400 font-bold">{waveSpeed} cm/s</span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="120"
                    step="5"
                    value={waveSpeed}
                    onChange={(e) => setWaveSpeed(Number(e.target.value))}
                    className="w-full accent-emerald-500"
                  />
                </div>
              </>
            )}

            {/* Genlik Slider (ortak) */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-400">Genlik (r / A):</span>
                <span className="text-amber-400 font-bold">{amplitude} cm</span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="1"
                value={amplitude}
                onChange={(e) => setAmplitude(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>
          </div>

          {/* Sınav Taktik Kartı */}
          <div className="p-4 rounded-3xl bg-slate-900/50 border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span>AYT & 12. Sınıf Kritik Soru İpuçları</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
              <li>
                <strong>Yay Sarkacında</strong> yerçekimi (<code className="text-violet-300 font-mono">g</code>) veya eğim periyodu etkilemez; periyot sadece <code className="text-violet-300 font-mono">m</code> ve <code className="text-violet-300 font-mono">k</code>’ya bağlıdır (Tolga formülü: <code className="text-violet-300 font-mono">T = 2π√(m/k)</code>).
              </li>
              <li>
                <strong>Basit Sarkaçta</strong> kütle (<code className="text-cyan-300 font-mono">m</code>) periyodu etkilemez! Periyot yalnızca ip boyu <code className="text-cyan-300 font-mono">L</code> ve yerçekimi <code className="text-cyan-300 font-mono">g</code>’ye bağlıdır.
              </li>
              <li>
                Denge noktasından geçerken kinetik enerji ve hız <strong>maksimum</strong>, ivme ve kuvvet <strong>sıfırdır</strong>.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
