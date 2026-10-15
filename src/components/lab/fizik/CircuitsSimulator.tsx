'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Zap,
  RotateCcw,
  Lightbulb,
  Battery,
  Sliders,
  Info,
  Layers,
  Sparkles,
  Gauge,
  HelpCircle,
} from 'lucide-react'

type CircuitType = 'single' | 'series' | 'parallel'

export function CircuitsSimulator() {
  const [voltage, setVoltage] = useState<number>(12) // Volts
  const [resistance1, setResistance1] = useState<number>(6) // Ohms
  const [resistance2, setResistance2] = useState<number>(6) // Ohms (for series/parallel)
  const [circuitType, setCircuitType] = useState<CircuitType>('series')
  const [switchOpen, setSwitchOpen] = useState<boolean>(false)
  const [electronAnim, setElectronAnim] = useState<number>(0)

  // Calculations
  let equivalentResistance = resistance1
  let current = 0
  let current1 = 0
  let current2 = 0
  let power = 0

  if (!switchOpen) {
    if (circuitType === 'single') {
      equivalentResistance = resistance1
      current = voltage / Math.max(0.1, equivalentResistance)
      current1 = current
      current2 = 0
      power = voltage * current
    } else if (circuitType === 'series') {
      equivalentResistance = resistance1 + resistance2
      current = voltage / Math.max(0.1, equivalentResistance)
      current1 = current
      current2 = current
      power = voltage * current
    } else if (circuitType === 'parallel') {
      equivalentResistance = (resistance1 * resistance2) / Math.max(0.1, resistance1 + resistance2)
      current = voltage / Math.max(0.1, equivalentResistance)
      current1 = voltage / Math.max(0.1, resistance1)
      current2 = voltage / Math.max(0.1, resistance2)
      power = voltage * current
    }
  }

  // Bulb brightness calculation (0 - 100%)
  const bulb1Brightness = switchOpen ? 0 : Math.min(100, (current1 * current1 * resistance1) / 0.72)
  const bulb2Brightness = switchOpen || circuitType === 'single' ? 0 : Math.min(100, (current2 * current2 * resistance2) / 0.72)

  // Canvas animation for flowing electrons
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let animId: number
    let offset = 0
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const w = canvas.width
      const h = canvas.height

      // Circuit dimensions
      const paddingX = 60
      const paddingY = 40
      const left = paddingX
      const right = w - paddingX
      const top = paddingY
      const bottom = h - paddingY
      const midY = (top + bottom) / 2

      // Wire path
      ctx.lineWidth = 4
      ctx.strokeStyle = switchOpen ? '#334155' : '#0284c7'
      ctx.lineCap = 'round'

      if (circuitType === 'single') {
        // Simple loop
        ctx.beginPath()
        ctx.rect(left, top, right - left, bottom - top)
        ctx.stroke()
      } else if (circuitType === 'series') {
        // Simple rectangular loop with two devices on right/bottom
        ctx.beginPath()
        ctx.rect(left, top, right - left, bottom - top)
        ctx.stroke()
      } else {
        // Parallel: Outer loop + middle horizontal branch
        ctx.beginPath()
        ctx.rect(left, top, right - left, bottom - top)
        ctx.moveTo(left, midY)
        ctx.lineTo(right, midY)
        ctx.stroke()
      }

      // Draw Battery (on Left Wire)
      const batteryY = (top + bottom) / 2
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(left - 18, batteryY - 32, 36, 64)
      ctx.strokeStyle = '#38bdf8'
      ctx.strokeRect(left - 18, batteryY - 32, 36, 64)

      // Battery label
      ctx.fillStyle = '#f8fafc'
      ctx.font = 'bold 12px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`${voltage}V`, left, batteryY + 4)
      ctx.fillStyle = '#ef4444'
      ctx.fillText('+', left, batteryY - 14)
      ctx.fillStyle = '#38bdf8'
      ctx.fillText('-', left, batteryY + 22)

      // Draw Switch on Top Wire
      const switchX = left + 120
      ctx.fillStyle = '#0f172a'
      ctx.fillRect(switchX - 22, top - 14, 44, 28)
      ctx.strokeStyle = switchOpen ? '#ef4444' : '#22c55e'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.arc(switchX - 16, top, 4, 0, Math.PI * 2)
      ctx.arc(switchX + 16, top, 4, 0, Math.PI * 2)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(switchX - 16, top)
      if (switchOpen) {
        ctx.lineTo(switchX + 10, top - 20)
      } else {
        ctx.lineTo(switchX + 16, top)
      }
      ctx.stroke()

      // Resistor / Bulb 1
      const bulb1X = right - 40
      const bulb1Y = circuitType === 'parallel' ? top + 40 : (top + bottom) / 2 - 30
      drawBulb(ctx, bulb1X, bulb1Y, bulb1Brightness, `R₁ = ${resistance1}Ω`)

      // Resistor / Bulb 2 (if series or parallel)
      if (circuitType === 'series') {
        const bulb2X = right - 40
        const bulb2Y = (top + bottom) / 2 + 50
        drawBulb(ctx, bulb2X, bulb2Y, bulb2Brightness, `R₂ = ${resistance2}Ω`)
      } else if (circuitType === 'parallel') {
        const bulb2X = right - 40
        const bulb2Y = bottom - 40
        drawBulb(ctx, bulb2X, bulb2Y, bulb2Brightness, `R₂ = ${resistance2}Ω`)
      }

      // Ammeter on bottom wire
      const ammeterX = (left + right) / 2
      ctx.fillStyle = '#0f172a'
      ctx.beginPath()
      ctx.arc(ammeterX, bottom, 20, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = '#f59e0b'
      ctx.lineWidth = 2
      ctx.stroke()
      ctx.fillStyle = '#f59e0b'
      ctx.font = 'bold 11px sans-serif'
      ctx.fillText(`${current.toFixed(2)}A`, ammeterX, bottom + 4)

      // Draw flowing electrons if circuit is closed and current > 0
      if (!switchOpen && current > 0) {
        const speed = Math.min(6, Math.max(0.8, current * 1.5))
        offset = (offset + speed) % 24
        drawElectrons(ctx, left, top, right, bottom, midY, circuitType, offset)
      }

      animId = requestAnimationFrame(render)
    }

    render()

    return () => cancelAnimationFrame(animId)
  }, [voltage, resistance1, resistance2, circuitType, switchOpen, current, bulb1Brightness, bulb2Brightness])

  function drawBulb(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    brightness: number,
    label: string
  ) {
    // Glow aura
    if (brightness > 0) {
      const radius = 18 + (brightness / 100) * 35
      const gradient = ctx.createRadialGradient(x, y, 4, x, y, radius)
      gradient.addColorStop(0, `rgba(250, 204, 21, ${0.4 + (brightness / 100) * 0.5})`)
      gradient.addColorStop(0.6, `rgba(234, 179, 8, ${0.15 + (brightness / 100) * 0.25})`)
      gradient.addColorStop(1, 'rgba(234, 179, 8, 0)')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(x, y, radius, 0, Math.PI * 2)
      ctx.fill()
    }

    // Bulb glass circle
    ctx.fillStyle = brightness > 5 ? '#fef08a' : '#1e293b'
    ctx.beginPath()
    ctx.arc(x, y, 16, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = brightness > 5 ? '#eab308' : '#475569'
    ctx.lineWidth = 2
    ctx.stroke()

    // Filament inside
    ctx.strokeStyle = brightness > 5 ? '#ea580c' : '#64748b'
    ctx.beginPath()
    ctx.moveTo(x - 6, y + 6)
    ctx.lineTo(x - 2, y - 6)
    ctx.lineTo(x + 2, y - 6)
    ctx.lineTo(x + 6, y + 6)
    ctx.stroke()

    // Label
    ctx.fillStyle = '#cbd5e1'
    ctx.font = '11px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(label, x, y + 30)
  }

  function drawElectrons(
    ctx: CanvasRenderingContext2D,
    left: number,
    top: number,
    right: number,
    bottom: number,
    midY: number,
    type: CircuitType,
    offset: number
  ) {
    ctx.fillStyle = '#38bdf8'

    const drawLineElectrons = (x1: number, y1: number, x2: number, y2: number, reverse = false) => {
      const dist = Math.hypot(x2 - x1, y2 - y1)
      const count = Math.floor(dist / 24)
      for (let i = 0; i <= count; i++) {
        let frac = (i * 24 + offset) % dist / dist
        if (reverse) frac = 1 - frac
        const ex = x1 + (x2 - x1) * frac
        const ey = y1 + (y2 - y1) * frac
        ctx.beginPath()
        ctx.arc(ex, ey, 2.5, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Conventional electron flow is negative to positive (or standard loop)
    // Top wire: left to right
    drawLineElectrons(left, top, right, top)
    // Right wire: top to bottom
    drawLineElectrons(right, top, right, bottom)
    // Bottom wire: right to left
    drawLineElectrons(right, bottom, left, bottom)
    // Left wire: bottom to top
    drawLineElectrons(left, bottom, left, top)

    // Parallel branch if active
    if (type === 'parallel') {
      drawLineElectrons(left, midY, right, midY)
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Top Header & Mode Switcher ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-slate-900/60 border border-cyan-500/20 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Maarif Modeli & MEB
            </span>
            <span className="text-xs text-slate-400">7 - 10. Sınıf Fen & Fizik</span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Zap className="w-6 h-6 text-cyan-400" />
            Ohm Yasası & Sanal Devre Simülatörü
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Voltajı (<span className="text-cyan-300 font-mono">V</span>) ve dirençleri (
            <span className="text-amber-300 font-mono">R</span>) anlık değiştir; eşdeğer direnç,
            devre akımı ve lamba parlaklığının nasıl değiştiğini canlı animasyonla keşfet!
          </p>
        </div>

        {/* Circuit Type Tabs */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-700/60 self-start md:self-auto">
          <button
            onClick={() => setCircuitType('series')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              circuitType === 'series'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Seri Bağlı
          </button>
          <button
            onClick={() => setCircuitType('parallel')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              circuitType === 'parallel'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Paralel Bağlı
          </button>
          <button
            onClick={() => setCircuitType('single')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              circuitType === 'single'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Tek Lamba
          </button>
        </div>
      </div>

      {/* ── Main Interactive Playground ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Canvas Circuit */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl bg-slate-900/70 border border-slate-800 p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    switchOpen ? 'bg-red-400' : 'bg-emerald-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    switchOpen ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                />
              </span>
              <span className="text-xs font-medium text-slate-300">
                {switchOpen ? 'Devre Açık (Akım Yok)' : 'Devre Kapalı (Akım Akıyor)'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setSwitchOpen(!switchOpen)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  switchOpen
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-red-500/20 text-red-300 border-red-500/40 hover:bg-red-500/30'
                }`}
              >
                {switchOpen ? 'Anahtarı Kapat (Akımı Başlat)' : 'Anahtarı Aç (Akımı Kes)'}
              </button>
              <button
                onClick={() => {
                  setVoltage(12)
                  setResistance1(6)
                  setResistance2(6)
                  setSwitchOpen(false)
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Sıfırla"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* HTML5 Canvas */}
          <div className="relative w-full h-[360px] bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={700}
              height={360}
              className="w-full h-full object-contain cursor-crosshair"
            />
            
            {/* Quick Status Pill */}
            <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/60 backdrop-blur-md text-xs flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-cyan-400">
                <Battery className="w-4 h-4" />
                <span>{voltage} V</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1.5 text-amber-400">
                <Gauge className="w-4 h-4" />
                <span>{equivalentResistance.toFixed(1)} Ω (R_eş)</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Zap className="w-4 h-4" />
                <span>{current.toFixed(2)} A (Akım)</span>
              </div>
            </div>
          </div>

          {/* Real-time Equation Banner */}
          <div className="mt-4 p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-cyan-300">Ohm Kanunu:</span>
              <span className="font-mono text-sm font-bold text-white bg-slate-900 px-2.5 py-1 rounded border border-slate-700">
                V = I · R
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <span>
                Akım: <strong className="text-cyan-300 font-mono">I = V / R_eş = {voltage} / {equivalentResistance.toFixed(1)} = {current.toFixed(2)} A</strong>
              </span>
              <span>
                Güç: <strong className="text-amber-300 font-mono">P = V · I = {power.toFixed(1)} W</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right: Controls & Parameters */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Devre Parametreleri
            </h3>

            {/* Voltage Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Üreteç Potansiyeli (V):</span>
                <span className="font-mono font-bold text-cyan-400">{voltage} Volt</span>
              </div>
              <input
                type="range"
                min={2}
                max={48}
                step={2}
                value={voltage}
                onChange={(e) => setVoltage(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>2V</span>
                <span>24V</span>
                <span>48V</span>
              </div>
            </div>

            {/* Resistor 1 Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Lamba / Direnç 1 (R₁):</span>
                <span className="font-mono font-bold text-amber-400">{resistance1} Ω</span>
              </div>
              <input
                type="range"
                min={1}
                max={24}
                step={1}
                value={resistance1}
                onChange={(e) => setResistance1(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1Ω</span>
                <span>12Ω</span>
                <span>24Ω</span>
              </div>
            </div>

            {/* Resistor 2 Slider (Only if series or parallel) */}
            {circuitType !== 'single' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Lamba / Direnç 2 (R₂):</span>
                  <span className="font-mono font-bold text-amber-400">{resistance2} Ω</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={24}
                  step={1}
                  value={resistance2}
                  onChange={(e) => setResistance2(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>1Ω</span>
                  <span>12Ω</span>
                  <span>24Ω</span>
                </div>
              </div>
            )}

            {/* Lamba Parlaklıkları Göstergesi */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-3">
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-yellow-400" />
                Lamba Parlaklıkları (Güç P = I²·R)
              </span>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">1. Lamba:</span>
                  <span className="text-yellow-400 font-mono font-semibold">
                    {bulb1Brightness.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-500 to-amber-300 transition-all duration-200"
                    style={{ width: `${bulb1Brightness}%` }}
                  />
                </div>
              </div>

              {circuitType !== 'single' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">2. Lamba:</span>
                    <span className="text-yellow-400 font-mono font-semibold">
                      {bulb2Brightness.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-500 to-amber-300 transition-all duration-200"
                      style={{ width: `${bulb2Brightness}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* YKS Exam Tips Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-950 border border-indigo-500/20 text-xs space-y-2.5">
            <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
              <Info className="w-4 h-4" />
              <span>YKS ÖSYM Hap Bilgisi</span>
            </div>
            <ul className="text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>
                <strong className="text-cyan-300">Seri Bağlama:</strong> Dirençler toplanır (
                <span className="font-mono">R_eş = R₁ + R₂</span>). Akımlar eşittir, gerilimler
                dirençle doğru orantılı paylaşılır.
              </li>
              <li>
                <strong className="text-amber-300">Paralel Bağlama:</strong> Gerilimler eşittir (
                <span className="font-mono">V₁ = V₂ = V</span>). Direnç küçüldükçe koldan geçen akım
                artar. Eşdeğer direnç her zaman en küçük dirençten bile küçüktür!
              </li>
              <li>
                <strong className="text-yellow-300">Lamba Parlaklığı:</strong> Sadece lambanın
                harcadığı elektriksel güce (<span className="font-mono">P = V²/R = I²·R</span>) bağlıdır!
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
