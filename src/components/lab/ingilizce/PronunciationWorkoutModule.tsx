'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Volume2,
  AlertCircle,
  RotateCcw,
  Award,
  ChevronRight,
  Headphones,
  FlaskConical,
  Sparkles,
  CheckCircle2,
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
  trapRegex: RegExp
  trapWarning: string
  sampleMistake: string
  sampleCorrect: string
}

const PRONUNCIATION_LIST: PronunciationTarget[] = [
  {
    id: 'comfortable',
    word: 'Comfortable',
    phonetic: '/ˈkʌmf.tə.bəl/',
    audioSpeed: 0.9,
    category: 'Vurgu / Hece Hataları',
    turkishTrap: 'Türk öğrencilerin en yaygın hatası: "kom-for-tey-bıl" veya "comfartable" şeklinde 4 hece okumaktır. Oysa "r" yutulur ve kelime 3 hecedir: KUMF-tuh-buhl.',
    correctPhoneticHint: 'KUMF-tuh-buhl (3 hece)',
    sentence: 'These sneakers are surprisingly comfortable for walking.',
    cefr: 'A2',
    trapRegex: /(comf?art|komf?art|far\s*table|come\s+for\s+table|com\s+for\s+ta|kom-?for)/i,
    trapWarning: '"comfartable" veya "kom-for-tey-bıl" telaffuzu yakalandı! "r" harfi yutulmalı ve kelime 4 hece değil, 3 hecede "KUMF-tuh-buhl" olarak söylenmelidir.',
    sampleMistake: 'comfartable',
    sampleCorrect: 'comfortable',
  },
  {
    id: 'receipt',
    word: 'Receipt',
    phonetic: '/rɪˈsiːt/',
    audioSpeed: 0.9,
    category: 'Sessiz Harf Tuzakları',
    turkishTrap: '"P" harfi kesinlikle okunmaz! "Re-sept", "recipe" veya "ri-sipt" demek yanlıştır. Doğrusu: ri-SEET.',
    correctPhoneticHint: 'ri-SEET (P tamamen sessizdir)',
    sentence: 'Would you like your receipt printed or sent via email?',
    cefr: 'A2',
    trapRegex: /(recep|recipe|re\s*sep|resip|resept|re-seat)/i,
    trapWarning: '"P" harfini telaffuz ettiniz veya "recipe" dediniz! Receipt kelimesindeki P harfi %100 sessizdir: "ri-SEET" denmelidir.',
    sampleMistake: 'recept',
    sampleCorrect: 'receipt',
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
    trapRegex: /(wed\s+nes|wetness|vednes|wedding|wed-nes)/i,
    trapWarning: '"d" veya "nes" hecesi telaffuz edildi! "d" harfi tamamen atlanarak tek hamlede "WENZ-day" denmelidir.',
    sampleMistake: 'wed nes day',
    sampleCorrect: 'wednesday',
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
    trapRegex: /(sub\s+t|subtil|sabtıl|sub\s*tell|sub\s*title|sub\s*teal)/i,
    trapWarning: '"B" harfini telaffuz ettiniz! Subtle kelimesinde B sessizdir (silent b). Doğrusu "SUT-uhl" olmalıdır.',
    sampleMistake: 'sub title',
    sampleCorrect: 'subtle',
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
    trapRegex: /(kwe|kew\s+w|koo|cueue|q-u-e-u-e)/i,
    trapWarning: 'Kelimeyi birden fazla hece okudunuz! Tıpkı "Q" harfi gibi tek hecedir: "KYOO".',
    sampleMistake: 'kwe-we',
    sampleCorrect: 'queue',
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
    trapRegex: /(ske\s+du\s+le|she\s+du\s+le|skedule)/i,
    trapWarning: 'Heceleme hatası! US aksanında "SKED-jool", UK aksanında "SHED-yool" denmelidir.',
    sampleMistake: 'ske du le',
    sampleCorrect: 'schedule',
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
    trapRegex: /(truff|troo|trow)/i,
    trapWarning: '"Ough" sesleri karıştı! Through (/θruː/), Tough (/tʌf/) ve Thought (/θɔːt/) seslerini ayırt etmeye dikkat edin.',
    sampleMistake: 'truff',
    sampleCorrect: 'through',
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
    trapRegex: /(cloths|cloth\s+is|klo[\s-]*thez|clothez)/i,
    trapWarning: '2 hece ("klo-thez") okudunuz! Tek hecedir ve "close" (kapatmak) gibi "KLOHZ" okunmalıdır.',
    sampleMistake: 'klo-thez',
    sampleCorrect: 'clothes',
  },
]

// Levenshtein edit distance for phonetic similarity
function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length
  const n = s2.length
  const d: number[][] = []
  for (let i = 0; i <= m; i++) d[i] = [i]
  for (let j = 0; j <= n; j++) d[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      )
    }
  }
  return d[m][n]
}

