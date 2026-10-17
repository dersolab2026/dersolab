'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import {
  Download,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Layers,
  Palette,
  Upload,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react'
import type { CarouselSlide, SinglePostData, SlideThemeVariant, StoryData } from '@/types/social'
import { toast } from 'sonner'

interface VisualCanvasEngineProps {
  slides?: CarouselSlide[]
  singlePost?: SinglePostData
  storyData?: StoryData
  isStory?: boolean
  customImageUrl?: string
  activeSlideIndex?: number
  onSlideChange?: (index: number) => void
  onSlideUpdate?: (index: number, updated: CarouselSlide) => void
  onImageUpload?: (base64: string) => void
}

const THEME_STYLES: Record<
  SlideThemeVariant,
  {
    bgGradient: [string, string]
    accentColor: string
    secondaryAccent: string
    badgeBg: string
    badgeText: string
    glowColor: string
    tagBg: string
    tagText: string
  }
> = {
  lab_dark: {
    bgGradient: ['#07090e', '#0f172a'],
    accentColor: '#38bdf8',
    secondaryAccent: '#818cf8',
    badgeBg: 'rgba(56, 189, 248, 0.15)',
    badgeText: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.25)',
    tagBg: '#38bdf8',
    tagText: '#0f172a',
  },
  neon_orange: {
    bgGradient: ['#0c0704', '#1f130b'],
    accentColor: '#f97316',
    secondaryAccent: '#fb923c',
    badgeBg: 'rgba(249, 115, 22, 0.15)',
    badgeText: '#fb923c',
    glowColor: 'rgba(249, 115, 22, 0.3)',
    tagBg: '#f97316',
    tagText: '#ffffff',
  },
  cyan_cyber: {
    bgGradient: ['#040c0e', '#0b1f22'],
    accentColor: '#06b6d4',
    secondaryAccent: '#22d3ee',
    badgeBg: 'rgba(6, 182, 212, 0.15)',
    badgeText: '#22d3ee',
    glowColor: 'rgba(6, 182, 212, 0.25)',
    tagBg: '#06b6d4',
    tagText: '#04171a',
  },
  purple_matrix: {
    bgGradient: ['#0a0512', '#1a0c2e'],
    accentColor: '#a855f7',
    secondaryAccent: '#c084fc',
    badgeBg: 'rgba(168, 85, 247, 0.15)',
    badgeText: '#c084fc',
    glowColor: 'rgba(168, 85, 247, 0.25)',
    tagBg: '#a855f7',
    tagText: '#ffffff',
  },
}

