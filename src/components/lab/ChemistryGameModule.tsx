'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, HelpCircle, Check, X, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react'
import { ELEMENTS_DATA, ElementData } from './PeriodicTableModule'

interface MysteryQuestion {
  element: ElementData
  clues: string[]
}

const GAME_QUESTIONS: MysteryQuestion[] = [
  {
    element: ELEMENTS_DATA.find((e) => e.symbol === 'Na')!,
    clues: [
      '1A grubunda, 3. periyotta yer alan son derece aktif bir elementim.',
      'Bıçakla tereyağı gibi kesilebilecek kadar yumuşak, gümüşi parlak bir metalim.',
      'Su ile temas ettiğimde patlamalı reaksiyon verip H₂ gazı ve kuvvetli bir baz açığa çıkarırım.',
      'Klor (Cl) ile yaptığım iyonik bileşiğim her gün sofralarda yemek tuzu olarak tüketilir.',
      'Baş harfim "S", sembolüm Latince "Natrium" kelimesinden gelir.',
    ],
  },
  {
    element: ELEMENTS_DATA.find((e) => e.symbol === 'O')!,
    clues: [
      '2. periyot, 6A (kalkojenler) grubunda bulunan yaşamsal bir ametalim.',
      'Oda koşullarında diatomik (ikili) gaz halinde bulunurum ve renksizim.',
      'Tüm yanma olaylarının olmazsa olmaz aktörüyüm.',
      'Bileşiklerimde genelde -2 alırım fakat Flor ile yaptığım bileşikte (OF₂) +2 değerlik alırım.',
      'Sembolüm "O", atmosferin yaklaşık %21’ini oluştururum.',
    ],
  },
  {
    element: ELEMENTS_DATA.find((e) => e.symbol === 'Fe')!,
    clues: [
      '4. periyotta yer alan, d-bloku geçiş metal grubu üyesiyim.',
      'İsmim Latincede "Ferrum" olarak geçer ve medeniyetin yapı taşıyım.',
      'Kanda hemoglobinin merkezinde yer alarak oksijen taşınmasını sağlarım.',
      'Elektron dizilimim [Ar] 4s² 3d⁶ şeklindedir ve bileşiklerimde genellikle +2 ve +3 yükseltgenme basamağı alırım.',
      'Atom numaram 26, sembolüm "Fe"dir.',
    ],
  },
  {
    element: ELEMENTS_DATA.find((e) => e.symbol === 'F')!,
    clues: [
      '2. periyot, 7A grubunda (Halojenler) yer alan zehirli, sarımsı bir gazım.',
      'Periyodik cetvelin tartışmasız EN ELEKTRONEGATİF elementiyim (Pauling skalasında 4.0).',
      'Elektron çekim gücüm o kadar yüksektir ki bileşiklerimde İSTİSNASIZ SADECE -1 değerlik alırım.',
      'Asla pozitif değerlik alamam; en kararlı elementleri bile oksitleyebilirim.',
      'Sembolüm "F", atom numaram 9’dur.',
    ],
  },
  {
    element: ELEMENTS_DATA.find((e) => e.symbol === 'He')!,
    clues: [
      'Evrende hidrojenden sonra en çok bulunan 2. elementim.',
      'Değerlik elektron sayım 2 olmasına rağmen 8A soygazlar grubundayım.',
      'Uçan balonların dolumunda ve MR cihazlarının süperiletken mıknatıslarını soğutmada kullanılırım.',
      'Kararlıyım, p-blokunda değil s-blokunda yer alırım ve oktete değil dublete uyarım.',
      'Sembolüm "He", atom numaram 2’dir.',
    ],
  },
]

