'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Sparkles,
  Search,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Tag,
  ArrowRight,
} from 'lucide-react'

interface ParsedToken {
  text: string
  role: 'Özne' | 'Yüklem' | 'Belirtili Nesne' | 'Belirtisiz Nesne' | 'Yer Tamlayıcısı (D.T.)' | 'Zarf Tümleci'
  question: string
  verbForm?: 'İsim-Fiil (-ma/-ış/-mak)' | 'Sıfat-Fiil (-an/-ası/-mez...)' | 'Zarf-Fiil (-ken/-ince/-erek...)'
  color: string
}

interface SampleSentence {
  id: string
  title: string
  grade: string
  tokens: ParsedToken[]
  explanation: string
}

const SAMPLE_SENTENCES: SampleSentence[] = [
  {
    id: 's1',
    title: 'LGS Klasik Öge & Sıfat-Fiil Dizilimi',
    grade: '8. Sınıf LGS',
    explanation: 'Özne + Zarf Tümleci + Yer Tamlayıcısı + Belirtili Nesne + Yüklem dizilimi. "ağlayan" kelimesi sıfat-fiildir.',
    tokens: [
      { text: 'Ağlayan küçük çocuk,', role: 'Özne', question: 'Kim?', verbForm: 'Sıfat-Fiil (-an/-ası/-mez...)', color: 'border-blue-500/40 bg-blue-500/10 text-blue-300' },
      { text: 'akşam saatlerinde', role: 'Zarf Tümleci', question: 'Ne zaman?', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
      { text: 'parkın en kuytu köşesinde', role: 'Yer Tamlayıcısı (D.T.)', question: 'Nerede?', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
      { text: 'kaybettiği oyuncağını', role: 'Belirtili Nesne', question: 'Neyi?', verbForm: 'Sıfat-Fiil (-an/-ası/-mez...)', color: 'border-purple-500/40 bg-purple-500/10 text-purple-300' },
      { text: 'sabırla arıyordu.', role: 'Yüklem', question: 'Temel Yargı', color: 'border-rose-500/40 bg-rose-500/10 text-rose-300' },
    ],
  },
  {
    id: 's2',
    title: 'TYT Türkçe Zarf-Fiil & Belirtisiz Nesne',
    grade: '11. Sınıf TYT',
    explanation: 'Zarf Tümleci + Özne + Belirtisiz Nesne + Yüklem. "gülümseyerek" kelimesi zarf-fiildir (-erek).',
    tokens: [
      { text: 'İçeriye girince', role: 'Zarf Tümleci', question: 'Ne zaman?', verbForm: 'Zarf-Fiil (-ken/-ince/-erek...)', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
      { text: 'ihtiyar adam,', role: 'Özne', question: 'Kim?', color: 'border-blue-500/40 bg-blue-500/10 text-blue-300' },
      { text: 'bize', role: 'Yer Tamlayıcısı (D.T.)', question: 'Kime?', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
      { text: 'sıcak bir çay', role: 'Belirtisiz Nesne', question: 'Ne?', color: 'border-purple-500/40 bg-purple-500/10 text-purple-300' },
      { text: 'ikram etti.', role: 'Yüklem', question: 'Temel Yargı (Birleşik Fiil)', color: 'border-rose-500/40 bg-rose-500/10 text-rose-300' },
    ],
  },
  {
    id: 's3',
    title: 'İsim-Fiil ve Ara Sözlü Cümle',
    grade: '8. Sınıf LGS',
    explanation: '"okumak" mastarı isim-fiildir (-mak). Cümle Özne + Zarf Tümleci + Yüklem yapısındadır.',
    tokens: [
      { text: 'Kitap okumak,', role: 'Özne', question: 'Ne?', verbForm: 'İsim-Fiil (-ma/-ış/-mak)', color: 'border-blue-500/40 bg-blue-500/10 text-blue-300' },
      { text: 'insanın hayal dünyasını', role: 'Belirtili Nesne', question: 'Neyi?', color: 'border-purple-500/40 bg-purple-500/10 text-purple-300' },
      { text: 'sonsuz ufuklara', role: 'Yer Tamlayıcısı (D.T.)', question: 'Nereye?', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' },
      { text: 'büyük bir hızla', role: 'Zarf Tümleci', question: 'Nasıl?', color: 'border-amber-500/40 bg-amber-500/10 text-amber-300' },
      { text: 'taşır.', role: 'Yüklem', question: 'Temel Yargı', color: 'border-rose-500/40 bg-rose-500/10 text-rose-300' },
    ],
  },
]

export function SentenceParserModule() {
  const [selectedSentenceId, setSelectedSentenceId] = useState<string>('s1')
  const [activeTokenIndex, setActiveTokenIndex] = useState<number | null>(null)

  const cur = SAMPLE_SENTENCES.find((s) => s.id === selectedSentenceId) || SAMPLE_SENTENCES[0]
  const activeToken = activeTokenIndex !== null ? cur.tokens[activeTokenIndex] : null

  return (
    <div className="space-y-6">
      {/* ── Header Card ── */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              8. Sınıf LGS & TYT Türkçe
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold">
              Ögeler & Fiilimsiler
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Cümlenin Ögeleri & Fiilimsiler (Eylemsiler) Çözümleyici
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl">
            Cümleleri öbeklerine ayırarak yükleme sorulan sorularla özne, nesne, yer tamlayıcısı ve zarf tümleçlerini; sıfat-fiil, isim-fiil ve zarf-fiil eklerini adım adım inceleyin.
          </p>
        </div>

        {/* Sentence Selector */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex-wrap">
          {SAMPLE_SENTENCES.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSelectedSentenceId(s.id)
                setActiveTokenIndex(null)
              }}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                selectedSentenceId === s.id
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cümle {idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Canvas & Controls Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sentence Block Visualization (7 cols) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="p-5 sm:p-6 rounded-3xl bg-[#030712] border border-slate-800/90 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                {cur.title}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-slate-400 font-semibold text-[11px]">
                {cur.grade}
              </span>
            </div>

            {/* Clickable Sentence Token Pills */}
            <div className="p-5 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center gap-2.5 min-h-[110px]">
              {cur.tokens.map((token, idx) => {
                const isSelected = activeTokenIndex === idx
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveTokenIndex(idx)}
                    className={`px-3.5 py-2.5 rounded-2xl border text-sm sm:text-base font-extrabold transition-all cursor-pointer ${
                      token.color
                    } ${
                      isSelected
                        ? 'ring-2 ring-amber-400 scale-105 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                        : 'hover:brightness-125'
                    }`}
                  >
                    <div>{token.text}</div>
                    <div className="text-[10px] font-bold uppercase tracking-wider opacity-80 mt-0.5">
                      {token.role}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Active Token Analysis Drawer */}
            {activeToken ? (
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-amber-500/30 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="text-base font-black text-white">&quot;{activeToken.text}&quot;</div>
                  <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
                    {activeToken.role}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400">Yükleme Sorulan:</span>
                    <div className="font-bold text-cyan-400 font-mono mt-0.5">{activeToken.question}</div>
                  </div>
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-slate-400">Fiilimsi Durumu:</span>
                    <div className="font-bold text-emerald-400 mt-0.5">
                      {activeToken.verbForm || 'Fiilimsi Yok'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-dashed border-slate-800 text-center text-xs text-slate-500">
                Detaylı soru ve fiilimsi analizini görmek için yukarıdaki ögelerden birine tıklayın.
              </div>
            )}

            {/* Explanation Note */}
            <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
              {cur.explanation}
            </p>
          </div>
        </div>

        {/* Question Guide Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-900/70 border border-slate-800 backdrop-blur-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Öge Bulma Sırası & Altın Sorular</span>
            </h3>

            {/* Step list */}
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-between">
                <div>
                  <strong>1. Adım: YÜKLEM</strong>
                  <div className="text-[10px] text-slate-300">İlk önce cümlenin yargısı bulunur (fiil veya ek fiilli isim).</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 flex items-center justify-between">
                <div>
                  <strong>2. Adım: ÖZNE</strong>
                  <div className="text-[10px] text-slate-300">Yükleme sorulur: <em>Kim?</em> veya <em>Ne?</em> (Yapan kim?)</div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 flex items-center justify-between">
                <div>
                  <strong>3. Adım: NESNE</strong>
                  <div className="text-[10px] text-slate-300">Belirtili: <em>Kimi? Neyi?</em> | Belirtisiz: <em>Ne?</em></div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 flex items-center justify-between">
                <div>
                  <strong>4. Adım: YER TAMLAYICISI</strong>
                  <div className="text-[10px] text-slate-300">İsmin -e, -de, -den halleri: <em>Kime/de/den? Nereye/de/den?</em></div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 flex items-center justify-between">
                <div>
                  <strong>5. Adım: ZARF TÜMLECİ</strong>
                  <div className="text-[10px] text-slate-300">Durum ve zaman: <em>Nasıl? Ne zaman? Neden? Ne kadar?</em></div>
                </div>
              </div>
            </div>
          </div>

          {/* Fiilimsi Kodlama Kartı */}
          <div className="p-4 rounded-3xl bg-slate-900/50 border border-slate-800 text-xs space-y-2">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Fiilimsi Ekleri Kodlaması</span>
            </div>
            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div>
                <strong className="text-cyan-400">İsim-Fiil:</strong> &quot;MA - Y - IŞ - MAK&quot; (-ma, -ış, -mak)
              </div>
              <div>
                <strong className="text-emerald-400">Sıfat-Fiil:</strong> &quot;AN - ASI - MEZ - AR - DİK - ECEK - MİŞ&quot;
              </div>
              <div>
                <strong className="text-amber-400">Zarf-Fiil:</strong> -ken, -alı, -asya, -e...-e, -ince, -ip, -arak, -dıkça, -r...-mez
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
