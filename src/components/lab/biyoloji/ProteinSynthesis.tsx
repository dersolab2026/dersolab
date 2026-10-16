'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Dna,
  RotateCcw,
  Zap,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight,
  Info,
  Layers,
  Flame,
} from 'lucide-react'

interface CodonMap {
  dna: string
  mrna: string
  trna: string
  aminoAcid: string
  aminoAcidFullName: string
  color: string
}

const SAMPLE_GENE: CodonMap[] = [
  {
    dna: 'TAC',
    mrna: 'AUG',
    trna: 'UAC',
    aminoAcid: 'Met',
    aminoAcidFullName: 'Metiyonin (Başlatıcı)',
    color: 'bg-emerald-500 border-emerald-400 text-slate-950',
  },
  {
    dna: 'TTC',
    mrna: 'AAG',
    trna: 'UUC',
    aminoAcid: 'Lys',
    aminoAcidFullName: 'Lizin',
    color: 'bg-cyan-500 border-cyan-400 text-slate-950',
  },
  {
    dna: 'GCA',
    mrna: 'CGU',
    trna: 'GCA',
    aminoAcid: 'Arg',
    aminoAcidFullName: 'Arjinin',
    color: 'bg-violet-500 border-violet-400 text-white',
  },
  {
    dna: 'AAA',
    mrna: 'UUU',
    trna: 'AAA',
    aminoAcid: 'Phe',
    aminoAcidFullName: 'Fenilalanin',
    color: 'bg-amber-500 border-amber-400 text-slate-950',
  },
  {
    dna: 'ATC',
    mrna: 'UAG',
    trna: 'AUC',
    aminoAcid: 'STOP',
    aminoAcidFullName: 'Durdurma Kodonu (Son)',
    color: 'bg-rose-500 border-rose-400 text-white',
  },
]