export function ChemistryGameModule() {
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [guess, setGuess] = useState<string>('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing')
  const [errorMsg, setErrorMsg] = useState<string>('')

  const currentQ = GAME_QUESTIONS[currentIndex]
  const maxAttempts = 5
  const currentAttempt = guesses.length

  const handleGuessSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!guess.trim() || gameState !== 'playing') return

    const cleanGuess = guess.trim().toLowerCase()
    const targetSymbol = currentQ.element.symbol.toLowerCase()
    const targetName = currentQ.element.name.toLowerCase()

    const isCorrect = cleanGuess === targetSymbol || cleanGuess === targetName

    const newGuesses = [...guesses, guess.trim()]
    setGuesses(newGuesses)
    setGuess('')
    setErrorMsg('')

    if (isCorrect) {
      setGameState('won')
    } else if (newGuesses.length >= maxAttempts) {
      setGameState('lost')
    }
  }

  const handleNextGame = () => {
    setCurrentIndex((prev) => (prev + 1) % GAME_QUESTIONS.length)
    setGuesses([])
    setGuess('')
    setGameState('playing')
    setErrorMsg('')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* ── Game Header ── */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
              Kimya-Le
            </span>
            <span className="text-xs text-slate-400">Günün Gizemli Elementini Bul</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            Element Dedektifi #{currentIndex + 1}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Her yanlış tahminde yeni bir YKS ipucu açılır. Toplam 5 hakkın var!
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/80 p-3 px-4 rounded-2xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400">Kalan Hak</span>
            <div className="text-lg font-black text-emerald-400 font-mono">
              {maxAttempts - guesses.length} / {maxAttempts}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mystery Clues Container ── */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
          Açılan Sınav İpuçları
        </h3>

        {currentQ.clues.map((clue, idx) => {
          const isUnlocked = idx <= guesses.length
          const isCurrentClue = idx === guesses.length

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 ${
                isUnlocked
                  ? isCurrentClue
                    ? 'bg-emerald-950/30 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-200'
                  : 'bg-slate-950/40 border-slate-800/40 opacity-40'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0 font-mono ${
                  isUnlocked
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-slate-800 text-slate-500'
                }`}
              >
                {idx + 1}
              </div>

              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  İpucu {idx + 1}
                </span>
                <p className="text-xs sm:text-sm font-medium leading-relaxed">
                  {isUnlocked ? clue : '•••••••••••••••••••••••••••••••••••••••••• (Yanlış tahminde açılır)'}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* ── Input & Guess Action ── */}
      {gameState === 'playing' ? (
        <form
          onSubmit={handleGuessSubmit}
          className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Element adı veya sembolü gir (Örn: Sodyum ya da Na)..."
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors font-medium"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!guess.trim()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Tahmin Et</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      ) : (
        /* ── Win / Loss Result Modal ── */
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`p-6 rounded-3xl border text-center space-y-4 ${
            gameState === 'won'
              ? 'bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-500/60 shadow-[0_0_40px_rgba(16,185,129,0.25)]'
              : 'bg-gradient-to-b from-rose-950/60 to-slate-900 border-rose-500/60 shadow-[0_0_40px_rgba(244,63,94,0.25)]'
          }`}
        >
          <div className="inline-flex p-3 rounded-2xl bg-white/10 mx-auto">
            {gameState === 'won' ? (
              <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
            ) : (
              <AlertTriangle className="w-8 h-8 text-rose-400" />
            )}
          </div>

          <div>
            <h3 className="text-xl font-black text-white">
              {gameState === 'won'
                ? `Tebrikler! ${guesses.length}. Denemede Buldun! 🎉`
                : 'Hakların Bitti! 😔'}
            </h3>
            <p className="text-sm text-slate-300 mt-1">
              Doğru Cevap:{' '}
              <span className="font-black text-emerald-400">
                {currentQ.element.name} ({currentQ.element.symbol}) — Atom No: {currentQ.element.number}
              </span>
            </p>
          </div>

          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            {currentQ.element.osymHint}
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <button
              onClick={handleNextGame}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Sonraki Elementi Çöz</span>
            </button>
            <Link
              href="/instructors?subject=Kimya"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all flex items-center gap-1.5"
            >
              <span>Kimya Hocalarımızı Gör</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>
      )}

      {/* ── Attempt Badges ── */}
      {guesses.length > 0 && gameState === 'playing' && (
        <div className="flex items-center gap-2 flex-wrap px-1">
          <span className="text-xs text-slate-400 font-semibold">Önceki Tahminlerin:</span>
          {guesses.map((g, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-400 text-xs font-mono border border-rose-500/20"
            >
              ❌ {g}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
