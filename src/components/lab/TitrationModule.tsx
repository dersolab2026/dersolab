'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Droplet, CheckCircle2, Sliders, ArrowRight, Zap } from 'lucide-react'

// Chemically exact pH calculation using the quadratic water auto-ionization equation
function calculateExactPH(vBase: number): number {
  const vAcid = 25.0 // mL
  const mAcid = 0.1 // M (mol/L)
  const mBase = 0.1 // M (mol/L)

  const nAcid = (vAcid * mAcid) / 1000 // moles
  const nBase = (vBase * mBase) / 1000 // moles
  const vTotal = (vAcid + vBase) / 1000 // Liters

  const cDelta = (nAcid - nBase) / vTotal // mol/L excess H+ or OH-
  const Kw = 1.0e-14

  let hConc: number
  if (cDelta >= 0) {
    // Acid excess or exact equivalence
    hConc = (cDelta + Math.sqrt(cDelta * cDelta + 4 * Kw)) / 2
  } else {
    // Base excess
    const cb = -cDelta
    const ohConc = (cb + Math.sqrt(cb * cb + 4 * Kw)) / 2
    hConc = Kw / ohConc
  }

  const ph = -Math.log10(hConc)
  return Math.min(Math.max(ph, 1.0), 13.0)
}

export function TitrationModule() {
  const [addedBaseVolume, setAddedBaseVolume] = useState<number>(0) // 0 to 50 mL
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [flowSpeed, setFlowSpeed] = useState<number>(0.5) // mL per step

  // Chemically accurate current pH
  const currentPH = useMemo(() => calculateExactPH(addedBaseVolume), [addedBaseVolume])

  // Generate smooth curve points from 0 to 50 mL
  const curvePoints = useMemo(() => {
    const pts: { v: number; ph: number }[] = []
    for (let v = 0; v <= 50; v += 0.5) {
      pts.push({ v, ph: calculateExactPH(v) })
    }
    return pts
  }, [])

  // Continuous flow interval
  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      setAddedBaseVolume((prev) => {
        if (prev >= 50) {
          setIsRunning(false)
          return 50
        }
        const next = Math.min(prev + flowSpeed, 50)
        return Number(next.toFixed(1))
      })
    }, 180)

    return () => clearInterval(interval)
  }, [isRunning, flowSpeed])

  const handleSingleDrop = () => {
    if (addedBaseVolume >= 50) return
    setAddedBaseVolume((prev) => Number(Math.min(prev + 0.5, 50).toFixed(1)))
  }

  const handleReset = () => {
    setIsRunning(false)
    setAddedBaseVolume(0)
  }

  // Phenolphthalein color indicator
  // Colorless below pH 8.2, soft pink at 8.3-9.0, vibrant magenta/fuschia above 9.0
  const getIndicatorColor = (ph: number) => {
    if (ph < 8.2) return 'rgba(255, 255, 255, 0.08)' // clear colorless
    if (ph >= 8.2 && ph <= 9.2) {
      const alpha = 0.35 + ((ph - 8.2) / 1.0) * 0.45
      return `rgba(244, 63, 94, ${alpha})`
    }
    return 'rgba(225, 29, 72, 0.88)' // rich magenta
  }

  const isEquivalencePoint = Math.abs(addedBaseVolume - 25.0) < 0.2
  const isCloseToEquivalence = Math.abs(addedBaseVolume - 25.0) <= 1.0

  return (
    <div className="space-y-6">
      {/* ── Top Theory Banner ── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-800/40 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-500/30">
              AYT Kimya Laboratuvarı
            </span>
            <span className="text-xs text-slate-400">Kuvvetli Asit — Kuvvetli Baz Titrasyonu</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-white mt-1">
            25 mL 0.1 M HCl Çözeltisinin 0.1 M NaOH ile Titrasyonu
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Büret musluğunu açarak damla damla NaOH ekleyin veya sürgü ile hacmi kaydırın. 25 mL'de pH'ın aniden fırladığını ve indikatörün renginin şeffaftan pembeye döndüğünü görün.
          </p>
        </div>

        {/* Live pH Digital Gauge */}
        <div className="flex items-center gap-4 bg-slate-950/90 p-3.5 px-5 rounded-2xl border border-slate-800 shadow-xl self-stretch md:self-auto justify-between md:justify-start">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">pH Değeri</span>
            <div
              className="text-2xl font-black font-mono transition-colors duration-300"
              style={{
                color: currentPH >= 8.2 ? '#f43f5e' : currentPH < 6.8 ? '#38bdf8' : '#10b981',
              }}
            >
              {currentPH.toFixed(2)}
            </div>
          </div>
          <div className="h-9 w-px bg-slate-800 mx-1" />
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Eklenen NaOH</span>
            <div className="text-xl font-black text-white font-mono">{addedBaseVolume.toFixed(1)} mL</div>
          </div>
        </div>
      </div>

      {/* ── Main Interactive Section: Lab Bench on Left, Titration Curve on Right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Apparatus (Burette + Erlenmeyer) */}
        <div className="lg:col-span-6 bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-xl flex flex-col items-center justify-between min-h-[520px] relative overflow-hidden shadow-2xl">
          
          {/* Subtle Lab Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

          {/* Apparatus Stage */}
          <div className="relative flex flex-col items-center w-full max-w-xs my-2 z-10">
            
            {/* Stand Clip & Support Rod */}
            <div className="absolute -left-8 top-0 bottom-0 w-3 bg-gradient-to-r from-slate-600 via-slate-400 to-slate-700 rounded-full shadow-lg" />
            <div className="absolute -left-8 top-16 w-14 h-3 bg-slate-600 rounded-r-md shadow-md" />
            <div className="absolute -left-8 top-44 w-14 h-3 bg-slate-600 rounded-r-md shadow-md" />

            {/* 1. Burette (NaOH Holder) */}
            <div className="relative w-12 h-44 bg-slate-950/80 border-2 border-slate-500/80 rounded-t-lg rounded-b-sm overflow-hidden flex flex-col justify-end shadow-[inset_0_0_15px_rgba(255,255,255,0.06)]">
              {/* Burette Liquid Level */}
              <motion.div
                className="w-full bg-cyan-400/35 border-t-2 border-cyan-300/80 backdrop-blur-sm"
                animate={{ height: `${Math.max(8, ((50 - addedBaseVolume) / 50) * 100)}%` }}
                transition={{ duration: 0.15 }}
              />
              {/* Scale Marks */}
              <div className="absolute inset-y-0 right-1 flex flex-col justify-between py-2 pointer-events-none opacity-40">
                {[0, 10, 20, 30, 40, 50].map((val) => (
                  <div key={val} className="flex items-center gap-0.5 justify-end">
                    <span className="text-[7px] font-mono text-slate-300">{val}</span>
                    <div className="w-1.5 h-[1px] bg-white" />
                  </div>
                ))}
              </div>
            </div>

            {/* Burette Stopcock / Valve (Interactive & Rotating) */}
            <div className="w-5 h-6 bg-slate-700 relative flex items-center justify-center my-0.5 shadow-sm rounded-sm">
              <motion.button
                type="button"
                onClick={() => setIsRunning(!isRunning)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={{ rotate: isRunning ? 90 : 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`w-12 h-3.5 rounded-full cursor-pointer shadow-lg transition-colors flex items-center justify-center border border-white/20 ${
                  isRunning ? 'bg-emerald-500' : 'bg-rose-500'
                }`}
                title={isRunning ? 'Musluğu Kapat' : 'Musluğu Aç'}
              >
                <div className="w-1 h-2 bg-white rounded-full opacity-70" />
              </motion.button>
            </div>

            {/* Burette Tip (Nozzle) */}
            <div className="w-2 h-7 bg-slate-600 rounded-b-full relative flex justify-center">
              {/* Continuous Droplet Stream Animation */}
              {isRunning && (
                <motion.div
                  className="absolute top-1 w-2.5 h-3 bg-cyan-400 rounded-full shadow-[0_0_10px_#38bdf8]"
                  animate={{
                    top: [0, 40],
                    opacity: [1, 0.2],
                    scaleY: [1, 1.4],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.25,
                    ease: 'easeIn',
                  }}
                />
              )}
            </div>

            {/* 2. Erlenmeyer Flask */}
            <div className="relative mt-4 flex flex-col items-center">
              {/* Flask Neck */}
              <div className="w-12 h-8 bg-slate-950/70 border-x-2 border-t-2 border-slate-500/80 rounded-t-sm" />
              
              {/* Flask Body */}
              <div className="relative w-44 h-40 bg-slate-950/80 border-2 border-slate-500/80 rounded-b-3xl overflow-hidden flex flex-col justify-end shadow-2xl">
                {/* Internal Liquid inside Flask */}
                <motion.div
                  className="w-full transition-colors duration-400 relative flex items-center justify-center"
                  animate={{
                    height: `${Math.min(92, 38 + (addedBaseVolume / 50) * 48)}%`,
                    backgroundColor: getIndicatorColor(currentPH),
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Ripple wave when drop hits */}
                  {isRunning && (
                    <motion.div
                      className="absolute top-0 w-12 h-1.5 bg-white/40 rounded-full"
                      animate={{ scaleX: [0.3, 1.8], opacity: [0.8, 0] }}
                      transition={{ repeat: Infinity, duration: 0.35 }}
                    />
                  )}

                  {/* Liquid Surface wave line */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-white/25 backdrop-blur-sm" />
                  
                  {/* Indicator text label */}
                  <span className="text-[11px] font-bold text-white font-mono tracking-tight drop-shadow-md px-2 text-center">
                    {currentPH < 8.2 ? 'Şeffaf (pH < 8.2)' : 'Pembe İndikatör (Bazikleşti)'}
                  </span>
                </motion.div>
              </div>

              {/* Lab Stand Base */}
              <div className="w-52 h-4 bg-gradient-to-r from-slate-700 via-slate-500 to-slate-700 rounded-md shadow-2xl mt-1 border-t border-slate-400/40" />
            </div>
          </div>

          {/* ── Apparatus Controls & Volume Slider ── */}
          <div className="w-full pt-4 border-t border-slate-800/80 space-y-3 z-10">
            
            {/* Quick Interactive Slider for direct scrubbing */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1 font-semibold">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  Hassas Hacim Sürgüsü:
                </span>
                <span className="font-mono text-emerald-300 font-bold">{addedBaseVolume.toFixed(1)} / 50.0 mL</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                step="0.5"
                value={addedBaseVolume}
                onChange={(e) => {
                  setIsRunning(false)
                  setAddedBaseVolume(parseFloat(e.target.value))
                }}
                className="w-full accent-emerald-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>

            {/* Buttons Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsRunning(!isRunning)}
                  disabled={addedBaseVolume >= 50}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    isRunning
                      ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]'
                  }`}
                >
                  {isRunning ? (
                    <>
                      <Pause className="w-3.5 h-3.5 fill-current" />
                      <span>Musluğu Kapat</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Musluğu Aç (Akıt)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleSingleDrop}
                  disabled={isRunning || addedBaseVolume >= 50}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                >
                  <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                  <span>+0.5 mL Damla</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsRunning(false)
                    setAddedBaseVolume(25.0)
                  }}
                  className="px-2.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-colors cursor-pointer"
                  title="Tam 25 mL Eşdeğerlik Noktasına Zıpla"
                >
                  25 mL (Dönüm)
                </button>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Sıfırla</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: Real-time Titration Curve (SVG Chart) & Sınav Notu */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Titration Curve Chart Card */}
          <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <h3 className="text-sm font-bold text-white">Canlı Titrasyon Eğrisi (pH vs V)</h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 font-bold">
                Eşdeğerlik: V = 25 mL, pH = 7.00
              </span>
            </div>

            {/* SVG Plot */}
            <div className="relative w-full h-56 bg-slate-950/90 rounded-2xl p-4 border border-slate-800 flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full" viewBox="0 0 300 160">
                {/* Horizontal Grid lines */}
                <line x1="30" y1="20" x2="280" y2="20" stroke="#334155" strokeDasharray="3 3" />
                <line x1="30" y1="80" x2="280" y2="80" stroke="#334155" strokeDasharray="3 3" />
                <line x1="30" y1="140" x2="280" y2="140" stroke="#334155" strokeDasharray="3 3" />

                {/* Y-Axis Labels */}
                <text x="5" y="24" fill="#94a3b8" fontSize="9" fontFamily="monospace">14</text>
                <text x="10" y="84" fill="#10b981" fontSize="9" fontWeight="bold" fontFamily="monospace">7</text>
                <text x="10" y="144" fill="#94a3b8" fontSize="9" fontFamily="monospace">0</text>

                {/* Equivalence Vertical Line (V = 25 mL) */}
                {/* 25 mL maps to x = 30 + (25/50)*250 = 155 */}
                <line x1="155" y1="10" x2="155" y2="145" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
                <text x="132" y="156" fill="#10b981" fontSize="8" fontWeight="bold">25 mL (Dönüm)</text>

                {/* Full Theoretical S-Curve (Background guideline) */}
                <path
                  d={curvePoints
                    .map((pt, i) => {
                      const x = 30 + (pt.v / 50) * 250
                      const y = 140 - (pt.ph / 14) * 120
                      return `${i === 0 ? 'M' : 'L'} ${x},${y}`
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#334155"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />

                {/* Filled Active Segment up to current addedBaseVolume */}
                <path
                  d={curvePoints
                    .filter((pt) => pt.v <= addedBaseVolume)
                    .concat([{ v: addedBaseVolume, ph: currentPH }])
                    .map((pt, i) => {
                      const x = 30 + (pt.v / 50) * 250
                      const y = 140 - (pt.ph / 14) * 120
                      return `${i === 0 ? 'M' : 'L'} ${x},${y}`
                    })
                    .join(' ')}
                  fill="none"
                  stroke="#06b6d4"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Current Active Dot */}
                {(() => {
                  const currX = 30 + (addedBaseVolume / 50) * 250
                  const currY = 140 - (currentPH / 14) * 120
                  return (
                    <circle
                      cx={currX}
                      cy={currY}
                      r="6"
                      fill={currentPH >= 8.2 ? '#f43f5e' : '#38bdf8'}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />
                  )
                })()}
              </svg>
            </div>

            {/* Status breakdown bar */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-300 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span>Hacim: {addedBaseVolume.toFixed(1)} / 50 mL</span>
              <span className={`font-bold ${currentPH > 7.5 ? 'text-rose-400' : currentPH < 6.5 ? 'text-cyan-400' : 'text-emerald-400'}`}>
                {currentPH < 6.8 ? 'Asit Baskın (HCl Fazlası)' : isEquivalencePoint ? 'TAM NÖTRLEŞME (Tuz + Su)' : 'Baz Baskın (NaOH Fazlası)'}
              </span>
            </div>
          </div>

          {/* ── Eşdeğerlik Başarı / Sınav Formülü Kartı ── */}
          <div className={`p-5 rounded-3xl border transition-all duration-300 ${
            isEquivalencePoint
              ? 'bg-emerald-950/50 border-emerald-400 shadow-[0_0_35px_rgba(16,185,129,0.3)]'
              : 'bg-slate-900/60 border-slate-800/80'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2.5 rounded-2xl ${
                isEquivalencePoint ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
              }`}>
                {isEquivalencePoint ? <CheckCircle2 className="w-5 h-5" /> : <Droplet className="w-5 h-5" />}
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>ÖSYM Titrasyon Formülü</span>
                  {isEquivalencePoint && (
                    <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-2 py-0.5 rounded-full animate-bounce">
                      Tam Eşdeğerlik Noktası! (pH = 7.0)
                    </span>
                  )}
                </h4>
                <div className="font-mono text-emerald-300 text-xs font-bold py-1">
                  M(asit) × V(asit) × T(asit) = M(baz) × V(baz) × T(baz)
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Tesir değerlikleri 1 olduğundan: <code className="text-slate-200">0.1 M × 25 mL = 0.1 M × V(baz)</code> bağıntısından dönüm noktası hacmi tam olarak <strong>25.0 mL</strong> bulunur.
                </p>
              </div>
            </div>
          </div>

          {/* Teacher Consultation */}
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-300">Asit-baz dengesinde takıldığın yerleri çöz</span>
            <Link
              href="/instructors?subject=Kimya"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Kimya Öğretmenlerini Gör</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
