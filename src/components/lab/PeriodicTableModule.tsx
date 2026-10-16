'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, BookOpen, Layers, CheckCircle2, Search, ArrowRight, Zap } from 'lucide-react'
import { AtomVisualizer3D } from './AtomVisualizer3D'

export interface ElementData {
  number: number
  symbol: string
  name: string
  mass: number
  category: 'alkali' | 'alkaline' | 'transition' | 'post-transition' | 'metalloid' | 'nonmetal' | 'halogen' | 'noble'
  block: 's' | 'p' | 'd' | 'f'
  group: number
  period: number
  electronConfig: string
  oxidationStates: string
  summary: string
  osymHint: string
  color: string
}

export const ELEMENTS_DATA: ElementData[] = [
  {
    number: 1,
    symbol: 'H',
    name: 'Hidrojen',
    mass: 1.008,
    category: 'nonmetal',
    block: 's',
    group: 1,
    period: 1,
    electronConfig: '1s¹',
    oxidationStates: '+1, -1',
    summary: 'Evrenin en bol elementidir. 1A grubunda yer almasına rağmen bir ametaldir.',
    osymHint: 'ÖSYM TUZAĞI: 1A grubundadır ama alkali metal DEĞİLDİR! Metallerle hidrür bileşiklerinde (-1), ametallerle (+1) değerlik alır.',
    color: '#38bdf8',
  },
  {
    number: 2,
    symbol: 'He',
    name: 'Helyum',
    mass: 4.0026,
    category: 'noble',
    block: 's',
    group: 18,
    period: 1,
    electronConfig: '1s²',
    oxidationStates: '0',
    summary: 'En kararlı soygazdır. Değerlik elektron sayısı 2 olmasına rağmen 8A grubundadır.',
    osymHint: 'ÖSYM TUZAĞI: Değerlik elektron sayısı 2’dir fakat p-bloku değil, s-blokunda yer alır ve 8A grubundadır! Oktete değil dublete uyar.',
    color: '#a855f7',
  },
  {
    number: 3,
    symbol: 'Li',
    name: 'Lityum',
    mass: 6.94,
    category: 'alkali',
    block: 's',
    group: 1,
    period: 2,
    electronConfig: '[He] 2s¹',
    oxidationStates: '+1',
    summary: 'En hafif metaldir. Pil teknolojisinde ve tıpta kritik öneme sahiptir.',
    osymHint: '1A grubu alkali metalidir. Su ile reaksiyona girdiğinde H₂ gazı açığa çıkarır ve bazik çözelti oluşturur.',
    color: '#ef4444',
  },
  {
    number: 4,
    symbol: 'Be',
    name: 'Berilyum',
    mass: 9.0122,
    category: 'alkaline',
    block: 's',
    group: 2,
    period: 2,
    electronConfig: '[He] 2s²',
    oxidationStates: '+2',
    summary: '2A grubu toprak alkali metalidir. Kovalent karakterli bileşikler yapabilir.',
    osymHint: 'ÖSYM TUZAĞI: 2A grubunda olmasına rağmen bileşikleri (örn. BeCl₂) yüksek oranda kovalent karakter taşır. Ayrıca amfoterdir!',
    color: '#f97316',
  },
  {
    number: 5,
    symbol: 'B',
    name: 'Bor',
    mass: 10.81,
    category: 'metalloid',
    block: 'p',
    group: 13,
    period: 2,
    electronConfig: '[He] 2s² 2p¹',
    oxidationStates: '+3',
    summary: 'Yarı metaldir. Türkiye dünya bor rezervlerinin %70’inden fazlasına sahiptir.',
    osymHint: 'Yarı metaller fiziksel olarak metale, kimyasal olarak ametale benzer. Bor, oktet boşluğu olan (oktetini 6 elektronda bırakan) istisnai elementtir.',
    color: '#10b981',
  },
  {
    number: 6,
    symbol: 'C',
    name: 'Karbon',
    mass: 12.011,
    category: 'nonmetal',
    block: 'p',
    group: 14,
    period: 2,
    electronConfig: '[He] 2s² 2p²',
    oxidationStates: '-4 ile +4 arası',
    summary: 'Organik kimyanın temel taşıdır. Elmas ve grafit gibi doğal allotropları vardır.',
    osymHint: 'AYT Organik Kimya: 4 kovalent bağ yapar. Grafit elektrik akımını iletir (delokalize pi elektronları sayesinde), elmas ise iletmez.',
    color: '#38bdf8',
  },
  {
    number: 7,
    symbol: 'N',
    name: 'Azot',
    mass: 14.007,
    category: 'nonmetal',
    block: 'p',
    group: 15,
    period: 2,
    electronConfig: '[He] 2s² 2p³',
    oxidationStates: '-3 ile +5 arası',
    summary: 'Atmosferin %78’ini oluşturan renksiz, kokusuz gazdır. N≡N üçlü bağı çok güçlüdür.',
    osymHint: 'ÖSYM TUZAĞI: Bütün yanma tepkimeleri ekzotermikken Azot gazının (N₂) yanması ENDOTERMİKTİR! Isı alarak yanar.',
    color: '#38bdf8',
  },
  {
    number: 8,
    symbol: 'O',
    name: 'Oksijen',
    mass: 15.999,
    category: 'nonmetal',
    block: 'p',
    group: 16,
    period: 2,
    electronConfig: '[He] 2s² 2p⁴',
    oxidationStates: '-2, -1, +2',
    summary: 'Havadaki yaşamsal gaz. Yanma olaylarının ana aktörüdür.',
    osymHint: 'ÖSYM TUZAĞI: Oksijen genelde -2 alır. Peroksitlerde -1 (H₂O₂), flor ile yaptığı OF₂ bileşiğinde ise FLOR DAHA ELEKTRONEGATİF OLDUĞU İÇİN +2 alır!',
    color: '#38bdf8',
  },
  {
    number: 9,
    symbol: 'F',
    name: 'Flor',
    mass: 18.998,
    category: 'halogen',
    block: 'p',
    group: 17,
    period: 2,
    electronConfig: '[He] 2s² 2p⁵',
    oxidationStates: '-1 (SADECE)',
    summary: 'Periyodik tablonun en elektronegatif elementidir (Pauling: 4.0).',
    osymHint: 'ÖSYM’nin en sevdiği soru: Flor, tüm bileşiklerinde YALNIZCA -1 yükseltgenme basamağı alır. Asla pozitif değerlik alamaz!',
    color: '#eab308',
  },
  {
    number: 10,
    symbol: 'Ne',
    name: 'Neon',
    mass: 20.180,
    category: 'noble',
    block: 'p',
    group: 18,
    period: 2,
    electronConfig: '[He] 2s² 2p⁶',
    oxidationStates: '0',
    summary: 'Kararlı soygaz. Renkli ışıklı tabelalarda kullanılır.',
    osymHint: 'Oktetini tamamlamıştır (kararlı). Bileşik yapmaya yatkınlığı yoktur.',
    color: '#a855f7',
  },
  {
    number: 11,
    symbol: 'Na',
    name: 'Sodyum',
    mass: 22.990,
    category: 'alkali',
    block: 's',
    group: 1,
    period: 3,
    electronConfig: '[Ne] 3s¹',
    oxidationStates: '+1',
    summary: 'Bıçakla kesilebilecek kadar yumuşak, aşırı aktif bir alkali metaldir.',
    osymHint: 'Suyla şiddetli ve patlamalı tepkime verir: Na + H₂O → NaOH + 1/2 H₂ (Gaz çıkışı ve bazikleşme).',
    color: '#ef4444',
  },
  {
    number: 12,
    symbol: 'Mg',
    name: 'Magnezyum',
    mass: 24.305,
    category: 'alkaline',
    block: 's',
    group: 2,
    period: 3,
    electronConfig: '[Ne] 3s²',
    oxidationStates: '+2',
    summary: 'Parlak beyaz ışıkla yanan toprak alkali metal. Klorofil molekülünün merkezindedir.',
    osymHint: '2A grubudur. Bileşiklerinde daima +2 alır. 2. iyonlaşma enerjisinden 3. iyonlaşma enerjisine geçerken 3.5 kattan fazla sıçrama yapar.',
    color: '#f97316',
  },
  {
    number: 13,
    symbol: 'Al',
    name: 'Alüminyum',
    mass: 26.982,
    category: 'post-transition',
    block: 'p',
    group: 13,
    period: 3,
    electronConfig: '[Ne] 3s² 3p¹',
    oxidationStates: '+3',
    summary: 'Hafif ve korozyona dayanıklı metal. En bilinen amfoter metaldir.',
    osymHint: 'ÖSYM KLASİĞİ: Alüminyum AMFOTERDİR! Hem asitlerle hem de KUVVETLİ bazlarla tepkimeye girerek H₂ gazı üretir. Zayıf bazlarla tepkime vermez.',
    color: '#06b6d4',
  },
  {
    number: 14,
    symbol: 'Si',
    name: 'Silisyum',
    mass: 28.085,
    category: 'metalloid',
    block: 'p',
    group: 14,
    period: 3,
    electronConfig: '[Ne] 3s² 3p²',
    oxidationStates: '-4, +4',
    summary: 'Yarı iletken teknolojisinin ve mikroçiplerin kalbidir.',
    osymHint: 'Yarı iletken özellik gösterir. Sıcaklık arttıkça elektrik iletkenliği metallerin aksine ARTAR.',
    color: '#10b981',
  },
  {
    number: 15,
    symbol: 'P',
    name: 'Fosfor',
    mass: 30.974,
    category: 'nonmetal',
    block: 'p',
    group: 15,
    period: 3,
    electronConfig: '[Ne] 3s² 3p³',
    oxidationStates: '-3, +3, +5',
    summary: 'Beyaz ve kırmızı fosfor gibi allotropları olan ametal.',
    osymHint: 'Ortaokulda katman dağılımı 2-8-5 (3. periyot 5A ametal). Lise/AYT Seviyesi: Küresel simetriktir (son orbitali p³ yarı dolu), bu yüzden 1. iyonlaşma enerjisi 6A grubundan BÜYÜKTÜR (3 aşağı 5 yukarı kuralı)!',
    color: '#38bdf8',
  },
  {
    number: 16,
    symbol: 'S',
    name: 'Kükürt',
    mass: 32.06,
    category: 'nonmetal',
    block: 'p',
    group: 16,
    period: 3,
    electronConfig: '[Ne] 3s² 3p⁴',
    oxidationStates: '-2 ile +6 arası',
    summary: 'Sarı renkli ametal. Zaç yağı (H₂SO₄) üretiminde kullanılır.',
    osymHint: 'İyonlaşma enerjisi sıralamasında 15P’nin ardında kalır çünkü 15P küresel simetridir.',
    color: '#38bdf8',
  },
  {
    number: 17,
    symbol: 'Cl',
    name: 'Klor',
    mass: 35.45,
    category: 'halogen',
    block: 'p',
    group: 17,
    period: 3,
    electronConfig: '[Ne] 3s² 3p⁵',
    oxidationStates: '-1 ile +7 arası',
    summary: 'Yeşilimsi sarı zehirli gaz. Sofra tuzunun (NaCl) bileşenidir.',
    osymHint: 'ÖSYM TUZAĞI: Elektronegatifliği en yüksek element Flor’dur (F) AMA ELEKTRON İLGİSİ EN YÜKSEK ELEMENT KLOR’DUR (Cl)! Bu istisna sınavlarda sürekli çıkar.',
    color: '#eab308',
  },
  {
    number: 18,
    symbol: 'Ar',
    name: 'Argon',
    mass: 39.948,
    category: 'noble',
    block: 'p',
    group: 18,
    period: 3,
    electronConfig: '[Ne] 3s² 3p⁶',
    oxidationStates: '0',
    summary: 'Atmosferde azottan ve oksijenden sonra en bol bulunan 3. gazdır.',
    osymHint: 'Kararlı p⁶ dizilimine sahiptir. İyonlaşma enerjisi 3. periyodun en yükseğidir.',
    color: '#a855f7',
  },
  {
    number: 19,
    symbol: 'K',
    name: 'Potasyum',
    mass: 39.098,
    category: 'alkali',
    block: 's',
    group: 1,
    period: 4,
    electronConfig: '[Ar] 4s¹',
    oxidationStates: '+1',
    summary: 'Bitki beslenmesi ve insan sinir iletimi için vazgeçilmez alkali metal.',
    osymHint: 'Atom yarıçapı Na’dan büyüktür. Yarıçap arttıkça metalik aktiflik ARTAR, metalik bağ kuvveti AZALIR.',
    color: '#ef4444',
  },
  {
    number: 20,
    symbol: 'Ca',
    name: 'Kalsiyum',
    mass: 40.078,
    category: 'alkaline',
    block: 's',
    group: 2,
    period: 4,
    electronConfig: '[Ar] 4s²',
    oxidationStates: '+2',
    summary: 'Kemiklerin ve kireçtaşının (CaCO₃) ana maddesi olan metal.',
    osymHint: 'Suyla yavaşça tepkime verir: Ca + 2H₂O → Ca(OH)₂ + H₂. Sönmüş kireç oluşturur.',
    color: '#f97316',
  },
  {
    number: 24,
    symbol: 'Cr',
    name: 'Krom',
    mass: 51.996,
    category: 'transition',
    block: 'd',
    group: 6,
    period: 4,
    electronConfig: '[Ar] 4s¹ 3d⁵ (İSTİSNA)',
    oxidationStates: '+2, +3, +6',
    summary: 'Paslanmaz çeliğin ana elementi olan geçiş metali.',
    osymHint: 'AYT’NİN EN BÜYÜK SORUSU: Elektron dizilimi 4s² 3d⁴ DEĞİL, küresel simetriye ulaşmak için kendiliğinden 4s¹ 3d⁵ olur! Uyarılmış atom DEĞİLDİR, temel haldir.',
    color: '#6366f1',
  },
  {
    number: 26,
    symbol: 'Fe',
    name: 'Demir (Ferrum)',
    mass: 55.845,
    category: 'transition',
    block: 'd',
    group: 8,
    period: 4,
    electronConfig: '[Ar] 4s² 3d⁶',
    oxidationStates: '+2, +3',
    summary: 'İsmini Ferrum’dan alan, medeniyetin yapı taşı ve kanda hemoglobinin kalbi olan metal.',
    osymHint: 'Elektron koparken en dış katmandan (önce 4s’den) kopar! Fe²⁺ dizilimi [Ar] 3d⁶ olur.',
    color: '#6366f1',
  },
  {
    number: 29,
    symbol: 'Cu',
    name: 'Bakır',
    mass: 63.546,
    category: 'transition',
    block: 'd',
    group: 11,
    period: 4,
    electronConfig: '[Ar] 4s¹ 3d¹⁰ (İSTİSNA)',
    oxidationStates: '+1, +2',
    summary: 'Mükemmel elektrik iletkeni, yarı soy metal.',
    osymHint: '2. BÜYÜK İSTİSNA: Dizilimi 4s² 3d⁹ değil, küresel simetriden dolayı 4s¹ 3d¹⁰ olur! Ayrıca yarı soy metaldir (HNO₃ ve H₂SO₄ gibi oksijenli kuvvetli asitlerle NO₂/SO₂ gazı çıkarır, H₂ ÇIKARAMAZ).',
    color: '#6366f1',
  },
  {
    number: 30,
    symbol: 'Zn',
    name: 'Çinko',
    mass: 65.38,
    category: 'transition',
    block: 'd',
    group: 12,
    period: 4,
    electronConfig: '[Ar] 4s² 3d¹⁰',
    oxidationStates: '+2 (SADECE)',
    summary: 'Galvanizlemede ve korozyon önlemede kullanılan amfoter geçiş metali.',
    osymHint: 'Önemli: Geçiş metali olmasına rağmen bileşiklerinde yalnızca +2 alır. Alüminyum gibi AMFOTERDİR (Kuvvetli bazlarla H₂ gazı açığa çıkarır).',
    color: '#6366f1',
  },
  {
    number: 35,
    symbol: 'Br',
    name: 'Brom',
    mass: 79.904,
    category: 'halogen',
    block: 'p',
    group: 17,
    period: 4,
    electronConfig: '[Ar] 4s² 3d¹⁰ 4p⁵',
    oxidationStates: '-1 ile +7 arası',
    summary: 'Oda sıcaklığında sıvı halde bulunan tek ametaldir.',
    osymHint: 'ÖSYM Sorusu: "Oda koşullarında sıvı olan ametal kimdir?" → BROM (Kırmızı-kahverengi sıvıdır).',
    color: '#eab308',
  },
  {
    number: 80,
    symbol: 'Hg',
    name: 'Cıva',
    mass: 200.59,
    category: 'transition',
    block: 'd',
    group: 12,
    period: 6,
    electronConfig: '[Xe] 4f¹⁴ 5d¹⁰ 6s²',
    oxidationStates: '+1, +2',
    summary: 'Oda sıcaklığında sıvı halde bulunan tek metaldir.',
    osymHint: 'Oda koşullarında tek sıvı metaldir. Soy metaller grubundadır (Yarı soy).',
    color: '#6366f1',
  },
]

