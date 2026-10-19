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
  Wand2,
  X,
  Loader2,
  Trash2,
} from 'lucide-react'
import type { CarouselSlide, ImageStylePreset, SinglePostData, SlideThemeVariant, StoryData } from '@/types/social'
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
  emerald_glow: {
    bgGradient: ['#030708', '#071317'],
    accentColor: '#10b981',
    secondaryAccent: '#06b6d4',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    badgeText: '#34d399',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    tagBg: '#10b981',
    tagText: '#021e14',
  },
  grok_cyber: {
    bgGradient: ['#030708', '#071317'],
    accentColor: '#10b981',
    secondaryAccent: '#06b6d4',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    badgeText: '#34d399',
    glowColor: 'rgba(16, 185, 129, 0.35)',
    tagBg: '#10b981',
    tagText: '#021e14',
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
  const [loadedLogo, setLoadedLogo] = useState<HTMLImageElement | null>(null)
  const [loadedOrtaokulImg, setLoadedOrtaokulImg] = useState<HTMLImageElement | null>(null)
  const [loadedLiseImg, setLoadedLiseImg] = useState<HTMLImageElement | null>(null)

  // AI Görsel Üretici & Marka Modalı Durumları
  const [isAiModalOpen, setIsAiModalOpen] = useState(false)
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiStylePreset, setAiStylePreset] = useState<ImageStylePreset>('cyber_lab')
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)

  const isCarousel = Boolean(slides && slides.length > 0)
  const currentSlide = isCarousel ? slides![activeSlideIndex] : null
  const totalSlides = isCarousel ? slides!.length : 1

  async function handleGenerateAiImage() {
    const promptToUse =
      aiPrompt.trim() ||
      currentSlide?.headline ||
      singlePost?.headline ||
      storyData?.headline ||
      'DersoLab Eğitici Bilimsel İllüstrasyon'

    setIsGeneratingImage(true)
    try {
      const res = await fetch('/api/admin/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_image',
          prompt: promptToUse,
          stylePreset: aiStylePreset,
          aspectRatio: isStory ? '9:16' : '1:1',
          subject: currentSlide?.badge || singlePost?.badge,
          slideNumber: isCarousel ? activeSlideIndex + 1 : 1,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.imageUrl) {
        throw new Error(data.error || 'Görsel üretilemedi.')
      }

      onImageUpload?.(data.imageUrl)
      if (isCarousel && onSlideUpdate && currentSlide) {
        onSlideUpdate(activeSlideIndex, {
          ...currentSlide,
          uploadedImageUrl: data.imageUrl,
          aiImagePrompt: promptToUse,
        })
      }

      toast.success('Yapay zeka görseli başarıyla üretildi ve slayta yerleştirildi!')
      setIsAiModalOpen(false)
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Görsel üretilirken bir hata oluştu.')
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // Görsel URL: Carousel modunda sadece kapak slaytı (slide 0) veya bu slayta özel atanmış görseli göster
  const effectiveImageUrl = isCarousel
    ? currentSlide?.uploadedImageUrl || (activeSlideIndex === 0 ? customImageUrl : undefined)
    : (singlePost?.uploadedImageUrl || storyData?.uploadedImageUrl || customImageUrl)

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

  // DersoLab Resmi Logo / Tilki Başlığı Yükle
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => setLoadedLogo(img)
    img.src = '/fox-head.png'
  }, [])

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
    let logoStartX = 80
    if (loadedLogo) {
      // Resmi DersoLab Tilki Başlığı Logo İkonu
      ctx.drawImage(loadedLogo, 80, 76, 44, 44)
      logoStartX = 136
    }

    ctx.font = 'bold 38px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('Derso', logoStartX, 114)

    const dersoW = ctx.measureText('Derso').width
    const labX = logoStartX + dersoW + 4

    const logoGrad = ctx.createLinearGradient(labX, 0, labX + 80, 0)
    logoGrad.addColorStop(0, theme.accentColor)
    logoGrad.addColorStop(1, theme.secondaryAccent)
    ctx.fillStyle = logoGrad
    ctx.fillText('Lab', labX, 114)

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

    // 6. İÇERİK ALANI (Akıllı ve Dinamik Boyutlandırma Motoru)
    let cursorY = 175
    const hasImage = Boolean(loadedImage)
    const hasPoints = Boolean(isCarousel && currentSlide?.bodyPoints && currentSlide.bodyPoints.length > 0)
    const hasOptions = Boolean(singlePost?.options && singlePost.options.length > 0)

    // YÜKLENEN / ÜRETİLEN GÖRSEL VARSA ÇİZ
    if (loadedImage) {
      const imgBoxW = width - 160
      // Eğer slayt içinde maddeler veya şıklar varsa görsel yüksekliğini dengeli tutuyoruz (275px)
      // Böylece alt metinler, maddeler ve footer birbirine ASLA basmaz
      const imgBoxH = isStory ? 520 : (hasPoints || hasOptions ? 275 : 350)

      ctx.save()
      roundRect(ctx, 80, cursorY, imgBoxW, imgBoxH, 22)
      ctx.clip()

      // Akıllı ölçekleme: 1:1 diyagramlar veya kare şemalar için contain, dikey/yatay fotoğraflar için cover
      const isSquareOrDiagram = Math.abs(loadedImage.width - loadedImage.height) < 120
      const ratio = isSquareOrDiagram
        ? Math.min(imgBoxW / loadedImage.width, (imgBoxH - 16) / loadedImage.height)
        : Math.max(imgBoxW / loadedImage.width, imgBoxH / loadedImage.height)

      const centerShiftX = (imgBoxW - loadedImage.width * ratio) / 2
      const centerShiftY = (imgBoxH - loadedImage.height * ratio) / 2

      // Görsel arka planı için koyu nötr taban
      ctx.fillStyle = '#05070c'
      ctx.fillRect(80, cursorY, imgBoxW, imgBoxH)

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

      // Görsel dış çerçevesi ve neon vurgusu
      ctx.strokeStyle = theme.accentColor
      ctx.lineWidth = 1.5
      roundRect(ctx, 80, cursorY, imgBoxW, imgBoxH, 22)
      ctx.stroke()

      cursorY += imgBoxH + 20
    }

    // ROZET & VURGU ETİKETİ SATIRI
    const badgeText = currentSlide?.badge || singlePost?.badge || storyData?.badge || 'DERSOLAB • TAKTİK'
    const highlightTag = currentSlide?.highlightTag || (!isStory ? singlePost?.keyTakeaway : '')
    const badgeY = cursorY
    const badgeH = 38

    // Sol Rozet: Kategori / Konu
    ctx.font = 'bold 20px Inter, system-ui, sans-serif'
    const badgeW = ctx.measureText(badgeText).width + 32
    ctx.fillStyle = theme.badgeBg
    roundRect(ctx, 80, badgeY, badgeW, badgeH, 10)
    ctx.fill()
    ctx.strokeStyle = theme.accentColor
    ctx.lineWidth = 1.5
    ctx.stroke()
    ctx.fillStyle = theme.badgeText
    ctx.fillText(badgeText, 96, badgeY + 25)

    // Sağ Vurgu Rozeti (KAYDETMELİK, +NET, vb. - Varsa Aynı Hizada Sağa Yerleştir)
    if (highlightTag && !isStory && highlightTag.length <= 25) {
      ctx.font = '900 18px Inter, system-ui, sans-serif'
      const tagW = ctx.measureText(highlightTag).width + 32
      const tagX = width - 80 - tagW

      ctx.fillStyle = theme.tagBg
      roundRect(ctx, tagX, badgeY, tagW, badgeH, 10)
      ctx.fill()

      ctx.fillStyle = theme.tagText
      ctx.fillText(highlightTag, tagX + 16, badgeY + 25)
    }

    cursorY += badgeH + 20

    // VURUCU BAŞLIK (Resim varsa daha kompakt, resim yoksa daha büyük ve ferah)
    const headline =
      currentSlide?.headline || singlePost?.headline || storyData?.headline || 'Sınavda Başarıyı Getiren Strateji'
    const headlineFontSize = hasImage ? 42 : 50
    const headlineLineHeight = hasImage ? 52 : 62

    // Canvas alphabetic baseline'da ilk satır yukarı taşmasın ve rozetle çakışmasın diye font yüksekliğini ekliyoruz
    cursorY += Math.round(headlineFontSize * 0.85)

    ctx.font = `900 ${headlineFontSize}px Inter, system-ui, sans-serif`
    ctx.fillStyle = '#ffffff'
    cursorY = wrapText(ctx, headline, 80, cursorY, width - 160, headlineLineHeight, 2)

    // ALT BAŞLIK (varsa)
    const subhead = currentSlide?.subhead || singlePost?.questionOrSummary || storyData?.subhead || ''
    if (subhead) {
      const subheadFontSize = hasImage ? 23 : 26
      const subheadLineHeight = hasImage ? 32 : 36
      cursorY += 12 + Math.round(subheadFontSize * 0.85)
      ctx.font = `500 ${subheadFontSize}px Inter, system-ui, sans-serif`
      ctx.fillStyle = 'rgba(226, 232, 240, 0.85)'
      cursorY = wrapText(ctx, subhead, 80, cursorY, width - 160, subheadLineHeight, 2)
    }

    cursorY += 22

    // Güvenli İçerik Alt Sınırı (Footer çizgisinin 20px yukarısı)
    const safeContentBottom = height - 130
    const availableSpace = safeContentBottom - cursorY

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
      // CAROUSEL MADDELERİ (DİNAMİK ADAPTİF YÜKSEKLİK VE SIFIR ÇAKIŞMA)
      const points = currentSlide.bodyPoints
      const count = points.length

      const gap = count > 3 ? 10 : 14
      const totalGaps = (count - 1) * gap
      const rawCardH = Math.floor((availableSpace - totalGaps) / count)

      // Görsel varken max 78px, görsel yokken max 98px; minimum 56px
      const maxCardH = hasImage ? (count > 3 ? 66 : 78) : (count > 3 ? 84 : 98)
      const cardHeight = Math.min(maxCardH, Math.max(56, rawCardH))
      const isCompact = cardHeight < 72

      points.forEach((point, idx) => {
        const cardY = cursorY
        const radius = isCompact ? 14 : 18

        // Kart Arka Planı
        ctx.fillStyle = 'rgba(255, 255, 255, 0.035)'
        roundRect(ctx, 80, cardY, width - 160, cardHeight, radius)
        ctx.fill()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
        ctx.lineWidth = 1
        ctx.stroke()

        // Sıra Numarası Rozeti (Daire)
        const circleR = isCompact ? 18 : 22
        const circleX = 80 + 16 + circleR
        const circleY = cardY + cardHeight / 2

        ctx.fillStyle = theme.accentColor
        ctx.beginPath()
        ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2)
        ctx.fill()

        ctx.font = `bold ${isCompact ? 17 : 20}px Inter, system-ui, sans-serif`
        ctx.fillStyle = '#0f172a'
        ctx.textAlign = 'center'
        ctx.fillText(String(idx + 1), circleX, circleY + (isCompact ? 6 : 7))
        ctx.textAlign = 'left'

        // Madde Metni
        const textX = circleX + circleR + 16
        const textW = width - 80 - textX - 16
        const textFontSize = isCompact ? 21 : 24
        const textLineH = isCompact ? 28 : 32

        ctx.font = `600 ${textFontSize}px Inter, system-ui, sans-serif`
        ctx.fillStyle = '#f8fafc'
        wrapText(
          ctx,
          point,
          textX,
          cardY + (cardHeight - textLineH) / 2 + (isCompact ? 20 : 22),
          textW,
          textLineH,
          isCompact ? 1 : 2
        )

        cursorY += cardHeight + gap
      })
    } else if (singlePost?.options && singlePost.options.length > 0) {
      // ÇOKTAN SEÇMELİ POST (DİNAMİK ADAPTİF ŞIKLAR)
      const opts = singlePost.options
      const count = opts.length
      const gap = 12
      const totalGaps = (count - 1) * gap
      const rawCardH = Math.floor((availableSpace - totalGaps) / count)
      const cardHeight = Math.min(hasImage ? 68 : 82, Math.max(50, rawCardH))
      const isCompact = cardHeight < 64

      opts.forEach((opt) => {
        const cardY = cursorY

        ctx.fillStyle = opt.isCorrect ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 255, 255, 0.03)'
        roundRect(ctx, 80, cardY, width - 160, cardHeight, 14)
        ctx.fill()
        ctx.strokeStyle = opt.isCorrect ? '#22c55e' : 'rgba(255, 255, 255, 0.08)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        const boxSize = isCompact ? 36 : 46
        const boxY = cardY + (cardHeight - boxSize) / 2
        ctx.fillStyle = opt.isCorrect ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'
        roundRect(ctx, 95, boxY, boxSize, boxSize, 10)
        ctx.fill()

        ctx.font = `bold ${isCompact ? 19 : 23}px Inter, system-ui, sans-serif`
        ctx.fillStyle = opt.isCorrect ? '#052e16' : '#ffffff'
        ctx.textAlign = 'center'
        ctx.fillText(opt.key, 95 + boxSize / 2, boxY + boxSize * 0.72)
        ctx.textAlign = 'left'

        ctx.font = `500 ${isCompact ? 20 : 23}px Inter, system-ui, sans-serif`
        ctx.fillStyle = '#f8fafc'
        wrapText(ctx, opt.text, 100 + boxSize + 16, cardY + cardHeight * 0.62, width - 260 - boxSize, 28, 1)

        cursorY += cardHeight + gap
      })
    } else if (!isStory && singlePost?.keyTakeaway && (!singlePost.options || singlePost.options.length === 0)) {
      // Tekil Post Özet Notu / Püf Nokta Kartı
      const cardW = width - 160
      const boxY = cursorY + 10
      ctx.fillStyle = 'rgba(249, 115, 22, 0.08)'
      roundRect(ctx, 80, boxY, cardW, 115, 18)
      ctx.fill()
      ctx.strokeStyle = theme.accentColor
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.font = 'bold 20px Inter, system-ui, sans-serif'
      ctx.fillStyle = theme.accentColor
      ctx.fillText('💡 PÜF NOKTA & DERSOLAB NOTU', 105, boxY + 40)

      ctx.font = '500 23px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#f8fafc'
      wrapText(ctx, singlePost.keyTakeaway, 105, boxY + 76, cardW - 50, 30, 2)
    }

    // 7. ALT FOOTER
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(80, height - 110)
    ctx.lineTo(width - 80, height - 110)
    ctx.stroke()

    ctx.font = '600 20px Inter, system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.65)'
    ctx.fillText('@dersolabegitim  •  🛡️ ÖSYM KAZANIM ONAYLI', 80, height - 62)

    const footerRightText = isStory
      ? 'Yanıt Gönder 💬'
      : isCarousel && activeSlideIndex < totalSlides - 1
        ? 'Kaydır 👉'
        : 'Profildeki Linke Tıkla 🦊'
    ctx.font = 'bold 22px Inter, system-ui, sans-serif'
    ctx.fillStyle = theme.accentColor
    ctx.textAlign = 'right'
    ctx.fillText(footerRightText, width - 80, height - 62)
  }, [
    currentSlide,
    singlePost,
    storyData,
    isStory,
    activeSlideIndex,
    totalSlides,
    isCarousel,
    loadedImage,
    loadedLogo,
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
    const themes: SlideThemeVariant[] = ['lab_dark', 'neon_orange', 'cyan_cyber', 'purple_matrix', 'emerald_glow']
    const currentIndex = themes.indexOf(currentSlide.themeVariant)
    const nextTheme = themes[(currentIndex + 1) % themes.length]
    onSlideUpdate(activeSlideIndex, {
      ...currentSlide,
      themeVariant: nextTheme,
    })
  }

  // Tüm Slaytları Sırayla İndirme
  async function handleDownloadAll() {
    if (!isCarousel || !slides || slides.length === 0) return
    setIsExporting(true)
    toast.info(`Tüm slaytlar (${slides.length} adet) sırayla indiriliyor...`)

    try {
      const originalIndex = activeSlideIndex
      for (let i = 0; i < slides.length; i++) {
        onSlideChange?.(i)
        await new Promise((r) => setTimeout(r, 220))
        const canvas = canvasRef.current
        if (canvas) {
          const imageUri = canvas.toDataURL('image/png')
          const link = document.createElement('a')
          link.download = `dersolab_carousel_slayt_${i + 1}_${Date.now()}.png`
          link.href = imageUri
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
      onSlideChange?.(originalIndex)
      toast.success(`Tüm ${slides.length} slayt başarıyla indirildi!`)
    } catch {
      toast.error('Toplu indirme sırasında bir hata oluştu.')
    } finally {
      setIsExporting(false)
    }
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
            <span>Fotoğraf</span>
          </button>

          {/* AI Görsel Üret Butonu */}
          <button
            onClick={() => {
              const defaultP = currentSlide?.headline || singlePost?.headline || storyData?.headline || ''
              setAiPrompt(defaultP)
              setIsAiModalOpen(true)
            }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-500/40 text-purple-300 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(168,85,247,0.2)]"
            title="Yapay zeka ile bu slayt/içerik için özel görsel üret"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Görsel</span>
          </button>

          {/* Resmi Maskot & Logo Arşivi Butonu */}
          <button
            onClick={() => setIsBrandModalOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 border border-orange-500/40 text-orange-300 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(249,115,22,0.2)]"
            title="DersoLab resmi maskot (siber tilki, bilge baykuş) ve logo arşivinden görsel seç"
          >
            <span className="text-xs">🦊</span>
            <span>Maskot / Logo</span>
          </button>

          {/* Görsel Kaldır Butonu (Varsa) */}
          {Boolean(effectiveImageUrl) && (
            <button
              onClick={() => {
                onImageUpload?.('')
                if (isCarousel && onSlideUpdate && currentSlide) {
                  onSlideUpdate(activeSlideIndex, { ...currentSlide, uploadedImageUrl: undefined })
                }
                toast.success('Görsel kaldırıldı.')
              }}
              className="p-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-colors"
              title="Slayt görselini kaldır"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {isCarousel && onSlideUpdate && (
            <button
              onClick={cycleTheme}
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors"
              title="Temayı Değiştir (Emerald Glow, Lab Dark, Neon Orange, Cyan Cyber, Purple Matrix)"
            >
              <Palette className="w-3.5 h-3.5 text-orange-400" />
              <span>Tema</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-200 transition-all hover:scale-105 active:scale-95"
            title="Panoya Kopyala"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
            <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl px-3 py-1.5 text-xs font-bold shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all hover:scale-105 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>İndir</span>
          </button>
          {isCarousel && totalSlides > 1 && (
            <button
              onClick={handleDownloadAll}
              disabled={isExporting}
              className="flex items-center gap-1 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 rounded-xl px-2.5 py-1.5 text-[11px] font-bold transition-all hover:scale-105 active:scale-95"
              title="Tüm slaytları PNG olarak seri indir"
            >
              <Download className="w-3 h-3" />
              <span>Tüm ({totalSlides})</span>
            </button>
          )}
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

      </div>

      {/* Slayt Alt Navigasyon & Nokta Barı (İçeriği örtmez, butonlar temiz dışarıdadır) */}
      {isCarousel && totalSlides > 1 && (
        <div className="flex items-center justify-between w-full max-w-[420px] px-2 pt-1">
          <button
            onClick={() => onSlideChange?.(Math.max(0, activeSlideIndex - 1))}
            disabled={activeSlideIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-all hover:scale-105 active:scale-95"
            aria-label="Önceki Slayt"
          >
            <ChevronLeft className="w-4 h-4 text-orange-400" />
            <span>Önceki</span>
          </button>

          <div className="flex items-center gap-1.5">
            {slides!.map((_, i) => (
              <button
                key={i}
                onClick={() => onSlideChange?.(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeSlideIndex
                    ? 'w-6 bg-gradient-to-r from-orange-500 to-amber-500'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Slayt ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => onSlideChange?.(Math.min(totalSlides - 1, activeSlideIndex + 1))}
            disabled={activeSlideIndex === totalSlides - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-all hover:scale-105 active:scale-95"
            aria-label="Sonraki Slayt"
          >
            <span>Sonraki</span>
            <ChevronRight className="w-4 h-4 text-orange-400" />
          </button>
        </div>
      )}

      {/* AI GÖRSEL ÜRETİCİ MODAL */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#0f111a] border border-purple-500/30 shadow-[0_20px_70px_rgba(168,85,247,0.3)] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Wand2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Yapay Zeka ile Görsel Üret</h3>
                  <p className="text-[11px] text-slate-400">
                    {isStory ? 'Story (9:16) formatında' : 'Slayt & Post (1:1) formatında'} özel illüstrasyon üretir
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAiModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Prompt Girişi */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Görsel Konusu / Prompt</label>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Örn: TYT Fizik optik prizma ışık kırılması, türev grafiği ve teğet eğimi, biyonik hızlı okuma gözü..."
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 resize-none"
              />
            </div>

            {/* Stil Seçimi */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Görsel İllüstrasyon Stili</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'cyber_lab', label: '🔮 Cyber Lab', desc: 'Neon & 3D Lab' },
                  { id: 'scientific_diagram', label: '📐 Bilimsel Şema', desc: 'Optik, Formül, Eğri' },
                  { id: 'minimal_vector', label: '🎨 Vektör Sanatı', desc: 'Modern & Düz' },
                  { id: 'realistic_study', label: '📸 Çalışma Odası', desc: 'Masa, Kitap, Odak' },
                  { id: 'mascot_fox', label: '🦊 Zeki Tilki', desc: 'DersoLab Maskotu' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setAiStylePreset(st.id as ImageStylePreset)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      aiStylePreset === st.id
                        ? 'bg-purple-500/20 border-purple-400 text-white shadow-md'
                        : 'bg-white/5 border-white/5 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span className="text-xs font-bold block">{st.label}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">{st.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Aksiyon Butonları */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsAiModalOpen(false)}
                className="px-3 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5"
              >
                Vazgeç
              </button>
              <button
                type="button"
                disabled={isGeneratingImage}
                onClick={handleGenerateAiImage}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all disabled:opacity-50"
              >
                {isGeneratingImage ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Görsel Üretiliyor...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Görseli Üret &amp; Slayta Ekle</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESMİ MASCOT & MARKA MODALI */}
      {isBrandModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0b0f19] border border-orange-500/30 shadow-[0_20px_70px_rgba(249,115,22,0.3)] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <span className="text-base">🦊</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">DersoLab Resmi Maskot &amp; Logo Arşivi</h3>
                  <p className="text-[11px] text-slate-400">
                    Orijinal yüksek çözünürlüklü marka ve karakter varlıklarını tek tıkla slayta yerleştirin
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBrandModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Varlık Kartları Izgarası */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'mascot-student',
                  title: 'Siber Tilki (Öğrenci Maskotu)',
                  subtitle: 'Ultra HD siber neon tilki karakteri. AYT/TYT taktikleri için ideal.',
                  url: '/mascot-student.jpg',
                  tag: 'Önerilen • Ultra HD',
                  tagColor: 'border-orange-500/40 bg-orange-500/10 text-orange-300',
                },
                {
                  id: 'fox-mascot',
                  title: 'Piksel Tilki (Tam Boy)',
                  subtitle: 'DersoLab resmi tam boy piksel sanat maskotu.',
                  url: '/fox-mascot.png',
                  tag: 'Piksel Sanatı',
                  tagColor: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
                },
                {
                  id: 'fox-mascot-icon',
                  title: 'Piksel Tilki İkonu (Şeffaf)',
                  subtitle: 'Kare şeffaf arka planlı sevimli piksel tilki ikonu.',
                  url: '/fox-mascot-icon.png',
                  tag: 'Şeffaf İkon',
                  tagColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
                },
                {
                  id: 'fox-head',
                  title: 'Derso Tilki Kafası (Logo)',
                  subtitle: 'Navbar ve marka başlığı için kullanılan resmi logo rozeti.',
                  url: '/fox-head.png',
                  tag: 'Marka Rozeti',
                  tagColor: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
                },
                {
                  id: 'mascot-instructor',
                  title: 'Siber Bilge Baykuş (Eğitmen)',
                  subtitle: 'Gözlüklü siber baykuş, öğretmen ve rehberlik mentörü.',
                  url: '/mascot-instructor.jpg',
                  tag: 'Mentör & Eğitmen',
                  tagColor: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
                },
                {
                  id: 'dersolab-modern-logo',
                  title: 'DersoLab Modern Logo Banner',
                  subtitle: 'Modern tipografi ve gradyanlı yatay marka logosu.',
                  url: '/dersolab-modern-logo.png',
                  tag: 'Logo Banner',
                  tagColor: 'border-pink-500/40 bg-pink-500/10 text-pink-300',
                },
                {
                  id: 'dersolab-lab-logo',
                  title: 'DersoLab Laboratuvar Logosu',
                  subtitle: 'Siber neon laboratuvar marka amblemi.',
                  url: '/dersolab-lab-logo.png',
                  tag: 'Lab Amblem',
                  tagColor: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
                },
              ].map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => {
                    onImageUpload?.(asset.url)
                    if (isCarousel && onSlideUpdate && currentSlide) {
                      onSlideUpdate(activeSlideIndex, {
                        ...currentSlide,
                        uploadedImageUrl: asset.url,
                      })
                    }
                    setIsBrandModalOpen(false)
                    toast.success(`${asset.title} slayta yerleştirildi!`)
                  }}
                  className="group relative flex flex-col p-3 rounded-2xl bg-white/5 hover:bg-orange-500/10 border border-white/10 hover:border-orange-500/40 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="relative w-full h-32 rounded-xl overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center p-2 mb-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={asset.url}
                      alt={asset.title}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-md ${asset.tagColor}`}>
                      {asset.tag}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors">
                    {asset.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">
                    {asset.subtitle}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-end border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsBrandModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:bg-white/5"
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
