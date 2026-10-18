'use client'

import React, { useState } from 'react'
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Music2,
  Volume2,
  X,
} from 'lucide-react'
import type { SocialPostItem } from '@/types/social'
import { VisualCanvasEngine } from './VisualCanvasEngine'

interface InstagramMockupProps {
  post: SocialPostItem
  activeSlideIndex: number
  onSlideChange: (idx: number) => void
}

export function InstagramMockup({ post, activeSlideIndex, onSlideChange }: InstagramMockupProps) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false)

  const isReels = post.type === 'reels'
  const isCarousel = post.type === 'carousel'
  const isStory = post.type === 'story'

  return (
    <div className="flex flex-col items-center">
      {/* Telefon Gövdesi (iPhone Pro Tarzı) */}
      <div className="relative w-full max-w-[390px] rounded-[48px] p-3.5 bg-gradient-to-b from-neutral-800 via-neutral-900 to-black shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.15)]">
        {/* Dynamic Island / Ahize */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-end pr-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-950/60 border border-blue-900/40" />
        </div>

        {/* Ekran Alanı */}
        <div className="relative w-full rounded-[38px] bg-black overflow-hidden flex flex-col text-white select-none border border-white/5">
          {/* Durum Çubuğu (Status Bar) */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold text-white/90 z-20">
            <span>09:41</span>
            <div className="flex items-center gap-1.5 text-xs">
              <span>5G</span>
              <div className="w-5 h-2.5 rounded-sm border border-white/80 p-0.5 flex items-center">
                <div className="w-full h-full bg-white rounded-2xs" />
              </div>
            </div>
          </div>

          {/* STORY MODU GÖRÜNÜMÜ */}
          {isStory ? (
            <div className="relative w-full flex flex-col justify-between overflow-hidden">
              {/* Story İlerleme Çubuğu */}
              <div className="px-4 pt-1 pb-2 flex items-center gap-1 z-30">
                <div className="flex-1 h-0.5 bg-white rounded-full" />
                <div className="flex-1 h-0.5 bg-white/30 rounded-full" />
              </div>

              {/* Story Üst Bar */}
              <div className="px-4 py-1 flex items-center justify-between z-30">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-black p-0.5 border border-orange-500 overflow-hidden">
                    <img src="/fox-head.png" alt="DersoLab" className="w-full h-full object-contain" />
                  </div>
                  <span className="text-xs font-bold">dersolabegitim</span>
                  <span className="text-[11px] text-white/60">2s</span>
                </div>
                <button className="text-white/80 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Story Canvas Alanı */}
              <div className="w-full aspect-[9/16] relative">
                <VisualCanvasEngine
                  storyData={post.storyData}
                  isStory={true}
                  customImageUrl={post.storyData?.uploadedImageUrl || post.uploadedImageUrl}
                />
              </div>

              {/* Story Alt Yanıt Barı */}
              <div className="px-4 py-3 flex items-center gap-3 border-t border-white/10 z-30 bg-black/50 backdrop-blur-md">
                <div className="flex-1 px-4 py-2 rounded-full border border-white/20 bg-white/5 text-xs text-slate-400">
                  Yanıt gönder...
                </div>
                <button
                  onClick={() => setLiked(!liked)}
                  className={`transition-colors ${liked ? 'text-red-500' : 'text-white'}`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                </button>
                <button className="text-white">
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            // POST, CAROUSEL VEYA REELS MODU
            <>
              {/* Instagram Üst Bar (Header) */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 z-20">
                <div className="flex items-center gap-2.5">
                  <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                    <div className="w-8 h-8 rounded-full bg-black p-0.5 flex items-center justify-center overflow-hidden">
                      <img src="/fox-head.png" alt="DersoLab" className="w-full h-full object-contain" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold tracking-tight">dersolabegitim</span>
                      <div className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center text-[8px] font-black text-white">
                        ✓
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400">DersoLab • Sınav Laboratuvarı</span>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-white" aria-label="Seçenekler">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* İÇERİK ALANI (MEDIA AREA) */}
              <div className="relative w-full aspect-[4/5] bg-neutral-950 flex items-center justify-center overflow-hidden">
                {isReels ? (
                  // REELS SİMÜLASYONU
                  <div className="relative w-full h-full bg-gradient-to-br from-indigo-950 via-slate-950 to-neutral-950 p-6 flex flex-col justify-between overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(99,102,241,0.25),transparent_60%)]" />

                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-orange-400">
                        ⚡ REELS SENARYOSU
                      </span>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black/40 text-[10px] text-white/70">
                        <Volume2 className="w-3 h-3" />
                        <span>Ses Açık</span>
                      </div>
                    </div>

                    <div className="relative z-10 my-auto space-y-3">
                      <div className="p-3.5 rounded-2xl bg-black/70 backdrop-blur-md border border-orange-500/30 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                        <span className="text-[10px] font-black uppercase tracking-wider text-orange-400 block mb-1">
                          🎬 3 SANİYE KANCASI (HOOK)
                        </span>
                        <p className="text-xs font-bold text-white leading-relaxed">
                          {post.reelsStoryboard?.hook3s || 'İlk 3 saniye vurucu kancası burada...'}
                        </p>
                      </div>

                      {post.reelsStoryboard?.onScreenText && (
                        <div className="flex flex-wrap gap-1.5 justify-center">
                          {post.reelsStoryboard.onScreenText.map((tag, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg bg-orange-500 text-white font-black text-[11px] shadow-lg animate-pulse"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Sağ Reels Etkileşim Butonları */}
                    <div className="absolute right-3 bottom-12 flex flex-col items-center gap-4 z-20">
                      <button onClick={() => setLiked(!liked)} className="flex flex-col items-center gap-1">
                        <div
                          className={`w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center transition-colors ${
                            liked ? 'text-red-500' : 'text-white'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                        </div>
                        <span className="text-[10px] font-semibold">12.4K</span>
                      </button>

                      <button className="flex flex-col items-center gap-1">
                        <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
                          <MessageCircle className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-semibold">348</span>
                      </button>

                      <button className="flex flex-col items-center gap-1">
                        <div className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white">
                          <Send className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-semibold">Paylaş</span>
                      </button>

                      <button onClick={() => setSaved(!saved)} className="flex flex-col items-center gap-1">
                        <div
                          className={`w-9 h-9 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center ${
                            saved ? 'text-yellow-400' : 'text-white'
                          }`}
                        >
                          <Bookmark className={`w-5 h-5 ${saved ? 'fill-current' : ''}`} />
                        </div>
                        <span className="text-[10px] font-semibold">Kaydet</span>
                      </button>
                    </div>

                    {/* Alt Reels Açıklaması */}
                    <div className="relative z-10 pr-12">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-bold">@dersolabegitim</span>
                        <button className="px-2 py-0.5 rounded-md bg-white/20 text-[10px] font-bold">Takip Et</button>
                      </div>
                      <p className="text-[11px] text-white/90 line-clamp-2">
                        {post.reelsStoryboard?.spokenScript || post.title}
                      </p>
                      <div className="flex items-center gap-1 text-[10px] text-white/70 mt-2">
                        <Music2 className="w-3 h-3 animate-spin" />
                        <span className="truncate">
                          {post.reelsStoryboard?.musicAudioVibe || 'Orijinal Ses - dersolabegitim'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // CAROUSEL VEYA POST (CANVAS TABANLI)
                  <div className="w-full h-full">
                    <VisualCanvasEngine
                      slides={post.carouselSlides}
                      singlePost={post.singlePostData}
                      customImageUrl={post.uploadedImageUrl}
                      activeSlideIndex={activeSlideIndex}
                      onSlideChange={onSlideChange}
                    />
                  </div>
                )}
              </div>

              {/* POST İKİNCİL AKSİYON BAR */}
              {!isReels && (
                <div className="px-3.5 pt-2.5 pb-1 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <button
                      onClick={() => setLiked(!liked)}
                      className={`transition-colors ${liked ? 'text-red-500' : 'text-white hover:text-white/80'}`}
                      aria-label="Beğen"
                    >
                      <Heart className={`w-6 h-6 ${liked ? 'fill-current' : ''}`} />
                    </button>
                    <button className="text-white hover:text-white/80" aria-label="Yorum Yap">
                      <MessageCircle className="w-6 h-6" />
                    </button>
                    <button className="text-white hover:text-white/80" aria-label="Paylaş">
                      <Send className="w-6 h-6" />
                    </button>
                  </div>

                  {isCarousel && post.carouselSlides && post.carouselSlides.length > 1 && (
                    <div className="flex items-center gap-1">
                      {post.carouselSlides.map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 rounded-full transition-all ${
                            i === activeSlideIndex ? 'w-3 bg-blue-500' : 'w-1.5 bg-white/30'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => setSaved(!saved)}
                    className={`transition-colors ${saved ? 'text-yellow-400' : 'text-white hover:text-white/80'}`}
                    aria-label="Kaydet"
                  >
                    <Bookmark className={`w-6 h-6 ${saved ? 'fill-current' : ''}`} />
                  </button>
                </div>
              )}

              {/* BEĞENİ VE CAPTION */}
              <div className="px-3.5 py-2 text-xs space-y-1">
                <span className="font-bold text-white block">1.842 beğenme</span>
                <div className="text-slate-300 leading-relaxed">
                  <span className="font-bold text-white mr-1.5">dersolabegitim</span>
                  <span>
                    {isCaptionExpanded ? post.caption : post.caption.slice(0, 110)}
                    {post.caption.length > 110 && !isCaptionExpanded && '...'}
                  </span>
                  {post.caption.length > 110 && (
                    <button
                      onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
                      className="text-slate-500 ml-1 font-semibold hover:text-slate-300"
                    >
                      {isCaptionExpanded ? ' daha az' : ' devamı'}
                    </button>
                  )}
                </div>

                {post.hashtags && post.hashtags.length > 0 && (
                  <p className="text-blue-400 font-medium text-[11px] pt-0.5">
                    {post.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}
                  </p>
                )}

                <div className="text-[10px] text-slate-500 uppercase tracking-wider pt-1">1 SAAT ÖNCE</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
