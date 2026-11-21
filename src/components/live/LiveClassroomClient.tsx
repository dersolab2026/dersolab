'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Video,
  LogOut,
  Clock,
  FlaskConical,
  X,
  ExternalLink,
  Columns2,
  PenTool,
  Maximize2,
  Minimize2,
  Sparkles,
  Edit3,
  Check,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import {
  SharedWhiteboardPanel,
  type WhiteboardStroke,
  type WhiteboardGridMode,
} from './SharedWhiteboardPanel'

interface LiveClassroomClientProps {
  bookingId: string
  currentUserName: string
  isInstructor: boolean
  otherPersonName: string
  startTime: string
  endTime: string
  topicNote?: string | null
  meetLink?: string | null
  instructorSubjects?: string[]
}

interface BranchStudioPreset {
  id: string
  badge: string
  examLabel: string
  defaultTopic: string
  slogan: string
  labHref: string
  iconicTitle: string
  iconicItems: Array<{ label: string; value: string; tone: 'cyan' | 'white' | 'orange' }>
}

const BRANCH_STUDIO_PRESETS: Record<string, BranchStudioPreset> = {
  kimya: {
    id: 'kimya',
    badge: 'KİMYA',
    examLabel: 'YKS & LGS • MAARİF • KİMYA',
    defaultTopic: 'KİMYA ATÖLYESİ',
    slogan: 'Ezberleme, Keşfet! Sıfırdan Zirveye Kimya',
    labHref: '/lab/kimya',
    iconicTitle: 'KİMYANIN İKONLARI',
    iconicItems: [
      { label: 'Avogadro:', value: '6,02 × 10²³', tone: 'cyan' },
      { label: 'İdeal Gaz:', value: 'P·V = n·R·T', tone: 'white' },
      { label: 'NŞA Gaz:', value: '1 mol = 22,4 L', tone: 'orange' },
    ],
  },
  matematik: {
    id: 'matematik',
    badge: 'MATEMATİK',
    examLabel: 'YKS & LGS • MAARİF • MATEMATİK',
    defaultTopic: 'MATEMATİK & GEOMETRİ',
    slogan: 'Ezberleme, Keşfet! Analitik & Yeni Nesil Matematik',
    labHref: '/lab/matematik',
    iconicTitle: 'MATEMATİĞİN İKONLARI',
    iconicItems: [
      { label: 'Pisagor:', value: 'a² + b² = c²', tone: 'cyan' },
      { label: 'Altın Oran:', value: 'φ = 1,618...', tone: 'white' },
      { label: 'Diskriminant:', value: 'Δ = b² - 4ac', tone: 'orange' },
    ],
  },
  fizik: {
    id: 'fizik',
    badge: 'FİZİK',
    examLabel: 'YKS & LGS • MAARİF • FİZİK',
    defaultTopic: 'FİZİK LABORATUVARI',
    slogan: 'Ezberleme, Keşfet! Doğa Yasaları & Fizik',
    labHref: '/lab/fizik',
    iconicTitle: 'FİZİĞİN İKONLARI',
    iconicItems: [
      { label: 'Newton:', value: 'F = m · a', tone: 'cyan' },
      { label: 'Einstein:', value: 'E = m · c²', tone: 'white' },
      { label: 'Ohm Yasası:', value: 'V = I · R', tone: 'orange' },
    ],
  },
  biyoloji: {
    id: 'biyoloji',
    badge: 'BİYOLOJİ',
    examLabel: 'YKS & LGS • MAARİF • BİYOLOJİ',
    defaultTopic: 'BİYOLOJİ & YAŞAM',
    slogan: 'Ezberleme, Keşfet! Hücreden Ekosisteme Biyoloji',
    labHref: '/lab/biyoloji',
    iconicTitle: 'BİYOLOJİNİN İKONLARI',
    iconicItems: [
      { label: 'Merkez Dogma:', value: 'DNA → RNA', tone: 'cyan' },
      { label: 'Hücre Enerjisi:', value: 'ATP Sentezi', tone: 'white' },
      { label: 'Mendel:', value: '3 : 1 Kalıtım', tone: 'orange' },
    ],
  },
  turkce: {
    id: 'turkce',
    badge: 'TÜRKÇE',
    examLabel: 'YKS & LGS • TÜRKÇE & EDEBİYAT',
    defaultTopic: 'PARAGRAF & DİL BİLGİSİ',
    slogan: 'Ezberleme, Keşfet! Hızlı Okuma & Anlam Analizi',
    labHref: '/lab/turkce',
    iconicTitle: 'TÜRKÇENİN İKONLARI',
    iconicItems: [
      { label: 'Odak Okuma:', value: 'Biyonik Hız', tone: 'cyan' },
      { label: 'Paragraf:', value: 'Bağlam & Çıkarım', tone: 'white' },
      { label: 'Dil Bilgisi:', value: 'Ses & Yazım', tone: 'orange' },
    ],
  },
  cografya: {
    id: 'cografya',
    badge: 'COĞRAFYA',
    examLabel: 'YKS & LGS • COĞRAFYA & SOSYAL',
    defaultTopic: 'COĞRAFYA & ATLAS',
    slogan: 'Ezberleme, Keşfet! Harita & Doğa Sistemleri',
    labHref: '/lab/sosyal',
    iconicTitle: 'COĞRAFYANIN İKONLARI',
    iconicItems: [
      { label: 'Rüzgârlar:', value: 'KaYıP SaKaL', tone: 'cyan' },
      { label: 'Eksen Eğikliği:', value: "23° 27'", tone: 'white' },
      { label: 'Türkiye:', value: '36°–42°K • 26°–45°D', tone: 'orange' },
    ],
  },
  tarih: {
    id: 'tarih',
    badge: 'TARİH',
    examLabel: 'YKS & LGS • TARİH & İNKILAP',
    defaultTopic: 'TARİH & KRONOLOJİ',
    slogan: 'Ezberleme, Keşfet! Kronolojik & Haritalı Tarih',
    labHref: '/lab/sosyal',
    iconicTitle: 'TARİHİN İKONLARI',
    iconicItems: [
      { label: 'Yöntem:', value: 'Sebep & Sonuç', tone: 'cyan' },
      { label: 'Zaman:', value: 'Kronolojik Atlas', tone: 'white' },
      { label: 'Analiz:', value: 'Belge & Harita', tone: 'orange' },
    ],
  },
  ingilizce: {
    id: 'ingilizce',
    badge: 'İNGİLİZCE',
    examLabel: 'LGS & YDT • PRATİK İNGİLİZCE',
    defaultTopic: 'İNGİLİZCE ATÖLYESİ',
    slogan: 'Ezberleme, Keşfet! Doğal Konuşma & Dil Becerisi',
    labHref: '/lab/ingilizce',
    iconicTitle: 'DİLİN İKONLARI',
    iconicItems: [
      { label: 'İletişim:', value: 'Akıcı Diyalog', tone: 'cyan' },
      { label: 'Kelime:', value: 'Bağlam İçi Kalıp', tone: 'white' },
      { label: 'Fonetik:', value: 'Doğal Telaffuz', tone: 'orange' },
    ],
  },
  kocluk: {
    id: 'kocluk',
    badge: 'KOÇLUK',
    examLabel: 'LGS & YKS • AKADEMİK KOÇLUK',
    defaultTopic: 'STRATEJİ & NET ANALİZİ',
    slogan: 'Ezberleme, Keşfet! Kişiye Özel Sınav Stratejisi',
    labHref: '/lab',
    iconicTitle: 'BAŞARININ İKONLARI',
    iconicItems: [
      { label: 'Deneme:', value: 'Turlama Tekniği', tone: 'cyan' },
      { label: 'Hafıza:', value: 'Aralıklı Tekrar', tone: 'white' },
      { label: 'Yönetim:', value: 'Net & Süre Analizi', tone: 'orange' },
    ],
  },
}

