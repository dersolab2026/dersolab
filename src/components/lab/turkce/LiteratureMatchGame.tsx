'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Check, X, RotateCcw, ArrowRight, Zap, BookMarked } from 'lucide-react'

interface LiteratureItem {
  work: string
  author: string
  period: string
  genre: string
  characters: string
  osymTip: string
  wrongOptions: { author: string; period: string }[]
}

const LITERATURE_DATA: LiteratureItem[] = [
  {
    work: 'Mai ve Siyah',
    author: 'Halit Ziya Uşaklıgil',
    period: 'Servet-i Fünun',
    genre: 'Roman',
    characters: 'Ahmet Cemil, Lamia, Raci',
    osymTip: 'ÖSYM’nin en sevdiği roman. Ahmet Cemil, Servet-i Fünun neslinin sembolüdür (mavi hayaller, siyah gerçekler). Batılı anlamda ilk kusursuz roman kabul edilir.',
    wrongOptions: [
      { author: 'Mehmet Rauf', period: 'Servet-i Fünun' },
      { author: 'Recaizade Mahmut Ekrem', period: 'Tanzimat II. Dönem' },
      { author: 'Yakup Kadri Karaosmanoğlu', period: 'Millî Edebiyat' },
    ],
  },
  {
    work: 'Araba Sevdası',
    author: 'Recaizade Mahmut Ekrem',
    period: 'Tanzimat II. Dönem',
    genre: 'Roman (İlk Realist)',
    characters: 'Bihruz Bey, Periveş, Keşfi Bey',
    osymTip: 'Türk edebiyatındaki İLK REALİST romandır. Yanlış Batılılaşmayı ve alafrangalık özentisi Bihruz Bey karakterini hicveder.',
    wrongOptions: [
      { author: 'Namık Kemal', period: 'Tanzimat I. Dönem' },
      { author: 'Ahmet Mithat Efendi', period: 'Tanzimat I. Dönem' },
      { author: 'Halit Ziya Uşaklıgil', period: 'Servet-i Fünun' },
    ],
  },
  {
    work: 'Yaban',
    author: 'Yakup Kadri Karaosmanoğlu',
    period: 'Millî Edebiyat / Cumhuriyet',
    genre: 'Tezli Roman',
    characters: 'Ahmet Celal, Emine, Salih Ağa',
    osymTip: 'Aydın - köylü çatışmasını ve Kurtuluş Savaşı döneminde Anadolu gerçeğini işleyen en önemli tezli romandır. Ahmet Celal gazi bir subaydır.',
    wrongOptions: [
      { author: 'Reşat Nuri Güntekin', period: 'Millî Edebiyat' },
      { author: 'Halide Edib Adıvar', period: 'Millî Edebiyat' },
      { author: 'Peyami Safa', period: 'Cumhuriyet Dönemi' },
    ],
  },
  {
    work: 'Saatleri Ayarlama Enstitüsü',
    author: 'Ahmet Hamdi Tanpınar',
    period: 'Cumhuriyet (Bireyin İç Dünyası)',
    genre: 'Modernist Roman',
    characters: 'Hayri İrdal, Halit Ayarcı, Pakize',
    osymTip: 'Doğu ile Batı arasında sıkışmış Türk toplumunu saat metaforu üzerinden hicveden başyapıt. Zaman, rüya ve bilinçaltı temaları hâkimdir.',
    wrongOptions: [
      { author: 'Oğuz Atay', period: 'Cumhuriyet (Postmodern)' },
      { author: 'Tarık Buğra', period: 'Cumhuriyet Dönemi' },
      { author: 'Kemal Tahir', period: 'Toplumcu Gerçekçi' },
    ],
  },
  {
    work: 'Kutadgu Bilig',
    author: 'Yusuf Has Hacip',
    period: 'Geçiş Dönemi (11. Yüzyıl)',
    genre: 'Alegorik Mesnevi / Siyasetname',
    characters: 'Kün Togdı (Adalet), Ay Toldı (Mutluluk), Ögdülmiş (Akıl), Odgurmış (Akıbet)',
    osymTip: 'İslamî dönemin İLK eseri, İLK mesnevisi ve İLK siyasetnamesidir. Aruz ölçüsüyle ve Hakaniye lehçesiyle yazılmıştır. 4 alegorik karakter ÖSYM’de doğrudan sorulur!',
    wrongOptions: [
      { author: 'Kaşgarlı Mahmud', period: 'Geçiş Dönemi' },
      { author: 'Edip Ahmet Yükneki', period: 'Geçiş Dönemi' },
      { author: 'Hoca Ahmet Yesevi', period: 'Geçiş Dönemi' },
    ],
  },
  {
    work: 'Şair Evlenmesi',
    author: 'Şinasi',
    period: 'Tanzimat I. Dönem',
    genre: 'İlk Tiyatro (Töre Komedisi)',
    characters: 'Müştak Bey, Kumru Hanım, Sakine Hanım, Hikmet Efendi',
    osymTip: 'Batılı anlamda yazılan İLK Türk tiyatro eseridir. Görücü usulü evliliğin sakıncalarını işler. Noktalama işaretlerinin ilk kez kullanıldığı eserdir.',
    wrongOptions: [
      { author: 'Namık Kemal', period: 'Tanzimat I. Dönem' },
      { author: 'Ahmet Vefik Paşa', period: 'Tanzimat I. Dönem' },
      { author: 'Direktör Ali Bey', period: 'Tanzimat I. Dönem' },
    ],
  },
]

