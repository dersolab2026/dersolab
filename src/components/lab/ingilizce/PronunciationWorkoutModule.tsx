'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Zap,
  Flame,
  Award,
  ChevronRight,
} from 'lucide-react'
import { playSpeech, EnglishAccent } from './speechHelper'

interface PronunciationTarget {
  id: string
  word: string
  phonetic: string
  audioSpeed: number
  category: 'Sessiz Harf Tuzakları' | 'Vurgu / Hece Hataları' | 'Ough & Düzensiz Sesler' | 'İngiliz vs Amerikan'
  turkishTrap: string
  correctPhoneticHint: string
  sentence: string
  cefr: string
}

const PRONUNCIATION_LIST: PronunciationTarget[] = [
  {
    id: 'comfortable',
    word: 'Comfortable',
    phonetic: '/ˈkʌmf.tə.bəl/',
    audioSpeed: 0.9,
    category: 'Vurgu / Hece Hataları',
    turkishTrap: 'Türk öğrencilerin en yaygın hatası: "kom-for-tey-bıl" şeklinde 4 hece okumaktır. Oysa "r" yutulur ve kelime 3 hecedir: KUMF-tuh-buhl.',
    correctPhoneticHint: 'KUMF-tuh-buhl (3 hece)',
    sentence: 'These sneakers are surprisingly comfortable for walking.',
    cefr: 'A2',
  },
  {
    id: 'receipt',
    word: 'Receipt',
    phonetic: '/rɪˈsiːt/',
    audioSpeed: 0.9,
    category: 'Sessiz Harf Tuzakları',
    turkishTrap: '"P" harfi kesinlikle okunmaz! "Re-sept" veya "ri-sipt" demek yanlıştır. Doğrusu: ri-SEET.',
    correctPhoneticHint: 'ri-SEET (P tamamen sessizdir)',
    sentence: 'Would you like your receipt printed or sent via email?',
    cefr: 'A2',
  },
  {
    id: 'wednesday',
    word: 'Wednesday',
    phonetic: '/ˈwenz.deɪ/',
    audioSpeed: 0.9,
    category: 'Sessiz Harf Tuzakları',
    turkishTrap: '"d" ve ortadaki "nes" hecesi kaybolur. "Ved-nes-dey" değil, doğrudan WENZ-day denir.',
    correctPhoneticHint: 'WENZ-day (d okunmaz)',
    sentence: 'The team standup meeting is scheduled for Wednesday morning.',
    cefr: 'A1',
  },
  {
    id: 'subtle',
    word: 'Subtle',
    phonetic: '/ˈsʌt.əl/',
    audioSpeed: 0.9,
    category: 'Sessiz Harf Tuzakları',
    turkishTrap: '"b" harfi tamamen sessizdir (silent b). "Sub-tıl" denmez, SUT-uhl (/sʌt.əl/) okunur.',
    correctPhoneticHint: 'SUT-uhl (b harfi sessizdir)',
    sentence: 'There was a subtle hint of cinnamon in the cake.',
    cefr: 'B1',
  },
  {
    id: 'queue',
    word: 'Queue',
    phonetic: '/kjuː/',
    audioSpeed: 0.9,
    category: 'Vurgu / Hece Hataları',
    turkishTrap: 'Kelimedeki son 4 harf (ueue) sessizdir! Sadece "Q" harfi gibi okunur: KYOO.',
    correctPhoneticHint: 'KYOO (Tek hece, Q harfi gibi)',
    sentence: 'We had to wait in a long queue at the boarding gate.',
    cefr: 'A2',
  },
  {
    id: 'schedule',
    word: 'Schedule',
    phonetic: 'US: /ˈskedʒ.uːl/ | UK: /ˈʃedʒ.uːl/',
    audioSpeed: 0.9,
    category: 'İngiliz vs Amerikan',
    turkishTrap: 'Amerikan İngilizcesinde "SKED-jool", İngiliz İngilizcesinde ise "SHED-yool" olarak telaffuz edilir.',
    correctPhoneticHint: 'US: SKED-jool / UK: SHED-yool',
    sentence: 'Let’s check the bus schedule to see when the next one leaves.',
    cefr: 'B1',
  },
  {
    id: 'through-tough-thought',
    word: 'Through & Thought & Tough',
    phonetic: '/θruː/ — /θɔːt/ — /tʌf/',
    audioSpeed: 0.85,
    category: 'Ough & Düzensiz Sesler',
    turkishTrap: '"Ough" harf grubu İngilizcenin en kurnaz yapısıdır: Through (thru), Thought (thawt), Tough (tuff), Though (thoh).',
    correctPhoneticHint: 'Through = THRU | Tough = TUFF | Thought = THAWT',
    sentence: 'He went through tough times, but kept a positive thought.',
    cefr: 'B2',
  },
  {
    id: 'clothes',
    word: 'Clothes',
    phonetic: '/kloʊðz/ or /kloʊz/',
    audioSpeed: 0.9,
    category: 'Vurgu / Hece Hataları',
    turkishTrap: '"Klo-thez" diye 2 hece okunmaz! Tek hecedir ve "close" (kapatmak) fiiliyle neredeyse tamamen aynı seslendirilir: KLOHZ.',
    correctPhoneticHint: 'KLOHZ (Tek hece, "close" gibi)',
    sentence: 'Pack warm clothes because it gets freezing at night.',
    cefr: 'A1',
  },
]

