'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  TrendingDown,
  TrendingUp,
  Activity,
  Sparkles,
  Info,
  Building,
  HeartPulse,
} from 'lucide-react'

type PyramidType = 'concave' | 'triangle' | 'asymmetric' | 'beehive' | 'bell'

interface PyramidData {
  id: PyramidType
  name: string
  exampleCountry: string
  developmentStatus: string
  childRate: number // %
  activeRate: number // %
  elderlyRate: number // %
  lifeExpectancy: number // years
  desc: string
  // age brackets: 0-4, 5-9, ..., 80+ (male & female % of pop)
  brackets: number[]
}

const PYRAMIDS: Record<PyramidType, PyramidData> = {
  concave: {
    id: 'concave',
    name: 'Kenarları İçe Çökük Üçgen',
    exampleCountry: 'Somali, Angola, Afganistan',
    developmentStatus: 'Gelişmemiş Ülke',
    childRate: 46,
    activeRate: 51,
    elderlyRate: 3,
    lifeExpectancy: 54,
    desc: 'Doğum oranları çok yüksek (taban geniş), ölüm oranları özellikle bebek yaşlarda çok yüksek (kenarlar içe çökük) ve ortalama yaşam süresi düşüktür.',
    brackets: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0.5],
  },
  triangle: {
    id: 'triangle',
    name: 'Düzgün Kenarlı Üçgen Piramit',
    exampleCountry: 'Hindistan, Filipinler, Mısır',
    developmentStatus: 'Gelişmekte Olan Ülke',
    childRate: 34,
    activeRate: 60,
    elderlyRate: 6,
    lifeExpectancy: 68,
    desc: 'Doğum oranları yüksek seyretmeye devam ederken, sağlık koşullarının iyileşmesiyle bebek ve çocuk ölümleri belirgin şekilde azalmaya başlamıştır.',
    brackets: [8, 7.5, 7, 6.5, 6, 5.5, 4.5, 3.5, 2.5, 1.5, 0.8],
  },
  asymmetric: {
    id: 'asymmetric',
    name: 'Asimetrik Piramit (Doğumu Hızla Azalan)',
    exampleCountry: 'Çin, Brezilya, Bangladeş',
    developmentStatus: 'Hızlı Sanayileşen / Geçiş Ülkesi',
    childRate: 20,
    activeRate: 68,
    elderlyRate: 12,
    lifeExpectancy: 76,
    desc: 'Son 15-20 yılda doğum kontrolü veya kentleşme nedeniyle doğum oranları hızla düşmüştür. Piramidin tabanı aşağıdan belirgin şekilde daralmaktadır.',
    brackets: [4, 5, 6, 7, 7.5, 7, 6.5, 5, 3.5, 2, 1.2],
  },
  beehive: {
    id: 'beehive',
    name: 'Arı Kovanı Piramidi',
    exampleCountry: 'Almanya, İsveç, Japonya, İngiltere',
    developmentStatus: 'Gelişmiş Durağan Ülke',
    childRate: 14,
    activeRate: 64,
    elderlyRate: 22,
    lifeExpectancy: 83,
    desc: 'Doğum ve ölüm oranları düşüktür. Nüfus artış hızı çok azdır veya eksiye geçmiştir. Yaşlı nüfus oranı ve ortalama yaşam süresi son derece yüksektir.',
    brackets: [3.2, 3.4, 3.6, 4.5, 5.5, 6.2, 6.5, 6.0, 5.2, 3.8, 2.4],
  },
  bell: {
    id: 'bell',
    name: 'Çan Şekilli Piramit',
    exampleCountry: 'ABD, Kanada',
    developmentStatus: 'Doğumu Yeniden Artan Gelişmiş Ülke',
    childRate: 18,
    activeRate: 65,
    elderlyRate: 17,
    lifeExpectancy: 81,
    desc: 'Uzun bir süre düşük doğum oranlarına sahip olduktan sonra, uygulanan teşvikler veya göçler sonucunda son yıllarda tabanı yeniden genişlemeye başlayan piramittir.',
    brackets: [4.2, 4.0, 3.8, 4.5, 5.2, 6.0, 6.2, 5.8, 4.8, 3.2, 2.0],
  },
}

const AGE_LABELS = ['0-4', '5-9', '10-14', '15-19', '20-29', '30-39', '40-49', '50-59', '60-69', '70-79', '80+']

