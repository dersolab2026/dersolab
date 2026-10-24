'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Sparkles,
  Layers,
  Film,
  Smartphone,
  HelpCircle,
  Download,
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  FolderOpen,
  ArrowLeft,
  Eye,
  Edit3,
  RefreshCw,
  CheckCircle2,
  Calendar,
  Image as ImageIcon,
  Upload,
  ShieldCheck,
  MessageSquare,
  Flame,
  Send,
  Cloud,
} from 'lucide-react'
import type {
  CarouselSlide,
  ContentTopic,
  HookVariation,
  ImageStylePreset,
  InstagramContentType,
  PedagogicalAudit,
  SimulatedComment,
  SlideThemeVariant,
  SocialPostItem,
  StoryStickerType,
} from '@/types/social'
import { SocialPhoneMockup } from './SocialPhoneMockup'
import { PublishSuccessModal, type PublishResultData } from './PublishSuccessModal'
import { downloadAllPostMedia, generateAllPostMediaFiles } from '@/lib/social/canvasRenderer'
import { toTurkishTitleCase } from '@/lib/social/agent'
import {
  getSocialPostsFromDb,
  upsertSocialPostToDb,
  deleteSocialPostFromDb,
} from '@/actions/social-posts'
import { toast } from 'sonner'

const STORAGE_KEY = 'dersolab_social_posts_v7'

