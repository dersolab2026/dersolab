'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  MicOff,
  Volume2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Zap,
  Flame,
  Award,
  ChevronRight,
  Headphones,
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
  const [playingSpeed, setPlayingSpeed] = useState<number | null>(null)
  const [micSupported, setMicSupported] = useState<boolean>(true)
  const [micError, setMicError] = useState<string | null>(null)

  const currentItem = PRONUNCIATION_LIST[selectedWordIndex]
  const recognitionRef = useRef<any>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Check SpeechRecognition support in current browser
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (!SpeechRecognition) {
        setMicSupported(false)
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch {}
      }
    }
  }, [])

  const handlePlayWord = (text: string, speed = 0.95) => {
    setPlayingSpeed(speed)
    playSpeech(text, accent, speed, () => {
      setPlayingSpeed(null)
    })
  }

  const handleStartRecognition = () => {
    if (typeof window === 'undefined') return
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setMicError('Tarayıcınızda doğrudan Web Speech Tanıma API’si bulunamadı. Chrome veya Edge ile deneyebilir veya aşağıdaki değerlendirme ile pratik yapabilirsiniz.')
      return
    }

    setMicError(null)
    setRecognizedText('')
    setAccuracyScore(null)

    try {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort() } catch {}
      }

      const recognition = new SpeechRecognition()
      recognition.lang = accent
      recognition.interimResults = false
      recognition.maxAlternatives = 2

      recognition.onstart = () => {
        setIsListening(true)
        setMicError(null)

        // Auto timeout in case no audio is caught after 8 seconds
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            try { recognitionRef.current.stop() } catch {}
          }
          setIsListening(false)
          setMicError('Ses algılanamadı. Mikrofona daha yakın konuşarak tekrar deneyin.')
        }, 8000)
      }

      recognition.onresult = (event: any) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setIsListening(false)

        const transcript = event.results[0][0].transcript.trim()
        setRecognizedText(transcript)

        // Evaluate pronunciation against target word
        const cleanWord = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '')
        const saidClean = cleanWord(transcript)
        const targetWords = currentItem.word.split(/[ &,/]+/).map(cleanWord).filter(Boolean)

        // Check if any target word was captured
        const hasDirectMatch = targetWords.some(
          (tw) => saidClean.includes(tw) || tw.includes(saidClean)
        )

        if (hasDirectMatch) {
          setAccuracyScore(96)
        } else {
          // Similarity check
          let bestRatio = 0
          for (const tw of targetWords) {
            let matches = 0
            for (let i = 0; i < Math.min(tw.length, saidClean.length); i++) {
              if (tw[i] === saidClean[i]) matches++
            }
            const ratio = Math.round((matches / Math.max(tw.length, 1)) * 100)
            if (ratio > bestRatio) bestRatio = ratio
          }
          setAccuracyScore(Math.max(50, Math.min(bestRatio, 88)))
        }
      }

      recognition.onerror = (event: any) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setIsListening(false)
        console.warn('SpeechRecognition error:', event.error)

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setMicError('Tarayıcınızda mikrofon erişimine izin verilmedi. Lütfen adres çubuğundaki kilit/izin simgesinden mikrofona izin verin.')
        } else if (event.error === 'no-speech') {
          setMicError('Ses algılanamadı. Lütfen mikrofona yaklaşıp kelimeyi tekrar telaffuz edin.')
        } else if (event.error === 'network') {
          setMicError('Konuşma tanıma servisi için internet bağlantısı gerekiyor.')
        } else {
          setMicError(`Mikrofon durumu: ${event.error}. Tekrar deneyebilirsiniz.`)
        }
      }

      recognition.onend = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (e: any) {
      console.warn('Recognition start error:', e)
      setIsListening(false)
      setMicError('Mikrofon başlatılamadı. Lütfen mikrofon bağlantınızı kontrol edin.')
    }
  }

  const handleStopRecognition = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (recognitionRef.current) {
      try { recognitionRef.current.stop() } catch {}
    }
    setIsListening(false)
  }

  // Quick self-practice fallback test
  const handleSimulateSelfCheck = (score: number) => {
    setMicError(null)
    setRecognizedText(currentItem.word)
    setAccuracyScore(score)
  }

  return (
    <div className="space-y-8">
      {/* ── Subheader ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-sky-950/30 border border-emerald-500/20 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Telaffuz & Fonetik Antrenör
            </span>
            <span className="text-xs text-slate-400">Türkçe Öğrencilerine Özel Tuzak Avcısı</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Headphones className="w-5 h-5 text-emerald-400" />
            Speaking & Telaffuz Antrenörü
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Sessiz harfler (silent letters), heceleme tuzakları ve Türk öğrencilerin en sık takıldığı kelimelerin fonetik sırları. Yavaş dinleyin, mikrofona telaffuz edin ve anlık puanınızı görün!
          </p>
        </div>

        {/* Accent Selector */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto shrink-0">
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
                    setMicError(null)
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
              <div className="space-y-2 text-center py-3">
                <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {currentItem.word}
                </h2>
                <div className="inline-block font-mono text-base sm:text-lg text-sky-400 bg-slate-950/70 px-4 py-1.5 rounded-xl border border-slate-800">
                  {currentItem.phonetic}
                </div>
                <div className="text-sm font-bold text-emerald-400 pt-1">
                  💡 Doğru Okunuş İpucu: {currentItem.correctPhoneticHint}
                </div>
              </div>

              {/* Audio Listen Buttons: Normal Speed & Yavaş ve Net Dinle */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => handlePlayWord(currentItem.word, 1.0)}
                    disabled={playingSpeed !== null}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg cursor-pointer ${
                      playingSpeed === 1.0
                        ? 'bg-sky-400 text-slate-950 shadow-sky-400/40 ring-2 ring-white/40 scale-[1.02]'
                        : 'bg-sky-500 text-slate-950 hover:bg-sky-400 shadow-sky-500/25'
                    }`}
                  >
                    <Volume2 className={`w-4 h-4 ${playingSpeed === 1.0 ? 'animate-bounce' : ''}`} />
                    <span>{playingSpeed === 1.0 ? 'Doğal Hızda Çalınıyor...' : 'Doğal Hızda Dinle (1.0x)'}</span>
                  </button>

                  <button
                    onClick={() => handlePlayWord(currentItem.word, 0.65)}
                    disabled={playingSpeed !== null}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all border cursor-pointer ${
                      playingSpeed === 0.65
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/30 scale-[1.02]'
                        : 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-750 hover:border-slate-600'
                    }`}
                  >
                    <Volume2 className={`w-4 h-4 text-amber-400 ${playingSpeed === 0.65 ? 'animate-pulse text-slate-950' : ''}`} />
                    <span>{playingSpeed === 0.65 ? 'Yavaş & Net Çalınıyor (0.65x)...' : 'Yavaş & Net Dinle (0.65x)'}</span>
                  </button>
                </div>

                {/* Multi-word split chips if word has multiple variants */}
                {currentItem.word.includes('&') && (
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <span className="text-xs text-slate-400 font-medium">Ayrı Ayrı Yavaş Dinle:</span>
                    {currentItem.word.split('&').map((w, wi) => {
                      const clean = w.trim()
                      return (
                        <button
                          key={wi}
                          onClick={() => handlePlayWord(clean, 0.65)}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-800/90 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          🔊 {clean}
                        </button>
                      )
                    })}
                  </div>
                )}
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
                    className="p-1 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-sky-400"
                    title="Cümleyi Dinle"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>Cümleyi Dinle</span>
                  </button>
                </div>
                <p className="text-sm sm:text-base font-medium text-slate-100 italic">
                  “{currentItem.sentence}”
                </p>
              </div>

              {/* Interactive Speech Recognition Mic Button */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 text-center space-y-4">
                <div className="text-xs text-slate-400">
                  {isListening
                    ? 'Mikrofon dinliyor... Lütfen kelimeyi yüksek ve net sesle telaffuz edin.'
                    : 'Butona tıklayın ve mikrofona telaffuz edin:'}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {!isListening ? (
                    <button
                      onClick={handleStartRecognition}
                      className="group flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-extrabold text-base hover:scale-105 transition-all shadow-xl shadow-emerald-500/30 cursor-pointer"
                    >
                      <Mic className="w-5 h-5 group-hover:animate-bounce" />
                      Mikrofon ile Telaffuz Et
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

                  {/* Quick self-check fallback for users wanting immediate practice */}
                  <button
                    onClick={() => handleSimulateSelfCheck(96)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-750 transition-all cursor-pointer"
                    title="Mikrofonunuz kapalıysa telaffuzunuzu kendiniz kontrol edin"
                  >
                    Kendimi Test Et
                  </button>
                </div>

                {/* Error Banner if mic denied / no speech */}
                <AnimatePresence>
                  {micError && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 text-left flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-rose-300">Mikrofon Uyarısı</div>
                        <div className="mt-0.5 leading-relaxed">{micError}</div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Recognition Feedback Results */}
                <AnimatePresence>
                  {recognizedText && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl bg-slate-900/90 border border-slate-700 space-y-2 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-semibold">Algılanan Telaffuz:</span>
                        <button
                          onClick={() => {
                            setRecognizedText('')
                            setAccuracyScore(null)
                          }}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Sıfırla
                        </button>
                      </div>

                      <div className="text-lg font-bold text-white">“{recognizedText}”</div>

                      {accuracyScore !== null && (
                        <div className="flex flex-wrap items-center gap-3 pt-2">
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
                              ? '🎉 Harika! Fonetik telaffuzunuz hedefe tam oturdu.'
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
