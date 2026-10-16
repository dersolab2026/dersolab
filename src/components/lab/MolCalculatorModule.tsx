'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator, ArrowRight, Check } from 'lucide-react'

const COMMON_COMPOUNDS = [
  { name: 'Su (H₂O)', ma: 18.0 },
  { name: 'Karbondioksit (CO₂)', ma: 44.0 },
  { name: 'Zaç Yağı (H₂SO₄)', ma: 98.0 },
  { name: 'Sud-Kostik (NaOH)', ma: 40.0 },
  { name: 'Kireç Taşı (CaCO₃)', ma: 100.0 },
  { name: 'Metan Gazı (CH₄)', ma: 16.0 },
  { name: 'Sofra Tuzu (NaCl)', ma: 58.5 },
]

export function MolCalculatorModule() {
  const [selectedCompound, setSelectedCompound] = useState(COMMON_COMPOUNDS[0])
  const [mass, setMass] = useState<string>('36')
  const [customMa, setCustomMa] = useState<string>('18')
  const [volumeLiters, setVolumeLiters] = useState<string>('2')

  const parsedMass = parseFloat(mass) || 0
  const parsedMa = parseFloat(customMa) || 1
  const parsedVolume = parseFloat(volumeLiters) || 1

  // Mol calculation
  const mol = parsedMass / parsedMa

  // Molecule count: n * 6.02 * 10^23
  const nTimesAvogadro = (mol * 6.02).toFixed(2)

  // Volume at Standard Conditions (NK): n * 22.4 Liters (for gases)
  const volumeAtNK = (mol * 22.4).toFixed(2)

  // Molarity: M = n / V
  const molarity = (mol / parsedVolume).toFixed(3)

  const handleCompoundSelect = (comp: typeof COMMON_COMPOUNDS[0]) => {
    setSelectedCompound(comp)
    setCustomMa(comp.ma.toString())
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Banner ── */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider border border-cyan-500/30">
              YKS Pratik Hesaplayıcı
            </span>
            <span className="text-xs text-slate-400">Mol, Molarite ve Tanecik Sayısı</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            Anlık Kimya Çözelti & Mol Çevirici
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kütleyi veya bileşiği değiştirin; mol, tanecik sayısı, NK hacmi ve molarite anında güncellensin.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Input Parameters (5 cols) */}
        <div className="md:col-span-5 p-5 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            1. Bileşik ve Değerleri Seç
          </h3>

          {/* Quick Compound Selector */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-300">Sık Kullanılan Bileşikler:</label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_COMPOUNDS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => handleCompoundSelect(c)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    customMa === c.ma.toString()
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Mass (g) input */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">Kütle (m) gram:</label>
            <input
              type="number"
              value={mass}
              onChange={(e) => setMass(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
              placeholder="Örn: 36"
            />
          </div>

          {/* Molar Mass (Ma) input */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">Mol Kütlesi (M_A) g/mol:</label>
            <input
              type="number"
              value={customMa}
              onChange={(e) => setCustomMa(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
              placeholder="Örn: 18"
            />
          </div>

          {/* Solution Volume (L) */}
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-300">Çözelti Hacmi (V) Litre (Molarite için):</label>
            <input
              type="number"
              value={volumeLiters}
              onChange={(e) => setVolumeLiters(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
              placeholder="Örn: 2"
            />
          </div>
        </div>

        {/* Dynamic Calculated Results (7 cols) */}
        <div className="md:col-span-7 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            2. Hesaplanmış Sonuçlar
          </h3>

          {/* Master Result: Mol Sayısı */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 shadow-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">Mol Sayısı (n = m / M_A)</span>
              <div className="text-3xl font-black text-white font-mono mt-0.5">
                {mol.toFixed(3)} <span className="text-sm font-normal text-slate-400">mol</span>
              </div>
            </div>
            <div className="text-right text-xs font-mono text-slate-400">
              {parsedMass} g ÷ {parsedMa} g/mol
            </div>
          </div>

          {/* 3 Grid Mini Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Tanecik Sayısı */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Tanecik Sayısı (N)</span>
              <div className="text-base font-black text-cyan-300 font-mono mt-1">
                {nTimesAvogadro} × 10²³
              </div>
              <p className="text-[10px] text-slate-500 mt-1">n × N_A (Avogadro)</p>
            </div>

            {/* NK Gaz Hacmi */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">NK Hacmi (0°C, 1 atm)</span>
              <div className="text-base font-black text-amber-300 font-mono mt-1">
                {volumeAtNK} L
              </div>
              <p className="text-[10px] text-slate-500 mt-1">n × 22.4 Litre (Gazlar için)</p>
            </div>

            {/* Molarite */}
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400">Molar Derişim (M)</span>
              <div className="text-base font-black text-purple-300 font-mono mt-1">
                {molarity} M
              </div>
              <p className="text-[10px] text-slate-500 mt-1">M = n / V (mol/Litre)</p>
            </div>
          </div>

          {/* Sınav Formülü Özet Notu */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">MEB & Maarif Altın Formülü:</span>
            <div className="font-mono text-emerald-400 font-bold">
              n = m / M_A = N / N_A = V / 22.4 = M × V
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Bu tek zincir formül Kimya derslerindeki tüm mol ve çözelti hesaplamalarının %90'ını çözdürür.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
