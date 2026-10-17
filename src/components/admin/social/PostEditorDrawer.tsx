'use client'

import React, { useState } from 'react'
import {
  X,
  Sparkles,
  Layers,
  Film,
  HelpCircle,
  Copy,
  Check,
  Download,
  Share2,
  Trash2,
  ExternalLink,
  Calendar,
  Send,
  Sliders,
  Smartphone,
  Eye,
  Clock,
} from 'lucide-react'
import type { CarouselSlide, PostStatus, SocialPostItem } from '@/types/social'
import { VisualCanvasEngine } from './VisualCanvasEngine'
import { InstagramMockup } from './InstagramMockup'
import { toast } from 'sonner'

interface PostEditorDrawerProps {
  post: SocialPostItem | null
  isOpen: boolean
  onClose: () => void
  onUpdatePost: (updated: SocialPostItem) => void
  onDeletePost: (id: string) => void
}

export function PostEditorDrawer({
  post,
  isOpen,
  onClose,
  onUpdatePost,
  onDeletePost,
}: PostEditorDrawerProps) {
  const [activeTab, setActiveTab] = useState<'caption' | 'slides' | 'publish'>('caption')
  const [previewMode, setPreviewMode] = useState<'canvas' | 'phone'>('canvas')
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [copiedCaption, setCopiedCaption] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)

  if (!isOpen || !post) return null

  const isCarousel = post.type === 'carousel'
  const isReels = post.type === 'reels'

  // Caption Kopyalama
  function handleCopyCaption() {
    const fullText = `${post!.caption}\n\n${(post!.hashtags || []).map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`
    navigator.clipboard.writeText(fullText)
    setCopiedCaption(true)
    toast.success('Açıklama ve hashtagler panoya kopyalandı!')
    setTimeout(() => setCopiedCaption(false), 2000)
  }

  // Durum Değiştirme
  function handleStatusChange(newStatus: PostStatus) {
    const updated: SocialPostItem = {
      ...post!,
      status: newStatus,
      publishedAt: newStatus === 'published' ? new Date().toISOString() : post!.publishedAt,
    }
    onUpdatePost(updated)
    toast.success(`Durum "${getStatusLabel(newStatus)}" olarak güncellendi!`)
  }

  // Slayt Güncelleme
  function handleSlideUpdate(index: number, updatedSlide: CarouselSlide) {
    if (!post!.carouselSlides) return
    const newSlides = [...post!.carouselSlides]
    newSlides[index] = updatedSlide
    onUpdatePost({
      ...post!,
      carouselSlides: newSlides,
    })
  }

  // Instagram Doğrudan Yayınlama Çağrısı
  async function handlePublishToInstagram() {
    setIsPublishing(true)
    try {
      const res = await fetch('/api/admin/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: `${post!.caption}\n\n${(post!.hashtags || []).join(' ')}`,
          isReels: post!.type === 'reels',
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Instagram yayını başarısız oldu.')
      }

      if (data.mode === 'manual_fallback') {
        toast.info(data.message, { duration: 6000 })
      } else {
        toast.success(data.message)
        handleStatusChange('published')
      }
    } catch (err: any) {
      toast.error(err?.message || 'Yayınlama sırasında bir hata oluştu.')
    } finally {
      setIsPublishing(false)
    }
  }

  function getStatusLabel(status: PostStatus) {
    switch (status) {
      case 'draft':
        return 'Taslak'
      case 'approved':
        return 'Onaylandı'
      case 'scheduled':
        return 'Planlandı'
      case 'published':
        return 'Yayınlandı'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl h-[92vh] rounded-3xl bg-[#0d0f15] border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
        {/* Üst Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${
                isCarousel
                  ? 'bg-orange-500/20 border-orange-500/30 text-orange-400'
                  : isReels
                    ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                    : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
              }`}
            >
              {isCarousel ? <Layers className="w-5 h-5" /> : isReels ? <Film className="w-5 h-5" /> : <HelpCircle className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white max-w-md truncate">{post.title}</h2>
                <span
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                    post.status === 'published'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : post.status === 'approved'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : post.status === 'scheduled'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {getStatusLabel(post.status)}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {post.topicLabel} • {post.targetAudience} • {isCarousel ? 'Kaydırmalı Carousel' : isReels ? 'Reels' : 'Günün Sorusu / Post'}
              </p>
            </div>
          </div>

          {/* Sağ Aksiyonlar */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDeletePost(post.id)}
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-colors"
              title="Gönderiyi Sil"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ana İçerik Grid (Sol: Editör, Sağ: Canlı Önizleme) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* SOL PANEL: Editör ve Ayarlar (7 Kolon) */}
          <div className="lg:col-span-7 flex flex-col border-r border-white/10 overflow-hidden bg-black/20">
            {/* Sekme Seçici */}
            <div className="flex items-center gap-1 px-6 pt-4 pb-2 border-b border-white/5">
              <button
                onClick={() => setActiveTab('caption')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'caption'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Açıklama & Hashtag</span>
              </button>
              <button
                onClick={() => setActiveTab('slides')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'slides'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{isCarousel ? 'Slayt İçerikleri' : isReels ? 'Reels Senaryosu' : 'Soru Detayları'}</span>
              </button>
              <button
                onClick={() => setActiveTab('publish')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === 'publish'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Yayınlama & Onay</span>
              </button>
            </div>

            {/* Sekme Gövdesi */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {activeTab === 'caption' && (
                <div className="space-y-4">
                  {/* Başlık Düzenleme */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">İçerik Başlığı</label>
                    <input
                      type="text"
                      value={post.title}
                      onChange={(e) => onUpdatePost({ ...post, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Instagram Açıklaması */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">Instagram Açıklaması (Caption)</label>
                      <button
                        onClick={handleCopyCaption}
                        className="flex items-center gap-1 text-[11px] font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCaption ? 'Kopyalandı' : 'Tüm Metni Kopyala'}</span>
                      </button>
                    </div>
                    <textarea
                      value={post.caption}
                      onChange={(e) => onUpdatePost({ ...post, caption: e.target.value })}
                      rows={9}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-xs text-white leading-relaxed outline-none focus:border-orange-500 resize-none font-sans"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{post.caption.length} karakter</span>
                      <span>Öneri: İlk 125 karakter akışta doğrudan görünür</span>
                    </div>
                  </div>

                  {/* Hashtagler */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Hashtagler</label>
                    <input
                      type="text"
                      value={(post.hashtags || []).join(' ')}
                      onChange={(e) =>
                        onUpdatePost({
                          ...post,
                          hashtags: e.target.value
                            .split(' ')
                            .map((h) => h.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="#yks2026 #tyt #dersolab"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-blue-400 outline-none focus:border-orange-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'slides' && (
                <div className="space-y-5">
                  {isCarousel && post.carouselSlides ? (
                    // Carousel Slaytları Düzenleme
                    <div className="space-y-4">
                      {/* Slayt Seçim Sekmeleri */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {post.carouselSlides.map((slide, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveSlideIndex(idx)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                              activeSlideIndex === idx
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'bg-white/5 text-slate-400 hover:text-white'
                            }`}
                          >
                            <span>Slayt {idx + 1}</span>
                          </button>
                        ))}
                      </div>

                      {/* Aktif Slayt Formu */}
                      {post.carouselSlides[activeSlideIndex] && (
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3.5">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-400">Üst Rozet (Badge)</label>
                              <input
                                type="text"
                                value={post.carouselSlides[activeSlideIndex].badge || ''}
                                onChange={(e) =>
                                  handleSlideUpdate(activeSlideIndex, {
                                    ...post.carouselSlides![activeSlideIndex],
                                    badge: e.target.value,
                                  })
                                }
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-orange-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-400">Vurgu Etiketi</label>
                              <input
                                type="text"
                                value={post.carouselSlides[activeSlideIndex].highlightTag || ''}
                                onChange={(e) =>
                                  handleSlideUpdate(activeSlideIndex, {
                                    ...post.carouselSlides![activeSlideIndex],
                                    highlightTag: e.target.value,
                                  })
                                }
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-orange-500"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-400">Ana Başlık</label>
                            <input
                              type="text"
                              value={post.carouselSlides[activeSlideIndex].headline}
                              onChange={(e) =>
                                handleSlideUpdate(activeSlideIndex, {
                                  ...post.carouselSlides![activeSlideIndex],
                                  headline: e.target.value,
                                })
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-orange-500 font-bold"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-400">Alt Başlık</label>
                            <input
                              type="text"
                              value={post.carouselSlides[activeSlideIndex].subhead || ''}
                              onChange={(e) =>
                                handleSlideUpdate(activeSlideIndex, {
                                  ...post.carouselSlides![activeSlideIndex],
                                  subhead: e.target.value,
                                })
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-orange-500"
                            />
                          </div>

                          {/* Maddeler */}
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-slate-400">İçerik Maddeleri (Her satır bir madde)</label>
                            <textarea
                              value={(post.carouselSlides[activeSlideIndex].bodyPoints || []).join('\n')}
                              onChange={(e) =>
                                handleSlideUpdate(activeSlideIndex, {
                                  ...post.carouselSlides![activeSlideIndex],
                                  bodyPoints: e.target.value.split('\n').filter(Boolean),
                                })
                              }
                              rows={3}
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-orange-500 resize-none leading-relaxed"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : isReels && post.reelsStoryboard ? (
                    // Reels Storyboard Düzenleme
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-orange-400">🎬 İlk 3 Saniye Kancası (Hook)</label>
                        <textarea
                          value={post.reelsStoryboard.hook3s}
                          onChange={(e) =>
                            onUpdatePost({
                              ...post,
                              reelsStoryboard: { ...post.reelsStoryboard!, hook3s: e.target.value },
                            })
                          }
                          rows={2}
                          className="w-full bg-white/5 border border-orange-500/30 rounded-xl p-3 text-xs text-white outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">🎙️ Konuşma Metni (Word-for-Word Script)</label>
                        <textarea
                          value={post.reelsStoryboard.spokenScript}
                          onChange={(e) =>
                            onUpdatePost({
                              ...post,
                              reelsStoryboard: { ...post.reelsStoryboard!, spokenScript: e.target.value },
                            })
                          }
                          rows={4}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-orange-500 resize-none leading-relaxed"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">👀 Görsel / Sahne Yönlendirmesi</label>
                        <textarea
                          value={post.reelsStoryboard.visualDirection}
                          onChange={(e) =>
                            onUpdatePost({
                              ...post,
                              reelsStoryboard: { ...post.reelsStoryboard!, visualDirection: e.target.value },
                            })
                          }
                          rows={2}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">🎵 Önerilen Ses / Vibe</label>
                        <input
                          type="text"
                          value={post.reelsStoryboard.musicAudioVibe}
                          onChange={(e) =>
                            onUpdatePost({
                              ...post,
                              reelsStoryboard: { ...post.reelsStoryboard!, musicAudioVibe: e.target.value },
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  ) : post.singlePostData ? (
                    // Tekli Soru Düzenleme
                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Soru / Püf Nokta Başlığı</label>
                        <input
                          type="text"
                          value={post.singlePostData.headline}
                          onChange={(e) =>
                            onUpdatePost({
                              ...post,
                              singlePostData: { ...post.singlePostData!, headline: e.target.value },
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Soru Açıklaması</label>
                        <textarea
                          value={post.singlePostData.questionOrSummary}
                          onChange={(e) =>
                            onUpdatePost({
                              ...post,
                              singlePostData: { ...post.singlePostData!, questionOrSummary: e.target.value },
                            })
                          }
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {activeTab === 'publish' && (
                <div className="space-y-6">
                  {/* Durum Değiştirici */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">İçerik Durumu</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['draft', 'approved', 'scheduled', 'published'] as PostStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(st)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition-all ${
                            post.status === st
                              ? 'bg-orange-500/20 border-orange-500 text-orange-400 shadow-md'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {getStatusLabel(st)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Instagram Yayınlama Aksiyonları */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-amber-500/10 border border-pink-500/20 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white">
                        <Share2 className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Instagram Yayınlama</h4>
                        <p className="text-[11px] text-slate-400">
                          Meta Graph API ile hesabınıza otomatik gönderin veya manuel kopyalayın
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                      <button
                        onClick={handlePublishToInstagram}
                        disabled={isPublishing}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isPublishing ? 'Yayınlanıyor...' : 'Instagram’a Doğrudan Gönder'}</span>
                      </button>

                      <a
                        href="https://www.instagram.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/15 transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>Instagram Web’i Aç</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SAĞ PANEL: Canlı Önizleme (5 Kolon) */}
          <div className="lg:col-span-5 flex flex-col overflow-hidden bg-black/40">
            {/* Önizleme Modu Değiştirici */}
            <div className="flex items-center justify-between px-6 py-3 border-b border-white/5">
              <span className="text-xs font-semibold text-slate-400">Canlı Önizleme</span>
              <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/5 border border-white/10">
                <button
                  onClick={() => setPreviewMode('canvas')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    previewMode === 'canvas' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Şablon</span>
                </button>
                <button
                  onClick={() => setPreviewMode('phone')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    previewMode === 'phone' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Telefon</span>
                </button>
              </div>
            </div>

            {/* Önizleme Alanı */}
            <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
              {previewMode === 'canvas' ? (
                <VisualCanvasEngine
                  slides={post.carouselSlides}
                  singlePost={post.singlePostData}
                  activeSlideIndex={activeSlideIndex}
                  onSlideChange={setActiveSlideIndex}
                  onSlideUpdate={handleSlideUpdate}
                />
              ) : (
                <InstagramMockup
                  post={post}
                  activeSlideIndex={activeSlideIndex}
                  onSlideChange={setActiveSlideIndex}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
