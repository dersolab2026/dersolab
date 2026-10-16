'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Sun,
  Droplet,
  Flame,
  Wind,
  Sparkles,
  Sliders,
  RotateCcw,
  Activity,
  HelpCircle,
} from 'lucide-react'

type LightColor = 'white' | 'blue' | 'green' | 'red'

interface Bubble {
  id: number
  x: number
  y: number
  speed: number
}

export function PhotosynthesisModule() {
  const [lightColor, setLightColor] = useState<LightColor>('white')
  const [lightIntensity, setLightIntensity] = useState<number>(600) // Lux (0 - 1000)
  const [co2Level, setCo2Level] = useState<number>(0.04) // % (0 - 0.1)
  const [temperatureC, setTemperatureC] = useState<number>(28) // °C (0 - 60)
  const [bubbles, setBubbles] = useState<Bubble[]>([])

  // Calculate photosynthesis rate factor (0 to 100%)
  // 1. Color factor (Engelman experiment)
  let colorFactor = 1.0
  if (lightColor === 'blue') colorFactor = 1.2
  else if (lightColor === 'red') colorFactor = 1.15
  else if (lightColor === 'green') colorFactor = 0.15
  else colorFactor = 1.0 // white

  // 2. Light intensity factor (saturates around 800)
  const lightFactor = Math.min(1.0, lightIntensity / 750)

  // 3. CO2 factor (saturates around 0.08%)
  const co2Factor = Math.min(1.0, co2Level / 0.06)

  // 4. Temperature factor (enzyme bell curve, peak at 30°C, zero above 50°C)
  let tempFactor = 0
  if (temperatureC < 5) tempFactor = 0.05
  else if (temperatureC <= 32) tempFactor = (temperatureC - 5) / 27
  else if (temperatureC <= 48) tempFactor = Math.max(0, 1 - (temperatureC - 32) / 16)
  else tempFactor = 0 // denatured enzymes

  // Overall Photosynthesis Rate (0 - 100)
  const rate = Math.round(
    Math.min(100, colorFactor * lightFactor * co2Factor * tempFactor * 100)
  )

  // Bubble count generator
  useEffect(() => {
    if (rate <= 0) {
      setBubbles([])
      return
    }

    const intervalMs = Math.max(120, 1500 - rate * 13)
    const timer = setInterval(() => {
      setBubbles((prev) => [
        ...prev.slice(-12),
        {
          id: Date.now() + Math.random(),
          x: 185 + (Math.random() - 0.5) * 20,
          y: 200,
          speed: 1.5 + Math.random() * 1.5,
        },
      ])
    }, intervalMs)

    return () => clearInterval(timer)
  }, [rate])

  // Move bubbles upward
  useEffect(() => {
    const moveTimer = setInterval(() => {
      setBubbles((prev) =>
        prev
          .map((b) => ({ ...b, y: b.y - b.speed }))
          .filter((b) => b.y > 60)
      )
    }, 40)

    return () => clearInterval(moveTimer)
  }, [])

  const lightGlowColor = {
    white: 'rgba(255, 255, 255, 0.25)',
    blue: 'rgba(59, 130, 246, 0.4)',
    green: 'rgba(34, 197, 94, 0.35)',
    red: 'rgba(239, 68, 68, 0.4)',
  }[lightColor]

  return (
    <div className="space-y-6">
      {/* ── Header Card ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              8. Sınıf LGS & 12. Sınıf AYT
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Fotosentez & Engelmann Işık Dalga Boyu Deneyi
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Elodea su bitkisinin fotosentez hızını; ışık rengi (mor/mavi, yeşil, kırmızı), ışık şiddeti, CO₂ miktarı ve sıcaklık parametrelerini değiştirerek çıkan oksijen kabarcıklarıyla canlı izleyin.
          </p>
        </div>

        {/* Live Rate Badge */}
        <div className="p-4 rounded-2xl bg-slate-950/90 border border-emerald-500/30 flex items-center gap-3">
          <Activity className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <div className="text-[11px] text-slate-400 font-semibold">Fotosentez Hızı (O₂ Çıkışı)</div>
            <div className="text-xl sm:text-2xl font-black text-emerald-300 font-mono">
              %{rate} <span className="text-xs font-normal text-slate-400">Verim</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Canvas & Controls Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Aquarium Tube Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="relative h-[360px] sm:h-[420px] w-full rounded-3xl bg-[#030712] border border-slate-800/90 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
            
            {/* Top Color Switcher */}
            <div className="flex items-center justify-between z-10">
              <span className="text-xs font-bold text-slate-300">Işık Spektrumu / Rengi:</span>
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800">
                {[
                  { id: 'white', label: 'Beyaz', bg: 'bg-white text-black' },
                  { id: 'blue', label: 'Mor/Mavi (~450nm)', bg: 'bg-blue-600 text-white' },
                  { id: 'green', label: 'Yeşil (~550nm)', bg: 'bg-emerald-600 text-white' },
                  { id: 'red', label: 'Kırmızı (~680nm)', bg: 'bg-rose-600 text-white' },
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setLightColor(c.id as LightColor)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                      lightColor === c.id ? `${c.bg} shadow-md` : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Experiment Graphic SVG */}
            <div className="relative flex-1 w-full flex items-center justify-center">
              <svg className="w-full h-full max-w-[440px]" viewBox="0 0 440 280">
                <defs>
                  <linearGradient id="waterGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0284c7" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0369a1" stopOpacity="0.6" />
                  </linearGradient>
                </defs>

                {/* Light Beam from top-left */}
                <polygon
                  points="20,20 80,20 280,260 100,260"
                  fill={lightGlowColor}
                  className="transition-colors duration-500"
                />

                {/* Glass Beaker / Test Tube */}
                <rect x="120" y="40" width="140" height="220" rx="8" fill="url(#waterGrad)" stroke="#475569" strokeWidth="3" />
                <line x1="120" y1="50" x2="260" y2="50" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,3" />
                <text x="190" y="45" fill="#38bdf8" fontSize="10" textAnchor="middle">Su Seviyesi</text>

                {/* Elodea Aquatic Plant in Water */}
                <g transform="translate(190, 250)">
                  {/* Stem */}
                  <path d="M 0 0 Q -10 -40, -5 -80 T 5 -140" fill="none" stroke="#16a34a" strokeWidth="4" />
                  {/* Leaves */}
                  {[-20, -50, -80, -110].map((y, idx) => (
                    <g key={idx}>
                      <ellipse cx="-16" cy={y} rx="12" ry="5" fill="#22c55e" transform={`rotate(-25, -16, ${y})`} />
                      <ellipse cx="16" cy={y - 8} rx="12" ry="5" fill="#22c55e" transform={`rotate(25, 16, ${y - 8})`} />
                    </g>
                  ))}
                  {/* Cut plant stem tip where bubbles emerge */}
                  <circle cx="5" cy="-140" r="4" fill="#86efac" />
                </g>

                {/* Animated Rising Oxygen Bubbles */}
                {bubbles.map((b) => (
                  <circle
                    key={b.id}
                    cx={b.x}
                    cy={b.y}
                    r={3.5}
                    fill="#38bdf8"
                    stroke="#ffffff"
                    strokeWidth="1"
                    opacity={0.85}
                  />
                ))}

                {/* Floating Gas Collection Inverted Funnel */}
                <path d="M 150 70 L 230 70 L 210 50 L 170 50 Z" fill="#334155" stroke="#64748b" strokeWidth="1.5" />
                <text x="190" y="32" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                  O₂ Gazı Toplama Tüpü
                </text>
              </svg>
            </div>

            {/* Bottom Realtime Verim Bar */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex items-center justify-between gap-4 z-10">
              <div className="flex-1">
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">Canlı Fotosentez Verimi:</span>
                  <span className="text-emerald-400 font-bold">%{rate}</span>
                </div>
                <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div
                    className="bg-emerald-500 h-full"
                    animate={{ width: `${rate}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Çevresel Değişkenler</span>
            </h3>

            {/* Light Intensity Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-400">Işık Şiddeti:</span>
                <span className="text-amber-400 font-bold">{lightIntensity} Lüks</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="50"
                value={lightIntensity}
                onChange={(e) => setLightIntensity(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            {/* Temperature Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-400">Ortam Sıcaklığı:</span>
                <span className={`font-bold ${temperatureC > 45 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {temperatureC}°C {temperatureC > 45 && '(Enzimler Denatüre!)'}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="1"
                value={temperatureC}
                onChange={(e) => setTemperatureC(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>0°C (Durgun)</span>
                <span>28-32°C (Optimum)</span>
                <span>55°C (Denatürasyon)</span>
              </div>
            </div>

            {/* CO2 Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-400">CO₂ Konsantrasyonu:</span>
                <span className="text-cyan-400 font-bold">%{co2Level.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.01"
                max="0.10"
                step="0.01"
                value={co2Level}
                onChange={(e) => setCo2Level(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>

          {/* Engelmann Deneyi Bilgi Kutusu */}
          <div className="p-4 rounded-3xl bg-slate-900/50 border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Engelmann Deneyi & AYT Soru Taktikleri</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
              <li>
                Klorofil pigmenti yeşil ışığı soğurmaz, yansıtır. Bu yüzden <strong>yeşil ışıkta fotosentez hızı en düşüktür</strong>.
              </li>
              <li>
                Fotosentez hızı en çok <strong>mor/mavi ve kırmızı</strong> ışıkta zirve yapar (aerobik bakteriler buralarda kümelenir).
              </li>
              <li>
                Sıcaklık 45-50°C üstüne çıktığında fotosentez reaksiyonlarını katalizleyen protein yapılı enzimler bozulur ve fotosentez tamamen durur.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
