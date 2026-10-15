'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, RotateCcw, Eye, Zap, BookOpen, CheckCircle2, XCircle, ArrowRight } from 'lucide-react'

const PARAGRAPHS = [
  {
    title: 'Sanatın İşlevi ve Birey Üzerindeki Etkisi (Düşünce Paragrafı)',
    text: 'Sanatçı, dünyayı olduğu gibi kopyalayan bir fotoğrafçı değil; görünenin ardındaki görünmeyeni sezdirme ustasıdır. Bir tablonun veya bir romanın bizi sarsmasının nedeni, onda daha önce fark etmediğimiz bir hakikati apaçık bulmamızdır. Sanat yapıtı karşısında duyulan heyecan, salt estetik bir hazdan ibaret olmayıp insanın kendi varoluşuna ayna tutmasıdır. Bu yüzden büyük yapıtlar, çağlar geçse de eskimez; aksine her yeni kuşakla birlikte yeniden üretilip zenginleşir.',
    question: 'Bu parçada sanat yapıtlarıyla ilgili olarak asıl anlatılmak istenen aşağıdakilerden hangisidir?',
    options: [
      { text: 'A) Gerçeği birebir yansıtarak belgesel niteliği taşıdığı', isCorrect: false },
      { text: 'B) İnsana kendi iç dünyasını ve fark etmediği hakikatleri sezdirerek ölümsüzleştiği', isCorrect: true },
      { text: 'C) Yalnızca döneminin kültürel değerlerini yansıttığı sürece kalıcı olduğu', isCorrect: false },
      { text: 'D) Estetik hazzın düşünsel derinlikten her zaman daha üstün olduğu', isCorrect: false },
    ],
    explanation: 'Parçada sanatçının görünenin ardındakini sezdirdiği ve insanın kendi varoluşuna ayna tutarak her yeni kuşakta yeniden üretildiği vurgulanmıştır. Dolayısıyla doğru yanıt B seçeneğidir.',
  },
  {
    title: 'Teknolojinin Düşünme Biçimimize Etkisi (Yeni Nesil Beceri Paragrafı)',
    text: 'Dijital çağda bilgiye ulaşmak saniyeler sürerken, o bilgiyi sindirip özümsemek giderek daha zahmetli bir eyleme dönüşüyor. Sürekli bildirimlerin ve kısa videoların bombardımanı altında kalan zihin, derinleşme yetisini yitirerek yatay bir yüzeyselliğe teslim oluyor. Oysa gerçek düşünme; durmayı, beklemeyi, çelişkilerle yüzleşmeyi ve boşlukları kendi zihinsel emeğimizle doldurmayı gerektirir.',
    question: 'Bu parçanın yazarı aşağıdakilerin hangisinden yakınmaktadır?',
    options: [
      { text: 'A) Dijital araçların eğitimde gereğinden fazla kullanılmasından', isCorrect: false },
      { text: 'B) Bilgiye hızlı ulaşımın insan zihnini yüzeyselleştirip derin düşünmeyi engellemesinden', isCorrect: true },
      { text: 'C) İnternetteki bilgilerin güvenilirlik denetiminden geçmemesinden', isCorrect: false },
      { text: 'D) Yeni kuşağın teknolojiye olan ilgisizliğinden', isCorrect: false },
    ],
    explanation: 'Yazar, bilgiye hızlı ulaşımın bilgiyi özümsemeyi zorlaştırdığını ve derinleşme yetisini yok ederek yüzeyselliğe yol açtığını belirterek B şıkkındaki durumdan yakınmaktadır.',
  },
]

// Bionic Reading formatter: Bolds first 40-50% of each word
function formatBionicWord(word: string): React.ReactNode {
  if (word.length <= 1) return <span key={word}>{word}</span>
  const mid = Math.ceil(word.length * 0.45)
  const boldPart = word.slice(0, mid)
  const restPart = word.slice(mid)
  return (
    <span key={word} className="inline-block mr-1.5">
      <strong className="font-black text-cyan-300">{boldPart}</strong>
      <span className="text-slate-200">{restPart}</span>
    </span>
  )
}

