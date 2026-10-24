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
 * Metni verilen genişliğe göre satırlara ayırır (çizmeden önce satır sayısını bilmek ve ortalamak için)
 */
export function getWrappedLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number = 5
): string[] {
  if (!text) return []
  const words = text.trim().split(/\s+/)
  const lines: string[] = []
  let currentLine = ''

  for (let i = 0; i < words.length; i++) {
    const word = words[i]
    const testLine = currentLine ? `${currentLine} ${word}` : word
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
      if (lines.length >= maxLines - 1) {
        const remaining = words.slice(i).join(' ')
        let truncated = remaining
        while (truncated.length > 1 && ctx.measureText(`${truncated}...`).width > maxWidth) {
          truncated = truncated.slice(0, -1).trim()
        }
        lines.push(remaining === truncated ? truncated : `${truncated}...`)
        return lines
      }
    } else {
      currentLine = testLine
    }
  }
  if (currentLine) {
    lines.push(currentLine)
  }
  return lines.slice(0, maxLines)
}

/**
 * Tek satırlık metni verilen genişliğe sığacak şekilde fontu küçülterek (ve gerekirse ... ekleyerek) çizer
 */
function drawFittedSingleLine(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  initialFontSize: number,
  minFontSize: number = 14,
  fontWeight: string = '600',
  align: CanvasTextAlign = 'left'
) {
  if (!text) return
  ctx.save()
  ctx.textAlign = align
  let fontSize = initialFontSize
  ctx.font = `${fontWeight} ${fontSize}px Inter, system-ui, sans-serif`
  while (fontSize > minFontSize && ctx.measureText(text).width > maxWidth) {
    fontSize -= 1
    ctx.font = `${fontWeight} ${fontSize}px Inter, system-ui, sans-serif`
  }
  let finalStr = text
  if (ctx.measureText(finalStr).width > maxWidth) {
    while (finalStr.length > 1 && ctx.measureText(`${finalStr}...`).width > maxWidth) {
      finalStr = finalStr.slice(0, -1).trim()
    }
    finalStr = `${finalStr}...`
  }
  ctx.fillText(finalStr, x, y)
  ctx.restore()
}

/**
 * Buton içine metni taşmadan (1 veya 2 satır olarak ortalayarak ve clip uygulayarak) çizer
 */