export function VisualCanvasEngine({
  slides,
  singlePost,
  storyData,
  isStory = false,
  customImageUrl,
  activeSlideIndex = 0,
  onSlideChange,
  onSlideUpdate,
  onImageUpload,
}: VisualCanvasEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [copied, setCopied] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [loadedImage, setLoadedImage] = useState<HTMLImageElement | null>(null)
  const [loadedOrtaokulImg, setLoadedOrtaokulImg] = useState<HTMLImageElement | null>(null)
  const [loadedLiseImg, setLoadedLiseImg] = useState<HTMLImageElement | null>(null)

  const isCarousel = Boolean(slides && slides.length > 0)
  const currentSlide = isCarousel ? slides![activeSlideIndex] : null
  const totalSlides = isCarousel ? slides!.length : 1

  // Görsel URL değiştiğinde HTMLImageElement olarak yükle
  const effectiveImageUrl =
    currentSlide?.uploadedImageUrl || singlePost?.uploadedImageUrl || storyData?.uploadedImageUrl || customImageUrl

  useEffect(() => {
    if (!effectiveImageUrl) {
      setLoadedImage(null)
      return
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setLoadedImage(img)
    img.src = effectiveImageUrl
  }, [effectiveImageUrl])

  // Pazar Kitap Kulübü Görsellerini Yükle
  const ortaokulImgUrl = storyData?.dualBookData?.ortaokul?.imageUrl
  const liseImgUrl = storyData?.dualBookData?.lise?.imageUrl

  useEffect(() => {
    if (!ortaokulImgUrl) {
      setLoadedOrtaokulImg(null)
      return
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setLoadedOrtaokulImg(img)
    img.src = ortaokulImgUrl
  }, [ortaokulImgUrl])

  useEffect(() => {
    if (!liseImgUrl) {
      setLoadedLiseImg(null)
      return
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setLoadedLiseImg(img)
    img.src = liseImgUrl
  }, [liseImgUrl])

  // Canvas çizim fonksiyonu
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Story ise 1080x1920 (9:16), Değilse 1080x1350 (4:5)
    const width = 1080
    const height = isStory ? 1920 : 1350
    canvas.width = width
    canvas.height = height

    const themeKey = (currentSlide?.themeVariant || singlePost?.themeVariant || storyData?.themeVariant || 'lab_dark') as SlideThemeVariant
    const theme = THEME_STYLES[themeKey] || THEME_STYLES.lab_dark

    // 1. Arka Plan Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height)
    bgGrad.addColorStop(0, theme.bgGradient[0])
    bgGrad.addColorStop(1, theme.bgGradient[1])
    ctx.fillStyle = bgGrad
    ctx.fillRect(0, 0, width, height)

    // 2. Siber Izgara (Cyber Grid)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
    ctx.lineWidth = 1
    const gridSize = 60
    for (let x = 0; x < width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }
    for (let y = 0; y < height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // 3. Neon Işıma Küreleri (Glow Orbs)
    const orbGrad1 = ctx.createRadialGradient(width * 0.85, height * 0.15, 20, width * 0.85, height * 0.15, 500)
    orbGrad1.addColorStop(0, theme.glowColor)
    orbGrad1.addColorStop(1, 'transparent')
    ctx.fillStyle = orbGrad1
    ctx.fillRect(0, 0, width, height)

    const orbGrad2 = ctx.createRadialGradient(width * 0.15, height * 0.85, 20, width * 0.15, height * 0.85, 600)
    orbGrad2.addColorStop(0, 'rgba(249, 115, 22, 0.18)')
    orbGrad2.addColorStop(1, 'transparent')
    ctx.fillStyle = orbGrad2
    ctx.fillRect(0, 0, width, height)

    // 4. Kenarlık / İç Çerçeve
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.lineWidth = 2
    roundRect(ctx, 40, 40, width - 80, height - 80, 36)
    ctx.stroke()

    // 5. ÜST HEADER: DersoLab Logo ve Sayfa Sayacı
    ctx.font = 'bold 38px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('Derso', 80, 115)

    const logoGrad = ctx.createLinearGradient(190, 0, 270, 0)
    logoGrad.addColorStop(0, theme.accentColor)
    logoGrad.addColorStop(1, theme.secondaryAccent)
    ctx.fillStyle = logoGrad
    ctx.fillText('Lab', 195, 115)

    if (isStory) {
      ctx.font = 'bold 22px Inter, system-ui, sans-serif'
      ctx.fillStyle = theme.accentColor
      ctx.textAlign = 'right'
      ctx.fillText('⚡ DERSOLAB STORY', width - 80, 115)
      ctx.textAlign = 'left'
    } else if (isCarousel) {
      const pageText = `${activeSlideIndex + 1} / ${totalSlides}`
      ctx.font = 'bold 24px Inter, system-ui, sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.textAlign = 'right'
      ctx.fillText(pageText, width - 80, 115)
      ctx.textAlign = 'left'
    }

    // Üst Ayraç
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(80, 150)
    ctx.lineTo(width - 80, 150)
    ctx.stroke()

    let cursorY = 230

    // YÜKLENEN FOTOĞRAF VARSA ÇİZ
    if (loadedImage) {
      const imgBoxW = width - 160
      const imgBoxH = isStory ? 550 : 380

      ctx.save()
      roundRect(ctx, 80, cursorY, imgBoxW, imgBoxH, 24)
      ctx.clip()

      // Orantılı kaplama (object-cover)
      const hRatio = imgBoxW / loadedImage.width
      const vRatio = imgBoxH / loadedImage.height
      const ratio = Math.max(hRatio, vRatio)
      const centerShiftX = (imgBoxW - loadedImage.width * ratio) / 2
      const centerShiftY = (imgBoxH - loadedImage.height * ratio) / 2

      ctx.drawImage(
        loadedImage,
        0,
        0,
        loadedImage.width,
        loadedImage.height,
        80 + centerShiftX,
        cursorY + centerShiftY,
        loadedImage.width * ratio,
        loadedImage.height * ratio
      )
      ctx.restore()

      // Çerçeve
      ctx.strokeStyle = theme.accentColor
      ctx.lineWidth = 2
      roundRect(ctx, 80, cursorY, imgBoxW, imgBoxH, 24)
      ctx.stroke()

      cursorY += imgBoxH + 40
    }

    // ROZET (BADGE)
    const badgeText = currentSlide?.badge || singlePost?.badge || storyData?.badge || 'DERSOLAB • TAKTİK'
    ctx.font = 'bold 22px Inter, system-ui, sans-serif'
    const badgeWidth = ctx.measureText(badgeText).width + 36
    const badgeHeight = 44

    ctx.fillStyle = theme.badgeBg
    roundRect(ctx, 80, cursorY, badgeWidth, badgeHeight, 12)
    ctx.fill()
    ctx.strokeStyle = theme.accentColor
    ctx.lineWidth = 1.5
    ctx.stroke()

    ctx.fillStyle = theme.badgeText
    ctx.fillText(badgeText, 98, cursorY + 30)

    cursorY += 85

    // VURUCU BAŞLIK
    const headline =
      currentSlide?.headline || singlePost?.headline || storyData?.headline || 'Sınavda Başarıyı Getiren Strateji'
    ctx.font = '900 54px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#ffffff'
    cursorY = wrapText(ctx, headline, 80, cursorY, width - 160, 68)

    // ALT BAŞLIK
    cursorY += 20
    const subhead = currentSlide?.subhead || singlePost?.questionOrSummary || storyData?.subhead || ''
    if (subhead) {
      ctx.font = '500 28px Inter, system-ui, sans-serif'
      ctx.fillStyle = 'rgba(226, 232, 240, 0.85)'
      cursorY = wrapText(ctx, subhead, 80, cursorY, width - 160, 42)
    }

    cursorY += 40

    // STORY ÇIKARTMASI (STORY MODUNDA İSE)
    if (isStory && storyData) {
      if (storyData.dualBookData) {
        cursorY = drawDualBookStoryCards(
          ctx,
          storyData,
          cursorY,
          width,
          height,
          theme,
          loadedOrtaokulImg,
          loadedLiseImg
        )
      } else {
        cursorY = drawStorySticker(ctx, storyData, cursorY, width, theme)
      }
    } else if (isCarousel && currentSlide?.bodyPoints && currentSlide.bodyPoints.length > 0) {
      // CAROUSEL MADDELERİ
      currentSlide.bodyPoints.forEach((point, idx) => {
        const cardY = cursorY
        const cardHeight = 105

        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
        roundRect(ctx, 80, cardY, width - 160, cardHeight, 20)
        ctx.fill()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
        ctx.lineWidth = 1
        ctx.stroke()

        ctx.fillStyle = theme.accentColor
        ctx.beginPath()
        ctx.arc(130, cardY + cardHeight / 2, 22, 0, Math.PI * 2)
        ctx.fill()

        ctx.font = 'bold 22px Inter, system-ui, sans-serif'
        ctx.fillStyle = '#0f172a'
        ctx.textAlign = 'center'
        ctx.fillText(String(idx + 1), 130, cardY + cardHeight / 2 + 8)
        ctx.textAlign = 'left'

        ctx.font = '600 25px Inter, system-ui, sans-serif'
        ctx.fillStyle = '#f8fafc'
        wrapText(ctx, point, 180, cardY + 45, width - 290, 34, 2)

        cursorY += cardHeight + 18
      })
    } else if (singlePost?.options && singlePost.options.length > 0) {
      // ÇOKTAN SEÇMELİ POST
      singlePost.options.forEach((opt) => {
        const cardY = cursorY
        const cardHeight = 82

        ctx.fillStyle = opt.isCorrect ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 255, 255, 0.03)'
        roundRect(ctx, 80, cardY, width - 160, cardHeight, 16)
        ctx.fill()
        ctx.strokeStyle = opt.isCorrect ? '#22c55e' : 'rgba(255, 255, 255, 0.08)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        ctx.fillStyle = opt.isCorrect ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'
        roundRect(ctx, 95, cardY + 16, 50, 50, 12)
        ctx.fill()

        ctx.font = 'bold 24px Inter, system-ui, sans-serif'
        ctx.fillStyle = opt.isCorrect ? '#052e16' : '#ffffff'
        ctx.textAlign = 'center'
        ctx.fillText(opt.key, 120, cardY + 49)
        ctx.textAlign = 'left'

        ctx.font = '500 24px Inter, system-ui, sans-serif'
        ctx.fillStyle = '#f8fafc'
        wrapText(ctx, opt.text, 170, cardY + 49, width - 280, 30, 1)

        cursorY += cardHeight + 14
      })
    }

    // ALT VURGU ETİKETİ (Story harici)
    if (!isStory) {
      const tagText = currentSlide?.highlightTag || singlePost?.keyTakeaway || 'LİNK BİYODA'
      if (tagText) {
        ctx.font = '900 20px Inter, system-ui, sans-serif'
        const tagW = ctx.measureText(tagText).width + 36
        const tagH = 44
        const tagY = height - 190

        ctx.fillStyle = theme.tagBg
        roundRect(ctx, 80, tagY, tagW, tagH, 12)
        ctx.fill()

        ctx.fillStyle = theme.tagText
        ctx.fillText(tagText, 98, tagY + 29)
      }
    }

    // 7. ALT FOOTER
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(80, height - 125)
    ctx.lineTo(width - 80, height - 125)
    ctx.stroke()

    ctx.font = '600 22px Inter, system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.fillText('@dersolabegitim', 80, height - 75)

    const footerRightText = isStory
      ? 'Yanıt Gönder 💬'
      : isCarousel && activeSlideIndex < totalSlides - 1
        ? 'Kaydır 👉'
        : 'Profildeki Linke Tıkla 🦊'
    ctx.font = 'bold 22px Inter, system-ui, sans-serif'
    ctx.fillStyle = theme.accentColor
    ctx.textAlign = 'right'
    ctx.fillText(footerRightText, width - 80, height - 75)
  }, [
    currentSlide,
    singlePost,
    storyData,
    isStory,
    activeSlideIndex,
    totalSlides,
    isCarousel,
    loadedImage,
    loadedOrtaokulImg,
    loadedLiseImg,
  ])

  useEffect(() => {
    renderCanvas()
  }, [renderCanvas])

  // Story Çıkartması Çizici
  function drawStorySticker(
    ctx: CanvasRenderingContext2D,
    story: StoryData,
    cursorY: number,
    width: number,
    theme: any
  ): number {
    const cardW = width - 160
    const stickerType = story.stickerType || 'quiz'

    if (stickerType === 'quiz') {
      // Instagram Quiz Çıkartması
      const options = story.stickerOptions || ['A Seçeneği', 'B Seçeneği', 'C Seçeneği', 'D Seçeneği']
      const cardH = 140 + options.length * 75

      // Beyaz / Neon kart tabanı
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
      roundRect(ctx, 80, cursorY, cardW, cardH, 28)
      ctx.fill()
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
      ctx.shadowBlur = 30

      // Quiz Başlığı
      ctx.font = 'bold 28px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#0f172a'
      wrapText(ctx, story.stickerQuestion || 'Sence doğru cevap hangisi?', 115, cursorY + 60, cardW - 70, 36, 2)

      let optY = cursorY + 120
      options.forEach((opt, idx) => {
        ctx.fillStyle = idx === 0 ? 'rgba(59, 130, 246, 0.12)' : 'rgba(241, 245, 249, 0.9)'
        roundRect(ctx, 115, optY, cardW - 70, 60, 16)
        ctx.fill()
        ctx.strokeStyle = idx === 0 ? '#3b82f6' : 'rgba(203, 213, 225, 0.8)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Harf dairesi
        ctx.fillStyle = idx === 0 ? '#3b82f6' : '#94a3b8'
        ctx.beginPath()
        ctx.arc(148, optY + 30, 16, 0, Math.PI * 2)
        ctx.fill()

        ctx.font = 'bold 18px Inter, system-ui, sans-serif'
        ctx.fillStyle = '#ffffff'
        ctx.textAlign = 'center'
        ctx.fillText(['A', 'B', 'C', 'D'][idx] || String(idx + 1), 148, optY + 36)
        ctx.textAlign = 'left'

        ctx.font = '600 22px Inter, system-ui, sans-serif'
        ctx.fillStyle = '#1e293b'
        ctx.fillText(opt, 180, optY + 37)

        optY += 72
      })

      return cursorY + cardH + 30
    }

    if (stickerType === 'poll') {
      // Instagram Anket Çıkartması (2 Şıklı)
      const cardH = 210
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
      roundRect(ctx, 80, cursorY, cardW, cardH, 28)
      ctx.fill()

      ctx.font = 'bold 28px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#0f172a'
      ctx.textAlign = 'center'
      ctx.fillText(story.stickerQuestion || 'Bu taktiği denemende deneyecek misin?', width / 2, cursorY + 65)
      ctx.textAlign = 'left'

      const btnW = (cardW - 80) / 2
      // Evet
      ctx.fillStyle = '#10b981'
      roundRect(ctx, 110, cursorY + 105, btnW, 70, 20)
      ctx.fill()
      ctx.font = 'bold 24px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.fillText('Evet! 🔥', 110 + btnW / 2, cursorY + 148)

      // Hayır / Kararsız
      ctx.fillStyle = '#64748b'
      roundRect(ctx, 110 + btnW + 20, cursorY + 105, btnW, 70, 20)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.fillText('Henüz Değil 🤔', 110 + btnW + 20 + btnW / 2, cursorY + 148)
      ctx.textAlign = 'left'

      return cursorY + cardH + 30
    }

    // Link Çıkartması
    const cardH = 100
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    roundRect(ctx, width / 2 - 220, cursorY + 40, 440, cardH, 28)
    ctx.fill()
    ctx.strokeStyle = '#38bdf8'
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.font = 'bold 26px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#0284c7'
    ctx.textAlign = 'center'
    ctx.fillText(`🔗 ${story.stickerLinkText || 'dersolab.com'} ↗`, width / 2, cursorY + 102)
    ctx.textAlign = 'left'

    return cursorY + cardH + 60
  }

  // Pazar Kitap Önerisi (Ortaokul + Lise Çift Kart) Çizici
  function drawDualBookStoryCards(
    ctx: CanvasRenderingContext2D,
    story: StoryData,
    cursorY: number,
    width: number,
    height: number,
    theme: any,
    loadedOrtaokulImg?: HTMLImageElement | null,
    loadedLiseImg?: HTMLImageElement | null
  ): number {
    const { ortaokul, lise } = story.dualBookData!
    const cardW = width - 160 // 920px
    const cardH = 370

    // 1. ORTAOKUL & LGS KARTI (Cyan/Mavi Neon Vurgu)
    const card1Y = cursorY
    ctx.save()
    ctx.fillStyle = 'rgba(6, 182, 212, 0.08)'
    roundRect(ctx, 80, card1Y, cardW, cardH, 26)
    ctx.fill()
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)'
    ctx.lineWidth = 2
    ctx.stroke()

    if (loadedOrtaokulImg) {
      // 📷 GÖRSEL MODU (Kitap Kapağı)
      const imgX = 110
      const imgY = card1Y + 25
      const imgW = 215
      const imgH = 320

      // 3D Gölge ve Kapak Çizimi
      ctx.save()
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)'
      ctx.shadowBlur = 25
      ctx.shadowOffsetX = 8
      ctx.shadowOffsetY = 10
      roundRect(ctx, imgX, imgY, imgW, imgH, 16)
      ctx.clip()

      const r = Math.max(imgW / loadedOrtaokulImg.width, imgH / loadedOrtaokulImg.height)
      const sw = imgW / r
      const sh = imgH / r
      const sx = (loadedOrtaokulImg.width - sw) / 2
      const sy = (loadedOrtaokulImg.height - sh) / 2
      ctx.drawImage(loadedOrtaokulImg, sx, sy, sw, sh, imgX, imgY, imgW, imgH)
      ctx.restore()

      // Çerçeve
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)'
      ctx.lineWidth = 2
      roundRect(ctx, imgX, imgY, imgW, imgH, 16)
      ctx.stroke()

      // Kitap Sırtı Parlaması
      const spineGrad = ctx.createLinearGradient(imgX, imgY, imgX + 18, imgY)
      spineGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)')
      spineGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = spineGrad
      roundRect(ctx, imgX, imgY, 18, imgH, 16)
      ctx.fill()

      // Sağ Taraf Metin ve Rozetler
      const rightX = 355
      const rightW = cardW - 275

      ctx.fillStyle = '#0891b2'
      roundRect(ctx, rightX, card1Y + 28, 290, 34, 10)
      ctx.fill()
      ctx.font = '900 15px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.fillText('📘 ' + (ortaokul.highlightTag || 'ORTAOKUL & LGS (10-14 YAŞ)'), rightX + 14, card1Y + 51)

      ctx.font = 'bold 36px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#ffffff'
      wrapText(ctx, ortaokul.title, rightX, card1Y + 110, rightW, 40, 2)

      ctx.font = '600 21px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#38bdf8'
      ctx.fillText(`Yazar: ${ortaokul.author}`, rightX, card1Y + 168)

      if (ortaokul.genre) {
        ctx.font = '500 18px Inter, system-ui, sans-serif'
        ctx.fillStyle = '#94a3b8'
        ctx.fillText(`Tür: ${ortaokul.genre}`, rightX, card1Y + 198)
      }

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(rightX, card1Y + 218)
      ctx.lineTo(rightX + rightW, card1Y + 218)
      ctx.stroke()

      // Vurgu Kutusu
      ctx.fillStyle = 'rgba(6, 182, 212, 0.12)'
      roundRect(ctx, rightX, card1Y + 236, rightW, 82, 14)
      ctx.fill()
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.font = '600 18px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#e2e8f0'
      wrapText(
        ctx,
        ortaokul.whyRead || 'LGS yeni nesil paragraf sorularında hız ve dikkat süresini geliştirir ⚡',
        rightX + 16,
        card1Y + 268,
        rightW - 32,
        25,
        2
      )
    } else {
      // 📝 METİN MODU (Görsel henüz yoksa)
      ctx.fillStyle = '#0891b2'
      roundRect(ctx, 110, card1Y + 26, 320, 36, 10)
      ctx.fill()
      ctx.font = '900 16px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.fillText('📘 ' + (ortaokul.highlightTag || 'ORTAOKUL & LGS (10-14 YAŞ)'), 125, card1Y + 50)

      ctx.font = 'bold 36px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.fillText(ortaokul.title, 110, card1Y + 105)

      ctx.font = '600 21px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#38bdf8'
      ctx.fillText(`Yazar: ${ortaokul.author}${ortaokul.genre ? ` • ${ortaokul.genre}` : ''}`, 110, card1Y + 142)

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(110, card1Y + 165)
      ctx.lineTo(110 + cardW - 60, card1Y + 165)
      ctx.stroke()

      ctx.font = 'bold 18px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('🎯 LGS Paragraf & Odaklanma Katkısı:', 110, card1Y + 198)

      ctx.font = '500 22px Inter, system-ui, sans-serif'
      ctx.fillStyle = 'rgba(241, 245, 249, 0.95)'
      wrapText(ctx, ortaokul.whyRead || 'Kitap kapağı yüklemek için sağdaki çekmeceden görsel ekleyin.', 110, card1Y + 234, cardW - 60, 32, 3)
    }
    ctx.restore()

    // 2. LİSE & YKS KARTI (Turuncu/Amber Neon Vurgu)
    const card2Y = card1Y + cardH + 28
    ctx.save()
    ctx.fillStyle = 'rgba(249, 115, 22, 0.08)'
    roundRect(ctx, 80, card2Y, cardW, cardH, 26)
    ctx.fill()
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.5)'
    ctx.lineWidth = 2
    ctx.stroke()

    if (loadedLiseImg) {
      // 📷 GÖRSEL MODU (Kitap Kapağı)
      const imgX = 110
      const imgY = card2Y + 25
      const imgW = 215
      const imgH = 320

      // 3D Gölge ve Kapak Çizimi
      ctx.save()
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)'
      ctx.shadowBlur = 25
      ctx.shadowOffsetX = 8
      ctx.shadowOffsetY = 10
      roundRect(ctx, imgX, imgY, imgW, imgH, 16)
      ctx.clip()

      const r = Math.max(imgW / loadedLiseImg.width, imgH / loadedLiseImg.height)
      const sw = imgW / r
      const sh = imgH / r
      const sx = (loadedLiseImg.width - sw) / 2
      const sy = (loadedLiseImg.height - sh) / 2
      ctx.drawImage(loadedLiseImg, sx, sy, sw, sh, imgX, imgY, imgW, imgH)
      ctx.restore()

      // Çerçeve
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.6)'
      ctx.lineWidth = 2
      roundRect(ctx, imgX, imgY, imgW, imgH, 16)
      ctx.stroke()

      // Kitap Sırtı Parlaması
      const spineGrad = ctx.createLinearGradient(imgX, imgY, imgX + 18, imgY)
      spineGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)')
      spineGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')
      ctx.fillStyle = spineGrad
      roundRect(ctx, imgX, imgY, 18, imgH, 16)
      ctx.fill()

      // Sağ Taraf Metin ve Rozetler
      const rightX = 355
      const rightW = cardW - 275

      ctx.fillStyle = '#ea580c'
      roundRect(ctx, rightX, card2Y + 28, 270, 34, 10)
      ctx.fill()
      ctx.font = '900 15px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.fillText('📕 ' + (lise.highlightTag || 'LİSE & YKS (14-18 YAŞ)'), rightX + 14, card2Y + 51)

      ctx.font = 'bold 36px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#ffffff'
      wrapText(ctx, lise.title, rightX, card2Y + 110, rightW, 40, 2)

      ctx.font = '600 21px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#fb923c'
      ctx.fillText(`Yazar: ${lise.author}`, rightX, card2Y + 168)

      if (lise.genre) {
        ctx.font = '500 18px Inter, system-ui, sans-serif'
        ctx.fillStyle = '#94a3b8'
        ctx.fillText(`Tür: ${lise.genre}`, rightX, card2Y + 198)
      }

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(rightX, card2Y + 218)
      ctx.lineTo(rightX + rightW, card2Y + 218)
      ctx.stroke()

      // Vurgu Kutusu
      ctx.fillStyle = 'rgba(249, 115, 22, 0.12)'
      roundRect(ctx, rightX, card2Y + 236, rightW, 82, 14)
      ctx.fill()
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.25)'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.font = '600 18px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#e2e8f0'
      wrapText(
        ctx,
        lise.whyRead || 'TYT derin anlama ve AYT edebiyat tahlil gücü kazandırır ✨',
        rightX + 16,
        card2Y + 268,
        rightW - 32,
        25,
        2
      )
    } else {
      // 📝 METİN MODU (Görsel henüz yoksa)
      ctx.fillStyle = '#ea580c'
      roundRect(ctx, 110, card2Y + 26, 290, 36, 10)
      ctx.fill()
      ctx.font = '900 16px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.fillText('📕 ' + (lise.highlightTag || 'LİSE & YKS (14-18 YAŞ)'), 125, card2Y + 50)

      ctx.font = 'bold 36px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.fillText(lise.title, 110, card2Y + 105)

      ctx.font = '600 21px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#fb923c'
      ctx.fillText(`Yazar: ${lise.author}${lise.genre ? ` • ${lise.genre}` : ''}`, 110, card2Y + 142)

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(110, card2Y + 165)
      ctx.lineTo(110 + cardW - 60, card2Y + 165)
      ctx.stroke()

      ctx.font = 'bold 18px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('🎯 YKS Derin Anlama & Analiz Katkısı:', 110, card2Y + 198)

      ctx.font = '500 22px Inter, system-ui, sans-serif'
      ctx.fillStyle = 'rgba(241, 245, 249, 0.95)'
      wrapText(ctx, lise.whyRead || 'Kitap kapağı yüklemek için sağdaki çekmeceden görsel ekleyin.', 110, card2Y + 234, cardW - 60, 32, 3)
    }
    ctx.restore()

    // 3. İNTERAKTİF ANKET / OYLAMA ÇIKARTMASI
    const pollY = card2Y + cardH + 28
    const pollH = 175

    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)'
    roundRect(ctx, 80, pollY, cardW, pollH, 26)
    ctx.fill()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.35)'
    ctx.shadowBlur = 20

    ctx.font = 'bold 24px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#0f172a'
    ctx.textAlign = 'center'
    ctx.fillText(story.stickerQuestion || 'Bu hafta hangisini okuyacaksın? 📚', width / 2, pollY + 44)

    const btnW = (cardW - 60) / 2

    // Ortaokul Oylama Butonu
    ctx.fillStyle = '#0284c7'
    roundRect(ctx, 100, pollY + 74, btnW, 68, 18)
    ctx.fill()
    ctx.font = 'bold 20px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#ffffff'
    const opt1 = (story.stickerOptions && story.stickerOptions[0]) || `📘 ${ortaokul.title}`
    ctx.fillText(opt1, 100 + btnW / 2, pollY + 115)

    // Lise Oylama Butonu
    ctx.fillStyle = '#ea580c'
    roundRect(ctx, 100 + btnW + 20, pollY + 74, btnW, 68, 18)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    const opt2 = (story.stickerOptions && story.stickerOptions[1]) || `📕 ${lise.title}`
    ctx.fillText(opt2, 100 + btnW + 20 + btnW / 2, pollY + 115)
    ctx.textAlign = 'left'

    return pollY + pollH + 30
  }

  // Metin Sarmalama
  function wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number = 5
  ): number {
    const words = text.split(' ')
    let line = ''
    let lineCount = 0

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' '
      const metrics = ctx.measureText(testLine)
      const testWidth = metrics.width
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, y)
        line = words[n] + ' '
        y += lineHeight
        lineCount++
        if (lineCount >= maxLines) {
          ctx.fillText(line.trim() + '...', x, y)
          return y + lineHeight
        }
      } else {
        line = testLine
      }
    }
    ctx.fillText(line.trim(), x, y)
    return y + lineHeight
  }

  function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number
  ) {
    ctx.beginPath()
    ctx.moveTo(x + radius, y)
    ctx.lineTo(x + width - radius, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
    ctx.lineTo(x + width, y + height - radius)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
    ctx.lineTo(x + radius, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
    ctx.lineTo(x, y + radius)
    ctx.quadraticCurveTo(x, y, x + radius, y)
    ctx.closePath()
  }

  // Görsel Yükleme İşleyicisi
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Lütfen geçerli bir resim dosyası seçin.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      if (base64) {
        onImageUpload?.(base64)
        toast.success('Fotoğraf başarıyla şablona eklendi!')
      }
    }
    reader.readAsDataURL(file)
  }

  // PNG İndirme
  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    setIsExporting(true)
    try {
      const imageUri = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      const fileName = `dersolab_${isStory ? 'story' : isCarousel ? `slide_${activeSlideIndex + 1}` : 'post'}_${Date.now()}.png`
      link.download = fileName
      link.href = imageUri
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success(
        `Görsel başarıyla ${isStory ? '1080x1920 (Story)' : '1080x1350 (Post)'} PNG olarak indirildi!`
      )
    } catch {
      toast.error('Görsel indirilemedi.')
    } finally {
      setIsExporting(false)
    }
  }

  // Panoya Kopyalama
  async function handleCopy() {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
        setCopied(true)
        toast.success('Görsel panoya kopyalandı!')
        setTimeout(() => setCopied(false), 2500)
      })
    } catch {
      toast.error('Panoya kopyalama desteklenmiyor. Lütfen "İndir" butonunu kullanın.')
    }
  }

  // Tema Değiştirme
  function cycleTheme() {
    if (!isCarousel || !currentSlide || !onSlideUpdate) return
    const themes: SlideThemeVariant[] = ['lab_dark', 'neon_orange', 'cyan_cyber', 'purple_matrix']
    const currentIndex = themes.indexOf(currentSlide.themeVariant)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    onSlideUpdate(activeSlideIndex, {
      ...currentSlide,
      themeVariant: nextTheme,
    })
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* Gizli Dosya Seçici */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Üst Kontrol Barı */}
      <div className="flex items-center justify-between w-full max-w-[420px] px-2">
        <div className="flex items-center gap-2">
          {isStory ? (
            <div className="flex items-center gap-1.5 bg-purple-500/15 border border-purple-500/30 rounded-xl px-3 py-1.5 text-xs font-bold text-purple-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Story (9:16)</span>
            </div>
          ) : isCarousel ? (
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-300">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                Slayt {activeSlideIndex + 1} / {totalSlides}
              </span>
            </div>
          ) : null}

          {/* Görsel Yükle Butonu */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors"
            title="Kendi görselinizi / soru fotoğrafınızı yükleyin"
          >
            <Upload className="w-3.5 h-3.5 text-blue-400" />
            <span>Fotoğraf Ekle</span>
          </button>

          {isCarousel && onSlideUpdate && (
            <button
              onClick={cycleTheme}
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors"
              title="Temayı Değiştir"
            >
              <Palette className="w-3.5 h-3.5 text-orange-400" />
              <span>Tema</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-200 transition-all hover:scale-105 active:scale-95"
            title="Panoya Kopyala"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
            <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl px-3.5 py-1.5 text-xs font-bold shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all hover:scale-105 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>İndir (PNG)</span>
          </button>
        </div>
      </div>

      {/* Canvas Çerçevesi (Story ise 9:16, Post ise 4:5) */}
      <div
        className={`relative group w-full max-w-[420px] ${
          isStory ? 'aspect-[9/16]' : 'aspect-[4/5]'
        } rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/15 bg-black`}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain select-none"
          style={{ imageRendering: 'auto' }}
        />

        {/* Carousel Navigasyon Okları */}
        {isCarousel && totalSlides > 1 && (
          <>
            {activeSlideIndex > 0 && (
              <button
                onClick={() => onSlideChange?.(activeSlideIndex - 1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-transform active:scale-90"
                aria-label="Önceki Slayt"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {activeSlideIndex < totalSlides - 1 && (
              <button
                onClick={() => onSlideChange?.(activeSlideIndex + 1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-transform active:scale-90"
                aria-label="Sonraki Slayt"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Slayt Nokta Göstergesi */}
      {isCarousel && totalSlides > 1 && (
        <div className="flex items-center gap-1.5">
          {slides!.map((_, i) => (
            <button
              key={i}
              onClick={() => onSlideChange?.(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeSlideIndex ? 'w-6 bg-orange-500' : 'w-2 bg-white/20 hover:bg-white/40'
              }`}
              aria-label={`Slayt ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
