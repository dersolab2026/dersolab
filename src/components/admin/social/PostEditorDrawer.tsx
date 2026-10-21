'use client'

import React, { useState, useRef } from 'react'
import {
  X,
  Sparkles,
  Layers,
  Film,
  HelpCircle,
  Smartphone,
  Copy,
  Check,
  Download,
  Share2,
  Trash2,
  ExternalLink,
  Calendar,
  Send,
  Upload,
  Image as ImageIcon,
  Eye,
  BookOpen,
  Flame,
  Zap,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Wand2,
  Loader2,
  ShieldCheck,
} from 'lucide-react'
import type {
  CarouselSlide,
  HookVariation,
  ImageStylePreset,
  PedagogicalAudit,
  PostStatus,
  SimulatedComment,
  SocialPostItem,
  StoryStickerType,
} from '@/types/social'
import { buildDefaultComments, buildDefaultHookMatrix, runPedagogicalAudit } from '@/lib/social/agent'
import { downloadAllPostMedia } from '@/lib/social/canvasRenderer'
import { VisualCanvasEngine } from './VisualCanvasEngine'
import { InstagramMockup } from './InstagramMockup'
import { toast } from 'sonner'

function XPlatformIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

interface PostEditorDrawerProps {
  post: SocialPostItem | null
  isOpen: boolean
  onClose: () => void
  onUpdatePost: (updated: SocialPostItem) => void
  onDeletePost: (id: string) => void
}

