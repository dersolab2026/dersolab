'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Scale,
  Sparkles,
  Plus,
  Minus,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Layers,
  Sliders,
} from 'lucide-react'

interface PresetEquation {
  label: string
  leftX: number
  leftC: number
  rightX: number
  rightC: number
  solution: number
  desc: string
}

const PRESETS: PresetEquation[] = [
  {
    label: '2x + 4 = 10',
    leftX: 2,
    leftC: 4,
    rightX: 0,
    rightC: 10,
    solution: 3,
    desc: 'Temel Terazi: Sol kefede 2 adet x kutusu ve 4 kg ağırlık, sağda 10 kg ağırlık dengededir.',
  },
  {
    label: '3x + 2 = x + 8',
    leftX: 3,
    leftC: 2,
    rightX: 1,
    rightC: 8,
    solution: 3,
    desc: 'Her İki Kefede x Olan Denklem: İki taraftan da 1 adet x ve 2 kg ağırlık eksilterek dengeyi koruyun.',
  },
  {
    label: '4x + 1 = 2x + 9',
    leftX: 4,
    leftC: 1,
    rightX: 2,
    rightC: 9,
    solution: 4,
    desc: 'Cebirsel Denge: İki taraftan da 2x ve 1 kg çıkarınca 2x = 8 kalır, x = 4 bulunur.',
  },
  {
    label: 'x + 5 = 12',
    leftX: 1,
    leftC: 5,
    rightX: 0,
    rightC: 12,
    solution: 7,
    desc: 'Doğrudan Çıkarma: Sol ve sağ kefeden 5 çıkararak x kutusunun gerçek ağırlığına ulaşın.',
  },
]

