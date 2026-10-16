'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mic,
  MicOff,
  Volume2,
  AlertCircle,
  RotateCcw,
  Award,
  ChevronRight,
  Headphones,
  Play,
  Pause,
  FlaskConical,
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
    title: '❌ Farklı Kelime Algılandı',
    message: `"${rawSpoken}" olarak algılandı. Hedef: "${item.word}". Lütfen mikrofona yaklaşıp tekrar deneyin.`,
  }
}

export function PronunciationWorkoutModule() {
  const [selectedWordIndex, setSelectedWordIndex] = useState<number>(0)
  const [accent, setAccent] = useState<EnglishAccent>('en-US')
  const [isListening, setIsListening] = useState<boolean>(false)
  const [micVolume, setMicVolume] = useState<number>(0)
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null)
  const [playingSpeed, setPlayingSpeed] = useState<number | null>(null)
  const [micError, setMicError] = useState<string | null>(null)
  const [userAudioBlobUrl, setUserAudioBlobUrl] = useState<string | null>(null)
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState<boolean>(false)
  const [customInput, setCustomInput] = useState<string>('')
  const [browserNotice] = useState<string | null>(() => {
    if (typeof navigator !== 'undefined') {
      const ua = navigator.userAgent
      const isOpera = /OPR\//.test(ua) || /Opera/.test(ua)
      const isFirefox = /Firefox\//.test(ua)
      if (isOpera) {
        return "Opera tarayıcısı Google'ın ses tanıma (SpeechRecognition) motorunu bünyesinde barındırmaz. Mikrofonla canlı konuşma tanıma için Google Chrome veya Microsoft Edge önerilir. Opera'da aşağıdaki yazılı analiz kutusunu ve tek tıkla test simülasyonlarını eksiksiz kullanabilirsiniz."
      }
      if (isFirefox) {
        return 'Firefox tarayıcısında Web SpeechRecognition varsayılan olarak kapalıdır. Canlı konuşma için Google Chrome veya Microsoft Edge önerilir.'
      }
    }
    return null
  })

  const currentItem = PRONUNCIATION_LIST[selectedWordIndex]

  const recognitionRef = useRef<any>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioContextRef = useRef<AudioContext | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const isListeningRef = useRef<boolean>(false)
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null)

  const stopAllMedia = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort()
      } catch {}
      recognitionRef.current = null
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop()
      } catch {}
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      mediaStreamRef.current = null
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close()
      } catch {}
      audioContextRef.current = null
    }

    isListeningRef.current = false
    setIsListening(false)
    setMicVolume(0)
  }

  // Cleanup on unmount or audio change
  useEffect(() => {
    return () => {
      stopAllMedia()
      if (userAudioBlobUrl) {
        URL.revokeObjectURL(userAudioBlobUrl)
      }
    }
  }, [userAudioBlobUrl])

  const handlePlayWord = (text: string, speed = 0.95) => {
    setPlayingSpeed(speed)
    playSpeech(text, accent, speed, () => {
      setPlayingSpeed(null)
    })
  }

  const handleStartRecognition = async () => {
    if (typeof window === 'undefined') return

    // Clear previous results
    stopAllMedia()
    setMicError(null)
    setEvalResult(null)
    if (userAudioBlobUrl) {
      URL.revokeObjectURL(userAudioBlobUrl)
      setUserAudioBlobUrl(null)
    }

    // Check if Opera or unsupported browser
    const isOpera =
      typeof navigator !== 'undefined' &&
      (/OPR\//.test(navigator.userAgent) || /Opera/.test(navigator.userAgent))
    if (isOpera) {
      setMicError(
        'Opera Tarayıcısı Bilgisi: Opera tarayıcısı Google\'ın ses tanıma (SpeechRecognition) altyapısını desteklememektedir. Ayrıca Opera üzerinde site izni açık görünse bile Windows 11 "Masaüstü uygulamalarına mikrofon izni verin" ayarı kapalıysa mikrofon sürücüsü kilitlenir. Canlı konuşarak pratik yapmak için lütfen Google Chrome veya Microsoft Edge kullanın ya da aşağıdaki yazılı analiz kutusunu kullanın.'
      )
      setIsListening(false)
      isListeningRef.current = false
      return
    }

    // 1. Request real microphone access for volume meter & recording
    let stream: MediaStream | null = null
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        mediaStreamRef.current = stream

        // Setup AudioContext for real-time volume analysis
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
        if (AudioCtx) {
          const audioCtx = new AudioCtx()
          audioContextRef.current = audioCtx
          const analyser = audioCtx.createAnalyser()
          analyser.fftSize = 256
          const source = audioCtx.createMediaStreamSource(stream)
          source.connect(analyser)

          const dataArray = new Uint8Array(analyser.frequencyBinCount)
          const sampleVolume = () => {
            if (!isListeningRef.current) return
            analyser.getByteFrequencyData(dataArray)
            let sum = 0
            for (let i = 0; i < dataArray.length; i++) sum += dataArray[i]
            const avg = Math.min(100, Math.round((sum / dataArray.length) * 1.8))
            setMicVolume(avg)
            animFrameRef.current = requestAnimationFrame(sampleVolume)
          }
          isListeningRef.current = true
          animFrameRef.current = requestAnimationFrame(sampleVolume)
        }

        // Setup MediaRecorder so the student can listen to their own voice
        if (typeof MediaRecorder !== 'undefined') {
          audioChunksRef.current = []
          const recorder = new MediaRecorder(stream)
          mediaRecorderRef.current = recorder
          recorder.ondataavailable = (e) => {
            if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data)
          }
          recorder.onstop = () => {
            if (audioChunksRef.current.length > 0) {
              const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
              const url = URL.createObjectURL(blob)
              setUserAudioBlobUrl(url)
            }
          }
          recorder.start()
        }
      }
    } catch (micErr: any) {
      console.warn('Microphone permission / stream error:', micErr)
      let reason = 'Mikrofon erişimi engellendi veya bulunamadı.'
      if (micErr?.name === 'NotAllowedError' || micErr?.name === 'PermissionDeniedError') {
        reason = 'Mikrofon erişimi engellendi (NotAllowedError). Tarayıcınızda izin açık görünmesine rağmen bu hatayı alıyorsanız: Windows Ayarları > Gizlilik ve Güvenlik > Mikrofon menüsünden "Masaüstü uygulamalarının mikrofonunuza erişmesine izin verin" ayarının AÇIK olduğundan ve tarayıcınıza izin verildiğinden emin olun.'
      } else if (micErr?.name === 'NotFoundError' || micErr?.name === 'DevicesNotFoundError') {
        reason = 'Bilgisayarınızda bağlı veya etkin bir mikrofon cihazı bulunamadı. Lütfen kulaklık/mikrofon bağlantınızı kontrol edin.'
      } else if (micErr?.name === 'NotReadableError') {
        reason = 'Mikrofonunuz şu anda başka bir program (Zoom, Teams, Discord vb.) tarafından kullanılıyor.'
      }
      setMicError(reason)
      setIsListening(false)
      isListeningRef.current = false
      return
    }

    // 2. Setup Speech Recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      setMicError(
        'Tarayıcınızda yerel Web Speech Recognition servisi bulunamadı. Chrome veya Edge kullanmanız önerilir. Aşağıdaki "Tuzak Testi" butonları ile fonetik motorunu test edebilirsiniz.'
      )
      setIsListening(true)
      isListeningRef.current = true
      return
    }

    try {
      const recognition = new SpeechRecognition()
      recognition.lang = accent
      recognition.interimResults = false
      recognition.maxAlternatives = 5

      recognition.onstart = () => {
        setIsListening(true)
        isListeningRef.current = true
        setMicError(null)

        // Safety auto-timeout: 8 seconds
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        timeoutRef.current = setTimeout(() => {
          stopAllMedia()
          setMicError('Ses algılanamadı. Mikrofona daha yakın konuşarak tekrar deneyin.')
        }, 8000)
      }

      recognition.onresult = (event: any) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        stopAllMedia()

        const results = event.results[0]
        const mainTranscript = results[0].transcript.trim()
        const confidence = results[0].confidence || 0.88

        const alternatives: string[] = []
        for (let i = 1; i < results.length; i++) {
          if (results[i]?.transcript) {
            alternatives.push(results[i].transcript.trim())
          }
        }

        // Run trap-aware phonetic evaluation
        const evalOutcome = computePronunciationEvaluation(
          mainTranscript,
          alternatives,
          confidence,
          currentItem
        )
        setEvalResult(evalOutcome)
      }

      recognition.onerror = (event: any) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        stopAllMedia()
        console.warn('SpeechRecognition error:', event.error)

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setMicError('Mikrofon erişimine izin verilmedi. Adres çubuğundan mikrofon iznini açın.')
        } else if (event.error === 'no-speech') {
          setMicError('Ses algılanamadı. Mikrofona yaklaşıp kelimeyi tekrar telaffuz edin.')
        } else if (event.error === 'network') {
          setMicError('Konuşma tanıma için internet bağlantısı gerekiyor.')
        } else {
          setMicError(`Mikrofon durumu: ${event.error}. Lütfen tekrar deneyin.`)
        }
      }

      recognition.onend = () => {
        stopAllMedia()
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (e: any) {
      console.warn('SpeechRecognition start error:', e)
      stopAllMedia()
      setMicError('Mikrofon başlatılamadı. Lütfen mikrofon bağlantısını kontrol edin.')
    }
  }

  const handleStopRecognition = () => {
    stopAllMedia()
  }

  // Interactive Trap / Accuracy Simulator
  const handleRunSimulatedTest = (testWord: string) => {
    setMicError(null)
    const outcome = computePronunciationEvaluation(testWord, [], 0.92, currentItem)
    setEvalResult(outcome)
  }

  const togglePlayUserAudio = () => {
    if (!userAudioBlobUrl) return

    if (!userAudioPlayerRef.current) {
      const audio = new Audio(userAudioBlobUrl)
      audio.onended = () => setIsPlayingUserAudio(false)
      audio.onerror = () => setIsPlayingUserAudio(false)
      userAudioPlayerRef.current = audio
    }

    if (isPlayingUserAudio) {
      userAudioPlayerRef.current.pause()
      setIsPlayingUserAudio(false)
    } else {
      userAudioPlayerRef.current.currentTime = 0
      userAudioPlayerRef.current.play()
      setIsPlayingUserAudio(true)
    }
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
            Sessiz harfler, heceleme tuzakları ve Türk öğrencilerin en sık takıldığı kelimelerin fonetik sırları. Yavaş dinleyin, mikrofona konuşun veya simülatör ile tuzakları test edin!
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
                    stopAllMedia()
                    setSelectedWordIndex(idx)
                    setEvalResult(null)
                    setMicError(null)
                    if (userAudioBlobUrl) {
                      URL.revokeObjectURL(userAudioBlobUrl)
                      setUserAudioBlobUrl(null)
                    }
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

              {/* Interactive Speech Recognition & Real Mic Section */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-slate-800 text-center space-y-4">
                {/* Browser Compatibility Notice if in Opera or Firefox */}
                {browserNotice && (
                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-[11px] text-amber-200 text-left flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-300">Tarayıcı Uyarısı: </span>
                      {browserNotice}
                    </div>
                  </div>
                )}

                <div className="text-xs text-slate-400">
                  {isListening
                    ? 'Mikrofon canlı dinliyor... Lütfen kelimeyi yüksek ve net sesle telaffuz edin:'
                    : 'Mikrofona konuşarak veya aşağıdaki tuzak testleri ile fonetik motorunu test edin:'}
                </div>

                {/* Live Mic Volume Waveform Visualizer */}
                {isListening && (
                  <div className="flex items-center justify-center gap-1.5 h-10 py-1">
                    {Array.from({ length: 16 }).map((_, i) => {
                      const wave = Math.sin((i / 16) * Math.PI)
                      const barHeight = Math.max(4, Math.min(36, (micVolume / 100) * 36 * wave + 4))
                      return (
                        <span
                          key={i}
                          style={{ height: `${barHeight}px` }}
                          className="w-1.5 rounded-full bg-emerald-400 transition-all duration-75 shadow-sm shadow-emerald-400/50"
                        />
                      )
                    })}
                  </div>
                )}

                {/* Primary Mic Actions */}
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
                </div>

                {/* Instant Phonetic Engine Verifiers / Simulation Chips */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-400 font-semibold mb-2 flex items-center justify-center gap-1.5">
                    <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Fonetik Motoru Doğrulama Testleri (Tek Tıkla Dene):</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button
                      onClick={() => handleRunSimulatedTest(currentItem.sampleMistake)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-950/40 text-rose-300 border border-rose-500/40 hover:bg-rose-900/40 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                      title="Türkçe tuzak telaffuzunun nasıl yakalandığını görün"
                    >
                      <span>⚠️ Tuzak Testi:</span>
                      <span className="font-mono text-rose-200">"{currentItem.sampleMistake}" dene</span>
                    </button>

                    <button
                      onClick={() => handleRunSimulatedTest(currentItem.sampleCorrect)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-950/40 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/40 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                      title="Doğru telaffuzun başarıyla geçmesini test edin"
                    >
                      <span>✨ Doğru Telaffuz:</span>
                      <span className="font-mono text-emerald-200">"{currentItem.sampleCorrect}" dene</span>
                    </button>
                  </div>
                </div>

                {/* Manual Text Input Test */}
                <div className="pt-2 border-t border-slate-800/80 max-w-md mx-auto space-y-1.5">
                  <div className="text-[11px] text-slate-400 font-semibold flex items-center justify-center gap-1.5">
                    <span>✍️ Veya Telaffuzunu Yazarak Anında Test Et:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={customInput}
                      onChange={(e) => setCustomInput(e.target.value)}
                      placeholder='Örn: "comfartable" veya "comfortable"...'
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
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
                      className="px-3.5 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 transition-all cursor-pointer whitespace-nowrap"
                    >
                      Analiz Et
                    </button>
                  </div>
                </div>

                {/* Error Banner if mic denied / no speech */}
                <AnimatePresence>
                  {micError && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 text-left space-y-3"
                    >
                      <div className="flex items-start gap-2.5">
                        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <div className="font-bold text-rose-300 text-sm">Tarayıcı Neden İzin Kutusu (Popup) Göstermedi?</div>
                          <div className="leading-relaxed">{micError}</div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/20 space-y-1.5 text-[11px] text-slate-300">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>🔒 2 Adımda Mikrofonu Açma:</span>
                        </div>
                        <p>
                          1. Ekranın en tepesindeki adres çubuğunda <strong>localhost:3000</strong> yazısının hemen solundaki <strong>kilit (🔒) veya ayarlar (🎛️)</strong> simgesine tıklayın.
                        </p>
                        <p>
                          2. <strong>Mikrofon (Microphone)</strong> seçeneğini <strong>"İzin Ver" (Allow)</strong> olarak değiştirin ve sayfayı yenileyin (<kbd className="px-1.5 py-0.5 bg-slate-800 rounded border border-slate-700">F5</kbd>).
                        </p>
                        <p className="text-slate-400 text-[10px] pt-0.5">
                          (Windows kullanıyorsanız: Windows Ayarları &gt; Gizlilik &gt; Mikrofon bölümünden masaüstü uygulamalarına mikrofon izni verildiğinden ve bilgisayarınıza bir kulaklık/mikrofon bağlı olduğundan emin olun.)
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* User Audio Recording Playback (Listen to yourself) */}
                {userAudioBlobUrl && (
                  <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700 flex flex-wrap items-center justify-between gap-3 text-left">
                    <div className="text-xs text-slate-300">
                      <span className="font-bold text-white block">Ses Kaydınız Alındı:</span>
                      <span className="text-slate-400 text-[11px]">Kendi telaffuzunuzu orijinal sesle yan yana kıyaslayın:</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={togglePlayUserAudio}
                        className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-all cursor-pointer"
                      >
                        {isPlayingUserAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                        <span>{isPlayingUserAudio ? 'Durdur' : '🎧 Kendi Sesini Dinle'}</span>
                      </button>

                      <button
                        onClick={() => handlePlayWord(currentItem.word, 0.65)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-750 transition-all cursor-pointer"
                      >
                        <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Orijinal (0.65x)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Evaluation Feedback Results */}
                <AnimatePresence>
                  {evalResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-xl border space-y-3 text-left ${
                        evalResult.status === 'trap'
                          ? 'bg-amber-950/30 border-amber-500/40'
                          : evalResult.status === 'success'
                          ? 'bg-emerald-950/30 border-emerald-500/40'
                          : 'bg-rose-950/30 border-rose-500/40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-semibold">Algılanan Telaffuz:</span>
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
                          Telaffuz Başarısı: %{evalResult.score}
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
