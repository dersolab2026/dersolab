'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Flame,
  CheckCircle2,
  Sparkles,
  Headphones,
  Clock,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { addStudyLogEntry } from '@/actions/study-log'
import { createClient } from '@/lib/supabase/client'
import { getTopicsForSubject } from '@/lib/exams/curriculum'

const SUBJECTS = [
  'TYT Matematik',
  'AYT Matematik',
  'TYT Geometri',
  'AYT Geometri',
  'TYT Türkçe / Paragraf',
  'AYT Edebiyat',
  'TYT Fizik',
  'AYT Fizik',
  'TYT Kimya',
  'AYT Kimya',
  'TYT Biyoloji',
  'AYT Biyoloji',
  'TYT Tarih',
  'AYT Tarih',
  'TYT Coğrafya',
  'AYT Coğrafya',
  'Felsefe & Din',
  'LGS Matematik',
  'LGS Türkçe',
  'LGS Fen Bilimleri',
  'LGS İnkılap Tarihi',
  'İngilizce',
]

const MOTIVATION_QUOTES = [
  '“Bugün döktüğün her damla alın teri, sınav salonunda özgüvenin olacak.”',
  '“Küçük adımlar, büyük net artışlarını doğurur. Masada kalmaya devam et.”',
  '“Rakiplerin yorulduğunda devam edenler, hayal ettikleri üniversiteye girerler.”',
  '“Zorlandığın an, tam olarak beyninin yeni bir nöron yolu açtığı andır.”',
  '“Kendine inan. L.A.B. ve DersoLab her zaman senin yanında.”',
]

interface StudyPeer {
  id: string
  name: string
  subject: string
  modeLabel: string
  minutesActive: number
  isSelf?: boolean
}

const AMBIENT_PEERS: StudyPeer[] = [
  { id: 'p1', name: 'Zeynep K.', subject: 'AYT Matematik (Türev)', modeLabel: '50 Dk Derin Odak', minutesActive: 38 },
  { id: 'p2', name: 'Kerem A.', subject: 'TYT Türkçe (Paragraf)', modeLabel: '25 Dk Pomodoro', minutesActive: 19 },
  { id: 'p3', name: 'Elif S.', subject: 'LGS Fen Bilimleri', modeLabel: '25 Dk Pomodoro', minutesActive: 22 },
  { id: 'p4', name: 'Mert D.', subject: 'AYT Fizik (Optik)', modeLabel: '50 Dk Derin Odak', minutesActive: 44 },
  { id: 'p5', name: 'Defne T.', subject: 'TYT Kimya', modeLabel: '25 Dk Pomodoro', minutesActive: 14 },
]

type Mode = 'pomodoro_25' | 'deep_50' | 'short_break' | 'long_break'