export function EquationBalanceModule() {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0)
  
  // Current pan items
  const [leftX, setLeftX] = useState<number>(2)
  const [leftC, setLeftC] = useState<number>(4)
  const [rightX, setRightX] = useState<number>(0)
  const [rightC, setRightC] = useState<number>(10)

  // Mystery true weight of x for current puzzle
  const currentPreset = PRESETS[selectedPresetIndex]
  const targetXValue = currentPreset ? currentPreset.solution : 3

  // Calculate simulated weights
  const leftTotalWeight = leftX * targetXValue + leftC
  const rightTotalWeight = rightX * targetXValue + rightC
  const isBalanced = leftTotalWeight === rightTotalWeight

  // Scale tilt angle: max 9 degrees
  const diff = leftTotalWeight - rightTotalWeight
  const tiltAngle = Math.max(-9, Math.min(9, -diff * 1.5))

  // Steps solver detection
  const canRemoveCommonX = leftX > 0 && rightX > 0
  const canRemoveCommonC = leftC > 0 && rightC > 0
  const isSolved = (leftX === 1 && rightX === 0 && leftC === 0) || (rightX === 1 && leftX === 0 && rightC === 0)

  const handleApplyPreset = (idx: number) => {
    setSelectedPresetIndex(idx)
    const p = PRESETS[idx]
    setLeftX(p.leftX)
    setLeftC(p.leftC)
    setRightX(p.rightX)
    setRightC(p.rightC)
  }

  // Step operations: Equality preservation
  const handleRemoveOneXBothSides = () => {
    if (leftX > 0 && rightX > 0) {
      setLeftX((prev) => prev - 1)
      setRightX((prev) => prev - 1)
    }
  }

  const handleRemoveCommonConstants = () => {
    const minC = Math.min(leftC, rightC)
    if (minC > 0) {
      setLeftC((prev) => prev - minC)
      setRightC((prev) => prev - minC)
    }
  }

  const handleDivideByCoefficient = () => {
    if (leftX > 1 && rightX === 0 && leftC === 0 && rightC % leftX === 0) {
      setRightC(rightC / leftX)
      setLeftX(1)
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Subheader ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-teal-950/30 border border-emerald-500/20 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              7. Sınıf Matematik
            </span>
            <span className="text-xs text-slate-400">Cebirsel İfadeler & Eşitliğin Korunumu</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-400" />
            Eşit Kollu Denklem Terazisi Laboratuvarı
          </h3>
          <p className="text-xs text-slate-300 max-w-xl">
            Denklem çözmek bir terazi dengesidir! Her iki kefeye aynı işlemi uygulayarak eşitliği koruyun ve bilinmeyen (x) kutusunun ağırlığını bulun.
          </p>
        </div>

        {/* Balance Status Badge */}
        <div className="self-start sm:self-auto shrink-0">
          <div
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
              isBalanced
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/20'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            }`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isBalanced ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
              }`}
            />
            <span>{isBalanced ? '⚖️ TERAZİ DENGEDE (=)' : '⚠️ DENGESİZ (Eşit Değil)'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Controls & Operations (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Preset Questions */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
              <span>MEB Müfredatı Hazır Denklem Setleri</span>
              <span className="text-emerald-400 font-mono text-[11px]">7. Sınıf Kazanımı</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={p.label}
                  onClick={() => handleApplyPreset(idx)}
                  className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedPresetIndex === idx
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black shadow-md'
                      : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="font-mono text-sm">{p.label}</div>
                  <div className="text-[10px] opacity-75 truncate">{p.desc.split(':')[0]}</div>
                </button>
              ))}
            </div>

            {currentPreset && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                <span className="font-bold text-emerald-400 block mb-0.5">Soru Açıklaması:</span>
                {currentPreset.desc}
              </div>
            )}
          </div>

          {/* Maarif Step-by-Step Equality Preserving Actions */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Eşitliğin Korunumu Adımları</span>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleRemoveOneXBothSides}
                disabled={!canRemoveCommonX}
                className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between border transition-all cursor-pointer ${
                  canRemoveCommonX
                    ? 'bg-amber-950/40 text-amber-200 border-amber-500/40 hover:bg-amber-900/40'
                    : 'bg-slate-950/40 text-slate-600 border-slate-800/60 cursor-not-allowed'
                }`}
              >
                <span>1. Her İki Kefeden 1 Tane x Çıkar (-x)</span>
                <span className="text-[10px] font-mono">Denge Bozulmaz</span>
              </button>

              <button
                onClick={handleRemoveCommonConstants}
                disabled={!canRemoveCommonC}
                className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between border transition-all cursor-pointer ${
                  canRemoveCommonC
                    ? 'bg-sky-950/40 text-sky-200 border-sky-500/40 hover:bg-sky-900/40'
                    : 'bg-slate-950/40 text-slate-600 border-slate-800/60 cursor-not-allowed'
                }`}
              >
                <span>2. Her İki Kefeden {Math.min(leftC, rightC)} kg Sabit Çıkar</span>
                <span className="text-[10px] font-mono">Denge Bozulmaz</span>
              </button>

              <button
                onClick={handleDivideByCoefficient}
                disabled={!(leftX > 1 && rightX === 0 && leftC === 0)}
                className={`w-full p-2.5 rounded-xl text-xs font-bold flex items-center justify-between border transition-all cursor-pointer ${
                  leftX > 1 && rightX === 0 && leftC === 0
                    ? 'bg-emerald-950/40 text-emerald-200 border-emerald-500/40 hover:bg-emerald-900/40'
                    : 'bg-slate-950/40 text-slate-600 border-slate-800/60 cursor-not-allowed'
                }`}
              >
                <span>3. Her İki Kefeyi {leftX}'e Böl (: {leftX})</span>
                <span className="text-[10px] font-mono">x Yalnız Kalır</span>
              </button>
            </div>

            {isSolved && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-xs text-emerald-200 font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Tebrikler! x kutusu tek başına kaldı: x = {leftX === 1 ? rightC : leftC} kg!
                </span>
              </div>
            )}
          </div>

          {/* Manual Weight Adjustments */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300 uppercase tracking-wider">
              <span>Manuel Kefe Düzenleme</span>
              <button
                onClick={() => handleApplyPreset(selectedPresetIndex)}
                className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Sıfırla
              </button>
            </div>

            {/* Left Pan Controls */}
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-emerald-400 block">Sol Kefe Nesneleri:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between bg-slate-900 px-2 py-1 rounded">
                  <span className="text-slate-300">x Kutusu: {leftX}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setLeftX((p) => Math.max(0, p - 1))}
                      className="w-5 h-5 bg-slate-800 rounded flex items-center justify-center text-xs hover:bg-slate-700"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setLeftX((p) => Math.min(6, p + 1))}
                      className="w-5 h-5 bg-slate-800 rounded flex items-center justify-center text-xs hover:bg-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-900 px-2 py-1 rounded">
                  <span className="text-slate-300">+1 kg: {leftC}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setLeftC((p) => Math.max(0, p - 1))}
                      className="w-5 h-5 bg-slate-800 rounded flex items-center justify-center text-xs hover:bg-slate-700"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setLeftC((p) => Math.min(20, p + 1))}
                      className="w-5 h-5 bg-slate-800 rounded flex items-center justify-center text-xs hover:bg-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Pan Controls */}
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <span className="text-[11px] font-bold text-sky-400 block">Sağ Kefe Nesneleri:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center justify-between bg-slate-900 px-2 py-1 rounded">
                  <span className="text-slate-300">x Kutusu: {rightX}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setRightX((p) => Math.max(0, p - 1))}
                      className="w-5 h-5 bg-slate-800 rounded flex items-center justify-center text-xs hover:bg-slate-700"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setRightX((p) => Math.min(6, p + 1))}
                      className="w-5 h-5 bg-slate-800 rounded flex items-center justify-center text-xs hover:bg-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-slate-900 px-2 py-1 rounded">
                  <span className="text-slate-300">+1 kg: {rightC}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setRightC((p) => Math.max(0, p - 1))}
                      className="w-5 h-5 bg-slate-800 rounded flex items-center justify-center text-xs hover:bg-slate-700"
                    >
                      -
                    </button>
                    <button
                      onClick={() => setRightC((p) => Math.min(20, p + 1))}
                      className="w-5 h-5 bg-slate-800 rounded flex items-center justify-center text-xs hover:bg-slate-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Visual Balance Scale Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col items-center">
            {/* Live Equation Display */}
            <div className="w-full flex items-center justify-between mb-4">
              <div className="font-mono text-xl sm:text-2xl font-black text-white bg-slate-950 px-5 py-2 rounded-2xl border border-slate-800">
                <span className="text-emerald-400">
                  {leftX > 0 ? (leftX === 1 ? 'x' : `${leftX}x`) : ''}
                  {leftX > 0 && leftC > 0 ? ' + ' : ''}
                  {leftC > 0 || leftX === 0 ? leftC : ''}
                </span>{' '}
                <span className={isBalanced ? 'text-amber-400' : 'text-slate-500'}>=</span>{' '}
                <span className="text-sky-400">
                  {rightX > 0 ? (rightX === 1 ? 'x' : `${rightX}x`) : ''}
                  {rightX > 0 && rightC > 0 ? ' + ' : ''}
                  {rightC > 0 || rightX === 0 ? rightC : ''}
                </span>
              </div>

              <div className="text-right">
                <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Bilinmeyen x Değeri
                </div>
                <div className="text-lg font-black font-mono text-emerald-400">
                  {targetXValue} kg
                </div>
              </div>
            </div>

            {/* Interactive SVG Scale with Real Dynamic Tilt */}
            <div className="w-full flex justify-center py-4 overflow-hidden">
              <svg width="440" height="300" viewBox="0 0 440 300" className="overflow-visible">
                {/* Scale Base and Central Fulcrum Stand */}
                <polygon points="220,130 190,270 250,270" fill="#334155" stroke="#475569" strokeWidth="2" />
                <rect x="170" y="270" width="100" height="14" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="2" />
                <circle cx="220" cy="130" r="10" fill="#a855f7" stroke="#cbd5e1" strokeWidth="3" />

                {/* Rotating Beam Assembly based on tiltAngle */}
                <g transform={`rotate(${tiltAngle}, 220, 130)`} className="transition-transform duration-300 ease-out">
                  {/* The Horizontal Beam */}
                  <rect x="40" y="126" width="360" height="8" rx="4" fill="#94a3b8" />

                  {/* Left Pan Attachment Point */}
                  <circle cx="70" cy="130" r="5" fill="#f59e0b" />
                  {/* Right Pan Attachment Point */}
                  <circle cx="370" cy="130" r="5" fill="#f59e0b" />

                  {/* Left Pan Strings & Plate */}
                  <line x1="70" y1="130" x2="40" y2="200" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="70" y1="130" x2="100" y2="200" stroke="#64748b" strokeWidth="1.5" />
                  <path d="M 30,200 L 110,200 A 40,15 0 0,0 30,200" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" />

                  {/* Left Pan Items */}
                  <g transform="translate(40, 150)">
                    {/* X Boxes (Green) */}
                    {Array.from({ length: leftX }).map((_, i) => (
                      <g key={`lx-${i}`} transform={`translate(${i * 18}, 22)`}>
                        <rect width="16" height="16" rx="3" fill="#10b981" stroke="#059669" strokeWidth="1.5" />
                        <text x="8" y="11" textAnchor="middle" fill="#022c22" fontSize="9" fontWeight="bold">x</text>
                      </g>
                    ))}
                    {/* 1kg Weights (Blue) */}
                    {Array.from({ length: Math.min(10, leftC) }).map((_, i) => (
                      <circle
                        key={`lc-${i}`}
                        cx={20 + (i % 5) * 14}
                        cy={i >= 5 ? 12 : 2}
                        r="6"
                        fill="#38bdf8"
                        stroke="#0284c7"
                        strokeWidth="1"
                      />
                    ))}
                    {leftC > 10 && (
                      <text x="50" y="5" fill="#38bdf8" fontSize="10" fontWeight="bold">
                        +{leftC - 10}
                      </text>
                    )}
                  </g>

                  {/* Right Pan Strings & Plate */}
                  <line x1="370" y1="130" x2="340" y2="200" stroke="#64748b" strokeWidth="1.5" />
                  <line x1="370" y1="130" x2="400" y2="200" stroke="#64748b" strokeWidth="1.5" />
                  <path d="M 330,200 L 410,200 A 40,15 0 0,0 330,200" fill="#1e293b" stroke="#0ea5e9" strokeWidth="2" />

                  {/* Right Pan Items */}
                  <g transform="translate(340, 150)">
                    {/* X Boxes (Green) */}
                    {Array.from({ length: rightX }).map((_, i) => (
                      <g key={`rx-${i}`} transform={`translate(${i * 18}, 22)`}>
                        <rect width="16" height="16" rx="3" fill="#10b981" stroke="#059669" strokeWidth="1.5" />
                        <text x="8" y="11" textAnchor="middle" fill="#022c22" fontSize="9" fontWeight="bold">x</text>
                      </g>
                    ))}
                    {/* 1kg Weights (Blue) */}
                    {Array.from({ length: Math.min(10, rightC) }).map((_, i) => (
                      <circle
                        key={`rc-${i}`}
                        cx={20 + (i % 5) * 14}
                        cy={i >= 5 ? 12 : 2}
                        r="6"
                        fill="#38bdf8"
                        stroke="#0284c7"
                        strokeWidth="1"
                      />
                    ))}
                    {rightC > 10 && (
                      <text x="50" y="5" fill="#38bdf8" fontSize="10" fontWeight="bold">
                        +{rightC - 10}
                      </text>
                    )}
                  </g>
                </g>
              </svg>
            </div>

            {/* Pedagogical Principle Box */}
            <div className="w-full mt-2 p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-start gap-3">
              <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <div className="font-bold text-white">
                  MEB Maarif Modeli: Eşitliğin Korunumu İlkesi:
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Bir denklemde eşit kollu terazinin dengesi bozulmasın diye <strong>her iki tarafa da aynı işlem uygulanır</strong>. Bir taraftan $x$ veya sayı çıkarılırsa, diğer taraftan da aynı miktar çıkarılmalıdır. Bilinmeyen $x$ tek başına bırakıldığında terazi doğrudan cevabı verir!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
