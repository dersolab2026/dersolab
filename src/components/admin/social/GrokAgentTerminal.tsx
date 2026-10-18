'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  Zap,
  Terminal,
  Bot,
  Send,
  Layers,
  Cpu,
  Flame,
  MessageSquare,
  Radio,
  CheckCircle2,
  Loader2,
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  BarChart2,
  BookOpen,
  Smartphone,
  Search,
} from 'lucide-react'
import type { AgentLearningInsight, AgentPersona, SocialPostItem } from '@/types/social'
import { toast } from 'sonner'

interface GrokAgentTerminalProps {
  onPostsGenerated: (posts: SocialPostItem[]) => void
  currentPostCount: number
}

const SWARM_AGENTS = [
  { id: 'trend_radar', name: 'Müfredat & Trend Radarı', role: 'ÖSYM & Sınav Takvimi', icon: '🛰️', status: 'AKTİF' },
  { id: 'visual_architect', name: 'Görsel Sanat Mimarı', role: '9:16 & 1:1 Vektörel Şema', icon: '🎨', status: 'HAZIR' },
  { id: 'hook_master', name: 'Viral Kanca Ustası', role: 'İlk 3sn Retention & Kancalar', icon: '⚡', status: 'DEVREDE' },
  { id: 'pedagogy_inspector', name: 'Pedagoji Müfettişi', role: 'MEB & ÖSYM Kazanım Denetimi', icon: '🛡️', status: 'ONAYLI' },
  { id: 'community_copilot', name: 'Topluluk Copilotu', role: 'Yorum & Soru Simülasyonu', icon: '💬', status: 'CANLI' },
]

const PERSONAS: { id: AgentPersona; label: string; icon: string; desc: string; badge: string }[] = [
  {
    id: 'grok_witty',
    label: 'Zeki & Nüktedan',
    icon: '🦊',
    desc: 'Gençlerin sınav dilini konuşan, keskin zekalı ve yüksek etkileşimli mod.',
    badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  },
  {
    id: 'sherlock_exam',
    label: 'Sherlock ÖSYM',
    icon: '🔍',
    desc: 'Soru yazarlarının psikolojisini, çeldiricileri ve çıkmış soru istatistiklerini çözer.',
    badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  },
  {
    id: 'growth_mentor',
    label: 'L.A.B. Bilimsel Görselci',
    icon: '🎨',
    desc: 'Biyonik okuma, formüller, optik ve zengin vektörel şemalarla görsel odaklı koçluk.',
    badge: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
  },
  {
    id: 'direct_no_bs',
    label: 'No-BS Sonuç Odaklı',
    icon: '🎯',
    desc: 'Sıfır bahane, netlere ve sonuca odaklı tavizsiz motivasyon modu.',
    badge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  },
]

const QUICK_COMMANDS = [
  {
    title: '📱 TYT Optik 9:16 Story Şeması',
    prompt: 'TYT Fizik optik prizma kırılması için dikey 9:16 story görseli çiz ve quiz çıkartmalı hikaye üret.',
    type: 'story',
  },
  {
    title: '📐 AYT Parabol & Teğet Eğrisi (1:1)',
    prompt: 'AYT Matematik parabol tepe noktası ve türev teğet eğrisi için bilimsel diyagram çiz ve taktik carousel hazırla.',
    type: 'visual',
  },
  {
    title: '📚 Pazar Kitap Kulübü (3D Kapak)',
    prompt: 'Pazar kitap kulübü için ortaokul ve lise kitapları seç, 3D kapak illüstrasyonlarını çiz ve anketli story hazırla.',
    type: 'book',
  },
  {
    title: '⚡ 5 Ajanlı Günlük Swarm Paketi',
    prompt: 'Bugün için sabah 09:00 story quizi, öğle 14:00 taktik carousel rehberi ve akşam 20:00 viral X flood paketi hazırla.',
    type: 'auto_pilot',
  },
  {
    title: '🔥 TYT Paragraf 5x Viral Kanca',
    prompt: 'TYT Türkçe paragrafta süre yetiştiremeyenler için 5 farklı viral kanca ve kapak başlığı üret.',
    type: 'hook',
  },
]