export function PronunciationWorkoutModule() {
  const [selectedWordIndex, setSelectedWordIndex] = useState<number>(0)
  const [accent, setAccent] = useState<EnglishAccent>('en-US')
  const [isListening, setIsListening] = useState<boolean>(false)
  const [recognizedText, setRecognizedText] = useState<string>('')
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null)
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false)
  const [micSupported, setMicSupported] = useState<boolean>(true)

  const currentItem = PRONUNCIATION_LIST[selectedWordIndex]
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Check SpeechRecognition support
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (!SpeechRecognition) {
        setMicSupported(false)
      }
    }
  }, [])

  const handlePlayWord = (text: string, speed = 0.95) => {
    setIsPlayingAudio(true)
    playSpeech(text, accent, speed, () => {
      setIsPlayingAudio(false)
    })
  }

  const handleStartRecognition = () => {
    if (typeof window === 'undefined') return
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Tarayıcınız Web Speech Tanıma API’sini desteklemiyor. Chrome veya Edge kullanabilirsiniz.')
      return
    }

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }

      const recognition = new SpeechRecognition()
      recognition.lang = accent
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
        setRecognizedText('')
        setAccuracyScore(null)
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript.trim()
        setRecognizedText(transcript)
        setIsListening(false)

        // Compare transcript with target word / sentence
        const targetClean = currentItem.word.toLowerCase()
        const saidClean = transcript.toLowerCase()

        if (saidClean.includes(targetClean) || targetClean.includes(saidClean)) {
          setAccuracyScore(98)
        } else {
          // Similarity check
          let matchCount = 0
          for (let i = 0; i < Math.min(targetClean.length, saidClean.length); i++) {
            if (targetClean[i] === saidClean[i]) matchCount++
          }
          const ratio = Math.round((matchCount / targetClean.length) * 100)
          setAccuracyScore(Math.max(45, Math.min(ratio, 85)))
        }
      }

      recognition.onerror = (err: any) => {
        console.warn('SpeechRecognition error:', err)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (e) {
      console.warn('Recognition start error:', e)
      setIsListening(false)
    }
  }

  const handleStopRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* ── Subheader ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-sky-950/30 border border-emerald-500/20 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Telaffuz & Dinleme Antrenörü
            </span>
            <span className="text-xs text-slate-400">Türkçe Öğrencilerine Özel Tuzak Avcısı</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Mic className="w-5 h-5 text-emerald-400" />
            Pronunciation & Speaking Workout
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Sessiz harfler (silent letters), hece tuzakları ve Türk öğrencilerin en sık takıldığı kelimelerin fonetik sırları. Dinleyin, mikrofona telaffuz edin ve anlık puanınızı görün!
          </p>
        </div>

        {/* Accent Selector */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          <span className="text-[11px] font-semibold text-slate-400 pl-2">Ses:</span>
          {(['en-US', 'en-GB'] as EnglishAccent[]).map((acc) => (
            <button
              key={acc}
              onClick={() => setAccent(acc)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                accent === acc
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {acc === 'en-US' ? '🇺🇸 US Accent' : '🇬🇧 UK Accent'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Workout Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Word Card Selector List (4 cols) */}
        <div className="lg:col-span-4 space-y-2.5">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
            Kritik Telaffuz Kartları ({PRONUNCIATION_LIST.length})
          </h3>
          <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
            {PRONUNCIATION_LIST.map((item, idx) => {
              const isSelected = idx === selectedWordIndex
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedWordIndex(idx)
                    setRecognizedText('')
                    setAccuracyScore(null)
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-950/50 to-slate-900 border-emerald-400/60 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-400/30'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{item.word}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-bold">
                        {item.cefr}
                      </span>
                    </div>
                    <div className="text-xs text-sky-400 font-mono">{item.phonetic}</div>
                    <div className="text-[11px] text-slate-400">{item.category}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-emerald-400 translate-x-1' : 'text-slate-600'}`} />
                </button>
              )
            })}
          </div>
        </div>

        {/* Interactive Practice Arena (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Focus Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative space-y-6">
              
              {/* Header tags */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {currentItem.category}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  CEFR Seviyesi: {currentItem.cefr}
                </span>
              </div>

              {/* Big Word & Phonetic */}
              <div className="space-y-2 text-center py-4">
                <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {currentItem.word}
                </h2>
                <div className="inline-block font-mono text-lg text-sky-400 bg-slate-950/70 px-4 py-1.5 rounded-xl border border-slate-800">
                  {currentItem.phonetic}
                </div>
                <div className="text-sm font-bold text-emerald-400 pt-1">
                  ✨ Doğru Okunuş İpucu: {currentItem.correctPhoneticHint}
                </div>
              </div>

              {/* Audio Listen Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => handlePlayWord(currentItem.word, 1.0)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 text-slate-950 font-bold text-sm hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/25 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  Doğal Hızda Dinle (1.0x)
                </button>

                <button
                  onClick={() => handlePlayWord(currentItem.word, 0.7)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm hover:bg-slate-750 transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-sky-400" />
                  Yavaş & Net Dinle (0.7x)
                </button>
              </div>

              {/* Turkish Student Trap Explainer */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Sık Yapılan Türk Öğrenci Tuzağı:
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    {currentItem.turkishTrap}
                  </p>
                </div>
              </div>

              {/* Sample Context Sentence */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                  <span>Örnek Cümle İçinde Kullanımı:</span>
                  <button
                    onClick={() => handlePlayWord(currentItem.sentence, 0.95)}
                    className="p-1 hover:text-white transition-colors cursor-pointer"
                    title="Cümleyi Dinle"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm sm:text-base font-medium text-slate-100 italic">
                  “{currentItem.sentence}”
                </p>
              </div>

              {/* Interactive Speech Recognition Mic Button */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 text-center space-y-4">
                <div className="text-xs text-slate-400">
                  {micSupported
                    ? 'Mikrofona tıklayın ve kelimeyi telaffuz edin:'
                    : 'Tarayıcınızda doğrudan mikrofon testi desteklenmiyor, Chrome veya Edge ile deneyebilirsiniz.'}
                </div>

                <div className="flex items-center justify-center">
                  {!isListening ? (
                    <button
                      onClick={handleStartRecognition}
                      className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-base hover:scale-105 transition-all shadow-xl shadow-emerald-500/30 cursor-pointer"
                    >
                      <Mic className="w-5 h-5 group-hover:animate-bounce" />
                      Mikrofonla Telaffuz Et
                    </button>
                  ) : (
                    <button
                      onClick={handleStopRecognition}
                      className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-rose-500 text-white font-extrabold text-base animate-pulse transition-all shadow-xl shadow-rose-500/40 cursor-pointer"
                    >
                      <MicOff className="w-5 h-5" />
                      Dinleniyor... (Durdurmak için tıkla)
                    </button>
                  )}
                </div>

                {/* Recognition Feedback Results */}
                <AnimatePresence>
                  {recognizedText && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-2"
                    >
                      <div className="text-xs text-slate-400">Algılanan Telaffuz:</div>
                      <div className="text-base font-bold text-white">“{recognizedText}”</div>

                      {accuracyScore !== null && (
                        <div className="flex items-center justify-center gap-3 pt-2">
                          <div
                            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                              accuracyScore >= 80
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            }`}
                          >
                            <Award className="w-4 h-4" />
                            Telaffuz Başarısı: %{accuracyScore}
                          </div>
                          <span className="text-xs text-slate-300">
                            {accuracyScore >= 80
                              ? '🎉 Harika! Aksan ve heceleme kusursuz.'
                              : '💡 Gayet iyi! Yavaş dinleyip bir kez daha tekrar edin.'}
                          </span>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
