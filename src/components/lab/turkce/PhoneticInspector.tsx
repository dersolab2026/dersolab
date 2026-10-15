'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Layers, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react'

interface WordAnalysis {
  word: string
  hasEvents: boolean
  events: {
    name: string
    root: string
    suffix: string
    rule: string
    color: string
  }[]
}

const SAMPLE_SENTENCES = [
  {
    text: 'Gözlerindeki hüznü kaybolmuş sandığım anda sıcacık bir tebessümle yüzüme baktı.',
    analyses: [
      {
        word: 'hüznü',
        hasEvents: true,
        events: [
          {
            name: 'Ünlü Düşmesi',
            root: 'Hüzün',
            suffix: '-ü (Belirtme eki)',
            rule: 'İki heceli kelimeler ünlüyle başlayan ek aldığında ikinci hecedeki dar ünlü (ü) düşer: Hüzün + ü → Hüznü',
            color: '#38bdf8',
          },
        ],
      },
      {
        word: 'kaybolmuş',
        hasEvents: true,
        events: [
          {
            name: 'Ünlü Düşmesi',
            root: 'Kayıp',
            suffix: 'olmak',
            rule: 'Kayıp kelimesindeki "ı" sesi birleşme sırasında düşmüştür: Kayıp + olmak → Kaybolmak.',
            color: '#38bdf8',
          },
          {
            name: 'Ünsüz Yumuşaması (Değişimi)',
            root: 'Kayıp',
            suffix: 'olmak',
            rule: 'Sert ünsüz "p", ünlüyle başlayan kelimeyle birleşirken yumuşayarak "b"ye dönüşmüştür: p → b.',
            color: '#10b981',
          },
        ],
      },
      {
        word: 'sandığım',
        hasEvents: true,
        events: [
          {
            name: 'Ünsüz Yumuşaması (Değişimi)',
            root: 'San-dık',
            suffix: '-ım (İyelik)',
            rule: 'Sıfat-fiil eki "-dık"taki sert "k" ünsüzü, ünlüyle başlayan iyelik eki alınca yumuşak g\'ye (ğ) dönüşmüştür: k → ğ.',
            color: '#10b981',
          },
        ],
      },
      {
        word: 'sıcacık',
        hasEvents: true,
        events: [
          {
            name: 'Ünsüz Düşmesi',
            root: 'Sıcak',
            suffix: '-cık (Küçültme)',
            rule: '"Sıcak" sözcüğü "-cık" küçültme ekini alırken sonundaki "k" sert ünsüzü düşmüştür: Sıcak + cık → Sıcacık.',
            color: '#a855f7',
          },
        ],
      },
      {
        word: 'tebessümle',
        hasEvents: true,
        events: [
          {
            name: 'Ünlü Düşmesi',
            root: 'Tebessüm',
            suffix: 'ile (Vasıta eki)',
            rule: '"İle" edatı kelimeye eklenirken başındaki "i" ünlüsü düşmüştür: Tebessüm + ile → Tebessümle.',
            color: '#38bdf8',
          },
        ],
      },
      {
        word: 'baktı',
        hasEvents: true,
        events: [
          {
            name: 'Ünsüz Benzeşmesi (Sertleşmesi)',
            root: 'Bak-',
            suffix: '-dı (Görülen geçmiş zaman)',
            rule: 'Fıstıkçı Şahap sert ünsüzlerinden "k" ile biten fiile gelen "-dı" ekinin başındaki "d" sertleşerek "t"ye dönüşmüştür: d → t.',
            color: '#f59e0b',
          },
        ],
      },
    ],
  },
]

export function PhoneticInspector() {
  const [selectedWord, setSelectedWord] = useState<WordAnalysis | null>(
    SAMPLE_SENTENCES[0].analyses[1] // default to 'kaybolmuş' (has multiple events)
  )

  const currentSentence = SAMPLE_SENTENCES[0]
  const rawWords = currentSentence.text.split(' ')

  const getAnalysis = (raw: string): WordAnalysis | undefined => {
    const clean = raw.replace(/[.,]/g, '')
    return currentSentence.analyses.find((a) => a.word.toLowerCase() === clean.toLowerCase())
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* ── Banner ── */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider border border-purple-500/30">
              Maarif Modeli & MEB
            </span>
            <span className="text-xs text-slate-400">5 - 12. Sınıf Dil Bilgisi</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            Cümledeki Ses Olaylarını Keşfet
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            MEB müfredatında yer alan ünlü düşmesi, ünsüz sertleşmesi ve yumuşamasını kelimeleri parçalayarak inceleyin.
          </p>
        </div>
      </div>

      {/* ── Interactive Sentence Board ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Örnek Çözüm Cümlesi (Kelimelere Tıklayın)
          </span>
          <span className="text-[11px] text-slate-500">Ses olayı olanlar renkli vurgulanır</span>
        </div>

        {/* Sentence Words */}
        <div className="flex flex-wrap items-center gap-2 py-4">
          {rawWords.map((rawWord, idx) => {
            const cleanWord = rawWord.replace(/[.,]/g, '')
            const analysis = getAnalysis(cleanWord)
            const isSelected = selectedWord?.word === cleanWord

            return (
              <button
                key={idx}
                onClick={() => analysis && setSelectedWord(analysis)}
                className={`text-lg sm:text-xl font-medium px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                  analysis
                    ? isSelected
                      ? 'bg-purple-500 text-slate-950 font-black shadow-[0_0_20px_rgba(168,85,247,0.4)] scale-105'
                      : 'bg-slate-800/80 text-purple-200 hover:bg-slate-700 border border-purple-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {rawWord}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Word Breakdown Inspector ── */}
      {selectedWord && (
        <motion.div
          key={selectedWord.word}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-slate-900/90 border border-purple-500/40 backdrop-blur-xl space-y-4 shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">İncelenen Kelime</span>
              <h3 className="text-2xl font-black text-white font-mono">
                "{selectedWord.word}"
              </h3>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
              {selectedWord.events.length} Ses Olayı Bulundu
            </span>
          </div>

          {/* Events List */}
          <div className="space-y-3">
            {selectedWord.events.map((ev, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2"
                style={{ borderLeftColor: ev.color, borderLeftWidth: '4px' }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: `${ev.color}20`, color: ev.color }}
                  >
                    {ev.name}
                  </span>
                  <div className="text-xs font-mono text-slate-400">
                    Kök: <strong className="text-slate-200">{ev.root}</strong> + Ek: <strong className="text-slate-200">{ev.suffix}</strong>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  {ev.rule}
                </p>
              </div>
            ))}
          </div>

          {/* Sınav Kuralı Notu */}
          <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 flex items-center justify-between">
            <span>Ses olaylarında kök ve ek ayrımını doğru yapmak ÖSYM sorularında %100 doğruluk sağlar.</span>
            <a
              href="/instructors"
              className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 shrink-0 ml-4"
            >
              <span>Türkçe Hocalarımız</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      )}
    </div>
  )
}