function drawPollButtonText(
  ctx: CanvasRenderingContext2D,
  text: string,
  btnX: number,
  btnY: number,
  btnW: number,
  btnH: number,
  radius: number = 18
) {
  ctx.save()
  roundRect(ctx, btnX, btnY, btnW, btnH, radius)
  ctx.clip()

  const innerW = btnW - 28
  const centerX = btnX + btnW / 2
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'

  // Önce tek satırda 21px -> 17px arası sığıyor mu kontrol et
  let singleSize = 21
  ctx.font = `bold ${singleSize}px Inter, system-ui, sans-serif`
  while (singleSize > 17 && ctx.measureText(text).width > innerW) {
    singleSize -= 1
    ctx.font = `bold ${singleSize}px Inter, system-ui, sans-serif`
  }

  if (ctx.measureText(text).width <= innerW) {
    ctx.fillText(text, centerX, btnY + btnH / 2 + singleSize * 0.35)
  } else {
    // 2 satıra bölerek buton içinde dikey + yatay ortala
    ctx.font = 'bold 16px Inter, system-ui, sans-serif'
    const lines = getWrappedLines(ctx, text, innerW, 2)
    const lineH = 20
    const totalH = lines.length * lineH
    const startY = btnY + (btnH - totalH) / 2 + 15
    lines.forEach((ln, i) => {
      ctx.fillText(ln, centerX, startY + i * lineH)
    })
  }

  ctx.restore()
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
  const lines = getWrappedLines(ctx, text, maxWidth, maxLines)
  for (const ln of lines) {
    ctx.fillText(ln, x, y)
    y += lineHeight
  }
  return y
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
    const cardH = 145 + options.length * 74

    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.45)'
    ctx.shadowBlur = 26
    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)'
    roundRect(ctx, 80, cursorY, cardW, cardH, 28)
    ctx.fill()
    ctx.restore()

    ctx.font = 'bold 26px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#0f172a'
    wrapText(ctx, story.stickerQuestion || 'Sence doğru cevap hangisi?', 115, cursorY + 56, cardW - 70, 34, 2)

    let optY = cursorY + 122
    options.forEach((opt, idx) => {
      const rowX = 115
      const rowW = cardW - 70
      const rowH = 60

      ctx.fillStyle = idx === 0 ? 'rgba(59, 130, 246, 0.12)' : 'rgba(241, 245, 249, 0.92)'
      roundRect(ctx, rowX, optY, rowW, rowH, 16)
      ctx.fill()
      ctx.strokeStyle = idx === 0 ? '#3b82f6' : 'rgba(203, 213, 225, 0.85)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      ctx.fillStyle = idx === 0 ? '#3b82f6' : '#94a3b8'
      ctx.beginPath()
      ctx.arc(rowX + 33, optY + 30, 16, 0, Math.PI * 2)
      ctx.fill()

      ctx.font = 'bold 17px Inter, system-ui, sans-serif'
      ctx.fillStyle = '#ffffff'
      ctx.textAlign = 'center'
      ctx.fillText(['A', 'B', 'C', 'D'][idx] || String(idx + 1), rowX + 33, optY + 36)
      ctx.textAlign = 'left'

      ctx.fillStyle = '#1e293b'
      drawFittedSingleLine(ctx, opt, rowX + 64, optY + 37, rowW - 82, 21, 14, '600', 'left')

      optY += 72
    })

    return cursorY + cardH + 30
  }

  if (stickerType === 'poll') {
    const cardH = 200
    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)'
    ctx.shadowBlur = 24
    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)'
    roundRect(ctx, 80, cursorY, cardW, cardH, 28)
    ctx.fill()
    ctx.restore()

    ctx.fillStyle = '#0f172a'
    drawFittedSingleLine(
      ctx,
      story.stickerQuestion || 'Bu taktiği denemende deneyecek misin?',
      width / 2,
      cursorY + 58,
      cardW - 56,
      25,
      16,
      'bold',
      'center'
    )

    const optLeft = (story.stickerOptions && story.stickerOptions[0]) || 'Evet! 🔥'
    const optRight = (story.stickerOptions && story.stickerOptions[1]) || 'Henüz Değil 🤔'

    const btnW = (cardW - 72) / 2
    const leftX = 106
    const rightX = 106 + btnW + 20
    const btnY = cursorY + 96
    const btnH = 74

    ctx.fillStyle = '#10b981'
    roundRect(ctx, leftX, btnY, btnW, btnH, 20)
    ctx.fill()
    drawPollButtonText(ctx, optLeft, leftX, btnY, btnW, btnH, 20)

    ctx.fillStyle = '#64748b'
    roundRect(ctx, rightX, btnY, btnW, btnH, 20)
    ctx.fill()
    drawPollButtonText(ctx, optRight, rightX, btnY, btnW, btnH, 20)

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

  ctx.fillStyle = '#0284c7'
  drawFittedSingleLine(ctx, `🔗 ${story.stickerLinkText || 'dersolab.com'} ↗`, width / 2, cursorY + 100, 400, 25, 16, 'bold', 'center')

  return cursorY + cardH + 60
}

/**
 * Tek bir kitap kartını (Ortaokul veya Lise) kusursuz hizalama ve taşma korumasıyla çizer
 */