const BRANCH_ORDER = [
  'kimya',
  'matematik',
  'fizik',
  'biyoloji',
  'turkce',
  'cografya',
  'tarih',
  'ingilizce',
  'kocluk',
] as const

function detectInitialBranchKey(subjects?: string[], topicNote?: string | null): string {
  const combined = `${(subjects || []).join(' ')} ${topicNote || ''}`.toLocaleLowerCase('tr-TR')
  if (combined.includes('kimya') || combined.includes('mol') || combined.includes('atom')) return 'kimya'
  if (combined.includes('matematik') || combined.includes('geometri') || combined.includes('türev') || combined.includes('parabol')) return 'matematik'
  if (combined.includes('fizik') || combined.includes('optik') || combined.includes('kuvvet')) return 'fizik'
  if (combined.includes('biyoloji') || combined.includes('hücre') || combined.includes('fen')) return 'biyoloji'
  if (combined.includes('türkçe') || combined.includes('turkce') || combined.includes('edebiyat') || combined.includes('paragraf')) return 'turkce'
  if (combined.includes('coğrafya') || combined.includes('cografya') || combined.includes('harita') || combined.includes('iklim')) return 'cografya'
  if (combined.includes('tarih') || combined.includes('inkılap') || combined.includes('sosyal')) return 'tarih'
  if (combined.includes('ingilizce') || combined.includes('ydt')) return 'ingilizce'
  if (combined.includes('koçluk') || combined.includes('kocluk') || combined.includes('rehberlik')) return 'kocluk'
  return 'kimya'
}

