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
import type { CarouselSlide, ImageStylePreset, ReelsStoryboard, SinglePostData, SlideThemeVariant, StoryData } from '@/types/social'
import {
  THEME_STYLES,
  renderSlideToCanvas,
  exportSlideDataUrl,
  downloadAllPostMedia,
  triggerDownload,
} from '@/lib/social/canvasRenderer'
import { toast } from 'sonner'

interface VisualCanvasEngineProps {
  slides?: CarouselSlide[]
  singlePost?: SinglePostData
  storyData?: StoryData
  reelsStoryboard?: ReelsStoryboard
  isStory?: boolean
  isReels?: boolean
  postTitle?: string
  postCaption?: string
  customImageUrl?: string
  activeSlideIndex?: number
  onSlideChange?: (index: number) => void
  onSlideUpdate?: (index: number, updated: CarouselSlide) => void
  onImageUpload?: (base64: string) => void
}


export function VisualCanvasEngine({
  slides,
  singlePost,
  storyData,
  reelsStoryboard,
  isStory = false,
  isReels = false,
  postTitle,
  postCaption,
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

  // Canvas çizim fonksiyonu (Merkezi Motor)
  const renderCanvas = useCallback(async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    await renderSlideToCanvas(canvas, {
      isStory,
      isCarousel,
      isReels,
      activeSlideIndex,
      totalSlides,
      currentSlide,
      singlePost,
      storyData,
      reelsStoryboard,
      postTitle,
      postCaption,
      customImageUrl: effectiveImageUrl,
      preloadedImages: {
        logo: loadedLogo,
        mainImage: loadedImage,
        ortaokulImg: loadedOrtaokulImg,
        liseImg: loadedLiseImg,
      },
    })
  }, [
    isStory,
    isCarousel,
    isReels,
    activeSlideIndex,
    totalSlides,
    currentSlide,
    singlePost,
    storyData,
    reelsStoryboard,
    postTitle,
    postCaption,
    effectiveImageUrl,
    loadedLogo,
    loadedImage,
    loadedOrtaokulImg,
    loadedLiseImg,
  ])

  useEffect(() => {
    renderCanvas()
  }, [renderCanvas])


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

  // PNG İndirme (Aktif Slayt)
  async function handleDownload() {
    setIsExporting(true)
    try {
      const dataUrl = await exportSlideDataUrl({
        isStory,
        isCarousel,
        isReels,
        activeSlideIndex,
        totalSlides,
        currentSlide,
        singlePost,
        storyData,
        reelsStoryboard,
        postTitle,
        postCaption,
        customImageUrl: effectiveImageUrl,
        preloadedImages: {
          logo: loadedLogo,
          mainImage: loadedImage,
          ortaokulImg: loadedOrtaokulImg,
          liseImg: loadedLiseImg,
        },
      })
      const fileName = `dersolab_${isStory ? 'story' : isReels ? 'reels_kapak' : isCarousel ? `slayt_${activeSlideIndex + 1}` : 'post'}_${Date.now()}.png`
      triggerDownload(dataUrl, fileName)
      toast.success(
        `Görsel başarıyla ${isStory || isReels ? '1080x1920 (9:16)' : '1080x1350 (4:5)'} PNG olarak indirildi!`
      )
    } catch (err) {
      console.error(err)
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

  // Tüm Slaytları Sırayla İndirme (Offscreen Garantili Motor)
  async function handleDownloadAll() {
    if (!isCarousel || !slides || slides.length === 0) return
    setIsExporting(true)
    toast.info(`Tüm slaytlar (${slides.length} adet) sırayla hazırlanıyor ve indiriliyor...`)

    try {
      const count = await downloadAllPostMedia(
        {
          id: 'temp_carousel',
          title: currentSlide?.headline || 'DersoLab Carousel',
          type: 'carousel',
          topic: 'exam_tactics',
          topicLabel: 'Carousel',
          status: 'draft',
          targetAudience: 'YKS 2026',
          caption: '',
          hashtags: [],
          carouselSlides: slides,
          uploadedImageUrl: customImageUrl,
          createdAt: new Date().toISOString(),
        },
        (current, total) => {
          toast.info(`Slayt ${current}/${total} hazırlanıyor...`)
        }
      )
      toast.success(`Tüm ${count} slayt başarıyla indirildi!`)
    } catch (err) {
      console.error(err)
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
          ) : isReels ? (
            <div className="flex items-center gap-1.5 bg-orange-500/15 border border-orange-500/30 rounded-xl px-3 py-1.5 text-xs font-bold text-orange-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Reels & TikTok (9:16)</span>
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

      {/* Canvas Çerçevesi (Story veya Reels ise 9:16, Post ise 4:5) */}
      <div
        className={`relative group w-full max-w-[420px] ${
          isStory || isReels ? 'aspect-[9/16]' : 'aspect-[4/5]'
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
                  id: 'fox-mascot-520',
                  title: '🦊 Zeki Tilki (Resmi DersoLab Maskotu)',
                  subtitle: 'Yüksek çözünürlüklü şeffaf sevimli piksel maskotumuz.',
                  url: '/fox-mascot-520.png',
                  tag: '⭐ Resmi Maskot',
                  tagColor: 'border-orange-500/40 bg-orange-500/15 text-orange-300',
                },
                {
                  id: 'fox-mascot',
                  title: 'Piksel Tilki (Tam Boy)',
                  subtitle: 'DersoLab tam boy sevimli piksel sanat maskotu.',
                  url: '/fox-mascot.png',
                  tag: 'Orijinal Maskot',
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
