'use client'

import React, { useRef, useState, useEffect, useCallback } from 'react'
import {
  Pencil,
  Highlighter,
  Eraser,
  Trash2,
  Image as ImageIcon,
  Grid,
  X,
  Undo2,
} from 'lucide-react'

export interface WhiteboardStroke {
  id: string
  tool: 'pen' | 'highlighter' | 'eraser'
  color: string
  size: number
  points: Array<{ x: number; y: number }>
}

export type WhiteboardGridMode = 'notebook' | 'dots' | 'axes' | 'blank'

interface SharedWhiteboardPanelProps {
  strokes: WhiteboardStroke[]
  bgImage: string | null
  gridMode: WhiteboardGridMode
  onAddStroke: (stroke: WhiteboardStroke) => void
  onUndoStroke: () => void
  onClearBoard: () => void
  onChangeBgImage: (dataUrl: string | null) => void
  onChangeGridMode: (mode: WhiteboardGridMode) => void
  onClose?: () => void
}

const LIGHT_COLORS = [
  { label: 'Kırmızı Kalem', value: '#e11d48' },
  { label: 'Lacivert Mürekkep', value: '#0f172a' },
  { label: 'Kobalt Mavi', value: '#0284c7' },
  { label: 'Zümrüt Yeşil', value: '#16a34a' },
  { label: 'Turuncu Vurgu', value: '#ea580c' },
]

const DARK_COLORS = [
  { label: 'Turkuaz', value: '#22d3ee' },
  { label: 'Kehribar', value: '#f59e0b' },
  { label: 'Zümrüt', value: '#10b981' },
  { label: 'Mercan', value: '#f43f5e' },
  { label: 'Beyaz', value: '#ffffff' },
]

const GRID_MODE_LABELS: Record<WhiteboardGridMode, string> = {
  notebook: 'Çizgili Defter (Açık)',
  blank: 'Beyaz Tahta',
  dots: 'Koyu Noktalı',
  axes: 'Koordinat (x-y)',
}

const NEXT_GRID_MODE: Record<WhiteboardGridMode, WhiteboardGridMode> = {
  notebook: 'blank',
  blank: 'dots',
  dots: 'axes',
  axes: 'notebook',
}

