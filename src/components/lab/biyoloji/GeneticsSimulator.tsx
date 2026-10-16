'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Dna,
  RotateCcw,
  Layers,
  HelpCircle,
  PieChart,
  Users,
  CheckCircle2,
  Info,
} from 'lucide-react'

type CrossType = 'monohybrid' | 'blood' | 'dihybrid'

export function GeneticsSimulator() {
  const [crossType, setCrossType] = useState<CrossType>('monohybrid')

  // Monohybrid parents: 'AA' | 'Aa' | 'aa'
  const [parent1Mono, setParent1Mono] = useState<string>('Aa')
  const [parent2Mono, setParent2Mono] = useState<string>('Aa')

  // Blood group parents: 'AA' | 'A0' | 'BB' | 'B0' | 'AB' | '00'
  const [parent1Blood, setParent1Blood] = useState<string>('A0')
  const [parent2Blood, setParent2Blood] = useState<string>('B0')

  // Monohybrid cross calculation
  const p1Alleles = [parent1Mono[0], parent1Mono[1]]
  const p2Alleles = [parent2Mono[0], parent2Mono[1]]

  const monoGrid = [
    [
      sortAlleles(p1Alleles[0] + p2Alleles[0]),
      sortAlleles(p1Alleles[0] + p2Alleles[1]),
    ],
    [
      sortAlleles(p1Alleles[1] + p2Alleles[0]),
      sortAlleles(p1Alleles[1] + p2Alleles[1]),
    ],
  ]

  function sortAlleles(pair: string): string {
    const a = pair[0]
    const b = pair[1]
    // Uppercase first (dominant)
    if (a.toLowerCase() === b.toLowerCase()) {
      return a === a.toUpperCase() ? a + b : b + a
    }
    return a.localeCompare(b) < 0 ? a + b : b + a
  }

  // Count mono genotypes & phenotypes
  const monoAll = monoGrid.flat()
  const monoGenotypes: Record<string, number> = {}
  monoAll.forEach((g) => {
    monoGenotypes[g] = (monoGenotypes[g] || 0) + 1
  })

  let dominantPhenoCount = 0
  let recessivePhenoCount = 0
  monoAll.forEach((g) => {
    if (g.includes('A')) dominantPhenoCount++
    else recessivePhenoCount++
  })

  // Blood group cross calculation
  const b1Alleles = [parent1Blood[0], parent1Blood[1]]
  const b2Alleles = [parent2Blood[0], parent2Blood[1]]

  const bloodGrid = [
    [
      sortBlood(b1Alleles[0] + b2Alleles[0]),
      sortBlood(b1Alleles[0] + b2Alleles[1]),
    ],
    [
      sortBlood(b1Alleles[1] + b2Alleles[0]),
      sortBlood(b1Alleles[1] + b2Alleles[1]),
    ],
  ]

  function sortBlood(pair: string): string {
    const a = pair[0]
    const b = pair[1]
    if (a === '0') return b + a
    if (b === '0') return a + b
    if (a === 'B' && b === 'A') return 'AB'
    return a + b
  }

  function getBloodPhenotype(genotype: string): string {
    if (genotype === 'AA' || genotype === 'A0') return 'A Grubu'
    if (genotype === 'BB' || genotype === 'B0') return 'B Grubu'
    if (genotype === 'AB') return 'AB Grubu (Eş Baskın)'
    return '0 Grubu (Çekinik)'
  }

  const bloodAll = bloodGrid.flat()
  const bloodPhenoCounts: Record<string, number> = {}
  bloodAll.forEach((g) => {
    const p = getBloodPhenotype(g)
    bloodPhenoCounts[p] = (bloodPhenoCounts[p] || 0) + 1
  })

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-900/60 border border-emerald-500/20 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Maarif Modeli & MEB
            </span>
            <span className="text-xs text-slate-400">8 - 10. Sınıf Fen & Biyoloji</span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Dna className="w-6 h-6 text-emerald-400" />
            Punnett Karesi & Genetik Çaprazlama Simülatörü
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Anne ve baba bireylerin genotiplerini seçin; gamet dağılımını, Punnett karesi tablosunu,
            fenotipik ve genotipik yavru olasılıklarını anlık grafiklerle keşfedin!
          </p>
        </div>

        {/* Cross Type Selector */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-700/60 self-start md:self-auto">
          <button
            onClick={() => setCrossType('monohybrid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              crossType === 'monohybrid'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monohibrit (Aa × Aa)
          </button>
          <button
            onClick={() => setCrossType('blood')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              crossType === 'blood'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-lg shadow-emerald-500/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kan Grupları (AB0)
          </button>
        </div>
      </div>

      {/* ── Main Interactive Section ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Parent Selectors & Punnett Square */}
        <div className="lg:col-span-7 flex flex-col rounded-2xl bg-slate-900/70 border border-slate-800 p-5 shadow-xl relative space-y-6">
          {/* Parents Selectors */}
          <div className="grid grid-cols-2 gap-4">
            {/* Parent 1 (Anne) */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-pink-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-pink-400 font-semibold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Anne (Dişi Birey ♀)
                </span>
                <span className="font-mono text-white font-bold">
                  {crossType === 'monohybrid' ? parent1Mono : parent1Blood}
                </span>
              </div>

              {crossType === 'monohybrid' ? (
                <div className="grid grid-cols-3 gap-1.5">
                  {['AA', 'Aa', 'aa'].map((val) => (
                    <button
                      key={val}
                      onClick={() => setParent1Mono(val)}
                      className={`py-1 rounded text-xs font-mono font-bold transition-all ${
                        parent1Mono === val
                          ? 'bg-pink-500 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1.5">
                  {['AA', 'A0', 'BB', 'B0', 'AB', '00'].map((val) => (
                    <button
                      key={val}
                      onClick={() => setParent1Blood(val)}
                      className={`py-1 rounded text-xs font-mono font-bold transition-all ${
                        parent1Blood === val
                          ? 'bg-pink-500 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Parent 2 (Baba) */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-400 font-semibold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Baba (Erkek Birey ♂)
                </span>
                <span className="font-mono text-white font-bold">
                  {crossType === 'monohybrid' ? parent2Mono : parent2Blood}
                </span>
              </div>

              {crossType === 'monohybrid' ? (
                <div className="grid grid-cols-3 gap-1.5">
                  {['AA', 'Aa', 'aa'].map((val) => (
                    <button
                      key={val}
                      onClick={() => setParent2Mono(val)}
                      className={`py-1 rounded text-xs font-mono font-bold transition-all ${
                        parent2Mono === val
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1.5">
                  {['AA', 'A0', 'BB', 'B0', 'AB', '00'].map((val) => (
                    <button
                      key={val}
                      onClick={() => setParent2Blood(val)}
                      className={`py-1 rounded text-xs font-mono font-bold transition-all ${
                        parent2Blood === val
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Interactive Punnett Square Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                Punnett Çaprazlama Karesi ({crossType === 'monohybrid' ? 'Monohibrit' : 'Kan Grubu'})
              </span>
              <span className="text-[11px] text-slate-400">
                Gamet Dağılımı ve Döllenme Olasılıkları
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-center">
              {crossType === 'monohybrid' ? (
                <div className="grid grid-cols-3 gap-2 w-full max-w-[340px]">
                  {/* Top-left empty header */}
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center text-xs font-bold text-slate-500">
                    ♀ \ ♂
                  </div>
                  {/* Baba gametleri (Columns) */}
                  <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/30 text-center text-base font-mono font-bold text-blue-300">
                    {p2Alleles[0]}
                  </div>
                  <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/30 text-center text-base font-mono font-bold text-blue-300">
                    {p2Alleles[1]}
                  </div>

                  {/* Row 1 */}
                  <div className="p-3 rounded-lg bg-pink-950/40 border border-pink-500/30 text-center text-base font-mono font-bold text-pink-300">
                    {p1Alleles[0]}
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-center">
                    <div className="text-lg font-mono font-bold text-emerald-300">{monoGrid[0][0]}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {monoGrid[0][0].includes('A') ? 'Baskın (A-)' : 'Çekinik (aa)'}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-center">
                    <div className="text-lg font-mono font-bold text-emerald-300">{monoGrid[0][1]}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {monoGrid[0][1].includes('A') ? 'Baskın (A-)' : 'Çekinik (aa)'}
                    </div>
                  </div>

                  {/* Row 2 */}
                  <div className="p-3 rounded-lg bg-pink-950/40 border border-pink-500/30 text-center text-base font-mono font-bold text-pink-300">
                    {p1Alleles[1]}
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-center">
                    <div className="text-lg font-mono font-bold text-emerald-300">{monoGrid[1][0]}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {monoGrid[1][0].includes('A') ? 'Baskın (A-)' : 'Çekinik (aa)'}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-center">
                    <div className="text-lg font-mono font-bold text-emerald-300">{monoGrid[1][1]}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {monoGrid[1][1].includes('A') ? 'Baskın (A-)' : 'Çekinik (aa)'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 w-full max-w-[340px]">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center text-xs font-bold text-slate-500">
                    ♀ \ ♂
                  </div>
                  <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/30 text-center text-base font-mono font-bold text-blue-300">
                    {b2Alleles[0]}
                  </div>
                  <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/30 text-center text-base font-mono font-bold text-blue-300">
                    {b2Alleles[1]}
                  </div>

                  {/* Row 1 */}
                  <div className="p-3 rounded-lg bg-pink-950/40 border border-pink-500/30 text-center text-base font-mono font-bold text-pink-300">
                    {b1Alleles[0]}
                  </div>
                  <div className="p-3 rounded-lg bg-teal-950/30 border border-teal-500/40 text-center">
                    <div className="text-lg font-mono font-bold text-teal-300">{bloodGrid[0][0]}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{getBloodPhenotype(bloodGrid[0][0])}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-teal-950/30 border border-teal-500/40 text-center">
                    <div className="text-lg font-mono font-bold text-teal-300">{bloodGrid[0][1]}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{getBloodPhenotype(bloodGrid[0][1])}</div>
                  </div>

                  {/* Row 2 */}
                  <div className="p-3 rounded-lg bg-pink-950/40 border border-pink-500/30 text-center text-base font-mono font-bold text-pink-300">
                    {b1Alleles[1]}
                  </div>
                  <div className="p-3 rounded-lg bg-teal-950/30 border border-teal-500/40 text-center">
                    <div className="text-lg font-mono font-bold text-teal-300">{bloodGrid[1][0]}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{getBloodPhenotype(bloodGrid[1][0])}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-teal-950/30 border border-teal-500/40 text-center">
                    <div className="text-lg font-mono font-bold text-teal-300">{bloodGrid[1][1]}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{getBloodPhenotype(bloodGrid[1][1])}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: Phenotypic & Genotypic Percentages Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              Yavru Bireylerin Olasılık Analizi
            </h3>

            {/* Phenotype probabilities */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Fenotip Oranları (Dış Görünüş)</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded">
                  Toplam: 4 İhtimal
                </span>
              </div>

              {crossType === 'monohybrid' ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">Baskın Fenotip (A-):</span>
                    <span className="font-mono font-bold text-emerald-400">
                      %{((dominantPhenoCount / 4) * 100).toFixed(0)} ({dominantPhenoCount}/4)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${(dominantPhenoCount / 4) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-300">Çekinik Fenotip (aa):</span>
                    <span className="font-mono font-bold text-amber-400">
                      %{((recessivePhenoCount / 4) * 100).toFixed(0)} ({recessivePhenoCount}/4)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 transition-all duration-300"
                      style={{ width: `${(recessivePhenoCount / 4) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {Object.entries(bloodPhenoCounts).map(([pheno, count]) => (
                    <div key={pheno} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">{pheno}:</span>
                        <span className="font-mono font-bold text-teal-400">
                          %{((count / 4) * 100).toFixed(0)} ({count}/4)
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500 transition-all duration-300"
                          style={{ width: `${(count / 4) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Genotype probabilities */}
            {crossType === 'monohybrid' && (
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
                <div className="font-semibold text-slate-300">Genotip Ayrışım Oranı:</div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Homozigot Baskın</div>
                    <div className="text-base font-mono font-bold text-white">AA</div>
                    <div className="text-xs text-emerald-400 font-bold">
                      %{(((monoGenotypes['AA'] || 0) / 4) * 100).toFixed(0)}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Heterozigot</div>
                    <div className="text-base font-mono font-bold text-white">Aa</div>
                    <div className="text-xs text-emerald-400 font-bold">
                      %{(((monoGenotypes['Aa'] || 0) / 4) * 100).toFixed(0)}
                    </div>
                  </div>
                  <div className="p-2 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Homozigot Çekinik</div>
                    <div className="text-base font-mono font-bold text-white">aa</div>
                    <div className="text-xs text-amber-400 font-bold">
                      %{(((monoGenotypes['aa'] || 0) / 4) * 100).toFixed(0)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* YKS ÖSYM Biyoloji Kalıtım Hap Bilgisi */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 border border-emerald-500/20 text-xs space-y-2.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <Info className="w-4 h-4" />
              <span>Maarif Modeli & MEB Kalıtım Hap Bilgisi</span>
            </div>
            <ul className="text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>
                <strong className="text-white">Mendel Kanunları:</strong> Monohibrit çaprazlamada iki heterozigot (<span className="font-mono text-emerald-300">Aa × Aa</span>) bireyin çaprazlanması sonucu fenotip oranı daima <strong className="text-white">3:1</strong>, genotip oranı <strong className="text-white">1:2:1</strong>'dir.
              </li>
              <li>
                <strong className="text-teal-300">Eş Baskınlık (Kan Grubu):</strong> A ve B alelleri birbirine üstünlük kuramaz (<span className="font-mono text-white">A = B &gt; 0</span>). Her ikisi bir araya gelince <span className="font-mono text-teal-300">AB</span> fenotipi ortaya çıkar.
              </li>
              <li>
                <strong className="text-amber-300">0 Grubu:</strong> Yalnızca homozigot (<span className="font-mono text-amber-300">00</span>) durumunda fenotipte etkisini gösterebilir.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