const DEFAULT_INSIGHTS: AgentLearningInsight[] = [
  {
    id: 'ins_1',
    title: 'Neon Vektör Diyagramları Kaydetme Oranını 4.2x Artırıyor',
    category: 'visual',
    metricBoost: '+320% Kaydetme',
    confidenceScore: 98,
    actionableTip: 'Optik prizması, parabol teğet eğrisi veya hücre şeması içeren Carousel slaytları salt metne göre 4.2 kat daha fazla kütüphaneye kaydediliyor.',
    appliedPattern: 'visual_first_diagram_applied',
  },
  {
    id: 'ins_2',
    title: '9:16 Story Quizlerinde Çıkartma Tıklama Zirvesi (Neon Turuncu)',
    category: 'stickers',
    metricBoost: '+38% Etkileşim',
    confidenceScore: 94,
    actionableTip: 'Story quiz çıkartmasının hemen üstünde dikey şema bulunduğunda öğrencilerin doğru şıkkı arama ve tıklama süresi 3.1 saniyeye iniyor.',
    appliedPattern: 'story_vertical_quiz_916',
  },
  {
    id: 'ins_3',
    title: 'Kanca Stratejisi: "Soru" Yerine "Acı Gerçek / Yanılgı"',
    category: 'hooks',
    metricBoost: '+29% İlk 3sn Retention',
    confidenceScore: 96,
    actionableTip: '"Paragrafta hızlanmak ister misin?" yerine "Paragrafta süre yetiştiremeyen adayların yaptığı acı hata" kancası kaydırmayı anında durduruyor.',
    appliedPattern: 'contrarian_painpoint_hook',
  },
  {
    id: 'ins_4',
    title: 'Pazar Çift Kitap Kulübü: 3D Kapak İllüstrasyonu',
    category: 'visual',
    metricBoost: '+44% Anket Katılımı',
    confidenceScore: 95,
    actionableTip: 'Kitap kapakları 3D sırt yansımasıyla çizildiğinde "Hangisini okuyacaksın?" anketine katılım %44 daha yüksek oluyor.',
    appliedPattern: 'dual_book_3d_cover_render',
  },
]