export function SharedWhiteboardPanel({
  strokes,
  bgImage,
  gridMode,
  onAddStroke,
  onUndoStroke,
  onClearBoard,
  onChangeBgImage,
  onChangeGridMode,
  onClose,
}: SharedWhiteboardPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const isLightPaper = gridMode === 'notebook' || gridMode === 'blank'
  const palette = isLightPaper ? LIGHT_COLORS : DARK_COLORS

  const [tool, setTool] = useState<'pen' | 'highlighter' | 'eraser'>('pen')
  const [color, setColor] = useState('#e11d48')
  const [size, setSize] = useState(3.5)
  const [isDrawing, setIsDrawing] = useState(false)
  const currentPointsRef = useRef<Array<{ x: number; y: number }>>([])

  // Switch default pen color smoothly when flipping between light notebook paper and dark board
  useEffect(() => {
    if (isLightPaper && (color === '#ffffff' || color === '#22d3ee')) {
      setColor('#e11d48')
    } else if (!isLightPaper && (color === '#0f172a' || color === '#e11d48')) {
      setColor('#22d3ee')
    }
  }, [isLightPaper, color])

  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const w = canvas.width
    const h = canvas.height
    ctx.clearRect(0, 0, w, h)

    // Coordinate Axes if enabled
    if (gridMode === 'axes') {
      ctx.save()
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.28)'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.moveTo(w / 2, 0)
      ctx.lineTo(w / 2, h)
      ctx.moveTo(0, h / 2)
      ctx.lineTo(w, h / 2)
      ctx.stroke()
      ctx.restore()
    }

    // Draw all strokes
    for (const s of strokes) {
      if (s.points.length < 2) continue
      ctx.save()
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      if (s.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out'
        ctx.lineWidth = s.size * 6
        ctx.strokeStyle = 'rgba(0,0,0,1)'
      } else if (s.tool === 'highlighter') {
        ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = 0.32
        ctx.lineWidth = s.size * 4.5
        ctx.strokeStyle = s.color
      } else {
        ctx.globalCompositeOperation = 'source-over'
        ctx.globalAlpha = 1
        ctx.lineWidth = s.size
        ctx.strokeStyle = s.color
      }

      ctx.beginPath()
      ctx.moveTo(s.points[0].x * w, s.points[0].y * h)
      for (let i = 1; i < s.points.length; i++) {
        ctx.lineTo(s.points[i].x * w, s.points[i].y * h)
      }
      ctx.stroke()
      ctx.restore()
    }
  }, [strokes, gridMode])

  useEffect(() => {
    redrawCanvas()
  }, [redrawCanvas])

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas || !canvas.parentElement) return
      canvas.width = canvas.parentElement.clientWidth
      canvas.height = canvas.parentElement.clientHeight
      redrawCanvas()
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [redrawCanvas])

  const getNormalizedPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    return {
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)),
    }
  }

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setIsDrawing(true)
    const pt = getNormalizedPoint(e)
    currentPointsRef.current = [pt]
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const pt = getNormalizedPoint(e)
    currentPointsRef.current.push(pt)

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const pts = currentPointsRef.current
    if (pts.length < 2) return
    const prev = pts[pts.length - 2]
    const curr = pts[pts.length - 1]

    ctx.save()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = size * 6
      ctx.strokeStyle = 'rgba(0,0,0,1)'
    } else if (tool === 'highlighter') {
      ctx.globalAlpha = 0.32
      ctx.lineWidth = size * 4.5
      ctx.strokeStyle = color
    } else {
      ctx.lineWidth = size
      ctx.strokeStyle = color
    }
    ctx.beginPath()
    ctx.moveTo(prev.x * canvas.width, prev.y * canvas.height)
    ctx.lineTo(curr.x * canvas.width, curr.y * canvas.height)
    ctx.stroke()
    ctx.restore()
  }

  const handlePointerUp = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    if (currentPointsRef.current.length >= 2) {
      onAddStroke({
        id: `st-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        tool,
        color,
        size,
        points: currentPointsRef.current,
      })
    }
    currentPointsRef.current = []
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      if (dataUrl) onChangeBgImage(dataUrl)
    }
    reader.readAsDataURL(file)
  }

  const paperStyle: React.CSSProperties =
    gridMode === 'notebook'
      ? {
          backgroundColor: '#f8fafc',
          backgroundImage:
            'linear-gradient(90deg, transparent 78px, rgba(226, 232, 240, 0.95) 78px, rgba(226, 232, 240, 0.95) 81px, transparent 81px), repeating-linear-gradient(180deg, #f8fafc 0px, #f8fafc 37px, rgba(186, 230, 253, 0.85) 37px, rgba(186, 230, 253, 0.85) 39px)',
        }
      : gridMode === 'blank'
        ? {
            backgroundColor: '#ffffff',
          }
        : gridMode === 'dots'
          ? {
              backgroundColor: '#080B11',
              backgroundImage: 'radial-gradient(rgba(148, 163, 184, 0.22) 1.2px, transparent 1.2px)',
              backgroundSize: '22px 22px',
            }
          : {
              backgroundColor: '#080B11',
              backgroundImage:
                'linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }

  return (
    <div className="w-full h-full flex flex-col select-none">
      {/* Üst Araç Çubuğu (OpenBoard Stüdyo Stili) */}
      <div className="px-3.5 py-2 bg-[#0f172a]/95 border-b border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setTool('pen')}
            className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
              tool === 'pen'
                ? 'bg-cyan-400 text-slate-950 shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Pencil className="w-3.5 h-3.5" />
            <span>Kalem</span>
          </button>

          <button
            type="button"
            onClick={() => setTool('highlighter')}
            className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
              tool === 'highlighter'
                ? 'bg-amber-400 text-slate-950 shadow-[0_0_12px_rgba(251,191,36,0.4)]'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Highlighter className="w-3.5 h-3.5" />
            <span>Fosforlu</span>
          </button>

          <button
            type="button"
            onClick={() => setTool('eraser')}
            className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
              tool === 'eraser'
                ? 'bg-rose-500 text-white'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Silgi</span>
          </button>

          <div className="h-4 w-px bg-white/10 mx-1" />

          {/* Renk Seçici */}
          <div className="flex items-center gap-1.5">
            {palette.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => {
                  setColor(c.value)
                  if (tool === 'eraser') setTool('pen')
                }}
                title={c.label}
                className={`w-5 h-5 rounded-full border-2 transition-transform ${
                  color === c.value && tool !== 'eraser'
                    ? 'border-white scale-115 ring-2 ring-cyan-400/50'
                    : 'border-white/20 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
          </div>

          <div className="h-4 w-px bg-white/10 mx-1" />

          {/* Kalınlık Seçici */}
          <div className="hidden sm:flex items-center gap-1 bg-white/5 rounded-lg p-0.5 border border-white/10">
            {[
              { label: 'İnce', val: 2.5 },
              { label: 'Orta', val: 4 },
              { label: 'Kalın', val: 6.5 },
            ].map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => setSize(s.val)}
                className={`px-2 py-1 rounded-md text-[11px] font-bold transition-all ${
                  size === s.val ? 'bg-white/15 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-white/10 mx-1 hidden sm:block" />

          {/* Soru Fotoğrafı Yükle */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1"
            title="Soru fotoğrafı yükle ve üzerinde birlikte çöz"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Soru Yansıt</span>
          </button>

          {bgImage && (
            <button
              type="button"
              onClick={() => onChangeBgImage(null)}
              className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-[11px] font-bold"
            >
              Görseli Kaldır
            </button>
          )}

          <button
            type="button"
            onClick={() => onChangeGridMode(NEXT_GRID_MODE[gridMode])}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-bold flex items-center gap-1"
            title="Kağıt / Tahta Zemini Değiştir"
          >
            <Grid className="w-3.5 h-3.5 text-cyan-400" />
            <span>{GRID_MODE_LABELS[gridMode]}</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onUndoStroke}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
            title="Son Çizimi Geri Al"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={onClearBoard}
            className="p-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 text-red-300"
            title="Tahtayı Temizle"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              title="Tam Kamera Görünümüne Geç"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Çizim Alanı */}
      <div className="relative flex-1 w-full h-full overflow-hidden transition-colors" style={paperStyle}>
        {bgImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bgImage}
            alt="Yansıtılan soru"
            className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] object-contain pointer-events-none select-none opacity-95"
          />
        )}

        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="absolute inset-0 w-full h-full touch-none cursor-crosshair"
        />
      </div>
    </div>
  )
}
