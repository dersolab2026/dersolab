'use client'

import React, { useState } from 'react'
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Music2,
  X,
  Volume2,
} from 'lucide-react'
import type { SocialPostItem } from '@/types/social'
import { SocialCanvasPreview } from './SocialCanvasPreview'

interface SocialPhoneMockupProps {
  post: SocialPostItem
  activeSlideIndex: number
  onSlideChange: (index: number) => void
}

export function SocialPhoneMockup({
  post,
  activeSlideIndex,
  onSlideChange,
}: SocialPhoneMockupProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false)

  const isStory = post.type === 'story'
  const isReels = post.type === 'reels'
  const isCarousel = post.type === 'carousel'
  const slides = post.carouselSlides || []
  const totalSlides = isCarousel ? Math.max(slides.length, 1) : 1

  function handlePrevSlide() {
    if (activeSlideIndex > 0) {
      onSlideChange(activeSlideIndex - 1)
    }
  }

  function handleNextSlide() {
    if (activeSlideIndex < totalSlides - 1) {
      onSlideChange(activeSlideIndex + 1)
    }
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Telefon Çerçevesi (iPhone Pro Style) */}
      <div className="relative w-full max-w-[390px] rounded-[44px] p-3 bg-gradient-to-b from-neutral-800 via-neutral-900 to-black shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_0_1px_rgba(255,255,255,0.12)]">
        {/* Dynamic Island */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-4 bg-black rounded-full z-30 flex items-center justify-end pr-2">
          <div className="w-2 h-2 rounded-full bg-blue-950/70 border border-blue-900/50" />
        </div>

        {/* Ekran İçi */}
        <div className="relative w-full rounded-[34px] bg-black overflow-hidden flex flex-col text-white select-none border border-white/5">
          {/* Durum Çubuğu (Status Bar) */}
          <div className="flex items-center justify-between px-6 pt-3 pb-1 text-[11px] font-semibold text-white/90 z-20">
            <span>09:41</span>
            <div className="flex items-center gap-1.5 text-xs">
              <span>5G</span>
              <div className="w-5 h-2.5 rounded-xs border border-white/80 p-0.5 flex items-center">
                <div className="w-full h-full bg-white rounded-3xs" />
              </div>
            </div>
          </div>

          {/* STORY GÖRÜNÜMÜ */}
          {isStory ? (
            <div className="relative w-full flex flex-col justify-between overflow-hidden">
              {/* Story İlerleme Çubukları */}
              <div className="px-4 pt-1.5 pb-2 flex items-center gap-1 z-30">
                <div className="flex-1 h-0.5 bg-white rounded-full shadow-xs" />
                <div className="flex-1 h-0.5 bg-white/30 rounded-full" />
              </div>

              {/* Story Header */}
              <div className="px-4 py-1 flex items-center justify-between z-30">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-black p-0.5 border-2 border-orange-500 overflow-hidden shadow-sm">
                    <img src="/fox-head.png" alt="DersoLab" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold tracking-tight">dersolabegitim</span>
                    <span className="text-[10px] text-white/70">2s</span>
                  </div>
                </div>
                <div className="text-white/80 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </div>
              </div>

              {/* Story Canvas */}
              <div className="w-full relative">
                <SocialCanvasPreview post={post} activeSlideIndex={0} />
              </div>

              {/* Story Alt Yanıt Çubuğu */}
              <div className="px-4 py-3 flex items-center gap-2.5 border-t border-white/10 z-30 bg-black/60 backdrop-blur-md">
                <div className="flex-1 px-3.5 py-1.5 rounded-full border border-white/20 bg-white/10 text-xs text-white/60">
                  @dersolabegitim'e yanıt ver...
                </div>
                <button
                  type="button"
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-1.5 rounded-full transition-transform active:scale-125 ${
                    isLiked ? 'text-red-500' : 'text-white'
                  }`}
                  aria-label="Beğen"
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
                <button
                  type="button"
                  className="p-1.5 text-white hover:text-orange-400 transition-colors"
                  aria-label="Paylaş"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            /* FEED / CAROUSEL / REELS GÖRÜNÜMÜ */
            <div className="flex flex-col">
              {/* Instagram Feed Header */}
              <div className="flex items-center justify-between px-3.5 py-2 border-b border-white/5 z-20">
                <div className="flex items-center gap-2.5">
                  <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
                    <div className="w-7 h-7 rounded-full bg-black p-0.5 flex items-center justify-center overflow-hidden">
                      <img src="/fox-head.png" alt="DersoLab" className="w-full h-full object-contain" />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold tracking-tight">dersolabegitim</span>
                      <div className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center text-[7px] font-black text-white">
                        ✓
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 leading-tight">
                      {isReels ? 'Reels Videosu' : 'DersoLab • Sınav Laboratuvarı'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isCarousel && (
                    <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-bold text-slate-300">
                      {activeSlideIndex + 1}/{totalSlides}
                    </span>
                  )}
                  <MoreHorizontal className="w-4 h-4 text-slate-400" />
                </div>
              </div>

              {/* Görsel / Canvas Alanı */}
              <div className="relative w-full group">
                <SocialCanvasPreview post={post} activeSlideIndex={activeSlideIndex} />

                {/* Carousel Geçiş Butonları */}
                {isCarousel && totalSlides > 1 && (
                  <>
                    {activeSlideIndex > 0 && (
                      <button
                        type="button"
                        onClick={handlePrevSlide}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 hover:bg-black/80"
                        aria-label="Önceki Slayt"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}
                    {activeSlideIndex < totalSlides - 1 && (
                      <button
                        type="button"
                        onClick={handleNextSlide}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 hover:bg-black/80"
                        aria-label="Sonraki Slayt"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}

                {/* Reels Ses Rozeti */}
                {isReels && (
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-[10px] text-slate-200">
                    <Music2 className="w-3 h-3 text-orange-400 animate-pulse" />
                    <span className="truncate max-w-[180px]">
                      {post.reelsStoryboard?.musicAudioVibe || 'Orijinal Ses - dersolabegitim'}
                    </span>
                  </div>
                )}
              </div>

              {/* Instagram Feed Alt Eylemler */}
              <div className="px-3.5 pt-2.5 pb-1.5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setIsLiked(!isLiked)}
                    className={`transition-transform active:scale-125 ${isLiked ? 'text-red-500' : 'text-white'}`}
                    aria-label="Beğen"
                  >
                    <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  </button>
                  <button type="button" className="text-white hover:text-slate-300 transition-colors" aria-label="Yorum Yap">
                    <MessageCircle className="w-5 h-5" />
                  </button>
                  <button type="button" className="text-white hover:text-slate-300 transition-colors" aria-label="Paylaş">
                    <Send className="w-5 h-5" />
                  </button>
                </div>

                {/* Carousel Nokta Göstergeleri */}
                {isCarousel && totalSlides > 1 && (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalSlides }).map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onSlideChange(idx)}
                        className={`h-1.5 rounded-full transition-all ${
                          idx === activeSlideIndex
                            ? 'w-4 bg-orange-500'
                            : 'w-1.5 bg-white/30 hover:bg-white/50'
                        }`}
                        aria-label={`Slayt ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setIsSaved(!isSaved)}
                  className={`transition-transform active:scale-125 ${isSaved ? 'text-orange-400' : 'text-white'}`}
                  aria-label="Kaydet"
                >
                  <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Beğeni Sayısı */}
              <div className="px-3.5 text-xs font-bold text-white">
                {isLiked ? '1.429 beğenme' : '1.428 beğenme'}
              </div>

              {/* Açıklama (Caption) Önizleme */}
              <div className="px-3.5 pt-1 pb-3 text-xs leading-relaxed text-slate-200">
                <span className="font-bold text-white mr-1.5">dersolabegitim</span>
                <span className="whitespace-pre-line">
                  {isCaptionExpanded
                    ? post.caption
                    : post.caption.slice(0, 110) + (post.caption.length > 110 ? '...' : '')}
                </span>
                {post.caption.length > 110 && (
                  <button
                    type="button"
                    onClick={() => setIsCaptionExpanded(!isCaptionExpanded)}
                    className="ml-1 text-slate-400 hover:text-white font-medium"
                  >
                    {isCaptionExpanded ? 'daha az' : 'devamı'}
                  </button>
                )}

                {/* Hashtag Listesi */}
                {post.hashtags && post.hashtags.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1 text-[11px] text-cyan-400">
                    {post.hashtags.map((h, i) => (
                      <span key={i} className="hover:underline cursor-pointer">
                        {h.startsWith('#') ? h : `#${h}`}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