const LAB_MODULES = [
  { title: 'Kimya (3D Atom, Gazlar & Titrasyon)', href: '/lab/kimya' },
  { title: 'Matematik (EBOB-EKOK, Parabol & Türev)', href: '/lab/matematik' },
  { title: 'Fizik (Devre, Optik & Dinamik)', href: '/lab/fizik' },
  { title: 'Biyoloji (Punnett, Hücre & Fotosentez)', href: '/lab/biyoloji' },
  { title: 'Türkçe (Biyonik Okuma & Ses Olayları)', href: '/lab/turkce' },
  { title: 'Sosyal & Coğrafya (81 İl Atlası & KaYıP SaKaL)', href: '/lab/sosyal' },
  { title: 'İngilizce (Telaffuz & Görsel Sahne)', href: '/lab/ingilizce' },
]

declare global {
  interface Window {
    JitsiMeetExternalAPI?: any
  }
}

function DersoLabMonogram({ size = 56 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="shrink-0">
      <defs>
        <linearGradient id="dl-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <linearGradient id="dl-orange" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>
      </defs>
      <path d="M10 10L30 10L30 70L44 70L64 90L10 90Z" fill="url(#dl-cyan)" />
      <path
        d="M42 10L50 10C67.346 10.004 82.712 21.188 88.05 37.692C93.387 54.196 87.479 72.26 73.42 82.42L58.91 67.91C67.226 63.777 71.603 54.464 69.478 45.424C67.354 36.384 59.286 29.996 50 30L42 30Z"
        fill="url(#dl-orange)"
      />
    </svg>
  )
}