function drawSingleBookCard(
  ctx: CanvasRenderingContext2D,
  book: NonNullable<StoryData['dualBookData']>['ortaokul'],
  cardY: number,
  cardW: number,
  cardH: number,
  level: 'ortaokul' | 'lise',
  loadedImg?: HTMLImageElement | null
) {
  const isOrtaokul = level === 'ortaokul'
  const cardX = 80
  const pad = 26

  const cardBg = isOrtaokul ? 'rgba(6, 182, 212, 0.08)' : 'rgba(249, 115, 22, 0.08)'
  const cardBorder = isOrtaokul ? 'rgba(6, 182, 212, 0.45)' : 'rgba(249, 115, 22, 0.5)'
  const imgBorder = isOrtaokul ? 'rgba(6, 182, 212, 0.65)' : 'rgba(249, 115, 22, 0.65)'
  const pillBg = isOrtaokul ? '#0891b2' : '#ea580c'
  const authorColor = isOrtaokul ? '#38bdf8' : '#fb923c'
  const boxBg = isOrtaokul ? 'rgba(6, 182, 212, 0.12)' : 'rgba(249, 115, 22, 0.12)'
  const boxBorder = isOrtaokul ? 'rgba(6, 182, 212, 0.28)' : 'rgba(249, 115, 22, 0.28)'
  const defaultTag = isOrtaokul ? '📘 ORTAOKUL & LGS' : '📕 LİSE & YKS'

  ctx.save()
  // Dış kart çerçevesi ve taşma kilidi
  roundRect(ctx, cardX, cardY, cardW, cardH, 26)
  ctx.fillStyle = cardBg
  ctx.fill()
  ctx.strokeStyle = cardBorder
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.clip()

  const imgX = cardX + pad
  const imgY = cardY + pad
  const imgW = 212
  const imgH = cardH - pad * 2

  if (loadedImg) {
    ctx.save()
    ctx.shadowColor = 'rgba(0, 0, 0, 0.65)'
    ctx.shadowBlur = 22
    ctx.shadowOffsetX = 6
    ctx.shadowOffsetY = 8
    roundRect(ctx, imgX, imgY, imgW, imgH, 16)
    ctx.clip()

    const r = Math.max(imgW / loadedImg.width, imgH / loadedImg.height)
    const sw = imgW / r
    const sh = imgH / r
    const sx = (loadedImg.width - sw) / 2
    const sy = (loadedImg.height - sh) / 2
    ctx.drawImage(loadedImg, sx, sy, sw, sh, imgX, imgY, imgW, imgH)
    ctx.restore()

    ctx.strokeStyle = imgBorder
    ctx.lineWidth = 2
    roundRect(ctx, imgX, imgY, imgW, imgH, 16)
    ctx.stroke()
  }

  const rightX = loadedImg ? imgX + imgW + 26 : cardX + pad
  const rightW = cardX + cardW - pad - rightX

  // 1. Üst Seviye Etiketi (Dinamik genişlikli pill)
  const rawTag = book.highlightTag || defaultTag
  const tagText = rawTag.startsWith('📘') || rawTag.startsWith('📕') ? rawTag : `${isOrtaokul ? '📘' : '📕'} ${rawTag}`
  ctx.font = '800 14px Inter, system-ui, sans-serif'
  const pillW = Math.min(rightW, Math.max(180, ctx.measureText(tagText).width + 28))
  const pillH = 32
  const pillY = cardY + pad

  ctx.fillStyle = pillBg
  roundRect(ctx, rightX, pillY, pillW, pillH, 10)
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  drawFittedSingleLine(ctx, tagText, rightX + 14, pillY + 21, pillW - 24, 14, 11, '800', 'left')

  // 2. Kitap Adı (1 veya 2 satır dinamik yükseklik — Yazar satırıyla asla çakışmaz)
  ctx.font = 'bold 31px Inter, system-ui, sans-serif'
  let titleLines = getWrappedLines(ctx, book.title, rightW, 2)
  let titleFontSize = 31
  let titleLineH = 36
  if (titleLines.length > 1) {
    titleFontSize = 27
    titleLineH = 32
    ctx.font = `bold ${titleFontSize}px Inter, system-ui, sans-serif`
    titleLines = getWrappedLines(ctx, book.title, rightW, 2)
  }

  ctx.fillStyle = '#ffffff'
  const titleFirstBaseline = pillY + pillH + (titleLines.length > 1 ? 30 : 34)
  titleLines.forEach((ln, idx) => {
    ctx.fillText(ln, rightX, titleFirstBaseline + idx * titleLineH)
  })
  const afterTitleY = titleFirstBaseline + (titleLines.length - 1) * titleLineH

  // 3. Yazar ve Tür Satırları (Başlığın bittiği yere göre dinamik konumlanır)
  const authorY = afterTitleY + 28
  ctx.fillStyle = authorColor
  drawFittedSingleLine(ctx, `Yazar: ${book.author}`, rightX, authorY, rightW, 20, 14, '600', 'left')

  const genreY = authorY + 25
  if (book.genre) {
    ctx.fillStyle = '#94a3b8'
    drawFittedSingleLine(ctx, `Tür: ${book.genre}`, rightX, genreY, rightW, 17, 13, '500', 'left')
  }

  // 4. Ayırıcı Çizgi ve Açıklama (whyRead) Kutusu — Sağdan ve alttan tam 26px içeride biter
  const boxBottom = cardY + cardH - pad
  const boxY = Math.max(genreY + 16, cardY + 228)
  const boxH = Math.max(84, boxBottom - boxY)

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(rightX, boxY - 8)
  ctx.lineTo(rightX + rightW, boxY - 8)
  ctx.stroke()

  ctx.fillStyle = boxBg
  roundRect(ctx, rightX, boxY, rightW, boxH, 14)
  ctx.fill()
  ctx.strokeStyle = boxBorder
  ctx.lineWidth = 1
  ctx.stroke()

  const whyText =
    book.whyRead ||
    (isOrtaokul
      ? 'LGS yeni nesil paragraf sorularında hız ve dikkat süresini geliştirir.'
      : 'TYT derin anlama ve AYT edebiyat tahlil gücü kazandırır.')

  ctx.font = '600 17px Inter, system-ui, sans-serif'
  ctx.fillStyle = '#e2e8f0'
  const whyLines = getWrappedLines(ctx, whyText, rightW - 32, 3)
  const whyLineH = 23
  const totalWhyH = whyLines.length * whyLineH
  const whyStartY = boxY + (boxH - totalWhyH) / 2 + 17
  whyLines.forEach((ln, idx) => {
    ctx.fillText(ln, rightX + 16, whyStartY + idx * whyLineH)
  })

  ctx.restore()
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
  const cardH = 374

  // 1. ORTAOKUL & LGS KARTI
  const card1Y = cursorY
  drawSingleBookCard(ctx, ortaokul, card1Y, cardW, cardH, 'ortaokul', loadedOrtaokulImg)

  // 2. LİSE & YKS KARTI
  const card2Y = card1Y + cardH + 26
  drawSingleBookCard(ctx, lise, card2Y, cardW, cardH, 'lise', loadedLiseImg)

  // 3. ÇIKARTMA (YALNIZCA KULLANICI SEÇTİYSE ÇİZİLİR - ZORUNLU ANKET/QUIZ YOK)
  if (!story.stickerType || story.stickerType === 'none') {
    return card2Y + cardH + 30
  }

  if (story.stickerType === 'quiz' || story.stickerType === 'link') {
    return drawStorySticker(ctx, story, card2Y + cardH + 26, width)
  }

  const pollY = card2Y + cardH + 26
  const pollH = 172

  ctx.save()
  ctx.shadowColor = 'rgba(0, 0, 0, 0.35)'
  ctx.shadowBlur = 20
  ctx.fillStyle = 'rgba(255, 255, 255, 0.96)'
  roundRect(ctx, 80, pollY, cardW, pollH, 26)
  ctx.fill()
  ctx.restore()

  ctx.fillStyle = '#0f172a'
  drawFittedSingleLine(
    ctx,
    story.stickerQuestion || 'Bu hafta hangisini okuyacaksın? 📚',
    width / 2,
    pollY + 46,
    cardW - 56,
    23,
    15,
    'bold',
    'center'
  )

  const btnW = (cardW - 68) / 2
  const leftBtnX = 104
  const rightBtnX = 104 + btnW + 20
  const btnY = pollY + 72
  const btnH = 74

  ctx.fillStyle = '#0284c7'
  roundRect(ctx, leftBtnX, btnY, btnW, btnH, 18)
  ctx.fill()
  const opt1 = (story.stickerOptions && story.stickerOptions[0]) || `📘 ${ortaokul.title}`
  drawPollButtonText(ctx, opt1, leftBtnX, btnY, btnW, btnH, 18)

  ctx.fillStyle = '#ea580c'
  roundRect(ctx, rightBtnX, btnY, btnW, btnH, 18)
  ctx.fill()
  const opt2 = (story.stickerOptions && story.stickerOptions[1]) || `📕 ${lise.title}`
  drawPollButtonText(ctx, opt2, rightBtnX, btnY, btnW, btnH, 18)

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

  ctx.font = 'bold 19px Inter, system-ui, sans-serif'
  const maxBadgeW = highlightTag && !isStory && !isReels ? width - 380 : width - 160
  const badgeW = Math.min(maxBadgeW, ctx.measureText(badgeText).width + 32)
  ctx.fillStyle = theme.badgeBg
  roundRect(ctx, 80, badgeY, badgeW, badgeH, 10)
  ctx.fill()
  ctx.strokeStyle = theme.accentColor
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.fillStyle = theme.badgeText
  drawFittedSingleLine(ctx, badgeText, 96, badgeY + 25, badgeW - 32, 19, 13, 'bold', 'left')

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
    // CAROUSEL MADDELERİ (Kutu içinde dikey + yatay tam ortalama)
    const points = currentSlide.bodyPoints
    const count = points.length

    const gap = count > 3 ? 10 : 14
    const totalGaps = (count - 1) * gap
    const rawCardH = Math.floor((availableSpace - totalGaps) / count)
    const maxCardH = hasImage ? (count > 3 ? 68 : 80) : count > 3 ? 88 : 104
    const cardHeight = Math.min(maxCardH, Math.max(58, rawCardH))
    const isCompact = cardHeight < 72

    points.forEach((point, idx) => {
      const cardY = cursorY
      const radius = isCompact ? 14 : 18

      ctx.save()
      roundRect(ctx, 80, cardY, width - 160, cardHeight, radius)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.035)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.clip()

      const circleR = isCompact ? 18 : 22
      const circleX = 80 + 18 + circleR
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

      const textX = circleX + circleR + 18
      const textW = width - 80 - textX - 20
      const textFontSize = isCompact ? 20 : 23
      const textLineH = isCompact ? 25 : 29

      ctx.font = `600 ${textFontSize}px Inter, system-ui, sans-serif`
      ctx.fillStyle = '#f8fafc'
      const lines = getWrappedLines(ctx, point, textW, isCompact ? 2 : 2)
      const totalH = lines.length * textLineH
      const startY = cardY + (cardHeight - totalH) / 2 + textFontSize * 0.82
      lines.forEach((ln, lIdx) => {
        ctx.fillText(ln, textX, startY + lIdx * textLineH)
      })
      ctx.restore()

      cursorY += cardHeight + gap
    })
  } else if (singlePost?.options && singlePost.options.length > 0) {
    // ÇOKTAN SEÇMELİ POST (1 veya 2 satır şık metni kutu içinde dikey ortalanır)
    const opts = singlePost.options
    const count = opts.length
    const gap = 12
    const totalGaps = (count - 1) * gap
    const rawCardH = Math.floor((availableSpace - totalGaps) / count)
    const cardHeight = Math.min(hasImage ? 72 : 86, Math.max(54, rawCardH))
    const isCompact = cardHeight < 66

    opts.forEach((opt) => {
      const cardY = cursorY

      ctx.save()
      roundRect(ctx, 80, cardY, width - 160, cardHeight, 14)
      ctx.fillStyle = opt.isCorrect ? 'rgba(34, 197, 94, 0.12)' : 'rgba(255, 255, 255, 0.03)'
      ctx.fill()
      ctx.strokeStyle = opt.isCorrect ? '#22c55e' : 'rgba(255, 255, 255, 0.08)'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.clip()

      const boxSize = isCompact ? 38 : 46
      const boxY = cardY + (cardHeight - boxSize) / 2
      ctx.fillStyle = opt.isCorrect ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'
      roundRect(ctx, 98, boxY, boxSize, boxSize, 10)
      ctx.fill()

      ctx.font = `bold ${isCompact ? 19 : 22}px Inter, system-ui, sans-serif`
      ctx.fillStyle = opt.isCorrect ? '#052e16' : '#ffffff'
      ctx.textAlign = 'center'
      ctx.fillText(opt.key, 98 + boxSize / 2, boxY + boxSize * 0.7)
      ctx.textAlign = 'left'

      const optTextX = 98 + boxSize + 18
      const optTextW = width - 80 - optTextX - 20
      const optFontSize = isCompact ? 19 : 21
      const optLineH = isCompact ? 23 : 26

      ctx.font = `500 ${optFontSize}px Inter, system-ui, sans-serif`
      ctx.fillStyle = '#f8fafc'
      const optLines = getWrappedLines(ctx, opt.text, optTextW, 2)
      const totalOptH = optLines.length * optLineH
      const optStartY = cardY + (cardHeight - totalOptH) / 2 + optFontSize * 0.82
      optLines.forEach((ln, lIdx) => {
        ctx.fillText(ln, optTextX, optStartY + lIdx * optLineH)
      })
      ctx.restore()

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

/**
 * Sıfır bağımlılıklı (Zero-Dependency) standart ZIP arşiv oluşturucu (CRC32 + Store)
 */
function createZipBlob(entries: { filename: string; data: Uint8Array }[]): Blob {
  const crcTable = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    crcTable[n] = c >>> 0
  }

  function crc32(buf: Uint8Array): number {
    let crc = 0xffffffff
    for (let i = 0; i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8)
    }
    return (crc ^ 0xffffffff) >>> 0
  }

  const encoder = new TextEncoder()
  const localParts: Uint8Array[] = []
  const centralParts: Uint8Array[] = []
  let offset = 0

  for (const entry of entries) {
    const nameBytes = encoder.encode(entry.filename)
    const data = entry.data
    const crc = crc32(data)

    const localHeader = new Uint8Array(30 + nameBytes.length)
    const lv = new DataView(localHeader.buffer)
    lv.setUint32(0, 0x04034b50, true)
    lv.setUint16(4, 20, true)
    lv.setUint16(6, 0x0800, true) // UTF-8
    lv.setUint16(8, 0, true) // Store (uncompressed)
    lv.setUint16(10, 0, true)
    lv.setUint16(12, 0, true)
    lv.setUint32(14, crc, true)
    lv.setUint32(18, data.length, true)
    lv.setUint32(22, data.length, true)
    lv.setUint16(26, nameBytes.length, true)
    lv.setUint16(28, 0, true)
    localHeader.set(nameBytes, 30)

    const centralHeader = new Uint8Array(46 + nameBytes.length)
    const cv = new DataView(centralHeader.buffer)
    cv.setUint32(0, 0x02014b50, true)
    cv.setUint16(4, 20, true)
    cv.setUint16(6, 20, true)
    cv.setUint16(8, 0x0800, true)
    cv.setUint16(10, 0, true)
    cv.setUint16(12, 0, true)
    cv.setUint16(14, 0, true)
    cv.setUint32(16, crc, true)
    cv.setUint32(20, data.length, true)
    cv.setUint32(24, data.length, true)
    cv.setUint16(28, nameBytes.length, true)
    cv.setUint16(30, 0, true)
    cv.setUint16(32, 0, true)
    cv.setUint16(34, 0, true)
    cv.setUint16(36, 0, true)
    cv.setUint32(38, 0, true)
    cv.setUint32(42, offset, true)
    centralHeader.set(nameBytes, 46)

    localParts.push(localHeader, data)
    centralParts.push(centralHeader)
    offset += localHeader.length + data.length
  }

  const centralSize = centralParts.reduce((acc, p) => acc + p.length, 0)
  const eocd = new Uint8Array(22)
  const ev = new DataView(eocd.buffer)
  ev.setUint32(0, 0x06054b50, true)
  ev.setUint16(4, 0, true)
  ev.setUint16(6, 0, true)
  ev.setUint16(8, entries.length, true)
  ev.setUint16(10, entries.length, true)
  ev.setUint32(12, centralSize, true)
  ev.setUint32(16, offset, true)
  ev.setUint16(20, 0, true)

  return new Blob([...localParts, ...centralParts, eocd] as BlobPart[], { type: 'application/zip' })
}

function dataUrlToUint8Array(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(',')[1] || ''
  const bin = atob(base64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i)
  }
  return bytes
}

