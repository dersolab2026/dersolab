'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calculator,
  Grid,
  Sparkles,
  Layers,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  Sliders,
} from 'lucide-react'

// Prime factorization helper
function primeFactors(n: number): number[] {
  const factors: number[] = []
  let d = 2
  while (n > 1) {
    while (n % d === 0) {
      factors.push(d)
      n /= d
    }
    d++
    if (d * d > n) {
      if (n > 1) factors.push(n)
      break
    }
  }
  return factors
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b)
}

export function FactorsLcmGcdModule() {
  const [numA, setNumA] = useState<number>(24)
  const [numB, setNumB] = useState<number>(36)

  const ebob = gcd(numA, numB)
  const ekok = lcm(numA, numB)

  // Prime factorization breakdown
  const factorsA = primeFactors(numA)
  const factorsB = primeFactors(numB)

  // Intersection of prime factors
  const copyB = [...factorsB]
  const commonPrimes: number[] = []
  factorsA.forEach((p) => {
    const idx = copyB.indexOf(p)
    if (idx !== -1) {
      commonPrimes.push(p)
      copyB.splice(idx, 1)
    }
  })

  // Exclusively in A and exclusively in B
  const copyCommon = [...commonPrimes]
  const onlyA: number[] = []
  factorsA.forEach((p) => {
    const idx = copyCommon.indexOf(p)
    if (idx !== -1) {
      copyCommon.splice(idx, 1)
    } else {
      onlyA.push(p)
    }
  })
  const onlyB = copyB // remaining from copyB

  // LGS Real life problem calculations (Garden tree planting)
  const perimeter = 2 * (numA + numB)
  const treeCount = perimeter / ebob
  const tileCount = (numA / ebob) * (numB / ebob)

  return (
    <div className="space-y-6">
      {/* ── Header Card ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              8. Sınıf LGS 1. Ünite
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              EBOB & EKOK Algoritması
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Çarpanlar ve Katlar / EBOB-EKOK & Venn Şeması
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Asal çarpanlara ayırma, Venn şeması ile ortak bölenleri ayıklama, en büyük ortak bölen (EBOB) ve en küçük ortak kat (EKOK) LGS soru mantığını keşfedin.
          </p>
        </div>

        {/* Live EBOB/EKOK Result Pill */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-950/90 border border-amber-500/30">
          <div className="text-center px-2">
            <div className="text-[10px] text-slate-400 font-semibold">EBOB({numA}, {numB})</div>
            <div className="text-lg sm:text-xl font-black text-amber-300 font-mono">{ebob}</div>
          </div>
          <div className="text-center px-2 border-l border-slate-800">
            <div className="text-[10px] text-slate-400 font-semibold">EKOK({numA}, {numB})</div>
            <div className="text-lg sm:text-xl font-black text-cyan-300 font-mono">{ekok}</div>
          </div>
        </div>
      </div>

      {/* ── Main Canvas & Controls Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Venn Diagram Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-[#030712] border border-slate-800/90 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                Asal Çarpanlar Venn Şeması
              </span>
              <span className="text-slate-400">
                A = {factorsA.join(' × ')} | B = {factorsB.join(' × ')}
              </span>
            </div>

            {/* Venn SVG */}
            <div className="relative h-[220px] w-full flex items-center justify-center">
              <svg className="w-full h-full max-w-[420px]" viewBox="0 0 420 200">
                {/* Circle A */}
                <circle cx="160" cy="100" r="85" fill="#3b82f6" fillOpacity="0.15" stroke="#3b82f6" strokeWidth="2.5" />
                {/* Circle B */}
                <circle cx="260" cy="100" r="85" fill="#10b981" fillOpacity="0.15" stroke="#10b981" strokeWidth="2.5" />

                {/* Set Labels */}
                <text x="110" y="45" fill="#60a5fa" fontSize="13" fontWeight="bold">Sayı A ({numA})</text>
                <text x="310" y="45" fill="#34d399" fontSize="13" fontWeight="bold">Sayı B ({numB})</text>
                <text x="210" y="30" fill="#fbbf24" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Ortak: EBOB = {ebob}
                </text>

                {/* Only A primes */}
                <g transform="translate(125, 95)">
                  {onlyA.map((p, idx) => (
                    <circle key={idx} cx={(idx % 2) * 22 - 10} cy={Math.floor(idx / 2) * 22 - 10} r="9" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="1.5" />
                  ))}
                  {onlyA.map((p, idx) => (
                    <text key={idx} x={(idx % 2) * 22 - 10} y={Math.floor(idx / 2) * 22 - 6} fill="#bfdbfe" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {p}
                    </text>
                  ))}
                </g>

                {/* Common primes in intersection */}
                <g transform="translate(210, 95)">
                  {commonPrimes.map((p, idx) => (
                    <circle key={idx} cx={(idx % 2) * 20 - 10} cy={Math.floor(idx / 2) * 22 - 10} r="9" fill="#854d0e" stroke="#facc15" strokeWidth="1.5" />
                  ))}
                  {commonPrimes.map((p, idx) => (
                    <text key={idx} x={(idx % 2) * 20 - 10} y={Math.floor(idx / 2) * 22 - 6} fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {p}
                    </text>
                  ))}
                </g>

                {/* Only B primes */}
                <g transform="translate(295, 95)">
                  {onlyB.map((p, idx) => (
                    <circle key={idx} cx={(idx % 2) * 22 - 10} cy={Math.floor(idx / 2) * 22 - 10} r="9" fill="#064e3b" stroke="#34d399" strokeWidth="1.5" />
                  ))}
                  {onlyB.map((p, idx) => (
                    <text key={idx} x={(idx % 2) * 22 - 10} y={Math.floor(idx / 2) * 22 - 6} fill="#a7f3d0" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {p}
                    </text>
                  ))}
                </g>
              </svg>
            </div>

            {/* LGS Real-life Problem Visualizer */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Grid className="w-4 h-4 text-amber-400" />
                <span>LGS Klasik Problem Modeli: Dikdörtgen Tarla & Fayans</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Boyutları <strong>{numA} m × {numB} m</strong> olan bir tarlanın etrafına eşit aralıklarla ağaç dikilirse;
              </p>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">Aralık (EBOB):</div>
                  <div className="text-amber-400 font-bold">{ebob} metrede bir</div>
                </div>
                <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">Gereken Ağaç Sayısı:</div>
                  <div className="text-cyan-400 font-bold">{treeCount} adet ağaç</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>Sayıları Ayarla</span>
            </h3>

            {/* Slider Num A */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-400">1. Sayı (A):</span>
                <span className="text-blue-400 font-bold font-mono">{numA}</span>
              </div>
              <input
                type="range"
                min="6"
                max="90"
                step="2"
                value={numA}
                onChange={(e) => setNumA(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            {/* Slider Num B */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-400">2. Sayı (B):</span>
                <span className="text-emerald-400 font-bold font-mono">{numB}</span>
              </div>
              <input
                type="range"
                min="6"
                max="90"
                step="2"
                value={numB}
                onChange={(e) => setNumB(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
            </div>

            {/* Quick Preset Buttons */}
            <div>
              <div className="text-xs text-slate-400 font-semibold mb-2">Örnek LGS Çiftleri:</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { a: 24, b: 36 },
                  { a: 30, b: 45 },
                  { a: 18, b: 24 },
                  { a: 40, b: 60 },
                  { a: 12, b: 18 },
                  { a: 16, b: 48 },
                ].map((pair, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setNumA(pair.a)
                      setNumB(pair.b)
                    }}
                    className="p-1.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white hover:border-amber-500/50 transition-all font-mono"
                  >
                    {pair.a} & {pair.b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* LGS Taktik Kartı */}
          <div className="p-4 rounded-3xl bg-slate-900/50 border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>LGS Altın Eşitliği</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-center text-amber-300 font-bold">
              A · B = EBOB(A, B) · EKOK(A, B)
            </div>
            <p className="text-[11px] text-slate-300">
              İki sayının çarpımı ({numA} × {numB} = {numA * numB}), daima onların EBOB ve EKOK değerlerinin çarpımına ({ebob} × {ekok} = {ebob * ekok}) eşittir!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