export function StudyRoomClient() {
  const [mode, setMode] = useState<Mode>('pomodoro_25')
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [completedSessions, setCompletedSessions] = useState(0)
  const [totalFocusedMinutes, setTotalFocusedMinutes] = useState(0)

  // Ambiyans Sesi Durumu (Web Audio API)
  const [ambientSound, setAmbientSound] = useState<'off' | 'rain' | 'library' | 'waves'>('off')
  const [volume, setVolume] = useState(0.5)
  const audioContextRef = useRef<AudioContext | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)
  const noiseSourceRef = useRef<AudioNode | null>(null)

  // Günlüğe Kaydetme Formu
  const [saveModalOpen, setSaveModalOpen] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('TYT Matematik')
  const [topicName, setTopicName] = useState('')
  const [questionsCount, setQuestionsCount] = useState<number | ''>('')
  const [isSaving, setIsSaving] = useState(false)

  // Canlı Kütüphane (Multiplayer Presence)
  const [livePeers, setLivePeers] = useState<StudyPeer[]>([])

  // Rastgele motivasyon sözü
  const [quoteIndex, setQuoteIndex] = useState(0)

  const suggestedTopics = useMemo(() => getTopicsForSubject(selectedSubject), [selectedSubject])

  // Supabase Realtime Presence: Canlı Kütüphane Odası
  useEffect(() => {
    try {
      const supabase = createClient()
      const peerKey = `peer-${Math.random().toString(36).slice(2, 8)}`
      const channel = supabase.channel('study-room:global', {
        config: { presence: { key: peerKey } },
      })

      channel
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState()
          const found: StudyPeer[] = []
          for (const [k, list] of Object.entries(state)) {
            if (k === peerKey) continue
            const first = (list as any[])?.[0]
            if (first) {
              found.push({
                id: k,
                name: first.name || 'DersoLab Öğrencisi',
                subject: first.subject || 'TYT Matematik',
                modeLabel: first.modeLabel || '25 Dk Pomodoro',
                minutesActive: first.minutesActive || 15,
              })
            }
          }
          setLivePeers(found)
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              name: 'Sen (Aktif)',
              subject: selectedSubject,
              modeLabel: mode === 'deep_50' ? '50 Dk Derin Odak' : '25 Dk Pomodoro',
              minutesActive: Math.max(1, totalFocusedMinutes),
            })
          }
        })

      return () => {
        supabase.removeChannel(channel)
      }
    } catch {
      // Realtime opsiyoneldir
    }
  }, [selectedSubject, mode, totalFocusedMinutes])

  const displayedPeers = useMemo(() => {
    const selfPeer: StudyPeer = {
      id: 'self',
      name: 'Sen (Masada)',
      subject: selectedSubject,
      modeLabel: isRunning
        ? mode === 'deep_50'
          ? '🔥 50 Dk Odakta'
          : '🔥 25 Dk Odakta'
        : 'Hazırlanıyor',
      minutesActive: totalFocusedMinutes,
      isSelf: true,
    }
    return [selfPeer, ...livePeers, ...AMBIENT_PEERS].slice(0, 6)
  }, [selectedSubject, isRunning, mode, totalFocusedMinutes, livePeers])

  // Mode değişiminde süreyi sıfırla
  const handleModeChange = (newMode: Mode) => {
    setIsRunning(false)
    setMode(newMode)
    if (newMode === 'pomodoro_25') setTimeLeft(25 * 60)
    else if (newMode === 'deep_50') setTimeLeft(50 * 60)
    else if (newMode === 'short_break') setTimeLeft(5 * 60)
    else if (newMode === 'long_break') setTimeLeft(10 * 60)
  }

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false)
      // Seans tamamlandı
      if (mode === 'pomodoro_25' || mode === 'deep_50') {
        const addedMins = mode === 'pomodoro_25' ? 25 : 50
        setCompletedSessions((c) => c + 1)
        setTotalFocusedMinutes((m) => m + addedMins)
        toast.success(`Tebrikler! ${addedMins} dakikalık odaklanma seansını başarıyla tamamladın! 🎯`)
        setSaveModalOpen(true)
      } else {
        toast.info('Mola sona erdi! Hazırsan yeni bir odaklanma seansına başlayalım.')
      }
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, mode])

  // Web Audio Synthesizer (Harici MP3 olmadan %100 güvenilir doğal ambiyans)
  useEffect(() => {
    if (ambientSound === 'off') {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {})
        audioContextRef.current = null
      }
      return
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      const ctx = new AudioCtx()
      audioContextRef.current = ctx

      const gain = ctx.createGain()
      gain.gain.value = volume * 0.15
      gain.connect(ctx.destination)
      gainNodeRef.current = gain

      // White/Pink noise buffer
      const bufferSize = ctx.sampleRate * 2
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }

      const whiteNoise = ctx.createBufferSource()
      whiteNoise.buffer = noiseBuffer
      whiteNoise.loop = true

      // Filter settings depending on ambient sound
      const filter = ctx.createBiquadFilter()
      if (ambientSound === 'rain') {
        filter.type = 'lowpass'
        filter.frequency.value = 800
      } else if (ambientSound === 'library') {
        filter.type = 'bandpass'
        filter.frequency.value = 450
        filter.Q.value = 1.0
      } else if (ambientSound === 'waves') {
        filter.type = 'lowpass'
        filter.frequency.value = 350
      }

      whiteNoise.connect(filter)
      filter.connect(gain)
      whiteNoise.start()
      noiseSourceRef.current = whiteNoise
    } catch (e) {
      console.warn('Web Audio başlatılamadı:', e)
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {})
        audioContextRef.current = null
      }
    }
  }, [ambientSound, volume])

  // Volume kontrolü
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume * 0.15
    }
  }, [volume])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  // Sınav Geri Sayımı (YKS 2027 Haziran)
  const calculateDaysLeft = () => {
    const examDate = new Date('2027-06-20T10:15:00+03:00').getTime()
    const now = Date.now()
    const diff = examDate - now
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
  }

  // Günlüğe Kaydetme
  const handleSaveToStudyLog = async () => {
    setIsSaving(true)
    const hours = mode === 'pomodoro_25' ? 0.42 : mode === 'deep_50' ? 0.83 : 0.5
    const today = new Date().toISOString().slice(0, 10)

    try {
      const res = await addStudyLogEntry({
        logDate: today,
        subject: selectedSubject,
        topic: topicName || 'Pomodoro Odaklanma Seansı',
        hours: Number(hours.toFixed(2)),
        questionsSolved: questionsCount ? Number(questionsCount) : undefined,
        source: 'DersoLab Pomodoro Odası',
      })

      if (res.success) {
        toast.success('Seans başarıyla çalışma günlüğüne işlendi! 🚀')
        setSaveModalOpen(false)
        setTopicName('')
        setQuestionsCount('')
      } else {
        toast.error(res.error || 'Günlüğe kaydedilemedi.')
      }
    } catch {
      toast.error('Bağlantı hatası oluştu.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Üst Bilgi & Sınav Sayacı */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sınav Geri Sayımı */}
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xl shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">Hedefe Kalan Süre</div>
            <div className="text-2xl font-black text-white">
              {calculateDaysLeft()} <span className="text-sm font-semibold text-slate-400">Gün</span>
            </div>
          </div>
        </div>

        {/* Günlük Odaklanma Süresi */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xl shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Bugünkü Odaklanma</div>
            <div className="text-2xl font-black text-white">
              {totalFocusedMinutes} <span className="text-sm font-semibold text-slate-400">Dakika</span>
            </div>
          </div>
        </div>

        {/* Tamamlanan Seanslar */}
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-black text-xl shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-bold text-blue-300 uppercase tracking-wider">Tamamlanan Seans</div>
            <div className="text-2xl font-black text-white">
              {completedSessions} <span className="text-sm font-semibold text-slate-400">Pomodoro</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ana Sayaç Kartı */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E131F]/90 backdrop-blur-xl p-8 sm:p-12 shadow-2xl flex flex-col items-center justify-center text-center">
        {/* Arka plan ışıltısı */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-emerald-500/15 via-blue-500/10 to-transparent blur-[90px] pointer-events-none rounded-full" />

        {/* Aktif Çalışılan Ders Seçici */}
        <div className="mb-4 z-10 flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">Şu anki çalışma odağın:</span>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-bold text-emerald-300 focus:outline-none focus:border-emerald-500"
          >
            {SUBJECTS.map((s) => (
              <option key={s} value={s} className="bg-slate-900 text-slate-200">
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Mod Seçiciler */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-white/5 border border-white/10 mb-8 z-10">
          <button
            onClick={() => handleModeChange('pomodoro_25')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'pomodoro_25'
                ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            🔥 Klasik (25 Dk)
          </button>
          <button
            onClick={() => handleModeChange('deep_50')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'deep_50'
                ? 'bg-blue-500 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            🧠 Derin Odak (50 Dk)
          </button>
          <button
            onClick={() => handleModeChange('short_break')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'short_break'
                ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            ☕ Kısa Mola (5 Dk)
          </button>
          <button
            onClick={() => handleModeChange('long_break')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mode === 'long_break'
                ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            🌿 Uzun Mola (10 Dk)
          </button>
        </div>

        {/* Dijital Sayaç */}
        <div className="my-6 z-10">
          <div className="font-mono text-7xl sm:text-9xl font-black tracking-tight text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.15)] select-none">
            {formattedTime}
          </div>
          <div className="text-xs uppercase tracking-widest text-slate-400 mt-2 font-semibold">
            {mode === 'pomodoro_25'
              ? `${selectedSubject} · 25 Dk Odak Seansı`
              : mode === 'deep_50'
              ? `${selectedSubject} · 50 Dk Derin Odak`
              : 'Dinlenme ve Yenilenme Zamanı'}
          </div>
        </div>

        {/* Kontrol Düğmeleri */}
        <div className="flex items-center gap-4 mt-6 z-10">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-4 rounded-2xl font-black text-lg flex items-center gap-3 transition-all duration-300 transform active:scale-95 ${
              isRunning
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.4)]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-6 h-6 fill-current" />
                Duraklat
              </>
            ) : (
              <>
                <Play className="w-6 h-6 fill-current" />
                Çalışmayı Başlat
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsRunning(false)
              handleModeChange(mode)
            }}
            title="Sıfırla"
            className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all active:scale-95"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>

        {/* Ambiyans Sesleri Seçici Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 w-full flex flex-wrap items-center justify-between gap-4 z-10">
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-sm">
            <Headphones className="w-4 h-4 text-emerald-400" />
            <span>Arka Plan Ambiyansı:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setAmbientSound('off')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                ambientSound === 'off'
                  ? 'bg-white/20 text-white'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              Sessiz
            </button>
            <button
              onClick={() => setAmbientSound('rain')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                ambientSound === 'rain'
                  ? 'bg-blue-500/30 border border-blue-400/40 text-blue-300'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              🌧️ Yağmur Sesi
            </button>
            <button
              onClick={() => setAmbientSound('library')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                ambientSound === 'library'
                  ? 'bg-amber-500/30 border border-amber-400/40 text-amber-300'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              📚 Kütüphane Fısıltısı
            </button>
            <button
              onClick={() => setAmbientSound('waves')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                ambientSound === 'waves'
                  ? 'bg-teal-500/30 border border-teal-400/40 text-teal-300'
                  : 'bg-white/5 text-slate-400 hover:text-white'
              }`}
            >
              🌊 432 Hz Dalgalar
            </button>
          </div>

          {ambientSound !== 'off' && (
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-slate-400" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-20 accent-emerald-500 cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>

      {/* Canlı Çalışma Kütüphanesi (Multiplayer Study Hall) */}
      <div className="rounded-3xl border border-white/10 bg-[#0E131F]/80 p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white">DersoLab Canlı Çalışma Kütüphanesi</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-black text-emerald-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {displayedPeers.length + 18} Öğrenci Masada
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Hedefine koşarken yalnız değilsin; şu an seninle aynı anda odaklanan öğrenciler:
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {displayedPeers.map((peer) => (
            <div
              key={peer.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                peer.isSelf
                  ? 'border-emerald-500/40 bg-emerald-950/20'
                  : 'border-white/10 bg-white/[0.02]'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <p className="text-xs font-black text-white truncate">{peer.name}</p>
                </div>
                <p className="text-xs font-semibold text-slate-300 truncate mt-0.5">
                  {peer.subject}
                </p>
                <p className="text-[10px] font-bold text-slate-500 mt-0.5">{peer.modeLabel}</p>
              </div>
              <div className="text-right shrink-0">
                <span className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-mono font-bold text-emerald-300">
                  {peer.minutesActive} dk
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Günün Motivasyon & Koçluk Notu */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
              DersoLab Koçluk Notu
            </div>
            <p className="text-sm text-slate-300 italic">{MOTIVATION_QUOTES[quoteIndex]}</p>
          </div>
        </div>
        <button
          onClick={() => setQuoteIndex((prev) => (prev + 1) % MOTIVATION_QUOTES.length)}
          className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 transition-all shrink-0"
        >
          Yenisini Gör
        </button>
      </div>

      {/* Seansı Günlüğe Kaydetme Modalı */}
      <AnimatePresence>
        {saveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#121826] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative"
            >
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white">Harika Odaklanma!</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Bu seansı çalışma günlüğüne ekleyerek koçunun ve velinin görmesini sağla.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Hangi Dersi Çalıştın?
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="w-full bg-[#1A2234] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Konu Başlığı (MEB/ÖSYM Müfredatı)
                  </label>
                  <input
                    type="text"
                    list="study-room-topics"
                    placeholder="Örn: Trigonometri, Paragraf Analizi"
                    value={topicName}
                    onChange={(e) => setTopicName(e.target.value)}
                    className="w-full bg-[#1A2234] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <datalist id="study-room-topics">
                    {suggestedTopics.map((t) => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Çözülen Soru Sayısı (Opsiyonel)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Örn: 25"
                    value={questionsCount}
                    onChange={(e) => setQuestionsCount(e.target.value === '' ? '' : parseInt(e.target.value))}
                    className="w-full bg-[#1A2234] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="pt-4 flex items-center gap-3">
                  <button
                    onClick={() => setSaveModalOpen(false)}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 font-semibold text-sm transition-all"
                  >
                    Şimdilik Atlama
                  </button>
                  <button
                    onClick={handleSaveToStudyLog}
                    disabled={isSaving}
                    className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] disabled:opacity-50"
                  >
                    {isSaving ? 'Kaydediliyor...' : 'Günlüğe Kaydet'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
