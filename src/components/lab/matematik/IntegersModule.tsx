'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Thermometer,
  Compass,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Plus,
  Minus,
  RotateCcw,
  Waves,
  Mountain,
} from 'lucide-react'

export function IntegersModule() {
  const [activeTab, setActiveTab] = useState<'numberLine' | 'realLife' | 'chips'>('numberLine')

  // Number Line State
  const [selectedNum, setSelectedNum] = useState<number>(-4)

  // Real Life Scenarios State
  const [temperature, setTemperature] = useState<number>(-6)
  const [altitude, setAltitude] = useState<number>(-150)

  // Chips Operation State
  const [posChips, setPosChips] = useState<number>(5)
  const [negChips, setNegChips] = useState<number>(3)

  // Zero pairs count
  const zeroPairs = Math.min(posChips, negChips)
  const netResult = posChips - negChips

  return (
    <div className="space-y-6">
      {/* ── Subheader ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-indigo-950/30 border border-blue-500/20 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
              6. Sınıf Matematik
            </span>
            <span className="text-xs text-slate-400">Tam Sayılar & Yönlü Sayılar Dünyası</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Thermometer className="w-5 h-5 text-blue-400" />
            Tam Sayılar, Sayı Doğrusu & Sayı Pulları Laboratuvarı
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Sıfırın altındaki dondurucu soğuklar, denizaltılar, borç-alacak ilişkisi ve mutlak değer kavramını görsel simülatörle keşfedin.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('numberLine')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'numberLine'
                ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Sayı Doğrusu & Mutlak Değer
          </button>
          <button
            onClick={() => setActiveTab('realLife')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'realLife'
                ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Termometre & Rakım
          </button>
          <button
            onClick={() => setActiveTab('chips')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'chips'
                ? 'bg-blue-500 text-slate-950 shadow-md shadow-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Sayı Pulları (+ / -)
          </button>
        </div>
      </div>

      {/* ── TAB 1: SAYI DOĞRUSU & MUTLAK DEĞER ── */}
      {activeTab === 'numberLine' && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h4 className="text-base font-bold text-white">İnteraktif Tam Sayı Doğrusu (-10 ... +10)</h4>
              <p className="text-xs text-slate-400">
                0 referans (başlangıç) noktasıdır. Sağa gidildikçe sayılar büyür (+), sola gidildikçe küçülür (-).
              </p>
            </div>

            {/* Quick Stat Badges */}
            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono border ${
                  selectedNum > 0
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : selectedNum < 0
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-slate-800 text-slate-300 border-slate-700'
                }`}
              >
                İşaret: {selectedNum > 0 ? 'Pozitif (+)' : selectedNum < 0 ? 'Negatif (-)' : 'Nötr (0)'}
              </span>
              <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono bg-violet-500/20 text-violet-300 border border-violet-500/30">
                Mutlak Değer: |{selectedNum}| = {Math.abs(selectedNum)}
              </span>
            </div>
          </div>

          {/* Interactive SVG Number Line */}
          <div className="w-full overflow-x-auto py-6 flex justify-center">
            <svg width={720} height={130} className="overflow-visible select-none">
              {/* Main Axis Line */}
              <line x1="20" y1="60" x2="700" y2="60" stroke="#64748b" strokeWidth="3" />
              {/* Arrows */}
              <polygon points="12,60 22,54 22,66" fill="#64748b" />
              <polygon points="708,60 698,54 698,66" fill="#64748b" />

              {/* Absolute Value Distance Arc */}
              {selectedNum !== 0 && (
                <path
                  d={`M 360,60 Q ${(360 + 360 + selectedNum * 32) / 2},${
                    selectedNum > 0 ? 10 : 110
                  } ${360 + selectedNum * 32},60`}
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  strokeDasharray="4 4"
                />
              )}

              {/* Tick Marks & Numbers from -10 to +10 */}
              {Array.from({ length: 21 }).map((_, i) => {
                const n = i - 10
                const x = 360 + n * 32
                const isZero = n === 0
                const isSelected = n === selectedNum

                return (
                  <g key={n} className="cursor-pointer" onClick={() => setSelectedNum(n)}>
                    {/* Tick line */}
                    <line
                      x1={x}
                      y1={isZero ? 45 : 52}
                      x2={x}
                      y2={isZero ? 75 : 68}
                      stroke={isZero ? '#f59e0b' : isSelected ? '#38bdf8' : '#475569'}
                      strokeWidth={isZero || isSelected ? 3 : 1.5}
                    />

                    {/* Point Circle */}
                    <circle
                      cx={x}
                      cy={60}
                      r={isSelected ? 7 : isZero ? 5 : 3}
                      fill={
                        isSelected
                          ? '#38bdf8'
                          : isZero
                          ? '#f59e0b'
                          : n > 0
                          ? '#10b981'
                          : '#f43f5e'
                      }
                      stroke={isSelected ? '#ffffff' : 'none'}
                      strokeWidth={2}
                    />

                    {/* Number text */}
                    <text
                      x={x}
                      y={85}
                      textAnchor="middle"
                      fill={
                        isSelected
                          ? '#38bdf8'
                          : isZero
                          ? '#f59e0b'
                          : n > 0
                          ? '#34d399'
                          : '#fb7185'
                      }
                      fontSize={isZero ? '13' : '11'}
                      fontWeight={isZero || isSelected ? 'bold' : 'normal'}
                      fontFamily="monospace"
                    >
                      {n > 0 ? `+${n}` : n}
                    </text>
                  </g>
                )
              })}

              {/* Current Selected Label */}
              <g transform={`translate(${360 + selectedNum * 32}, 25)`}>
                <rect x="-24" y="-14" width="48" height="20" rx="6" fill="#0284c7" />
                <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                  {selectedNum > 0 ? `+${selectedNum}` : selectedNum}
                </text>
              </g>
            </svg>
          </div>

          {/* Quick Click Number Selector Slider */}
          <div className="max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>-10 (En Küçük)</span>
              <span className="font-bold text-white">Sayıyı Değiştir: {selectedNum}</span>
              <span>+10 (En Büyük)</span>
            </div>
            <input
              type="range"
              min={-10}
              max={10}
              value={selectedNum}
              onChange={(e) => setSelectedNum(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>

          {/* Concept Explanation Card */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1 p-2 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <span className="font-bold text-rose-400 block">🛑 Negatif Sayılar (Z⁻):</span>
              <p className="text-slate-300 leading-relaxed">
                0'ın solundaki sayılardır. Borç, deniz seviyesi altı ve donma altı sıcaklıkları ifade eder. Sola gidildikçe küçülür (-10 &lt; -1).
              </p>
            </div>
            <div className="space-y-1 p-2 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <span className="font-bold text-amber-400 block">⚖️ Başlangıç Noktası (0):</span>
              <p className="text-slate-300 leading-relaxed">
                Referans noktasıdır. İşareti yoktur (ne pozitif ne negatiftir). Pozitif ve negatif sayıları birbirinden ayırır.
              </p>
            </div>
            <div className="space-y-1 p-2 rounded-xl bg-slate-900/50 border border-slate-800/80">
              <span className="font-bold text-emerald-400 block">🚀 Pozitif Sayılar (Z⁺):</span>
              <p className="text-slate-300 leading-relaxed">
                0'ın sağındaki sayılardır. Alacak, kâr, zemin üstü katlar ve yüksek sıcaklıkları ifade eder. Sağa gidildikçe büyür.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 2: GERÇEK HAYAT SENARYOLARI (TERMOMETRE & RAKIM) ── */}
      {activeTab === 'realLife' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Thermometer Card */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-amber-400" />
                <h4 className="text-base font-bold text-white">Sıcaklık & Termometre</h4>
              </div>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold ${
                  temperature > 0
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : temperature < 0
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {temperature > 0 ? `+${temperature}°C` : `${temperature}°C`}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              {temperature < 0
                ? 'Suyun donma noktasının (0°C) altı: Kar yağışı, kış mevsimi ve dondurucu hava.'
                : temperature > 0
                ? 'Suyun donma noktasının üstü: Bahar ve yaz mevsimi sıcaklıkları.'
                : 'Suyun donma noktası: Eriyik buz ve su dengesi.'}
            </p>

            {/* Slider */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>-25°C (Erzurum)</span>
                <span>0°C (Donma)</span>
                <span>+40°C (Antalya)</span>
              </div>
              <input
                type="range"
                min={-25}
                max={40}
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* Visual Mercury Column */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-around">
              <div className="relative w-8 h-48 bg-slate-900 rounded-full border border-slate-700 flex flex-col justify-end p-1 overflow-hidden">
                <div
                  style={{
                    height: `${((temperature + 25) / 65) * 100}%`,
                  }}
                  className={`w-full rounded-full transition-all duration-200 ${
                    temperature >= 0
                      ? 'bg-gradient-to-t from-orange-500 to-rose-500'
                      : 'bg-gradient-to-t from-blue-700 to-cyan-400'
                  }`}
                />
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <span className="text-slate-400 block text-[10px] font-bold">MEB Soru Senaryosu:</span>
                  <p className="text-slate-200 font-medium">
                    Gece sıcaklığı -4°C iken gündüz 8°C artarsa yeni sıcaklık kaç olur?
                  </p>
                  <p className="text-emerald-400 font-bold font-mono">
                    (-4) + (+8) = +4°C
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Altitude / Sea Level Card */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Waves className="w-5 h-5 text-cyan-400" />
                <h4 className="text-base font-bold text-white">Deniz Seviyesi & İrtifa</h4>
              </div>
              <span
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold ${
                  altitude > 0
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : altitude < 0
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-slate-800 text-slate-300'
                }`}
              >
                {altitude > 0 ? `+${altitude} m` : `${altitude} m`}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Deniz seviyesi 0 metre referans kabul edilir. Dağ zirveleri pozitif (+), denizaltılar ve dalgıçlar negatif (-) tam sayılarla gösterilir.
            </p>

            {/* Slider */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs text-slate-400">
                <span>-500 m (Denizaltı)</span>
                <span>0 m (Kıyı)</span>
                <span>+800 m (Zirve)</span>
              </div>
              <input
                type="range"
                min={-500}
                max={800}
                step={25}
                value={altitude}
                onChange={(e) => setAltitude(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Graphic Representation */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-emerald-300">
                <span>🏔️ Dağ Zirvesi:</span>
                <span className="font-mono font-bold">+800 m</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-bold">
                <span>⛵ Deniz Seviyesi (Referans):</span>
                <span className="font-mono">0 m</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-blue-950/30 border border-blue-500/30 text-blue-300">
                <span>🤿 Dalgıç & Denizaltı:</span>
                <span className="font-mono font-bold">{altitude < 0 ? `${altitude} m` : '-200 m'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB 3: SAYI PULLARI İLE SIFIR ÇİFTİ MODELİ ── */}
      {activeTab === 'chips' && (
        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h4 className="text-base font-bold text-white">Sayı Pulları ile Toplama & Nötrleşme (Sıfır Çifti)</h4>
              <p className="text-xs text-slate-400">
                1 adet (+) pul ile 1 adet (-) pul bir araya geldiğinde birbirini sıfırlar (sıfır çifti oluşturur).
              </p>
            </div>

            <div className="font-mono text-base font-black px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white">
              <span className="text-emerald-400">(+{posChips})</span> +{' '}
              <span className="text-rose-400">(-{negChips})</span> ={' '}
              <span className={netResult > 0 ? 'text-emerald-400' : netResult < 0 ? 'text-rose-400' : 'text-slate-400'}>
                {netResult > 0 ? `+${netResult}` : netResult}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Controls */}
            <div className="space-y-4">
              {/* Positive Chips Control */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                  <span>Pozitif Pullar (+): {posChips} adet</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setPosChips((p) => Math.max(0, p - 1))}
                      className="w-6 h-6 rounded bg-emerald-900/60 text-white hover:bg-emerald-800 flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setPosChips((p) => Math.min(10, p + 1))}
                      className="w-6 h-6 rounded bg-emerald-900/60 text-white hover:bg-emerald-800 flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {Array.from({ length: posChips }).map((_, i) => (
                    <div
                      key={`pos-${i}`}
                      className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-black text-sm flex items-center justify-center shadow-md shadow-emerald-500/30"
                    >
                      +
                    </div>
                  ))}
                  {posChips === 0 && <span className="text-xs text-slate-500 italic">Pul yok</span>}
                </div>
              </div>

              {/* Negative Chips Control */}
              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-rose-300">
                  <span>Negatif Pullar (-): {negChips} adet</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setNegChips((p) => Math.max(0, p - 1))}
                      className="w-6 h-6 rounded bg-rose-900/60 text-white hover:bg-rose-800 flex items-center justify-center cursor-pointer"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setNegChips((p) => Math.min(10, p + 1))}
                      className="w-6 h-6 rounded bg-rose-900/60 text-white hover:bg-rose-800 flex items-center justify-center cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {Array.from({ length: negChips }).map((_, i) => (
                    <div
                      key={`neg-${i}`}
                      className="w-8 h-8 rounded-full bg-rose-500 text-white font-black text-sm flex items-center justify-center shadow-md shadow-rose-500/30"
                    >
                      -
                    </div>
                  ))}
                  {negChips === 0 && <span className="text-xs text-slate-500 italic">Pul yok</span>}
                </div>
              </div>
            </div>

            {/* Simulation Canvas: Zero Pairs pairing */}
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Nötrleşme & Kalan Sonuç
              </span>

              {/* Zero Pairs Box */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-bold">Oluşan Sıfır Çiftleri:</span>
                  <span className="font-mono text-slate-300 font-bold">{zeroPairs} Çift (= 0)</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: zeroPairs }).map((_, i) => (
                    <div
                      key={`pair-${i}`}
                      className="p-1 px-2 rounded-xl bg-slate-800/80 border border-dashed border-amber-500/50 flex items-center gap-1 text-xs opacity-60"
                      title="Sıfır Çifti (Birbirini nötrler)"
                    >
                      <span className="w-5 h-5 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold">
                        +
                      </span>
                      <span className="text-slate-500">|</span>
                      <span className="w-5 h-5 rounded-full bg-rose-500/30 text-rose-300 flex items-center justify-center font-bold">
                        -
                      </span>
                    </div>
                  ))}
                  {zeroPairs === 0 && (
                    <span className="text-xs text-slate-500 italic">Zıt işaretli pul eşleşmesi yok</span>
                  )}
                </div>
              </div>

              {/* Net Remaining Box */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-white">Geriye Kalan Net Sonuç:</span>
                  <span
                    className={`font-mono text-base ${
                      netResult > 0 ? 'text-emerald-400' : netResult < 0 ? 'text-rose-400' : 'text-slate-400'
                    }`}
                  >
                    {netResult > 0 ? `+${netResult}` : netResult}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: Math.abs(netResult) }).map((_, i) => (
                    <div
                      key={`rem-${i}`}
                      className={`w-7 h-7 rounded-full text-xs font-black flex items-center justify-center shadow-sm ${
                        netResult > 0
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-rose-500 text-white'
                      }`}
                    >
                      {netResult > 0 ? '+' : '-'}
                    </div>
                  ))}
                  {netResult === 0 && (
                    <span className="text-xs text-slate-400 font-mono">Bütün pullar birbirini sıfırladı (= 0).</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
