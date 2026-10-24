'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Video,
  LogOut,
  Clock,
  FlaskConical,
  X,
  ExternalLink,
  Columns2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface LiveClassroomClientProps {
  bookingId: string
  currentUserName: string
  isInstructor: boolean
  otherPersonName: string
  startTime: string
  endTime: string
  topicNote?: string | null
  meetLink?: string | null
}

const LAB_MODULES = [
  { title: 'Matematik (Parabol & Türev)', href: '/lab/matematik' },
  { title: 'Fizik (Optik & Dinamik)', href: '/lab/fizik' },
  { title: 'Kimya (Atom 3D & Titrasyon)', href: '/lab/kimya' },
  { title: 'Biyoloji (Hücre & Genetik)', href: '/lab/biyoloji' },
  { title: 'Türkçe (Biyonik Okuma)', href: '/lab/turkce' },
  { title: 'Sosyal & Tarih Atlası', href: '/lab/sosyal' },
  { title: 'İngilizce (Telaffuz & Sahne)', href: '/lab/ingilizce' },
]

declare global {
  interface Window {
    JitsiMeetExternalAPI?: any
  }
}

export function LiveClassroomClient({
  bookingId,
  currentUserName,
  isInstructor,
  otherPersonName,
  startTime,
  endTime,
  topicNote,
  meetLink,
}: LiveClassroomClientProps) {
  const router = useRouter()
  const jitsiContainerRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<any>(null)
  const channelRef = useRef<any>(null)
  const [loading, setLoading] = useState(true)
  const [labModalOpen, setLabModalOpen] = useState(false)
  const [activeSplitLabUrl, setActiveSplitLabUrl] = useState<string | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  // Safe unique room name
  const roomName = `dersolab-live-${bookingId.replace(/[^a-zA-Z0-9]/g, '')}`

  // Lesson Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Supabase Realtime: Eğitmen ve öğrenci arasında L.A.B. simülasyonu senkronizasyonu
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
          }
        })
        .subscribe()

      channelRef.current = channel

      return () => {
        supabase.removeChannel(channel)
        channelRef.current = null
      }
    } catch {
      // Realtime opsiyoneldir; hata durumunda sessizce devam et
    }
  }, [bookingId])

  const selectSplitLab = (url: string | null) => {
    setActiveSplitLabUrl(url)
    setLabModalOpen(false)
    if (channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event: 'lab-sync',
        payload: { url },
      })
    }
  }

  const elapsedMinutes = Math.floor(elapsedSeconds / 60)
  const elapsedRemainderSeconds = elapsedSeconds % 60
  const formattedElapsed = `${String(elapsedMinutes).padStart(2, '0')}:${String(elapsedRemainderSeconds).padStart(2, '0')}`

  // Load Jitsi Meet External API
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
              'chat',
              'closedcaptions',
              'desktop',
              'fullscreen',
              'fodeviceselection',
              'hangup',
              'microphone',
              'raisehand',
              'settings',
              'tileview',
              'videoquality',
              'whiteboard',
            ],
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            DEFAULT_BACKGROUND: '#0B0F19',
            TOOLBAR_ALWAYS_VISIBLE: true,
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
      script.onload = () => {
        initJitsi()
      }
      script.onerror = () => {
        setLoading(false)
      }
      document.body.appendChild(script)
    }

    return () => {
      if (apiRef.current) {
        apiRef.current.dispose()
        apiRef.current = null
      }
    }
  }, [roomName, currentUserName, isInstructor])

  const handleLeave = () => {
    if (apiRef.current) {
      apiRef.current.dispose()
      apiRef.current = null
    }
    router.push(isInstructor ? '/dashboard/instructor' : '/dashboard/student/bookings')
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#080B11] text-slate-100 flex flex-col overflow-hidden select-none">
      {/* Top Bar Header */}
      <header className="h-14 sm:h-16 px-4 bg-[#0E131F] border-b border-white/10 flex items-center justify-between gap-3 shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-black text-sm sm:text-base tracking-tight bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
              DersoLab Canlı Ders Odası
            </span>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-300 truncate">
            <span>{isInstructor ? 'Öğrenci:' : 'Eğitmen:'}</span>
            <span className="text-white font-bold">{otherPersonName || 'Bağlanıyor...'}</span>
            {topicNote && (
              <span className="ml-2 px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-400 truncate max-w-[200px]">
                {topicNote}
              </span>
            )}
          </div>
        </div>

        {/* Sayaç ve Araçlar */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Seans Süresi */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 font-mono text-xs font-bold text-emerald-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{formattedElapsed}</span>
          </div>

          {/* Google Meet Yedek Bağlantısı (varsa) */}
          {meetLink && (
            <a
              href={meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-bold text-xs transition-all"
              title="Alternatif olarak Google Meet bağlantısını aç"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Google Meet</span>
            </a>
          )}

          {/* L.A.B. Hızlı Simülasyon Butonu */}
          <button
            onClick={() => setLabModalOpen(true)}
            className={`px-3 py-1.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
              activeSplitLabUrl
                ? 'bg-cyan-500/25 border-cyan-400/50 text-cyan-200'
                : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-cyan-300'
            }`}
            title="Derste öğrencinle ortak 3D simülasyon veya deney aç"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">
              {activeSplitLabUrl ? 'L.A.B. Değiştir' : 'L.A.B. Deneyleri'}
            </span>
          </button>

          {activeSplitLabUrl && (
            <button
              onClick={() => selectSplitLab(null)}
              className="px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-bold text-xs flex items-center gap-1"
              title="Bölünmüş L.A.B. ekranını kapat"
            >
              <X className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">L.A.B. Kapat</span>
            </button>
          )}

          {/* Ayrıl Butonu */}
          <button
            onClick={handleLeave}
            className="px-3.5 py-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 font-black text-xs flex items-center gap-1.5 transition-all active:scale-95"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Ayrıl</span>
          </button>
        </div>
      </header>

      {/* Main Content Area (Video + Optional Split-Screen L.A.B.) */}
      <div className="flex-1 flex flex-col lg:flex-row relative w-full h-full bg-[#0B0F19] overflow-hidden">
        {/* Video Area */}
        <div className={`relative h-full transition-all duration-300 ${activeSplitLabUrl ? 'w-full lg:w-1/2 h-1/2 lg:h-full border-b lg:border-b-0 lg:border-r border-white/10' : 'w-full'}`}>
          {loading && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0B0F19] text-center p-4">
              <div className="w-16 h-16 rounded-3xl bg-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4 animate-pulse shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                <Video className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-white">Güvenli Canlı Ders Odası Hazırlanıyor</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                Mikrofon ve kamera izinleri taranıyor, şifreli uçtan uca WebRTC kanalı kuruluyor...
              </p>
            </div>
          )}

          <div ref={jitsiContainerRef} className="w-full h-full" />
        </div>

        {/* Split-Screen L.A.B. Area */}
        {activeSplitLabUrl && (
          <div className="w-full lg:w-1/2 h-1/2 lg:h-full flex flex-col bg-[#080B11]">
            <div className="h-9 px-3 bg-[#101624] border-b border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-cyan-300 font-bold">
                <Columns2 className="w-3.5 h-3.5" />
                <span>Canlı Ortak L.A.B. Simülasyonu</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={activeSplitLabUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <span>Yeni Sekme</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  onClick={() => selectSplitLab(null)}
                  className="text-slate-400 hover:text-red-400 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <iframe
              src={activeSplitLabUrl}
              title="DersoLab İnteraktif Simülasyon"
              className="flex-1 w-full h-full border-0"
            />
          </div>
        )}
      </div>

      {/* L.A.B. Hızlı Seçim Modalı */}
      {labModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#121826] border border-white/15 rounded-3xl max-w-2xl w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-black text-white">L.A.B. Canlı Gösterim Menüsü</h3>
              </div>
              <button
                onClick={() => setLabModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mt-3 mb-4">
              Bir laboratuvar seçtiğinde canlı ders ekranı ikiye bölünür ve karşı tarafın ekranında da aynı simülasyon otomatik açılır:
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
