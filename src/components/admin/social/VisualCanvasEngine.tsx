'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import { Download, Copy, Check, Sparkles, ChevronLeft, ChevronRight, Layers, Palette } from 'lucide-react'
import type { CarouselSlide, SinglePostData, SlideThemeVariant } from '@/types/social'
import { toast } from 'sonner'

interface VisualCanvasEngineProps {
  slides?: CarouselSlide[]
  singlePost?: SinglePostData
  activeSlideIndex?: number
  onSlideChange?: (index: number) => void
  onSlideUpdate?: (index: number, updated: CarouselSlide) => void
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
  activeSlideIndex = 0,
  onSlideChange,
  onSlideUpdate,
}: VisualCanvasEngineProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [copied, setCopied] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const isCarousel = Boolean(slides && slides.length > 0)
  const currentSlide = isCarousel ? slides![activeSlideIndex] : null
  const totalSlides = isCarousel ? slides!.length : 1

  // Canvas çizim fonksiyonu (1080 x 1350 - Instagram Portrait 4:5 formatı)
  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const width = 1080
    const height = 1350
    canvas.width = width
    canvas.height = height

    const themeKey = (currentSlide?.themeVariant || singlePost?.themeVariant || 'lab_dark') as SlideThemeVariant
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
    const orbGrad1 = ctx.createRadialGradient(width * 0.85, height * 0.15, 20, width * 0.85, height * 0.15, 450)
    orbGrad1.addColorStop(0, theme.glowColor)
    orbGrad1.addColorStop(1, 'transparent')
    ctx.fillStyle = orbGrad1
    ctx.fillRect(0, 0, width, height)

    const orbGrad2 = ctx.createRadialGradient(width * 0.15, height * 0.85, 20, width * 0.15, height * 0.85, 500)
    orbGrad2.addColorStop(0, 'rgba(249, 115, 22, 0.15)')
    orbGrad2.addColorStop(1, 'transparent')
    ctx.fillStyle = orbGrad2
    ctx.fillRect(0, 0, width, height)

    // 4. Kenarlık / İç Çerçeve
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.lineWidth = 2
    roundRect(ctx, 40, 40, width - 80, height - 80, 32)
    ctx.stroke()

    // 5. ÜST HEADER: DersoLab Logo ve Slayt Sayacı
    // Logo Metni
    ctx.font = 'bold 36px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#ffffff'
    ctx.fillText('Derso', 80, 110)

    const logoGrad = ctx.createLinearGradient(190, 0, 260, 0)
    logoGrad.addColorStop(0, theme.accentColor)
    logoGrad.addColorStop(1, theme.secondaryAccent)
    ctx.fillStyle = logoGrad
    ctx.fillText('Lab', 190, 110)

    // Slayt Sayacı (Carousel ise)
    if (isCarousel) {
      const pageText = `${activeSlideIndex + 1} / ${totalSlides}`
      ctx.font = 'bold 24px Inter, system-ui, sans-serif'
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.textAlign = 'right'
      ctx.fillText(pageText, width - 80, 110)
      ctx.textAlign = 'left'
    }

    // Üst Ayraç Çizgisi
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(80, 145)
    ctx.lineTo(width - 80, 145)
    ctx.stroke()

    // 6. İÇERİK ALANI
    let cursorY = 220

    // Rozet (Badge)
    const badgeText = currentSlide?.badge || singlePost?.badge || 'DERSOLAB • TAKTİK'
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

    cursorY += 90

    // Vurucu Başlık (Headline)
    const headline = currentSlide?.headline || singlePost?.headline || 'Sınavda Başarıyı Getiren Strateji'
    ctx.font = '900 56px Inter, system-ui, sans-serif'
    ctx.fillStyle = '#ffffff'
    cursorY = wrapText(ctx, headline, 80, cursorY, width - 160, 68)

    // Alt Başlık (Subhead)
    cursorY += 25
    const subhead = currentSlide?.subhead || singlePost?.questionOrSummary || ''
    if (subhead) {
      ctx.font = '500 28px Inter, system-ui, sans-serif'
      ctx.fillStyle = 'rgba(226, 232, 240, 0.85)'
      cursorY = wrapText(ctx, subhead, 80, cursorY, width - 160, 42)
    }

    cursorY += 40

    // Madde İşaretleri / Şıklar / Açıklama Kutuları
    if (isCarousel && currentSlide?.bodyPoints && currentSlide.bodyPoints.length > 0) {
      currentSlide.bodyPoints.forEach((point, idx) => {
        // Madde Kartı
        const cardY = cursorY
        const cardHeight = 110

        ctx.fillStyle = 'rgba(255, 255, 255, 0.03)'
        roundRect(ctx, 80, cardY, width - 160, cardHeight, 20)
        ctx.fill()
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
        ctx.lineWidth = 1
        ctx.stroke()

        // İkon / Numara Çemberi
        ctx.fillStyle = theme.accentColor
        ctx.beginPath()
        ctx.arc(130, cardY + cardHeight / 2, 22, 0, Math.PI * 2)
        ctx.fill()

        ctx.font = 'bold 22px Inter, system-ui, sans-serif'
        ctx.fillStyle = '#0f172a'
        ctx.textAlign = 'center'
        ctx.fillText(String(idx + 1), 130, cardY + cardHeight / 2 + 8)
        ctx.textAlign = 'left'

        // Madde Metni
        ctx.font = '600 26px Inter, system-ui, sans-serif'
        ctx.fillStyle = '#f8fafc'
        wrapText(ctx, point, 180, cardY + 45, width - 290, 34, 2)

        cursorY += cardHeight + 20
      })
    } else if (singlePost?.options && singlePost.options.length > 0) {
      // Çoktan Seçmeli Soru Şıkları
      singlePost.options.forEach((opt) => {
        const cardY = cursorY
        const cardHeight = 85

        ctx.fillStyle = opt.isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.03)'
        roundRect(ctx, 80, cardY, width - 160, cardHeight, 16)
        ctx.fill()
        ctx.strokeStyle = opt.isCorrect ? 'rgba(34, 197, 94, 0.5)' : 'rgba(255, 255, 255, 0.08)'
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Şık Harfi Kutusu
        ctx.fillStyle = opt.isCorrect ? '#22c55e' : 'rgba(255, 255, 255, 0.1)'
        roundRect(ctx, 95, cardY + 18, 48, 48, 12)
        ctx.fill()

        ctx.font = 'bold 24px Inter, system-ui, sans-serif'
        ctx.fillStyle = opt.isCorrect ? '#052e16' : '#ffffff'
        ctx.textAlign = 'center'
        ctx.fillText(opt.key, 119, cardY + 50)
        ctx.textAlign = 'left'

        // Şık Metni
        ctx.font = '500 24px Inter, system-ui, sans-serif'
        ctx.fillStyle = '#f8fafc'
        wrapText(ctx, opt.text, 165, cardY + 50, width - 270, 30, 1)

        cursorY += cardHeight + 16
      })
    }

    // Vurgu Etiketi (Örn: "KAYDETMELİK" veya "+3 NET")
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

    // 7. ALT FOOTER: Çağrı & Kaydır İpucu
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(80, height - 125)
    ctx.lineTo(width - 80, height - 125)
    ctx.stroke()

    // Sol Footer: Marka ve Kullanıcı Adı
    ctx.font = '600 22px Inter, system-ui, sans-serif'
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)'
    ctx.fillText('@dersolabegitim', 80, height - 75)

    // Sağ Footer: Kaydır veya Harekete Geç
    const footerRightText =
      isCarousel && activeSlideIndex < totalSlides - 1 ? 'Kaydır 👉' : 'Profildeki Linke Tıkla 🦊'
    ctx.font = 'bold 22px Inter, system-ui, sans-serif'
    ctx.fillStyle = theme.accentColor
    ctx.textAlign = 'right'
    ctx.fillText(footerRightText, width - 80, height - 75)
    ctx.textAlign = 'left'
  }, [currentSlide, singlePost, activeSlideIndex, totalSlides, isCarousel])

  useEffect(() => {
    renderCanvas()
  }, [renderCanvas])

  // Metin Sarmalama Yardımcısı
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

  // Yuvarlatılmış Dikdörtgen Çizici
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

  // PNG İndirme
  function handleDownload() {
    const canvas = canvasRef.current
    if (!canvas) return
    setIsExporting(true)
    try {
      const imageUri = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      const fileName = `dersolab_${isCarousel ? `slide_${activeSlideIndex + 1}` : 'post'}_${Date.now()}.png`
      link.download = fileName
      link.href = imageUri
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success('Görsel başarıyla 1080x1350 PNG olarak indirildi!')
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
        toast.success('Görsel panoya kopyalandı! (Instagram Web veya Photoshop içine yapıştırabilirsiniz)')
        setTimeout(() => setCopied(false), 2500)
      })
    } catch {
      toast.error('Panoya kopyalama tarayıcınızda desteklenmiyor. Lütfen "İndir" butonunu kullanın.')
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
      {/* Üst Kontrol Barı */}
      <div className="flex items-center justify-between w-full max-w-[420px] px-2">
        <div className="flex items-center gap-2">
          {isCarousel && (
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-300">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                Slayt {activeSlideIndex + 1} / {totalSlides}
              </span>
            </div>
          )}
          {isCarousel && onSlideUpdate && (
            <button
              onClick={cycleTheme}
              className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-2.5 py-1.5 text-xs font-medium text-slate-300 transition-colors"
              title="Temayı Değiştir"
            >
              <Palette className="w-3.5 h-3.5 text-orange-400" />
              <span>Renk Teması</span>
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

      {/* Canvas Önizleme Çerçevesi (Instagram 4:5 Portrait) */}
      <div className="relative group w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-white/15 bg-black">
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
