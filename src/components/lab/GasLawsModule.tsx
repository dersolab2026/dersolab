'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import {
  Flame,
  Snowflake,
  Wind,
  Gauge,
  Sliders,
  Sparkles,
  RotateCcw,
  Play,
  Pause,
  HelpCircle,
  TrendingUp,
} from 'lucide-react'

type LawMode = 'boyle' | 'charles' | 'gay_lussac' | 'ideal'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
}

export function GasLawsModule() {
  const [lawMode, setLawMode] = useState<LawMode>('ideal')
  const [temperatureC, setTemperatureC] = useState<number>(27) // °C -> 300 K
  const [volumeLiters, setVolumeLiters] = useState<number>(5.0) // L (2 - 10)
  const [moles, setMoles] = useState<number>(1.0) // mol (0.5 - 3)
  const [isPlaying, setIsPlaying] = useState<boolean>(true)

  const R = 0.0821 // atm · L / (mol · K)
  const temperatureK = temperatureC + 273.15

  // P = (n * R * T) / V
  const pressureAtm = (moles * R * temperatureK) / volumeLiters

  // Thermal velocity factor: v ~ sqrt(T)
  const speedFactor = Math.sqrt(temperatureK / 300)

  // Canvas particle animation
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const particlesRef = useRef<Particle[]>([])

  // Initialize particles
  useEffect(() => {
    const count = Math.round(moles * 40)
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x: 30 + Math.random() * 200,
        y: 40 + Math.random() * 140,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
      })
    }
    particlesRef.current = newParticles
  }, [moles])

  // Animation frame loop
  useEffect(() => {
    let animId: number
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Container bounds
      const containerLeft = 50
      const containerRight = 350
      const containerBottom = 240
      // Piston height depends on volume (2L to 10L maps to height from 200 down to 40)
      const pistonY = 240 - ((volumeLiters - 1.5) / 9) * 190

      // Draw container walls
      ctx.strokeStyle = '#475569'
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(containerLeft, 20)
      ctx.lineTo(containerLeft, containerBottom)
      ctx.lineTo(containerRight, containerBottom)
      ctx.lineTo(containerRight, 20)
      ctx.stroke()

      // Draw movable piston
      ctx.fillStyle = '#1e293b'
      ctx.strokeStyle = '#38bdf8'
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.roundRect(containerLeft + 2, pistonY - 14, containerRight - containerLeft - 4, 16, 4)
      ctx.fill()
      ctx.stroke()

      // Piston handle shaft
      ctx.fillStyle = '#64748b'
      ctx.fillRect((containerLeft + containerRight) / 2 - 6, 10, 12, pistonY - 20)

      // Burner flame below container if T > 27°C
      if (temperatureC > 27) {
        const flameHeight = Math.min(30, (temperatureC - 27) * 0.4)
        ctx.fillStyle = '#f97316'
        ctx.beginPath()
        ctx.moveTo(containerLeft + 40, containerBottom + 12)
        ctx.quadraticCurveTo(200, containerBottom + 12 + flameHeight, containerRight - 40, containerBottom + 12)
        ctx.fill()
      }

      // Update and draw gas particles
      ctx.fillStyle = temperatureC > 100 ? '#f87171' : temperatureC < 0 ? '#38bdf8' : '#60a5fa'

      particlesRef.current.forEach((p) => {
        if (isPlaying) {
          p.x += p.vx * speedFactor
          p.y += p.vy * speedFactor

          // Collisions with walls
          if (p.x <= containerLeft + 6) {
            p.x = containerLeft + 6
            p.vx = -p.vx
          }
          if (p.x >= containerRight - 6) {
            p.x = containerRight - 6
            p.vx = -p.vx
          }
          if (p.y >= containerBottom - 6) {
            p.y = containerBottom - 6
            p.vy = -p.vy
          }
          if (p.y <= pistonY + 6) {
            p.y = pistonY + 6
            p.vy = -p.vy
          }
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
        ctx.fill()
      })

      animId = requestAnimationFrame(render)
    }

    animId = requestAnimationFrame(render)
    return () => cancelAnimationFrame(animId)
  }, [volumeLiters, temperatureC, speedFactor, isPlaying])

  const handleReset = () => {
    setTemperatureC(27)
    setVolumeLiters(5.0)
    setMoles(1.0)
  }

  return (
    <div className="space-y-6">
      {/* ── Header Card ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
              11. Sınıf Kimya & 8. Sınıf Gaz Basıncı
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              P · V = n · R · T
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            İdeal Gaz Yasaları & Hareketli Piston Laboratuvarı
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Sürtünmesiz pistonlu kapta hacim (V), sıcaklık (T), mol sayısı (n) ve basınç (P) ilişkilerini; Boyle, Charles ve Gay-Lussac gaz yasalarını canlı tanecik çarpışmalarıyla keşfedin.
          </p>
        </div>

        {/* Live Pressure Gauge */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-cyan-500/30 flex items-center gap-3">
          <Gauge className="w-6 h-6 text-cyan-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-400 font-semibold">İç Gaz Basıncı (P)</div>
            <div className="text-xl sm:text-2xl font-black text-cyan-300 font-mono">
              {pressureAtm.toFixed(2)} <span className="text-xs font-normal text-slate-400">atm</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Canvas & Controls Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Piston Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="relative h-[360px] sm:h-[420px] w-full rounded-3xl bg-[#030712] border border-slate-800/90 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isPlaying
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  }`}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  <span>{isPlaying ? 'Durdur' : 'Canlandır'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Standart Koşullara Sıfırla (27°C, 5L, 1 mol)"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              {/* Gas State Tag */}
              <div className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tanecik Hızı: <strong>{(speedFactor * 480).toFixed(0)} m/s</strong></span>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="relative flex-1 w-full flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={400}
                height={260}
                className="w-full h-full max-w-[420px] object-contain"
              />
            </div>

            {/* Bottom Live Values Grid */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 bg-slate-950/70 p-2.5 rounded-2xl z-10">
              <div className="text-center">
                <div className="text-[10px] text-slate-400 font-semibold">Basınç (P)</div>
                <div className="text-sm sm:text-base font-extrabold text-cyan-400 font-mono">
                  {pressureAtm.toFixed(2)} atm
                </div>
              </div>
              <div className="text-center border-l border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold">Hacim (V)</div>
                <div className="text-sm sm:text-base font-extrabold text-blue-400 font-mono">
                  {volumeLiters.toFixed(1)} L
                </div>
              </div>
              <div className="text-center border-l border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold">Sıcaklık (T)</div>
                <div className="text-sm sm:text-base font-extrabold text-amber-400 font-mono">
                  {temperatureK.toFixed(1)} K
                </div>
              </div>
              <div className="text-center border-l border-slate-800">
                <div className="text-[10px] text-slate-400 font-semibold">Mol (n)</div>
                <div className="text-sm sm:text-base font-extrabold text-emerald-400 font-mono">
                  {moles.toFixed(2)} mol
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Gaz Değişkenlerini Ayarla</span>
            </h3>

            {/* Volume Slider (V) */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-400">Piston Konumu / Hacim (V):</span>
                <span className="text-blue-400 font-bold">{volumeLiters.toFixed(1)} Litre</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="10.0"
                step="0.5"
                value={volumeLiters}
                onChange={(e) => setVolumeLiters(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            {/* Temperature Slider (T) */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-400">Sıcaklık (T):</span>
                <span className="text-amber-400 font-bold">
                  {temperatureC}°C ({temperatureK.toFixed(0)} K)
                </span>
              </div>
              <input
                type="range"
                min="-50"
                max="300"
                step="5"
                value={temperatureC}
                onChange={(e) => setTemperatureC(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>Dondurucu (-50°C)</span>
                <span>Oda Sıcaklığı (27°C)</span>
                <span>Yüksek Isı (300°C)</span>
              </div>
            </div>

            {/* Mole Slider (n) */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-400">Madde Miktarı / Mol Sayısı (n):</span>
                <span className="text-emerald-400 font-bold">{moles.toFixed(2)} mol</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={moles}
                onChange={(e) => setMoles(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>

          {/* Gaz Yasaları Bilgi Kutusu */}
          <div className="p-4 rounded-3xl bg-slate-900/50 border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Gaz Yasaları & YKS Özetleri</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-slate-400 font-bold">Boyle Yasası:</div>
                <div className="text-slate-300">P · V = sabit (T, n sabit)</div>
                <div className="text-[10px] text-cyan-400">Hacim küçülürse basınç artar</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-slate-400 font-bold">Charles Yasası:</div>
                <div className="text-slate-300">V / T = sabit (P, n sabit)</div>
                <div className="text-[10px] text-amber-400">Isınan gaz genleşir</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-slate-400 font-bold">Gay-Lussac:</div>
                <div className="text-slate-300">P / T = sabit (V, n sabit)</div>
                <div className="text-[10px] text-rose-400">Sıcaklık arttıkça basınç fırlar</div>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="text-slate-400 font-bold">Avogadro:</div>
                <div className="text-slate-300">V / n = sabit (P, T sabit)</div>
                <div className="text-[10px] text-emerald-400">1 mol gaz N.Ş.A. 22.4 L</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
