'use client'

import React, { useState, useEffect } from 'react'
import {
  Zap,
  FlaskConical,
  RotateCcw,
  Plus,
  Trash2,
  Sliders,
  Thermometer,
  Gauge,
  Sparkles,
  Play,
  Pause,
  AlertTriangle,
} from 'lucide-react'
import {
  playClickSound,
  playSwitchSound,
  playChemicalReaction,
  playSuccessFanfare,
} from '@/lib/soundFx'

type SandboxMode = 'circuit' | 'chemistry'

interface CircuitComponent {
  id: string
  type: 'battery' | 'bulb' | 'resistor' | 'switch' | 'meter'
  label: string
  value?: number
  state?: boolean
  x: number
  y: number
}

export function InteractiveLabSandbox() {
  const [mode, setMode] = useState<SandboxMode>('circuit')

  // ── Circuit Sandbox State ──
  const [batteryVoltage, setBatteryVoltage] = useState(9) // V
  const [resistorValue, setResistorValue] = useState(15) // Ohm
  const [isSwitchClosed, setIsSwitchClosed] = useState(true)
  const [hasBulb, setHasBulb] = useState(true)
  const [wireColor, setWireColor] = useState<'gold' | 'cyan' | 'emerald'>('gold')

  // Calculated Circuit Metrics
  const totalResistance = (hasBulb ? 10 : 0) + resistorValue
  const currentAmp = isSwitchClosed && totalResistance > 0 ? batteryVoltage / totalResistance : 0
  const bulbPower = isSwitchClosed && hasBulb ? Math.pow(currentAmp, 2) * 10 : 0
  const isShortCircuit = isSwitchClosed && totalResistance <= 1

  // ── Chemistry Sandbox State ──
  const [beakerVolume, setBeakerVolume] = useState(100) // mL
  const [acidMoles, setAcidMoles] = useState(0) // mmol HCl
  const [baseMoles, setBaseMoles] = useState(0) // mmol NaOH
  const [hasIndicator, setHasIndicator] = useState(false)
  const [hasZinc, setHasZinc] = useState(false)
  const [temperature, setTemperature] = useState(22) // °C

  // Chemistry Calculations
  const netMoles = acidMoles - baseMoles
  const calculatedPH =
    netMoles > 0
      ? Math.max(1, +(7 - Math.log10(netMoles / beakerVolume + 1)).toFixed(1))
      : netMoles < 0
      ? Math.min(14, +(7 + Math.log10(Math.abs(netMoles) / beakerVolume + 1)).toFixed(1))
      : 7.0

  // Liquid Color determination
  let liquidColor = 'rgba(56, 189, 248, 0.25)' // clear water / pale cyan
  if (hasIndicator) {
    if (calculatedPH < 7) {
      liquidColor = 'rgba(251, 113, 133, 0.45)' // Red/Pink in acid with indicator
    } else if (calculatedPH > 8.2) {
      liquidColor = 'rgba(236, 72, 153, 0.75)' // Fuchsia pink with phenolphthalein in base
    } else {
      liquidColor = 'rgba(52, 211, 153, 0.35)' // neutral green
    }
  }

  const handleAddAcid = () => {
    playChemicalReaction()
    setAcidMoles((prev) => prev + 10)
    setBeakerVolume((prev) => Math.min(300, prev + 25))
    setTemperature((prev) => Math.min(65, prev + 2))
  }

  const handleAddBase = () => {
    playChemicalReaction()
    setBaseMoles((prev) => prev + 10)
    setBeakerVolume((prev) => Math.min(300, prev + 25))
    setTemperature((prev) => Math.min(65, prev + 3)) // neutralization is exothermic
  }

  const handleAddZinc = () => {
    playChemicalReaction()
    setHasZinc(true)
    setTemperature((prev) => Math.min(70, prev + 5))
  }

  const handleResetChemistry = () => {
    playClickSound()
    setBeakerVolume(100)
    setAcidMoles(0)
    setBaseMoles(0)
    setHasIndicator(false)
    setHasZinc(false)
    setTemperature(22)
  }

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-2xl">
      {/* Sandbox Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Serbest Deney Masası (Sandbox)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            İnteraktif Laboratuvar Tezgâhı
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Kendi devreni bağla veya kimyasal kapta ekzotermik tepkime başlat!
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              playClickSound()
              setMode('circuit')
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'circuit'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Elektrik Masası</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound()
              setMode('chemistry')
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              mode === 'chemistry'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Kimya Masası</span>
          </button>
        </div>
      </div>

      {/* ── MODE 1: ELEKTRİK MASASI ── */}
      {mode === 'circuit' && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Tray (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sliders className="w-4 h-4" />
                <span>Devre Elemanları & Ayarlar</span>
              </h3>

              {/* Switch Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">Anahtar Durumu</div>
                  <div className="text-[11px] text-slate-400">
                    {isSwitchClosed ? 'Devre Kapalı (Akım Akar)' : 'Devre Açık (Akım Kesik)'}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playSwitchSound()
                    setIsSwitchClosed(!isSwitchClosed)
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isSwitchClosed
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {isSwitchClosed ? 'KAPATILDI (ON)' : 'AÇIK (OFF)'}
                </button>
              </div>

              {/* Battery Voltage Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>Üreteç Gerilimi (V):</span>
                  <span className="text-amber-400 font-mono">{batteryVoltage} Volt</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="24"
                  step="1"
                  value={batteryVoltage}
                  onChange={(e) => setBatteryVoltage(Number(e.target.value))}
                  className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Resistor Slider */}
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                  <span>Direnç Değeri (R):</span>
                  <span className="text-cyan-400 font-mono">{resistorValue} Ω</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={resistorValue}
                  onChange={(e) => setResistorValue(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Toggle Bulb */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                <span className="font-semibold text-slate-300">Ampul (Lamba) Ekle</span>
                <input
                  type="checkbox"
                  checked={hasBulb}
                  onChange={(e) => {
                    playClickSound()
                    setHasBulb(e.target.checked)
                  }}
                  className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Meters & Live Readings */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Ampermetre (I)
                </div>
                <div className="text-lg font-black text-amber-400 font-mono mt-0.5">
                  {currentAmp.toFixed(2)} A
                </div>
                <div className="text-[10px] text-slate-500 font-mono">I = V / R_eş</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Voltmetre (V)
                </div>
                <div className="text-lg font-black text-cyan-400 font-mono mt-0.5">
                  {(isSwitchClosed ? batteryVoltage : 0).toFixed(1)} V
                </div>
                <div className="text-[10px] text-slate-500 font-mono">Uçlar Arası Potansiyel</div>
              </div>
            </div>
          </div>

          {/* Interactive Circuit Canvas (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-950/90 rounded-2xl border border-slate-800 p-4 sm:p-6 flex flex-col items-center justify-center relative min-h-[380px] overflow-hidden">
            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Circuit SVG Diagram */}
            <svg
              className="w-full max-w-lg h-72 sm:h-80 relative z-10"
              viewBox="0 0 500 320"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Circuit Wires */}
              <rect
                x="80"
                y="60"
                width="340"
                height="200"
                rx="16"
                stroke={isSwitchClosed ? '#F59E0B' : '#475569'}
                strokeWidth="4"
                fill="none"
                strokeDasharray={isSwitchClosed ? '12 6' : undefined}
                className={isSwitchClosed ? 'animate-dash' : ''}
              />

              {/* Battery on Left Vertical Line */}
              <g transform="translate(80, 160)">
                <rect x="-18" y="-30" width="36" height="60" rx="6" fill="#1E293B" stroke="#64748B" strokeWidth="2" />
                <line x1="-14" y1="-8" x2="14" y2="-8" stroke="#EF4444" strokeWidth="4" />
                <line x1="-8" y1="8" x2="8" y2="8" stroke="#3B82F6" strokeWidth="4" />
                <text x="-28" y="-6" fill="#EF4444" fontSize="11" fontWeight="bold">+</text>
                <text x="-26" y="14" fill="#3B82F6" fontSize="13" fontWeight="bold">-</text>
                <text x="24" y="4" fill="#F8FAFC" fontSize="11" fontWeight="bold">{batteryVoltage}V</text>
              </g>

              {/* Switch on Top Line */}
              <g transform="translate(250, 60)">
                <circle cx="-30" cy="0" r="4" fill="#F59E0B" />
                <circle cx="30" cy="0" r="4" fill="#F59E0B" />
                <line
                  x1="-30"
                  y1="0"
                  x2={isSwitchClosed ? '30' : '15'}
                  y2={isSwitchClosed ? '0' : '-25'}
                  stroke="#F8FAFC"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
                <text x="-16" y="-32" fill="#94A3B8" fontSize="10" fontWeight="bold">Anahtar</text>
              </g>

              {/* Resistor on Bottom Line */}
              <g transform="translate(250, 260)">
                <rect x="-35" y="-14" width="70" height="28" rx="4" fill="#0F172A" stroke="#06B6D4" strokeWidth="2" />
                <path d="M -30 0 L -20 -8 L -10 8 L 0 -8 L 10 8 L 20 -8 L 30 0" stroke="#06B6D4" strokeWidth="2.5" fill="none" />
                <text x="-14" y="24" fill="#06B6D4" fontSize="11" fontWeight="bold">{resistorValue} Ω</text>
              </g>

              {/* Bulb on Right Vertical Line */}
              {hasBulb && (
                <g transform="translate(420, 160)">
                  {/* Glowing halo if on */}
                  {isSwitchClosed && bulbPower > 0 && (
                    <circle
                      cx="0"
                      cy="0"
                      r={Math.min(50, 15 + bulbPower * 1.5)}
                      fill="#FBBF24"
                      opacity={Math.min(0.65, bulbPower / 40)}
                      className="animate-pulse"
                    />
                  )}
                  <circle cx="0" cy="0" r="22" fill={isSwitchClosed ? '#FEF08A' : '#334155'} stroke="#F59E0B" strokeWidth="3" />
                  <path d="M -10 10 L 0 -8 L 10 10" stroke="#92400E" strokeWidth="2" fill="none" />
                  <text x="30" y="4" fill="#FBBF24" fontSize="11" fontWeight="bold">
                    {bulbPower.toFixed(1)} W
                  </text>
                </g>
              )}
            </svg>

            {/* Status Footer */}
            <div className="mt-2 text-xs text-center text-slate-400">
              {isSwitchClosed ? (
                <span className="text-emerald-400 font-semibold">
                  ⚡ Devre Tamamlandı: Akım saatin tersi yönünde serbestçe akıyor!
                </span>
              ) : (
                <span className="text-slate-400">
                  Devre açık. Anahtarı kapatarak akımı başlatın.
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── MODE 2: KİMYA MASASI ── */}
      {mode === 'chemistry' && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Reagents Shelf (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4" />
                <span>Reaktifler & Çözeltiler</span>
              </h3>

              <button
                type="button"
                onClick={handleAddAcid}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-rose-950/30 hover:bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs font-bold transition-all cursor-pointer"
              >
                <span>+ 10 mmol HCl (Kuvvetli Asit)</span>
                <span className="text-[10px] bg-rose-500/20 px-2 py-0.5 rounded text-rose-300">
                  pH Düşürür
                </span>
              </button>

              <button
                type="button"
                onClick={handleAddBase}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-blue-950/30 hover:bg-blue-950/50 border border-blue-500/40 text-blue-200 text-xs font-bold transition-all cursor-pointer"
              >
                <span>+ 10 mmol NaOH (Kuvvetli Baz)</span>
                <span className="text-[10px] bg-blue-500/20 px-2 py-0.5 rounded text-blue-300">
                  pH Yükseltir
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  playChemicalReaction()
                  setHasIndicator(!hasIndicator)
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  hasIndicator
                    ? 'bg-fuchsia-950/40 border-fuchsia-500 text-fuchsia-200'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span>Damla Fenolftalein İndikatörü</span>
                <span className="text-[10px]">{hasIndicator ? 'Eklendi (Aktif)' : 'Ekle'}</span>
              </button>

              <button
                type="button"
                onClick={handleAddZinc}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-bold transition-all cursor-pointer"
              >
                <span>+ Granül Çinko Metali (Zn)</span>
                <span className="text-[10px] text-amber-400 font-mono">H₂ Gazı Çıkarır</span>
              </button>

              <button
                type="button"
                onClick={handleResetChemistry}
                className="w-full flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Kabı Boşalt & Temizle</span>
              </button>
            </div>

            {/* Live Sensors */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  pH Değeri
                </div>
                <div
                  className={`text-xl font-black font-mono mt-0.5 ${
                    calculatedPH < 7
                      ? 'text-rose-400'
                      : calculatedPH > 7
                      ? 'text-blue-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {calculatedPH}
                </div>
                <div className="text-[10px] text-slate-500">
                  {calculatedPH < 7 ? 'Asidik Ortam' : calculatedPH > 7 ? 'Bazik Ortam' : 'Nötr'}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Sıcaklık (T)
                </div>
                <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
                  {temperature} °C
                </div>
                <div className="text-[10px] text-slate-500">Nötralleşme Isısı</div>
              </div>
            </div>
          </div>

          {/* Interactive Beaker Visual (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-950/90 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center relative min-h-[380px]">
            {/* Beaker Graphic */}
            <div className="relative w-44 sm:w-52 h-64 border-4 border-t-0 border-slate-400/70 rounded-b-3xl bg-slate-900/40 overflow-hidden flex flex-col justify-end p-2 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              {/* Measurement marks */}
              <div className="absolute left-2 top-8 text-[9px] text-slate-500 font-mono">
                - 250 mL
              </div>
              <div className="absolute left-2 top-20 text-[9px] text-slate-500 font-mono">
                - 200 mL
              </div>
              <div className="absolute left-2 top-32 text-[9px] text-slate-500 font-mono">
                - 150 mL
              </div>
              <div className="absolute left-2 top-44 text-[9px] text-slate-500 font-mono">
                - 100 mL
              </div>

              {/* Bubbles if Zinc or active reaction */}
              {hasZinc && (
                <div className="absolute inset-0 pointer-events-none flex justify-around items-end pb-8">
                  <span className="w-2 h-2 rounded-full bg-white/60 animate-bounce delay-100" />
                  <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-bounce delay-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-white/70 animate-bounce delay-200" />
                  <span className="w-1 h-1 rounded-full bg-white/60 animate-bounce delay-500" />
                </div>
              )}

              {/* Liquid Wave */}
              <div
                className="w-full rounded-b-2xl transition-all duration-700 ease-out flex items-center justify-center"
                style={{
                  height: `${Math.min(90, (beakerVolume / 300) * 100)}%`,
                  backgroundColor: liquidColor,
                  backdropFilter: 'blur(4px)',
                }}
              >
                <span className="text-[10px] font-bold text-white/80 bg-black/40 px-2 py-0.5 rounded-full">
                  {beakerVolume} mL Çözelti
                </span>
              </div>
            </div>

            {/* Reaction Note */}
            <div className="mt-4 text-xs text-center text-slate-300 max-w-md bg-slate-900/60 p-3 rounded-xl border border-slate-800">
              {hasZinc ? (
                <span className="text-amber-300 font-semibold">
                  💥 Zn + 2HCl → ZnCl₂ + H₂↑ (Aktif gaz çıkışı ve ekzotermik ısınma gözlemleniyor!)
                </span>
              ) : acidMoles > 0 && baseMoles > 0 ? (
                <span className="text-cyan-300 font-semibold">
                  🧪 HCl + NaOH → NaCl + H₂O (Nötralleşme tepkimesi sonucu tuz ve su oluşuyor.)
                </span>
              ) : (
                <span>Reaktif ekleyerek asit-baz veya metal-asit tepkimelerini gözlemleyin.</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