export function BionicSpeedReader() {
  const [selectedParaIndex, setSelectedParaIndex] = useState(0)
  const [mode, setMode] = useState<'bionic' | 'rsvp' | 'normal'>('bionic')
  const [wpm, setWpm] = useState(300) // Words per minute for RSVP
  const [isReading, setIsReading] = useState(false)
  const [rsvpWordIndex, setRsvpWordIndex] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [finishedReading, setFinishedReading] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  const currentPara = PARAGRAPHS[selectedParaIndex]
  const words = currentPara.text.split(/\s+/)

  // Reading Timer
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isReading && !finishedReading) {
      timer = setInterval(() => {
        setElapsedSeconds((s) => s + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isReading, finishedReading])

  // RSVP Word Flasher
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (mode === 'rsvp' && isReading && !finishedReading) {
      const delay = (60 / wpm) * 1000
      interval = setInterval(() => {
        setRsvpWordIndex((prev) => {
          if (prev + 1 >= words.length) {
            setIsReading(false)
            setFinishedReading(true)
            return prev
          }
          return prev + 1
        })
      }, delay)
    }
    return () => clearInterval(interval)
  }, [mode, isReading, finishedReading, wpm, words.length])

  const handleStart = () => {
    setIsReading(true)
    setFinishedReading(false)
    setElapsedSeconds(0)
    setRsvpWordIndex(0)
    setSelectedAnswer(null)
  }

  const handleFinishManual = () => {
    setIsReading(false)
    setFinishedReading(true)
  }

  const handleReset = () => {
    setIsReading(false)
    setFinishedReading(false)
    setElapsedSeconds(0)
    setRsvpWordIndex(0)
    setSelectedAnswer(null)
  }

  // Calculated WPM
  const actualWpm =
    elapsedSeconds > 0 ? Math.round((words.length / elapsedSeconds) * 60) : 0

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* ── Banner ── */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/80 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-500/30">
              Maarif Modeli & MEB
            </span>
            <span className="text-xs text-slate-400">Ortaokul & Lise Paragraf Hız Antrenörü</span>
          </div>
          <h2 className="text-xl font-black text-white mt-1">
            Bionic Hızlı Okuma & Kavrama Testi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelimelerin ilk harflerini belirginleştirerek gözün odaklanma süresini %40 hızlandırın. Paragrafı okuyup sürenizi ve netinizi ölçün.
          </p>
        </div>

        {/* Live WPM & Timer Gauge */}
        <div className="flex items-center gap-4 bg-slate-950/80 p-3 px-5 rounded-2xl border border-slate-800 self-stretch md:self-auto justify-between md:justify-start">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Okuma Süresi</span>
            <div className="text-xl font-black text-white font-mono">{elapsedSeconds} sn</div>
          </div>
          <div className="h-8 w-px bg-slate-800" />
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Hız (Kelime/Dk)</span>
            <div className="text-xl font-black text-cyan-400 font-mono">
              {finishedReading ? actualWpm : isReading ? 'Ölçülüyor...' : '—'}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mode Switcher & Paragraph Selector ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-2">Okuma Modu:</span>
          {[
            { id: 'bionic', label: 'Bionic Odak (Önerilen)' },
            { id: 'rsvp', label: 'Kelime Akışı (RSVP)' },
            { id: 'normal', label: 'Normal Metin' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setMode(m.id as any)
                handleReset()
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                mode === m.id
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {mode === 'rsvp' && (
          <div className="flex items-center gap-2 text-xs text-slate-300">
            <span>Akış Hızı:</span>
            <input
              type="range"
              min="150"
              max="500"
              step="25"
              value={wpm}
              onChange={(e) => setWpm(parseInt(e.target.value))}
              className="w-24 accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="font-mono font-bold text-cyan-300 w-16">{wpm} WPM</span>
          </div>
        )}
      </div>

      {/* ── Reading Area Box ── */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-xl space-y-6 relative overflow-hidden min-h-[260px] flex flex-col justify-between shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-slate-200">{currentPara.title}</h3>
          <span className="text-xs text-slate-500 font-mono">{words.length} Kelime</span>
        </div>

        {/* Display Text by Mode */}
        {mode === 'rsvp' ? (
          /* RSVP Single Word Flasher */
          <div className="my-auto py-12 flex flex-col items-center justify-center">
            {isReading ? (
              <motion.div
                key={rsvpWordIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-4xl sm:text-5xl font-black text-cyan-300 tracking-wide font-mono"
              >
                {words[rsvpWordIndex]}
              </motion.div>
            ) : finishedReading ? (
              <div className="text-center text-emerald-400 font-bold text-base">
                Metin Tamamlandı! Aşağıdaki Kavrama Sorusunu Cevaplayın 👇
              </div>
            ) : (
              <div className="text-slate-400 text-sm">
                Başlamak için aşağıdaki "Okumayı Başlat" butonuna tıklayın.
              </div>
            )}
          </div>
        ) : (
          /* Bionic or Normal Paragraph */
          <div className="text-base sm:text-lg leading-relaxed text-slate-300 tracking-wide selection:bg-cyan-500 selection:text-slate-950">
            {mode === 'bionic'
              ? words.map((w, idx) => (
                  <span key={idx}>{formatBionicWord(w)}</span>
                ))
              : currentPara.text}
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2">
            {!isReading && !finishedReading ? (
              <button
                onClick={handleStart}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Okumayı Başlat (Süre Ölç)</span>
              </button>
            ) : isReading ? (
              <button
                onClick={handleFinishManual}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Okumayı Bitirdim (Soruyu Aç)</span>
              </button>
            ) : null}

            <button
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Sıfırla"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {finishedReading && (
            <span className="text-xs font-bold text-emerald-400 font-mono">
              Okuma Tamamlandı: {elapsedSeconds} sn ({actualWpm} Kelime/Dk)
            </span>
          )}
        </div>
      </div>

      {/* ── TYT Comprehension Question ── */}
      {finishedReading && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-xl space-y-4 shadow-xl"
        >
          <div className="flex items-center gap-2 text-cyan-400">
            <BookOpen className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Kavrama & Çıkarım Sorusu (LGS & YKS Uyumlu)
            </span>
          </div>

          <h4 className="text-sm sm:text-base font-bold text-white leading-snug">
            {currentPara.question}
          </h4>

          <div className="space-y-2">
            {currentPara.options.map((opt, idx) => {
              const isSelected = selectedAnswer === idx
              let buttonStyle = 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-200'

              if (selectedAnswer !== null) {
                if (opt.isCorrect) {
                  buttonStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-300 font-bold'
                } else if (isSelected && !opt.isCorrect) {
                  buttonStyle = 'bg-rose-950/40 border-rose-500 text-rose-300 font-bold'
                } else {
                  buttonStyle = 'bg-slate-950/30 border-slate-800/40 text-slate-500 opacity-50'
                }
              }

              return (
                <button
                  key={idx}
                  disabled={selectedAnswer !== null}
                  onClick={() => setSelectedAnswer(idx)}
                  className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between ${buttonStyle}`}
                >
                  <span>{opt.text}</span>
                  {selectedAnswer !== null && (
                    <span>
                      {opt.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : isSelected ? (
                        <XCircle className="w-4 h-4 text-rose-400" />
                      ) : null}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {selectedAnswer !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed"
            >
              <strong className="text-cyan-400 block mb-1">Çözüm Açıklaması:</strong>
              {currentPara.explanation}
            </motion.div>
          )}

          {/* Teacher Consultation */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Paragraf çözme hızını ve netlerini artırmak ister misin?
            </span>
            <a
              href="/instructors"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
            >
              <span>Türkçe Eğitmenlerimizle Çalış</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </motion.div>
      )}
    </div>
  )
}