/**
 * Tüm slayt görsellerini + açıklama metnini tek bir .ZIP paketi olarak indirir
 */
export async function downloadPostAsZip(
  post: SocialPostItem,
  onProgress?: (current: number, total: number) => void
): Promise<number> {
  const files = await generateAllPostMediaFiles(post, onProgress)
  if (files.length === 0) return 0

  const entries: { filename: string; data: Uint8Array }[] = files.map((f) => ({
    filename: f.filename,
    data: dataUrlToUint8Array(f.dataUrl),
  }))

  const fullCaption = `${post.title}\n\n${post.caption}\n\n${(post.hashtags || [])
    .map((h) => (h.startsWith('#') ? h : `#${h}`))
    .join(' ')}`
  entries.push({
    filename: 'aciklama_ve_etiketler.txt',
    data: new TextEncoder().encode(fullCaption),
  })

  const zipBlob = createZipBlob(entries)
  const url = URL.createObjectURL(zipBlob)
  triggerDownload(url, `dersolab_${post.type}_paketi.zip`)
  setTimeout(() => URL.revokeObjectURL(url), 4000)
  return files.length
}

/**
 * Reels gönderisi için 9:16 dikey hareketli (animasyonlu) video (.webm / .mp4) üretir
 * ve hem Data URL hem de indirilebilir URL döner.
 */
export async function generateReelsAnimatedVideoDataUrl(
  post: SocialPostItem,
  onProgress?: (percent: number) => void
): Promise<{ dataUrl: string; ext: string }> {
  if (typeof document === 'undefined' || typeof MediaRecorder === 'undefined') {
    throw new Error('Tarayıcınız video kaydını desteklemiyor.')
  }

  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1920

  const rb = post.reelsStoryboard || {
    hook3s: post.title,
    visualDirection: 'DersoLab 9:16 Dikey Video',
    spokenScript: post.caption,
    onScreenText: ['🚨 ÖSYM TAKTİĞİ', post.title, '+1 NET KAZAN', 'Link Biyoda 🦊'],
    musicAudioVibe: 'Trending Fast BPM',
    callToAction: 'Profildeki linkten hemen ücretsiz dene!',
  }

  const allTags = rb.onScreenText && rb.onScreenText.length > 0 ? rb.onScreenText : ['🚨 DİKKAT', post.title, 'Link Biyoda 🦊']
  const logoImg = await loadImageSafely('/fox-head.png')
  const mainImg = await loadImageSafely(rb.uploadedImageUrl || post.uploadedImageUrl)

  const mimeTypes = ['video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']
  const supportedMime = mimeTypes.find((m) => MediaRecorder.isTypeSupported(m)) || 'video/webm'
  const ext = supportedMime.includes('mp4') ? 'mp4' : 'webm'

  const stream = canvas.captureStream(30)
  const recorder = new MediaRecorder(stream, {
    mimeType: supportedMime,
    videoBitsPerSecond: 4_500_000,
  })

  const chunks: BlobPart[] = []
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data)
  }

  const totalFrames = 90 // ~3.6 saniye akıcı 30fps animasyon (hızlı render + tam sahne akışı)
  recorder.start()

  for (let f = 0; f <= totalFrames; f++) {
    const progress = f / totalFrames
    onProgress?.(Math.round(progress * 100))

    // Görünür tag sayısını animasyon ilerledikçe artır
    const visibleTagCount = Math.max(1, Math.min(allTags.length, Math.ceil(progress * (allTags.length + 0.5))))
    const partialStoryboard: ReelsStoryboard = {
      ...rb,
      onScreenText: allTags.slice(0, visibleTagCount),
      spokenScript: progress > 0.3 ? rb.spokenScript : '',
      callToAction: progress > 0.55 ? rb.callToAction : '',
    }

    await renderSlideToCanvas(canvas, {
      isReels: true,
      reelsStoryboard: partialStoryboard,
      postTitle: post.title,
      postCaption: post.caption,
      themeVariant: (['neon_orange', 'lab_dark', 'cyan_cyber', 'purple_matrix'] as SlideThemeVariant[])[
        Math.floor(progress * 2) % 4
      ],
      preloadedImages: {
        logo: logoImg,
        mainImage: mainImg,
      },
    })

    // Üstte canlı video ilerleme çubuğu (Instagram Reels / TikTok barı)
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
      roundRect(ctx, 80, 52, 920, 8, 4)
      ctx.fill()
      ctx.fillStyle = '#f97316'
      roundRect(ctx, 80, 52, Math.max(16, 920 * progress), 8, 4)
      ctx.fill()
    }

    await new Promise((r) => setTimeout(r, 32))
  }

  const videoBlob: Blob = await new Promise((resolve) => {
    recorder.onstop = () => {
      resolve(new Blob(chunks, { type: supportedMime }))
    }
    recorder.stop()
  })

  const dataUrl: string = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(videoBlob)
  })

  return { dataUrl, ext }
}
