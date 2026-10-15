'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  RotateCcw,
  Sparkles,
  Compass,
  Sliders,
  Info,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react'

const SPECIAL_ANGLES = [
  { deg: 0, rad: '0' },
  { deg: 30, rad: 'π/6' },
  { deg: 45, rad: 'π/4' },
  { deg: 60, rad: 'π/3' },
  { deg: 90, rad: 'π/2' },
  { deg: 120, rad: '2π/3' },
  { deg: 135, rad: '3π/4' },
  { deg: 180, rad: 'π' },
  { deg: 270, rad: '3π/2' },
  { deg: 360, rad: '2π' },
]

export function TrigCircle() {
  const [angleDeg, setAngleDeg] = useState<number>(45)
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const circleCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const waveCanvasRef = useRef<HTMLCanvasElement | null>(null)

  // Math conversions
  const rad = (angleDeg * Math.PI) / 180
  const sinVal = Math.sin(rad)
  const cosVal = Math.cos(rad)
  const tanVal = Math.abs(cosVal) < 0.0001 ? (sinVal > 0 ? Infinity : -Infinity) : Math.tan(rad)
  const cotVal = Math.abs(sinVal) < 0.0001 ? (cosVal > 0 ? Infinity : -Infinity) : 1 / Math.tan(rad)

  // Determine Quadrant (1, 2, 3, 4)
  let quadrant = 1
  if (angleDeg > 90 && angleDeg <= 180) quadrant = 2
  else if (angleDeg > 180 && angleDeg <= 270) quadrant = 3
  else if (angleDeg > 270 && angleDeg < 360) quadrant = 4

  // Render Circle Canvas
  useEffect(() => {
    const canvas = circleCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const radius = 130 // Circle radius in pixels

    // Coordinate grid lines
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 1
    for (let x = 0; x < canvas.width; x += 30) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y < canvas.height; y += 30) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Axes
    ctx.strokeStyle = '#475569'
    ctx.lineWidth = 2
    // X axis (cos)
    ctx.beginPath()
    ctx.moveTo(15, cy)
    ctx.lineTo(canvas.width - 15, cy)
    ctx.stroke()
    // Y axis (sin)
    ctx.beginPath()
    ctx.moveTo(cx, 15)
    ctx.lineTo(cx, canvas.height - 15)
    ctx.stroke()

    // Unit Circle outline
    ctx.strokeStyle = '#38bdf8'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(cx, cy, radius, 0, Math.PI * 2)
    ctx.stroke()

    // Tangent Axis (x = 1 line, at cx + radius)
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)'
    ctx.lineWidth = 1.5
    ctx.setLineDash([4, 4])
    ctx.beginPath()
    ctx.moveTo(cx + radius, 10)
    ctx.lineTo(cx + radius, canvas.height - 10)
    ctx.stroke()
    ctx.setLineDash([])

    // Point coordinates on canvas
    const px = cx + radius * cosVal
    const py = cy - radius * sinVal // In canvas, y goes down

    // Projection Lines
    // Cosine projection on X axis (Cyan)
    ctx.strokeStyle = '#06b6d4'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(px, cy)
    ctx.stroke()

    // Sine projection on Y axis (Emerald)
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx, py)
    ctx.stroke()

    // Dropped dashed lines to axes
    ctx.strokeStyle = '#64748b'
    ctx.lineWidth = 1.5
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(px, py)
    ctx.lineTo(px, cy) // down to cos
    ctx.moveTo(px, py)
    ctx.lineTo(cx, py) // left to sin
    ctx.stroke()
    ctx.setLineDash([])

    // Angle Radius Ray (Hypotenuse = 1)
    ctx.strokeStyle = '#f8fafc'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(px, py)
    ctx.stroke()

    // Angle Arc
    ctx.strokeStyle = '#a855f7'
    ctx.fillStyle = 'rgba(168, 85, 247, 0.2)'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, 32, 0, -rad, true)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()

    // Active Point P on circle
    ctx.fillStyle = '#f43f5e'
    ctx.beginPath()
    ctx.arc(px, py, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()

    // Point Coordinates Label
    ctx.fillStyle = '#f8fafc'
    ctx.font = 'bold 11px sans-serif'
    ctx.textAlign = px > cx ? 'left' : 'right'
    ctx.fillText(`P(${cosVal.toFixed(2)}, ${sinVal.toFixed(2)})`, px + (px > cx ? 10 : -10), py - 8)

    // Axes Labels
    ctx.fillStyle = '#94a3b8'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'right'
    ctx.fillText('cos x', canvas.width - 20, cy - 8)
    ctx.textAlign = 'center'
    ctx.fillText('sin y', cx + 18, 26)
    ctx.fillText('x=1 (tan)', cx + radius, 26)
  }, [angleDeg, cosVal, sinVal, rad])

  // Render Sine Wave Canvas
  useEffect(() => {
    const canvas = waveCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const w = canvas.width
    const h = canvas.height
    const midY = h / 2
    const amplitude = 50

    // Center baseline
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(0, midY)
    ctx.lineTo(w, midY)
    ctx.stroke()

    // Sine wave curve
    ctx.strokeStyle = '#10b981'
    ctx.lineWidth = 2.5
    ctx.beginPath()
    for (let x = 0; x < w; x++) {
      const theta = (x / w) * (Math.PI * 2)
      const y = midY - Math.sin(theta) * amplitude
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()

    // Active angle marker on sine wave
    const currentX = (angleDeg / 360) * w
    const currentY = midY - sinVal * amplitude

    // Vertical indicator line
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)'
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(currentX, 0)
    ctx.lineTo(currentX, h)
    ctx.stroke()
    ctx.setLineDash([])

    // Glowing point on wave
    ctx.fillStyle = '#10b981'
    ctx.beginPath()
    ctx.arc(currentX, currentY, 6, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.stroke()

    // Wave label
    ctx.fillStyle = '#94a3b8'
    ctx.font = '10px sans-serif'
    ctx.fillText('0°', 4, midY + 14)
    ctx.fillText('180° (π)', w / 2 - 16, midY + 14)
    ctx.fillText('360° (2π)', w - 46, midY + 14)
  }, [angleDeg, sinVal])

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-violet-950/40 via-indigo-950/20 to-slate-900/60 border border-violet-500/20 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
              AYT & 11. Sınıf Matematik
            </span>
            <span className="text-xs text-slate-400">Trigonometri & Fonksiyonlar</span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-violet-400" />
            İnteraktif Trigonometrik Birim Çember
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Açıyı döndürerek <span className="text-cyan-400 font-mono">cos</span>,{' '}
            <span className="text-emerald-400 font-mono">sin</span>,{' '}
            <span className="text-amber-400 font-mono">tan</span> ve{' '}
            <span className="text-purple-400 font-mono">cot</span> değerlerinin birim çemberdeki izdüşümlerini
            ve sinüs dalgasıyla olan canlı bağlantısını keşfet!
          </p>
        </div>

        {/* Quadrant Indicator Badge */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 self-start md:self-auto text-xs">
          <span className="text-slate-400">Bölge:</span>
          <span className="px-2 py-0.5 rounded font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
            {quadrant}. Bölge
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-slate-400">Radyan:</span>
          <span className="font-mono text-cyan-400 font-bold">
            {((angleDeg / 180) * Math.PI).toFixed(2)} rad
          </span>
        </div>
      </div>

      {/* ── Main Canvas & Controls Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Unit Circle Canvas */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl bg-slate-900/70 border border-slate-800 p-5 shadow-xl relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-violet-400" />
              Birim Çember (R = 1)
            </span>
            <span className="text-xs text-slate-400 font-mono">
              θ = <strong className="text-white text-sm">{angleDeg}°</strong>
            </span>
          </div>

          <div className="relative w-full h-[360px] bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
            <canvas
              ref={circleCanvasRef}
              width={480}
              height={360}
              className="w-full h-full object-contain"
            />

            {/* Quick Angle Reset */}
            <button
              onClick={() => setAngleDeg(45)}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-700 text-xs transition-colors"
              title="45 Dereceye Sıfırla"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Special Angles Quick Selector */}
          <div className="mt-4 flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">Özel Açılar:</span>
            {SPECIAL_ANGLES.map((item) => (
              <button
                key={item.deg}
                onClick={() => setAngleDeg(item.deg)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  angleDeg === item.deg
                    ? 'bg-violet-600 text-white font-bold shadow-md shadow-violet-500/30'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {item.deg}° <span className="text-[10px] text-slate-400">({item.rad})</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Angle Slider, Values & Sin Wave */}
        <div className="lg:col-span-5 space-y-4">
          {/* Angle Slider Card */}
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-violet-400" />
                Açı Ayarı (Derece θ):
              </span>
              <span className="font-mono font-bold text-violet-300 text-base">{angleDeg}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={angleDeg}
              onChange={(e) => setAngleDeg(Number(e.target.value))}
              className="w-full accent-violet-500 cursor-pointer h-2.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0°</span>
              <span>90°</span>
              <span>180°</span>
              <span>270°</span>
              <span>360°</span>
            </div>
          </div>

          {/* Real-time Values Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Sinus */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/30 relative overflow-hidden">
              <div className="text-[11px] text-emerald-400 font-semibold mb-1 flex items-center justify-between">
                <span>sin({angleDeg}°)</span>
                <span className="text-[10px] bg-emerald-500/20 px-1.5 rounded">Y Ekseni</span>
              </div>
              <div className="text-xl font-bold font-mono text-emerald-300">
                {sinVal.toFixed(4)}
              </div>
            </div>

            {/* Cosinus */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 relative overflow-hidden">
              <div className="text-[11px] text-cyan-400 font-semibold mb-1 flex items-center justify-between">
                <span>cos({angleDeg}°)</span>
                <span className="text-[10px] bg-cyan-500/20 px-1.5 rounded">X Ekseni</span>
              </div>
              <div className="text-xl font-bold font-mono text-cyan-300">
                {cosVal.toFixed(4)}
              </div>
            </div>

            {/* Tangent */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-amber-500/30 relative overflow-hidden">
              <div className="text-[11px] text-amber-400 font-semibold mb-1 flex items-center justify-between">
                <span>tan({angleDeg}°)</span>
                <span className="text-[10px] bg-amber-500/20 px-1.5 rounded">x = 1 Doğrusu</span>
              </div>
              <div className="text-xl font-bold font-mono text-amber-300">
                {!isFinite(tanVal) ? 'Tanımsız' : tanVal.toFixed(4)}
              </div>
            </div>

            {/* Cotangent */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-purple-500/30 relative overflow-hidden">
              <div className="text-[11px] text-purple-400 font-semibold mb-1 flex items-center justify-between">
                <span>cot({angleDeg}°)</span>
                <span className="text-[10px] bg-purple-500/20 px-1.5 rounded">y = 1 Doğrusu</span>
              </div>
              <div className="text-xl font-bold font-mono text-purple-300">
                {!isFinite(cotVal) ? 'Tanımsız' : cotVal.toFixed(4)}
              </div>
            </div>
          </div>

          {/* Synchronized Sin Wave Canvas */}
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-medium flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                Sinüs Dalgası İzdüşümü f(θ) = sin(θ)
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">Canlı Dalga</span>
            </div>
            <div className="w-full h-[110px] bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
              <canvas
                ref={waveCanvasRef}
                width={360}
                height={110}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Core Trigonometric Identity Note */}
          <div className="p-3 rounded-xl bg-violet-950/20 border border-violet-500/20 text-xs flex items-center justify-between">
            <span className="text-slate-400 font-medium">Temel Özdeşlik:</span>
            <span className="font-mono text-white font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-700">
              sin²({angleDeg}°) + cos²({angleDeg}°) = {(sinVal * sinVal + cosVal * cosVal).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