export function LiteratureMatchGame() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  const currentItem = LITERATURE_DATA[currentIndex]

  // Options shuffled or combined (correct + 3 wrong)
  const [shuffledOptions] = useState(() => {
    return LITERATURE_DATA.map((item) => {
      const correct = { author: item.author, period: item.period, isCorrect: true }
      const wrongs = item.wrongOptions.map((w) => ({ ...w, isCorrect: false }))
      return [correct, ...wrongs].sort(() => Math.random() - 0.5)
    })
  })

  const currentOptions = shuffledOptions[currentIndex]

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return
    setSelectedOption(idx)
    setIsAnswered(true)

    const chosen = currentOptions[idx]
    if (chosen.isCorrect) {
      setScore((s) => s + 100 + streak * 20)
      setStreak((st) => st + 1)
    } else {
      setStreak(0)
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 >= LITERATURE_DATA.length) {
      setIsFinished(true)
    } else {
      setCurrentIndex((prev) => prev + 1)
      setIsAnswered(false)
      setSelectedOption(null)
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setScore(0)
    setStreak(0)
    setIsAnswered(false)
    setSelectedOption(null)
    setIsFinished(false)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ── Banner: Net ve Geniş Başlık ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Yazar Eser Eşleştirme
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
            Eserin yazarını ve edebî dönemini doğru eşleştir, seri yap ve kritik sınav ipuçlarını yakala.
          </p>
        </div>

        {/* Score & Streak */}
        <div className="flex items-center gap-4 bg-slate-950/80 p-3 px-5 rounded-2xl border border-slate-800 self-stretch sm:self-auto justify-between sm:justify-start">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Puan</span>
            <div className="text-xl font-black text-amber-400 font-mono">{score}</div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Seri (Streak)</span>
            <div className="text-xl font-black text-orange-400 font-mono">🔥 {streak}</div>
          </div>
        </div>
      </div>

      {!isFinished ? (
        /* ── Active Game Card ── */
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-6 shadow-2xl relative overflow-hidden">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-400">
                Soru {currentIndex + 1} / {LITERATURE_DATA.length}
              </span>
            </div>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              Tür: {currentItem.genre}
            </span>
          </div>

          {/* Master Work Name Display */}
          <div className="text-center py-6 space-y-2">
            <span className="text-[11px] uppercase tracking-widest text-slate-400 font-bold">
              Aşağıdaki Eser Kime Aittir?
            </span>
            <motion.h3
              key={currentItem.work}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 tracking-tight"
            >
              "{currentItem.work}"
            </motion.h3>
            <p className="text-xs text-slate-400">
              Önemli Kahramanlar: <span className="text-slate-200 font-medium">{currentItem.characters}</span>
            </p>
          </div>

          {/* Options Grid (4 options) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentOptions.map((opt, idx) => {
              const isSelected = selectedOption === idx
              let btnStyle = 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-200'

              if (isAnswered) {
                if (opt.isCorrect) {
                  btnStyle = 'bg-emerald-950/60 border-emerald-500 text-emerald-300 font-bold shadow-[0_0_20px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400'
                } else if (isSelected && !opt.isCorrect) {
                  btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-300 font-bold'
                } else {
                  btnStyle = 'bg-slate-950/30 border-slate-800/40 text-slate-500 opacity-40'
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[76px] ${btnStyle}`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm font-black">{opt.author}</span>
                    {isAnswered && (
                      <span>
                        {opt.isCorrect ? <Check className="w-4 h-4 text-emerald-400" /> : isSelected ? <X className="w-4 h-4 text-rose-400" /> : null}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-mono mt-1">
                    Dönem: {opt.period}
                  </span>
                </button>
              )
            })}
          </div>

          {/* ÖSYM Cheat Sheet Card on Answer */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent border border-amber-500/30 space-y-2"
              >
                <div className="flex items-center gap-1.5 text-amber-400">
                  <Zap className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    ÖSYM Kritik Sınav Notu:
                  </span>
                </div>
                <p className="text-xs text-amber-100/90 leading-relaxed font-medium">
                  {currentItem.osymTip}
                </p>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-lg"
                  >
                    <span>{currentIndex + 1 < LITERATURE_DATA.length ? 'Sonraki Eser' : 'Sonucu Gör'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      ) : (
        /* ── End Game Celebration ── */
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 rounded-3xl bg-slate-900/90 border border-amber-500/40 text-center space-y-5 shadow-2xl"
        >
          <div className="inline-flex p-4 rounded-2xl bg-amber-500/20 text-amber-400">
            <Trophy className="w-10 h-10 animate-bounce" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white">Edebiyat Turu Tamamlandı!</h3>
            <p className="text-sm text-slate-300 mt-1">
              Toplam Skor: <strong className="text-amber-400 font-mono text-lg">{score} Puan</strong>
            </p>
          </div>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            AYT Edebiyatta yazar-eser ezberini oturtmanın en hızlı yolu düzenli tekrar yapmaktır.
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Yeniden Başla</span>
            </button>
            <Link
              href="/instructors?category=Sözel"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <span>Edebiyat Öğretmenlerini Gör</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  )
}