export function PopulationPyramidModule() {
  const [selectedType, setSelectedType] = useState<PyramidType>('triangle')
  const cur = PYRAMIDS[selectedType]

  return (
    <div className="space-y-6">
      {/* ── Header Card ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
              10. Sınıf Coğrafya & 7. Sınıf Sosyal
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              Demografi & Nüfus Piramitleri
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Nüfus Piramitleri & Demografik Gelişmişlik Simülatörü
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Ülkelerin doğum/ölüm oranlarına göre oluşan 5 temel nüfus piramidini, aktif ve bağımlı nüfus oranlarını, cinsiyet ve yaş dağılımlarını interaktif karşılaştırın.
          </p>
        </div>

        {/* Development Status Badge */}
        <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-rose-500/30 text-right">
          <div className="text-[10px] text-slate-400 font-semibold">Gelişmişlik Seviyesi:</div>
          <div className="text-sm sm:text-base font-extrabold text-rose-300">
            {cur.developmentStatus}
          </div>
          <div className="text-[11px] text-slate-400">Örn: {cur.exampleCountry}</div>
        </div>
      </div>

      {/* ── Main Canvas & Controls Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pyramid Chart Canvas (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-[#030712] border border-slate-800/90 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-rose-400" />
                {cur.name}
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-blue-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Erkek
                </span>
                <span className="flex items-center gap-1 text-pink-400 font-bold">
                  <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                  Kadın
                </span>
              </div>
            </div>

            {/* Live SVG Pyramid Bars */}
            <div className="relative h-[250px] w-full flex items-center justify-center">
              <svg className="w-full h-full max-w-[440px]" viewBox="0 0 440 250">
                {/* Center dividing line */}
                <line x1="220" y1="10" x2="220" y2="235" stroke="#334155" strokeWidth="1.5" />

                {cur.brackets.map((val, idx) => {
                  const y = 220 - idx * 20
                  const barWidth = val * 16 // scale width

                  return (
                    <g key={idx}>
                      {/* Left bar (Male, Blue) */}
                      <rect
                        x={220 - barWidth}
                        y={y - 12}
                        width={barWidth}
                        height="14"
                        rx="3"
                        fill="#2563eb"
                        fillOpacity="0.8"
                      />

                      {/* Right bar (Female, Pink) */}
                      <rect
                        x={220}
                        y={y - 12}
                        width={barWidth}
                        height="14"
                        rx="3"
                        fill="#db2777"
                        fillOpacity="0.8"
                      />

                      {/* Age label in middle or left */}
                      <text
                        x="20"
                        y={y - 2}
                        fill="#64748b"
                        fontSize="9"
                        fontWeight="bold"
                      >
                        {AGE_LABELS[idx]}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>

            {/* Age Brackets Stats Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 bg-slate-950/70 p-2.5 rounded-2xl text-center">
              <div>
                <div className="text-[10px] text-slate-400">Çocuk (0-14 yaş)</div>
                <div className="text-sm sm:text-base font-extrabold text-cyan-400 font-mono">
                  %{cur.childRate}
                </div>
              </div>
              <div className="border-x border-slate-800">
                <div className="text-[10px] text-slate-400">Aktif (15-64 yaş)</div>
                <div className="text-sm sm:text-base font-extrabold text-emerald-400 font-mono">
                  %{cur.activeRate}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">Yaşlı (65+ yaş)</div>
                <div className="text-sm sm:text-base font-extrabold text-amber-400 font-mono">
                  %{cur.elderlyRate}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls & Presets Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-rose-400" />
              <span>Piramit Türünü Seçin</span>
            </h3>

            <div className="space-y-2">
              {(Object.keys(PYRAMIDS) as PyramidType[]).map((typeKey) => {
                const item = PYRAMIDS[typeKey]
                const isSelected = selectedType === typeKey

                return (
                  <button
                    key={typeKey}
                    type="button"
                    onClick={() => setSelectedType(typeKey)}
                    className={`w-full p-3 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-rose-500/20 border-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.25)]'
                        : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-xs font-bold">{item.name}</div>
                      <span className="text-[10px] font-mono text-rose-300">{item.developmentStatus}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Örn: {item.exampleCountry}</div>
                  </button>
                )
              })}
            </div>

            {/* Description */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
              {cur.desc}
            </div>
          </div>

          {/* Sınav Taktik Kartı */}
          <div className="p-4 rounded-3xl bg-slate-900/50 border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>YKS & LGS Coğrafya Püf Noktaları</span>
            </div>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
              <li>
                <strong>Piramidin Tabanı:</strong> Doğum oranını gösterir. Taban daralıyorsa o ülkede doğum oranı düşüyordur.
              </li>
              <li>
                <strong>Piramidin Tavanı:</strong> Yaşlı nüfus ve sağlık standartlarını gösterir. Tavan genişse ortalama ömür uzundur (gelişmiş ülke).
              </li>
              <li>
                Gelişmiş ülkelerde demografik yatırımlara (okul, aşı) duyulan ihtiyaç az, yaşlı bakım hizmetlerine duyulan ihtiyaç fazladır.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