const CATEGORY_NAMES: Record<string, string> = {
  all: 'Tüm Elementler',
  alkali: 'Alkali Metaller (1A)',
  alkaline: 'Toprak Alkali (2A)',
  transition: 'Geçiş Metalleri (B Grubu)',
  'post-transition': 'Zayıf Metaller',
  metalloid: 'Yarı Metaller',
  nonmetal: 'Ametaller',
  halogen: 'Halojenler (7A)',
  noble: 'Soygazlar (8A)',
}

export function PeriodicTableModule() {
  const [selectedElement, setSelectedElement] = useState<ElementData>(ELEMENTS_DATA[0])
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredElements = ELEMENTS_DATA.filter((elem) => {
    const matchesFilter =
      activeFilter === 'all' ||
      elem.category === activeFilter ||
      elem.block === activeFilter

    const matchesSearch =
      elem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      elem.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      elem.number.toString() === searchQuery.trim()

    return matchesFilter && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* ── Control Bar: Filters & Search ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl">
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'alkali', label: '1A Alkali' },
            { id: 'alkaline', label: '2A Toprak' },
            { id: 'transition', label: 'Geçiş Metali' },
            { id: 'nonmetal', label: 'Ametaller' },
            { id: 'halogen', label: '7A Halojen' },
            { id: 'noble', label: '8A Soygaz' },
            { id: 's', label: 's-bloku' },
            { id: 'p', label: 'p-bloku' },
            { id: 'd', label: 'd-bloku' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-slate-800/60 text-slate-300 hover:bg-slate-700/60 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Element ara (Örn: Fe, 26, Azot)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* ── Main Layout: Grid on Left, 3D Inspector on Right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Element Cards Matrix (7 Cols on desktop) */}
        <div className="lg:col-span-7 bg-slate-900/50 p-4 sm:p-5 rounded-3xl border border-slate-800/80 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white tracking-wide">
                Periyodik Tablo Koleksiyonu ({filteredElements.length} Element)
              </h3>
            </div>
            <span className="text-[11px] text-slate-400 hidden sm:inline">Elemente tıkla, 3D atom modelini aç</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {filteredElements.map((elem) => {
              const isSelected = selectedElement.number === elem.number
              return (
                <motion.button
                  key={elem.number}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedElement(elem)}
                  className={`relative p-2.5 rounded-2xl flex flex-col justify-between transition-all duration-200 text-left border cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)] ring-2 ring-emerald-500/50'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/90'
                  }`}
                  style={{
                    borderTopColor: elem.color,
                    borderTopWidth: '3px',
                  }}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{elem.number}</span>
                    <span className="text-[9px] px-1 py-0.5 rounded bg-slate-800 text-slate-300 uppercase font-semibold">
                      {elem.block}
                    </span>
                  </div>

                  <div className="my-1.5 flex flex-col items-center">
                    <span
                      className="text-2xl font-black tracking-tight"
                      style={{ color: elem.color }}
                    >
                      {elem.symbol}
                    </span>
                    <span className="text-[10px] font-medium text-slate-300 truncate w-full text-center">
                      {elem.name}
                    </span>
                  </div>

                  <div className="text-[9px] text-slate-400 text-center font-mono truncate">
                    {elem.mass.toFixed(1)}
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* ── Right Column: 3D Atom Inspector & ÖSYM Cheat Sheet ── */}
        <div className="lg:col-span-5 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedElement.number}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-2xl shadow-2xl space-y-5"
            >
              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${selectedElement.color}20`,
                        color: selectedElement.color,
                        border: `1px solid ${selectedElement.color}40`,
                      }}
                    >
                      {CATEGORY_NAMES[selectedElement.category] || selectedElement.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {selectedElement.period}. Periyot / {selectedElement.group}. Grup
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-white mt-1">
                    {selectedElement.name}{' '}
                    <span className="text-emerald-400 font-mono">({selectedElement.symbol})</span>
                  </h2>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-slate-300 font-mono">
                    #{selectedElement.number}
                  </span>
                  <p className="text-[11px] text-slate-400 font-mono">Kütle: {selectedElement.mass}</p>
                </div>
              </div>

              {/* 3D Atom Visualizer Canvas */}
              <AtomVisualizer3D
                elementSymbol={selectedElement.symbol}
                elementName={selectedElement.name}
                atomicNumber={selectedElement.number}
                colorHex={selectedElement.color}
              />

              {/* Quick Spec Matrix */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Elektron Dizilimi</span>
                  <div className="font-mono text-emerald-300 font-bold mt-0.5 truncate">
                    {selectedElement.electronConfig}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Yükseltgenme Basamağı</span>
                  <div className="font-mono text-cyan-300 font-bold mt-0.5">
                    {selectedElement.oxidationStates}
                  </div>
                </div>
              </div>

              {/* Element Summary */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                {selectedElement.summary}
              </p>

              {/* ── ÖSYM Sınav Tuzağı & Hap Bilgi Kartı ── */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)] relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    ÖSYM / YKS Kritik Notu
                  </span>
                </div>
                <p className="text-xs text-amber-100/90 leading-relaxed font-medium">
                  {selectedElement.osymHint}
                </p>
              </div>

              {/* Call to Action for Private Lesson */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  Kimya konularını tam oturtmak ister misin?
                </div>
                <Link
                  href="/instructors?subject=Kimya"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold border border-emerald-500/30 transition-all"
                >
                  <span>Eğitmenle Çöz</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
