'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, RotateCcw, Zap, Sparkles, Sliders, ArrowRight } from 'lucide-react'

export function ProjectileMotion() {
  const [velocity, setVelocity] = useState<number>(30) // m/s
  const [angleDeg, setAngleDeg] = useState<number>(45) // degrees
  const [isFiring, setIsFiring] = useState<boolean>(false)
  const [flightProgress, setFlightProgress] = useState<number>(0) // 0 to 1

  const g = 10 // m/s^2 for YKS physics

  const angleRad = (angleDeg * Math.PI) / 180
  const v0x = velocity * Math.cos(angleRad)
  const v0y = velocity * Math.sin(angleRad)

  const flightTime = (2 * v0y) / g // seconds
  const hMax = (v0y * v0y) / (2 * g) // meters
  const xMax = v0x * flightTime // meters

  // Animation loop
  useEffect(() => {
    let animId: number
    if (isFiring) {
      const startTime = performance.now()
      const duration = Math.min(flightTime * 700, 3500) // scale animation duration

      const step = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        setFlightProgress(progress)

        if (progress < 1) {
          animId = requestAnimationFrame(step)
        } else {
          setIsFiring(false)
        }
      }

      animId = requestAnimationFrame(step)
    }
    return () => cancelAnimationFrame(animId)
  }, [isFiring, flightTime])

  const handleFire = () => {
    setFlightProgress(0)
    setIsFiring(true)
  }

  const handleReset = () => {
    setIsFiring(false)
    setFlightProgress(0)
  }

  // Calculate ball position along trajectory
  // Current time: t = progress * flightTime
  const currentTime = flightProgress * flightTime
  const currentX = v0x * currentTime // meters
  const currentY = v0y * currentTime - 0.5 * g * currentTime * currentTime // meters

  // Mapping to SVG coordinates (600x240)
  // Max scale based on 50m/s at 45deg: xMax ~ 250m, hMax ~ 62.5m
  const scaleX = 520 / Math.max(xMax, 100)
  const scaleY = 160 / Math.max(hMax, 40)

  const ballSvgX = 40 + currentX * scaleX
  const ballSvgY = 200 - Math.max(currentY, 0) * scaleY

  // Generate trajectory path points
  const pathPoints: { x: number; y: number }[] = []
  const steps = 40
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * flightTime
    const px = v0x * t
    const py = Math.max(0, v0y * t - 0.5 * g * t * t)
    pathPoints.push({
      x: 40 + px * scaleX,
      y: 200 - py * scaleY,
    })
  }

  const pathD = pathPoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ')

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Banner ── */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-500/30">
              AYT Mekanik
            </span>
            <span className="text-xs text-slate-400">İki Boyutta Sabit İvmeli Hareket</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            Eğik Atış & Balistik Yörünge Simülatörü
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Fırlatma açısını ve ilk hızı belirleyin. Hız bileşenlerini, menzili ve tepe noktasını anlık izleyin.
          </p>
        </div>

        {/* Live Gauges */}
        <div className="flex items-center gap-3 bg-slate-950/80 p-3 px-5 rounded-2xl border border-slate-800 self-stretch md:self-auto justify-between md:justify-start">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Menzil (X_max)</span>
            <div className="text-xl font-black text-emerald-400 font-mono">{xMax.toFixed(1)} m</div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Tepe (h_max)</span>
            <div className="text-xl font-black text-amber-400 font-mono">{hMax.toFixed(1)} m</div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Uçuş (t_uçuş)</span>
            <div className="text-xl font-black text-cyan-400 font-mono">{flightTime.toFixed(1)} s</div>
          </div>
        </div>
      </div>

      {/* ── Visual Trajectory Canvas (SVG) ── */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-4 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs">
          <span className="font-bold text-slate-300">Yörünge Grafiği (g = 10 m/s²)</span>
          <span className="font-mono text-cyan-300">
            Vx = {v0x.toFixed(1)} m/s (Sabit) • Vy = {v0y.toFixed(1)} m/s (Değişken)
          </span>
        </div>

        <div className="relative w-full h-64 bg-slate-950/90 rounded-2xl p-2 border border-slate-800 flex items-center justify-center overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 600 240">
            {/* Ground line */}
            <line x1="20" y1="200" x2="580" y2="200" stroke="#334155" strokeWidth="2" />
            
            {/* Cannon / Launch pad */}
            <circle cx="40" cy="200" r="10" fill="#475569" />
            <line
              x1="40"
              y1="200"
              x2={40 + 25 * Math.cos(angleRad)}
              y2={200 - 25 * Math.sin(angleRad)}
              stroke="#06b6d4"
              strokeWidth="5"
              strokeLinecap="round"
            />

            {/* Parabolic Trajectory Guide Line */}
            <path d={pathD} fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 3" />

            {/* Max height marker line */}
            <line
              x1={40 + (xMax / 2) * scaleX}
              y1={200 - hMax * scaleY}
              x2={40 + (xMax / 2) * scaleX}
              y2="200"
              stroke="#f59e0b"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.6"
            />
            <text
              x={40 + (xMax / 2) * scaleX - 18}
              y={200 - hMax * scaleY - 6}
              fill="#f59e0b"
              fontSize="9"
              fontFamily="monospace"
              fontWeight="bold"
            >
              h_max: {hMax.toFixed(1)}m
            </text>

            {/* Animated Ball */}
            <circle
              cx={ballSvgX}
              cy={ballSvgY}
              r="6.5"
              fill="#10b981"
              stroke="#ffffff"
              strokeWidth="2"
              className="transition-all duration-75"
            />

            {/* Velocity Vectors on the ball during flight */}
            {isFiring && currentY > 0 && (
              <g stroke="#38bdf8" strokeWidth="1.5">
                {/* Horizontal Vx (constant) */}
                <line x1={ballSvgX} y1={ballSvgY} x2={ballSvgX + 20} y2={ballSvgY} />
                {/* Vertical Vy (shrinking and reversing) */}
                <line
                  x1={ballSvgX}
                  y1={ballSvgY}
                  x2={ballSvgX}
                  y2={ballSvgY - (v0y - g * currentTime) * 1.5}
                  stroke="#f43f5e"
                />
              </g>
            )}
          </svg>
        </div>

        {/* ── Interactive Sliders ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Fırlatma Hızı Slider */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold">İlk Hız (V₀):</span>
              <span className="font-mono text-cyan-400 font-bold">{velocity} m/s</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="2"
              value={velocity}
              onChange={(e) => {
                setVelocity(parseInt(e.target.value))
                setFlightProgress(0)
              }}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Fırlatma Açısı Slider */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold">Fırlatma Açısı (θ):</span>
              <span className="font-mono text-emerald-400 font-bold">{angleDeg}°</span>
            </div>
            <input
              type="range"
              min="15"
              max="75"
              step="5"
              value={angleDeg}
              onChange={(e) => {
                setAngleDeg(parseInt(e.target.value))
                setFlightProgress(0)
              }}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Controls & Launch Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleFire}
              disabled={isFiring}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.35)] transition-all cursor-pointer disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Ateşle! (Fırlat)</span>
            </button>

            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <span className="text-xs font-mono text-slate-400">
            {angleDeg === 45 ? '⚡ 45°: Maksimum Menzil Açısı!' : `90° Tamamlayan: ${90 - angleDeg}° ile aynı menzile düşer`}
          </span>
        </div>

        {/* ÖSYM İpucu */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-slate-900 to-slate-900 border border-cyan-500/30 text-xs text-cyan-100 leading-relaxed flex items-start gap-2.5">
          <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-cyan-300 block mb-0.5 font-bold">ÖSYM Eğik Atış Tuzağı:</strong>
            Yatay hız ($V_x$) hava sürtünmesi önemsizken <strong>hareket boyunca asla değişmez</strong>! Tepe noktasında hız sıfır DEĞİLDİR; sadece düşey hız sıfırlanır, cismin hızı yatay hıza ($V_x$) eşit olur.
          </div>
        </div>
      </div>
    </div>
  )
}
