'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Layers,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Info,
  CheckCircle2,
  GitCommit,
  Split,
  GitFork,
} from 'lucide-react'

type DivisionType = 'mitosis' | 'meiosis'

interface PhaseInfo {
  id: string
  name: string
  chromosomes: string
  dnaAmount: string
  description: string
  keyEvent: string
  diagramType: string
}

const MITOSIS_PHASES: PhaseInfo[] = [
  {
    id: 'interphase',
    name: 'İnterfaz (Hazırlık)',
    chromosomes: '2n = 4',
    dnaAmount: '2X → 4X (Replikasyon)',
    description: 'Hücre büyür, organel sayısı artar ve DNA kendini eşleyerek kromatit miktarı iki katına çıkar.',
    keyEvent: 'DNA eşlenmesi (Replikasyon) tamamlanır.',
    diagramType: 'interphase',
  },
  {
    id: 'prophase',
    name: 'Profaz',
    chromosomes: '2n = 4',
    dnaAmount: '4X',
    description: 'Kromatin iplikler kısalıp kalınlaşarak belirgin kromozomlara dönüşür. Çekirdek zarı erir, iğ iplikleri oluşur.',
    keyEvent: 'Çekirdek zarı erir, iğ iplikleri kinetokorlara tutunur.',
    diagramType: 'prophase',
  },
  {
    id: 'metaphase',
    name: 'Metafaz',
    chromosomes: '2n = 4',
    dnaAmount: '4X',
    description: 'Kromozomlar hücrenin ekvatoral düzlemine yan yana tek sıra halinde dizilir. Karyotip analizinin en net yapıldığı evredir.',
    keyEvent: 'Kromozomların en belirgin olduğu ve merkeze dizildiği evre.',
    diagramType: 'metaphase',
  },
  {
    id: 'anaphase',
    name: 'Anafaz',
    chromosomes: '4n (Geçici olarak 8)',
    dnaAmount: '4X',
    description: 'Sentromerler bölünür; kardeş kromatitler zıt kutuplara çekilir. Ayrılan her kromatit artık bağımsız birer kromozomdur.',
    keyEvent: 'Kardeş kromatitler kutuplara çekilir; kromozom sayısı geçici 2 katına çıkar.',
    diagramType: 'anaphase',
  },
  {
    id: 'telophase',
    name: 'Telofaz & Sitokinez',
    chromosomes: '2n = 4 (Her hücrede)',
    dnaAmount: '2X (Hücre başına)',
    description: 'Çekirdek zarı yeniden oluşur, iğ iplikleri kaybolur. Sitoplazma bölünmesi (hayvan hücresinde boğumlanma) ile 2 özdeş hücre oluşur.',
    keyEvent: 'Genetik olarak ata hücreyle BİREBİR AYNI 2 yeni hücre oluşur.',
    diagramType: 'telophase',
  },
]

const MEIOSIS_PHASES: PhaseInfo[] = [
  {
    id: 'prophase1',
    name: 'Profaz I (Kalıtsal Çeşitlilik)',
    chromosomes: '2n = 4',
    dnaAmount: '4X',
    description: 'Homolog kromozomlar yan yana gelerek tetrat ve sinapsis oluşturur. Krossing-over (gen alışverişi) gerçekleşerek çeşitlilik sağlanır.',
    keyEvent: 'Krossing-over ve kiyazma ile yeni gen kombinasyonları oluşur.',
    diagramType: 'prophase1',
  },
  {
    id: 'metaphase1',
    name: 'Metafaz I',
    chromosomes: '2n = 4',
    dnaAmount: '4X',
    description: 'Homolog kromozom çiftleri karşılıklı olarak çift sıra halinde ekvatoral düzleme rastgele dizilir (bağımsız dağılım).',
    keyEvent: 'Homolog çiftler ekvatora karşılıklı dizilir.',
    diagramType: 'metaphase1',
  },
  {
    id: 'anaphase1',
    name: 'Anafaz I (Kromozom Yarıya İner)',
    chromosomes: '2n = 4',
    dnaAmount: '4X',
    description: 'Homolog kromozomlar birbirinden ayrılarak zıt kutuplara çekilir. Kromozom sayısının 2n’den n’e düşmesini sağlayan ana olaydır.',
    keyEvent: 'Homolog kromozomlar ayrılır (kardeş kromatitler hala beraberdir).',
    diagramType: 'anaphase1',
  },
  {
    id: 'telophase1',
    name: 'Telofaz I & Mayoz II Başlangıcı',
    chromosomes: 'n = 2 (2 hücre)',
    dnaAmount: '2X',
    description: 'Sitokinez I ile haploit (n) kromozomlu 2 hücre oluşur. DNA eşlenmesi OLMADAN doğrudan Mayoz II başlar.',
    keyEvent: 'Kromozom sayısı yarıya inmiş (n=2) iki ara hücre oluşur.',
    diagramType: 'telophase1',
  },
  {
    id: 'anaphase2',
    name: 'Anafaz II & Sitokinez II (Final)',
    chromosomes: 'n = 2 (4 hücre)',
    dnaAmount: 'X (Hücre başına)',
    description: 'Mayoz II tıpkı mitoz gibi ilerler: Kardeş kromatitler ayrılır ve sitoplazma bölünerek n=2 kromozomlu 4 farklı gamet hücresi oluşur.',
    keyEvent: 'Kromozom sayısı n olan, genetik olarak birbirinden FARKLI 4 hücre oluşur.',
    diagramType: 'anaphase2',
  },
]