interface EvaluationResult {
  transcript: string
  score: number
  status: 'trap' | 'success' | 'mismatch'
  title: string
  message: string
  trapDetails?: string
}

function computePronunciationEvaluation(
  transcript: string,
  alternatives: string[],
  confidence: number,
  item: PronunciationTarget
): EvaluationResult {
  const clean = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')
  const rawSpoken = transcript.toLowerCase().trim()
  const allCandidateTexts = [rawSpoken, ...alternatives.map((a) => a.toLowerCase().trim())]

  // 1. Trap Detection: Check if transcript or any alternative matches common Turkish trap
  const isTrap = allCandidateTexts.some((txt) => item.trapRegex.test(txt))
  if (isTrap) {
    return {
      transcript: rawSpoken,
      score: 48,
      status: 'trap',
      title: '⚠️ Türkçe Fonetik Tuzağı Yakalandı!',
      message: item.trapWarning,
      trapDetails: item.turkishTrap,
    }
  }

  // 2. Direct Match Check
  const spokenClean = clean(rawSpoken)
  const targetCleans = item.word.split(/[ &,/]+/).map(clean).filter(Boolean)

  const hasExactTarget = targetCleans.some((tc) => spokenClean === tc || spokenClean.includes(tc))
  if (hasExactTarget) {
    const finalScore =
      confidence >= 0.82
        ? Math.round(92 + Math.min(1, confidence - 0.82) * 35)
        : Math.round(80 + confidence * 10)
    return {
      transcript: rawSpoken,
      score: Math.min(98, Math.max(82, finalScore)),
      status: 'success',
      title: '🎉 Harika Telaffuz!',
      message: `Tebrikler! "${item.word}" kelimesinin fonetik ve hece yapısı hedefe tam oturdu.`,
    }
  }

  // 3. Edit distance check against targets
  let minDistance = 999
  let closestTarget = targetCleans[0] || 'word'
  for (const tc of targetCleans) {
    const dist = levenshteinDistance(spokenClean, tc)
    if (dist < minDistance) {
      minDistance = dist
      closestTarget = tc
    }
  }

  const similarity = Math.max(0, 1 - minDistance / Math.max(spokenClean.length, closestTarget.length, 1))

  if (similarity >= 0.7) {
    return {
      transcript: rawSpoken,
      score: Math.round(similarity * 80),
      status: 'trap',
      title: '⚡ Hece veya Aksan Kayması',
      message: `"${rawSpoken}" duyuldu. Hedefe oldukça yakın fakat telaffuz tam temiz değil. "Yavaş & Net Dinle (0.65x)" ile sesi dinleyin.`,
    }
  }

  return {
    transcript: rawSpoken,
    score: Math.max(20, Math.round(similarity * 55)),
    status: 'mismatch',
    title: '❌ Farklı Kelime / Yazım Algılandı',
    message: `"${rawSpoken}" incelendi. Hedef: "${item.word}". Fonetik ipucunu ve yavaş dinleme (0.65x) seçeneğini inceleyerek tekrar deneyebilirsiniz.`,
  }
}

