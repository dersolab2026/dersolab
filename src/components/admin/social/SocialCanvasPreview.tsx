'use client'

import React, { useRef, useEffect, useState } from 'react'
import type { SocialPostItem } from '@/types/social'
import { renderSlideToCanvas } from '@/lib/social/canvasRenderer'

interface SocialCanvasPreviewProps {
  post: SocialPostItem
  activeSlideIndex: number
  className?: string
}

export function SocialCanvasPreview({
  post,
  activeSlideIndex,
  className = '',
}: SocialCanvasPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isRendering, setIsRendering] = useState(false)

  const isStory = post.type === 'story'
  const isReels = post.type === 'reels'
  const isCarousel = post.type === 'carousel'
  const slides = post.carouselSlides || []
  const currentSlide = isCarousel && slides.length > 0 ? slides[activeSlideIndex] || slides[0] : null
  const totalSlides = isCarousel ? Math.max(slides.length, 1) : 1

  useEffect(() => {
    let isMounted = true
    const canvas = canvasRef.current
    if (!canvas) return

    setIsRendering(true)

    renderSlideToCanvas(canvas, {
      isStory,
      isCarousel,
      isReels,
      activeSlideIndex,
      totalSlides,
      currentSlide,
      singlePost: post.singlePostData,
      storyData: post.storyData,
      reelsStoryboard: post.reelsStoryboard,
      postTitle: post.title,
      postCaption: post.caption,
      customImageUrl:
        currentSlide?.uploadedImageUrl ||
        post.uploadedImageUrl ||
        post.storyData?.uploadedImageUrl ||
        post.reelsStoryboard?.uploadedImageUrl,
      themeVariant: currentSlide?.themeVariant,
    })
      .catch((err) => {
        console.error('Canvas render hatası:', err)
      })
      .finally(() => {
        if (isMounted) setIsRendering(false)
      })

    return () => {
      isMounted = false
    }
  }, [
    post,
    activeSlideIndex,
    isStory,
    isCarousel,
    isReels,
    currentSlide,
    totalSlides,
  ])

  // Story ve Reels 9:16 oranında, Carousel ve Kare Gönderiler 4:5 Instagram Portrait oranında
  const aspectRatioClass = isStory || isReels ? 'aspect-[9/16]' : 'aspect-[4/5]'

  return (
    <div className={`relative w-full overflow-hidden bg-black flex items-center justify-center ${aspectRatioClass} ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full object-contain block select-none pointer-events-none"
      />
      {isRendering && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none transition-opacity">
          <div className="w-5 h-5 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
        </div>
      )}
    </div>
  )
}