export function CellDivisionModule() {
  const [divisionType, setDivisionType] = useState<DivisionType>('mitosis')
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0)

  const phases = divisionType === 'mitosis' ? MITOSIS_PHASES : MEIOSIS_PHASES
  const activePhase = phases[currentPhaseIndex]

  const handleNext = () => {
    if (currentPhaseIndex < phases.length - 1) {
      setCurrentPhaseIndex(currentPhaseIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentPhaseIndex > 0) {
      setCurrentPhaseIndex(currentPhaseIndex - 1)
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Header Card ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              7. Sınıf Fen & 10. Sınıf Biyoloji
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              2n → 2n vs 2n → n
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Hücre Bölünmeleri: Mitoz & Mayoz Evreleri Laboratuvarı
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Profaz, metafaz, anafaz ve telofaz evrelerinde kromozom dizilimlerini, krossing-over mekanizmasını ve DNA/kromozom sayısı değişim grafiklerini adım adım inceleyin.
          </p>
        </div>

        {/* Division Type Selector */}
        <div className="flex items-center p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800">
          <button
            type="button"
            onClick={() => {
              setDivisionType('mitosis')
              setCurrentPhaseIndex(0)
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              divisionType === 'mitosis'
                ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mitoz Bölünme
          </button>
          <button
            type="button"
            onClick={() => {
              setDivisionType('meiosis')
              setCurrentPhaseIndex(0)
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              divisionType === 'meiosis'
                ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Mayoz Bölünme
          </button>
        </div>
      </div>

      {/* ── Main Canvas & Controls Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cell Microscope View (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="relative h-[360px] sm:h-[420px] w-full rounded-3xl bg-[#030712] border border-slate-800/90 overflow-hidden shadow-2xl flex flex-col justify-between p-4">
            
            {/* Top Toolbar */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-emerald-300">
                  Adım {currentPhaseIndex + 1} / {phases.length}
                </span>
                <span className="text-xs font-bold text-white">{activePhase.name}</span>
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentPhaseIndex === 0}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={currentPhaseIndex === phases.length - 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                >
                  <span>Sonraki Evre</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Cell Microscope SVG Graphics */}
            <div className="relative flex-1 w-full flex items-center justify-center">
              <svg className="w-full h-full max-w-[460px]" viewBox="0 0 460 260">
                <defs>
                  <radialGradient id="cellGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#064e3b" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#022c22" stopOpacity="0.8" />
                  </radialGradient>
                </defs>

                {/* Outer Cell Membrane */}
                <ellipse cx="230" cy="130" rx="190" ry="110" fill="url(#cellGrad)" stroke="#10b981" strokeWidth="3" />
                
                {/* Centrosomes / Spindle Poles */}
                <circle cx="65" cy="130" r="7" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />
                <circle cx="395" cy="130" r="7" fill="#f59e0b" stroke="#fff" strokeWidth="1.5" />

                {/* Spindle Fibers (İğ iplikleri) */}
                <path d="M 65 130 Q 230 40 395 130" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3,3" />
                <path d="M 65 130 Q 230 130 395 130" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3,3" />
                <path d="M 65 130 Q 230 220 395 130" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="3,3" />

                {/* Phase specific chromosome arrangement */}
                {activePhase.id === 'interphase' && (
                  <g>
                    {/* Intact Nuclear Membrane */}
                    <circle cx="230" cy="130" r="60" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="5,3" />
                    {/* Loose Chromatin Thread */}
                    <path
                      d="M 200 110 Q 220 90, 240 120 T 260 140 T 220 150 T 210 130 T 240 110"
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="3"
                    />
                    <text x="230" y="134" fill="#cbd5e1" fontSize="11" fontWeight="bold" textAnchor="middle">
                      Kromatin İplik
                    </text>
                  </g>
                )}

                {activePhase.id === 'prophase' && (
                  <g>
                    {/* Dissolving Nuclear Membrane */}
                    <circle cx="230" cy="130" r="65" fill="none" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="6,6" opacity="0.6" />
                    {/* Distinct Condensed Chromosomes */}
                    <g transform="translate(190, 100)">
                      <line x1="-10" y1="-15" x2="10" y2="15" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
                      <line x1="10" y1="-15" x2="-10" y2="15" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
                    </g>
                    <g transform="translate(270, 105)">
                      <line x1="-10" y1="-15" x2="10" y2="15" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" />
                      <line x1="10" y1="-15" x2="-10" y2="15" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" />
                    </g>
                    <g transform="translate(200, 160)">
                      <line x1="-10" y1="-15" x2="10" y2="15" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
                      <line x1="10" y1="-15" x2="-10" y2="15" stroke="#10b981" strokeWidth="5" strokeLinecap="round" />
                    </g>
                    <g transform="translate(260, 155)">
                      <line x1="-10" y1="-15" x2="10" y2="15" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
                      <line x1="10" y1="-15" x2="-10" y2="15" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
                    </g>
                  </g>
                )}

                {activePhase.id === 'metaphase' && (
                  <g>
                    {/* Single row in equator */}
                    <line x1="230" y1="30" x2="230" y2="230" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,3" />
                    <text x="240" y="45" fill="#f43f5e" fontSize="9" fontWeight="bold">Ekvatoral Düzlem</text>

                    {[60, 105, 155, 200].map((y, idx) => {
                      const colors = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b']
                      return (
                        <g key={idx} transform={`translate(230, ${y})`}>
                          <line x1="-10" y1="-12" x2="10" y2="12" stroke={colors[idx]} strokeWidth="5" strokeLinecap="round" />
                          <line x1="10" y1="-12" x2="-10" y2="12" stroke={colors[idx]} strokeWidth="5" strokeLinecap="round" />
                          <circle cx="0" cy="0" r="3" fill="#ffffff" />
                        </g>
                      )
                    })}
                  </g>
                )}

                {activePhase.id === 'anaphase' && (
                  <g>
                    {/* Separated Chromatids moving to poles */}
                    {/* Left pole group */}
                    {[70, 110, 150, 190].map((y, idx) => (
                      <path key={idx} d={`M 145 ${y - 10} L 130 ${y} L 145 ${y + 10}`} fill="none" stroke="#3b82f6" strokeWidth="5" strokeLinecap="round" />
                    ))}
                    {/* Right pole group */}
                    {[70, 110, 150, 190].map((y, idx) => (
                      <path key={idx} d={`M 315 ${y - 10} L 330 ${y} L 315 ${y + 10}`} fill="none" stroke="#ef4444" strokeWidth="5" strokeLinecap="round" />
                    ))}
                  </g>
                )}

                {activePhase.id === 'telophase' && (
                  <g>
                    {/* Constriction furrow (Boğumlanma) */}
                    <path d="M 230 20 Q 230 80 230 100 Q 230 160 230 240" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="4,4" />
                    {/* Two reforming nuclei */}
                    <circle cx="140" cy="130" r="45" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,3" />
                    <circle cx="320" cy="130" r="45" fill="none" stroke="#38bdf8" strokeWidth="2" strokeDasharray="3,3" />
                    <text x="140" y="135" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">2n = 4</text>
                    <text x="320" y="135" fill="#38bdf8" fontSize="11" fontWeight="bold" textAnchor="middle">2n = 4</text>
                  </g>
                )}

                {/* Meiosis specific phases */}
                {activePhase.id === 'prophase1' && (
                  <g>
                    {/* Crossing-over Tetrad */}
                    <g transform="translate(200, 120)">
                      <line x1="-8" y1="-20" x2="8" y2="20" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
                      <line x1="8" y1="-20" x2="-8" y2="20" stroke="#ef4444" strokeWidth="6" strokeLinecap="round" />
                    </g>
                    <g transform="translate(225, 120)">
                      <line x1="-8" y1="-20" x2="8" y2="20" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
                      <line x1="8" y1="-20" x2="-8" y2="20" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" />
                    </g>
                    <text x="230" y="70" fill="#f59e0b" fontSize="12" fontWeight="bold" textAnchor="middle">
                      Tetrat & Krossing-Over (Gen Alışverişi)
                    </text>
                  </g>
                )}

                {activePhase.id === 'metaphase1' && (
                  <g>
                    {/* Double row homolog pairs */}
                    <line x1="230" y1="30" x2="230" y2="230" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3,3" />
                    <g transform="translate(205, 95)">
                      <line x1="-6" y1="-12" x2="6" y2="12" stroke="#ef4444" strokeWidth="5" />
                      <line x1="6" y1="-12" x2="-6" y2="12" stroke="#ef4444" strokeWidth="5" />
                    </g>
                    <g transform="translate(255, 95)">
                      <line x1="-6" y1="-12" x2="6" y2="12" stroke="#3b82f6" strokeWidth="5" />
                      <line x1="6" y1="-12" x2="-6" y2="12" stroke="#3b82f6" strokeWidth="5" />
                    </g>
                    <g transform="translate(205, 165)">
                      <line x1="-6" y1="-12" x2="6" y2="12" stroke="#10b981" strokeWidth="5" />
                      <line x1="6" y1="-12" x2="-6" y2="12" stroke="#10b981" strokeWidth="5" />
                    </g>
                    <g transform="translate(255, 165)">
                      <line x1="-6" y1="-12" x2="6" y2="12" stroke="#f59e0b" strokeWidth="5" />
                      <line x1="6" y1="-12" x2="-6" y2="12" stroke="#f59e0b" strokeWidth="5" />
                    </g>
                  </g>
                )}

                {activePhase.id === 'anaphase1' && (
                  <g>
                    {/* Whole chromosomes moving to poles */}
                    <g transform="translate(130, 95)">
                      <line x1="-8" y1="-15" x2="8" y2="15" stroke="#ef4444" strokeWidth="5" />
                      <line x1="8" y1="-15" x2="-8" y2="15" stroke="#ef4444" strokeWidth="5" />
                    </g>
                    <g transform="translate(130, 165)">
                      <line x1="-8" y1="-15" x2="8" y2="15" stroke="#10b981" strokeWidth="5" />
                      <line x1="8" y1="-15" x2="-8" y2="15" stroke="#10b981" strokeWidth="5" />
                    </g>
                    <g transform="translate(330, 95)">
                      <line x1="-8" y1="-15" x2="8" y2="15" stroke="#3b82f6" strokeWidth="5" />
                      <line x1="8" y1="-15" x2="-8" y2="15" stroke="#3b82f6" strokeWidth="5" />
                    </g>
                    <g transform="translate(330, 165)">
                      <line x1="-8" y1="-15" x2="8" y2="15" stroke="#f59e0b" strokeWidth="5" />
                      <line x1="8" y1="-15" x2="-8" y2="15" stroke="#f59e0b" strokeWidth="5" />
                    </g>
                  </g>
                )}

                {(activePhase.id === 'telophase1' || activePhase.id === 'anaphase2') && (
                  <g>
                    <text x="230" y="115" fill="#10b981" fontSize="13" fontWeight="bold" textAnchor="middle">
                      Mayoz Sonucu: n = 2 Kromozomlu
                    </text>
                    <text x="230" y="145" fill="#cbd5e1" fontSize="11" textAnchor="middle">
                      4 Farklı Genetik Yapıda Gamet (Sperm / Yumurta)
                    </text>
                  </g>
                )}
              </svg>
            </div>

            {/* Bottom Phase Stats Grid */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 bg-slate-950/70 p-2.5 rounded-2xl z-10 text-center">
              <div>
                <div className="text-[10px] text-slate-400">Kromozom Sayısı</div>
                <div className="text-sm sm:text-base font-extrabold text-emerald-400 font-mono">
                  {activePhase.chromosomes}
                </div>
              </div>
              <div className="border-l border-slate-800">
                <div className="text-[10px] text-slate-400">DNA Miktarı</div>
                <div className="text-sm sm:text-base font-extrabold text-cyan-400 font-mono">
                  {activePhase.dnaAmount}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Details & Timeline Stepper (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Split className="w-4 h-4 text-emerald-400" />
              <span>Evre Detayları & Kritik Olaylar</span>
            </h3>

            {/* Step navigation buttons */}
            <div className="space-y-2">
              {phases.map((p, idx) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setCurrentPhaseIndex(idx)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    currentPhaseIndex === idx
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold">{p.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400">{p.chromosomes}</span>
                </button>
              ))}
            </div>

            {/* Selected Phase Deep Dive */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 text-xs">
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Kazanım Özeti:</span>
              </div>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                {activePhase.description}
              </p>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-[11px]">
                <strong>Sınav Tuzağı:</strong> {activePhase.keyEvent}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
