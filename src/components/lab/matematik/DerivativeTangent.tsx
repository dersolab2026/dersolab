'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  RotateCcw,
  Sliders,
  Info,
  CheckCircle2,
  AlertCircle,
  Activity,
} from 'lucide-react'

type FunctionType = 'cubic' | 'parabola' | 'sine'

export function DerivativeTangent() {
  const [funcType, setFuncType] = useState<FunctionType>('cubic')
  const [xVal, setXVal] = useState<number>(0.5)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Function and derivative definitions
  const evalFunc = (x: number): number => {
    if (funcType === 'cubic') {
      return (1 / 3) * Math.pow(x, 3) - x
    } else if (funcType === 'parabola') {
      return 0.5 * Math.pow(x, 2) - 1.5
    } else {
      return Math.sin(x)
    }
  }

  const evalDerivative = (x: number): number => {
    if (funcType === 'cubic') {
      return Math.pow(x, 2) - 1
    } else if (funcType === 'parabola') {
      return x
    } else {
      return Math.cos(x)
    }
  }

  const yVal = evalFunc(xVal)
  const slope = evalDerivative(xVal)
  const isExtremum = Math.abs(slope) < 0.08

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    const w = canvas.width
    const h = canvas.height
    const cx = w / 2
    const cy = h / 2

    // Scale factors: 1 math unit = 60 pixels
    const scaleX = 65
    const scaleY = 65

    const toCanvasX = (x: number) => cx + x * scaleX
    const toCanvasY = (y: number) => cy - y * scaleY

    // Draw Grid
    ctx.strokeStyle = '#1e293b'
    ctx.lineWidth = 1
    for (let x = -5; x <= 5; x += 1) {
      const cxPos = toCanvasX(x)
      ctx.beginPath()
      ctx.moveTo(cxPos, 0)
      ctx.lineTo(cxPos, h)
      ctx.stroke()
    }
    for (let y = -4; y <= 4; y += 1) {
      const cyPos = toCanvasY(y)
      ctx.beginPath()
      ctx.moveTo(0, cyPos)
      ctx.lineTo(w, cyPos)
      ctx.stroke()
    }

    // Axes
    ctx.strokeStyle = '#475569'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(0, cy)
    ctx.lineTo(w, cy)
    ctx.moveTo(cx, 0)
    ctx.lineTo(cx, h)
    ctx.stroke()

    // Function Curve
    ctx.strokeStyle = '#818cf8'
    ctx.lineWidth = 3
    ctx.beginPath()
    let first = true
    for (let px = 0; px <= w; px += 2) {
      const mathX = (px - cx) / scaleX
      const mathY = evalFunc(mathX)
      const py = toCanvasY(mathY)
      if (first) {
        ctx.moveTo(px, py)
        first = false
      } else {
        ctx.lineTo(px, py)
      }
    }
    ctx.stroke()

    // Tangent Line at xVal: y = slope * (x - xVal) + yVal
    ctx.strokeStyle = '#facc15' // bright yellow
    ctx.lineWidth = 2.5
    ctx.beginPath()
    const tX1 = xVal - 3
    const tY1 = slope * (tX1 - xVal) + yVal
    const tX2 = xVal + 3
    const tY2 = slope * (tX2 - xVal) + yVal
    ctx.moveTo(toCanvasX(tX1), toCanvasY(tY1))
    ctx.lineTo(toCanvasX(tX2), toCanvasY(tY2))
    ctx.stroke()

    // Tangent Triangle (dx, dy)
    const dtX = 0.8
    const dtY = slope * dtX
    const pt1X = toCanvasX(xVal)
    const pt1Y = toCanvasY(yVal)
    const pt2X = toCanvasX(xVal + dtX)
    const pt2Y = pt1Y
    const pt3X = pt2X
    const pt3Y = toCanvasY(yVal + dtY)

    ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)'
    ctx.lineWidth = 1.5
    ctx.setLineDash([3, 3])
    ctx.beginPath()
    ctx.moveTo(pt1X, pt1Y)
    ctx.lineTo(pt2X, pt2Y)
    ctx.lineTo(pt3X, pt3Y)
    ctx.stroke()
    ctx.setLineDash([])

    // Point P(xVal, yVal)
    const pCanvasX = toCanvasX(xVal)
    const pCanvasY = toCanvasY(yVal)

    // Pulsing aura if extremum
    if (isExtremum) {
      ctx.fillStyle = 'rgba(34, 197, 94, 0.3)'
      ctx.beginPath()
      ctx.arc(pCanvasX, pCanvasY, 16, 0, Math.PI * 2)
      ctx.fill()
    }

    ctx.fillStyle = isExtremum ? '#22c55e' : '#f43f5e'
    ctx.beginPath()
    ctx.arc(pCanvasX, pCanvasY, 6.5, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = 2
    ctx.stroke()

    // Label P
    ctx.fillStyle = '#f8fafc'
    ctx.font = 'bold 11px sans-serif'
    ctx.fillText(`P(${xVal.toFixed(2)}, ${yVal.toFixed(2)})`, pCanvasX + 10, pCanvasY - 10)
  }, [funcType, xVal, yVal, slope, isExtremum])

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-violet-950/20 to-slate-900/60 border border-indigo-500/20 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              AYT Matematik (Limit & Türev)
            </span>
            <span className="text-xs text-slate-400">Teğet Eğimi & Ekstremum Noktaları</span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-indigo-400" />
            Türev & Teğet Doğrusu Simülatörü
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Türev, fonksiyon grafiğindeki o anki teğetin eğimidir: <span className="font-mono text-yellow-300">m = f'(x)</span>.
            Noktayı eğri üzerinde kaydırarak teğetin eğiminin nasıl değiştiğini ve tepe/çukur noktalarında neden{' '}
            <span className="font-mono text-emerald-400 font-bold">f'(x) = 0</span> olduğunu canlı gör!
          </p>
        </div>

        {/* Function Type Selector */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-700/60 self-start md:self-auto">
          <button
            onClick={() => setFuncType('cubic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              funcType === 'cubic'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            f(x) = ⅓x³ - x
          </button>
          <button
            onClick={() => setFuncType('parabola')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              funcType === 'parabola'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            f(x) = ½x² - 1.5
          </button>
          <button
            onClick={() => setFuncType('sine')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              funcType === 'sine'
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            f(x) = sin(x)
          </button>
        </div>
      </div>

      {/* ── Main Interactive Canvas & Diagnostics ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Canvas Graph */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl bg-slate-900/70 border border-slate-800 p-5 shadow-xl relative">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              Fonksiyon Eğrisi & Teğet Doğrusu
            </span>

            {/* Extremum Alert Badge */}
            {isExtremum ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Yerel Ekstremum Noktası! (m ≈ 0)
              </span>
            ) : slope > 0 ? (
              <span className="text-xs text-cyan-400 font-semibold">
                📈 Artan Bölge (f&apos;(x) &gt; 0)
              </span>
            ) : (
              <span className="text-xs text-amber-400 font-semibold">
                📉 Azalan Bölge (f&apos;(x) &lt; 0)
              </span>
            )}
          </div>

          <div className="relative w-full h-[360px] bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={700}
              height={360}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Quick Slider below canvas */}
          <div className="mt-4 p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Değme Noktası x₀:</span>
              <span className="font-mono font-bold text-yellow-300 text-sm">{xVal.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={-2.4}
              max={2.4}
              step={0.02}
              value={xVal}
              onChange={(e) => setXVal(Number(e.target.value))}
              className="w-full accent-yellow-400 cursor-pointer h-2.5 bg-slate-800 rounded-lg"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>-2.4</span>
              <span>-1.0 (Tepe)</span>
              <span>0.0</span>
              <span>+1.0 (Çukur)</span>
              <span>+2.4</span>
            </div>
          </div>
        </div>

        {/* Right: Analytical Equations & AYT Notes */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Anlık Türev & Teğet Değerleri
            </h3>

            {/* Point coordinates */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400">Değme Noktası P(x₀, y₀)</div>
              <div className="text-lg font-mono font-bold text-white">
                ({xVal.toFixed(2)}, {yVal.toFixed(2)})
              </div>
            </div>

            {/* Slope (Derivative) */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-yellow-500/30 space-y-1">
              <div className="text-[11px] text-yellow-400 font-semibold flex items-center justify-between">
                <span>Teğetin Eğimi (m = f&apos;(x₀))</span>
                <span className="text-[10px] bg-yellow-500/20 px-1.5 rounded">Türev</span>
              </div>
              <div className="text-2xl font-mono font-bold text-yellow-300">
                m = {slope.toFixed(3)}
              </div>
            </div>

            {/* Tangent line equation */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400">Teğet Doğrusu Denklemi:</div>
              <div className="text-xs font-mono font-bold text-cyan-300">
                y = {slope.toFixed(2)}·x + {(yVal - slope * xVal).toFixed(2)}
              </div>
            </div>
          </div>

          {/* YKS AYT Hap Bilgileri */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/30 via-slate-900 to-slate-950 border border-indigo-500/20 text-xs space-y-2.5">
            <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
              <Info className="w-4 h-4" />
              <span>AYT Türev Hap Bilgileri</span>
            </div>
            <ul className="text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>
                <strong className="text-white">Geometrik Anlam:</strong> Bir fonksiyona bir noktadan çizilen teğetin eğimi, o fonksiyonun o noktadaki birinci türevine eşittir (<span className="font-mono text-yellow-300">m = f&apos;(x₀)</span>).
              </li>
              <li>
                <strong className="text-emerald-300">Ekstremum Noktalar:</strong> Teğetin x eksenine paralel olduğu (yatay) noktalarda eğim sıfırdır (<span className="font-mono text-emerald-400">f&apos;(x) = 0</span>). Bu noktalar yerel maksimum ya da yerel minimum adaylarıdır.
              </li>
              <li>
                <strong className="text-cyan-300">Artanlık & Azalanlık:</strong> Bir aralıkta <span className="font-mono">f&apos;(x) &gt; 0</span> ise fonksiyon artan, <span className="font-mono">f&apos;(x) &lt; 0</span> ise azalandır.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
