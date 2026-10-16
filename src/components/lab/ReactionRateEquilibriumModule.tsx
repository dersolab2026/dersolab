'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Flame,
  Zap,
  Activity,
  Sliders,
  Sparkles,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Scale,
  FlaskConical,
} from 'lucide-react'

type ModuleSubTab = 'energy_curve' | 'equilibrium'

export function ReactionRateEquilibriumModule() {
  const [subTab, setSubTab] = useState<ModuleSubTab>('energy_curve')

  // Energy Curve State
  const [reactionType, setReactionType] = useState<'exothermic' | 'endothermic'>('exothermic')
  const [hasCatalyst, setHasCatalyst] = useState<boolean>(false)
  const [temperatureLevel, setTemperatureLevel] = useState<'low' | 'high'>('low')

  // Equilibrium State (Haber-Bosch: N2 + 3H2 <=> 2NH3 + Heat)
  const [tempStress, setTempStress] = useState<'normal' | 'hot' | 'cold'>('normal')
  const [pressureStress, setPressureStress] = useState<'normal' | 'high' | 'low'>('normal')
  const [addReactant, setAddReactant] = useState<boolean>(false)

  // Energy values
  const reactantsEnergy = reactionType === 'exothermic' ? 60 : 30
  const productsEnergy = reactionType === 'exothermic' ? 25 : 75
  const deltaH = productsEnergy - reactantsEnergy

  const uncatalyzedPeak = 120
  const catalyzedPeak = 85
  const activePeak = hasCatalyst ? catalyzedPeak : uncatalyzedPeak
  const eai = activePeak - reactantsEnergy
  const eag = activePeak - productsEnergy

  // Equilibrium concentrations calculation
  let n2Conc = 1.0
  let h2Conc = 3.0
  let nh3Conc = 2.0
  let shiftDirection = 'Dengede (Qc = Kc)'

  if (tempStress === 'hot') {
    // Exothermic -> shifts to reactants (left)
    n2Conc += 0.3
    h2Conc += 0.9
    nh3Conc -= 0.6
    shiftDirection = 'Sola (Girenlere) Kayar ← (Isıyı harcamak için)'
  } else if (tempStress === 'cold') {
    // shifts to products (right)
    n2Conc -= 0.2
    h2Conc -= 0.6
    nh3Conc += 0.4
    shiftDirection = 'Sağa (Ürünlere) Kayar → (Isı üretmek için)'
  }

  if (pressureStress === 'high') {
    // 4 mol gas left, 2 mol gas right -> shifts right
    n2Conc -= 0.25
    h2Conc -= 0.75
    nh3Conc += 0.5
    shiftDirection = 'Sağa (Ürünlere) Kayar → (Gaz mol sayısı az olan tarafa)'
  } else if (pressureStress === 'low') {
    // shifts left
    n2Conc += 0.25
    h2Conc += 0.75
    nh3Conc -= 0.5
    shiftDirection = 'Sola (Girenlere) Kayar ← (Basıncı artırmak için)'
  }

  if (addReactant) {
    n2Conc += 0.5
    h2Conc -= 0.3
    nh3Conc += 0.4
    shiftDirection = 'Sağa (Ürünlere) Kayar → (Eklenen N2 gazını harcamak için)'
  }

  return (
    <div className="space-y-6">
      {/* ── Header Card ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
              11. Sınıf Kimya & AYT
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              ΔH = Eai - Eag & Le Chatelier
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Tepkime Hızı, Aktivasyon Enerjisi & Kimyasal Denge
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Tepkime koordinatı potansiyel enerji eğrilerini, katalizörün eşik enerjisine etkisini ve Le Chatelier prensibine göre dengenin sağa/sola kayma dinamiklerini interaktif simüle edin.
          </p>
        </div>

        {/* Sub-tab Selector */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <button
            type="button"
            onClick={() => setSubTab('energy_curve')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subTab === 'energy_curve'
                ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Potansiyel Enerji & Hız
          </button>
          <button
            type="button"
            onClick={() => setSubTab('equilibrium')}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              subTab === 'equilibrium'
                ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Le Chatelier Dengesi
          </button>
        </div>
      </div>

      {subTab === 'energy_curve' ? (
        /* ── Energy Curve Simulation ── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="relative h-[360px] sm:h-[400px] w-full rounded-3xl bg-[#030712] border border-slate-800/90 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
              
              {/* Graphic Title */}
              <div className="flex items-center justify-between text-xs z-10">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  Potansiyel Enerji (PE) — Tepkime Koordinatı (TK)
                </span>
                <span className={`px-2.5 py-1 rounded-full font-bold border ${
                  deltaH < 0
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                }`}>
                  {deltaH < 0 ? 'Ekzotermik (ΔH < 0)' : 'Endotermik (ΔH > 0)'}
                </span>
              </div>

              {/* SVG Curve */}
              <div className="relative flex-1 w-full flex items-center justify-center">
                <svg className="w-full h-full" viewBox="0 0 500 240">
                  {/* Axis */}
                  <line x1="50" y1="20" x2="50" y2="210" stroke="#475569" strokeWidth="2" />
                  <line x1="50" y1="210" x2="480" y2="210" stroke="#475569" strokeWidth="2" />
                  <text x="50" y="15" fill="#94a3b8" fontSize="10" fontWeight="bold">PE (kJ)</text>
                  <text x="440" y="225" fill="#94a3b8" fontSize="10" fontWeight="bold">T.K.</text>

                  {/* Reactants line */}
                  <line x1="50" y1={210 - reactantsEnergy * 1.5} x2="140" y2={210 - reactantsEnergy * 1.5} stroke="#38bdf8" strokeWidth="3" />
                  <text x="60" y={205 - reactantsEnergy * 1.5} fill="#7dd3fc" fontSize="11" fontWeight="bold">Girenler ({reactantsEnergy})</text>

                  {/* Products line */}
                  <line x1="380" y1={210 - productsEnergy * 1.5} x2="470" y2={210 - productsEnergy * 1.5} stroke="#10b981" strokeWidth="3" />
                  <text x="390" y={205 - productsEnergy * 1.5} fill="#6ee7b7" fontSize="11" fontWeight="bold">Ürünler ({productsEnergy})</text>

                  {/* Uncatalyzed Curve (dotted or solid) */}
                  <path
                    d={`M 140 ${210 - reactantsEnergy * 1.5} Q 260 ${210 - uncatalyzedPeak * 1.5}, 380 ${210 - productsEnergy * 1.5}`}
                    fill="none"
                    stroke={hasCatalyst ? '#475569' : '#06b6d4'}
                    strokeWidth={hasCatalyst ? '2' : '3.5'}
                    strokeDasharray={hasCatalyst ? '4,4' : 'none'}
                  />

                  {/* Catalyzed Curve (if enabled) */}
                  {hasCatalyst && (
                    <path
                      d={`M 140 ${210 - reactantsEnergy * 1.5} Q 260 ${210 - catalyzedPeak * 1.5}, 380 ${210 - productsEnergy * 1.5}`}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3.5"
                    />
                  )}

                  {/* Activation Energy Peak label */}
                  <circle cx="260" cy={210 - activePeak * 1.5} r="5" fill="#f59e0b" />
                  <text x="260" y={195 - activePeak * 1.5} fill="#fbbf24" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Aktifleşmiş Kompleks ({activePeak} kJ)
                  </text>
                </svg>
              </div>

              {/* Bottom Values Grid */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 bg-slate-950/70 p-2.5 rounded-2xl z-10 text-center">
                <div>
                  <div className="text-[10px] text-slate-400">İleri Akt. Enerjisi (Eai)</div>
                  <div className="text-sm sm:text-base font-extrabold text-cyan-400">{eai} kJ</div>
                </div>
                <div className="border-x border-slate-800">
                  <div className="text-[10px] text-slate-400">Geri Akt. Enerjisi (Eag)</div>
                  <div className="text-sm sm:text-base font-extrabold text-amber-400">{eag} kJ</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">Tepkime Isısı (ΔH)</div>
                  <div className={`text-sm sm:text-base font-extrabold ${deltaH < 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {deltaH > 0 ? `+${deltaH}` : deltaH} kJ
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Tepkime Şartları</span>
              </h3>

              {/* Reaction Type Toggle */}
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-2">Tepkime Türü:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setReactionType('exothermic')}
                    className={`p-2.5 rounded-2xl border text-xs font-bold transition-all ${
                      reactionType === 'exothermic'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Ekzotermik (Isı Veren)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReactionType('endothermic')}
                    className={`p-2.5 rounded-2xl border text-xs font-bold transition-all ${
                      reactionType === 'endothermic'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    Endotermik (Isı Alan)
                  </button>
                </div>
              </div>

              {/* Catalyst Switch */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Pozitif Katalizör Ekle</div>
                  <div className="text-[10px] text-slate-400">Eşik enerjisini (Ea) düşürerek tepkimeyi hızlandırır</div>
                </div>
                <input
                  type="checkbox"
                  checked={hasCatalyst}
                  onChange={(e) => setHasCatalyst(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
              </div>

              {/* Ayar Açıklaması */}
              <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-xs text-cyan-300">
                <strong>Önemli AYT Kuralı:</strong> Katalizör <code className="font-mono">ΔH</code> değerini asla değiştirmez! Yalnızca ileri ve geri aktivasyon enerjilerini (<code className="font-mono">Eai</code> ve <code className="font-mono">Eag</code>) eşit miktarda düşürür.
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ── Le Chatelier Equilibrium Simulation ── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="p-5 sm:p-6 rounded-3xl bg-[#030712] border border-slate-800/90 shadow-2xl space-y-6">
              
              {/* Chemical Equation Banner */}
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan-500/30 text-center">
                <div className="text-xs text-slate-400 mb-1 font-semibold">Haber-Bosch Denge Tepkimesi</div>
                <div className="text-lg sm:text-xl font-extrabold text-white tracking-wide font-mono">
                  <span className="text-blue-400">N₂(g)</span> + <span className="text-blue-400">3 H₂(g)</span> ⇌ <span className="text-emerald-400">2 NH₃(g)</span> + <span className="text-amber-400">Isı (92 kJ)</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">4 mol gaz ⇌ 2 mol gaz</div>
              </div>

              {/* Shift Indicator Alert */}
              <div className="p-3.5 rounded-2xl bg-cyan-500/15 border border-cyan-500/40 text-center">
                <div className="text-xs text-slate-400">Denge Hareket Yönü:</div>
                <div className="text-sm sm:text-base font-black text-cyan-300 mt-0.5">
                  {shiftDirection}
                </div>
              </div>

              {/* Concentration Visual Bars */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-300">Canlı Denge Derişimleri (Molar):</div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-400 font-bold">[N₂] Azot Gazı</span>
                    <span className="font-mono text-blue-300">{n2Conc.toFixed(2)} M</span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-blue-500 h-full"
                      animate={{ width: `${(n2Conc / 4) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-blue-400 font-bold">[H₂] Hidrojen Gazı</span>
                    <span className="font-mono text-blue-300">{h2Conc.toFixed(2)} M</span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-cyan-500 h-full"
                      animate={{ width: `${(h2Conc / 5) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-400 font-bold">[NH₃] Amonyak Ürünü</span>
                    <span className="font-mono text-emerald-300">{nh3Conc.toFixed(2)} M</span>
                  </div>
                  <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden">
                    <motion.div
                      className="bg-emerald-500 h-full"
                      animate={{ width: `${(nh3Conc / 4) * 100}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Equilibrium Stress Controls */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-cyan-400" />
                <span>Sisteme Dış Müdahaleler</span>
              </h3>

              {/* Temperature Stress */}
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-2">Sıcaklık Etkisi:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setTempStress('cold')}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                      tempStress === 'cold'
                        ? 'bg-blue-500/20 border-blue-500 text-blue-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    Soğut (↓ T)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempStress('normal')}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                      tempStress === 'normal'
                        ? 'bg-slate-800 border-slate-600 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    Normal T
                  </button>
                  <button
                    type="button"
                    onClick={() => setTempStress('hot')}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                      tempStress === 'hot'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    Isıt (↑ T)
                  </button>
                </div>
              </div>

              {/* Pressure Stress */}
              <div>
                <label className="text-xs text-slate-400 font-semibold block mb-2">Basınç / Hacim Etkisi:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPressureStress('low')}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                      pressureStress === 'low'
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    Basınç Düşür
                  </button>
                  <button
                    type="button"
                    onClick={() => setPressureStress('normal')}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                      pressureStress === 'normal'
                        ? 'bg-slate-800 border-slate-600 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    Normal P
                  </button>
                  <button
                    type="button"
                    onClick={() => setPressureStress('high')}
                    className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                      pressureStress === 'high'
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400'
                    }`}
                  >
                    Basınç Artır
                  </button>
                </div>
              </div>

              {/* Add N2 toggle */}
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-white">Ortama N₂ Gazı Ekle</div>
                  <div className="text-[10px] text-slate-400">Reaktif derişimini artırır</div>
                </div>
                <input
                  type="checkbox"
                  checked={addReactant}
                  onChange={(e) => setAddReactant(e.target.checked)}
                  className="w-5 h-5 rounded border-slate-700 text-cyan-500 focus:ring-0"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
