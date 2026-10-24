'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  Sparkles,
  Calendar,
  X,
  Film,
  Layers,
  HelpCircle,
  Smartphone,
  Upload,
  Image as ImageIcon,
  Trash2,
  Loader2,
  BookOpen,
  Zap,
  Bot,
} from 'lucide-react'
import type {
  AgentPersona,
  ContentTopic,
  GeneratePostRequest,
  InstagramContentType,
  SocialPostItem,
  StoryStickerType,
  WeeklyCalendarRequest,
} from '@/types/social'
import { toast } from 'sonner'

function XPlatformIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

interface GeneratePostModalProps {
  isOpen: boolean
  onClose: () => void
  onPostsGenerated: (posts: SocialPostItem[]) => void
  initialContentType?: InstagramContentType
  initialTopic?: ContentTopic
  initialSubject?: string
}

export function GeneratePostModal({
  isOpen,
  onClose,
  onPostsGenerated,
  initialContentType,
  initialTopic,
  initialSubject,
}: GeneratePostModalProps) {
  const [mode, setMode] = useState<'single' | 'auto_pilot' | 'weekly'>('single')
  const [contentType, setContentType] = useState<InstagramContentType>('carousel')
  const [persona, setPersona] = useState<AgentPersona>('derso_friendly')
  const [topic, setTopic] = useState<ContentTopic>('exam_tactics')
  const [subject, setSubject] = useState('')
  const [subTopic, setSubTopic] = useState('')
  const [targetGrade, setTargetGrade] = useState<'YKS (TYT/AYT)' | 'LGS' | 'Genel'>('YKS (TYT/AYT)')
  const [tone, setTone] = useState<'energetic' | 'informative' | 'coaching' | 'humorous'>('energetic')
  const [storyStickerType, setStoryStickerType] = useState<StoryStickerType>('quiz')
  const [customPrompt, setCustomPrompt] = useState('')
  const [focusSubject, setFocusSubject] = useState('')
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (isOpen) {
      if (initialContentType) setContentType(initialContentType)
      if (initialTopic) setTopic(initialTopic)
      if (initialSubject) setSubject(initialSubject)
    }
  }, [isOpen, initialContentType, initialTopic, initialSubject])

  if (!isOpen) return null

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Lütfen geçerli bir resim dosyası seçin.')
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      if (result) {
        setImageBase64(result)
        toast.success('Görsel yüklendi! Yapay zeka bu görseli analiz ederek içeriği oluşturacak.')
      }
    }
    reader.readAsDataURL(file)
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (mode === 'auto_pilot') {
        const res = await fetch('/api/admin/social/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'auto_pilot',
            targetGrade,
            subject: subject.trim() || undefined,
            persona,
          }),
        })

        const data = await res.json()
        if (!res.ok || !data.items || data.items.length === 0) {
          throw new Error(data.error || 'İçerik paketi üretilemedi.')
        }

        toast.success('⚡ Günün 3 içerik paketi başarıyla üretildi!')
        onPostsGenerated(data.items)
        onClose()
      } else if (mode === 'single') {
        const payload: GeneratePostRequest & { action: 'generate_single' } = {
          action: 'generate_single',
          type: contentType,
          topic,
          subject: subject.trim() || undefined,
          subTopic: subTopic.trim() || undefined,
          targetGrade,
          tone,
          persona,
          customPrompt: customPrompt.trim() || undefined,
          imageBase64: imageBase64 || undefined,
          storyStickerType: contentType === 'story' ? storyStickerType : undefined,
        }

        const res = await fetch('/api/admin/social/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = await res.json()
        if (!res.ok || !data.item) {
          throw new Error(data.error || 'İçerik üretilemedi.')
        }

        toast.success('İçerik başarıyla oluşturuldu!')
        onPostsGenerated([data.item])
        onClose()
      } else {
        // 7 Günlük Takvim
        const payload: WeeklyCalendarRequest & { action: 'generate_weekly'; persona?: AgentPersona } = {
          action: 'generate_weekly',
          targetGrade,
          focusSubject: focusSubject.trim() || undefined,
          customInstructions: customPrompt.trim() || undefined,
          persona,
        }

        const res = await fetch('/api/admin/social/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        const data = await res.json()
        if (!res.ok || !data.items || data.items.length === 0) {
          throw new Error(data.error || 'Takvim üretilemedi.')
        }

        toast.success(`Haftalık içerik paketi hazır! ${data.items.length} adet gönderi planlandı.`)
        onPostsGenerated(data.items)
        onClose()
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'İçerik üretilirken bir hata oluştu.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full h-full sm:h-auto max-w-2xl sm:rounded-3xl rounded-none bg-[#0f1117] border-0 sm:border border-white/10 shadow-[0_25px_70px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-none sm:max-h-[90vh]">
        {/* Üst Başlık Barı */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-5 border-b border-white/10 bg-white/[0.02] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shrink-0">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 truncate">
                <span>DersoLab İçerik Üretici</span>
                <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-semibold bg-orange-500/20 text-orange-300 border border-orange-500/30 shrink-0">
                  AI Destekli
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">Instagram ve TikTok içeriklerinizi saniyeler içinde hazırlayın</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Modu (Tekil vs Günün 3'lü Paketi vs 7 Günlük) */}
        <div className="px-3 sm:px-6 pt-3 sm:pt-5 shrink-0">
          <div className="grid grid-cols-3 p-1 rounded-2xl bg-white/[0.03] border border-white/10 gap-1">
            <button
              type="button"
              onClick={() => setMode('single')}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${
                mode === 'single'
                  ? 'bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Tekil</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('auto_pilot')}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${
                mode === 'auto_pilot'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300" />
              <span className="truncate">⚡ 3'lü Paket</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('weekly')}
              className={`flex items-center justify-center gap-1 sm:gap-1.5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${
                mode === 'weekly'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="truncate">7 Günlük</span>
            </button>
          </div>
        </div>

        {/* Form Alanı */}
        <form onSubmit={handleGenerate} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* İÇERİK TONU SEÇİCİ */}
          <div className="space-y-2 p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                <span>İçerik Dili & Tarzı</span>
              </span>
              <span className="text-[10px] text-slate-400">DersoLab Koçluk Tonu</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'derso_friendly', label: '🦊 Samimi & Enerjik', desc: 'Gençlerin dilinden konuşan koç' },
                { id: 'exam_coach', label: '🎯 Sınav & Taktik', desc: 'ÖSYM çeldirici avcısı' },
                { id: 'scientific_guide', label: '🔬 Bilimsel & Görsel', desc: 'Şemalar ve formüller' },
                { id: 'direct_punchy', label: '⚡ Kısa & Net', desc: 'Sıfır laf kalabalığı' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPersona(p.id as AgentPersona)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    persona === p.id || (persona === 'grok_witty' && p.id === 'derso_friendly')
                      ? 'bg-orange-500/20 border-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.25)]'
                      : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200 hover:bg-white/10'
                  }`}
                >
                  <span className="text-xs font-bold block">{p.label}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">{p.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {mode === 'auto_pilot' ? (
            /* DERSOLAB GÜNÜN 3'LÜ PAKETİ */
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300 leading-relaxed">
                🦊 <strong>DersoLab Günün 3'lü Paketi:</strong> Tek tıklamayla günün 3 ana zaman dilimi için koordineli bir sosyal medya akışı hazırlar:
                <ul className="list-disc list-inside mt-2 space-y-1 text-slate-300">
                  <li><strong>08:30 Sabah Story:</strong> Güne uyanma sorusu ve anket/quiz çıkartması.</li>
                  <li><strong>13:00 Öğlen Carousel:</strong> 4-5 slaytlık derinlemesine konu taktikleri ve infografik.</li>
                  <li><strong>20:30 Akşam Reels & TikTok:</strong> 30 saniyelik viral kancalı dikey video senaryosu.</li>
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Hedef Sınav</label>
                  <select
                    value={targetGrade}
                    onChange={(e) => setTargetGrade(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                  >
                    <option value="YKS (TYT/AYT)" className="bg-neutral-900">YKS (TYT / AYT)</option>
                    <option value="LGS" className="bg-neutral-900">LGS (8. Sınıf)</option>
                    <option value="Genel" className="bg-neutral-900">Genel Öğrenci & Veli</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Günün Odak Dersi</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                  >
                    <option value="" className="bg-neutral-900">✨ Otomatik (DersoLab Seçsin)</option>
                    <option value="Matematik & Geometri" className="bg-neutral-900">📐 Matematik & Geometri</option>
                    <option value="Türkçe & Paragraf" className="bg-neutral-900">📖 Türkçe & Paragraf</option>
                    <option value="Fizik" className="bg-neutral-900">⚡ Fizik</option>
                    <option value="Kimya" className="bg-neutral-900">🧪 Kimya</option>
                    <option value="Biyoloji" className="bg-neutral-900">🧬 Biyoloji</option>
                    <option value="Sınav Psikolojisi & Koçluk" className="bg-neutral-900">🧠 Sınav Koçluğu & Rehberlik</option>
                  </select>
                </div>
              </div>
            </div>
          ) : mode === 'single' ? (
            <>
              {/* Format Seçimi (Carousel, X Thread, Reels, Story, Post) */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">İçerik Formatı</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setContentType('carousel')}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border text-center transition-all ${
                      contentType === 'carousel'
                        ? 'border-orange-500 bg-orange-500/15 text-white shadow-[0_0_15px_rgba(249,115,22,0.15)]'
                        : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <Layers className="w-5 h-5 text-orange-400" />
                    <span className="text-xs font-bold">Carousel</span>
                    <span className="text-[10px] text-slate-400">Instagram 4-5 Slayt</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setContentType('story')}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border text-center transition-all ${
                      contentType === 'story'
                        ? 'border-purple-500 bg-purple-500/15 text-white shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                        : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <Smartphone className="w-5 h-5 text-purple-400" />
                    <span className="text-xs font-bold">Story (9:16)</span>
                    <span className="text-[10px] text-slate-400">Instagram Quiz/Anket</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setContentType('reels')}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border text-center transition-all ${
                      contentType === 'reels'
                        ? 'border-cyan-500 bg-cyan-500/15 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                        : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <Film className="w-5 h-5 text-cyan-400" />
                    <span className="text-xs font-bold">TikTok & Reels</span>
                    <span className="text-[10px] text-slate-400">9:16 Video Senaryosu</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setContentType('post')}
                    className={`flex flex-col items-center gap-1.5 p-2.5 rounded-2xl border text-center transition-all ${
                      contentType === 'post'
                        ? 'border-emerald-500 bg-emerald-500/15 text-white shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                        : 'border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20'
                    }`}
                  >
                    <HelpCircle className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold">Soru / Post</span>
                    <span className="text-[10px] text-slate-400">1:1 Şıklı Test</span>
                  </button>
                </div>
              </div>

              {/* Story Seçilmişse: Çıkartma Tipi Seçici */}
              {contentType === 'story' && (
                <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
                  <label className="text-xs font-bold text-purple-300">Story Çıkartma Türü (Sticker)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'quiz', label: '📊 4 Şıklı Quiz' },
                      { id: 'poll', label: '🗳️ 2 Şıklı Anket' },
                      { id: 'link', label: '🔗 Link Çıkartması' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setStoryStickerType(st.id as StoryStickerType)}
                        className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          storyStickerType === st.id
                            ? 'bg-purple-500 text-white border-purple-400 shadow-md'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:text-white'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* KENDİ GÖRSELİNİ YÜKLEME ALANI */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                  <span>Kendi Görselinizi / Soru Fotoğrafınızı Ekleyin</span>
                  <span className="text-slate-500 font-normal">İsteğe bağlı</span>
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />

                {imageBase64 ? (
                  <div className="relative rounded-2xl border border-orange-500/40 bg-orange-500/5 p-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={imageBase64}
                        alt="Yüklenen Görsel"
                        className="w-14 h-14 rounded-xl object-cover border border-white/20 shadow-md"
                      />
                      <div>
                        <span className="text-xs font-bold text-white block">Görsel Seçildi</span>
                        <span className="text-[11px] text-slate-400">Yapay zeka bu görseli analiz edip içeriğe entegre edecek</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImageBase64(null)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors"
                      title="Görseli Kaldır"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group border border-dashed border-white/20 hover:border-orange-500/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-white/[0.02] hover:bg-orange-500/[0.03] transition-all"
                  >
                    <div className="w-9 h-9 rounded-xl bg-white/5 group-hover:bg-orange-500/20 flex items-center justify-center text-slate-400 group-hover:text-orange-400 transition-colors">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="text-center">
                      <span className="text-xs font-bold text-white group-hover:text-orange-300">
                        Soru fotoğrafı, kitap sayfası veya afiş yükleyin
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        PNG, JPG veya WEBP (Görseli doğrudan analiz eder)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Ders & Odak Konu Seçimi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">İlgili Ders / Branş</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                  >
                    <option value="" className="bg-neutral-900">✨ Otomatik (Yapay Zeka Seçsin)</option>
                    <option value="Matematik & Geometri" className="bg-neutral-900">📐 Matematik & Geometri</option>
                    <option value="Türkçe, Edebiyat & Paragraf" className="bg-neutral-900">📖 Türkçe, Edebiyat & Paragraf</option>
                    <option value="Fizik" className="bg-neutral-900">⚡ Fizik</option>
                    <option value="Kimya" className="bg-neutral-900">🧪 Kimya</option>
                    <option value="Biyoloji" className="bg-neutral-900">🧬 Biyoloji</option>
                    <option value="Tarih & Coğrafya (Sosyal Bilimler)" className="bg-neutral-900">🌍 Tarih & Coğrafya (Sosyal)</option>
                    <option value="İngilizce (YDT / LGS)" className="bg-neutral-900">🇬🇧 İngilizce</option>
                    <option value="Sınav Koçluğu & Rehberlik" className="bg-neutral-900">🧠 Sınav Koçluğu & Rehberlik</option>
                    <option value="DersoLab L.A.B. Araçları" className="bg-neutral-900">🦊 DersoLab L.A.B. Araçları</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Odak Konu / Ünite <span className="text-slate-500 font-normal">(İsteğe bağlı)</span>
                  </label>
                  <input
                    type="text"
                    value={subTopic}
                    onChange={(e) => setSubTopic(e.target.value)}
                    placeholder="Örn: Türev, Logaritma, Paragraf Hızı, Optik..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Konu Kategorisi */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Konu Kategorisi</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'exam_tactics', label: '🎯 Sınav Taktikleri' },
                    { id: 'book_recommendation', label: '📚 Kitap & Okuma' },
                    { id: 'daily_question', label: '❓ Şaşırtmalı Soru' },
                    { id: 'dersolab_features', label: '⚡ L.A.B. Araçları' },
                    { id: 'motivation', label: '🔥 Disiplin & Motivasyon' },
                    { id: 'weekly_plan', label: '📅 Koçluk & Planlama' },
                    { id: 'custom', label: '✍️ Özel Konu' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setTopic(t.id as ContentTopic)
                        if (t.id === 'book_recommendation') {
                          setContentType('story')
                          setStoryStickerType('poll')
                        }
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                        topic === t.id
                          ? 'border-orange-500/50 bg-orange-500/20 text-orange-300'
                          : 'border-white/10 bg-white/[0.02] text-slate-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Hedef Kitle & Ton */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Hedef Sınav</label>
                  <select
                    value={targetGrade}
                    onChange={(e) => setTargetGrade(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                  >
                    <option value="YKS (TYT/AYT)" className="bg-neutral-900">YKS (TYT / AYT)</option>
                    <option value="LGS" className="bg-neutral-900">LGS (8. Sınıf)</option>
                    <option value="Genel" className="bg-neutral-900">Genel Öğrenci & Veli</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Anlatım Dili / Ton</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                  >
                    <option value="energetic" className="bg-neutral-900">Enerjik & Heyecanlı (Viral)</option>
                    <option value="informative" className="bg-neutral-900">Bilgilendirici & Net Rehber</option>
                    <option value="coaching" className="bg-neutral-900">Samimi Sınav Koçu</option>
                    <option value="humorous" className="bg-neutral-900">Esprili & Genç Dili</option>
                  </select>
                </div>
              </div>

              {/* Özel Talimat */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Özel Konu / İpucu Notu <span className="text-slate-500 font-normal">(İsteğe bağlı)</span>
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Örn: Paragrafta süre yetiştiremeyenler için Bionic Reader taktikleri veya TYT Matematik logaritma püf noktası..."
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500 resize-none"
                />
              </div>

              {/* Yapay Zeka Görsel & Şema Motoru Bilgisi */}
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300">
                <Sparkles className="w-4 h-4 shrink-0 text-cyan-400" />
                <div>
                  <span className="font-bold text-white block">🎨 Otonom AI Görsel & Vektör Motoru Aktif</span>
                  <span className="text-[11px] text-slate-300">İçerik üretildiğinde konuyla tam uyumlu vektörel şema veya siber-lab illüstrasyonu otomatik olarak slayta işlenir.</span>
                </div>
              </div>
            </>
          ) : (
            // 7 Günlük Takvim Ayarları
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-300 leading-relaxed">
                🚀 <strong>7 Günlük İçerik Paketi:</strong> Ajan haftanın 7 günü için (Pazartesi’den Pazar’a) dengeli
                bir Instagram akışı oluşturur: 3 Carousel rehber, 2 Reels viral kancalı video senaryosu ve 2 Günün Sorusu / Motivasyon gönderisi.
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Hedef Sınav</label>
                  <select
                    value={targetGrade}
                    onChange={(e) => setTargetGrade(e.target.value as any)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-blue-500"
                  >
                    <option value="YKS (TYT/AYT)" className="bg-neutral-900">YKS (TYT / AYT)</option>
                    <option value="LGS" className="bg-neutral-900">LGS (8. Sınıf)</option>
                    <option value="Genel" className="bg-neutral-900">Genel</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Öncelikli Branş</label>
                  <input
                    type="text"
                    value={focusSubject}
                    onChange={(e) => setFocusSubject(e.target.value)}
                    placeholder="Örn: Türkçe & Matematik"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Haftalık Odak Notu <span className="text-slate-500 font-normal">(İsteğe bağlı)</span>
                </label>
                <textarea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Örn: Bu hafta özellikle deneme analizi ve net artırma üzerine yoğunlaşalım..."
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>
          )}

          {/* Alt Butonlar */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-lg transition-all hover:scale-105 active:scale-95 disabled:opacity-50 ${
                mode === 'auto_pilot'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                  : mode === 'weekly'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                    : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-[0_0_20px_rgba(249,115,22,0.3)]'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>DersoLab Ajanı Üretiyor...</span>
                </>
              ) : (
                <>
                  {mode === 'auto_pilot' ? (
                    <Zap className="w-4 h-4 text-cyan-200" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  <span>
                    {mode === 'auto_pilot'
                      ? '⚡ 3 Koordineli Paketi Başlat'
                      : mode === 'single'
                        ? contentType === 'x_thread'
                          ? 'X Flood Zincirini Üret'
                          : 'İçeriği Üret'
                        : '7 Günlük Takvimi Oluştur'}
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