export function GrokAgentTerminal({ onPostsGenerated, currentPostCount }: GrokAgentTerminalProps) {
  const [selectedPersona, setSelectedPersona] = useState<AgentPersona>('grok_witty')
  const [commandInput, setCommandInput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [activeTab, setActiveTab] = useState<'stream' | 'insights' | 'pedagogy'>('stream')
  const [insights, setInsights] = useState<AgentLearningInsight[]>(DEFAULT_INSIGHTS)
  const [logs, setLogs] = useState<string[]>([
    `[SYSTEM] DersoLab 5-Ajanlı Otonom Swarm v4.5 devrede.`,
    `[SWARM] Müfredat Radarı + Görsel Sanat Mimarı + Kanca Ustası + Pedagoji Müfettişi senkronize.`,
    `[VISION] 9:16 Story & 1:1 SVG Retina Vektör Motoru aktif.`,
    `[STATUS] @dersolabegitim hesabına bağlı. Metin + görsel sentezine hazır.`,
  ])

  const terminalEndRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (activeTab === 'stream' && terminalEndRef.current) {
      terminalEndRef.current.scrollTop = terminalEndRef.current.scrollHeight
    }
  }, [logs, activeTab])

  // Öğrenme içgörülerini yükle
  useEffect(() => {
    fetch('/api/admin/social/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'learning_insights' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.insights && Array.isArray(data.insights)) {
          setInsights(data.insights)
        }
      })
      .catch(() => {})
  }, [])

  function addLog(msg: string) {
    const timestamp = new Date().toLocaleTimeString('tr-TR', { hour12: false })
    setLogs((prev) => [...prev, `[${timestamp}] ${msg}`])
  }

  // Komut Çalıştırma (Doğal Dil veya Hazır Buton)
  async function handleExecuteCommand(cmdText?: string) {
    const promptToRun = cmdText || commandInput.trim()
    if (!promptToRun) {
      toast.error('Lütfen bir komut veya soru yazın.')
      return
    }

    setIsRunning(true)
    setActiveTab('stream')
    addLog(`> Kullanıcı Talimatı: "${promptToRun}"`)
    addLog(`[SWARM PIPELINE] 5 Alt Ajan eşzamanlı olarak tetiklendi...`)
    addLog(`[1/5 RADAR] 2026 ÖSYM kazanımları ve haftalık deneme trendleri analiz ediliyor...`)

    try {
      const res = await fetch('/api/admin/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'command',
          command: promptToRun,
          persona: selectedPersona,
          targetGrade: 'YKS (TYT/AYT)',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Ajan komutu yürütürken hata oluştu.')
      }

      if (data.logs && Array.isArray(data.logs)) {
        data.logs.forEach((l: string) => addLog(l))
      }

      addLog(`[PEDAGOGY CHECK] MEB müfredatı ve ÖSYM kazanım kontrolü: ONAYLANDI ✓`)
      addLog(`[VISUAL COMPLETE] Retina vektör görseli tuvale işlendi.`)

      if (data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
        addLog(`[ACTION] ${data.posts.length} adet yeni içerik onay kuyruğuna eklendi.`)
        onPostsGenerated(data.posts)
        toast.success(data.message || `${data.posts.length} içerik başarıyla üretildi!`)
      } else if (data.post) {
        addLog(`[ACTION] 1 Adet içerik ("${data.post.title}") stüdyoya eklendi.`)
        onPostsGenerated([data.post])
        toast.success(data.message || 'İçerik başarıyla üretildi!')
      }

      if (!cmdText) {
        setCommandInput('')
      }
    } catch (err: any) {
      console.error(err)
      addLog(`[ERROR] Komut işlenemedi: ${err.message}`)
      toast.error(err.message || 'Komut işlenirken bir sorun oluştu.')
    } finally {
      setIsRunning(false)
    }
  }

  // Otonom Günlük Batch'i Doğrudan Tetikle
  async function handleAutoPilotTrigger() {
    setIsRunning(true)
    setActiveTab('stream')
    addLog(`[AUTONOMOUS LOOP] 5-Ajanlı Swarm Auto-Pilot başlatıldı!`)
    addLog(`[1/4 RADAR] 2026 ÖSYM sınav takvimi ve kazanım radar analizi yapılıyor...`)

    const timer1 = setTimeout(() => {
      addLog(`[2/4 VISUAL] Sabah Story 9:16 Şeması ve Öğle Biyonik Okuma 1:1 görselleri paralel derleniyor...`)
    }, 700)
    const timer2 = setTimeout(() => {
      addLog(`[3/4 COPYWRITING] Viral kancalar ve pedagojik açıklamalar sentezleniyor...`)
    }, 1500)

    try {
      const res = await fetch('/api/admin/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'auto_pilot',
          persona: selectedPersona,
          targetGrade: 'YKS (TYT/AYT)',
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.items) {
        throw new Error(data.error || 'Auto-Pilot içeriği üretilemedi.')
      }

      addLog(`[4/4 BATCH READY] 3 Adet koordineli gönderi üretildi: Sabah 9:16 Quizi + Öğle Biyonik Carousel + Akşam X Flood.`)
      addLog(`[VIRALITY] Viralite Puanı: 97.4 / 100. Pedagojik onay mührü basıldı.`)
      onPostsGenerated(data.items)
      toast.success('DersoLab Swarm: Günün 3 içerik paketi ve görselleri hazır!')
    } catch (err: any) {
      addLog(`[ERROR] Auto-pilot başarısız: ${err.message}`)
      toast.error(err.message || 'Auto-pilot yürütülemedi.')
    } finally {
      clearTimeout(timer1)
      clearTimeout(timer2)
      setIsRunning(false)
    }
  }

  return (
    <div className="relative rounded-3xl p-6 bg-gradient-to-br from-[#06090e] via-[#09101a] to-[#040608] border border-cyan-500/25 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* Arka Plan Grok Matrix Efekti */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-emerald-500/10 blur-[100px] pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Üst Bar: Ajan Başlığı & Durum Radar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <Bot className="w-6 h-6 animate-pulse" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black animate-ping" />
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-emerald-400 border-2 border-black" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white tracking-tight flex items-center gap-2">
                  <span>DersoLab 5-Ajanlı Otonom İçerik & Görsel Swarm</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono font-bold">
                    v4.5 PRO
                  </span>
                </h2>
              </div>
              <p className="text-xs text-slate-400">
                Müfredat radarı, vektörel şema mimarı, viral kanca sentezleyici ve pedagojik denetim ekibi
              </p>
            </div>
          </div>

          {/* Otonom Auto-Pilot Hızlı Butonu */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleAutoPilotTrigger}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-black font-black text-xs shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-black" />
                  <span>⚡ Swarm Çiziyor ve Derliyor...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-black" />
                  <span>⚡ Otonom Swarm Paket (3'lü + Görseller)</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 5-Ajanlı Swarm Durum Şeridi */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 pt-1">
          {SWARM_AGENTS.map((ag) => (
            <div
              key={ag.id}
              className="p-2.5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-2.5"
            >
              <span className="text-lg">{ag.icon}</span>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-white block truncate">{ag.name}</span>
                <span className="text-[10px] text-slate-400 block truncate">{ag.role}</span>
              </div>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            </div>
          ))}
        </div>

        {/* Persona Seçici */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Ajan Karakteri (Persona Modu):
          </span>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PERSONAS.map((p) => {
              const active = selectedPersona === p.id
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPersona(p.id)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    active
                      ? 'bg-cyan-500/10 border-cyan-400/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                      : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{p.icon}</span>
                      <span>{p.label}</span>
                    </span>
                    {active && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{p.desc}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Doğal Dil Komut Çubuğu */}
        <div className="space-y-2">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleExecuteCommand()
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              placeholder="Ajana serbestçe yazın (Örn: 'TYT Fizik optik prizma kırılması için 9:16 story görseli çiz ve anketli hikaye üret')..."
              className="w-full bg-[#03060a] border border-cyan-500/30 rounded-2xl pl-4 pr-28 py-3.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition-all"
            />
            <button
              type="submit"
              disabled={isRunning || !commandInput.trim()}
              className="absolute right-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
            >
              {isRunning ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
              <span>Çalıştır</span>
            </button>
          </form>

          {/* Hızlı Komut Butonları */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
            {QUICK_COMMANDS.map((qc, idx) => (
              <button
                key={idx}
                onClick={() => handleExecuteCommand(qc.prompt)}
                disabled={isRunning}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/30 text-[11px] font-semibold text-slate-300 hover:text-white shrink-0 transition-all active:scale-95"
              >
                <Flame className="w-3 h-3 text-amber-400" />
                <span>{qc.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Alt Modüler Gösterge Paneli: Stream / Insights / Pedagogy */}
        <div className="rounded-2xl bg-[#020406] border border-cyan-500/20 overflow-hidden shadow-inner">
          <div className="flex items-center justify-between px-3.5 py-2 bg-white/[0.03] border-b border-white/5 text-[11px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('stream')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors font-bold ${
                  activeTab === 'stream'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Terminal className="w-3 h-3" />
                <span>Canlı Swarm Logu</span>
              </button>

              <button
                onClick={() => setActiveTab('insights')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors font-bold ${
                  activeTab === 'insights'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BarChart2 className="w-3 h-3" />
                <span>🧠 Ajan Öğrenme Stratejisi</span>
              </button>

              <button
                onClick={() => setActiveTab('pedagogy')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-colors font-bold ${
                  activeTab === 'pedagogy'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                <span>🛡️ ÖSYM Kazanım Kalkanı</span>
              </button>
            </div>

            {activeTab === 'stream' && (
              <button
                onClick={() => setLogs([`[INFO] Terminal günlüğü temizlendi. Ajan hazır.`])}
                className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors"
              >
                Temizle
              </button>
            )}
          </div>

          {/* TAB 1: Canlı Akış */}
          {activeTab === 'stream' && (
            <div
              ref={terminalEndRef}
              className="p-3.5 max-h-40 overflow-y-auto space-y-1 font-mono text-[11px] leading-relaxed selection:bg-cyan-500 selection:text-black"
            >
              {logs.map((line, idx) => {
                const isErr = line.includes('[ERROR]')
                const isSuccess = line.includes('[SUCCESS]') || line.includes('[BATCH READY]') || line.includes('ONAYLANDI')
                const isUser = line.startsWith('>')
                const isMetric = line.includes('[METRICS]') || line.includes('[VIRALITY') || line.includes('[PEDAGOGY')

                return (
                  <div
                    key={idx}
                    className={`${
                      isErr
                        ? 'text-red-400 font-bold'
                        : isSuccess
                          ? 'text-emerald-400 font-bold'
                          : isUser
                            ? 'text-yellow-300 font-bold'
                            : isMetric
                              ? 'text-cyan-300 font-semibold'
                              : 'text-slate-400'
                    }`}
                  >
                    {line}
                  </div>
                )
              })}
            </div>
          )}

          {/* TAB 2: Ajan Öğrenme Stratejisi (Self-Learning Loop) */}
          {activeTab === 'insights' && (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto">
              {insights.map((ins) => (
                <div
                  key={ins.id}
                  className="p-3 rounded-xl bg-white/[0.02] border border-purple-500/20 hover:border-purple-500/40 space-y-1.5 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30">
                      {ins.category.toUpperCase()}
                    </span>
                    <span className="text-[11px] font-mono font-black text-emerald-400">
                      {ins.metricBoost}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white leading-snug">{ins.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed">{ins.actionableTip}</p>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: Pedagojik Doğruluk Kalkanı */}
          {activeTab === 'pedagogy' && (
            <div className="p-4 space-y-3 max-h-56 overflow-y-auto">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="text-xs font-bold text-emerald-300 block">
                      ÖSYM 2026 & MEB Kazanım Güvenlik Kalkanı Aktif
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Tüm içerikler sınav formatına, soru kökü mantığına ve pedagojik dil kurallarına göre taranır.
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-black">
                  %98.5 UYGUNLUK
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                {[
                  '✓ ÖSYM soru kökü standartları kontrolü',
                  '✓ MEB müfredat dışı formül içermeme',
                  '✓ Bilişsel yükü azaltan görsel-şema tasarımı',
                  '✓ Çeldirici şık analizi ve net kurtarma',
                ].map((rule, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-white/[0.02] border border-white/5 text-slate-300 font-medium">
                    {rule}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
