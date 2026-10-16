'use client'

import React, { useState } from 'react'
import { Columns, X, ArrowRight, Sparkles, Scale, Info } from 'lucide-react'
import { playClickSound, playSliderTick } from '@/lib/soundFx'

export interface SplitStateScenario {
  label: string
  subtitle: string
  badgeColor: string
  params: { name: string; value: number | string; unit: string }[]
  results: { name: string; value: number | string; unit: string; highlight?: boolean }[]
  visualNote: string
}

interface LabSplitScreenModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  branch: string
  stateA: SplitStateScenario
  stateB: SplitStateScenario
  deltaInsights: string[]
}

export function LabSplitScreenModal({
  isOpen,
  onClose,
  title,
  branch,
  stateA,
  stateB,
  deltaInsights,
}: LabSplitScreenModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Columns className="w-5 h-5 text-cyan-400" />
            <div>
              <div className="text-[10px] text-cyan-400 font-extrabold uppercase tracking-widest">
                İkili Durum Karşılaştırma Modu (Split Screen)
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">{title}</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound()
              onClose()
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {/* Side by side columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Scenario A */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300">
                    Durum A (Deney Grubu)
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{stateA.label}</h3>
                  <p className="text-xs text-slate-400">{stateA.subtitle}</p>
                </div>
              </div>

              {/* Params Table */}
              <div className="space-y-1.5 pt-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Girdi Değişkenleri
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {stateA.params.map((p, i) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400">{p.name}</div>
                      <div className="text-xs font-bold text-slate-200">
                        {p.value} {p.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results Table */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <div className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                  Ölçülen Sonuçlar
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stateA.results.map((r, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-blue-950/20 border border-blue-500/20"
                    >
                      <div className="text-[10px] text-blue-300/80">{r.name}</div>
                      <div className="text-sm font-extrabold text-blue-300">
                        {r.value} <span className="text-[11px] font-normal">{r.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
                💡 <span className="font-semibold text-slate-200">Gözlem:</span> {stateA.visualNote}
              </div>
            </div>

            {/* Scenario B */}
            <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300">
                    Durum B (Karşılaştırma Grubu)
                  </span>
                  <h3 className="text-base font-bold text-white mt-1">{stateB.label}</h3>
                  <p className="text-xs text-slate-400">{stateB.subtitle}</p>
                </div>
              </div>

              {/* Params Table */}
              <div className="space-y-1.5 pt-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Girdi Değişkenleri
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {stateB.params.map((p, i) => (
                    <div key={i} className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400">{p.name}</div>
                      <div className="text-xs font-bold text-slate-200">
                        {p.value} {p.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Results Table */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  Ölçülen Sonuçlar
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stateB.results.map((r, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20"
                    >
                      <div className="text-[10px] text-amber-300/80">{r.name}</div>
                      <div className="text-sm font-extrabold text-amber-300">
                        {r.value} <span className="text-[11px] font-normal">{r.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 leading-relaxed">
                💡 <span className="font-semibold text-slate-200">Gözlem:</span> {stateB.visualNote}
              </div>
            </div>
          </div>

          {/* Delta Insights / Bilimsel Fark Analizi */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/30 via-slate-900 to-teal-950/30 border border-cyan-500/30">
            <div className="flex items-center gap-2 text-cyan-300 text-xs font-extrabold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Δ Değişim & Bilimsel Çıkarım (Sınav Mantığı)</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
              {deltaInsights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-cyan-400 font-bold shrink-0 mt-0.5">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