export function PronunciationWorkoutModule() {
  const [selectedWordIndex, setSelectedWordIndex] = useState<number>(0)
  const [accent, setAccent] = useState<EnglishAccent>('en-US')
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null)
  const [playingSpeed, setPlayingSpeed] = useState<number | null>(null)
  const [customInput, setCustomInput] = useState<string>('')

  const currentItem = PRONUNCIATION_LIST[selectedWordIndex]

  const handlePlayWord = (text: string, speed = 0.95) => {
    setPlayingSpeed(speed)
    playSpeech(text, accent, speed, () => {
      setPlayingSpeed(null)
    })
  }

  // Interactive Trap / Accuracy Simulator
  const handleRunSimulatedTest = (testWord: string) => {
    const outcome = computePronunciationEvaluation(testWord, [], 0.95, currentItem)
    setEvalResult(outcome)
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
            Sessiz harfler, heceleme tuzakları ve Türk öğrencilerin en sık takıldığı kelimelerin fonetik sırları. Doğal ve yavaş hızda dinleyin, aksanları kıyaslayın ve tuzak analiz motoruyla telaffuzunuzu pekiştirin!
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
                    setEvalResult(null)
                    setCustomInput('')
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
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isSelected ? 'text-emerald-400 translate-x-1' : 'text-slate-600'
                    }`}
                  />
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
              <div className="space-y-2 text-center py-2">
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
                    <span>
                      {playingSpeed === 1.0 ? 'Doğal Hızda Çalınıyor...' : 'Doğal Hızda Dinle (1.0x)'}
                    </span>
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
                    <Volume2
                      className={`w-4 h-4 text-amber-400 ${
                        playingSpeed === 0.65 ? 'animate-pulse text-slate-950' : ''
                      }`}
                    />
                    <span>
                      {playingSpeed === 0.65
                        ? 'Yavaş & Net Çalınıyor (0.65x)...'
                        : 'Yavaş & Net Dinle (0.65x)'}
                    </span>
                  </button>
                </div>

                {/* Multi-word split chips if word has multiple variants */}
                {currentItem.word.includes('&') && (
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <span className="text-xs text-slate-400 font-medium">Ayrı Ayrı Yavaş Dinle:</span>
                    {currentItem.word.split('&').map((w, wi) => {
                      const cleanWord = w.trim()
                      return (
                        <button
                          key={wi}
                          onClick={() => handlePlayWord(cleanWord, 0.65)}
                          className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-800/90 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          🔊 {cleanWord}
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

              {/* ── Interactive Phonetic Analysis & Trap Comparator ── */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 space-y-5">
                <div className="text-center space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Fonetik Kıyaslama & Tuzak Analiz Alanı</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-white">
                    Doğru Telaffuz ile Sık Yapılan Hatayı Karşılaştırın
                  </h4>
                  <p className="text-xs text-slate-400 max-w-xl mx-auto">
                    Kelimedeki sessiz harfleri ve heceleme kaymalarını keşfedin. Tek tıkla analizleri inceleyin veya kendi telaffuz tahmininizi deneyin.
                  </p>
                </div>

                {/* Side-by-side Trap vs Correct Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {/* Trap Card */}
                  <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 hover:border-rose-500/50 transition-all flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1">
                          ⚠️ Sık Yapılan Hata
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 font-bold">
                          Tuzak
                        </span>
                      </div>
                      <div className="text-xl font-black text-rose-200 tracking-tight">
                        “{currentItem.sampleMistake}”
                      </div>
                      <p className="text-xs text-rose-200/80 leading-relaxed">
                        {currentItem.trapWarning}
                      </p>
                    </div>

                    <button
                      onClick={() => handleRunSimulatedTest(currentItem.sampleMistake)}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-950/60 text-rose-200 font-bold text-xs border border-rose-500/40 hover:bg-rose-900/60 transition-all cursor-pointer shadow-sm"
                    >
                      <FlaskConical className="w-3.5 h-3.5 text-rose-400" />
                      <span>Bu Tuzağın Analizini İncele</span>
                    </button>
                  </div>

                  {/* Correct Card */}
                  <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5 text-left">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                          ✨ Doğru Fonetik Çözüm
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                          Hedef
                        </span>
                      </div>
                      <div className="text-xl font-black text-emerald-200 tracking-tight">
                        “{currentItem.sampleCorrect}”
                      </div>
                      <p className="text-xs text-emerald-200/80 leading-relaxed">
                        {currentItem.correctPhoneticHint}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleRunSimulatedTest(currentItem.sampleCorrect)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-emerald-950/60 text-emerald-200 font-bold text-xs border border-emerald-500/40 hover:bg-emerald-900/60 transition-all cursor-pointer shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Doğru Çözümü Analiz Et</span>
                      </button>
                      <button
                        onClick={() => handlePlayWord(currentItem.word, 0.65)}
                        className="p-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-700 text-amber-300 hover:text-white transition-all cursor-pointer"
                        title="Yavaş & Net Dinle"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Interactive Written Pronunciation / Spelling Checker */}
                <div className="pt-3 border-t border-slate-800/80 max-w-lg mx-auto space-y-2">
                  <div className="text-xs text-slate-300 font-semibold flex items-center justify-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Kendi Heceleme veya Telaffuz Tahmininizi Yazarak Test Edin:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder='Örn: "comfartable", "subtil", "wednesday"...'
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && customInput.trim()) {
                          handleRunSimulatedTest(customInput.trim())
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (customInput.trim()) handleRunSimulatedTest(customInput.trim())
                      }}
                      className="px-4 py-2.5 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-cyan-400 transition-all cursor-pointer whitespace-nowrap shadow-md shadow-cyan-500/20"
                    >
                      Analiz Et
                    </button>
                  </div>
                </div>

                {/* Evaluation Feedback Results */}
                <AnimatePresence>
                  {evalResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-4 rounded-xl border space-y-3 text-left ${
                        evalResult.status === 'trap'
                          ? 'bg-amber-950/30 border-amber-500/40'
                          : evalResult.status === 'success'
                          ? 'bg-emerald-950/30 border-emerald-500/40'
                          : 'bg-rose-950/30 border-rose-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-semibold">İncelenen Telaffuz / Heceleme:</span>
                        <button
                          onClick={() => setEvalResult(null)}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          Temizle
                        </button>
                      </div>

                      <div className="text-lg font-bold text-white">
                        “{evalResult.transcript}”
                      </div>

                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <div
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold ${
                            evalResult.status === 'success'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : evalResult.status === 'trap'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          <Award className="w-4 h-4" />
                          Doğruluk Skoru: %{evalResult.score}
                        </div>

                        <span className="text-xs font-bold text-white">{evalResult.title}</span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                        {evalResult.message}
                      </p>
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