export function PostEditorDrawer({
  post,
  isOpen,
  onClose,
  onUpdatePost,
  onDeletePost,
}: PostEditorDrawerProps) {
  const [activeTab, setActiveTab] = useState<'caption' | 'slides' | 'visuals' | 'hooks' | 'comments' | 'pedagogy' | 'publish'>('caption')
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor')
  const [isAuditing, setIsAuditing] = useState(false)
  const [previewMode, setPreviewMode] = useState<'canvas' | 'phone'>('canvas')
  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [copiedCaption, setCopiedCaption] = useState(false)
  const [isPublishing, setIsPublishing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const ortaokulFileRef = useRef<HTMLInputElement | null>(null)
  const liseFileRef = useRef<HTMLInputElement | null>(null)

  // AI Görsel Stüdyosu Durumları
  const [selectedVisualSlideIndex, setSelectedVisualSlideIndex] = useState(0)
  const [visualPrompt, setVisualPrompt] = useState('')
  const [visualStylePreset, setVisualStylePreset] = useState<ImageStylePreset>('cyber_lab')
  const [isGeneratingVisual, setIsGeneratingVisual] = useState(false)
  const [isBatchGeneratingVisuals, setIsBatchGeneratingVisuals] = useState(false)
  const [isExportingMedia, setIsExportingMedia] = useState(false)

  if (!isOpen || !post) return null

  const isCarousel = post.type === 'carousel'
  const isReels = post.type === 'reels'
  const isStory = post.type === 'story'
  const isXThread = post.type === 'x_thread'

  function handleApplyHook(hook: HookVariation) {
    if (!post) return

    let updated: SocialPostItem = {
      ...post,
      title: `${hook.title}: ${hook.hookText}`,
    }

    if (post.type === 'carousel' && post.carouselSlides && post.carouselSlides.length > 0) {
      const slides = [...post.carouselSlides]
      slides[0] = {
        ...slides[0],
        headline: hook.hookText,
        badge: hook.title.toUpperCase(),
      }
      updated.carouselSlides = slides
    } else if (post.type === 'reels' && post.reelsStoryboard) {
      updated.reelsStoryboard = {
        ...post.reelsStoryboard,
        hook3s: hook.hookText,
      }
    } else if (post.type === 'x_thread' && post.xThreadData && post.xThreadData.tweets.length > 0) {
      const tweets = [...post.xThreadData.tweets]
      tweets[0] = {
        ...tweets[0],
        text: `1/${tweets.length} — ${hook.hookText}\n\nİşte detaylar 🧵👇`,
      }
      updated.xThreadData = {
        ...post.xThreadData,
        threadHook: hook.hookText,
        tweets,
      }
    } else if (post.singlePostData) {
      updated.singlePostData = {
        ...post.singlePostData,
        headline: hook.hookText,
      }
    } else if (post.storyData) {
      updated.storyData = {
        ...post.storyData,
        headline: hook.hookText,
      }
    }

    onUpdatePost(updated)
    toast.success(`"${hook.title}" kancası içeriğe başarıyla uygulandı!`)
  }

  async function handleRecheckPedagogy() {
    if (!post) return
    setIsAuditing(true)
    try {
      const res = await fetch('/api/admin/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'pedagogical_audit',
          post,
        }),
      })
      const data = await res.json()
      if (data.audit) {
        onUpdatePost({
          ...post,
          pedagogicalAudit: data.audit,
        })
        toast.success('ÖSYM & MEB kazanım denetimi başarıyla güncellendi!')
      } else {
        const localAudit = runPedagogicalAudit(post)
        onUpdatePost({ ...post, pedagogicalAudit: localAudit })
        toast.success('Pedagojik denetim yerel kalkan ile onaylandı!')
      }
    } catch {
      const localAudit = runPedagogicalAudit(post)
      onUpdatePost({ ...post, pedagogicalAudit: localAudit })
      toast.success('Pedagojik denetim yerel kalkan ile onaylandı!')
    } finally {
      setIsAuditing(false)
    }
  }

  async function handleGenerateVisual(slideIdx?: number) {
    setIsGeneratingVisual(true)
    try {
      let promptToUse = visualPrompt.trim()
      const subjectToUse = post?.topicLabel || post?.title

      if (slideIdx !== undefined && isCarousel && post?.carouselSlides) {
        const slide = post.carouselSlides[slideIdx]
        if (!promptToUse) {
          promptToUse = `${slide.badge || ''}: ${slide.headline}. ${slide.subhead || ''}`
        }
      }

      if (!promptToUse) {
        if (isStory) {
          promptToUse = `${post?.storyData?.headline || post?.title || 'Sınav Sorusu'} için 9:16 dikey bilimsel şema veya soru illüstrasyonu`
        } else {
          promptToUse = post?.title || 'DersoLab Sınav Laboratuvarı'
        }
      }

      const res = await fetch('/api/admin/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_image',
          prompt: promptToUse,
          stylePreset: visualStylePreset,
          aspectRatio: isStory ? '9:16' : isXThread ? '16:9' : '1:1',
          subject: subjectToUse,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.imageUrl) {
        throw new Error(data.error || 'Görsel üretilemedi.')
      }

      if (slideIdx !== undefined && isCarousel && post?.carouselSlides) {
        const updatedSlides = [...post.carouselSlides]
        updatedSlides[slideIdx] = {
          ...updatedSlides[slideIdx],
          uploadedImageUrl: data.imageUrl,
          aiImagePrompt: promptToUse,
        }
        onUpdatePost({ ...post, carouselSlides: updatedSlides })
        toast.success(`Slayt ${slideIdx + 1} için yapay zeka görseli oluşturuldu!`)
      } else {
        const updatedPost: SocialPostItem = {
          ...post!,
          uploadedImageUrl: data.imageUrl,
        }
        if (isStory && updatedPost.storyData) {
          updatedPost.storyData = {
            ...updatedPost.storyData,
            uploadedImageUrl: data.imageUrl,
          }
        }
        if (updatedPost.singlePostData) {
          updatedPost.singlePostData = {
            ...updatedPost.singlePostData,
            uploadedImageUrl: data.imageUrl,
          }
        }
        onUpdatePost(updatedPost)
        toast.success(
          isStory
            ? 'Story için 9:16 dikey yapay zeka görseli oluşturuldu!'
            : 'Yapay zeka görseli başarıyla oluşturuldu ve içeriğe eklendi!'
        )
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Görsel üretilirken bir hata oluştu.')
    } finally {
      setIsGeneratingVisual(false)
    }
  }

  // Pazar Kitap Kulübü: Ortaokul AI Kapak Çizimi
  async function handleGenerateOrtaokulBookCover() {
    if (!post?.storyData?.dualBookData) return
    const book = post.storyData.dualBookData.ortaokul
    const prompt = `Artistic book cover illustration for "${book.title}" by ${book.author}. Genre: ${book.genre || 'Youth fiction / Educational'}, modern aesthetic vector book cover design`

    setIsGeneratingVisual(true)
    toast.info('Ortaokul kitabı için yapay zeka kapağı çiziliyor...')
    try {
      const res = await fetch('/api/admin/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_image',
          prompt,
          stylePreset: 'minimal_vector',
          aspectRatio: '1:1',
          subject: book.title,
        }),
      })
      const data = await res.json()
      if (data.imageUrl) {
        onUpdatePost({
          ...post,
          storyData: {
            ...post.storyData,
            dualBookData: {
              ...post.storyData.dualBookData,
              ortaokul: {
                ...book,
                imageUrl: data.imageUrl,
              },
            },
          },
        })
        toast.success(`"${book.title}" için yapay zeka kitap kapağı oluşturuldu!`)
      }
    } catch {
      toast.error('Kitap kapağı üretilirken bir hata oluştu.')
    } finally {
      setIsGeneratingVisual(false)
    }
  }

  // Pazar Kitap Kulübü: Lise AI Kapak Çizimi
  async function handleGenerateLiseBookCover() {
    if (!post?.storyData?.dualBookData) return
    const book = post.storyData.dualBookData.lise
    const prompt = `Artistic literary book cover illustration for "${book.title}" by ${book.author}. Genre: ${book.genre || 'Classic literature / Exam preparation'}, elegant high-impact vector book cover artwork`

    setIsGeneratingVisual(true)
    toast.info('Lise kitabı için yapay zeka kapağı çiziliyor...')
    try {
      const res = await fetch('/api/admin/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_image',
          prompt,
          stylePreset: 'cyber_lab',
          aspectRatio: '1:1',
          subject: book.title,
        }),
      })
      const data = await res.json()
      if (data.imageUrl) {
        onUpdatePost({
          ...post,
          storyData: {
            ...post.storyData,
            dualBookData: {
              ...post.storyData.dualBookData,
              lise: {
                ...book,
                imageUrl: data.imageUrl,
              },
            },
          },
        })
        toast.success(`"${book.title}" için yapay zeka kitap kapağı oluşturuldu!`)
      }
    } catch {
      toast.error('Kitap kapağı üretilirken bir hata oluştu.')
    } finally {
      setIsGeneratingVisual(false)
    }
  }

  async function handleBatchGenerateVisuals() {
    if (!isCarousel || !post?.carouselSlides || post.carouselSlides.length === 0) return
    setIsBatchGeneratingVisuals(true)
    toast.info('Tüm slaytlar için seri görsel üretimi başlatıldı...')

    try {
      const updatedSlides = [...post.carouselSlides]

      for (let i = 0; i < updatedSlides.length; i++) {
        const slide = updatedSlides[i]
        const promptToUse = `${slide.badge || ''}: ${slide.headline}. ${slide.subhead || ''}`

        const res = await fetch('/api/admin/social/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'generate_image',
            prompt: promptToUse,
            stylePreset: visualStylePreset,
            aspectRatio: '1:1',
            subject: post.topicLabel || post.title,
            slideNumber: i + 1,
          }),
        })

        const data = await res.json()
        if (data.imageUrl) {
          updatedSlides[i] = {
            ...slide,
            uploadedImageUrl: data.imageUrl,
            aiImagePrompt: promptToUse,
          }
        }
      }

      onUpdatePost({ ...post, carouselSlides: updatedSlides })
      toast.success(`${updatedSlides.length} slaytın tamamına özel yapay zeka görselleri eklendi!`)
    } catch (err: any) {
      console.error(err)
      toast.error('Seri görsel üretiminde bir hata oluştu.')
    } finally {
      setIsBatchGeneratingVisuals(false)
    }
  }

  // Caption Kopyalama
  function handleCopyCaption() {
    const fullText = `${post!.caption}\n\n${(post!.hashtags || []).map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`
    navigator.clipboard.writeText(fullText)
    setCopiedCaption(true)
    toast.success('Açıklama ve hashtagler panoya kopyalandı!')
    setTimeout(() => setCopiedCaption(false), 2000)
  }

  // Durum Değiştirme
  function handleStatusChange(newStatus: PostStatus) {
    const updated: SocialPostItem = {
      ...post!,
      status: newStatus,
      publishedAt: newStatus === 'published' ? new Date().toISOString() : post!.publishedAt,
    }
    onUpdatePost(updated)
    toast.success(`Durum "${getStatusLabel(newStatus)}" olarak güncellendi!`)
  }

  // Slayt Güncelleme
  function handleSlideUpdate(index: number, updatedSlide: CarouselSlide) {
    if (!post!.carouselSlides) return
    const newSlides = [...post!.carouselSlides]
    newSlides[index] = updatedSlide
    onUpdatePost({
      ...post!,
      carouselSlides: newSlides,
    })
  }

  // Fotoğraf Yükleme
  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Lütfen geçerli bir resim dosyası seçin.')
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string
      if (base64) {
        const updated: SocialPostItem = {
          ...post!,
          uploadedImageUrl: base64,
        }
        if (isStory && updated.storyData) {
          updated.storyData = {
            ...updated.storyData,
            uploadedImageUrl: base64,
          }
        }
        onUpdatePost(updated)
        toast.success(isStory ? 'Story görseli başarıyla eklendi!' : 'Fotoğraf başarıyla eklendi!')
      }
    }
    reader.readAsDataURL(file)
  }

  // Pazar Kitap Kulübü: Ortaokul Kitap Kapağı Yükleme
  function handleOrtaokulBookImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !post?.storyData?.dualBookData) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string
      if (base64) {
        onUpdatePost({
          ...post,
          storyData: {
            ...post.storyData!,
            dualBookData: {
              ...post.storyData!.dualBookData!,
              ortaokul: {
                ...post.storyData!.dualBookData!.ortaokul,
                imageUrl: base64,
              },
            },
          },
        })
        toast.success('Ortaokul kitap kapağı eklendi!')
      }
    }
    reader.readAsDataURL(file)
  }

  // Pazar Kitap Kulübü: Lise Kitap Kapağı Yükleme
  function handleLiseBookImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !post?.storyData?.dualBookData) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string
      if (base64) {
        onUpdatePost({
          ...post,
          storyData: {
            ...post.storyData!,
            dualBookData: {
              ...post.storyData!.dualBookData!,
              lise: {
                ...post.storyData!.dualBookData!.lise,
                imageUrl: base64,
              },
            },
          },
        })
        toast.success('Lise kitap kapağı eklendi!')
      }
    }
    reader.readAsDataURL(file)
  }

  // Instagram Doğrudan Yayınlama Çağrısı
  async function handlePublishToInstagram() {
    setIsPublishing(true)
    try {
      const res = await fetch('/api/admin/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caption: `${post!.caption}\n\n${(post!.hashtags || []).join(' ')}`,
          isReels: post!.type === 'reels',
          isStory: post!.type === 'story',
          imageUrls: post!.uploadedImageUrl ? [post!.uploadedImageUrl] : undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Instagram yayını başarısız oldu.')
      }

      if (data.mode === 'manual_fallback') {
        toast.info(data.message, { duration: 6000 })
      } else {
        toast.success(data.message)
        handleStatusChange('published')
      }
    } catch (err: any) {
      toast.error(err?.message || 'Yayınlama sırasında bir hata oluştu.')
    } finally {
      setIsPublishing(false)
    }
  }

  // Görselleri 1080p Tam Tasarım Olarak Dışa Aktar ve İndir
  async function handleDownloadAllMedia() {
    if (!post) return
    setIsExportingMedia(true)
    try {
      const count = await downloadAllPostMedia(post, (current, total) => {
        toast.info(`Görseller hazırlanıyor (${current}/${total})...`)
      })
      if (count > 0) {
        toast.success(`🎉 ${count} adet yüksek çözünürlüklü görsel başarıyla indirildi!`)
      } else {
        toast.info('İndirilecek görsel içeriği bulunamadı.')
      }
    } catch (err) {
      console.error('İndirme hatası:', err)
      toast.error('Görseller indirilirken bir hata oluştu.')
    } finally {
      setIsExportingMedia(false)
    }
  }

  // 1 Tıkla Paketi İndir + Metni Kopyala + Instagram'ı Aç
  async function handleOneClickShare() {
    if (!post) return
    // 1. Metni kopyala
    const fullText = `${post.caption}\n\n${(post.hashtags || []).map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`
    await navigator.clipboard.writeText(fullText)

    // 2. Görselleri hazırla ve indir
    toast.info('Paylaşım paketi hazırlanıyor...')
    await handleDownloadAllMedia()

    // 3. Instagram'ı aç
    window.open('https://www.instagram.com/', '_blank')

    // 4. Durumu güncelle
    if (post.status !== 'published') {
      handleStatusChange('approved')
    }

    toast.success('🎉 Paylaşım paketi hazır! Görseller indirildi, açıklama kopyalandı ve Instagram açıldı.')
  }

  function getStatusLabel(status: PostStatus) {
    switch (status) {
      case 'draft':
        return 'Taslak'
      case 'approved':
        return 'Paylaşıma Hazır'
      case 'scheduled':
        return 'Planlandı'
      case 'published':
        return 'Yayınlandı'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-3 md:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      {/* Gizli dosya seçici */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      <div className="relative w-full h-full sm:h-[92vh] max-w-6xl sm:rounded-3xl rounded-none bg-[#0d0f15] border-0 sm:border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col">
        {/* Üst Bar */}
        <div className="flex items-center justify-between px-3.5 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-white/[0.02] shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl flex items-center justify-center border shrink-0 ${
                isCarousel
                  ? 'bg-orange-500/20 border-orange-500/30 text-orange-400'
                  : isStory
                    ? 'bg-purple-500/20 border-purple-500/30 text-purple-400'
                    : isReels
                      ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                      : 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
              }`}
            >
              {isCarousel ? (
                <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : isStory ? (
                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : isReels ? (
                <Film className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white max-w-[130px] sm:max-w-md truncate">{post.title}</h2>
                <span
                  className={`px-1.5 sm:px-2 py-0.5 rounded-md sm:rounded-lg text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                    post.status === 'published'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : post.status === 'approved'
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : post.status === 'scheduled'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {getStatusLabel(post.status)}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400 truncate">
                {post.topicLabel} • {post.targetAudience}
              </p>
            </div>
          </div>

          {/* Sağ Aksiyonlar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/15 to-cyan-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.2)]">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Etkileşim Skoru: %{post.virality?.score || 96}</span>
            </div>

            <button
              onClick={() => onDeletePost(post.id)}
              className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-colors"
              title="Gönderiyi Sil"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobil Görünüm Değiştirici: [Düzenle] vs [Önizleme & İndir] */}
        <div className="lg:hidden flex items-center bg-[#07090e] border-b border-white/10 p-1.5 gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setMobileView('editor')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              mobileView === 'editor'
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md shadow-orange-500/25'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>İçerik Düzenle</span>
          </button>
          <button
            type="button"
            onClick={() => setMobileView('preview')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
              mobileView === 'preview'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md shadow-cyan-500/25 font-black'
                : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Canlı Önizleme & İndir</span>
          </button>
        </div>

        {/* Ana İçerik Grid */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* SOL PANEL (7 Kolon) */}
          <div className={`lg:col-span-7 flex flex-col border-r border-white/10 overflow-hidden bg-black/20 ${mobileView === 'preview' ? 'hidden lg:flex' : 'flex flex-1'}`}>
            {/* Sekme Seçici */}
            <div className="flex items-center gap-1.5 px-3 sm:px-6 pt-3 sm:pt-4 pb-2 border-b border-white/5 overflow-x-auto scrollbar-none touch-pan-x shrink-0">
              <button
                onClick={() => setActiveTab('caption')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'caption'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
              </button>
              <button
                onClick={() => setActiveTab('slides')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'slides'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>
                  {isXThread
                    ? 'Tweet Dizisi (Flood)'
                    : isCarousel
                      ? 'Slaytlar'
                      : isStory
                        ? 'Story Çıkartması'
                        : isReels
                          ? 'Reels Senaryosu'
                          : 'Soru Detayları'}
                </span>
              </button>
              <button
                onClick={() => setActiveTab('visuals')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'visuals'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.25)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                <span>AI Görsel Stüdyosu</span>
              </button>
              <button
                onClick={() => setActiveTab('hooks')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'hooks'
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>5x Kanca Matrisi</span>
              </button>
              <button
                onClick={() => setActiveTab('comments')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'comments'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Yorum Ajanı</span>
              </button>
              <button
                onClick={() => setActiveTab('pedagogy')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'pedagogy'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pedagoji & ÖSYM</span>
              </button>
              <button
                onClick={() => setActiveTab('publish')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  activeTab === 'publish'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Yayınlama & Onay</span>
              </button>
            </div>

            {/* Sekme Gövdesi */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {activeTab === 'caption' && (
                <div className="space-y-4">
                  {/* Başlık Düzenleme */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">İçerik Başlığı</label>
                    <input
                      type="text"
                      value={post.title}
                      onChange={(e) => onUpdatePost({ ...post, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-orange-500"
                    />
                  </div>

                  {/* Görsel Yönetimi */}
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">Fotoğraf / Görsel</span>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{post.uploadedImageUrl ? 'Fotoğrafı Değiştir' : 'Fotoğraf Yükle'}</span>
                      </button>
                    </div>

                    {post.uploadedImageUrl ? (
                      <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white/5 border border-white/10">
                        <img
                          src={post.uploadedImageUrl}
                          alt="Önizleme"
                          className="w-12 h-12 rounded-lg object-cover border border-white/20"
                        />
                        <span className="text-xs text-slate-300 truncate flex-1">Özel Görsel Ekli</span>
                        <button
                          type="button"
                          onClick={() => onUpdatePost({ ...post, uploadedImageUrl: undefined })}
                          className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          title="Görseli Kaldır"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-[11px] text-slate-500">
                        Şablona kendi soru fotoğrafınızı veya afişinizi eklemek için yukarıdaki butonu kullanın.
                      </p>
                    )}
                  </div>

                  {/* Instagram Açıklaması */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-300">Instagram Açıklaması (Caption)</label>
                      <button
                        onClick={handleCopyCaption}
                        className="flex items-center gap-1 text-[11px] font-semibold text-orange-400 hover:text-orange-300 transition-colors"
                      >
                        {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedCaption ? 'Kopyalandı' : 'Tüm Metni Kopyala'}</span>
                      </button>
                    </div>
                    <textarea
                      value={post.caption}
                      onChange={(e) => onUpdatePost({ ...post, caption: e.target.value })}
                      rows={8}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl p-3.5 text-xs text-white leading-relaxed outline-none focus:border-orange-500 resize-none font-sans"
                    />
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{post.caption.length} karakter</span>
                      <span>Öneri: İlk 125 karakter akışta doğrudan görünür</span>
                    </div>
                  </div>

                  {/* Hashtagler */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Hashtagler</label>
                    <input
                      type="text"
                      value={(post.hashtags || []).join(' ')}
                      onChange={(e) =>
                        onUpdatePost({
                          ...post,
                          hashtags: e.target.value
                            .split(' ')
                            .map((h) => h.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="#yks2026 #tyt #dersolab"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-blue-400 outline-none focus:border-orange-500 font-mono"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'slides' && (
                <div className="space-y-5">
                  {/* STORY DÜZENLEME FORMU */}
                  {isStory && post.storyData ? (
                    <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-purple-400">Story Üst Başlığı (Badge)</label>
                        <input
                          type="text"
                          value={post.storyData.badge}
                          onChange={(e) =>
                            onUpdatePost({
                              ...post,
                              storyData: { ...post.storyData!, badge: e.target.value },
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Ana Başlık</label>
                        <input
                          type="text"
                          value={post.storyData.headline}
                          onChange={(e) =>
                            onUpdatePost({
                              ...post,
                              storyData: { ...post.storyData!, headline: e.target.value },
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Alt Açıklama</label>
                        <input
                          type="text"
                          value={post.storyData.subhead || ''}
                          onChange={(e) =>
                            onUpdatePost({
                              ...post,
                              storyData: { ...post.storyData!, subhead: e.target.value },
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-500"
                        />
                      </div>

                      {/* Çıkartma Ayarları */}
                      <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-purple-300">Çıkartma Türü</label>
                          <select
                            value={post.storyData.stickerType}
                            onChange={(e) =>
                              onUpdatePost({
                                ...post,
                                storyData: {
                                  ...post.storyData!,
                                  stickerType: e.target.value as StoryStickerType,
                                },
                              })
                            }
                            className="bg-neutral-900 border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none"
                          >
                            <option value="quiz">4 Şıklı Quiz</option>
                            <option value="poll">2 Şıklı Anket</option>
                            <option value="link">Link Çıkartması</option>
                          </select>
                        </div>

                        {post.storyData.stickerType === 'quiz' && (
                          <div className="space-y-2">
                            <label className="text-[11px] font-semibold text-slate-400">Quiz Sorusu</label>
                            <input
                              type="text"
                              value={post.storyData.stickerQuestion || ''}
                              onChange={(e) =>
                                onUpdatePost({
                                  ...post,
                                  storyData: { ...post.storyData!, stickerQuestion: e.target.value },
                                })
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                            />
                            <label className="text-[11px] font-semibold text-slate-400 block pt-1">
                              Şıklar (Virgülle ayırın)
                            </label>
                            <input
                              type="text"
                              value={(post.storyData.stickerOptions || []).join(', ')}
                              onChange={(e) =>
                                onUpdatePost({
                                  ...post,
                                  storyData: {
                                    ...post.storyData!,
                                    stickerOptions: e.target.value.split(',').map((s) => s.trim()),
                                  },
                                })
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                            />
                          </div>
                        )}

                        {post.storyData.stickerType === 'poll' && (
                          <div className="space-y-2">
                            <label className="text-[11px] font-semibold text-slate-400">Anket Sorusu</label>
                            <input
                              type="text"
                              value={post.storyData.stickerQuestion || ''}
                              onChange={(e) =>
                                onUpdatePost({
                                  ...post,
                                  storyData: { ...post.storyData!, stickerQuestion: e.target.value },
                                })
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                            />
                          </div>
                        )}

                        {post.storyData.stickerType === 'link' && (
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-400">Link Metni</label>
                              <input
                                type="text"
                                value={post.storyData.stickerLinkText || ''}
                                onChange={(e) =>
                                  onUpdatePost({
                                    ...post,
                                    storyData: { ...post.storyData!, stickerLinkText: e.target.value },
                                  })
                                }
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-400">Hedef URL</label>
                              <input
                                type="text"
                                value={post.storyData.stickerLinkUrl || ''}
                                onChange={(e) =>
                                  onUpdatePost({
                                    ...post,
                                    storyData: { ...post.storyData!, stickerLinkUrl: e.target.value },
                                  })
                                }
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* STORY İÇİN 9:16 AI GÖRSELİ VEYA ŞEMASI */}
                      {!post.storyData.dualBookData && (
                        <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-cyan-400" />
                              <span className="text-xs font-bold text-cyan-300">
                                🎨 9:16 Story AI Görseli & Şeması
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleGenerateVisual()}
                              disabled={isGeneratingVisual}
                              className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white shadow-sm transition-all disabled:opacity-50"
                            >
                              {isGeneratingVisual ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Sparkles className="w-3 h-3" />
                              )}
                              <span>{isGeneratingVisual ? 'Çiziliyor...' : '✨ 9:16 Görsel Üret'}</span>
                            </button>
                          </div>

                          {post.storyData.uploadedImageUrl || post.uploadedImageUrl ? (
                            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-cyan-500/30">
                              <img
                                src={post.storyData.uploadedImageUrl || post.uploadedImageUrl}
                                alt="Story Görseli"
                                className="w-12 h-16 rounded-lg object-cover border border-white/20 shadow"
                              />
                              <div className="flex-1 min-w-0">
                                <span className="text-[11px] font-bold text-cyan-300 block">
                                  9:16 Dikey Tuval Görseli Aktif
                                </span>
                                <span className="text-[10px] text-slate-400 block truncate">
                                  Soru ve anket çıkartmasının üzerinde şık bir çerçeveyle görüntülenir
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdatePost({
                                    ...post,
                                    uploadedImageUrl: undefined,
                                    storyData: {
                                      ...post.storyData!,
                                      uploadedImageUrl: undefined,
                                    },
                                  })
                                  toast.success('Story görseli kaldırıldı.')
                                }}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                title="Görseli Kaldır"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="p-2.5 rounded-xl bg-white/5 border border-dashed border-cyan-500/20 text-center">
                              <p className="text-[11px] text-slate-300 font-medium">
                                Story tuvaline 9:16 formatında optik prizması, formül şeması veya çizim ekleyin.
                              </p>
                              <div className="mt-2 flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => handleGenerateVisual()}
                                  disabled={isGeneratingVisual}
                                  className="text-[11px] font-bold text-cyan-400 hover:underline inline-flex items-center gap-1"
                                >
                                  <Sparkles className="w-3 h-3" /> AI ile 9:16 Çizdir
                                </button>
                                <span className="text-slate-600">•</span>
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="text-[11px] font-bold text-slate-400 hover:text-white inline-flex items-center gap-1"
                                >
                                  <Upload className="w-3 h-3" /> Dosyadan Yükle
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* PAZAR KİTAP KULÜBÜ DÜZENLEME (ORTAOKUL & LİSE) */}
                      {post.storyData.dualBookData ? (
                        <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/25 space-y-4">
                          <div className="flex items-center justify-between border-b border-purple-500/20 pb-2">
                            <div className="flex items-center gap-2">
                              <BookOpen className="w-4 h-4 text-purple-400" />
                              <span className="text-xs font-bold text-purple-300">
                                Pazar Kitap Kulübü (Ortaokul + Lise)
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                const newStory = { ...post.storyData! }
                                delete newStory.dualBookData
                                onUpdatePost({ ...post, storyData: newStory })
                                toast.success('Kitap kulübü modu kaldırıldı.')
                              }}
                              className="text-[10px] text-red-400 hover:text-red-300"
                            >
                              Kitap Modunu Kaldır
                            </button>
                          </div>

                          {/* 1. ORTAOKUL KİTABI */}
                          <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-sky-400 block">
                                📘 1. Ortaokul Kitabı (LGS - 10-14 Yaş)
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={handleGenerateOrtaokulBookCover}
                                  disabled={isGeneratingVisual}
                                  className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                >
                                  <Sparkles className="w-3 h-3 text-sky-400" />
                                  <span>✨ AI Kapak Çiz</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => ortaokulFileRef.current?.click()}
                                  className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                                >
                                  <Upload className="w-3 h-3" />
                                  <span>{post.storyData.dualBookData.ortaokul.imageUrl ? 'Değiştir' : 'Yükle'}</span>
                                </button>
                              </div>
                            </div>

                            <input
                              ref={ortaokulFileRef}
                              type="file"
                              accept="image/*"
                              onChange={handleOrtaokulBookImage}
                              className="hidden"
                            />

                            {/* Kitap Kapağı Önizleme / Durum */}
                            {post.storyData.dualBookData.ortaokul.imageUrl ? (
                              <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white/5 border border-sky-500/30">
                                <img
                                  src={post.storyData.dualBookData.ortaokul.imageUrl}
                                  alt="Ortaokul Kitap Kapağı"
                                  className="w-10 h-14 rounded-md object-cover border border-white/20 shadow-sm"
                                />
                                <div className="flex-1 min-w-0">
                                  <span className="text-[11px] font-semibold text-sky-300 block truncate">
                                    Kitap Kapağı Görseli Ekli
                                  </span>
                                  <span className="text-[10px] text-slate-400 block">
                                    Tuvalde metin yerine kapak resmi gösterilir
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdatePost({
                                      ...post,
                                      storyData: {
                                        ...post.storyData!,
                                        dualBookData: {
                                          ...post.storyData!.dualBookData!,
                                          ortaokul: {
                                            ...post.storyData!.dualBookData!.ortaokul,
                                            imageUrl: undefined,
                                          },
                                        },
                                      },
                                    })
                                  }
                                  className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                  title="Görseli Kaldır"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div
                                onClick={() => ortaokulFileRef.current?.click()}
                                className="border border-dashed border-sky-500/30 hover:border-sky-500/60 p-2.5 rounded-xl text-center cursor-pointer bg-sky-500/5 transition-all"
                              >
                                <span className="text-[11px] font-bold text-sky-300 block">
                                  📷 Kitap Kapağı Görseli Yükle
                                </span>
                                <span className="text-[10px] text-slate-400 block">
                                  Yüklendiğinde 'Neden Okunmalı' metni yerine kapak resmi çizilir
                                </span>
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-slate-400">Kitap Adı</label>
                                <input
                                  type="text"
                                  value={post.storyData.dualBookData.ortaokul.title}
                                  onChange={(e) =>
                                    onUpdatePost({
                                      ...post,
                                      storyData: {
                                        ...post.storyData!,
                                        dualBookData: {
                                          ...post.storyData!.dualBookData!,
                                          ortaokul: {
                                            ...post.storyData!.dualBookData!.ortaokul,
                                            title: e.target.value,
                                          },
                                        },
                                      },
                                    })
                                  }
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400">Yazar</label>
                                <input
                                  type="text"
                                  value={post.storyData.dualBookData.ortaokul.author}
                                  onChange={(e) =>
                                    onUpdatePost({
                                      ...post,
                                      storyData: {
                                        ...post.storyData!,
                                        dualBookData: {
                                          ...post.storyData!.dualBookData!,
                                          ortaokul: {
                                            ...post.storyData!.dualBookData!.ortaokul,
                                            author: e.target.value,
                                          },
                                        },
                                      },
                                    })
                                  }
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400">Vurgu / LGS Paragraf Katkısı</label>
                              <textarea
                                value={post.storyData.dualBookData.ortaokul.whyRead || ''}
                                onChange={(e) =>
                                  onUpdatePost({
                                    ...post,
                                    storyData: {
                                      ...post.storyData!,
                                      dualBookData: {
                                        ...post.storyData!.dualBookData!,
                                        ortaokul: {
                                          ...post.storyData!.dualBookData!.ortaokul,
                                          whyRead: e.target.value,
                                        },
                                      },
                                    },
                                  })
                                }
                                rows={2}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white outline-none resize-none"
                              />
                            </div>
                          </div>

                          {/* 2. LİSE KİTABI */}
                          <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-bold text-orange-400 block">
                                📕 2. Lise Kitabı (YKS - 14-18 Yaş)
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={handleGenerateLiseBookCover}
                                  disabled={isGeneratingVisual}
                                  className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                >
                                  <Sparkles className="w-3 h-3 text-orange-400" />
                                  <span>✨ AI Kapak Çiz</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => liseFileRef.current?.click()}
                                  className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                                >
                                  <Upload className="w-3 h-3" />
                                  <span>{post.storyData.dualBookData.lise.imageUrl ? 'Değiştir' : 'Yükle'}</span>
                                </button>
                              </div>
                            </div>

                            <input
                              ref={liseFileRef}
                              type="file"
                              accept="image/*"
                              onChange={handleLiseBookImage}
                              className="hidden"
                            />

                            {/* Kitap Kapağı Önizleme / Durum */}
                            {post.storyData.dualBookData.lise.imageUrl ? (
                              <div className="flex items-center justify-between gap-3 p-2 rounded-xl bg-white/5 border border-orange-500/30">
                                <img
                                  src={post.storyData.dualBookData.lise.imageUrl}
                                  alt="Lise Kitap Kapağı"
                                  className="w-10 h-14 rounded-md object-cover border border-white/20 shadow-sm"
                                />
                                <div className="flex-1 min-w-0">
                                  <span className="text-[11px] font-semibold text-orange-300 block truncate">
                                    Kitap Kapağı Görseli Ekli
                                  </span>
                                  <span className="text-[10px] text-slate-400 block">
                                    Tuvalde metin yerine kapak resmi gösterilir
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onUpdatePost({
                                      ...post,
                                      storyData: {
                                        ...post.storyData!,
                                        dualBookData: {
                                          ...post.storyData!.dualBookData!,
                                          lise: {
                                            ...post.storyData!.dualBookData!.lise,
                                            imageUrl: undefined,
                                          },
                                        },
                                      },
                                    })
                                  }
                                  className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                  title="Görseli Kaldır"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <div
                                onClick={() => liseFileRef.current?.click()}
                                className="border border-dashed border-orange-500/30 hover:border-orange-500/60 p-2.5 rounded-xl text-center cursor-pointer bg-orange-500/5 transition-all"
                              >
                                <span className="text-[11px] font-bold text-orange-300 block">
                                  📷 Kitap Kapağı Görseli Yükle
                                </span>
                                <span className="text-[10px] text-slate-400 block">
                                  Yüklendiğinde 'Neden Okunmalı' metni yerine kapak resmi çizilir
                                </span>
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-slate-400">Kitap Adı</label>
                                <input
                                  type="text"
                                  value={post.storyData.dualBookData.lise.title}
                                  onChange={(e) =>
                                    onUpdatePost({
                                      ...post,
                                      storyData: {
                                        ...post.storyData!,
                                        dualBookData: {
                                          ...post.storyData!.dualBookData!,
                                          lise: {
                                            ...post.storyData!.dualBookData!.lise,
                                            title: e.target.value,
                                          },
                                        },
                                      },
                                    })
                                  }
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400">Yazar</label>
                                <input
                                  type="text"
                                  value={post.storyData.dualBookData.lise.author}
                                  onChange={(e) =>
                                    onUpdatePost({
                                      ...post,
                                      storyData: {
                                        ...post.storyData!,
                                        dualBookData: {
                                          ...post.storyData!.dualBookData!,
                                          lise: {
                                            ...post.storyData!.dualBookData!.lise,
                                            author: e.target.value,
                                          },
                                        },
                                      },
                                    })
                                  }
                                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-400">Vurgu / YKS Analiz Katkısı</label>
                              <textarea
                                value={post.storyData.dualBookData.lise.whyRead || ''}
                                onChange={(e) =>
                                  onUpdatePost({
                                    ...post,
                                    storyData: {
                                      ...post.storyData!,
                                      dualBookData: {
                                        ...post.storyData!.dualBookData!,
                                        lise: {
                                          ...post.storyData!.dualBookData!.lise,
                                          whyRead: e.target.value,
                                        },
                                      },
                                    },
                                  })
                                }
                                rows={2}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-xs text-white outline-none resize-none"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            onUpdatePost({
                              ...post,
                              storyData: {
                                ...post.storyData!,
                                badge: 'PAZAR KİTAP KULÜBÜ 📚',
                                headline: 'Haftanın Kitap Önerileri',
                                subhead: 'Hem Ortaokul (LGS) Hem Lise (YKS) İçin Seçtik',
                                stickerType: 'poll',
                                stickerQuestion: 'Bu hafta hangisini okuyacaksın?',
                                stickerOptions: ['Ortaokul: Momo 📘', 'Lise: Simyacı 📕'],
                                themeVariant: 'purple_matrix',
                                dualBookData: {
                                  ortaokul: {
                                    title: 'Momo',
                                    author: 'Michael Ende',
                                    genre: 'Felsefi Masal & Zaman Macerası',
                                    whyRead: 'LGS yeni nesil paragraf sorularında zaman algısı ve dikkat süresini geliştirir.',
                                    highlightTag: 'ORTAOKUL & LGS (10-14 YAŞ)',
                                  },
                                  lise: {
                                    title: 'Simyacı',
                                    author: 'Paulo Coelho',
                                    genre: 'Alegorik Roman',
                                    whyRead: 'YKS maratonunda motivasyon, içsel yolculuk ve TYT derin anlama becerisi kazandırır.',
                                    highlightTag: 'LİSE & YKS (14-18 YAŞ)',
                                  },
                                },
                              },
                            })
                            toast.success('Pazar Kitap Kulübü (Ortaokul + Lise) şablonu eklendi!')
                          }}
                          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-bold transition-all"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>📚 Pazar Kitap Kulübüne Dönüştür (Ortaokul & Lise Ekle)</span>
                        </button>
                      )}
                    </div>
                  ) : isCarousel && post.carouselSlides ? (
                    // Carousel Slaytları
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {post.carouselSlides.map((slide, idx) => (
                          <button
                            key={idx}
                            onClick={() => setActiveSlideIndex(idx)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                              activeSlideIndex === idx
                                ? 'bg-orange-500 text-white shadow-md'
                                : 'bg-white/5 text-slate-400 hover:text-white'
                            }`}
                          >
                            <span>Slayt {idx + 1}</span>
                          </button>
                        ))}
                      </div>

                      {post.carouselSlides[activeSlideIndex] && (
                        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3.5">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-400">Üst Rozet (Badge)</label>
                              <input
                                type="text"
                                value={post.carouselSlides[activeSlideIndex].badge || ''}
                                onChange={(e) =>
                                  handleSlideUpdate(activeSlideIndex, {
                                    ...post.carouselSlides![activeSlideIndex],
                                    badge: e.target.value,
                                  })
                                }
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-orange-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[11px] font-semibold text-slate-400">Vurgu Etiketi</label>
                              <input
                                type="text"
                                value={post.carouselSlides[activeSlideIndex].highlightTag || ''}
                                onChange={(e) =>
                                  handleSlideUpdate(activeSlideIndex, {
                                    ...post.carouselSlides![activeSlideIndex],
                                    highlightTag: e.target.value,
                                  })
                                }
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-orange-500"
                              />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-400">Ana Başlık</label>
                            <input
                              type="text"
                              value={post.carouselSlides[activeSlideIndex].headline}
                              onChange={(e) =>
                                handleSlideUpdate(activeSlideIndex, {
                                  ...post.carouselSlides![activeSlideIndex],
                                  headline: e.target.value,
                                })
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-orange-500 font-bold"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[11px] font-semibold text-slate-400">Alt Başlık</label>
                            <input
                              type="text"
                              value={post.carouselSlides[activeSlideIndex].subhead || ''}
                              onChange={(e) =>
                                handleSlideUpdate(activeSlideIndex, {
                                  ...post.carouselSlides![activeSlideIndex],
                                  subhead: e.target.value,
                                })
                              }
                              className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-orange-500"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[11px] font-semibold text-slate-400">İçerik Maddeleri</label>
                            <textarea
                              value={(post.carouselSlides[activeSlideIndex].bodyPoints || []).join('\n')}
                              onChange={(e) =>
                                handleSlideUpdate(activeSlideIndex, {
                                  ...post.carouselSlides![activeSlideIndex],
                                  bodyPoints: e.target.value.split('\n').filter(Boolean),
                                })
                              }
                              rows={3}
                              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-orange-500 resize-none leading-relaxed"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ) : isReels && post.reelsStoryboard ? (
                    // Reels
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-orange-400">🎬 İlk 3 Saniye Kancası (Hook)</label>
                        <textarea
                          value={post.reelsStoryboard.hook3s}
                          onChange={(e) =>
                            onUpdatePost({
                              ...post,
                              reelsStoryboard: { ...post.reelsStoryboard!, hook3s: e.target.value },
                            })
                          }
                          rows={2}
                          className="w-full bg-white/5 border border-orange-500/30 rounded-xl p-3 text-xs text-white outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">🎙️ Konuşma Metni</label>
                        <textarea
                          value={post.reelsStoryboard.spokenScript}
                          onChange={(e) =>
                            onUpdatePost({
                              ...post,
                              reelsStoryboard: { ...post.reelsStoryboard!, spokenScript: e.target.value },
                            })
                          }
                          rows={4}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-orange-500 resize-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ) : post.singlePostData ? (
                    // Soru / Post
                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Soru / Başlık</label>
                        <input
                          type="text"
                          value={post.singlePostData.headline}
                          onChange={(e) =>
                            onUpdatePost({
                              ...post,
                              singlePostData: { ...post.singlePostData!, headline: e.target.value },
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-300">Soru Açıklaması</label>
                        <textarea
                          value={post.singlePostData.questionOrSummary}
                          onChange={(e) =>
                            onUpdatePost({
                              ...post,
                              singlePostData: { ...post.singlePostData!, questionOrSummary: e.target.value },
                            })
                          }
                          rows={3}
                          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>
                  ) : isXThread && post.xThreadData ? (
                    // X / Twitter Thread Editor
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <div className="flex items-center gap-2">
                          <XPlatformIcon className="w-4 h-4 text-sky-400" />
                          <span className="text-xs font-bold text-white">X / Twitter Tweet Zinciri</span>
                          <span className="px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-400 text-[10px] font-bold">
                            {post.xThreadData.tweets.length} Tweet
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            const allText = post.xThreadData!.tweets
                              .map((t) => t.text)
                              .join('\n\n---\n\n')
                            navigator.clipboard.writeText(allText)
                            toast.success('Tüm tweet zinciri panoya kopyalandı!')
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-sky-300 transition-all hover:scale-105 active:scale-95"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Tüm Diziyi Kopyala</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {post.xThreadData.tweets.map((tw, idx) => {
                          const charCount = tw.text.length
                          const isOver = charCount > 280
                          return (
                            <div key={idx} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold text-sky-400">Tweet {idx + 1} / {post.xThreadData!.tweets.length}</span>
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] font-mono font-bold ${isOver ? 'text-red-400' : 'text-slate-400'}`}>
                                    {charCount} / 280
                                  </span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(tw.text)
                                      toast.success(`Tweet ${idx + 1} kopyalandı!`)
                                    }}
                                    className="p-1 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                                    title="Bu Tweeti Kopyala"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                              <textarea
                                value={tw.text}
                                onChange={(e) => {
                                  const updatedTweets = [...post.xThreadData!.tweets]
                                  updatedTweets[idx] = {
                                    ...updatedTweets[idx],
                                    text: e.target.value,
                                    charCount: e.target.value.length,
                                  }
                                  onUpdatePost({
                                    ...post,
                                    xThreadData: {
                                      ...post.xThreadData!,
                                      tweets: updatedTweets,
                                    },
                                  })
                                }}
                                rows={3}
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-2.5 text-xs text-white outline-none focus:border-sky-400 resize-none leading-relaxed"
                              />
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : null}
                </div>
              )}

              {/* TAB: 5X KANCA MATRİSİ */}
              {activeTab === 'hooks' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span>5x Dikkat Çekici Kanca & Başlık Matrisi</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        İçeriğin ilk 3 saniyesini veya kapak başlığını bu kancalardan biriyle tek tıkla güncelleyin.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {(post.hookMatrix || buildDefaultHookMatrix(post.title, post.topicLabel, post.persona)).map((hk) => (
                      <div
                        key={hk.id}
                        className="p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-cyan-500/20 hover:border-cyan-400/40 transition-all space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold">
                            {hk.title}
                          </span>
                          <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-400">
                            <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span>%{hk.viralityScore} Viralite</span>
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-white leading-snug">"{hk.hookText}"</p>

                        <div className="flex items-center justify-between pt-1 border-t border-white/5">
                          <span className="text-[10px] text-slate-400 italic">{hk.reason}</span>
                          <button
                            onClick={() => handleApplyHook(hk)}
                            className="flex items-center gap-1 px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-[11px] font-bold transition-all hover:scale-105 active:scale-95"
                          >
                            <span>Bu Kancayı Uygula</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: AI GÖRSEL STÜDYOSU */}
              {activeTab === 'visuals' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white flex items-center gap-2">
                        <Wand2 className="w-4 h-4 text-purple-400" />
                        <span>DersoLab AI Görsel Stüdyosu</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Metinleri zengin görsel ve bilimsel illüstrasyonlarla destekleyin.
                      </p>
                    </div>

                    {isCarousel && (
                      <button
                        onClick={handleBatchGenerateVisuals}
                        disabled={isBatchGeneratingVisuals}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                      >
                        {isBatchGeneratingVisuals ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Seri Üretiliyor...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Tüm Slaytlara Seri Üret</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Slayt Seçici (Carousel ise) */}
                  {isCarousel && post.carouselSlides && post.carouselSlides.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-slate-300">Görsel Eklenecek Slayt</label>
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {post.carouselSlides.map((slide, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedVisualSlideIndex(idx)
                              setActiveSlideIndex(idx)
                              setVisualPrompt(`${slide.badge || ''}: ${slide.headline}`)
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 border transition-all ${
                              selectedVisualSlideIndex === idx
                                ? 'bg-purple-500 text-white border-purple-400 shadow-md'
                                : 'bg-white/5 border-white/5 text-slate-400 hover:text-white'
                            }`}
                          >
                            <span>Slayt {idx + 1}</span>
                            {slide.uploadedImageUrl && <span className="ml-1 text-[10px] text-emerald-300">✓ Görselli</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mevcut Görsel Önizlemesi */}
                  {Boolean(
                    isCarousel && post.carouselSlides
                      ? post.carouselSlides[selectedVisualSlideIndex]?.uploadedImageUrl
                      : (post.storyData?.uploadedImageUrl || post.uploadedImageUrl)
                  ) && (
                    <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            isCarousel && post.carouselSlides
                              ? post.carouselSlides[selectedVisualSlideIndex]?.uploadedImageUrl
                              : (post.storyData?.uploadedImageUrl || post.uploadedImageUrl)
                          }
                          alt="Görsel"
                          className="w-16 h-16 rounded-xl object-cover border border-white/10"
                        />
                        <div>
                          <span className="text-xs font-bold text-white block">
                            {isStory ? 'Aktif Story 9:16 Görseli' : 'Aktif Yapay Zeka Görseli'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {isStory
                              ? '9:16 Dikey tuvalde soru çıkartmasının üstünde gösterilir'
                              : 'Tuval ve slayt üzerinde otomatik konumlandırıldı'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (isCarousel && post.carouselSlides) {
                            const updated = [...post.carouselSlides]
                            updated[selectedVisualSlideIndex] = {
                              ...updated[selectedVisualSlideIndex],
                              uploadedImageUrl: undefined,
                            }
                            onUpdatePost({ ...post, carouselSlides: updated })
                          } else if (isStory && post.storyData) {
                            onUpdatePost({
                              ...post,
                              uploadedImageUrl: undefined,
                              storyData: {
                                ...post.storyData,
                                uploadedImageUrl: undefined,
                              },
                            })
                          } else {
                            onUpdatePost({ ...post, uploadedImageUrl: undefined })
                          }
                          toast.success('Görsel kaldırıldı.')
                        }}
                        className="px-2.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs font-bold transition-colors"
                      >
                        Kaldır
                      </button>
                    </div>
                  )}

                  {/* Prompt Girişi */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                      <span>Görsel Konusu / Prompt</span>
                      <span className="text-[10px] text-slate-500">Boş bırakılırsa başlığa göre otomatik üretir</span>
                    </label>
                    <textarea
                      value={visualPrompt}
                      onChange={(e) => setVisualPrompt(e.target.value)}
                      placeholder={
                        isCarousel && post.carouselSlides
                          ? `${post.carouselSlides[selectedVisualSlideIndex]?.headline} için görsel konusu...`
                          : `${post.title} için görsel konusu...`
                      }
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none focus:border-purple-500 resize-none"
                    />

                    {/* Hızlı Konu Önerileri */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {(isStory
                        ? [
                            '📐 TYT Fizik Optik & Kırılma (9:16)',
                            '⚡ Parabol Teğet Eğrisi & Kökler',
                            '🧬 Mitoz & Mayoz Evreleri Şeması',
                            '📖 Biyonik Hızlı Okuma Haritası',
                            '🦊 Zeki Tilki Soru Çözüyor (9:16)',
                          ]
                        : [
                            '📐 Optik & Işık Kırılması',
                            '⚡ Türev & Teğet Eğimi',
                            '📖 Biyonik Hızlı Okuma',
                            '🧬 DNA & Hücre Bölünmesi',
                            '🦊 Zeki Tilki Laboratuvarda',
                          ]
                      ).map((chip) => (
                        <button
                          key={chip}
                          type="button"
                          onClick={() => setVisualPrompt(chip)}
                          className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-slate-400 hover:text-purple-300 transition-colors"
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stil Seçici */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">İllüstrasyon Stili</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {[
                        { id: 'cyber_lab', label: '🔮 Cyber Lab', desc: 'Neon & Koyu Lab' },
                        { id: 'scientific_diagram', label: '📐 Bilimsel Şema', desc: 'Optik, Formül, Eğri' },
                        { id: 'minimal_vector', label: '🎨 Vektör Sanatı', desc: 'Modern & Düz' },
                        { id: 'realistic_study', label: '📸 Çalışma Odası', desc: 'Masa, Kitap, Odak' },
                        { id: 'mascot_fox', label: '🦊 Zeki Tilki', desc: 'DersoLab Maskotu' },
                      ].map((st) => (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => setVisualStylePreset(st.id as ImageStylePreset)}
                          className={`p-2.5 rounded-xl text-left border transition-all ${
                            visualStylePreset === st.id
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

                  {/* Üretim Butonu */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isGeneratingVisual}
                      onClick={() => handleGenerateVisual(isCarousel ? selectedVisualSlideIndex : undefined)}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold text-xs shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                    >
                      {isGeneratingVisual ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Yapay Zeka Görseli Üretiyor...</span>
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4" />
                          <span>
                            {isCarousel
                              ? `Slayt ${selectedVisualSlideIndex + 1} İçin Görseli Üret`
                              : isStory
                              ? 'Story İçin 9:16 Dikey Görseli Üret'
                              : 'İçerik İçin Görseli Üret'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: YORUM & ETKİLEŞİM AJANI */}
              {activeTab === 'comments' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <span>Etkileşim & Topluluk Copilot</span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Öğrencilerden gelebilecek sorular ve seçilen tona göre hazırlanmış hazır yanıt önerileri.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {(post.simulatedComments || buildDefaultComments(post.title, post.caption)).map((sc) => (
                      <div key={sc.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="w-7 h-7 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center font-bold text-orange-400 text-xs">
                            {sc.userHandle.charAt(1).toUpperCase()}
                          </span>
                          <div>
                            <span className="font-bold text-white block">{sc.userHandle}</span>
                            <span className="text-[10px] text-slate-400">Öğrenci Yorumu:</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-slate-200 italic">
                          "{sc.commentText}"
                        </div>

                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            Hazır Yanıt Önerileri (Kopyalamak İçin Tıklayın):
                          </span>
                          <div className="space-y-1.5">
                            {sc.suggestedReplies.map((sr, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  navigator.clipboard.writeText(sr.replyText)
                                  toast.success(`${sr.personaLabel} yanıtı panoya kopyalandı!`)
                                }}
                                className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-emerald-500/30 transition-all group flex items-start justify-between gap-2"
                              >
                                <div>
                                  <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mb-1">
                                    {sr.personaLabel}
                                  </span>
                                  <p className="text-[11px] text-slate-300 group-hover:text-white leading-relaxed">
                                    {sr.replyText}
                                  </p>
                                </div>
                                <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-400 shrink-0 mt-1" />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: PEDAGOJİ & ÖSYM KAZANIM DENETİMİ */}
              {activeTab === 'pedagogy' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-white/10">
                    <div>
                      <h3 className="text-xs font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>ÖSYM & MEB Pedagojik Güvenlik Kalkanı</span>
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Bu içerik MEB kazanımları, ÖSYM soru kalıpları ve pedagojik dil kurallarına göre taranmıştır.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleRecheckPedagogy}
                      disabled={isAuditing}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all disabled:opacity-50"
                    >
                      {isAuditing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5" />
                      )}
                      <span>{isAuditing ? 'Denetleniyor...' : 'Yeniden Denetle'}</span>
                    </button>
                  </div>

                  {(() => {
                    const audit = post.pedagogicalAudit || runPedagogicalAudit(post)
                    return (
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                              <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-emerald-300 block">
                                Pedagojik Onay Mührü Verildi
                              </span>
                              <span className="text-[10px] text-slate-400 block">
                                {audit.verifiedByAgent}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <span className="text-[10px] text-slate-400 block">ÖSYM Uygunluk Skoru</span>
                            <span className="text-xl font-mono font-black text-emerald-400">
                              %{audit.osymRelevanceScore}
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                          <span className="text-[11px] font-bold text-slate-300 block">
                            Müfettiş Değerlendirme Raporu:
                          </span>
                          <p className="text-xs text-slate-300 leading-relaxed italic bg-black/30 p-3 rounded-xl border border-white/5">
                            "{audit.pedagogyNotes}"
                          </p>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Denetlenen Kazanım ve Güvenlik Kuralları:
                          </span>
                          <div className="grid grid-cols-1 gap-2">
                            {audit.checkedRules.map((rule, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 p-2.5 rounded-xl bg-white/[0.02] border border-emerald-500/20 text-xs text-slate-200"
                              >
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                <span>{rule}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}

              {activeTab === 'publish' && (
                <div className="space-y-6">
                  {/* Durum Değiştirici */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300">İçerik Durumu</label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['draft', 'approved', 'scheduled', 'published'] as PostStatus[]).map((st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(st)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border text-center transition-all ${
                            post.status === st
                              ? 'bg-orange-500/20 border-orange-500 text-orange-400 shadow-md'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                          }`}
                        >
                          {getStatusLabel(st)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 1 Tıkla Paylaşım Paketi (Tavsiye Edilen & %100 Garantili) */}
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-cyan-500/10 border border-emerald-500/30 space-y-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                          <Zap className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">1 Tıkla Hazırla & Paylaş</h4>
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                              Önerilen & Kesin Çözüm
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300">
                            Görseller bilgisayarınıza indirilir, açıklama panoya kopyalanır ve Instagram açılır.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-2 text-xs text-slate-300">
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        <span>Slayt / kapak görselleri anında tam çözünürlükte indirilir</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        <span>Metin + etiketler (hashtag'ler) otomatik kopyalanır</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                        <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                        <span>Instagram tek tıkla açılır; görseli sürükleyip Ctrl+V ile metni yapıştırıp paylaşabilirsiniz</span>
                      </div>
                    </div>

                    <button
                      onClick={handleOneClickShare}
                      disabled={isExportingMedia}
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                    >
                      {isExportingMedia ? (
                        <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      ) : (
                        <Sparkles className="w-4 h-4 fill-slate-950" />
                      )}
                      <span>{isExportingMedia ? 'Görseller Çiziliyor & İndiriliyor...' : '1 Tıkla Paylaşım Paketini Başlat'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => {
                          const fullText = `${post.caption}\n\n${(post.hashtags || []).map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`
                          navigator.clipboard.writeText(fullText)
                          toast.success('Açıklama ve hashtag\'ler panoya kopyalandı!')
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Sadece Metni Kopyala</span>
                      </button>

                      <button
                        onClick={handleDownloadAllMedia}
                        disabled={isExportingMedia}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-colors disabled:opacity-50"
                      >
                        {isExportingMedia ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                        ) : (
                          <Download className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        <span>{isExportingMedia ? 'İndiriliyor...' : 'Görselleri İndir'}</span>
                      </button>

                      <a
                        href="https://www.instagram.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Instagram Web</span>
                      </a>
                    </div>
                  </div>

                  {/* Meta Graph API ile Doğrudan Gönderim */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white">
                        <Send className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Meta Graph API ile Doğrudan Gönderim</h4>
                        <p className="text-[10px] text-slate-400">
                          Hesabınıza bağlı resmi Facebook / Instagram Business API üzerinden otomatik paylaşım
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white/5 text-[11px] text-slate-400">
                      <span>API doğrudan gönderim için sunucuda Instagram Business hesabı ve internete açık görsel URL'si gerekir.</span>
                      <button
                        onClick={handlePublishToInstagram}
                        disabled={isPublishing}
                        className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/20 hover:bg-pink-500/30 border border-pink-500/40 text-pink-300 text-xs font-bold transition-all disabled:opacity-50"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isPublishing ? 'İletiliyor...' : 'Doğrudan Gönder'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SAĞ PANEL: Canlı Önizleme (5 Kolon) */}
          <div className={`lg:col-span-5 flex flex-col overflow-hidden bg-black/40 ${mobileView === 'editor' ? 'hidden lg:flex' : 'flex flex-1'}`}>
            {/* Önizleme Modu Değiştirici */}
            <div className="flex items-center justify-between px-3.5 sm:px-6 py-2.5 sm:py-3 border-b border-white/5 shrink-0">
              <span className="text-xs font-semibold text-slate-400">Canlı Önizleme</span>
              <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/5 border border-white/10">
                <button
                  onClick={() => setPreviewMode('canvas')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    previewMode === 'canvas' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Şablon</span>
                </button>
                <button
                  onClick={() => setPreviewMode('phone')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    previewMode === 'phone' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Telefon</span>
                </button>
              </div>
            </div>

            {/* Önizleme Alanı */}
            <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
              {isXThread && post.xThreadData ? (
                <div className="w-full max-w-[420px] max-h-[75vh] overflow-y-auto space-y-3 p-4 rounded-3xl bg-[#000000] border border-white/10 shadow-2xl">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 sticky top-0 bg-black/90 backdrop-blur z-10">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center font-bold text-orange-400 text-sm">
                        🦊
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">DersoLab</span>
                          <span className="text-[10px] px-1 rounded bg-sky-500/20 text-sky-400 font-bold">✓</span>
                        </div>
                        <span className="text-[10px] text-slate-500">@dersolabegitim • X Thread</span>
                      </div>
                    </div>
                    <XPlatformIcon className="w-4 h-4 text-white" />
                  </div>

                  <div className="space-y-3">
                    {post.xThreadData.tweets.map((tw, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/5 space-y-2 hover:border-sky-500/30 transition-colors">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-sky-400 font-mono">
                            Tweet {i + 1} / {post.xThreadData!.tweets.length}
                          </span>
                          <span className={`text-[10px] font-mono ${tw.text.length > 280 ? 'text-red-400 font-bold' : 'text-slate-500'}`}>
                            {tw.text.length} / 280
                          </span>
                        </div>
                        <p className="text-xs text-slate-200 whitespace-pre-line leading-relaxed selection:bg-sky-500 selection:text-white">
                          {tw.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : previewMode === 'canvas' ? (
                <VisualCanvasEngine
                  slides={post.carouselSlides}
                  singlePost={post.singlePostData}
                  storyData={post.storyData}
                  reelsStoryboard={post.reelsStoryboard}
                  isStory={post.type === 'story'}
                  isReels={post.type === 'reels'}
                  postTitle={post.title}
                  postCaption={post.caption}
                  customImageUrl={post.uploadedImageUrl}
                  activeSlideIndex={activeSlideIndex}
                  onSlideChange={setActiveSlideIndex}
                  onSlideUpdate={handleSlideUpdate}
                  onImageUpload={(b64) => onUpdatePost({ ...post, uploadedImageUrl: b64 })}
                />
              ) : (
                <InstagramMockup
                  post={post}
                  activeSlideIndex={activeSlideIndex}
                  onSlideChange={setActiveSlideIndex}
                />
              )}
            </div>
          </div>
        </div>

        {/* Mobil Sabit Alt Aksiyon Barı */}
        <div className="lg:hidden p-2.5 sm:p-3 border-t border-white/10 bg-[#07090e] flex items-center gap-2 shrink-0">
          {mobileView === 'editor' ? (
            <>
              <button
                type="button"
                onClick={() => {
                  const fullText = `${post.caption}\n\n${(post.hashtags || []).map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`
                  navigator.clipboard.writeText(fullText)
                  toast.success('Açıklama ve etiketler kopyalandı!')
                }}
                className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Metni Kopyala</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileView('preview')}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-500/20 transition-all active:scale-95"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Önizleme & İndir</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setMobileView('editor')}
                className="py-2.5 px-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Düzenle</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadAllMedia}
                disabled={isExportingMedia}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {isExportingMedia ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                ) : (
                  <Download className="w-3.5 h-3.5 text-slate-950" />
                )}
                <span>{isExportingMedia ? 'İndiriliyor...' : 'Görselleri İndir (PNG)'}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