export function ProteinSynthesis() {
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [peptideChain, setPeptideChain] = useState<string[]>([])
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [selectedTrna, setSelectedTrna] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [score, setScore] = useState<number>(0)

  // Current active codon in ribosome
  const activeCodon = SAMPLE_GENE[currentStep]

  // Shuffled tRNA options for the active step
  const getTrnaOptions = () => {
    if (!activeCodon) return []
    const correct = activeCodon.trna
    const decoys = ['CGA', 'UGA', 'ACG', 'CCU', 'AUU'].filter((d) => d !== correct).slice(0, 3)
    return [correct, ...decoys].sort()
  }

  const handleTrnaSubmit = (trnaGuess: string) => {
    if (!activeCodon) return

    if (trnaGuess === activeCodon.trna) {
      setErrorMsg(null)
      const nextChain = [...peptideChain, activeCodon.aminoAcid]
      setPeptideChain(nextChain)
      setScore((s) => s + 20)

      if (activeCodon.aminoAcid === 'STOP') {
        setIsCompleted(true)
      } else {
        setCurrentStep((s) => s + 1)
      }
    } else {
      setErrorMsg(`Hatalı Antikodon! ${activeCodon.mrna} kodonunun komplementer karşılığı olmalıdır.`)
      setTimeout(() => setErrorMsg(null), 2500)
    }
  }

  const handleReset = () => {
    setCurrentStep(0)
    setPeptideChain([])
    setIsCompleted(false)
    setErrorMsg(null)
    setScore(0)
  }

  return (
    <div className="space-y-6">
      {/* ── Top Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-teal-950/40 via-emerald-950/20 to-slate-900/60 border border-teal-500/20 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              AYT & 12. Sınıf Biyoloji
            </span>
            <span className="text-xs text-slate-400">Genden Proteine — Santral Dogma</span>
          </div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-teal-400" />
            DNA Protein Sentezi & Ribozom Translasyon Atölyesi
          </h2>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            DNA kalıp zincirinden mRNA transkripsiyonunu takip edin; ribozomda doğru tRNA antikodonunu
            eşleştirerek amino asit peptit bağları kurun ve polipeptit zincirini tamamlayın!
          </p>
        </div>

        {/* Score & Reset */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400">Puan:</span>
            <span className="font-bold text-amber-300 font-mono">{score}</span>
          </div>

          <button
            onClick={handleReset}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Baştan Başla"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Main Simulation Area ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: DNA, mRNA & Ribosome Visualizer */}
        <div className="lg:col-span-8 flex flex-col rounded-2xl bg-slate-900/70 border border-slate-800 p-5 shadow-xl space-y-6">
          
          {/* 1. DNA Kalıp Zinciri (3' -> 5') */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Dna className="w-4 h-4 text-teal-400" />
                DNA Kalıp Zinciri (3&apos; → 5&apos;)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Çekirdekte Transkripsiyon</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs font-mono text-slate-500 font-bold">3&apos;-</span>
              {SAMPLE_GENE.map((codon, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-2 rounded-lg font-mono text-sm font-bold tracking-wider transition-all border ${
                    idx === currentStep
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500 shadow-lg shadow-teal-500/20'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {codon.dna}
                </div>
              ))}
              <span className="text-xs font-mono text-slate-500 font-bold">-5&apos;</span>
            </div>
          </div>

          {/* 2. mRNA Zinciri (5' -> 3') */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                mRNA Kodonları (5&apos; → 3&apos;)
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Ribozoma Taşınan Mesaj</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="text-xs font-mono text-slate-500 font-bold">5&apos;-</span>
              {SAMPLE_GENE.map((codon, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-2 rounded-lg font-mono text-sm font-bold tracking-wider transition-all border ${
                    idx === currentStep
                      ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400 ring-2 ring-emerald-500/30'
                      : idx < currentStep
                      ? 'bg-slate-900/60 text-slate-500 border-slate-800/60 line-through'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                >
                  {codon.mrna}
                </div>
              ))}
              <span className="text-xs font-mono text-slate-500 font-bold">-3&apos;</span>
            </div>
          </div>

          {/* 3. Ribozom Simülatörü & tRNA Eşleştirme */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border border-slate-800 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                Ribozom Aktif Bölgesi (A & P Bölgeleri)
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">Translasyon Fazı</span>
            </div>

            {!isCompleted ? (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-4">
                {/* Active Ribosome Chamber */}
                <div className="p-4 rounded-xl bg-slate-900/90 border-2 border-dashed border-cyan-500/40 text-center w-full sm:w-60">
                  <div className="text-[11px] text-slate-400 mb-1">Okunan mRNA Kodonu</div>
                  <div className="text-2xl font-mono font-black text-emerald-400 mb-3">
                    {activeCodon.mrna}
                  </div>
                  <div className="text-xs text-slate-400">
                    Gereken tRNA Antikodonunu Aşağıdan Seç:
                  </div>
                </div>

                {/* tRNA Options */}
                <div className="w-full sm:flex-1 space-y-3">
                  <div className="text-xs font-semibold text-slate-300">
                    Sitoplazmadaki tRNA Adayları:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {getTrnaOptions().map((trna) => (
                      <button
                        key={trna}
                        onClick={() => handleTrnaSubmit(trna)}
                        className="p-3 rounded-xl bg-slate-800 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500 text-center transition-all group cursor-pointer"
                      >
                        <div className="text-xs text-slate-400 group-hover:text-cyan-300">
                          tRNA Antikodon:
                        </div>
                        <div className="text-lg font-mono font-bold text-white group-hover:text-cyan-400">
                          {trna}
                        </div>
                      </button>
                    ))}
                  </div>

                  {errorMsg && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2.5 rounded-lg bg-red-500/20 border border-red-500/40 text-xs text-red-300 flex items-center gap-2"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-6 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center space-y-3"
              >
                <div className="inline-flex p-3 rounded-full bg-emerald-500/20 text-emerald-300 mb-1">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-white">Tebrikler! Protein Sentezi Başarıyla Tamamlandı!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  STOP kodonu ribozomdaki sonlanma faktörü tarafından tanındı ve fonksiyonel polipeptit zinciri serbest bırakıldı.
                </p>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors"
                >
                  Tekrar Sentezle
                </button>
              </motion.div>
            )}
          </div>

          {/* 4. Oluşan Polipeptit Zinciri */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Sentezlenen Polipeptit Zinciri ({peptideChain.length} Amino Asit)
              </span>
              <span className="text-[10px] text-slate-500">Peptit Bağları ile Bağlı</span>
            </div>

            <div className="flex items-center gap-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 overflow-x-auto min-h-[56px]">
              {peptideChain.length === 0 ? (
                <span className="text-xs text-slate-500 italic">
                  Henüz amino asit bağlanmadı. İlk AUG kodonunu başlatın...
                </span>
              ) : (
                peptideChain.map((aa, idx) => (
                  <React.Fragment key={idx}>
                    <div
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 border ${
                        aa === 'STOP'
                          ? 'bg-rose-500/30 text-rose-300 border-rose-500'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                      }`}
                    >
                      <span>{aa}</span>
                    </div>
                    {idx < peptideChain.length - 1 && (
                      <span className="text-slate-600 font-bold text-xs">—</span>
                    )}
                  </React.Fragment>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Right: Genetic Code Info & Exam Tips */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-teal-400" />
              Kodon Sözlüğü & Eşleşme
            </h3>

            <div className="space-y-2 text-xs">
              {SAMPLE_GENE.map((codon, idx) => (
                <div
                  key={idx}
                  className={`p-2.5 rounded-xl border flex items-center justify-between transition-colors ${
                    idx === currentStep
                      ? 'bg-teal-950/30 border-teal-500/50'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white bg-slate-900 px-1.5 py-0.5 rounded border border-slate-700">
                      {codon.mrna}
                    </span>
                    <span className="text-slate-400">&rarr;</span>
                    <span className="text-emerald-300 font-semibold">{codon.aminoAcid}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{codon.aminoAcidFullName}</span>
                </div>
              ))}
            </div>
          </div>

          {/* YKS AYT Biyoloji Kodon Hap Bilgisi */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-950/30 via-slate-900 to-slate-950 border border-teal-500/20 text-xs space-y-2.5">
            <div className="flex items-center gap-1.5 text-teal-400 font-semibold">
              <Zap className="w-4 h-4" />
              <span>Maarif Modeli Santral Dogma Hap Bilgisi</span>
            </div>
            <ul className="text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
              <li>
                <strong className="text-white">Başlatma Kodonu:</strong> Bütün protein sentezleri daima <span className="font-mono text-emerald-400 font-bold">AUG</span> kodonu (Metiyonin) ile başlar.
              </li>
              <li>
                <strong className="text-rose-300">Durdurma Kodonları:</strong> <span className="font-mono text-rose-400">UAA, UAG, UGA</span> durdurma kodonlarıdır. Karşılık gelen bir tRNA ya da amino asit bulunmaz; sonlanma faktörü bağlanarak sentezi bitirir!
              </li>
              <li>
                <strong className="text-cyan-300">Evrensellik:</strong> Genetik kod tüm canlılarda hemen hemen evrenseldir (bakteriden insana aynı kodon aynı amino asidi şifreler).
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