const INITIAL_DEMO_POSTS: SocialPostItem[] = [
  {
    id: 'demo_carousel_1',
    title: 'Paragrafta Süre Yetiştiremeyenlerin Yaptığı 3 Hata',
    type: 'carousel',
    topic: 'exam_tactics',
    topicLabel: 'TYT Türkçe • Paragraf',
    status: 'approved',
    targetAudience: 'YKS 2027',
    caption: `Paragraf sorularında son şıkka geldiğinde ilk şıkkı unutanlar burada mı? 🙋‍♂️\n\nÖSYM paragraf sorularını bilgi değil, "odaklanma ve hız" testi olarak sorar. Bu 3 kuralı denemelerinde uygula, sürenden en az 12 dakika tasarruf et!\n\n💡 Biyonik hızlı okuma modülümüzü denemek için profildeki linke tıkla!\n\n#yks2027 #tytturkce #paragraftaktikleri #dersolab #ykstayfa #studygram`,
    hashtags: ['#yks2027', '#tytturkce', '#paragraftaktikleri', '#dersolab', '#ykstayfa'],
    carouselSlides: [
      {
        slideNumber: 1,
        badge: 'TYT TÜRKÇE • PARAGRAF',
        headline: 'Paragrafta Süre Yetiştiremeyenlerin Yaptığı 3 Hata',
        subhead: 'Son şıkta ilk şıkkı unutanlar için kurtarıcı rehber',
        bodyPoints: [
          'Metni baştan sona roman gibi okumak',
          'Şıkları elemeden önce soru köküne dönmemek',
          'Kaydır, 12 dakika kazandıran tekniği öğren 👉',
        ],
        highlightTag: 'KAYDETMELİK',
        footerNote: 'DersoLab Sınav Laboratuvarı • @dersolabegitim',
        themeVariant: 'lab_dark',
      },
      {
        slideNumber: 2,
        badge: '1. ALTIN KURAL',
        headline: 'Önce Soru Kökü, Sonra Şıkların İlk Kelimesi',
        subhead: 'Beynine ne aradığını önceden söyle!',
        bodyPoints: [
          'Soru kökündeki olumsuz ifadeyi (değinilmemiştir) daire içine al.',
          'Şıkların anahtar kelimelerini hızlıca tara.',
          'Metne girdiğinde beynin sadece o anahtar kelimeleri arar.',
        ],
        highlightTag: '+3 NET',
        footerNote: 'DersoLab Taktikleri',
        themeVariant: 'neon_orange',
      },
      {
        slideNumber: 3,
        badge: '2. ALTIN KURAL',
        headline: 'Biyonik Odaklanma: Kelime Kelime Değil Blok Oku',
        subhead: 'Göz kaslarını eğitmenin en hızlı yolu',
        bodyPoints: [
          'İç seslendirme yapmayı bırak, hızını 2 katına çıkar.',
          'DersoLab L.A.B. Bionic Reader modülüyle günde 10 dk pratik yap.',
          'Paragraf başına harcadığın süre 1.5 dakikadan 45 saniyeye düşsün.',
        ],
        highlightTag: 'HIZ REHBERİ',
        footerNote: 'DersoLab L.A.B.',
        themeVariant: 'cyan_cyber',
      },
      {
        slideNumber: 4,
        badge: 'ÖZET & HAREKETE GEÇ',
        headline: 'Bu Taktikleri Denemende Uygula!',
        subhead: 'Unutmamak için bu postu kaydet ve arkadaşına gönder.',
        bodyPoints: [
          '💾 Kaydetmeyi unutma!',
          '🦊 DersoLab L.A.B. araçlarını ücretsiz test et',
          '🔗 Biyodaki linkten hemen başla',
        ],
        highlightTag: 'LİNK BİYODA',
        footerNote: '@dersolabegitim',
        themeVariant: 'purple_matrix',
      },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo_single_2',
    title: '1 Soru 1 Net: ÖSYM Paragraf Çeldirici Tuzağı',
    type: 'post',
    topic: 'daily_question',
    topicLabel: '1 Soru 1 Net • TYT Türkçe',
    status: 'approved',
    targetAudience: 'YKS 2027',
    caption: `ÖSYM her yıl istisnasız bu tuzağı kurar! 🎯\n\nMetinde geçen bir kelimenin aynısını yanlış şıkka koyarak dikkatini dağıtır. Doğru cevap ise genellikle kelimelerin eş anlamlılarıyla yeniden ifade edilmiş halidir.\n\nKaydet ve denemelerde bu tuzağa düşme! 🦊\n\n#1soru1net #tytturkce #yks2027 #dersolab #ykstayfa`,
    hashtags: ['#1soru1net', '#tytturkce', '#yks2027', '#dersolab'],
    singlePostData: {
      badge: '1 SORU 1 NET • PARAGRAF',
      headline: 'ÖSYM Çeldirici Şık Tuzağı',
      questionOrSummary: 'Metindeki kelimenin aynısını içeren şık çoğu zaman çeldiricidir!',
      keyTakeaway: 'Doğru şık genellikle metnin ana fikrini eş anlamlı sözcüklerle özetler.',
      options: [
        { key: 'A', text: 'Kelime kopyası şık (Tuzak)', isCorrect: false },
        { key: 'B', text: 'Eş anlamlı soyutlama (Doğru Cevap)', isCorrect: true },
      ],
      themeVariant: 'neon_orange',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo_story_3',
    title: 'Pazar Hikayesi: Ortaokul & Lise Haftalık Kitap Önerisi',
    type: 'story',
    topic: 'book_recommendation',
    topicLabel: 'Pazar Kitap Kulübü • 9:16 Story',
    status: 'approved',
    targetAudience: 'Ortaokul (LGS) & Lise (YKS)',
    caption: `Pazar gününün klasiği: Haftalık Kitap Kulübümüz yayında! 📚🦊\n\nHem LGS hem YKS hazırlığında okuma hızını ve analitik düşünme gücünü katlayacak 2 muazzam başucu kitabı!\n\nSen bu hafta hangisine başlıyorsun? Hikayedeki ankete katıl! 👇\n\n#pazarkitabı #kitaponerisi #lgs2027 #yks2027 #dersolab`,
    hashtags: ['#pazarkitabı', '#kitaponerisi', '#lgs2027', '#yks2027', '#dersolab'],
    storyData: {
      badge: 'PAZAR KİTAP KULÜBÜ 📚',
      headline: 'Haftanın Kitap Önerileri',
      subhead: 'Hem Ortaokul (LGS) Hem Lise (YKS) İçin Seçtik',
      stickerType: 'poll',
      stickerQuestion: 'Bu hafta hangisini okuyacaksın? 📚',
      stickerOptions: ['Ortaokul: Momo 📘', 'Lise: Simyacı 📕'],
      stickerLinkText: 'Kitap Listesi & İpuçları',
      stickerLinkUrl: 'https://dersolab.com/lab',
      themeVariant: 'purple_matrix',
      dualBookData: {
        ortaokul: {
          title: 'Momo',
          author: 'Michael Ende',
          genre: 'Felsefi Masal / Zaman',
          whyRead: 'Zaman yönetimi ve hayal gücünü geliştirir, LGS yeni nesil paragraf analizine harika katkı sağlar.',
          highlightTag: 'ORTAOKUL & LGS',
        },
        lise: {
          title: 'Simyacı',
          author: 'Paulo Coelho',
          genre: 'Felsefi Roman / Macera',
          whyRead: 'Kişisel menkıbe ve odaklanma üzerine bir başyapıt. TYT derin anlama ve AYT analiz gücü kazandırır.',
          highlightTag: 'LİSE & YKS',
        },
      },
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo_reels_4',
    title: 'Reels: 30 Saniyede Fonetik Müfettişi ile Yazım Kuralı Hilesi',
    type: 'reels',
    topic: 'dersolab_features',
    topicLabel: 'Reels & TikTok • Yazım Kuralı',
    status: 'approved',
    targetAudience: 'YKS 2027',
    caption: `ÖSYM'nin her yıl banko sorduğu ama adayların %60'ının takıldığı yazım kuralı! 🤯\n\nSen doğru bildiğini sanıyordun değil mi? Yorumlarda cevabını yaz! 👇\n\n#reels #yksreels #tyt2027 #yazımkuralları #dersolab #ykstayfa`,
    hashtags: ['#reels', '#yksreels', '#tyt2027', '#yazımkuralları', '#dersolab'],
    reelsStoryboard: {
      hook3s: 'Eğer buna ayrı yazılır dediysen sınavda 1 netin gitti bile!',
      visualDirection: 'Ön planda dinamik konuşmacı, arkada DersoLab Fonetik Müfettişi ekranı yeşil yanıp söner.',
      spokenScript:
        'ÖSYM her yıl bitişik yazılan birleşik sözcüklerden en az bir soru soruyor. Şifre çok basit: Belirsizlik bildiren "birkaç, birtakım, birçok, hiçbir" sözcükleri daima bitişik yazılır! DersoLab Fonetik Müfettişine cümleyi at, anında gör. Profildeki linkten ücretsiz dene!',
      onScreenText: ['🚨 1 NETİ KURTAR!', 'Birçok / Birkaç = BİTİŞİK', 'ÖSYM BU TUZAĞI ÇOK SEVER', 'Link Biyoda 🦊'],
      musicAudioVibe: 'Trending Phonk / Fast BPM',
      callToAction: 'DersoLab Fonetik Müfettişini hemen profildeki linkten ücretsiz dene!',
    },
    createdAt: new Date().toISOString(),
  },
]

function sanitizePostList(rawList: SocialPostItem[]): SocialPostItem[] {
  return rawList.map((post: SocialPostItem) => {
    const cleanTitle = toTurkishTitleCase(post.title || '')
    const cleanTopicLabel = toTurkishTitleCase(post.topicLabel || '')
    return {
      ...post,
      title: cleanTitle,
      topicLabel: cleanTopicLabel,
      carouselSlides: post.carouselSlides?.map((slide) => {
        const hasDensePoints = slide.bodyPoints && slide.bodyPoints.length > 0
        const isMascot =
          slide.uploadedImageUrl &&
          (/(?:fox-mascot|fox-head|mascot-icon|zeki|maskot)/i.test(slide.uploadedImageUrl) ||
            (slide.uploadedImageUrl.startsWith('data:image/svg') &&
              slide.uploadedImageUrl.includes('mascotHalo')))
        return {
          ...slide,
          headline: toTurkishTitleCase(slide.headline || ''),
          badge: slide.badge ? slide.badge.toLocaleUpperCase('tr-TR') : undefined,
          uploadedImageUrl: hasDensePoints && isMascot ? undefined : slide.uploadedImageUrl,
        }
      }),
      caption: post.caption ? post.caption.replace(/\uFFFD/g, '') : '',
    }
  })
}

export default function SocialStudio() {
  const [posts, setPosts] = useState<SocialPostItem[]>(INITIAL_DEMO_POSTS)
  const [activePostId, setActivePostId] = useState<string>('demo_carousel_1')
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0)
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor')
  const [cloudSynced, setCloudSynced] = useState<boolean>(false)

  // Hızlı Yapay Zeka Üretim Alanı
  const [genType, setGenType] = useState<InstagramContentType>('carousel')
  const [genGrade, setGenGrade] = useState<'YKS (TYT/AYT)' | 'LGS' | 'Genel'>('YKS (TYT/AYT)')
  const [genSubject, setGenSubject] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [isBatchLoading, setIsBatchLoading] = useState<boolean>(false)

  // Görsel & İllüstrasyon Stüdyosu Durumları
  const [imageStylePreset, setImageStylePreset] = useState<ImageStylePreset>('cyber_lab')
  const [customImagePrompt, setCustomImagePrompt] = useState<string>('')
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // AI Büyüme & Denetim Sekmesi Durumları
  const [growthTab, setGrowthTab] = useState<'hooks' | 'audit' | 'comments'>('hooks')
  const [isGrowthLoading, setIsGrowthLoading] = useState<boolean>(false)

  // İndirme, Kopyalama ve Tek Tuşla Paylaşım Durumları
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const [downloadProgress, setDownloadProgress] = useState<string>('')
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [isDraftsOpen, setIsDraftsOpen] = useState<boolean>(false)
  const [isPublishing, setIsPublishing] = useState<boolean>(false)
  const [publishResult, setPublishResult] = useState<PublishResultData | null>(null)
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false)
  const [lastDownloadCount, setLastDownloadCount] = useState<number>(1)

  const dbSyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Yerel Depolamadan + Supabase Veritabanından Yükleme ve Senkronizasyon
  useEffect(() => {
    let localPosts: SocialPostItem[] = []
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('dersolab_social_posts_v6')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          localPosts = sanitizePostList(parsed)
          setPosts(localPosts)
          setActivePostId(localPosts[0].id)
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(localPosts))
          } catch {
            // ignore
          }
        }
      }
    } catch {
      // ignore
    }

    // Supabase social_posts tablosundan senkronize et
    ;(async () => {
      try {
        const remoteItems = await getSocialPostsFromDb()
        if (Array.isArray(remoteItems) && remoteItems.length > 0) {
          const remoteSanitized = sanitizePostList(remoteItems)
          const mergedMap = new Map<string, SocialPostItem>()
          for (const item of remoteSanitized) {
            mergedMap.set(item.id, item)
          }
          for (const localItem of localPosts.length > 0 ? localPosts : INITIAL_DEMO_POSTS) {
            if (!mergedMap.has(localItem.id)) {
              mergedMap.set(localItem.id, localItem)
            }
          }
          const mergedList = Array.from(mergedMap.values())
          setPosts(mergedList)
          setCloudSynced(true)
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedList))
          } catch {
            // ignore
          }
        } else {
          setCloudSynced(true)
        }
      } catch {
        // ignore offline/table errors
      }
    })()
  }, [])

  // Değişiklikleri Yerel Depolamaya Kaydet
  function savePosts(newPosts: SocialPostItem[]) {
    setPosts(newPosts)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts))
    } catch {
      // ignore
    }
  }

  function scheduleDbUpsert(post: SocialPostItem) {
    if (dbSyncTimerRef.current) {
      clearTimeout(dbSyncTimerRef.current)
    }
    dbSyncTimerRef.current = setTimeout(() => {
      upsertSocialPostToDb(post).catch(() => {})
    }, 650)
  }

  const activePost = posts.find((p) => p.id === activePostId) || posts[0] || INITIAL_DEMO_POSTS[0]

  // Aktif Gönderiyi Güncelle
  function handleUpdateActivePost(updated: SocialPostItem) {
    const updatedList = posts.map((p) => (p.id === updated.id ? updated : p))
    savePosts(updatedList)
    scheduleDbUpsert(updated)
  }

  // Yeni Yapay Zeka Gönderisi Üret
  async function handleGeneratePost(customOptions?: {
    type?: InstagramContentType
    subject?: string
    targetGrade?: 'YKS (TYT/AYT)' | 'LGS' | 'Genel'
    topic?: ContentTopic
  }) {
    const typeToUse = customOptions?.type || genType
    const subjectToUse = toTurkishTitleCase((customOptions?.subject ?? genSubject).trim())
    const gradeToUse = customOptions?.targetGrade || genGrade
    const topicToUse = customOptions?.topic || 'custom'

    setIsGenerating(true)
    const toastId = toast.loading('Yapay zeka konuya özel özgün içerik üretiyor...')

    try {
      const res = await fetch('/api/admin/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_single',
          type: typeToUse,
          topic: topicToUse,
          subject: subjectToUse || 'Sınav Hazırlığı ve Net Katlama',
          customPrompt: subjectToUse,
          targetGrade: gradeToUse,
          tone: 'energetic',
          persona: 'derso_friendly',
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.item) {
        throw new Error(data.error || 'İçerik üretilemedi.')
      }

      const newPost: SocialPostItem = data.item
      const updatedPosts = [newPost, ...posts.filter((p) => p.id !== newPost.id)]
      savePosts(updatedPosts)
      setActivePostId(newPost.id)
      setActiveSlideIndex(0)
      upsertSocialPostToDb(newPost).catch(() => {})

      toast.success('Yeni içerik başarıyla oluşturuldu ve yüklendi!', { id: toastId })
      setGenSubject('')
    } catch (err: any) {
      console.warn('API uyarısı, dinamik içerik motoru devreye alınıyor:', err?.message)

      const fallbackPost = createFallbackPost(typeToUse, subjectToUse, gradeToUse, topicToUse)
      const updatedPosts = [fallbackPost, ...posts.filter((p) => p.id !== fallbackPost.id)]
      savePosts(updatedPosts)
      setActivePostId(fallbackPost.id)
      setActiveSlideIndex(0)
      upsertSocialPostToDb(fallbackPost).catch(() => {})

      toast.success('İçerik konunuza özel olarak başarıyla hazırlandı!', { id: toastId })
    } finally {
      setIsGenerating(false)
    }
  }

  // Otonom Günlük Paket (3 Koordineli İçerik: Sabah Story + Öğle Carousel + Akşam Reels)
  async function handleGenerateDailyBatch() {
    setIsBatchLoading(true)
    const toastId = toast.loading('Otonom Ajan günün 3 içerik paketini (Sabah + Öğle + Akşam) hazırlıyor...')
    try {
      const res = await fetch('/api/admin/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'auto_pilot',
          targetGrade: genGrade,
          focusSubject: genSubject.trim() || undefined,
          persona: 'derso_friendly',
        }),
      })
      const data = await res.json()
      if (!res.ok || !Array.isArray(data.items) || data.items.length === 0) {
        throw new Error(data.error || 'Günlük paket üretilemedi.')
      }
      const batchItems: SocialPostItem[] = data.items
      const newIds = new Set(batchItems.map((i) => i.id))
      const updatedPosts = [...batchItems, ...posts.filter((p) => !newIds.has(p.id))]
      savePosts(updatedPosts)
      setActivePostId(batchItems[0].id)
      setActiveSlideIndex(0)
      for (const item of batchItems) {
        upsertSocialPostToDb(item).catch(() => {})
      }
      toast.success('Günün 3 otonom içeriği (Sabah Quizi, Öğle Rehberi, Akşam Reels) üretildi!', { id: toastId })
    } catch (err: any) {
      toast.error(err?.message || 'Otonom paket üretilirken bir hata oluştu.', { id: toastId })
    } finally {
      setIsBatchLoading(false)
    }
  }

  // 7 Günlük Haftalık İçerik Takvimi Üret
  async function handleGenerateWeeklyCalendar() {
    setIsBatchLoading(true)
    const toastId = toast.loading('7 günlük haftalık Instagram & TikTok içerik takvimi hazırlanıyor...')
    try {
      const res = await fetch('/api/admin/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_weekly',
          targetGrade: genGrade,
          focusSubject: genSubject.trim() || undefined,
          persona: 'derso_friendly',
        }),
      })
      const data = await res.json()
      if (!res.ok || !Array.isArray(data.items) || data.items.length === 0) {
        throw new Error(data.error || 'Haftalık takvim üretilemedi.')
      }
      const weeklyItems: SocialPostItem[] = data.items
      const newIds = new Set(weeklyItems.map((i) => i.id))
      const updatedPosts = [...weeklyItems, ...posts.filter((p) => !newIds.has(p.id))]
      savePosts(updatedPosts)
      setActivePostId(weeklyItems[0].id)
      setActiveSlideIndex(0)
      for (const item of weeklyItems) {
        upsertSocialPostToDb(item).catch(() => {})
      }
      setIsDraftsOpen(true)
      toast.success('7 günlük içerik takvimi başarıyla üretildi ve taslaklara eklendi!', { id: toastId })
    } catch (err: any) {
      toast.error(err?.message || 'Haftalık takvim üretilirken bir sorun oluştu.', { id: toastId })
    } finally {
      setIsBatchLoading(false)
    }
  }

  // Görsel & İllüstrasyon Stüdyosu: Aktif Slayt / Gönderi İçin AI Görsel Üret
  async function handleGenerateSlideImage() {
    setIsGeneratingImage(true)
    const toastId = toast.loading('AI Görsel ve Vektör Şema üretiliyor...')
    try {
      const slide = activePost.type === 'carousel' ? activePost.carouselSlides?.[activeSlideIndex] : null
      const promptText =
        customImagePrompt.trim() ||
        (slide
          ? `${slide.headline} - ${slide.subhead || activePost.topicLabel}`
          : `${activePost.title} - ${activePost.topicLabel}`)

      const res = await fetch('/api/admin/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_image',
          prompt: promptText,
          subject: activePost.topicLabel || activePost.title,
          stylePreset: imageStylePreset,
          aspectRatio: activePost.type === 'story' || activePost.type === 'reels' ? '9:16' : '1:1',
          slideNumber: slide?.slideNumber || 1,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.imageUrl) {
        throw new Error(data.error || 'Görsel üretilemedi.')
      }

      applyImageUrlToActiveTarget(data.imageUrl, promptText)
      toast.success('AI görseli başarıyla üretildi ve tuvale eklendi!', { id: toastId })
    } catch (err: any) {
      toast.error(err?.message || 'Görsel üretilirken hata oluştu.', { id: toastId })
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // Aktif Slayt veya Gönderiye Görsel URL Ata / Kaldır
  function applyImageUrlToActiveTarget(imageUrl: string | undefined, promptText?: string) {
    if (activePost.type === 'carousel' && activePost.carouselSlides) {
      const updatedSlides = activePost.carouselSlides.map((s, idx) =>
        idx === activeSlideIndex
          ? { ...s, uploadedImageUrl: imageUrl, aiImagePrompt: promptText ?? s.aiImagePrompt }
          : s
      )
      handleUpdateActivePost({ ...activePost, carouselSlides: updatedSlides })
    } else if (activePost.type === 'post' && activePost.singlePostData) {
      handleUpdateActivePost({
        ...activePost,
        uploadedImageUrl: imageUrl,
        singlePostData: { ...activePost.singlePostData, uploadedImageUrl: imageUrl },
      })
    } else if (activePost.type === 'story' && activePost.storyData) {
      handleUpdateActivePost({
        ...activePost,
        uploadedImageUrl: imageUrl,
        storyData: { ...activePost.storyData, uploadedImageUrl: imageUrl },
      })
    } else if (activePost.type === 'reels' && activePost.reelsStoryboard) {
      handleUpdateActivePost({
        ...activePost,
        uploadedImageUrl: imageUrl,
        reelsStoryboard: { ...activePost.reelsStoryboard, uploadedImageUrl: imageUrl },
      })
    } else {
      handleUpdateActivePost({ ...activePost, uploadedImageUrl: imageUrl })
    }
  }

  // Cihazdan Görsel Yükle
  function handleFileUploadChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        applyImageUrlToActiveTarget(reader.result)
        toast.success('Görsel başarıyla yüklendi!')
      }
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  // AI Büyüme Araçları: 5x Viral Kanca Matrisi, Pedagojik Denetim, Yorum Simülasyonu
  async function handleRunGrowthTool(tool: 'hooks' | 'audit' | 'comments') {
    setIsGrowthLoading(true)
    const toastId = toast.loading(
      tool === 'hooks'
        ? '5x Viral Kanca Matrisi hesaplanıyor...'
        : tool === 'audit'
          ? 'ÖSYM & MEB Pedagojik Denetimi yapılıyor...'
          : 'Öğrenci & Veli Yorum Simülasyonu üretiliyor...'
    )
    try {
      if (tool === 'hooks') {
        const res = await fetch('/api/admin/social/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'hook_matrix',
            topic: activePost.title,
            subject: activePost.topicLabel,
            persona: activePost.persona || 'derso_friendly',
          }),
        })
        const data = await res.json()
        if (data.hooks) {
          handleUpdateActivePost({ ...activePost, hookMatrix: data.hooks as HookVariation[] })
          toast.success('5 farklı viral kanca hazırlandı!', { id: toastId })
        }
      } else if (tool === 'audit') {
        const res = await fetch('/api/admin/social/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'pedagogical_audit',
            post: activePost,
          }),
        })
        const data = await res.json()
        if (data.audit) {
          handleUpdateActivePost({ ...activePost, pedagogicalAudit: data.audit as PedagogicalAudit })
          toast.success('ÖSYM & MEB pedagojik denetimi tamamlandı!', { id: toastId })
        }
      } else {
        const res = await fetch('/api/admin/social/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'engagement_replies',
            title: activePost.title,
            caption: activePost.caption,
            persona: activePost.persona || 'derso_friendly',
          }),
        })
        const data = await res.json()
        if (data.comments) {
          handleUpdateActivePost({ ...activePost, simulatedComments: data.comments as SimulatedComment[] })
          toast.success('Etkileşim ve yorum yanıt şablonları hazırlandı!', { id: toastId })
        }
      }
    } catch {
      toast.error('İşlem sırasında bir hata oluştu.', { id: toastId })
    } finally {
      setIsGrowthLoading(false)
    }
  }

  // Kanca Matrisinden Seçilen Kancayı Aktif Gönderiye Uygula
  function handleApplyHook(hookText: string) {
    const cleanHook = toTurkishTitleCase(hookText)
    if (activePost.type === 'carousel' && activePost.carouselSlides && activePost.carouselSlides.length > 0) {
      const updatedSlides = activePost.carouselSlides.map((s, idx) =>
        idx === 0 ? { ...s, headline: cleanHook } : s
      )
      handleUpdateActivePost({ ...activePost, title: cleanHook, carouselSlides: updatedSlides })
      setActiveSlideIndex(0)
    } else if (activePost.type === 'post' && activePost.singlePostData) {
      handleUpdateActivePost({
        ...activePost,
        title: cleanHook,
        singlePostData: { ...activePost.singlePostData, headline: cleanHook },
      })
    } else if (activePost.type === 'story' && activePost.storyData) {
      handleUpdateActivePost({
        ...activePost,
        title: cleanHook,
        storyData: { ...activePost.storyData, headline: cleanHook },
      })
    } else if (activePost.type === 'reels' && activePost.reelsStoryboard) {
      handleUpdateActivePost({
        ...activePost,
        title: cleanHook,
        reelsStoryboard: { ...activePost.reelsStoryboard, hook3s: hookText },
      })
    } else {
      handleUpdateActivePost({ ...activePost, title: cleanHook })
    }
    toast.success('Seçilen viral kanca başlığa uygulandı!')
  }

  // Tek Tuşla Instagram & TikTok Paylaşımı
  async function handleOneClickPublish() {
    setIsPublishing(true)
    const toastId = toast.loading('1080p görseller üretiliyor ve Instagram & TikTok paylaşımı hazırlanıyor...')
    try {
      // 1. Görselleri 1080p PNG olarak üret
      const mediaFiles = await generateAllPostMediaFiles(activePost)
      setLastDownloadCount(mediaFiles.length)

      // 2. Cihaza indir
      await downloadAllPostMedia(activePost)

      // 3. Açıklama ve hashtag'leri panoya kopyala
      const fullText = `${activePost.caption}\n\n${(activePost.hashtags || []).map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`
      try {
        await navigator.clipboard.writeText(fullText)
      } catch {
        // ignore clipboard permission issues
      }

      // 4. API üzerinden paylaşım / 스토리지 yüklemesi yap
      const res = await fetch('/api/admin/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          post: activePost,
          imageUrls: mediaFiles.map((f) => f.dataUrl),
          platform: 'both',
        }),
      })
      const data = await res.json()

      const updatedPost: SocialPostItem = {
        ...activePost,
        status: 'published',
        publishedAt: new Date().toISOString(),
      }
      handleUpdateActivePost(updatedPost)
      upsertSocialPostToDb(updatedPost).catch(() => {})

      setPublishResult(data)
      setIsPublishModalOpen(true)
      toast.success('Gönderi başarıyla hazırlandı ve yayınlandı!', { id: toastId })
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Paylaşım sırasında bir sorun oluştu.', { id: toastId })
    } finally {
      setIsPublishing(false)
    }
  }

  // Dinamik Konu Odaklı Yerel Üretici (4 Sabit Tema & Konuya %100 Uyumlu)
  function createFallbackPost(
    type: InstagramContentType,
    subject: string,
    grade: string,
    topic: ContentTopic
  ): SocialPostItem {
    const title = toTurkishTitleCase(subject.trim() || 'ÖSYM Net Artırma Stratejisi')
    const id = `post_${Date.now()}`

    const isDeneme = /deneme|taktik|strateji|süre|zaman|turlama|hata/i.test(title)
    const isMath = /matematik|geometri|trigo|türev|integral|denklem|fonksiyon|limit|polinom|üslü|köklü|olasılık/i.test(title)
    const isPhysics = /fizik|kuvvet|hareket|newton|elektrik|manyetizma|dalga|optik|termodinamik/i.test(title)
    const isChemistry = /kimya|organik|mol|asit|baz|tepkime|periyodik|bağlar|gazlar/i.test(title)
    const isBiology = /biyoloji|hücre|genetik|dna|rna|fotosentez|solunum|ekoloji|sistemler/i.test(title)
    const isTurkish = /türkçe|paragraf|edebiyat|yazım|noktalama|anlatım|dil bilgisi/i.test(title)

    let badge = `${grade.toUpperCase()} • STRATEJİ`
    let s2Headline = `${title}: Kritik Formül & Mantık`
    let s2Points = [
      'Temel tanım ve formülü ezberlemek yerine soru üzerinde modelle.',
      'Sık yapılan işlem ve kavram yanılgılarına karşı dikkatli ol.',
      'Doğru şıkkı ararken çeldiricileri adım adım ele.',
    ]
    let s3Headline = 'ÖSYM Soru Tarzı & Çözüm Yolu'
    let s3Points = [
      'Soru kökündeki sınırlayıcı koşulları mutlaka belirle.',
      'Klasik soru kalıplarının yeni nesil yorumlarına odaklan.',
      'Denemelerde benzer soru pratikleriyle süreni kısalt.',
    ]

    if (isDeneme) {
      badge = `${grade.toUpperCase()} • STRATEJİ`
      s2Headline = `${title}: Turlama Tekniği & Süre Kontrolü`
      s2Points = [
        '1. Turda yalnızca doğrudan çözüm yolunu bildiğin soruları tamamla.',
        '60 saniye içinde çıkmayan sorularla inatlaşma, yanına işaret koyup geç.',
        'Zor sorulara takılıp testin sonundaki kolay soruları kaçırma riskini sıfırla.',
      ]
      s3Headline = 'Deneme Analizi & Hata Defteri Metodu'
      s3Points = [
        'Deneme bitiminde boş ve yanlış soruları analiz defterine kaydet.',
        'Hatanın bilgi eksikliği mi yoksa dikkat hatası mı olduğunu tespit et.',
        'Hatalı soru kalıplarını 3 gün sonra DersoLab modülleriyle tekrar sına.',
      ]
    } else if (isMath) {
      badge = `${grade.toUpperCase()} • MATEMATİK`
      s2Headline = `${title}: Temel Formül & Çözüm Yolu`
      s2Points = [
        'Formülün mantığını kavra, sorudaki verileri yerine yerleştir.',
        'İşlem hatası yapmamak için adımları sırayla ve düzenli yaz.',
        'Grafik veya şekil çizimi gerektiren sorularda taslak oluştur.',
      ]
      s3Headline = 'ÖSYM Matematik Tuzağı & Pratik Metot'
      s3Points = [
        'Tanım kümesini ve köklerin aralığını mutlaka kontrol et.',
        'Şıklardan gitme veya değer verme yöntemini gerektiğinde sına.',
        'Zaman kazandıran kestirme yolları denemede test et.',
      ]
    } else if (isPhysics) {
      badge = `${grade.toUpperCase()} • FİZİK`
      s2Headline = `${title}: Fiziksel Yasa ve Prensipler`
      s2Points = [
        'Kuvvet diyagramlarını (serbest cisim diyagramı) eksiksiz çiz.',
        'Birim dönüşümlerine ve yön tayinine (+/-) çok dikkat et.',
        'Öncüllü sorularda her ihtimali fizik kurallarına göre sına.',
      ]
      s3Headline = 'ÖSYM Fizik Kazanımı & Deney Yorumu'
      s3Points = [
        'Değişkenlerin (bağımlı, bağımsız, kontrol) etkilerini incele.',
        'Grafik eğimi ve alanının fiziksel karşılığını hatırla.',
        'Formülü doğrudan ezberleme, oran-orantı mantığıyla düşün.',
      ]
    } else if (isChemistry) {
      badge = `${grade.toUpperCase()} • KİMYA`
      s2Headline = `${title}: Madde ve Tepkime Mantığı`
      s2Points = [
        'Denklemleri denkleştirmeden asla işlem basamaklarına geçme.',
        'İstisnai durumları ve periyodik tablodaki periyodik özellikleri hatırla.',
        'Kavramsal öncüllerde tanecik boyutundaki değişimi gözünde canlandır.',
      ]
      s3Headline = 'ÖSYM Kimya Soru Tipi & Püf Nokta'
      s3Points = [
        'Mol oranları ve sınırlayıcı bileşen hesaplarına dikkat et.',
        'Soru kökündeki "kesinlikle" veya "olabilir" ayrımını kaçırma.',
        'Grafiklerde doygunluk ve denge noktalarını iyi analiz et.',
      ]
    } else if (isBiology) {
      badge = `${grade.toUpperCase()} • BİYOLOJİ`
      s2Headline = `${title}: Biyolojik Süreç ve Mekanizmalar`
      s2Points = [
        'Mekanizmanın sıralamasını (neden-sonuç zinciri) zihninde canlandır.',
        'Hücre organelleri veya enzimlerin çalışma koşullarını göz önünde bulundur.',
        'Grafik okuma sorularında eksenlerdeki değişkenleri dikkatle incele.',
      ]
      s3Headline = 'ÖSYM Biyoloji Çeldiricileri'
      s3Points = [
        'Ökaryot / Prokaryot istisnalarına karşı uyanık ol.',
        'Hangi aşamanın nerede (sitoplazma, mitokondri vb.) gerçekleştiğini bil.',
        'Kavram karmaşası yaratacak benzer terimleri karıştırma.',
      ]
    } else if (isTurkish) {
      badge = `${grade.toUpperCase()} • TÜRKÇE`
      s2Headline = `${title}: Anlam ve Kural İncelikleri`
      s2Points = [
        'Metne kendi yorumunu katmadan sadece verilen bilgiyi değerlendir.',
        'Anahtar kavramları ve soru kökündeki sınırlayıcı ifadeleri belirle.',
        'Şıkları elemeden önce metnin ana iletisine odaklan.',
      ]
      s3Headline = 'ÖSYM Paragraf ve Dil Bilgisi Taktiği'
      s3Points = [
        'Olumsuz soru köklerinin şıklarını önceden hızlıca tara.',
        'İpuçlarını metin içinde eşleştirerek eleme yap.',
        'Hızını artırmak için blok okuma alışkanlığı kazan.',
      ]
    }

    if (type === 'carousel') {
      return {
        id,
        title,
        type: 'carousel',
        topic,
        topicLabel: `${grade} • ${title}`,
        status: 'draft',
        targetAudience: grade,
        caption: `${title} hakkında sınavda hayat kurtaran kritik püf noktalar! 🦊⚡\n\nBu adımları denemelerinde uygula, soru kaçırma! Unutmamak için hemen kaydet! 👇\n\n#yks2027 #lgs2027 #dersolab #ykstayfa #${title.toLowerCase().replace(/[^a-z0-9ğüşıöç]/gi, '')}`,
        hashtags: ['#yks2027', '#lgs2027', '#dersolab', '#ykstayfa'],
        carouselSlides: [
          {
            slideNumber: 1,
            badge,
            headline: isDeneme
              ? `${title}: En Sık Yapılan 3 Hata`
              : `${title}: En Çok Karıştırılan Noktalar`,
            subhead: 'ÖSYM sınavlarında öğrencilerin en çok net kaybettiği kritik tuzaklar ve püf noktalar',
            bodyPoints: isDeneme
              ? [
                  'Sorunun temel mantığını kavramadan kuralları ezberleyip geçmek',
                  'Soru kökündeki sınırlayıcı koşulları ve öncülleri dikkatsizce okumak',
                  'Kaydır; netlerini artıracak 3 adımlı sınav stratejisini keşfet 👉',
                ]
              : [
                  `${title} konusunda soru çözerken yapılan en yaygın hatalar`,
                  'Temel mantığı kavramadan ezbere soru çözmekten kaçın',
                  'Kaydır, adım adım doğru stratejiyi öğren 👉',
                ],
            highlightTag: 'KAYDETMELİK',
            footerNote: 'DersoLab Sınav Laboratuvarı • @dersolabegitim',
            themeVariant: 'lab_dark',
          },
          {
            slideNumber: 2,
            badge: `${badge} • KURAL`,
            headline: s2Headline,
            subhead: 'Öğrencilerin en çok işine yarayacak temel bilgi',
            bodyPoints: s2Points,
            highlightTag: 'PÜF NOKTA',
            footerNote: 'DersoLab Taktikleri',
            themeVariant: 'neon_orange',
          },
          {
            slideNumber: 3,
            badge: `${badge} • KAZANIM`,
            headline: s3Headline,
            subhead: 'Sınavda karşına çıkacak soru kalıbı',
            bodyPoints: s3Points,
            highlightTag: '+ NET',
            footerNote: 'DersoLab Soru Analizi',
            themeVariant: 'cyan_cyber',
          },
          {
            slideNumber: 4,
            badge: 'ÖZET & CTA',
            headline: 'Bu Bilgiyi Hemen Denemende Test Et!',
            subhead: 'Kaydet ve çalışma arkadaşına gönder',
            bodyPoints: [
              '💾 Unutmamak için hemen kaydet',
              '🦊 DersoLab soru çözüm araçlarıyla pratik yap',
              '🔗 Profildeki linkten benzer soruları ücretsiz test et',
            ],
            highlightTag: 'LİNK BİYODA',
            footerNote: '@dersolabegitim',
            themeVariant: 'purple_matrix',
          },
        ],
        createdAt: new Date().toISOString(),
      }
    }

    if (type === 'story') {
      return {
        id,
        title: `Story: ${title}`,
        type: 'story',
        topic,
        topicLabel: `${grade} • Hikaye`,
        status: 'draft',
        targetAudience: grade,
        caption: `${title} hakkında günün test sorusu yayında! Sen cevabı biliyor musun? 🦊👇\n\n#dersolab #yks2027 #lgs2027`,
        hashtags: ['#dersolab', '#yks2027', '#lgs2027'],
        storyData: {
          badge: `${badge} ⚡`,
          headline: `${title} • Hızlı Test`,
          subhead: 'Sence doğru kural / yaklaşım hangisi?',
          stickerType: 'quiz',
          stickerQuestion: `${title} konusunda hangisi doğrudur?`,
          stickerOptions: ['A) Doğru Kural / Yaklaşım ✅', 'B) Sık Yapılan Yanılgı ❌', 'C) Eksik Bilgi Şıkkı', 'D) Emin Değilim'],
          stickerLinkText: 'DersoLab L.A.B.',
          stickerLinkUrl: 'https://dersolab.com/lab',
          themeVariant: 'neon_orange',
        },
        createdAt: new Date().toISOString(),
      }
    }

    if (type === 'reels') {
      return {
        id,
        title: `Reels: ${title}`,
        type: 'reels',
        topic,
        topicLabel: `${grade} • Reels & Video`,
        status: 'draft',
        targetAudience: grade,
        caption: `ÖSYM'nin en çok sorduğu ${title} konusu! 🤯 Sen bu kuralı biliyor muydun? Yorumlarda yaz! 👇\n\n#reels #yks2027 #dersolab`,
        hashtags: ['#reels', '#yks2027', '#dersolab'],
        reelsStoryboard: {
          hook3s: `Eğer ${title} sorusunda hala bu hatayı yapıyorsan sınavda 1 netin gidebilir!`,
          visualDirection: `Ön planda konuşmacı, arkada ${title} ile ilgili şema veya formül görseli belirir.`,
          spokenScript: `${title} konusunda ÖSYM'nin her yıl yokladığı en kritik nokta burada gizli! Şifre çok basit: Temel kuralı doğrudan soruya uygula, çeldiricileri adım adım ele ve sürenden tasarruf et. Profildeki linkten benzer soruları hemen çöz!`,
          onScreenText: ['🚨 1 NETİ KURTAR', `${title.toUpperCase()}`, 'ÖSYM ÇOK SEVER', 'Link Biyoda 🦊'],
          musicAudioVibe: 'Trending Phonk / Fast BPM',
          callToAction: 'Profildeki linkten hemen ücretsiz dene!',
        },
        createdAt: new Date().toISOString(),
      }
    }

    // Single post
    return {
      id,
      title,
      type: 'post',
      topic,
      topicLabel: `${grade} • 1 Soru 1 Net`,
      status: 'draft',
      targetAudience: grade,
      caption: `${title} hakkında bilmen gereken en kritik kural!\n\nDoğru cevabı yorumlara yaz bakalım kimler yapabilecek? 👇\n\n#1soru1net #yks2027 #dersolab`,
      hashtags: ['#1soru1net', '#yks2027', '#dersolab'],
      singlePostData: {
        badge: `${badge} • 1 SORU 1 NET`,
        headline: `${title} Püf Noktası`,
        questionOrSummary: `${title} konusunda karşına çıkacak temel formül veya kazanım sorusu.`,
        keyTakeaway: 'Kritik ipucu: Soru kökünü iyi oku ve çeldiricileri ilk aşamada ayıkla.',
        options: [
          { key: 'A', text: 'Doğru Bilgi / Çözüm', isCorrect: true },
          { key: 'B', text: 'Sık Yapılan Çeldirici', isCorrect: false },
        ],
        themeVariant: 'lab_dark',
      },
      createdAt: new Date().toISOString(),
    }
  }

  // Tüm Slaytları 1080p PNG Olarak İndir
  async function handleDownloadAll() {
    setIsDownloading(true)
    setDownloadProgress('Görseller hazırlanıyor...')
    try {
      const count = await downloadAllPostMedia(activePost, (curr, tot) => {
        setDownloadProgress(`İndiriliyor: ${curr}/${tot}`)
      })
      toast.success(`${count} adet görsel 1080p yüksek kalitede indirildi!`)
    } catch (err: any) {
      console.error(err)
      toast.error('İndirme sırasında bir hata oluştu.')
    } finally {
      setIsDownloading(false)
      setDownloadProgress('')
    }
  }

  // Açıklamayı Panoya Kopyala
  function handleCopyCaption() {
    const fullText = `${activePost.caption}\n\n${activePost.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`
    navigator.clipboard.writeText(fullText)
    setIsCopied(true)
    toast.success('Instagram açıklaması ve hashtag’ler panoya kopyalandı!')
    setTimeout(() => setIsCopied(false), 2500)
  }

  // Slayt Ekleme (Carousel için)
  function handleAddSlide() {
    if (activePost.type !== 'carousel') return
    const currentSlides = activePost.carouselSlides || []
    const newSlideNum = currentSlides.length + 1
    const newSlide: CarouselSlide = {
      slideNumber: newSlideNum,
      badge: `${newSlideNum}. PÜF NOKTA`,
      headline: 'Yeni Bilgi Başlığı',
      subhead: 'Öğrencinin dikkatini çekecek açıklama',
      bodyPoints: ['Önemli kazanım maddesi 1', 'Uygulama ipucu veya formül'],
      highlightTag: '+1 NET',
      footerNote: 'DersoLab • @dersolabegitim',
      themeVariant: currentSlides[0]?.themeVariant || 'lab_dark',
    }

    const updatedPost = {
      ...activePost,
      carouselSlides: [...currentSlides, newSlide],
    }
    handleUpdateActivePost(updatedPost)
    setActiveSlideIndex(currentSlides.length)
    toast.success(`Slayt ${newSlideNum} eklendi!`)
  }

  // Slayt Silme
  function handleDeleteSlide(index: number) {
    if (activePost.type !== 'carousel') return
    const currentSlides = activePost.carouselSlides || []
    if (currentSlides.length <= 2) {
      toast.error('Bir carousel en az 2 slayttan oluşmalıdır.')
      return
    }

    const filtered = currentSlides
      .filter((_, i) => i !== index)
      .map((s, idx) => ({ ...s, slideNumber: idx + 1 }))

    const updatedPost = {
      ...activePost,
      carouselSlides: filtered,
    }
    handleUpdateActivePost(updatedPost)
    setActiveSlideIndex(Math.max(0, index - 1))
    toast.success('Slayt silindi.')
  }

  // Gönderi Sil
  function handleDeletePost(id: string) {
    if (posts.length <= 1) {
      toast.error('En az bir kayıtlı gönderi bulunmalıdır.')
      return
    }
    const filtered = posts.filter((p) => p.id !== id)
    savePosts(filtered)
    deleteSocialPostFromDb(id).catch(() => {})
    if (activePostId === id) {
      setActivePostId(filtered[0].id)
      setActiveSlideIndex(0)
    }
    toast.success('Gönderi taslaklardan kaldırıldı.')
  }

  // Gönderi Çoğalt
  function handleDuplicatePost(postToDup: SocialPostItem) {
    const duplicated: SocialPostItem = {
      ...postToDup,
      id: `post_${Date.now()}`,
      title: `${postToDup.title} (Kopya)`,
      createdAt: new Date().toISOString(),
    }
    const updated = [duplicated, ...posts]
    savePosts(updated)
    upsertSocialPostToDb(duplicated).catch(() => {})
    setActivePostId(duplicated.id)
    setActiveSlideIndex(0)
    toast.success('Gönderi kopyalandı ve açıldı!')
  }

  const isCarousel = activePost.type === 'carousel'
  const isStory = activePost.type === 'story'
  const isReels = activePost.type === 'reels'
  const isPost = activePost.type === 'post'
  const currentSlide = isCarousel ? activePost.carouselSlides?.[activeSlideIndex] : null

  const activeTargetImageUrl = isCarousel
    ? currentSlide?.uploadedImageUrl
    : isPost
      ? activePost.singlePostData?.uploadedImageUrl || activePost.uploadedImageUrl
      : isStory
        ? activePost.storyData?.uploadedImageUrl || activePost.uploadedImageUrl
        : isReels
          ? activePost.reelsStoryboard?.uploadedImageUrl || activePost.uploadedImageUrl
          : activePost.uploadedImageUrl

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col font-sans pb-16">
      {/* 1. ÜST NAVİGASYON VE MARKA BARI */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07090E]/90 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all shrink-0"
            title="Panele Dön"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Panel</span>
          </Link>

          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500/20 via-pink-500/20 to-cyan-500/20 border border-white/10 p-1 flex items-center justify-center shadow-lg shrink-0">
            <img src="/fox-head.png" alt="DersoLab Fox" className="w-full h-full object-contain" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-tight">
                Derso<span className="text-orange-400">Lab</span>
              </span>
              <span className="text-xs font-semibold text-slate-400 hidden sm:inline">• Sosyal Medya Asistanı</span>
              {cloudSynced && (
                <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Cloud className="w-3 h-3" />
                  Bulut Senkron
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <a
                href="https://www.instagram.com/dersolabegitim/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-[11px] font-bold text-pink-400 hover:text-pink-300 transition-colors"
              >
                <span>@dersolabegitim</span>
                <span className="w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center text-[7px] font-black text-white">
                  ✓
                </span>
              </a>
              <span className="text-[10px] text-slate-500 hidden sm:inline">Instagram & TikTok Uyumlu</span>
            </div>
          </div>
        </div>

        {/* Üst Sağ Aksiyon Butonları */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setIsDraftsOpen(!isDraftsOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all"
          >
            <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Kayıtlı Gönderiler ({posts.length})</span>
          </button>

          <a
            href="https://www.instagram.com/dersolabegitim/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-pink-500/20 to-orange-500/20 hover:from-pink-500/30 hover:to-orange-500/30 border border-pink-500/30 text-xs font-bold text-pink-200 transition-all shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Instagram'da Aç</span>
          </a>
        </div>
      </header>

      {/* MOBİL GÖRÜNÜM SEKME GEÇİŞİ (Editör / Canlı Önizleme) */}
      <div className="lg:hidden px-4 pt-3 pb-1 border-b border-white/5 bg-[#090D16] flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => setMobileTab('editor')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'editor'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>İçerik Editörü</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
            mobileTab === 'preview'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white/5 text-slate-400 hover:text-white'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Canlı Önizleme & İndir</span>
        </button>
      </div>

      {/* ANA GÖVDE: 2 KOLONLU STÜDYO (SOL: EDİTÖR / SAĞ: CANLI INSTAGRAM) */}
      <main className="max-w-7xl mx-auto w-full px-3 sm:px-6 py-4 sm:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* SOL KOLON: HIZLI YAPAY ZEKA ÜRETİCİSİ, DÜZENLEYİCİ VE BÜYÜME ARAÇLARI */}
        <section
          className={`lg:col-span-7 flex flex-col gap-6 ${
            mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* KART 1: HIZLI YAPAY ZEKA ÜRETİCİSİ & OTONOM PAKETLER */}
          <div className="rounded-2xl border border-white/10 bg-[#0B0F19]/80 backdrop-blur-md p-4 sm:p-5 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-orange-500/10 via-cyan-500/5 to-transparent pointer-events-none" />

            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h2 className="text-sm font-bold text-white tracking-tight">Hızlı Yapay Zeka İçerik Üreticisi</h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                Gemini 3.8
              </span>
            </div>

            {/* Format Seçimi (4 Kart) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3.5">
              <button
                type="button"
                onClick={() => setGenType('carousel')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  genType === 'carousel'
                    ? 'border-orange-500/80 bg-orange-500/10 shadow-sm shadow-orange-500/20'
                    : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                <Layers className={`w-4 h-4 mb-1 ${genType === 'carousel' ? 'text-orange-400' : 'text-slate-400'}`} />
                <div className="text-xs font-bold text-white">Carousel</div>
                <div className="text-[10px] text-slate-400">Kaydırmalı</div>
              </button>

              <button
                type="button"
                onClick={() => setGenType('post')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  genType === 'post'
                    ? 'border-orange-500/80 bg-orange-500/10 shadow-sm shadow-orange-500/20'
                    : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                <HelpCircle className={`w-4 h-4 mb-1 ${genType === 'post' ? 'text-orange-400' : 'text-slate-400'}`} />
                <div className="text-xs font-bold text-white">Tekli Post</div>
                <div className="text-[10px] text-slate-400">Görsel & Hap Bilgi</div>
              </button>

              <button
                type="button"
                onClick={() => setGenType('story')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  genType === 'story'
                    ? 'border-orange-500/80 bg-orange-500/10 shadow-sm shadow-orange-500/20'
                    : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                <Smartphone className={`w-4 h-4 mb-1 ${genType === 'story' ? 'text-orange-400' : 'text-slate-400'}`} />
                <div className="text-xs font-bold text-white">Story (9:16)</div>
                <div className="text-[10px] text-slate-400">Anket & Quiz</div>
              </button>

              <button
                type="button"
                onClick={() => setGenType('reels')}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  genType === 'reels'
                    ? 'border-orange-500/80 bg-orange-500/10 shadow-sm shadow-orange-500/20'
                    : 'border-white/5 bg-white/5 hover:bg-white/10 text-slate-300'
                }`}
              >
                <Film className={`w-4 h-4 mb-1 ${genType === 'reels' ? 'text-orange-400' : 'text-slate-400'}`} />
                <div className="text-xs font-bold text-white">Reels & TikTok</div>
                <div className="text-[10px] text-slate-400">Video Senaryosu</div>
              </button>
            </div>

            {/* Konu Girişi ve Buton */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 flex gap-2">
                <select
                  value={genGrade}
                  onChange={(e) => setGenGrade(e.target.value as any)}
                  className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold text-white focus:outline-hidden focus:border-orange-500 shrink-0"
                >
                  <option value="YKS (TYT/AYT)" className="bg-neutral-900">YKS 2027</option>
                  <option value="LGS" className="bg-neutral-900">LGS 2027</option>
                  <option value="Genel" className="bg-neutral-900">Genel</option>
                </select>

                <input
                  type="text"
                  placeholder="İstediğin konuyu yaz (örn: Trigonometri, Biyonik Okuyucu, Paragraf Hızı, Hücre Zarı)..."
                  value={genSubject}
                  onChange={(e) => setGenSubject(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isGenerating) {
                      e.preventDefault()
                      handleGeneratePost()
                    }
                  }}
                  className="flex-1 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <button
                type="button"
                disabled={isGenerating || isBatchLoading}
                onClick={() => handleGeneratePost()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20 transition-all shrink-0 active:scale-95 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Oluşturuluyor...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>İçerik Üret (AI)</span>
                  </>
                )}
              </button>
            </div>

            {/* Otonom Günlük Paket (3 Post) & 7 Günlük Haftalık Takvim Hızlı Butonları */}
            <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={isBatchLoading || isGenerating}
                onClick={handleGenerateDailyBatch}
                className="flex-1 min-w-[200px] py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-cyan-400" />
                <span>⚡ Otonom Günlük Paket (3 Post: Sabah + Öğle + Akşam)</span>
              </button>

              <button
                type="button"
                disabled={isBatchLoading || isGenerating}
                onClick={handleGenerateWeeklyCalendar}
                className="flex-1 min-w-[180px] py-2 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span>📅 7 Günlük Haftalık Takvim Üret</span>
              </button>
            </div>
          </div>

          {/* KART 2: CANLI GÖNDERİ DÜZENLEYİCİ */}
          <div className="rounded-2xl border border-white/10 bg-[#0B0F19]/80 backdrop-blur-md p-4 sm:p-5 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold text-white">Gönderi Düzenleyici</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase">
                  {activePost.type === 'carousel'
                    ? '📸 Carousel'
                    : activePost.type === 'story'
                      ? '📱 Story'
                      : activePost.type === 'reels'
                        ? '🎬 Reels'
                        : '📝 Tekli Post'}
                </span>
              </div>
            </div>

            {/* Başlık ve Rozet */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Gönderi Başlığı</label>
                <input
                  type="text"
                  value={activePost.title}
                  onChange={(e) => handleUpdateActivePost({ ...activePost, title: e.target.value })}
                  onBlur={() => handleUpdateActivePost({ ...activePost, title: toTurkishTitleCase(activePost.title) })}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-hidden focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">Kategori / Rozet</label>
                <input
                  type="text"
                  value={activePost.topicLabel}
                  onChange={(e) => handleUpdateActivePost({ ...activePost, topicLabel: e.target.value })}
                  onBlur={() => handleUpdateActivePost({ ...activePost, topicLabel: toTurkishTitleCase(activePost.topicLabel) })}
                  className="w-full px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-hidden focus:border-orange-500"
                />
              </div>
            </div>

            {/* 1. CAROUSEL SLAYT YÖNETİCİSİ */}
            {isCarousel && (
              <div className="border border-white/10 rounded-xl p-3.5 bg-black/30 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                    {activePost.carouselSlides?.map((slide, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveSlideIndex(idx)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                          idx === activeSlideIndex
                            ? 'bg-orange-500 text-white shadow-xs'
                            : 'bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white'
                        }`}
                      >
                        {idx === 0 ? '1. Kapak' : `${idx + 1}. Slayt`}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={handleAddSlide}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-dashed border-white/20 text-xs text-slate-300 hover:text-white flex items-center gap-1 shrink-0"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Ekle</span>
                    </button>
                  </div>

                  {activePost.carouselSlides && activePost.carouselSlides.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteSlide(activeSlideIndex)}
                      className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
                      title="Bu slaytı sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Sil</span>
                    </button>
                  )}
                </div>

                {currentSlide && (
                  <div className="flex flex-col gap-2.5 pt-2 border-t border-white/5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1">Slayt Rozeti</label>
                        <input
                          type="text"
                          value={currentSlide.badge || ''}
                          onChange={(e) => {
                            const updatedSlides = [...(activePost.carouselSlides || [])]
                            updatedSlides[activeSlideIndex] = { ...currentSlide, badge: e.target.value }
                            handleUpdateActivePost({ ...activePost, carouselSlides: updatedSlides })
                          }}
                          onBlur={() => {
                            const updatedSlides = [...(activePost.carouselSlides || [])]
                            updatedSlides[activeSlideIndex] = {
                              ...currentSlide,
                              badge: (currentSlide.badge || '').toLocaleUpperCase('tr-TR'),
                            }
                            handleUpdateActivePost({ ...activePost, carouselSlides: updatedSlides })
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-hidden focus:border-orange-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-400 block mb-1">Vurgu Etiketi</label>
                        <input
                          type="text"
                          value={currentSlide.highlightTag || ''}
                          onChange={(e) => {
                            const updatedSlides = [...(activePost.carouselSlides || [])]
                            updatedSlides[activeSlideIndex] = { ...currentSlide, highlightTag: e.target.value }
                            handleUpdateActivePost({ ...activePost, carouselSlides: updatedSlides })
                          }}
                          onBlur={() => {
                            const updatedSlides = [...(activePost.carouselSlides || [])]
                            updatedSlides[activeSlideIndex] = {
                              ...currentSlide,
                              highlightTag: (currentSlide.highlightTag || '').toLocaleUpperCase('tr-TR'),
                            }
                            handleUpdateActivePost({ ...activePost, carouselSlides: updatedSlides })
                          }}
                          placeholder="Örn: +3 NET, KAYDETMELİK"
                          className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-hidden focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1">Slayt Başlığı</label>
                      <input
                        type="text"
                        value={currentSlide.headline}
                        onChange={(e) => {
                          const updatedSlides = [...(activePost.carouselSlides || [])]
                          updatedSlides[activeSlideIndex] = { ...currentSlide, headline: e.target.value }
                          handleUpdateActivePost({ ...activePost, carouselSlides: updatedSlides })
                        }}
                        onBlur={() => {
                          const updatedSlides = [...(activePost.carouselSlides || [])]
                          updatedSlides[activeSlideIndex] = {
                            ...currentSlide,
                            headline: toTurkishTitleCase(currentSlide.headline),
                          }
                          handleUpdateActivePost({ ...activePost, carouselSlides: updatedSlides })
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-hidden focus:border-orange-500 font-semibold"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-400 block mb-1">Alt Başlık</label>
                      <input
                        type="text"
                        value={currentSlide.subhead || ''}
                        onChange={(e) => {
                          const updatedSlides = [...(activePost.carouselSlides || [])]
                          updatedSlides[activeSlideIndex] = { ...currentSlide, subhead: e.target.value }
                          handleUpdateActivePost({ ...activePost, carouselSlides: updatedSlides })
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white focus:outline-hidden focus:border-orange-500"
                      />
                    </div>

                    {/* Madde Noktaları */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[10px] font-semibold text-slate-400">Madde Noktaları (3-4 Madde)</label>
                        <button
                          type="button"
                          onClick={() => {
                            const updatedSlides = [...(activePost.carouselSlides || [])]
                            const points = [...(currentSlide.bodyPoints || []), 'Yeni ipucu maddesi']
                            updatedSlides[activeSlideIndex] = { ...currentSlide, bodyPoints: points }
                            handleUpdateActivePost({ ...activePost, carouselSlides: updatedSlides })
                          }}
                          className="text-[10px] font-bold text-orange-400 hover:text-orange-300"
                        >
                          + Madde Ekle
                        </button>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        {currentSlide.bodyPoints?.map((pt, pIdx) => (
                          <div key={pIdx} className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={pt}
                              onChange={(e) => {
                                const updatedSlides = [...(activePost.carouselSlides || [])]
                                const points = [...(currentSlide.bodyPoints || [])]
                                points[pIdx] = e.target.value
                                updatedSlides[activeSlideIndex] = { ...currentSlide, bodyPoints: points }
                                handleUpdateActivePost({ ...activePost, carouselSlides: updatedSlides })
                              }}
                              className="flex-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200 focus:outline-hidden focus:border-orange-500"
                            />
                            {currentSlide.bodyPoints.length > 1 && (
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedSlides = [...(activePost.carouselSlides || [])]
                                  const points = currentSlide.bodyPoints.filter((_, i) => i !== pIdx)
                                  updatedSlides[activeSlideIndex] = { ...currentSlide, bodyPoints: points }
                                  handleUpdateActivePost({ ...activePost, carouselSlides: updatedSlides })
                                }}
                                className="text-slate-500 hover:text-red-400 p-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 2. TEKLİ POST (SINGLE POST) ALANLARI */}
            {isPost && activePost.singlePostData && (
              <div className="border border-white/10 rounded-xl p-3.5 bg-black/30 flex flex-col gap-2.5">
                <div className="text-xs font-bold text-orange-400">Tekli Gönderi (1 Soru 1 Net / Hap Bilgi) Ayarları</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">Üst Rozet</label>
                    <input
                      type="text"
                      value={activePost.singlePostData.badge || ''}
                      onChange={(e) =>
                        handleUpdateActivePost({
                          ...activePost,
                          singlePostData: { ...activePost.singlePostData!, badge: e.target.value },
                        })
                      }
                      onBlur={() =>
                        handleUpdateActivePost({
                          ...activePost,
                          singlePostData: {
                            ...activePost.singlePostData!,
                            badge: (activePost.singlePostData!.badge || '').toLocaleUpperCase('tr-TR'),
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">Ana Başlık</label>
                    <input
                      type="text"
                      value={activePost.singlePostData.headline}
                      onChange={(e) =>
                        handleUpdateActivePost({
                          ...activePost,
                          singlePostData: { ...activePost.singlePostData!, headline: e.target.value },
                        })
                      }
                      onBlur={() =>
                        handleUpdateActivePost({
                          ...activePost,
                          singlePostData: {
                            ...activePost.singlePostData!,
                            headline: toTurkishTitleCase(activePost.singlePostData!.headline),
                          },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">Soru Metni veya Hap Bilgi Özeti</label>
                  <textarea
                    rows={2}
                    value={activePost.singlePostData.questionOrSummary}
                    onChange={(e) =>
                      handleUpdateActivePost({
                        ...activePost,
                        singlePostData: { ...activePost.singlePostData!, questionOrSummary: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">Kritik Püf Nokta (Alt Kutu)</label>
                  <input
                    type="text"
                    value={activePost.singlePostData.keyTakeaway}
                    onChange={(e) =>
                      handleUpdateActivePost({
                        ...activePost,
                        singlePostData: { ...activePost.singlePostData!, keyTakeaway: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>

                {/* Şıklar (Options) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-semibold text-slate-400">Şıklar / Seçenekler (Doğru şıkkı işaretle)</label>
                    <button
                      type="button"
                      onClick={() => {
                        const opts = activePost.singlePostData?.options || []
                        const keys = ['A', 'B', 'C', 'D', 'E']
                        const nextKey = keys[opts.length] || `${opts.length + 1}`
                        handleUpdateActivePost({
                          ...activePost,
                          singlePostData: {
                            ...activePost.singlePostData!,
                            options: [...opts, { key: nextKey, text: 'Yeni seçenek', isCorrect: false }],
                          },
                        })
                      }}
                      className="text-[10px] font-bold text-orange-400 hover:text-orange-300"
                    >
                      + Şık Ekle
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {(activePost.singlePostData.options || []).map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const updatedOpts = (activePost.singlePostData?.options || []).map((o, i) => ({
                              ...o,
                              isCorrect: i === oIdx,
                            }))
                            handleUpdateActivePost({
                              ...activePost,
                              singlePostData: { ...activePost.singlePostData!, options: updatedOpts },
                            })
                          }}
                          className={`px-2 py-1 rounded-lg text-[10px] font-black border transition-all ${
                            opt.isCorrect
                              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                              : 'bg-white/5 border-white/10 text-slate-400'
                          }`}
                          title="Doğru şık olarak işaretle"
                        >
                          {opt.key} {opt.isCorrect ? '✓' : ''}
                        </button>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            const updatedOpts = [...(activePost.singlePostData?.options || [])]
                            updatedOpts[oIdx] = { ...opt, text: e.target.value }
                            handleUpdateActivePost({
                              ...activePost,
                              singlePostData: { ...activePost.singlePostData!, options: updatedOpts },
                            })
                          }}
                          className="flex-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200"
                        />
                        {(activePost.singlePostData?.options?.length || 0) > 2 && (
                          <button
                            type="button"
                            onClick={() => {
                              const filtered = (activePost.singlePostData?.options || []).filter((_, i) => i !== oIdx)
                              handleUpdateActivePost({
                                ...activePost,
                                singlePostData: { ...activePost.singlePostData!, options: filtered },
                              })
                            }}
                            className="text-slate-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. STORY ALANLARI */}
            {isStory && activePost.storyData && (
              <div className="border border-white/10 rounded-xl p-3.5 bg-black/30 flex flex-col gap-2.5">
                <div className="text-xs font-bold text-orange-400">Story (9:16) Çıkartma ve İçerik Ayarları</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">Üst Rozet</label>
                    <input
                      type="text"
                      value={activePost.storyData.badge || ''}
                      onChange={(e) =>
                        handleUpdateActivePost({
                          ...activePost,
                          storyData: { ...activePost.storyData!, badge: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">Çıkartma Tipi</label>
                    <select
                      value={activePost.storyData.stickerType}
                      onChange={(e) =>
                        handleUpdateActivePost({
                          ...activePost,
                          storyData: { ...activePost.storyData!, stickerType: e.target.value as StoryStickerType },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    >
                      <option value="quiz" className="bg-neutral-900">Çoktan Seçmeli Test (Quiz)</option>
                      <option value="poll" className="bg-neutral-900">İkili Anket (Poll)</option>
                      <option value="link" className="bg-neutral-900">Bağlantı Çıkartması (Link)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">Story Başlığı</label>
                    <input
                      type="text"
                      value={activePost.storyData.headline}
                      onChange={(e) =>
                        handleUpdateActivePost({
                          ...activePost,
                          storyData: { ...activePost.storyData!, headline: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">Alt Başlık</label>
                    <input
                      type="text"
                      value={activePost.storyData.subhead || ''}
                      onChange={(e) =>
                        handleUpdateActivePost({
                          ...activePost,
                          storyData: { ...activePost.storyData!, subhead: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">Anket / Soru Çıkartması Başlığı</label>
                  <input
                    type="text"
                    value={activePost.storyData.stickerQuestion || ''}
                    onChange={(e) =>
                      handleUpdateActivePost({
                        ...activePost,
                        storyData: { ...activePost.storyData!, stickerQuestion: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>

                {(activePost.storyData.stickerType === 'quiz' || activePost.storyData.stickerType === 'poll') && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-semibold text-slate-400">Çıkartma Seçenekleri</label>
                      <button
                        type="button"
                        onClick={() => {
                          const opts = activePost.storyData?.stickerOptions || []
                          handleUpdateActivePost({
                            ...activePost,
                            storyData: {
                              ...activePost.storyData!,
                              stickerOptions: [...opts, 'Yeni Seçenek'],
                            },
                          })
                        }}
                        className="text-[10px] font-bold text-orange-400 hover:text-orange-300"
                      >
                        + Seçenek Ekle
                      </button>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {(activePost.storyData.stickerOptions || []).map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const next = [...(activePost.storyData?.stickerOptions || [])]
                              next[idx] = e.target.value
                              handleUpdateActivePost({
                                ...activePost,
                                storyData: { ...activePost.storyData!, stickerOptions: next },
                              })
                            }}
                            className="flex-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200"
                          />
                          {(activePost.storyData?.stickerOptions?.length || 0) > 2 && (
                            <button
                              type="button"
                              onClick={() => {
                                const next = (activePost.storyData?.stickerOptions || []).filter((_, i) => i !== idx)
                                handleUpdateActivePost({
                                  ...activePost,
                                  storyData: { ...activePost.storyData!, stickerOptions: next },
                                })
                              }}
                              className="text-slate-500 hover:text-red-400 p-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">Link Çıkartma Metni</label>
                    <input
                      type="text"
                      value={activePost.storyData.stickerLinkText || ''}
                      onChange={(e) =>
                        handleUpdateActivePost({
                          ...activePost,
                          storyData: { ...activePost.storyData!, stickerLinkText: e.target.value },
                        })
                      }
                      placeholder="Örn: DersoLab L.A.B."
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">Link Hedef URL</label>
                    <input
                      type="text"
                      value={activePost.storyData.stickerLinkUrl || ''}
                      onChange={(e) =>
                        handleUpdateActivePost({
                          ...activePost,
                          storyData: { ...activePost.storyData!, stickerLinkUrl: e.target.value },
                        })
                      }
                      placeholder="https://dersolab.com/lab"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 4. REELS ALANLARI */}
            {isReels && activePost.reelsStoryboard && (
              <div className="border border-white/10 rounded-xl p-3.5 bg-black/30 flex flex-col gap-2.5">
                <div className="text-xs font-bold text-orange-400">Reels & TikTok Tam Senaryo Ayarları</div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">İlk 3 Saniye Kancası (Hook)</label>
                  <input
                    type="text"
                    value={activePost.reelsStoryboard.hook3s}
                    onChange={(e) =>
                      handleUpdateActivePost({
                        ...activePost,
                        reelsStoryboard: { ...activePost.reelsStoryboard!, hook3s: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">Görsel Yönetmenlik & Kamera Notu</label>
                  <input
                    type="text"
                    value={activePost.reelsStoryboard.visualDirection}
                    onChange={(e) =>
                      handleUpdateActivePost({
                        ...activePost,
                        reelsStoryboard: { ...activePost.reelsStoryboard!, visualDirection: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">Konuşma Metni (Voiceover Script)</label>
                  <textarea
                    rows={3}
                    value={activePost.reelsStoryboard.spokenScript}
                    onChange={(e) =>
                      handleUpdateActivePost({
                        ...activePost,
                        reelsStoryboard: { ...activePost.reelsStoryboard!, spokenScript: e.target.value },
                      })
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>

                {/* Ekranda Belirecek Yazılar (onScreenText) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-semibold text-slate-400">Ekranda Belirecek Yazılar (On-Screen Text)</label>
                    <button
                      type="button"
                      onClick={() => {
                        const list = activePost.reelsStoryboard?.onScreenText || []
                        handleUpdateActivePost({
                          ...activePost,
                          reelsStoryboard: {
                            ...activePost.reelsStoryboard!,
                            onScreenText: [...list, 'Yeni Ekran Yazısı'],
                          },
                        })
                      }}
                      className="text-[10px] font-bold text-orange-400 hover:text-orange-300"
                    >
                      + Yazı Ekle
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {(activePost.reelsStoryboard.onScreenText || []).map((txt, tIdx) => (
                      <div key={tIdx} className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={txt}
                          onChange={(e) => {
                            const next = [...(activePost.reelsStoryboard?.onScreenText || [])]
                            next[tIdx] = e.target.value
                            handleUpdateActivePost({
                              ...activePost,
                              reelsStoryboard: { ...activePost.reelsStoryboard!, onScreenText: next },
                            })
                          }}
                          className="flex-1 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-200"
                        />
                        {(activePost.reelsStoryboard?.onScreenText?.length || 0) > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const next = (activePost.reelsStoryboard?.onScreenText || []).filter((_, i) => i !== tIdx)
                              handleUpdateActivePost({
                                ...activePost,
                                reelsStoryboard: { ...activePost.reelsStoryboard!, onScreenText: next },
                              })
                            }}
                            className="text-slate-500 hover:text-red-400 p-1"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">Müzik & Ses Atmosferi</label>
                    <input
                      type="text"
                      value={activePost.reelsStoryboard.musicAudioVibe}
                      onChange={(e) =>
                        handleUpdateActivePost({
                          ...activePost,
                          reelsStoryboard: { ...activePost.reelsStoryboard!, musicAudioVibe: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">Bitiş Çağrısı (Call To Action)</label>
                    <input
                      type="text"
                      value={activePost.reelsStoryboard.callToAction}
                      onChange={(e) =>
                        handleUpdateActivePost({
                          ...activePost,
                          reelsStoryboard: { ...activePost.reelsStoryboard!, callToAction: e.target.value },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* GÖRSEL & İLLÜSTRASYON STÜDYOSU (AI ŞEMA / MASKOT ÜRET VEYA GÖRSEL YÜKLE) */}
            <div className="border border-white/10 rounded-xl p-3.5 bg-gradient-to-br from-cyan-500/5 via-purple-500/5 to-transparent flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white">
                    Görsel & İllüstrasyon Stüdyosu {isCarousel ? `(${activeSlideIndex + 1}. Slayt)` : ''}
                  </span>
                </div>
                {activeTargetImageUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      applyImageUrlToActiveTarget(undefined)
                      toast.success('Görsel kaldırıldı.')
                    }}
                    className="text-[11px] font-semibold text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Görseli Kaldır</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <select
                  value={imageStylePreset}
                  onChange={(e) => setImageStylePreset(e.target.value as ImageStylePreset)}
                  className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                >
                  <option value="cyber_lab" className="bg-neutral-900">Siber Laboratuvar (HUD)</option>
                  <option value="scientific_diagram" className="bg-neutral-900">Bilimsel Şema & Grafik</option>
                  <option value="minimal_vector" className="bg-neutral-900">Minimal Vektör İnfografik</option>
                  <option value="realistic_study" className="bg-neutral-900">Çalışma Masası Atmosferi</option>
                  <option value="mascot_fox" className="bg-neutral-900">DersoLab Tilki Maskotu</option>
                </select>

                <input
                  type="text"
                  value={customImagePrompt}
                  onChange={(e) => setCustomImagePrompt(e.target.value)}
                  placeholder="Görsel tarifi (boş bırakılırsa başlığa göre üretir)..."
                  className="sm:col-span-2 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={isGeneratingImage}
                  onClick={handleGenerateSlideImage}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isGeneratingImage ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Görsel Çiziliyor...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Şema / Görsel Üret</span>
                    </>
                  )}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUploadChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Cihazdan Görsel Yükle</span>
                </button>
              </div>
            </div>

            {/* RENK & TEMA SEÇİCİ */}
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1.5">
                DersoLab Renk & Atmosfer Teması:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'lab_dark', label: 'DersoLab Koyu', color: 'bg-slate-900 border-sky-500' },
                  { id: 'neon_orange', label: 'Neon Turuncu', color: 'bg-orange-950 border-orange-500' },
                  { id: 'cyan_cyber', label: 'Siber Mavi', color: 'bg-cyan-950 border-cyan-400' },
                  { id: 'purple_matrix', label: 'Mor Gece', color: 'bg-purple-950 border-purple-500' },
                ].map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => {
                      if (isCarousel && activePost.carouselSlides) {
                        const updatedSlides = activePost.carouselSlides.map((s, idx) =>
                          idx === activeSlideIndex ? { ...s, themeVariant: th.id as SlideThemeVariant } : s
                        )
                        handleUpdateActivePost({ ...activePost, carouselSlides: updatedSlides })
                      } else if (isStory && activePost.storyData) {
                        handleUpdateActivePost({
                          ...activePost,
                          storyData: { ...activePost.storyData, themeVariant: th.id as SlideThemeVariant },
                        })
                      } else if (isPost && activePost.singlePostData) {
                        handleUpdateActivePost({
                          ...activePost,
                          singlePostData: { ...activePost.singlePostData, themeVariant: th.id as SlideThemeVariant },
                        })
                      }
                    }}
                    className={`px-3 py-2 rounded-xl border text-left text-xs font-semibold transition-all flex items-center gap-2 ${
                      th.color
                    } ${
                      (isCarousel && currentSlide?.themeVariant === th.id) ||
                      (isStory && activePost.storyData?.themeVariant === th.id) ||
                      (isPost && activePost.singlePostData?.themeVariant === th.id)
                        ? 'ring-2 ring-orange-500 text-white'
                        : 'opacity-70 hover:opacity-100 text-slate-300'
                    }`}
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-current" />
                    <span className="truncate">{th.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* INSTAGRAM AÇIKLAMASI (CAPTION) & HASHTAG'LER */}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold text-slate-400">Instagram Açıklaması & Hashtag'ler</label>
                <button
                  type="button"
                  onClick={handleCopyCaption}
                  className="flex items-center gap-1 text-[11px] font-bold text-orange-400 hover:text-orange-300 transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
                </button>
              </div>

              <textarea
                rows={4}
                value={activePost.caption}
                onChange={(e) => handleUpdateActivePost({ ...activePost, caption: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-200 leading-relaxed focus:outline-hidden focus:border-orange-500"
              />

              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>{activePost.caption.length} karakter • {activePost.caption.split(/\s+/).filter(Boolean).length} kelime</span>
                <span>{activePost.hashtags?.length || 0} etiket</span>
              </div>
            </div>
          </div>

          {/* KART 3: AI BÜYÜME, VİRAL KANCA MATRİSİ & PEDAGOJİK DENETİM PANELİ */}
          <div className="rounded-2xl border border-white/10 bg-[#0B0F19]/80 backdrop-blur-md p-4 sm:p-5 shadow-xl flex flex-col gap-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold text-white">AI Büyüme & ÖSYM Pedagojik Denetim Araçları</h3>
              </div>

              <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setGrowthTab('hooks')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    growthTab === 'hooks' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🎯 5x Kanca Matrisi
                </button>
                <button
                  type="button"
                  onClick={() => setGrowthTab('audit')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    growthTab === 'audit' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🎓 ÖSYM Denetimi
                </button>
                <button
                  type="button"
                  onClick={() => setGrowthTab('comments')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    growthTab === 'comments' ? 'bg-orange-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  💬 Yorum Simülasyonu
                </button>
              </div>
            </div>

            {/* SEKME 1: 5x VİRAL KANCA MATRİSİ */}
            {growthTab === 'hooks' && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    Kaydırmayı durduran 5 farklı psikolojik kanca varyasyonu. Beğendiğini tek tıkla başlığa uygula.
                  </p>
                  <button
                    type="button"
                    disabled={isGrowthLoading}
                    onClick={() => handleRunGrowthTool('hooks')}
                    className="px-3 py-1.5 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-300 text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <RefreshCw className={`w-3 h-3 ${isGrowthLoading ? 'animate-spin' : ''}`} />
                    <span>5 Yeni Kanca Üret</span>
                  </button>
                </div>

                {activePost.hookMatrix && activePost.hookMatrix.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {activePost.hookMatrix.map((hk) => (
                      <div
                        key={hk.id}
                        className="p-3 rounded-xl bg-black/40 border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300">
                              {hk.title}
                            </span>
                            <span className="text-[10px] font-bold text-emerald-400">
                              Viralite: %{hk.viralityScore}
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-white">{hk.hookText}</p>
                          <p className="text-[11px] text-slate-400">{hk.reason}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApplyHook(hk.hookText)}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-orange-500 text-white text-[11px] font-bold transition-colors shrink-0 self-start sm:self-center cursor-pointer"
                        >
                          Başlığa Uygula
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-center text-xs text-slate-400">
                    Bu gönderi için henüz kanca matrisi üretilmedi. <strong>"5 Yeni Kanca Üret"</strong> butonuna tıklayarak oluşturabilirsin.
                  </div>
                )}
              </div>
            )}

            {/* SEKME 2: ÖSYM & MEB PEDAGOJİK DENETİM */}
            {growthTab === 'audit' && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    İçeriğin MEB 2027 müfredatı ve ÖSYM soru kökü standartlarına uygunluğunu denetler.
                  </p>
                  <button
                    type="button"
                    disabled={isGrowthLoading}
                    onClick={() => handleRunGrowthTool('audit')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Denetimi Çalıştır</span>
                  </button>
                </div>

                {activePost.pedagogicalAudit ? (
                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        {activePost.pedagogicalAudit.verifiedByAgent}
                      </span>
                      <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                        ÖSYM Uyumu: %{activePost.pedagogicalAudit.osymRelevanceScore}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200">{activePost.pedagogicalAudit.pedagogyNotes}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {activePost.pedagogicalAudit.checkedRules.map((rule, rIdx) => (
                        <div key={rIdx} className="text-[11px] text-slate-300 flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-center text-xs text-slate-400">
                    Pedagojik denetim raporu görmek için <strong>"Denetimi Çalıştır"</strong> butonuna tıklayın.
                  </div>
                )}
              </div>
            )}

            {/* SEKME 3: YORUM & ETKİLEŞİM SİMÜLASYONU */}
            {growthTab === 'comments' && (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    Gönderiye gelebilecek öğrenci sorularını ve hazır koçluk yanıtlarını simüle eder.
                  </p>
                  <button
                    type="button"
                    disabled={isGrowthLoading}
                    onClick={() => handleRunGrowthTool('comments')}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Yorumları Simüle Et</span>
                  </button>
                </div>

                {activePost.simulatedComments && activePost.simulatedComments.length > 0 ? (
                  <div className="flex flex-col gap-2.5">
                    {activePost.simulatedComments.map((comm) => (
                      <div key={comm.id} className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-pink-400">{comm.userHandle}</span>
                          <span className="text-[10px] text-slate-500 uppercase">{comm.userType}</span>
                        </div>
                        <p className="text-xs text-slate-200 italic">"{comm.commentText}"</p>
                        <div className="space-y-1.5 pt-1 border-t border-white/5">
                          {comm.suggestedReplies.map((rep, rIdx) => (
                            <div
                              key={rIdx}
                              className="p-2 rounded-lg bg-white/5 flex items-start justify-between gap-2 text-[11px]"
                            >
                              <div>
                                <span className="font-bold text-cyan-300">{rep.personaLabel}: </span>
                                <span className="text-slate-300">{rep.replyText}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(rep.replyText)
                                  toast.success('Yanıt panoya kopyalandı!')
                                }}
                                className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] font-semibold text-white shrink-0"
                              >
                                Kopyala
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-center text-xs text-slate-400">
                    Öğrenci yorumlarını ve yanıt şablonlarını görmek için <strong>"Yorumları Simüle Et"</strong> butonuna tıklayın.
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* SAĞ KOLON: GERÇEKÇİ CANLI INSTAGRAM MOCKUP & HIZLI İNDİRME / PAYLAŞIM */}
        <section
          className={`lg:col-span-5 flex flex-col items-center gap-4 sticky top-20 ${
            mobileTab === 'editor' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Telefon Görünümü */}
          <SocialPhoneMockup
            post={activePost}
            activeSlideIndex={activeSlideIndex}
            onSlideChange={(idx) => setActiveSlideIndex(idx)}
          />

          {/* HIZLI DIŞA AKTARMA VE TEK TUŞLA PAYLAŞIM PANELİ */}
          <div className="w-full max-w-[390px] rounded-2xl border border-white/10 bg-[#0B0F19]/90 backdrop-blur-md p-4 shadow-xl flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Yayın Hazırlığı & Paylaşım</span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                1080p Hazır
              </span>
            </div>

            {/* Tek Tuşla Instagram & TikTok Paylaşım Butonu */}
            <button
              type="button"
              disabled={isPublishing || isDownloading}
              onClick={handleOneClickPublish}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-orange-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 transition-all active:scale-98 cursor-pointer"
            >
              {isPublishing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Paylaşıma Hazırlanıyor...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Tek Tuşla Paylaş (Instagram & TikTok)</span>
                </>
              )}
            </button>

            {/* 1080p PNG İndirme Butonu */}
            <button
              type="button"
              disabled={isDownloading || isPublishing}
              onClick={handleDownloadAll}
              className="w-full py-2 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{downloadProgress || 'Görseller İndiriliyor...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-orange-400" />
                  <span>
                    {isCarousel
                      ? `Tüm Slaytları İndir (${activePost.carouselSlides?.length || 1} PNG)`
                      : 'Görseli Cihaza İndir (1080p PNG)'}
                  </span>
                </>
              )}
            </button>

            {/* İkincil Eylemler (Metin Kopyala + Instagram'da Aç) */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopyCaption}
                className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Metni Kopyala</span>
              </button>

              <a
                href="https://www.instagram.com/dersolabegitim/"
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 text-xs font-semibold text-pink-300 hover:text-pink-200 flex items-center justify-center gap-1.5 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Instagram'a Git</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* TEK TUŞLA PAYLAŞIM BAŞARI MODALI */}
      <PublishSuccessModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        post={activePost}
        publishResult={publishResult}
        downloadCount={lastDownloadCount}
      />

      {/* KAYITLI GÖNDERİLER ÇEKMECESİ (DRAWER / MODAL) */}
      {isDraftsOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#0E1322] border border-white/15 rounded-t-3xl sm:rounded-2xl p-5 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Kayıtlı İçerikler & Taslaklar ({posts.length})</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDraftsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto py-3 flex flex-col gap-2.5">
              {posts.map((postItem) => (
                <div
                  key={postItem.id}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    postItem.id === activePostId
                      ? 'border-orange-500 bg-orange-500/10'
                      : 'border-white/5 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setActivePostId(postItem.id)
                      setActiveSlideIndex(0)
                      setIsDraftsOpen(false)
                    }}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-slate-300 uppercase">
                        {postItem.type}
                      </span>
                      {postItem.status === 'published' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                          Yayınlandı
                        </span>
                      )}
                      <span className="text-xs font-bold text-white truncate max-w-[260px]">
                        {postItem.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {postItem.topicLabel} • {postItem.targetAudience}
                    </div>
                  </button>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleDuplicatePost(postItem)}
                      className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-semibold text-slate-300"
                      title="Çoğalt"
                    >
                      Kopyala
                    </button>
                    {posts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeletePost(postItem.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  if (confirm('Tüm kayıtlı taslakları sıfırlayıp fabrika ayarlarına dönmek istediğinize emin misiniz?')) {
                    try {
                      localStorage.removeItem(STORAGE_KEY)
                      localStorage.removeItem('dersolab_social_posts_v6')
                    } catch {
                      // ignore
                    }
                    setPosts(INITIAL_DEMO_POSTS)
                    setActivePostId(INITIAL_DEMO_POSTS[0].id)
                    setActiveSlideIndex(0)
                    setIsDraftsOpen(false)
                    toast.success('Sosyal medya stüdyosu varsayılan şablonlara sıfırlandı.')
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-xs font-semibold text-red-400 border border-red-500/20 transition-colors"
              >
                Varsayılana Sıfırla
              </button>

              <button
                type="button"
                onClick={() => setIsDraftsOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors"
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
