'use client'

import React, { useEffect, useState } from 'react'
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
  Play,
  Pause,
  Repeat2,
  Copy,
  Check,
  Share2,
} from 'lucide-react'
import type { SocialPostItem } from '@/types/social'
import { SocialCanvasPreview } from './SocialCanvasPreview'

interface SocialPhoneMockupProps {
  post: SocialPostItem
  activeSlideIndex: number
  onSlideChange: (index: number) => void
}

function truncateCaptionSafely(text: string, maxLength: number): string {
  if (!text) return ''
  const chars = Array.from(text)
  if (chars.length <= maxLength) return text
  return chars.slice(0, maxLength).join('') + '...'
}

export function SocialPhoneMockup({
  post,
  activeSlideIndex,
  onSlideChange,
}: SocialPhoneMockupProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [isCaptionExpanded, setIsCaptionExpanded] = useState(false)
  const [previewPlatform, setPreviewPlatform] = useState<'instagram' | 'tiktok' | 'x'>('instagram')
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [copiedTweetIdx, setCopiedTweetIdx] = useState<number | null>(null)
  const [copiedAllThread, setCopiedAllThread] = useState(false)

  const isStory = post.type === 'story'
  const isReels = post.type === 'reels'
  const isCarousel = post.type === 'carousel'
  const isXThread = post.type === 'x_thread'
  const slides = post.carouselSlides || []
  const totalSlides = isCarousel ? Math.max(slides.length, 1) : 1

  // Gönderi tipi değiştiğinde uygun platform görünümüne otomatik geç
  useEffect(() => {
    if (post.type === 'x_thread') {
      setPreviewPlatform('x')
    } else if (post.platform === 'tiktok') {
      setPreviewPlatform('tiktok')
    } else {
      setPreviewPlatform('instagram')
    }
    setIsAutoPlaying(false)
  }, [post.id, post.type, post.platform])

  // Carousel Otomatik Slayt Geçişi
  useEffect(() => {
    if (!isAutoPlaying || !isCarousel || totalSlides <= 1) return
    const timer = setInterval(() => {
      onSlideChange((activeSlideIndex + 1) % totalSlides)
    }, 2800)
    return () => clearInterval(timer)
  }, [isAutoPlaying, isCarousel, totalSlides, activeSlideIndex, onSlideChange])

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

  const xTweets =
    post.xThreadData?.tweets && post.xThreadData.tweets.length > 0
      ? post.xThreadData.tweets
      : isCarousel && slides.length > 0
        ? slides.map((s, idx) => ({
            tweetNumber: idx + 1,
            text: `${idx + 1}/${slides.length} ${s.headline}\n\n${s.subhead ? s.subhead + '\n' : ''}${(s.bodyPoints || []).map((bp) => `• ${bp}`).join('\n')}`,
            charCount: 180,
          }))
        : [
            {
              tweetNumber: 1,
              text: `1/2 🚨 ${post.title}\n\n${truncateCaptionSafely(post.caption || '', 210)}`,
              charCount: 195,
            },
            {
              tweetNumber: 2,
              text: `2/2 🦊 Konuyu interaktif simülasyonla denemek için: dersolab.com/lab\n\n${(post.hashtags || []).slice(0, 4).join(' ')}`,
              charCount: 120,
            },
          ]

  async function handleCopyTweet(text: string, idx: number) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedTweetIdx(idx)
      setTimeout(() => setCopiedTweetIdx(null), 1800)
    } catch {
      // ignore
    }
  }

  async function handleCopyFullThread() {
    try {
      const fullText = xTweets.map((t) => t.text).join('\n\n---\n\n')
      await navigator.clipboard.writeText(fullText)
      setCopiedAllThread(true)
      setTimeout(() => setCopiedAllThread(false), 2000)
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex flex-col items-center w-full gap-2.5">
      {/* Üst Platform Seçici & Otomatik Oynatma Çubuğu */}
      <div className="w-full max-w-[390px] flex items-center justify-between gap-1.5 px-1">
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-900/90 border border-white/10">
          <button
            type="button"
            onClick={() => setPreviewPlatform('instagram')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              previewPlatform === 'instagram'
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📸 Instagram
          </button>
          <button
            type="button"
            onClick={() => setPreviewPlatform('tiktok')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              previewPlatform === 'tiktok'
                ? 'bg-cyan-500 text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🎵 TikTok
          </button>
          <button
            type="button"
            onClick={() => setPreviewPlatform('x')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
              previewPlatform === 'x'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            𝕏 Flood
          </button>
        </div>

        {isCarousel && totalSlides > 1 && previewPlatform !== 'x' && (
          <button
            type="button"
            onClick={() => setIsAutoPlaying((prev) => !prev)}
            className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1 transition-all ${
              isAutoPlaying
                ? 'bg-orange-500/20 border-orange-500/50 text-orange-300'
                : 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white'
            }`}
            title="Slaytları otomatik sırayla oynat"
          >
            {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            {isAutoPlaying ? 'Durdur' : 'Slayt Oynat'}
          </button>
        )}
      </div>

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

          {/* 1. X / TWITTER FLOOD GÖRÜNÜMÜ */}
          {previewPlatform === 'x' || isXThread ? (
            <div className="flex flex-col bg-black min-h-[540px] max-h-[620px]">
              {/* X Üst Bar */}
              <div className="px-4 py-2.5 border-b border-white/10 flex items-center justify-between bg-black/90 backdrop-blur-md sticky top-0 z-20">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black tracking-tight text-white">𝕏 Gönderi Dizisi</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                    {xTweets.length} Tweet
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyFullThread}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[10px] font-bold text-white flex items-center gap-1 transition-colors"
                >
                  {copiedAllThread ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedAllThread ? 'Kopyalandı!' : 'Tümünü Kopyala'}
                </button>
              </div>

              {/* Tweet Zinciri Listesi */}
              <div className="flex-1 overflow-y-auto px-3.5 py-3 space-y-3 custom-scrollbar">
                {xTweets.map((tweet, idx) => {
                  const charLen = Array.from(tweet.text || '').length
                  return (
                    <div key={idx} className="relative flex gap-2.5">
                      {/* Sol Avatar + Zincir Çizgisi */}
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-900 border border-orange-500/50 p-1 shrink-0 overflow-hidden">
                          <img src="/fox-head.png" alt="DersoLab" className="w-full h-full object-contain" />
                        </div>
                        {idx < xTweets.length - 1 && (
                          <div className="w-0.5 flex-1 bg-gradient-to-b from-orange-500/40 to-white/10 my-1" />
                        )}
                      </div>

                      {/* Tweet İçeriği */}
                      <div className="flex-1 pb-2 border-b border-white/5">
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-white">DersoLab</span>
                            <span className="w-3.5 h-3.5 rounded-full bg-sky-500 text-[8px] font-black text-white flex items-center justify-center">
                              ✓
                            </span>
                            <span className="text-[10px] text-slate-400">@dersolabegitim · Şimdi</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyTweet(tweet.text, idx)}
                            className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                            title="Bu tweeti kopyala"
                          >
                            {copiedTweetIdx === idx ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>

                        <p className="mt-1 text-xs leading-relaxed text-slate-100 whitespace-pre-line select-text">
                          {tweet.text}
                        </p>

                        {/* İlk tweette varsa görsel önizleme */}
                        {idx === 0 && post.uploadedImageUrl && (
                          <div className="mt-2 rounded-xl overflow-hidden border border-white/10 max-h-40 bg-slate-950">
                            <img
                              src={post.uploadedImageUrl}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1 hover:text-sky-400 cursor-pointer">
                              <MessageCircle className="w-3.5 h-3.5" /> {12 + idx * 3}
                            </span>
                            <span className="flex items-center gap-1 hover:text-emerald-400 cursor-pointer">
                              <Repeat2 className="w-3.5 h-3.5" /> {48 - idx * 5}
                            </span>
                            <span className="flex items-center gap-1 hover:text-rose-400 cursor-pointer">
                              <Heart className="w-3.5 h-3.5" /> {190 - idx * 18}
                            </span>
                            <span className="flex items-center gap-1 hover:text-sky-400 cursor-pointer">
                              <Share2 className="w-3.5 h-3.5" />
                            </span>
                          </div>
                          <span
                            className={`font-mono ${
                              charLen > 280 ? 'text-rose-400 font-bold' : 'text-slate-500'
                            }`}
                          >
                            {charLen}/280
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : previewPlatform === 'tiktok' ? (
            /* 2. TIKTOK DİKEY VİDEO / SLAYT GÖRÜNÜMÜ */
            <div className="relative w-full flex flex-col justify-between overflow-hidden bg-black">
              {/* TikTok Üst Sekmeler */}
              <div className="px-4 py-2 flex items-center justify-center gap-4 text-xs font-bold z-30 bg-gradient-to-b from-black/80 to-transparent">
                <span className="text-white/60">Takip Edilenler</span>
                <span className="text-white border-b-2 border-white pb-0.5">Sizin İçin</span>
              </div>

              {/* TikTok Canvas Alanı */}
              <div className="relative w-full">
                <SocialCanvasPreview post={post} activeSlideIndex={activeSlideIndex} />

                {/* Carousel ise Sağ/Sol Oklar */}
                {isCarousel && totalSlides > 1 && (
                  <>
                    {activeSlideIndex > 0 && (
                      <button
                        type="button"
                        onClick={handlePrevSlide}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center z-30"
                        aria-label="Önceki Slayt"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}
                    {activeSlideIndex < totalSlides - 1 && (
                      <button
                        type="button"
                        onClick={handleNextSlide}
                        className="absolute right-14 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center z-30"
                        aria-label="Sonraki Slayt"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </>
                )}

                {/* TikTok Sağ Etkileşim Sütunu */}
                <div className="absolute right-2.5 bottom-4 flex flex-col items-center gap-3.5 z-30">
                  <div className="relative w-9 h-9 rounded-full border-2 border-white bg-black p-1">
                    <img src="/fox-head.png" alt="DersoLab" className="w-full h-full object-contain" />
                    <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                      +
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsLiked(!isLiked)}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'text-rose-500 fill-current' : 'text-white'}`} />
                    <span className="text-[10px] font-bold">14.8B</span>
                  </button>
                  <div className="flex flex-col items-center gap-0.5">
                    <MessageCircle className="w-6 h-6 text-white" />
                    <span className="text-[10px] font-bold">342</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSaved(!isSaved)}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <Bookmark className={`w-6 h-6 ${isSaved ? 'text-amber-400 fill-current' : 'text-white'}`} />
                    <span className="text-[10px] font-bold">4.1B</span>
                  </button>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-800 via-slate-900 to-black border-4 border-slate-700 flex items-center justify-center animate-spin">
                    <Music2 className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                </div>
              </div>

              {/* TikTok Alt Açıklama & Ses Barı */}
              <div className="px-3.5 py-2.5 bg-black/90 border-t border-white/10 z-30">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-white">@dersolabegitim</span>
                  <span className="px-1.5 py-0.5 rounded-sm bg-cyan-500/20 text-cyan-300 text-[9px] font-bold">
                    Eğitim & L.A.B.
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-200 line-clamp-2">
                  {truncateCaptionSafely(post.caption, 95)}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-cyan-300">
                  <Music2 className="w-3 h-3 shrink-0" />
                  <span className="truncate">
                    {post.reelsStoryboard?.musicAudioVibe || 'Orijinal Ses - DersoLab Sınav Laboratuvarı'}
                  </span>
                </div>
              </div>
            </div>
          ) : isStory ? (
            /* 3. INSTAGRAM STORY GÖRÜNÜMÜ */
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
                  @dersolabegitim&apos;e yanıt ver...
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
            /* 4. INSTAGRAM FEED / CAROUSEL / REELS GÖRÜNÜMÜ */
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
                    : truncateCaptionSafely(post.caption, 110)}
                </span>
                {Array.from(post.caption || '').length > 110 && (
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