export function LiveClassroomClient({
  bookingId,
  currentUserName,
  isInstructor,
  otherPersonName,
  topicNote,
  meetLink,
  instructorSubjects,
}: LiveClassroomClientProps) {
  const router = useRouter()
  const jitsiContainerRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<any>(null)
  const channelRef = useRef<any>(null)

  const initialBranch = detectInitialBranchKey(instructorSubjects, topicNote)
  const [branchKey, setBranchKey] = useState<string>(initialBranch)
  const preset = BRANCH_STUDIO_PRESETS[branchKey] || BRANCH_STUDIO_PRESETS.kimya

  const [customTopic, setCustomTopic] = useState<string>(
    topicNote?.trim() ? topicNote.trim().toLocaleUpperCase('tr-TR') : ''
  )
  const [editingTopic, setEditingTopic] = useState(false)
  const [topicDraft, setTopicDraft] = useState('')

  const [loading, setLoading] = useState(true)
  const [labModalOpen, setLabModalOpen] = useState(false)
  // Studio mode defaults to TRUE (whiteboard on main stage, camera in glowing right-bottom pod)
  const [studioMode, setStudioMode] = useState(true)
  const [activeSplitLabUrl, setActiveSplitLabUrl] = useState<string | null>(null)
  const [strokes, setStrokes] = useState<WhiteboardStroke[]>([])
  const [whiteboardBg, setWhiteboardBg] = useState<string | null>(null)
  const [gridMode, setGridMode] = useState<WhiteboardGridMode>('notebook')
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  const displayTopic = customTopic || preset.defaultTopic

  // Safe unique room name
  const roomName = `dersolab-live-${bookingId.replace(/[^a-zA-Z0-9]/g, '')}`

  // Lesson Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Supabase Realtime: Eğitmen ve öğrenci arasında Stüdyo, L.A.B. ve Soru Tahtası senkronizasyonu
  useEffect(() => {
    try {
      const supabase = createClient()
      const channel = supabase.channel(`live-room:${bookingId}`, {
        config: { broadcast: { self: false } },
      })

      channel
        .on('broadcast', { event: 'lab-sync' }, ({ payload }) => {
          if (payload && typeof payload.url !== 'undefined') {
            setActiveSplitLabUrl(payload.url)
            if (payload.url) setStudioMode(true)
          }
        })
        .on('broadcast', { event: 'studio-mode' }, ({ payload }) => {
          if (payload && typeof payload.studioMode === 'boolean') {
            setStudioMode(payload.studioMode)
          }
        })
        .on('broadcast', { event: 'studio-meta' }, ({ payload }) => {
          if (payload?.branchKey && BRANCH_STUDIO_PRESETS[payload.branchKey]) {
            setBranchKey(payload.branchKey)
          }
          if (typeof payload?.customTopic === 'string') {
            setCustomTopic(payload.customTopic)
          }
        })
        .on('broadcast', { event: 'wb-stroke' }, ({ payload }) => {
          if (payload?.stroke) {
            setStrokes((prev) => [...prev, payload.stroke])
          }
        })
        .on('broadcast', { event: 'wb-undo' }, () => {
          setStrokes((prev) => prev.slice(0, -1))
        })
        .on('broadcast', { event: 'wb-clear' }, () => {
          setStrokes([])
        })
        .on('broadcast', { event: 'wb-bg' }, ({ payload }) => {
          setWhiteboardBg(payload?.dataUrl ?? null)
        })
        .on('broadcast', { event: 'wb-grid' }, ({ payload }) => {
          if (payload?.mode) setGridMode(payload.mode)
        })
        .subscribe()

      channelRef.current = channel

      return () => {
        supabase.removeChannel(channel)
        channelRef.current = null
      }
    } catch {
      // Realtime opsiyoneldir
    }
  }, [bookingId])

  const selectSplitLab = (url: string | null) => {
    setActiveSplitLabUrl(url)
    if (url) setStudioMode(true)
    setLabModalOpen(false)
    channelRef.current?.send({
      type: 'broadcast',
      event: 'lab-sync',
      payload: { url },
    })
  }

  const toggleStudioMode = (nextMode: boolean) => {
    setStudioMode(nextMode)
    channelRef.current?.send({
      type: 'broadcast',
      event: 'studio-mode',
      payload: { studioMode: nextMode },
    })
  }

  const handleCycleBranch = () => {
    if (!isInstructor) return
    const idx = BRANCH_ORDER.indexOf(branchKey as any)
    const nextKey = BRANCH_ORDER[(idx + 1) % BRANCH_ORDER.length]
    setBranchKey(nextKey)
    channelRef.current?.send({
      type: 'broadcast',
      event: 'studio-meta',
      payload: { branchKey: nextKey, customTopic },
    })
  }

  const handleSaveTopic = () => {
    const cleaned = topicDraft.trim().toLocaleUpperCase('tr-TR')
    setCustomTopic(cleaned)
    setEditingTopic(false)
    channelRef.current?.send({
      type: 'broadcast',
      event: 'studio-meta',
      payload: { branchKey, customTopic: cleaned },
    })
  }

  const handleAddStroke = (stroke: WhiteboardStroke) => {
    setStrokes((prev) => [...prev, stroke])
    channelRef.current?.send({
      type: 'broadcast',
      event: 'wb-stroke',
      payload: { stroke },
    })
  }

  const handleUndoStroke = () => {
    setStrokes((prev) => prev.slice(0, -1))
    channelRef.current?.send({
      type: 'broadcast',
      event: 'wb-undo',
      payload: {},
    })
  }

  const handleClearBoard = () => {
    setStrokes([])
    channelRef.current?.send({
      type: 'broadcast',
      event: 'wb-clear',
      payload: {},
    })
  }

  const handleChangeBgImage = (dataUrl: string | null) => {
    setWhiteboardBg(dataUrl)
    channelRef.current?.send({
      type: 'broadcast',
      event: 'wb-bg',
      payload: { dataUrl },
    })
  }

  const handleChangeGridMode = (mode: WhiteboardGridMode) => {
    setGridMode(mode)
    channelRef.current?.send({
      type: 'broadcast',
      event: 'wb-grid',
      payload: { mode },
    })
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60)
  const elapsedRemainderSeconds = elapsedSeconds % 60
  const formattedElapsed = `${String(elapsedMinutes).padStart(2, '0')}:${String(elapsedRemainderSeconds).padStart(2, '0')}`

  const handleLeave = useCallback(() => {
    if (apiRef.current) {
      apiRef.current.dispose()
      apiRef.current = null
    }
    router.push(isInstructor ? '/dashboard/instructor' : '/dashboard/student/bookings')
  }, [isInstructor, router])

  // Load Jitsi Meet External API once into persistent container
  useEffect(() => {
    const initJitsi = () => {
      if (!window.JitsiMeetExternalAPI || !jitsiContainerRef.current) return

      try {
        jitsiContainerRef.current.innerHTML = ''

        const domain = 'meet.jit.si'
        const options = {
          roomName,
          parentNode: jitsiContainerRef.current,
          width: '100%',
          height: '100%',
          userInfo: {
            displayName: `${currentUserName} (${isInstructor ? 'Eğitmen' : 'Öğrenci'})`,
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
            prejoinPageEnabled: false,
            disableDeepLinking: true,
            enableWelcomePage: false,
            enableClosePage: false,
            toolbarButtons: [
              'camera',
              'microphone',
              'desktop',
              'chat',
              'raisehand',
              'tileview',
              'fullscreen',
              'fodeviceselection',
              'settings',
              'hangup',
            ],
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            DEFAULT_BACKGROUND: '#0a101d',
            TOOLBAR_ALWAYS_VISIBLE: false,
          },
        }

        const api = new window.JitsiMeetExternalAPI(domain, options)
        apiRef.current = api

        api.addEventListener('videoConferenceJoined', () => {
          setLoading(false)
        })

        api.addEventListener('videoConferenceLeft', () => {
          handleLeave()
        })
      } catch (err) {
        console.error('Jitsi başlatma hatası:', err)
        setLoading(false)
      }
    }

    if (window.JitsiMeetExternalAPI) {
      initJitsi()
    } else {
      const script = document.createElement('script')
      script.src = 'https://meet.jit.si/external_api.js'
      script.async = true
      script.onload = () => initJitsi()
      script.onerror = () => setLoading(false)
      document.body.appendChild(script)
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose()
        apiRef.current = null
      }
    }
  }, [roomName, currentUserName, isInstructor, handleLeave])

  return (
    <div
      className="fixed inset-0 z-50 text-slate-100 flex flex-col overflow-hidden select-none"
      style={{
        background:
          'radial-gradient(circle at 88% 22%, rgba(2, 132, 199, 0.25) 0%, transparent 38%), radial-gradient(circle at 85% 82%, rgba(249, 115, 22, 0.22) 0%, transparent 34%), radial-gradient(circle at 75% 42%, #132038 0%, #0a101d 55%, #05070c 100%)',
      }}
    >
      {/* Subtle Presentation Studio Diagonal Stripes Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage:
            'repeating-linear-gradient(-35deg, rgba(56, 189, 248, 0.14) 0px, rgba(56, 189, 248, 0.14) 1px, transparent 1px, transparent 34px)',
        }}
      />

      {/* ================= MAIN STUDIO WORKSPACE ================= */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row gap-3.5 p-3 sm:p-4 pb-2 min-h-0 overflow-hidden">
        {/* LEFT MAIN STAGE (~78% in Studio Mode): Glowing Cyan-Indigo-Orange Bezel */}
        {studioMode && (
          <div className="flex-1 min-w-0 min-h-0 flex flex-col rounded-[26px] p-[2.5px] bg-gradient-to-br from-sky-400/85 via-indigo-500/50 to-orange-500/85 shadow-[0_12px_40px_rgba(0,0,0,0.65)]">
            <div className="flex-1 w-full h-full rounded-[24px] bg-[#080B11] overflow-hidden flex flex-col">
              {/* Stage Mode Switcher Strip */}
              <div className="h-10 px-3.5 bg-[#0d1526] border-b border-white/10 flex items-center justify-between gap-2 text-xs shrink-0">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => selectSplitLab(null)}
                    className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                      !activeSplitLabUrl
                        ? 'bg-amber-500/20 border border-amber-400/50 text-amber-200'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <PenTool className="w-3.5 h-3.5" />
                    <span>Sunum & Soru Tahtası</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => selectSplitLab(activeSplitLabUrl || preset.labHref)}
                    className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                      activeSplitLabUrl
                        ? 'bg-cyan-500/20 border border-cyan-400/50 text-cyan-200'
                        : 'bg-white/5 text-slate-400 hover:text-white'
                    }`}
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>3D L.A.B. ({preset.badge})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLabModalOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 font-semibold hidden sm:inline-flex items-center gap-1"
                  >
                    <span>Tüm Deneyler</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => toggleStudioMode(false)}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-bold flex items-center gap-1.5"
                  title="Kamerayı tam ekran yap"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Tam Ekran Kamera</span>
                </button>
              </div>

              {/* Active Stage Content: Shared Whiteboard OR Live 3D L.A.B. */}
              <div className="flex-1 min-h-0 w-full relative">
                {activeSplitLabUrl ? (
                  <iframe
                    src={activeSplitLabUrl}
                    title="DersoLab İnteraktif Simülasyon"
                    className="w-full h-full border-0 bg-[#080B11]"
                  />
                ) : (
                  <SharedWhiteboardPanel
                    strokes={strokes}
                    bgImage={whiteboardBg}
                    gridMode={gridMode}
                    onAddStroke={handleAddStroke}
                    onUndoStroke={handleUndoStroke}
                    onClearBoard={handleClearBoard}
                    onChangeBgImage={handleChangeBgImage}
                    onChangeGridMode={handleChangeGridMode}
                  />
                )}
              </div>
            </div>
          </div>
        )}

        {/* RIGHT STUDIO TOWER (In Studio Mode: 300px sidebar + circular/docked camera pod; In Full Camera Mode: 100% stage) */}
        <div
          className={
            studioMode
              ? 'w-full lg:w-[295px] xl:w-[315px] shrink-0 flex flex-row lg:flex-col gap-3 min-h-0'
              : 'flex-1 min-w-0 min-h-0 flex flex-col'
          }
        >
          {/* 3 STUDIO CARDS (Visible in Studio Mode on Desktop) */}
          {studioMode && (
            <div className="hidden lg:flex flex-col gap-3 shrink-0">
              {/* CARD 1: DersoLab Brand & Branch Logo Card */}
              <div className="relative rounded-[20px] bg-gradient-to-br from-[#131e36]/95 to-[#0b1222]/98 border border-slate-800 p-3.5 text-center shadow-xl overflow-hidden">
                <div className="absolute top-0 left-6 right-6 h-[3px] rounded-full bg-gradient-to-r from-sky-400 via-indigo-500 to-orange-500" />
                <div className="flex justify-center mt-0.5">
                  <DersoLabMonogram size={50} />
                </div>
                <div className="text-xl font-black tracking-tight text-white mt-1">DERSOLAB</div>
                <button
                  type="button"
                  onClick={handleCycleBranch}
                  title={isInstructor ? 'Branşı değiştirmek için tıkla' : preset.badge}
                  className={`mt-1.5 inline-flex items-center gap-1.5 px-4 py-0.5 rounded-full bg-orange-500/20 border border-orange-500 text-orange-400 text-xs font-extrabold tracking-widest uppercase transition-transform ${
                    isInstructor ? 'hover:scale-105 cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <span>{preset.badge}</span>
                </button>
              </div>

              {/* CARD 2: Active Lesson Topic Card */}
              <div className="rounded-[20px] bg-gradient-to-br from-[#131e36]/95 to-[#0b1222]/98 border-2 border-sky-400/70 p-3.5 text-center shadow-xl">
                <div className="inline-block px-3 py-1 rounded-lg bg-sky-700/35 border border-sky-400 text-sky-300 text-[11px] font-extrabold tracking-wider uppercase">
                  {preset.examLabel}
                </div>

                {editingTopic ? (
                  <div className="mt-2 flex items-center gap-1.5">
                    <input
                      type="text"
                      value={topicDraft}
                      onChange={(e) => setTopicDraft(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveTopic()}
                      placeholder={preset.defaultTopic}
                      autoFocus
                      className="w-full px-2.5 py-1 rounded-lg bg-slate-900 border border-amber-400/60 text-amber-300 font-black text-sm text-center uppercase focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSaveTopic}
                      className="p-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 hover:bg-emerald-500/30"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      if (!isInstructor) return
                      setTopicDraft(displayTopic)
                      setEditingTopic(true)
                    }}
                    title={isInstructor ? 'Ders başlığını düzenlemek için tıkla' : displayTopic}
                    className={`mt-2 flex items-center justify-center gap-1.5 ${
                      isInstructor ? 'cursor-pointer group' : ''
                    }`}
                  >
                    <h2 className="text-xl xl:text-2xl font-black text-yellow-400 tracking-wide uppercase leading-tight line-clamp-2">
                      {displayTopic}
                    </h2>
                    {isInstructor && (
                      <Edit3 className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                    )}
                  </div>
                )}

                <p className="text-xs font-semibold text-slate-400 mt-1">
                  Konu Anlatımı &amp; Soru Çözümü
                </p>
              </div>

              {/* CARD 3: Iconic Branch Signatures Card (Zero Per-Lesson Manual Work!) */}
              <div className="rounded-[20px] bg-gradient-to-br from-[#131e36]/95 to-[#0b1222]/98 border border-slate-700/80 p-3.5 shadow-xl">
                <div className="text-center text-[11px] font-extrabold tracking-widest text-orange-400 uppercase pb-2 border-b border-slate-800 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-orange-400" />
                  <span>{preset.iconicTitle}</span>
                </div>
                <div className="mt-2.5 space-y-2 text-xs">
                  {preset.iconicItems.map((item) => (
                    <div key={item.label} className="flex items-center justify-between gap-2">
                      <span className="font-bold text-slate-400">{item.label}</span>
                      <span
                        className={`font-extrabold tracking-tight ${
                          item.tone === 'cyan'
                            ? 'text-sky-400'
                            : item.tone === 'orange'
                              ? 'text-orange-400'
                              : 'text-white'
                        }`}
                      >
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* PERSISTENT JITSI CAMERA POD (Bottom-Right Neon Ring in Studio Mode, Full Stage in Camera Mode) */}
          <div
            className={
              studioMode
                ? 'flex-1 min-h-[180px] rounded-[26px] p-[3px] bg-gradient-to-tr from-sky-400 via-indigo-500 to-orange-400 shadow-[0_0_30px_rgba(56,189,248,0.22)] relative overflow-hidden flex flex-col'
                : 'flex-1 min-h-0 rounded-[26px] p-[2.5px] bg-gradient-to-br from-sky-400/85 via-indigo-500/50 to-orange-500/85 shadow-2xl relative overflow-hidden flex flex-col'
            }
          >
            <div className="relative flex-1 w-full h-full rounded-[23px] bg-[#0a101d] overflow-hidden">
              {/* Floating quick-toggle button on top-right of camera pod */}
              <button
                type="button"
                onClick={() => toggleStudioMode(!studioMode)}
                className="absolute top-2.5 right-2.5 z-20 px-2.5 py-1 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-white/15 text-xs font-bold text-slate-200 flex items-center gap-1.5 backdrop-blur-md transition-all"
                title={studioMode ? 'Kamerayı Tam Ekran Yap' : 'Sunum Stüdyosu Görünümüne Dön'}
              >
                {studioMode ? (
                  <>
                    <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Büyüt</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Sunum Stüdyosuna Dön</span>
                  </>
                )}
              </button>

              {loading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0a101d] text-center p-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-2.5 animate-pulse shadow-[0_0_24px_rgba(249,115,22,0.3)]">
                    <Video className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-black text-white">Stüdyo Kamerası Bağlanıyor</h3>
                  <p className="text-[11px] text-slate-400 mt-0.5 max-w-xs">
                    Şifreli kamera ve mikrofon kanalı hazırlanıyor...
                  </p>
                </div>
              )}

              <div ref={jitsiContainerRef} className="w-full h-full" />
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM STUDIO LOWER-THIRD BANNER STRIP ================= */}
      <footer className="relative z-20 px-3 sm:px-4 pb-3 pt-1 shrink-0">
        <div className="h-16 sm:h-[72px] px-4 rounded-[20px] bg-gradient-to-r from-[#131e36]/95 to-[#0b1222]/98 border border-slate-800 shadow-2xl flex items-center justify-between gap-3 relative overflow-hidden">
          {/* Left Vertical Cyan-Orange Accent Bar */}
          <div className="absolute left-0 top-2.5 bottom-2.5 w-1.5 rounded-r-full bg-gradient-to-b from-sky-400 via-indigo-500 to-orange-500" />

          {/* Left: Mini Logo + Title & Slogan + Participants */}
          <div className="flex items-center gap-3 min-w-0 pl-1">
            <DersoLabMonogram size={38} />
            <div className="min-w-0">
              <div className="flex items-center gap-2 truncate">
                <span className="font-black text-sm sm:text-lg tracking-tight text-white">
                  DERSOLAB <span className="text-orange-400">{preset.badge}</span>
                </span>
                <span className="text-slate-600 hidden md:inline">|</span>
                <span className="hidden md:inline font-bold text-xs sm:text-sm text-sky-400 truncate">
                  {preset.slogan}
                </span>
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-400 flex items-center gap-2 truncate">
                <span>
                  {isInstructor ? 'Öğrenci:' : 'Eğitmen:'}{' '}
                  <strong className="text-slate-200">{otherPersonName || 'Bağlanıyor...'}</strong>
                </span>
                <span className="text-slate-600">•</span>
                <span className="hidden sm:inline text-slate-300">
                  YouTube • Instagram • TikTok: <strong className="text-white">@dersolabegitim</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Right: Studio Controls, Timer & Leave */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live Lesson Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-white/10 font-mono text-xs font-bold text-emerald-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{formattedElapsed}</span>
            </div>

            {/* Google Meet Backup Link */}
            {meetLink && (
              <a
                href={meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-bold text-xs transition-all"
                title="Alternatif olarak Google Meet bağlantısını aç"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Google Meet</span>
              </a>
            )}

            {/* Studio / Full Camera Toggle */}
            <button
              type="button"
              onClick={() => toggleStudioMode(!studioMode)}
              className={`px-3.5 py-1.5 rounded-full font-extrabold text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
                studioMode
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.35)]'
                  : 'bg-sky-500/20 border border-sky-400/50 text-sky-200'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {studioMode ? 'Stüdyo Aktif' : 'Stüdyoyu Aç'}
              </span>
            </button>

            {/* L.A.B. Modal Trigger */}
            <button
              type="button"
              onClick={() => setLabModalOpen(true)}
              className="px-3 py-1.5 rounded-full bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/35 text-cyan-300 font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95"
              title="Derste öğrencinle ortak 3D simülasyon aç"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span className="hidden md:inline">3D L.A.B.</span>
            </button>

            {/* Leave Lesson */}
            <button
              type="button"
              onClick={handleLeave}
              className="px-3.5 py-1.5 rounded-full bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 font-black text-xs flex items-center gap-1.5 transition-all active:scale-95"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ayrıl</span>
            </button>
          </div>
        </div>
      </footer>

      {/* L.A.B. Hızlı Seçim Modalı */}
      {labModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#121826] border border-white/15 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-white">L.A.B. Canlı Stüdyo Simülasyonları</h3>
              </div>
              <button
                onClick={() => setLabModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mt-3 mb-4">
              Bir laboratuvar seçtiğinde stüdyonun ana sahnesine yansır ve öğrencinin ekranında da aynı simülasyon otomatik açılır:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {LAB_MODULES.map((lab) => (
                <div
                  key={lab.href}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-2"
                >
                  <button
                    type="button"
                    onClick={() => selectSplitLab(lab.href)}
                    className="flex-1 text-left text-xs font-bold text-slate-200 hover:text-cyan-300 flex items-center gap-2 transition-colors"
                  >
                    <Columns2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{lab.title}</span>
                  </button>
                  <a
                    href={lab.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Yeni sekmede aç"
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-3 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setLabModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/15"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
