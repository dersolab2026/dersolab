import type {
  CarouselSlide,
  SinglePostData,
  StoryData,
  ReelsStoryboard,
  SlideThemeVariant,
  SocialPostItem,
} from '@/types/social'
import { toTurkishTitleCase } from './agent'

export interface RenderSlideOptions {
  isStory?: boolean
  isCarousel?: boolean
  isReels?: boolean
  activeSlideIndex?: number
  totalSlides?: number
  currentSlide?: CarouselSlide | null
  singlePost?: SinglePostData | null
  storyData?: StoryData | null
  reelsStoryboard?: ReelsStoryboard | null
  postTitle?: string
  postCaption?: string
  customImageUrl?: string
  themeVariant?: SlideThemeVariant
  preloadedImages?: {
    logo?: HTMLImageElement | null
    mainImage?: HTMLImageElement | null
    ortaokulImg?: HTMLImageElement | null
    liseImg?: HTMLImageElement | null
  }
}

export const THEME_STYLES: Record<
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

/**
 * Yuvarlatılmış dikdörtgen çizer
 */
export function roundRect(
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

/**
 * Metni verilen genişliğe göre satırlara bölerek çizer
 */
export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines: number = 5
): number {
  if (!text) return y
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

/**
 * Görselleri CORS güvenli bir şekilde yükler
 */
export function loadImageSafely(src?: string): Promise<HTMLImageElement | null> {
  if (!src) return Promise.resolve(null)
  return new Promise((resolve) => {
    const img = new Image()
    if (!src.startsWith('data:') && !src.startsWith('blob:')) {
      img.crossOrigin = 'anonymous'
    }
    img.onload = () => resolve(img)
    img.onerror = () => {
      // CORS hatası olursa null dön, çizim akışını bozma
      resolve(null)
    }
    img.src = src
  })
}

/**
 * Instagram Story test/anket/link çıkartması çizer
 */
function drawStorySticker(
  ctx: CanvasRenderingContext2D,
  story: StoryData,
  cursorY: number,
  width: number
): number {
  const cardW = width - 160
  const stickerType = story.stickerType || 'none'

  if (stickerType === 'none') {
    return cursorY
  }

  if (stickerType === 'quiz') {
    const options = story.stickerOptions || ['A Seçeneği', 'B Seçeneği', 'C Seçeneği', 'D Seçeneği']
    const cardH = 140 + options.length * 75

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    roundRect(ctx, 80, cursorY, cardW, cardH, 28)
    ctx.fill()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
    ctx.shadowBlur = 30

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
    const cardH = 210
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
    roundRect(ctx, 80, cursorY, cardW, cardH, 28)
    ctx.fill()

    ctx.font = 'bold 28px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#0f172a'
    ctx.textAlign = 'center'
    ctx.fillText(story.stickerQuestion || 'Bu taktiği denemende deneyecek misin?', width / 2, cursorY + 65)
    ctx.textAlign = 'left'

    const optLeft = (story.stickerOptions && story.stickerOptions[0]) || 'Evet! 🔥'
    const optRight = (story.stickerOptions && story.stickerOptions[1]) || 'Henüz Değil 🤔'

    const btnW = (cardW - 80) / 2
    ctx.fillStyle = '#10b981'
    roundRect(ctx, 110, cursorY + 105, btnW, 70, 20)
    ctx.fill()
    ctx.font = 'bold 24px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.textAlign = 'center'
    ctx.fillText(optLeft, 110 + btnW / 2, cursorY + 148)

    ctx.fillStyle = '#64748b'
    roundRect(ctx, 110 + btnW + 20, cursorY + 105, btnW, 70, 20)
    ctx.fill()
    ctx.fillStyle = '#ffffff'
    ctx.fillText(optRight, 110 + btnW + 20 + btnW / 2, cursorY + 148)
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

/**
 * Pazar Kitap Önerisi (Ortaokul + Lise Çift Kart) Çizici
 */
function drawDualBookStoryCards(
  ctx: CanvasRenderingContext2D,
  story: StoryData,
  cursorY: number,
  width: number,
  loadedOrtaokulImg?: HTMLImageElement | null,
  loadedLiseImg?: HTMLImageElement | null
): number {
  const { ortaokul, lise } = story.dualBookData!
  const cardW = width - 160
  const cardH = 370

  // 1. ORTAOKUL & LGS KARTI
  const card1Y = cursorY
  ctx.save()
  ctx.fillStyle = 'rgba(6, 182, 212, 0.08)'
  roundRect(ctx, 80, card1Y, cardW, cardH, 26)
  ctx.fill()
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.45)'
  ctx.lineWidth = 2
  ctx.stroke()

  if (loadedOrtaokulImg) {
    const imgX = 110
    const imgY = card1Y + 25
    const imgW = 215
    const imgH = 320

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

    ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)'
    ctx.lineWidth = 2
    roundRect(ctx, imgX, imgY, imgW, imgH, 16)
    ctx.stroke()

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
    wrapText(ctx, ortaokul.whyRead || 'Kitap kapağı için görsel ekleyebilirsiniz.', 110, card1Y + 234, cardW - 60, 32, 3)
  }
  ctx.restore()

  // 2. LİSE & YKS KARTI
  const card2Y = card1Y + cardH + 28
  ctx.save()
  ctx.fillStyle = 'rgba(249, 115, 22, 0.08)'
  roundRect(ctx, 80, card2Y, cardW, cardH, 26)
  ctx.fill()
  ctx.strokeStyle = 'rgba(249, 115, 22, 0.5)'
  ctx.lineWidth = 2
  ctx.stroke()

  if (loadedLiseImg) {
    const imgX = 110
    const imgY = card2Y + 25
    const imgW = 215
    const imgH = 320

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

    ctx.strokeStyle = 'rgba(249, 115, 22, 0.6)'
    ctx.lineWidth = 2
    roundRect(ctx, imgX, imgY, imgW, imgH, 16)
    ctx.stroke()

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
    wrapText(ctx, lise.whyRead || 'Kitap kapağı için görsel ekleyebilirsiniz.', 110, card2Y + 234, cardW - 60, 32, 3)
  }
  ctx.restore()

  // 3. ÇIKARTMA (YALNIZCA KULLANICI SEÇTİYSE ÇİZİLİR - ZORUNLU ANKET/QUIZ YOK)
  if (!story.stickerType || story.stickerType === 'none') {
    return card2Y + cardH + 30
  }

  if (story.stickerType === 'quiz' || story.stickerType === 'link') {
    return drawStorySticker(ctx, story, card2Y + cardH + 28, width)
  }

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
  ctx.fillStyle = '#0284c7'
  roundRect(ctx, 100, pollY + 74, btnW, 68, 18)
  ctx.fill()
  ctx.font = 'bold 20px Inter, system-ui, sans-serif'
  ctx.fillStyle = '#ffffff'
  const opt1 = (story.stickerOptions && story.stickerOptions[0]) || `📘 ${ortaokul.title}`
  ctx.fillText(opt1, 100 + btnW / 2, pollY + 115)

  ctx.fillStyle = '#ea580c'
  roundRect(ctx, 100 + btnW + 20, pollY + 74, btnW, 68, 18)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  const opt2 = (story.stickerOptions && story.stickerOptions[1]) || `📕 ${lise.title}`
  ctx.fillText(opt2, 100 + btnW + 20 + btnW / 2, pollY + 115)
  ctx.textAlign = 'left'

  return pollY + pollH + 30
}

/**
 * Belirli bir slaytı veya gönderiyi verilen Canvas üzerine 1080p tam çözünürlükte çizer
 */
export async function renderSlideToCanvas(
  canvas: HTMLCanvasElement,
  options: RenderSlideOptions
): Promise<void> {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const {
    isStory = false,
    isCarousel = false,
    isReels = false,
    activeSlideIndex = 0,
    totalSlides = 1,
    currentSlide,
    singlePost,
    storyData,
    reelsStoryboard,
    postTitle,
    postCaption,
    customImageUrl,
    themeVariant,
    preloadedImages,
  } = options

  // Story veya Reels ise 1080x1920 (9:16), Değilse 1080x1350 (4:5)
  const width = 1080
  const height = isStory || isReels ? 1920 : 1350
  canvas.width = width
  canvas.height = height

  // Tema seçimi
  const themeKey = (
    themeVariant ||
    currentSlide?.themeVariant ||
    singlePost?.themeVariant ||
    storyData?.themeVariant ||
    'lab_dark'
  ) as SlideThemeVariant
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

  // 3. Neon Işıma Küreleri
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

  // Gerekli görselleri yükle veya preloaded olanları kullan
  const loadedLogo =
    preloadedImages?.logo !== undefined ? preloadedImages.logo : await loadImageSafely('/fox-head.png')

  const rawImageUrl = isCarousel
    ? currentSlide?.uploadedImageUrl || (activeSlideIndex === 0 ? customImageUrl : undefined)
    : isReels
      ? reelsStoryboard?.uploadedImageUrl || customImageUrl
      : singlePost?.uploadedImageUrl || storyData?.uploadedImageUrl || customImageUrl

  // Eski /mascot-student.jpg önbelleğini resmi DersoLab maskotu ile otomatik değiştir
  const effectiveImageUrl = rawImageUrl === '/mascot-student.jpg' ? '/fox-mascot-520.png' : rawImageUrl

  const loadedImage =
    preloadedImages?.mainImage !== undefined ? preloadedImages.mainImage : await loadImageSafely(effectiveImageUrl)

  const loadedOrtaokulImg =
    preloadedImages?.ortaokulImg !== undefined
      ? preloadedImages.ortaokulImg
      : await loadImageSafely(storyData?.dualBookData?.ortaokul?.imageUrl)

  const loadedLiseImg =
    preloadedImages?.liseImg !== undefined
      ? preloadedImages.liseImg
      : await loadImageSafely(storyData?.dualBookData?.lise?.imageUrl)

  // 5. ÜST HEADER: DersoLab Logo ve Sayfa Sayacı
  let logoStartX = 80
  if (loadedLogo) {
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
  } else if (isReels) {
    ctx.font = 'bold 22px Inter, system-ui, sans-serif'
    ctx.fillStyle = theme.accentColor
    ctx.textAlign = 'right'
    ctx.fillText('🎬 REELS & TIKTOK', width - 80, 115)
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

  // 6. İÇERİK ALANI
  let cursorY = 175
  const isMascotAsset = Boolean(
    effectiveImageUrl &&
      (/(?:fox-mascot|fox-head|mascot-icon|zeki|maskot)/i.test(effectiveImageUrl) ||
        (effectiveImageUrl.startsWith('data:image/svg') && effectiveImageUrl.includes('mascotHalo')))
  )
  const hasPoints = Boolean(isCarousel && currentSlide?.bodyPoints && currentSlide.bodyPoints.length > 0)
  const hasOptions = Boolean(singlePost?.options && singlePost.options.length > 0)
  // Carousel kapak veya içerik slaytlarında maddeler (bodyPoints) varken görsel kutusu maddeleri ve başlığı ezeceğinden görsel çizilmez.
  // Yalnızca maddesiz slaytlarda (tam sayfa diyagram/infografik slaytı) veya single/story post ise görsel çizilir.
  const hasImage =
    Boolean(loadedImage) &&
    !isMascotAsset &&
    (!isCarousel || !hasPoints || !currentSlide?.bodyPoints || currentSlide.bodyPoints.length <= 1)

  // YÜKLENEN / ÜRETİLEN GÖRSEL VARSA ÇİZ
  if (hasImage && loadedImage) {
    const imgBoxW = width - 160
    const imgBoxH = isStory ? 520 : isReels ? 420 : hasPoints || hasOptions ? 275 : 350

    ctx.save()
    roundRect(ctx, 80, cursorY, imgBoxW, imgBoxH, 22)
    ctx.clip()

    const isSquareOrDiagram = Math.abs(loadedImage.width - loadedImage.height) < 120
    const ratio = isSquareOrDiagram
      ? Math.min(imgBoxW / loadedImage.width, (imgBoxH - 16) / loadedImage.height)
      : Math.max(imgBoxW / loadedImage.width, imgBoxH / loadedImage.height)

    const centerShiftX = (imgBoxW - loadedImage.width * ratio) / 2
    const centerShiftY = (imgBoxH - loadedImage.height * ratio) / 2

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

    ctx.strokeStyle = theme.accentColor
    ctx.lineWidth = 1.5
    roundRect(ctx, 80, cursorY, imgBoxW, imgBoxH, 22)
    ctx.stroke()

    cursorY += imgBoxH + 20
  }

  // ROZET & VURGU ETİKETİ
  const rawBadge =
    currentSlide?.badge ||
    singlePost?.badge ||
    storyData?.badge ||
    (isReels ? 'REELS • 9:16 VİDEO' : 'DERSOLAB • TAKTİK')
  const badgeText = rawBadge.toLocaleUpperCase('tr-TR')

  const rawTag =
    currentSlide?.highlightTag || (!isStory && !isReels ? singlePost?.keyTakeaway : '') || ''
  const highlightTag = rawTag.length <= 25 ? rawTag.toLocaleUpperCase('tr-TR') : ''

  const badgeY = cursorY
  const badgeH = 38

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

  if (highlightTag && !isStory && !isReels && highlightTag.length <= 25) {
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

  // BAŞLIK
  const rawHeadline =
    currentSlide?.headline ||
    singlePost?.headline ||
    storyData?.headline ||
    postTitle ||
    'Sınavda Başarıyı Getiren Strateji'
  const headline = toTurkishTitleCase(rawHeadline)

  const headlineFontSize = hasImage ? (isStory || isReels ? 46 : 42) : isStory || isReels ? 56 : 50
  const headlineLineHeight = hasImage ? (isStory || isReels ? 58 : 52) : isStory || isReels ? 68 : 62

  cursorY += Math.round(headlineFontSize * 0.85)
  ctx.font = `900 ${headlineFontSize}px Inter, system-ui, sans-serif`
  ctx.fillStyle = '#ffffff'
  cursorY = wrapText(ctx, headline, 80, cursorY, width - 160, headlineLineHeight, 2)

  // ALT BAŞLIK
  const subhead =
    currentSlide?.subhead ||
    singlePost?.questionOrSummary ||
    storyData?.subhead ||
    (postCaption && !isReels ? postCaption.split('\n')[0].slice(0, 100) : '')
  if (subhead) {
    const subheadFontSize = hasImage ? 23 : 26
    const subheadLineHeight = hasImage ? 32 : 36
    cursorY += 12 + Math.round(subheadFontSize * 0.85)
    ctx.font = `500 ${subheadFontSize}px Inter, system-ui, sans-serif`
    ctx.fillStyle = 'rgba(226, 232, 240, 0.85)'
    cursorY = wrapText(ctx, subhead, 80, cursorY, width - 160, subheadLineHeight, 2)
  }

  cursorY += 22

  const safeContentBottom = height - 130
  const availableSpace = safeContentBottom - cursorY

  // STORY MODU
  if (isStory && storyData) {
    if (storyData.dualBookData) {
      cursorY = drawDualBookStoryCards(ctx, storyData, cursorY, width, loadedOrtaokulImg, loadedLiseImg)
    } else {
      cursorY = drawStorySticker(ctx, storyData, cursorY, width)
    }
  } else if (isReels && reelsStoryboard) {
    // REELS POSTER MODU (1080x1920)
    const cardW = width - 160

    // 3 Saniye Kancası Kartı (Vurgulu Turuncu / Amber)
    ctx.fillStyle = 'rgba(249, 115, 22, 0.12)'
    roundRect(ctx, 80, cursorY, cardW, 130, 20)
    ctx.fill()
    ctx.strokeStyle = '#f97316'
    ctx.lineWidth = 1.5
    ctx.stroke()

    ctx.font = '900 18px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#f97316'
    ctx.fillText('🎬 3 SANİYE VİRAL KANCASI (HOOK)', 105, cursorY + 36)

    ctx.font = 'bold 24px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#ffffff'
    wrapText(ctx, reelsStoryboard.hook3s || 'İlk 3 saniye kancası...', 105, cursorY + 72, cardW - 50, 32, 2)

    cursorY += 150

    // Ekranda Beliren Metinler (Sazan Tuzakları / İpuçları)
    if (reelsStoryboard.onScreenText && reelsStoryboard.onScreenText.length > 0) {
      ctx.font = 'bold 18px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#38bdf8'
      ctx.fillText('⚡ EKRANDA BELİREN VURGULAR:', 80, cursorY + 8)
      cursorY += 28

      const tags = reelsStoryboard.onScreenText
      const tagH = tags.length > 4 ? 42 : 48
      const gap = tags.length > 4 ? 8 : 10

      tags.forEach((tag, idx) => {
        ctx.fillStyle = idx === 0 ? 'rgba(249, 115, 22, 0.15)' : 'rgba(255, 255, 255, 0.04)'
        roundRect(ctx, 80, cursorY, cardW, tagH, 12)
        ctx.fill()
        ctx.strokeStyle = idx === 0 ? '#f97316' : 'rgba(255, 255, 255, 0.1)'
        ctx.lineWidth = idx === 0 ? 1.5 : 1
        ctx.stroke()

        ctx.font = `bold ${tags.length > 4 ? 17 : 19}px Inter, system-ui, sans-serif`
        ctx.fillStyle = idx === 0 ? '#fb923c' : '#f8fafc'
        ctx.fillText(`• ${tag}`, 105, cursorY + Math.round(tagH / 2) + 6)
        cursorY += tagH + gap
      })
    }

    // Seslendirme / Dublaj Metni (Varsa)
    if (reelsStoryboard.spokenScript) {
      cursorY += 8
      const scriptH = 96
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
      roundRect(ctx, 80, cursorY, cardW, scriptH, 14)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)'
      ctx.lineWidth = 1
      ctx.stroke()

      ctx.font = 'bold 15px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#94a3b8'
      ctx.fillText('🎙️ SESLENDİRME & ANLATIM METNİ:', 105, cursorY + 28)

      ctx.font = '500 18px Inter, system-ui, sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'
      wrapText(ctx, reelsStoryboard.spokenScript, 105, cursorY + 54, cardW - 50, 24, 2)
      cursorY += scriptH + 10
    }

    // Çağrı Kutusu (CTA)
    if (reelsStoryboard.callToAction) {
      cursorY += 6
      ctx.fillStyle = 'rgba(16, 185, 129, 0.14)'
      roundRect(ctx, 80, cursorY, cardW, 74, 16)
      ctx.fill()
      ctx.strokeStyle = '#10b981'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.font = 'bold 19px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#34d399'
      wrapText(ctx, `🚀 ${reelsStoryboard.callToAction}`, 105, cursorY + 44, cardW - 50, 26, 1)
    }
  } else if (isCarousel && currentSlide?.bodyPoints && currentSlide.bodyPoints.length > 0) {
    // CAROUSEL MADDELERİ
    const points = currentSlide.bodyPoints
    const count = points.length

    const gap = count > 3 ? 10 : 14
    const totalGaps = (count - 1) * gap
    const rawCardH = Math.floor((availableSpace - totalGaps) / count)
    const maxCardH = hasImage ? (count > 3 ? 66 : 78) : count > 3 ? 84 : 98
    const cardHeight = Math.min(maxCardH, Math.max(56, rawCardH))
    const isCompact = cardHeight < 72

    points.forEach((point, idx) => {
      const cardY = cursorY
      const radius = isCompact ? 14 : 18

      ctx.fillStyle = 'rgba(255, 255, 255, 0.035)'
      roundRect(ctx, 80, cardY, width - 160, cardHeight, radius)
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.lineWidth = 1
      ctx.stroke()

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
    // ÇOKTAN SEÇMELİ POST
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
  } else if (!isStory && !isReels && singlePost?.keyTakeaway) {
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
    : isReels
      ? 'Fox ile Dinle 🦊⚡'
      : isCarousel && activeSlideIndex < totalSlides - 1
        ? 'Kaydır 👉'
        : 'Profildeki Linke Tıkla 🦊'

  ctx.font = 'bold 22px Inter, system-ui, sans-serif'
  ctx.fillStyle = theme.accentColor
  ctx.textAlign = 'right'
  ctx.fillText(footerRightText, width - 80, height - 62)
}

/**
 * Tek bir slaytı veya görseli offscreen canvas kullanarak PNG Data URL olarak dışa aktarır
 */
export async function exportSlideDataUrl(options: RenderSlideOptions): Promise<string> {
  if (typeof document === 'undefined') {
    throw new Error('Canvas export sadece tarayıcı ortamında desteklenir.')
  }

  const canvas = document.createElement('canvas')
  try {
    await renderSlideToCanvas(canvas, options)
    return canvas.toDataURL('image/png')
  } catch (err) {
    // Tainted canvas (CORS) durumunda dış görseli çizmeden temiz bir kopya üret
    console.warn('Canvas toDataURL CORS koruması devreye girdi, harici görsel hariç tutularak tekrar çiziliyor...', err)
    const fallbackCanvas = document.createElement('canvas')
    await renderSlideToCanvas(fallbackCanvas, {
      ...options,
      customImageUrl: undefined,
      preloadedImages: {
        logo: null,
        mainImage: null,
      },
    })
    return fallbackCanvas.toDataURL('image/png')
  }
}

/**
 * Bir indirme bağlantısını tetikler
 */
export function triggerDownload(urlOrData: string, filename: string) {
  if (typeof document === 'undefined') return
  const link = document.createElement('a')
  link.href = urlOrData
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Gönderinin TÜM görsellerini (Carousel slaytları, Story, Post veya Reels)
 * 1080p yüksek çözünürlüklü PNG formatında sırayla oluşturur ve Data URL listesi döner.
 */
export async function generateAllPostMediaFiles(
  post: SocialPostItem,
  onProgress?: (current: number, total: number) => void
): Promise<{ filename: string; dataUrl: string }[]> {
  if (!post) return []

  const exportedFiles: { filename: string; dataUrl: string }[] = []

  if (post.type === 'carousel' && post.carouselSlides && post.carouselSlides.length > 0) {
    const slides = post.carouselSlides
    const total = slides.length

    for (let i = 0; i < total; i++) {
      onProgress?.(i + 1, total)
      const slide = slides[i]
      const dataUrl = await exportSlideDataUrl({
        isCarousel: true,
        isStory: false,
        activeSlideIndex: i,
        totalSlides: total,
        currentSlide: slide,
        postTitle: post.title,
        customImageUrl: post.uploadedImageUrl,
      })
      exportedFiles.push({
        filename: `dersolab_slayt_${i + 1}.png`,
        dataUrl,
      })
    }
  } else if (post.type === 'story' || (Boolean(post.storyData) && post.type !== 'carousel')) {
    onProgress?.(1, 1)
    const dataUrl = await exportSlideDataUrl({
      isStory: true,
      storyData: post.storyData,
      postTitle: post.title,
      postCaption: post.caption,
      customImageUrl: post.storyData?.uploadedImageUrl || post.uploadedImageUrl,
    })
    exportedFiles.push({
      filename: `dersolab_story.png`,
      dataUrl,
    })
  } else if (post.type === 'reels' || Boolean(post.reelsStoryboard)) {
    onProgress?.(1, 1)
    const dataUrl = await exportSlideDataUrl({
      isReels: true,
      reelsStoryboard: post.reelsStoryboard,
      postTitle: post.title,
      postCaption: post.caption,
      customImageUrl: post.reelsStoryboard?.uploadedImageUrl || post.uploadedImageUrl,
    })
    exportedFiles.push({
      filename: `dersolab_reels_kapak.png`,
      dataUrl,
    })
    if (post.uploadedImageUrl && post.uploadedImageUrl.startsWith('data:')) {
      exportedFiles.push({
        filename: `dersolab_reels_vektor_cizim.png`,
        dataUrl: post.uploadedImageUrl,
      })
    }
  } else {
    // Single Post veya fallback
    onProgress?.(1, 1)
    const dataUrl = await exportSlideDataUrl({
      isCarousel: false,
      isStory: false,
      singlePost: post.singlePostData,
      postTitle: post.title,
      postCaption: post.caption,
      customImageUrl: post.uploadedImageUrl,
    })
    exportedFiles.push({
      filename: `dersolab_gonderi.png`,
      dataUrl,
    })
    if (post.uploadedImageUrl && post.uploadedImageUrl.startsWith('data:')) {
      exportedFiles.push({
        filename: `dersolab_gonderi_vektor_cizim.png`,
        dataUrl: post.uploadedImageUrl,
      })
    }
  }

  return exportedFiles
}

/**
 * Gönderinin TÜM görsellerini (Carousel slaytları, Story, Post veya Reels)
 * 1080p yüksek çözünürlüklü PNG formatında sırayla oluşturur ve indirir.
 */
export async function downloadAllPostMedia(
  post: SocialPostItem,
  onProgress?: (current: number, total: number) => void
): Promise<number> {
  const files = await generateAllPostMediaFiles(post, onProgress)
  if (files.length === 0) return 0

  // İndirmeleri tarayıcının engellememesi için 350ms arayla tetikle
  for (let idx = 0; idx < files.length; idx++) {
    const item = files[idx]
    triggerDownload(item.dataUrl, item.filename)
    if (idx < files.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 350))
    }
  }

  return files.length
}
