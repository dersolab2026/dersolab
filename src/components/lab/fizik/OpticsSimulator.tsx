'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye,
  Sliders,
  Zap,
  CheckCircle2,
  Info,
  RotateCcw,
  Target,
  Move,
  Flame,
  Ruler,
  HelpCircle,
  Maximize2,
  Layers,
} from 'lucide-react'

export function OpticsSimulator() {
  // Lens and Optical Parameters
  const [lensType, setLensType] = useState<'convex' | 'concave'>('convex')
  const [focalLength, setFocalLength] = useState<number>(65) // f in px (30 - 120)
  const [objectDistance, setObjectDistance] = useState<number>(130) // dc in px (25 - 250)
  const [objectHeight, setObjectHeight] = useState<number>(45) // hc in px (15 - 75)

  // Visual & Experimental Options (Inspired by tactile physics labs)
  const [objectType, setObjectType] = useState<'candle' | 'arrow'>('candle')
  const [rayMode, setRayMode] = useState<'special' | 'beam'>('special')
  const [showParallelRay, setShowParallelRay] = useState<boolean>(true)
  const [showCenterRay, setShowCenterRay] = useState<boolean>(true)
  const [showFocalRay, setShowFocalRay] = useState<boolean>(true)
  const [isHalfBlocked, setIsHalfBlocked] = useState<boolean>(false) // ÖSYM tricky question: blocking half lens

  // Draggable Virtual Ruler Tool
  const [showRuler, setShowRuler] = useState<boolean>(false)
  const [rulerPos, setRulerPos] = useState<{ x: number; y: number }>({ x: 90, y: 35 })
  const [rulerVertical, setRulerVertical] = useState<boolean>(false)

  // Interactive Dragging State
  const [draggingTarget, setDraggingTarget] = useState<'none' | 'object' | 'focus' | 'ruler'>('none')
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement | null>(null)

  // Canvas coordinate anchors
  const CX = 320 // Lens center X
  const CY = 135 // Principal axis Y
  const CANVAS_W = 640
  const CANVAS_H = 270

  // Lens equation: 1/f = 1/dc + 1/dg  =>  dg = (f * dc) / (dc - f)
  const effectiveF = lensType === 'convex' ? focalLength : -focalLength
  const isAtFocus = Math.abs(objectDistance - effectiveF) < 1.5

  let imageDistance = 0
  let isInfinity = false

  if (isAtFocus) {
    isInfinity = true
  } else {
    imageDistance = (effectiveF * objectDistance) / (objectDistance - effectiveF)
  }

  // Magnification: m = -dg / dc
  const magnification = isInfinity ? 0 : -imageDistance / objectDistance
  const imageHeight = isInfinity ? 0 : objectHeight * magnification

  // Image Characteristics
  const isReal = !isInfinity && imageDistance > 0 && lensType === 'convex'
  const isVirtual = !isInfinity && !isReal
  const isInverted = imageHeight < 0

  // Coordinates
  const objX = CX - objectDistance
  const objTopY = CY - objectHeight
  const imgX = CX + imageDistance
  const imgTopY = CY - imageHeight

  // Pointer event coordinate converter
  const getSvgCoords = (e: React.PointerEvent<SVGElement>) => {
    if (!svgRef.current) return { x: 0, y: 0 }
    const rect = svgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * CANVAS_W
    const y = ((e.clientY - rect.top) / rect.height) * CANVAS_H
    return { x, y }
  }

  const handlePointerDown = (
    e: React.PointerEvent<SVGElement>,
    target: 'object' | 'focus' | 'ruler'
  ) => {
    e.stopPropagation()
    const coords = getSvgCoords(e)
    setDraggingTarget(target)

    if (target === 'ruler') {
      setDragOffset({
        x: coords.x - rulerPos.x,
        y: coords.y - rulerPos.y,
      })
    }
  }

  const handlePointerMove = (e: React.PointerEvent<SVGElement>) => {
    if (draggingTarget === 'none') return
    const coords = getSvgCoords(e)

    if (draggingTarget === 'object') {
      const newDc = Math.max(30, Math.min(250, CX - coords.x))
      const newHc = Math.max(15, Math.min(75, CY - coords.y))
      setObjectDistance(Math.round(newDc))
      setObjectHeight(Math.round(newHc))
    } else if (draggingTarget === 'focus') {
      const newF = Math.max(35, Math.min(115, Math.abs(coords.x - CX)))
      setFocalLength(Math.round(newF))
    } else if (draggingTarget === 'ruler') {
      const newX = Math.max(5, Math.min(CANVAS_W - (rulerVertical ? 45 : 220), coords.x - dragOffset.x))
      const newY = Math.max(5, Math.min(CANVAS_H - (rulerVertical ? 220 : 45), coords.y - dragOffset.y))
      setRulerPos({ x: Math.round(newX), y: Math.round(newY) })
    }
  }

  const handlePointerUp = () => {
    setDraggingTarget('none')
  }

  // Presets aligned with ÖSYM curriculum
  const applyPreset = (preset: {
    type: 'convex' | 'concave'
    f: number
    dc: number
    hc?: number
  }) => {
    setLensType(preset.type)
    setFocalLength(preset.f)
    setObjectDistance(preset.dc)
    if (preset.hc) setObjectHeight(preset.hc)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Header Banner ── */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30">
              Maarif Modeli & MEB
            </span>
            <span className="text-xs text-slate-400">Ortaokul & Lise Optik Atölyesi</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1 flex items-center gap-2">
            <span>Geometrik Optik & Merceklerde Işın İzleme</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Dokunmatik & İnteraktif
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cismi veya odak noktasını <strong className="text-emerald-400">doğrudan ekrandan sürükleyin</strong>; cetvelle ölçüm yapın ve kırılan ışınları anlık gözlemleyin.
          </p>
        </div>

        {/* Lens Type Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setLensType('convex')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              lensType === 'convex'
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            İnce Kenarlı (Yakınsak)
          </button>
          <button
            onClick={() => setLensType('concave')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              lensType === 'concave'
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kalın Kenarlı (Iraksak)
          </button>
        </div>
      </div>

      {/* ── ÖSYM Klasik Soru Senaryoları (Hızlı Butonlar) ── */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Target className="w-3.5 h-3.5 text-amber-400" />
            <span>ÖSYM Soru Tipleri (Tek Tıkla Yükle):</span>
          </div>
          <span className="text-[11px] text-slate-500">Müfredata %100 Uyumlu</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset({ type: 'convex', f: 60, dc: 120 })}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              lensType === 'convex' && objectDistance === 120 && focalLength === 60
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            🌟 Cisim 2F&apos;te (Eşit Boy, Ters, Gerçek)
          </button>
          <button
            onClick={() => applyPreset({ type: 'convex', f: 50, dc: 150 })}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              lensType === 'convex' && objectDistance === 150 && focalLength === 50
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            🌟 Cisim 3F&apos;te (1.5F&apos;te Yarım Boy)
          </button>
          <button
            onClick={() => applyPreset({ type: 'convex', f: 60, dc: 90 })}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              lensType === 'convex' && objectDistance === 90 && focalLength === 60
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            🌟 Cisim 1.5F&apos;te (3F&apos;te 2 Kat Boy)
          </button>
          <button
            onClick={() => applyPreset({ type: 'convex', f: 60, dc: 60 })}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              lensType === 'convex' && objectDistance === 60 && focalLength === 60
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            🌟 Cisim Odakta (Işınlar Paralel, Sonsuz)
          </button>
          <button
            onClick={() => applyPreset({ type: 'convex', f: 80, dc: 40 })}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              lensType === 'convex' && objectDistance === 40 && focalLength === 80
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            🔍 Lup / Büyüteç (F-Mercek Arası, Düz & Büyütülmüş)
          </button>
          <button
            onClick={() => applyPreset({ type: 'concave', f: 70, dc: 110 })}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              lensType === 'concave'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            👓 Kalın Kenarlı (Miyop Gözlüğü, Daima Sanal & Küçük)
          </button>
        </div>
      </div>

      {/* ── Visual Optics Stage (Interactive SVG Canvas with Direct Manipulation) ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl space-y-4 shadow-2xl relative overflow-hidden">
        {/* Stage Toolbar */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-3 gap-3 text-xs">
          {/* Cisim & Işın Modları */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Cisim Tipi Toggle: Mum vs Ok */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setObjectType('candle')}
                className={`px-2 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
                  objectType === 'candle'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Mum & Alev</span>
              </button>
              <button
                onClick={() => setObjectType('arrow')}
                className={`px-2 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
                  objectType === 'arrow'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Move className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ok (Vektör)</span>
              </button>
            </div>

            {/* Işın Modu: 3 Özel Işın vs Çoklu Işın Demeti */}
            <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setRayMode('special')}
                className={`px-2 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                  rayMode === 'special'
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                3 Özel Işın
              </button>
              <button
                onClick={() => setRayMode('beam')}
                className={`px-2 py-1 rounded-lg font-medium transition-all flex items-center gap-1 cursor-pointer ${
                  rayMode === 'beam'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Işın Demeti</span>
              </button>
            </div>

            {/* Cetvel Aç/Kapa Butonu */}
            <button
              onClick={() => setShowRuler(!showRuler)}
              className={`px-2.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
                showRuler
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-[0_0_12px_rgba(251,191,36,0.3)]'
                  : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Ruler className="w-3.5 h-3.5" />
              <span>{showRuler ? 'Cetveli Kapat' : 'Şeffaf Cetvel'}</span>
            </button>

            {/* ÖSYM Engel Deneyi: Merceğin Yarısını Kapat */}
            <button
              onClick={() => setIsHalfBlocked(!isHalfBlocked)}
              className={`px-2.5 py-1.5 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer border ${
                isHalfBlocked
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/50'
                  : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
              }`}
              title="ÖSYM Sorusu: Merceğin üstü kapatılırsa görüntü kaybolur mu?"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isHalfBlocked ? 'bg-rose-400 animate-pulse' : 'bg-slate-600'
                }`}
              />
              <span>Merceğin Yarısını Kapat</span>
            </button>
          </div>

          {/* Durum Özeti Rozeti */}
          <div className="font-mono text-xs px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-amber-300">
            {isInfinity ? (
              <span className="text-rose-400 font-bold">Işınlar Paralel (Görüntü Sonsuzda)</span>
            ) : (
              <span>
                <strong className={isReal ? 'text-emerald-400' : 'text-cyan-400'}>
                  {isReal ? 'Gerçek' : 'Sanal'}
                </strong>
                , {isInverted ? 'Ters' : 'Düz'}, m = {magnification.toFixed(2)}x
              </span>
            )}
          </div>
        </div>

        {/* 3 Özel Işın Görünürlük Seçenekleri (yalnızca Özel modda) */}
        {rayMode === 'special' && (
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 bg-slate-950/40 p-2 rounded-xl border border-slate-800/60">
            <span className="font-semibold text-slate-300">Işın Filtreleri:</span>
            <label className="flex items-center gap-1 cursor-pointer select-none text-sky-400">
              <input
                type="checkbox"
                checked={showParallelRay}
                onChange={(e) => setShowParallelRay(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-sky-500"
              />
              1. Asal Eksene Paralel Işın
            </label>
            <label className="flex items-center gap-1 cursor-pointer select-none text-pink-400">
              <input
                type="checkbox"
                checked={showCenterRay}
                onChange={(e) => setShowCenterRay(e.target.checked)}
                className="rounded border-slate-700 bg-slate-800 text-pink-500"
              />
              2. Optik Merkez Işını
            </label>
            {lensType === 'convex' && (
              <label className="flex items-center gap-1 cursor-pointer select-none text-purple-400">
                <input
                  type="checkbox"
                  checked={showFocalRay}
                  onChange={(e) => setShowFocalRay(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-purple-500"
                />
                3. Odaktan Gelen Işın
              </label>
            )}
          </div>
        )}

        {/* SVG Drawing Canvas (640x270) with Interactive Direct Manipulation */}
        <div className="relative w-full h-80 bg-slate-950/95 rounded-2xl p-2 border border-slate-800/90 flex items-center justify-center overflow-hidden select-none">
          <svg
            ref={svgRef}
            className="w-full h-full cursor-crosshair"
            viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* Background Grid Pattern */}
            <defs>
              <pattern id="opticsGridDetailed" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#172033" strokeWidth="0.6" />
              </pattern>

              {/* Flame Glow Radial Gradient */}
              <radialGradient id="flameGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
                <stop offset="40%" stopColor="#f97316" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#dc2626" stopOpacity="0" />
              </radialGradient>

              {/* Lens Blue Glass Gradient */}
              <linearGradient id="lensGlass" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.25" />
              </linearGradient>
            </defs>

            {/* Grid */}
            <rect width={CANVAS_W} height={CANVAS_H} fill="url(#opticsGridDetailed)" />

            {/* Principal Axis (Asal Eksen) */}
            <line
              x1="10"
              y1={CY}
              x2={CANVAS_W - 10}
              y2={CY}
              stroke="#475569"
              strokeWidth="1.5"
              strokeDasharray="4 4"
            />
            <text x={CANVAS_W - 75} y={CY - 8} fill="#64748b" fontSize="9" fontFamily="monospace">
              Asal Eksen
            </text>

            {/* Lens Center Optical Line */}
            <line
              x1={CX}
              y1="15"
              x2={CX}
              y2={CANVAS_H - 15}
              stroke={lensType === 'convex' ? '#38bdf8' : '#06b6d4'}
              strokeWidth="2.5"
            />

            {/* Lens Shape Glyphs */}
            {lensType === 'convex' ? (
              /* Convex arrows pointing outward at top & bottom */
              <g stroke="#38bdf8" strokeWidth="2.5" fill="none">
                <path d={`M ${CX - 12},28 L ${CX},15 L ${CX + 12},28`} />
                <path d={`M ${CX - 12},${CANVAS_H - 28} L ${CX},${CANVAS_H - 15} L ${CX + 12},${CANVAS_H - 28}`} />
                {/* Subtle lens body curve */}
                <ellipse cx={CX} cy={CY} rx="12" ry="110" fill="url(#lensGlass)" stroke="#38bdf8" strokeWidth="1" />
              </g>
            ) : (
              /* Concave arrows pointing inward at top & bottom */
              <g stroke="#06b6d4" strokeWidth="2.5" fill="none">
                <path d={`M ${CX - 12},15 L ${CX},28 L ${CX + 12},15`} />
                <path d={`M ${CX - 12},${CANVAS_H - 15} L ${CX},${CANVAS_H - 28} L ${CX + 12},${CANVAS_H - 15}`} />
                <rect x={CX - 8} y="22" width="16" height={CANVAS_H - 44} fill="url(#lensGlass)" stroke="#06b6d4" strokeWidth="1" />
              </g>
            )}

            {/* ── ÖSYM Engel: Merceğin Üst Yarısını Kapat ── */}
            {isHalfBlocked && (
              <g>
                <rect
                  x={CX - 15}
                  y="20"
                  width="30"
                  height={CY - 20}
                  fill="#0f172a"
                  stroke="#ef4444"
                  strokeWidth="1.5"
                  strokeDasharray="3 3"
                  opacity="0.9"
                />
                <text x={CX - 12} y={CY - 25} fill="#f87171" fontSize="9" fontWeight="bold">
                  ENGEL
                </text>
              </g>
            )}

            {/* ── Focal Points F and 2F on Left (Draggable!) ── */}
            {/* 2F Point */}
            <circle cx={CX - focalLength * 2} cy={CY} r="3" fill="#64748b" />
            <text x={CX - focalLength * 2 - 7} y={CY + 18} fill="#94a3b8" fontSize="9">
              2F
            </text>

            {/* F Point (Interactive Draggable with Glow) */}
            <g
              className="cursor-ew-resize group"
              onPointerDown={(e) => handlePointerDown(e, 'focus')}
            >
              <circle
                cx={CX - focalLength}
                cy={CY}
                r="7"
                fill="#f59e0b"
                fillOpacity="0.2"
                className="group-hover:fill-amber-400 group-hover:fill-opacity-40 transition-all"
              />
              <circle cx={CX - focalLength} cy={CY} r="3.5" fill="#f59e0b" />
              <text
                x={CX - focalLength - 4}
                y={CY + 18}
                fill="#f59e0b"
                fontSize="10"
                fontWeight="bold"
              >
                F
              </text>
            </g>

            {/* ── Focal Points F' and 2F' on Right ── */}
            <circle cx={CX + focalLength} cy={CY} r="3.5" fill="#f59e0b" />
            <text x={CX + focalLength - 4} y={CY + 18} fill="#f59e0b" fontSize="10" fontWeight="bold">
              F&apos;
            </text>
            <circle cx={CX + focalLength * 2} cy={CY} r="3" fill="#64748b" />
            <text x={CX + focalLength * 2 - 7} y={CY + 18} fill="#94a3b8" fontSize="9">
              2F&apos;
            </text>

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* ── RAY RENDERING: 3 ÖZEL IŞIN MODU ── */}
            {/* ════════════════════════════════════════════════════════════════ */}
            {rayMode === 'special' && (
              <>
                {/* Ray 1: Parallel to Axis */}
                {showParallelRay && (!isHalfBlocked || objTopY >= CY) && (
                  <g>
                    <line x1={objX} y1={objTopY} x2={CX} y2={objTopY} stroke="#38bdf8" strokeWidth="1.5" />
                    {lensType === 'convex' ? (
                      <>
                        {(() => {
                          const slope = (CY - objTopY) / focalLength
                          const farX = CANVAS_W - 15
                          const farY = CY + slope * (farX - (CX + focalLength))
                          return (
                            <line
                              x1={CX}
                              y1={objTopY}
                              x2={farX}
                              y2={farY}
                              stroke="#38bdf8"
                              strokeWidth="1.5"
                              opacity="0.85"
                            />
                          )
                        })()}
                        {/* Virtual backward extension if dc < f */}
                        {objectDistance < focalLength && !isInfinity && (
                          <line
                            x1={CX}
                            y1={objTopY}
                            x2={imgX}
                            y2={imgTopY}
                            stroke="#38bdf8"
                            strokeWidth="1.5"
                            strokeDasharray="4 3"
                            opacity="0.75"
                          />
                        )}
                      </>
                    ) : (
                      /* Concave lens */
                      <>
                        {(() => {
                          const slope = (objTopY - CY) / focalLength
                          const farX = CANVAS_W - 15
                          const farY = objTopY + slope * (farX - CX)
                          return (
                            <>
                              <line
                                x1={CX}
                                y1={objTopY}
                                x2={farX}
                                y2={farY}
                                stroke="#38bdf8"
                                strokeWidth="1.5"
                                opacity="0.85"
                              />
                              <line
                                x1={CX}
                                y1={objTopY}
                                x2={CX - focalLength}
                                y2={CY}
                                stroke="#38bdf8"
                                strokeWidth="1.5"
                                strokeDasharray="4 3"
                                opacity="0.75"
                              />
                            </>
                          )
                        })()}
                      </>
                    )}
                  </g>
                )}

                {/* Ray 2: Optical Center Ray */}
                {showCenterRay && (!isHalfBlocked || CY >= CY) && (
                  <g>
                    {(() => {
                      const slope = (CY - objTopY) / (CX - objX)
                      const farX = CANVAS_W - 15
                      const farY = CY + slope * (farX - CX)
                      return (
                        <>
                          <line
                            x1={objX}
                            y1={objTopY}
                            x2={farX}
                            y2={farY}
                            stroke="#ec4899"
                            strokeWidth="1.5"
                            opacity="0.85"
                          />
                          {isVirtual && !isInfinity && (
                            <line
                              x1={objX}
                              y1={objTopY}
                              x2={imgX}
                              y2={imgTopY}
                              stroke="#ec4899"
                              strokeWidth="1.5"
                              strokeDasharray="4 3"
                              opacity="0.75"
                            />
                          )}
                        </>
                      )
                    })()}
                  </g>
                )}

                {/* Ray 3: Focal Ray */}
                {showFocalRay && lensType === 'convex' && objectDistance > focalLength && (
                  <g>
                    {(() => {
                      const slope = (CY - objTopY) / (CX - focalLength - objX)
                      const lensHitY = CY + slope * focalLength
                      if (isHalfBlocked && lensHitY < CY) return null
                      return (
                        <>
                          <line
                            x1={objX}
                            y1={objTopY}
                            x2={CX}
                            y2={lensHitY}
                            stroke="#a855f7"
                            strokeWidth="1.5"
                            opacity="0.8"
                          />
                          <line
                            x1={CX}
                            y1={lensHitY}
                            x2={CANVAS_W - 15}
                            y2={lensHitY}
                            stroke="#a855f7"
                            strokeWidth="1.5"
                            opacity="0.8"
                          />
                        </>
                      )
                    })()}
                  </g>
                )}
              </>
            )}

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* ── RAY RENDERING: ÇOKLU IŞIN DEMETİ (PhET-inspired Ray Fan) ── */}
            {/* ════════════════════════════════════════════════════════════════ */}
            {rayMode === 'beam' && (
              <g opacity={isHalfBlocked ? '0.6' : '0.85'}>
                {[-70, -50, -30, -10, 0, 15, 35, 55, 75].map((offsetY, i) => {
                  const lensHitY = CY + offsetY
                  const blocked = isHalfBlocked && lensHitY < CY

                  // Incident ray from tip to lens hit point
                  return (
                    <g key={i}>
                      <line
                        x1={objX}
                        y1={objTopY}
                        x2={CX}
                        y2={lensHitY}
                        stroke="#f59e0b"
                        strokeWidth="1.2"
                        opacity={blocked ? '0.3' : '0.75'}
                      />

                      {/* If not blocked, refract through or toward image */}
                      {!blocked && (
                        <>
                          {lensType === 'convex' ? (
                            !isInfinity && (
                              isReal ? (
                                /* Converges to real image point */
                                <line
                                  x1={CX}
                                  y1={lensHitY}
                                  x2={imgX}
                                  y2={imgTopY}
                                  stroke="#38bdf8"
                                  strokeWidth="1.2"
                                />
                              ) : (
                                /* Diverges, extending from virtual image point */
                                <>
                                  {(() => {
                                    const slope = (lensHitY - imgTopY) / (CX - imgX)
                                    const farX = CANVAS_W - 15
                                    const farY = lensHitY + slope * (farX - CX)
                                    return (
                                      <>
                                        <line
                                          x1={CX}
                                          y1={lensHitY}
                                          x2={farX}
                                          y2={farY}
                                          stroke="#38bdf8"
                                          strokeWidth="1.2"
                                        />
                                        <line
                                          x1={CX}
                                          y1={lensHitY}
                                          x2={imgX}
                                          y2={imgTopY}
                                          stroke="#38bdf8"
                                          strokeWidth="1"
                                          strokeDasharray="3 3"
                                          opacity="0.6"
                                        />
                                      </>
                                    )
                                  })()}
                                </>
                              )
                            )
                          ) : (
                            /* Concave beam rays */
                            <>
                              {(() => {
                                const slope = (lensHitY - imgTopY) / (CX - imgX)
                                const farX = CANVAS_W - 15
                                const farY = lensHitY + slope * (farX - CX)
                                return (
                                  <>
                                    <line
                                      x1={CX}
                                      y1={lensHitY}
                                      x2={farX}
                                      y2={farY}
                                      stroke="#06b6d4"
                                      strokeWidth="1.2"
                                    />
                                    <line
                                      x1={CX}
                                      y1={lensHitY}
                                      x2={imgX}
                                      y2={imgTopY}
                                      stroke="#06b6d4"
                                      strokeWidth="1"
                                      strokeDasharray="3 3"
                                      opacity="0.6"
                                    />
                                  </>
                                )
                              })()}
                            </>
                          )}
                        </>
                      )}
                    </g>
                  )
                })}
              </g>
            )}

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* ── THE OBJECT (Candle vs Arrow) with Direct Drag Handle ── */}
            {/* ════════════════════════════════════════════════════════════════ */}
            <g
              className="cursor-grab active:cursor-grabbing group"
              onPointerDown={(e) => handlePointerDown(e, 'object')}
            >
              {objectType === 'candle' ? (
                /* Candle Graphic */
                <g>
                  {/* Candle Wax Body */}
                  <rect
                    x={objX - 4}
                    y={objTopY + 14}
                    width="8"
                    height={CY - (objTopY + 14)}
                    rx="2"
                    fill="#fef08a"
                    stroke="#ca8a04"
                    strokeWidth="1"
                  />
                  {/* Candle Wick */}
                  <line
                    x1={objX}
                    y1={objTopY + 14}
                    x2={objX}
                    y2={objTopY + 8}
                    stroke="#78350f"
                    strokeWidth="1.5"
                  />
                  {/* Glowing Flame */}
                  <circle cx={objX} cy={objTopY + 4} r="10" fill="url(#flameGlow)" />
                  <path
                    d={`M ${objX},${objTopY} C ${objX - 3},${objTopY + 4} ${objX - 3},${objTopY + 8} ${objX},${objTopY + 8} C ${objX + 3},${objTopY + 8} ${objX + 3},${objTopY + 4} ${objX},${objTopY} Z`}
                    fill="#f59e0b"
                  />
                  {/* Inner Flame Core */}
                  <ellipse cx={objX} cy={objTopY + 5} rx="1.5" ry="2.5" fill="#fef08a" />
                </g>
              ) : (
                /* Classic Physics Vector Arrow */
                <g>
                  <line x1={objX} y1={CY} x2={objX} y2={objTopY} stroke="#10b981" strokeWidth="4" />
                  <polygon
                    points={`${objX - 6},${objTopY + 10} ${objX + 6},${objTopY + 10} ${objX},${objTopY}`}
                    fill="#10b981"
                  />
                </g>
              )}

              {/* Pulsing Drag Ring on Object Tip */}
              <circle
                cx={objX}
                cy={objTopY}
                r="10"
                fill="#10b981"
                fillOpacity="0.25"
                className="group-hover:fill-opacity-50 transition-all animate-pulse"
              />
              <circle cx={objX} cy={objTopY} r="3.5" fill="#34d399" />

              <text
                x={objX - 16}
                y={objTopY - 10}
                fill="#34d399"
                fontSize="10"
                fontWeight="bold"
                className="pointer-events-none"
              >
                Cisim
              </text>
            </g>

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* ── THE FORMED IMAGE (Real vs Virtual) ── */}
            {/* ════════════════════════════════════════════════════════════════ */}
            {!isInfinity && (
              <g opacity={isHalfBlocked ? '0.65' : '1'}>
                {objectType === 'candle' ? (
                  /* Formed Image as Candle */
                  <g>
                    {isInverted ? (
                      /* Inverted Real Candle */
                      <>
                        <rect
                          x={imgX - 4}
                          y={CY}
                          width="8"
                          height={imgTopY - 14 - CY}
                          rx="2"
                          fill="#fde047"
                          fillOpacity={isVirtual ? '0.5' : '0.9'}
                          stroke="#eab308"
                          strokeWidth="1"
                        />
                        <line
                          x1={imgX}
                          y1={imgTopY - 14}
                          x2={imgX}
                          y2={imgTopY - 8}
                          stroke="#78350f"
                          strokeWidth="1.5"
                        />
                        <circle cx={imgX} cy={imgTopY - 4} r="10" fill="url(#flameGlow)" />
                        <path
                          d={`M ${imgX},${imgTopY} C ${imgX - 3},${imgTopY - 4} ${imgX - 3},${imgTopY - 8} ${imgX},${imgTopY - 8} C ${imgX + 3},${imgTopY - 8} ${imgX + 3},${imgTopY - 4} ${imgX},${imgTopY} Z`}
                          fill="#f59e0b"
                        />
                      </>
                    ) : (
                      /* Upright Virtual Candle */
                      <>
                        <rect
                          x={imgX - 4}
                          y={imgTopY + 14}
                          width="8"
                          height={CY - (imgTopY + 14)}
                          rx="2"
                          fill="#67e8f9"
                          fillOpacity="0.5"
                          stroke="#06b6d4"
                          strokeWidth="1"
                          strokeDasharray="3 2"
                        />
                        <line
                          x1={imgX}
                          y1={imgTopY + 14}
                          x2={imgX}
                          y2={imgTopY + 8}
                          stroke="#0891b2"
                          strokeWidth="1.5"
                        />
                        <circle cx={imgX} cy={imgTopY + 4} r="10" fill="url(#flameGlow)" opacity="0.7" />
                        <path
                          d={`M ${imgX},${imgTopY} C ${imgX - 3},${imgTopY + 4} ${imgX - 3},${imgTopY + 8} ${imgX},${imgTopY + 8} C ${imgX + 3},${imgTopY + 8} ${imgX + 3},${imgTopY + 4} ${imgX},${imgTopY} Z`}
                          fill="#06b6d4"
                        />
                      </>
                    )}
                  </g>
                ) : (
                  /* Formed Image as Vector Arrow */
                  <g>
                    <line
                      x1={imgX}
                      y1={CY}
                      x2={imgX}
                      y2={imgTopY}
                      stroke={isReal ? '#f59e0b' : '#06b6d4'}
                      strokeWidth="3.5"
                      strokeDasharray={isVirtual ? '4 3' : 'none'}
                    />
                    <polygon
                      points={
                        isInverted
                          ? `${imgX - 6},${imgTopY - 10} ${imgX + 6},${imgTopY - 10} ${imgX},${imgTopY}`
                          : `${imgX - 6},${imgTopY + 10} ${imgX + 6},${imgTopY + 10} ${imgX},${imgTopY}`
                      }
                      fill={isReal ? '#f59e0b' : '#06b6d4'}
                    />
                  </g>
                )}

                <text
                  x={imgX - 24}
                  y={isInverted ? imgTopY + 16 : imgTopY - 8}
                  fill={isReal ? '#f59e0b' : '#06b6d4'}
                  fontSize="10"
                  fontWeight="bold"
                >
                  {isVirtual ? 'Sanal Görüntü' : 'Gerçek Görüntü'}
                  {isHalfBlocked ? ' (Soluk)' : ''}
                </text>
              </g>
            )}

            {/* ════════════════════════════════════════════════════════════════ */}
            {/* ── DRAGGABLE TRANSPARENT RULER TOOL (PhET Inspiration) ── */}
            {/* ════════════════════════════════════════════════════════════════ */}
            {showRuler && (
              <g
                className="cursor-move"
                transform={`translate(${rulerPos.x}, ${rulerPos.y})`}
                onPointerDown={(e) => handlePointerDown(e, 'ruler')}
              >
                {/* Frosted Ruler Background */}
                <rect
                  x="0"
                  y="0"
                  width={rulerVertical ? 38 : 220}
                  height={rulerVertical ? 220 : 38}
                  rx="6"
                  fill="#fef08a"
                  fillOpacity="0.25"
                  stroke="#facc15"
                  strokeWidth="1.5"
                  style={{ backdropFilter: 'blur(4px)' }}
                />

                {/* Ruler Drag Header Indicator */}
                <rect
                  x="2"
                  y="2"
                  width={rulerVertical ? 34 : 20}
                  height={rulerVertical ? 16 : 34}
                  rx="4"
                  fill="#facc15"
                  fillOpacity="0.6"
                />
                <text
                  x={rulerVertical ? 19 : 10}
                  y={rulerVertical ? 12 : 21}
                  fill="#78350f"
                  fontSize="8"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  px
                </text>

                {/* Graduation Marks */}
                {!rulerVertical ? (
                  /* Horizontal Ruler Graduations */
                  <>
                    {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200].map((tick) => (
                      <g key={tick} transform={`translate(${tick + 10}, 0)`}>
                        <line x1="0" y1="0" x2="0" y2="12" stroke="#fef08a" strokeWidth="1.2" />
                        <text x="0" y="24" fill="#fef08a" fontSize="8" textAnchor="middle" fontFamily="monospace">
                          {tick}
                        </text>
                      </g>
                    ))}
                    {/* Intermediate small ticks */}
                    {[10, 30, 50, 70, 90, 110, 130, 150, 170, 190].map((tick) => (
                      <line
                        key={tick}
                        x1={tick + 10}
                        y1="0"
                        x2={tick + 10}
                        y2="6"
                        stroke="#fef08a"
                        strokeWidth="0.8"
                        strokeOpacity="0.7"
                      />
                    ))}
                  </>
                ) : (
                  /* Vertical Ruler Graduations */
                  <>
                    {[0, 20, 40, 60, 80, 100, 120, 140, 160, 180, 200].map((tick) => (
                      <g key={tick} transform={`translate(0, ${tick + 10})`}>
                        <line x1="0" y1="0" x2="12" y2="0" stroke="#fef08a" strokeWidth="1.2" />
                        <text x="24" y="3" fill="#fef08a" fontSize="8" textAnchor="middle" fontFamily="monospace">
                          {tick}
                        </text>
                      </g>
                    ))}
                  </>
                )}
              </g>
            )}
          </svg>
        </div>

        {/* ── Alt Bar: Cetvel Yönü & Hızlı Yardım ── */}
        {showRuler && (
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Sarı şeffaf cetveli ekranda istediğiniz yere sürükleyerek mesafe veya cisim boyunu ölçebilirsiniz.</span>
            </div>
            <button
              onClick={() => setRulerVertical(!rulerVertical)}
              className="px-2.5 py-1 rounded-lg bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 transition-all cursor-pointer text-[11px]"
            >
              {rulerVertical ? 'Yatay Cetvele Geç' : 'Dikey Cetvele Geç'}
            </button>
          </div>
        )}

        {/* ── İnteraktif Hassas Kaydırıcılar (Sliders) ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* Cisim Mesafesi Slider */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold">Cisim Mesafesi (dc):</span>
              <span className="font-mono text-emerald-400 font-bold">{objectDistance} px</span>
            </div>
            <input
              type="range"
              min="30"
              max="240"
              step="5"
              value={objectDistance}
              onChange={(e) => setObjectDistance(parseInt(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>30 px</span>
              <span>120 px</span>
              <span>240 px</span>
            </div>
          </div>

          {/* Odak Uzaklığı Slider */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold">Odak Uzaklığı (f):</span>
              <span className="font-mono text-amber-400 font-bold">{focalLength} px</span>
            </div>
            <input
              type="range"
              min="35"
              max="115"
              step="5"
              value={focalLength}
              onChange={(e) => setFocalLength(parseInt(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>35 px</span>
              <span>75 px</span>
              <span>115 px</span>
            </div>
          </div>

          {/* Cisim Boyu Slider */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="font-semibold">Cisim Boyu (hc):</span>
              <span className="font-mono text-sky-400 font-bold">{objectHeight} px</span>
            </div>
            <input
              type="range"
              min="15"
              max="75"
              step="5"
              value={objectHeight}
              onChange={(e) => setObjectHeight(parseInt(e.target.value))}
              className="w-full accent-sky-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>15 px</span>
              <span>45 px</span>
              <span>75 px</span>
            </div>
          </div>
        </div>

        {/* ── Canlı Parametre & Optik Tablosu ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-medium">Görüntü Konumu (dg)</div>
            <div className="text-sm font-bold font-mono text-amber-300 mt-0.5">
              {isInfinity ? 'Sonsuz' : `${imageDistance > 0 ? '+' : ''}${imageDistance.toFixed(1)} px`}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-medium">Büyütme Oranı (m)</div>
            <div className="text-sm font-bold font-mono text-cyan-300 mt-0.5">
              {isInfinity ? '—' : `${magnification.toFixed(2)}x`}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-medium">Görüntü Niteliği</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {isInfinity ? 'Sonsuzda' : isReal ? 'Gerçek (Perdeye Düşer)' : 'Sanal (Gözle Görülür)'}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-medium">Yön ve Boyut</div>
            <div className="text-sm font-bold text-white mt-0.5">
              {isInfinity
                ? 'Tanımsız'
                : `${isInverted ? 'Ters' : 'Düz'}, ${
                    Math.abs(magnification) > 1.05
                      ? 'Büyük'
                      : Math.abs(magnification) < 0.95
                      ? 'Küçük'
                      : 'Eşit'
                  }`}
            </div>
          </div>
        </div>

        {/* ── ÖSYM Altın Optik Kuralları (Hap Bilgiler & Soru Tuzakları) ── */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-900 border border-amber-500/30 text-xs text-amber-100 leading-relaxed space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>MEB & Türkiye Yüzyılı Maarif Modeli Optik Hap Bilgileri:</span>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-slate-300 list-disc list-inside">
            <li>
              <strong className="text-white">Gerçek Görüntü:</strong> Işınların kendisi kesişir, daima{' '}
              <strong className="text-amber-300">terstir</strong> ve ancak bir perde üzerine düşürülerek görülebilir.
            </li>
            <li>
              <strong className="text-white">Sanal Görüntü:</strong> Işınların uzantıları kesişir, daima{' '}
              <strong className="text-cyan-300">düzdür</strong>. Büyüteç ve mikroskop çalışma mantığıdır.
            </li>
            <li>
              <strong className="text-white">ÖSYM Tuzağı (Merceğin Kapatılması):</strong> Merceğin yarısı kapatılsa bile görüntü kaybolmaz, tam kalır! Yalnızca toplanan ışık azaldığı için{' '}
              <strong className="text-amber-300">görüntü parlaklığı yarıya düşer</strong>.
            </li>
            <li>
              <strong className="text-white">Kalın Kenarlı Mercek:</strong> Cisim nerede olursa olsun görüntü daima{' '}
              <strong className="text-white">odak ile mercek arasında, sanal, düz ve küçük</strong> oluşur!
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
