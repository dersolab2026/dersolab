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
  BookOpen,
  Clock,
  Volume2,
  Archive,
  Settings,
  Video,
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
import {
  downloadAllPostMedia,
  generateAllPostMediaFiles,
  downloadPostAsZip,
  generateReelsAnimatedVideoDataUrl,
} from '@/lib/social/canvasRenderer'
import {
  toTurkishTitleCase,
  buildBookCoverSvgDataUrl,
  CURATED_BOOK_PAIRS,
  isFakeOrInvalidBook,
  pickCuratedBookPair,
} from '@/lib/social/agent'
import {
  getPoolStats,
  pickNextBookPair,
  pickNextSingleBook,
  resetUsedPool,
  markPairAsUsed,
  BOOK_POOL_EVENT,
} from '@/lib/social/bookPoolManager'
import {
  getSocialPostsFromDb,
  upsertSocialPostToDb,
  deleteSocialPostFromDb,
} from '@/actions/social-posts'
import { toast } from 'sonner'

const STORAGE_KEY = 'dersolab_social_posts_v8'

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
    title: 'Pazar Hikayesi: Küçük Prens & Beyaz Zambaklar',
    type: 'story',
    topic: 'book_recommendation',
    topicLabel: 'Pazar Kitap Kulübü • 9:16 Story',
    status: 'approved',
    targetAudience: 'Ortaokul (LGS) & Lise (YKS)',
    caption: `Pazar gününün klasiği: Haftalık Kitap Kulübümüz yayında! 📚🦊\n\n📘 Ortaokul (LGS): Küçük Prens — Antoine de Saint-Exupéry\n📕 Lise (YKS): Beyaz Zambaklar Ülkesinde — Grigory Petrov\n\nHem LGS hem YKS hazırlığında okuma hızını ve analitik düşünme gücünü katlayacak 2 muazzam başucu kitabı!\n\nSen bu hafta hangisine başlıyorsun? 👇\n\n#pazarkitabı #kitaponerisi #lgs2027 #yks2027 #dersolab`,
    hashtags: ['#pazarkitabı', '#kitaponerisi', '#lgs2027', '#yks2027', '#dersolab'],
    storyData: {
      badge: 'PAZAR KİTAP KULÜBÜ 📚',
      headline: 'Haftanın Kitap Önerileri',
      subhead: 'Hem Ortaokul (LGS) Hem Lise (YKS) İçin Seçtik',
      stickerType: 'none',
      stickerQuestion: 'Bu hafta hangisini okuyacaksın? 📚',
      stickerOptions: ['📘 Küçük Prens', '📕 Beyaz Zambaklar'],
      stickerLinkText: 'Kitap Listesi & İpuçları',
      stickerLinkUrl: 'https://dersolab.com/lab',
      themeVariant: 'purple_matrix',
      dualBookData: {
        ortaokul: {
          title: 'Küçük Prens',
          author: 'Antoine de Saint-Exupéry',
          genre: 'Felsefi Öykü & İmgelem',
          whyRead: 'Soyut düşünme ve LGS paragraf sorularında ana fikir yakalama yeteneğini güçlendirir.',
          highlightTag: 'ORTAOKUL & LGS',
          imageUrl: 'https://covers.openlibrary.org/b/id/12219639-L.jpg',
        },
        lise: {
          title: 'Beyaz Zambaklar Ülkesinde',
          author: 'Grigory Petrov',
          genre: 'Düşünce & Azim Klasiği',
          whyRead: 'Çalışma disiplini, irade eğitimi ve hedefe odaklanma konusunda eşsiz bir başucu eseridir.',
          highlightTag: 'LİSE & YKS',
          imageUrl: 'https://covers.openlibrary.org/b/id/10848805-L.jpg',
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
  return rawList.map((post: SocialPostItem, postIdx: number) => {
    let cleanTitle = toTurkishTitleCase(post.title || '')
    let cleanTopicLabel = toTurkishTitleCase(post.topicLabel || '')

    let nextStoryData = post.storyData ? { ...post.storyData } : undefined

    if (nextStoryData) {
      // Eski demo_story_3 kaydında dayatılan anket varsa çıkartmasız ('none') yap
      nextStoryData.stickerType =
        post.id === 'demo_story_3' && nextStoryData.stickerType === 'poll'
          ? ('none' as StoryStickerType)
          : nextStoryData.stickerType || ('none' as StoryStickerType)

      if (nextStoryData.dualBookData) {
        const rawOrt = nextStoryData.dualBookData.ortaokul
        const rawLis = nextStoryData.dualBookData.lise
        const hasFakeBook = isFakeOrInvalidBook(rawOrt) || isFakeOrInvalidBook(rawLis)
        const fallbackPair = pickCuratedBookPair('', postIdx + 1)

        const safeOrt = hasFakeBook ? fallbackPair.ortaokul : rawOrt
        const safeLis = hasFakeBook ? fallbackPair.lise : rawLis

        if (hasFakeBook) {
          cleanTitle = `Haftalık Kitap Önerisi: ${safeOrt.title} & ${safeLis.title}`
          cleanTopicLabel = 'Pazar Kitap Kulübü • 9:16 Story'
          nextStoryData.badge = 'PAZAR KİTAP KULÜBÜ 📚'
          nextStoryData.headline = 'Haftanın Kitap Önerileri'
          nextStoryData.subhead = 'Hem Ortaokul (LGS) Hem Lise (YKS) İçin Seçtik'
          nextStoryData.stickerQuestion = 'Bu hafta hangisini okuyacaksın? 📚'
        }

        const useRealOrtCover = safeOrt.imageUrl && !safeOrt.imageUrl.startsWith('data:image/svg')
        const useRealLisCover = safeLis.imageUrl && !safeLis.imageUrl.startsWith('data:image/svg')

        nextStoryData.dualBookData = {
          ortaokul: {
            ...safeOrt,
            highlightTag: 'ORTAOKUL & LGS',
            imageUrl: useRealOrtCover
              ? safeOrt.imageUrl
              : (fallbackPair.ortaokul.imageUrl || buildBookCoverSvgDataUrl(safeOrt.title, safeOrt.author, safeOrt.genre, 'ortaokul')),
          },
          lise: {
            ...safeLis,
            highlightTag: 'LİSE & YKS',
            imageUrl: useRealLisCover
              ? safeLis.imageUrl
              : (fallbackPair.lise.imageUrl || buildBookCoverSvgDataUrl(safeLis.title, safeLis.author, safeLis.genre, 'lise')),
          },
        }
        nextStoryData.stickerOptions = [`📘 ${safeOrt.title}`, `📕 ${safeLis.title}`]
      }
    }

    return {
      ...post,
      title: cleanTitle,
      topicLabel: cleanTopicLabel,
      storyData: nextStoryData,
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
  const [genStorySticker, setGenStorySticker] = useState<StoryStickerType>('none')
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false)
  const [isBatchLoading, setIsBatchLoading] = useState<boolean>(false)

  // "Yeniden Dene" Geçmişi & Varyasyon Sayacı (Aynı kitap veya gönderinin tekrar gelmesini önler)
  const seenHistoryRef = useRef<string[]>([])
  const variationSeedRef = useRef<number>(1)

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
  const [isZipDownloading, setIsZipDownloading] = useState<boolean>(false)
  const [isVideoRendering, setIsVideoRendering] = useState<boolean>(false)
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false)
  const [downloadProgress, setDownloadProgress] = useState<string>('')
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [isDraftsOpen, setIsDraftsOpen] = useState<boolean>(false)
  const [isPublishing, setIsPublishing] = useState<boolean>(false)
  const [publishResult, setPublishResult] = useState<PublishResultData | null>(null)
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false)
  const [lastDownloadCount, setLastDownloadCount] = useState<number>(0)

  // Doğrudan Instagram Graph API & TikTok API Bağlantı Ayarları
  const [isApiConfigOpen, setIsApiConfigOpen] = useState<boolean>(false)
  const [customIgToken, setCustomIgToken] = useState<string>('')
  const [customIgAccountId, setCustomIgAccountId] = useState<string>('')
  const [customTiktokToken, setCustomTiktokToken] = useState<string>('')
  const [isSearchingCover, setIsSearchingCover] = useState<{ ortaokul?: boolean; lise?: boolean }>({})
  const [poolStats, setPoolStats] = useState(() => getPoolStats())

  useEffect(() => {
    const handleUpdate = () => {
      setPoolStats(getPoolStats())
    }
    window.addEventListener(BOOK_POOL_EVENT, handleUpdate)
    return () => window.removeEventListener(BOOK_POOL_EVENT, handleUpdate)
  }, [])

  const dbSyncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Yerel Depolamadan + Supabase Veritabanından Yükleme ve Senkronizasyon
  useEffect(() => {
    try {
      const savedApiKeys = localStorage.getItem('dersolab_social_api_keys_v1')
      if (savedApiKeys) {
        const parsedKeys = JSON.parse(savedApiKeys)
        if (parsedKeys.igToken) setCustomIgToken(parsedKeys.igToken)
        if (parsedKeys.igAccountId) setCustomIgAccountId(parsedKeys.igAccountId)
        if (parsedKeys.tiktokToken) setCustomTiktokToken(parsedKeys.tiktokToken)
      }
    } catch {
      // ignore
    }
    let localPosts: SocialPostItem[] = []
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) ||
        localStorage.getItem('dersolab_social_posts_v7') ||
        localStorage.getItem('dersolab_social_posts_v6')
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

    // TikTok OAuth Yetkilendirme Dönüşü (Callback) Otomatik Token Değişimi
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const tiktokAuthCode = urlParams.get('code')
      if (tiktokAuthCode) {
        const toastId = toast.loading('TikTok yetkilendirmesi tamamlanıyor ve token alınıyor...')
        fetch('/api/admin/social/tiktok/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: tiktokAuthCode }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.accessToken) {
              setCustomTiktokToken(data.accessToken)
              try {
                const current = JSON.parse(localStorage.getItem('dersolab_social_api_keys_v1') || '{}')
                localStorage.setItem(
                  'dersolab_social_api_keys_v1',
                  JSON.stringify({ ...current, tiktokToken: data.accessToken })
                )
              } catch {
                // ignore
              }
              toast.success('TikTok hesabı (@dersolabegitim) başarıyla bağlandı!', { id: toastId })
              window.history.replaceState({}, '', window.location.pathname)
            } else {
              toast.error(data.error || 'TikTok token alınırken bir sorun oluştu.', { id: toastId })
            }
          })
          .catch(() => {
            toast.error('TikTok token değişimi sırasında sunucuya ulaşılamadı.', { id: toastId })
          })
      }
    }
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

  // Aktif gönderinin özetini "daha önce gösterilenler" listesine ekle (tüm gönderi türleri için)
  function recordPostInHistory(post: SocialPostItem) {
    const itemsToRecord: string[] = []
    if (post.title) itemsToRecord.push(post.title)
    if (post.carouselSlides && post.carouselSlides.length > 0) {
      itemsToRecord.push(post.carouselSlides[0].headline)
      if (post.carouselSlides[1]?.headline) itemsToRecord.push(post.carouselSlides[1].headline)
    }
    if (post.singlePostData?.headline) {
      itemsToRecord.push(post.singlePostData.headline)
    }
    if (post.storyData?.dualBookData) {
      itemsToRecord.push(post.storyData.dualBookData.ortaokul.title)
      itemsToRecord.push(post.storyData.dualBookData.lise.title)
    }
    if (post.storyData?.headline) {
      itemsToRecord.push(post.storyData.headline)
    }
    if (post.reelsStoryboard?.hook3s) {
      itemsToRecord.push(post.reelsStoryboard.hook3s)
    }
    const nextHistory = Array.from(new Set([...seenHistoryRef.current, ...itemsToRecord])).slice(-24)
    seenHistoryRef.current = nextHistory
    return nextHistory.join(' | ')
  }

  // Yeni Yapay Zeka Gönderisi Üret (Prompt kutusundaki metin korunur, silinmez)
  async function handleGeneratePost(customOptions?: {
    type?: InstagramContentType
    subject?: string
    targetGrade?: 'YKS (TYT/AYT)' | 'LGS' | 'Genel'
    topic?: ContentTopic
    storyStickerType?: StoryStickerType
    replacePostId?: string
  }) {
    const typeToUse = customOptions?.type || genType
    const rawSubject = (customOptions?.subject ?? genSubject).trim()
    const subjectToUse = rawSubject ? toTurkishTitleCase(rawSubject) : ''
    const isBookQuery = /kitap|roman|okuma|pazar|hikaye öneri/i.test(rawSubject)
    const topicToUse: ContentTopic =
      customOptions?.topic || (isBookQuery ? 'book_recommendation' : 'custom')
    const gradeToUse = customOptions?.targetGrade || genGrade
    const stickerToUse: StoryStickerType =
      customOptions?.storyStickerType ?? (typeToUse === 'story' ? genStorySticker : 'none')

    const nextSeed = variationSeedRef.current + 1
    variationSeedRef.current = nextSeed
    const excludeSummary = recordPostInHistory(activePost)

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
          customPrompt: rawSubject || subjectToUse,
          targetGrade: gradeToUse,
          tone: 'energetic',
          persona: 'derso_friendly',
          storyStickerType: stickerToUse,
          excludeSummary,
          variationSeed: nextSeed,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.item) {
        throw new Error(data.error || 'İçerik üretilemedi.')
      }

      const newPost: SocialPostItem = sanitizePostList([
        {
          ...data.item,
          sourcePrompt: rawSubject || subjectToUse || data.item.sourcePrompt,
        },
      ])[0]
      recordPostInHistory(newPost)

      if (customOptions?.replacePostId) {
        const replacedPost: SocialPostItem = {
          ...newPost,
          id: customOptions.replacePostId,
        }
        const updatedPosts = posts.map((p) => (p.id === customOptions.replacePostId ? replacedPost : p))
        savePosts(updatedPosts)
        setActivePostId(replacedPost.id)
        setActiveSlideIndex(0)
        upsertSocialPostToDb(replacedPost).catch(() => {})
      } else {
        const updatedPosts = [newPost, ...posts.filter((p) => p.id !== newPost.id)]
        savePosts(updatedPosts)
        setActivePostId(newPost.id)
        setActiveSlideIndex(0)
        upsertSocialPostToDb(newPost).catch(() => {})
      }

      toast.success('Yeni içerik başarıyla oluşturuldu! Farklı alternatif için "Yeniden Dene"ye tıklayabilirsin.', {
        id: toastId,
      })
    } catch (err: any) {
      console.warn('API uyarısı, dinamik içerik motoru devreye alınıyor:', err?.message)

      const fallbackPost = createFallbackPost(
        typeToUse,
        rawSubject || subjectToUse,
        gradeToUse,
        topicToUse,
        stickerToUse,
        excludeSummary,
        nextSeed
      )
      recordPostInHistory(fallbackPost)

      if (customOptions?.replacePostId) {
        const replacedFallback: SocialPostItem = {
          ...fallbackPost,
          id: customOptions.replacePostId,
        }
        const updatedPosts = posts.map((p) => (p.id === customOptions.replacePostId ? replacedFallback : p))
        savePosts(updatedPosts)
        setActivePostId(replacedFallback.id)
        setActiveSlideIndex(0)
        upsertSocialPostToDb(replacedFallback).catch(() => {})
      } else {
        const updatedPosts = [fallbackPost, ...posts.filter((p) => p.id !== fallbackPost.id)]
        savePosts(updatedPosts)
        setActivePostId(fallbackPost.id)
        setActiveSlideIndex(0)
        upsertSocialPostToDb(fallbackPost).catch(() => {})
      }

      toast.success('Yeni içerik hazırlandı! Farklı alternatif için "Yeniden Dene"ye tıklayabilirsin.', {
        id: toastId,
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Tüm Gönderi Türleri İçin "Yeniden Dene" (Girilen prompt sabit kalır, sadece çıktı/alternatif değişir)
  async function handleRegenerateActivePost() {
    if (isRegenerating || isGenerating) return
    setIsRegenerating(true)

    // Kullanıcının girdiği prompt'u aynen koru; eğer kutu boşsa mevcut gönderinin konusunu kullan
    const userEnteredPrompt = genSubject.trim()
    const activeIsBook =
      activePost.topic === 'book_recommendation' || Boolean(activePost.storyData?.dualBookData)

    const preservedPrompt =
      userEnteredPrompt ||
      (activeIsBook
        ? 'Haftalık Kitap Önerisi'
        : activePost.sourcePrompt?.trim() ||
          activePost.topicLabel.split('•')[0]?.trim() ||
          activePost.title.replace(/^(Story:|Reels:|1 Soru 1 Net:)\s*/i, '').trim())

    if (!userEnteredPrompt && preservedPrompt) {
      setGenSubject(preservedPrompt)
    }

    const isBookPost = userEnteredPrompt
      ? /kitap|roman|okuma/i.test(userEnteredPrompt)
      : activeIsBook || /kitap|roman|okuma/i.test(preservedPrompt)

    const currentSticker: StoryStickerType =
      activePost.type === 'story' ? activePost.storyData?.stickerType || genStorySticker || 'none' : 'none'
    const nextSeed = variationSeedRef.current + 1
    variationSeedRef.current = nextSeed
    const excludeSummary = recordPostInHistory(activePost)

    const toastId = toast.loading(`"${preservedPrompt}" için yeni alternatif üretiliyor...`)

    try {
      const res = await fetch('/api/admin/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_single',
          type: activePost.type,
          topic: isBookPost ? 'book_recommendation' : activePost.topic || 'custom',
          subject: preservedPrompt,
          customPrompt: preservedPrompt,
          targetGrade: genGrade,
          tone: 'energetic',
          persona: 'derso_friendly',
          storyStickerType: currentSticker,
          excludeSummary,
          variationSeed: nextSeed,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.item) {
        throw new Error(data.error || 'Alternatif üretilemedi.')
      }

      const freshPost: SocialPostItem = sanitizePostList([
        {
          ...data.item,
          id: activePost.id,
          sourcePrompt: preservedPrompt,
          storyData: data.item.storyData
            ? {
                ...data.item.storyData,
                stickerType: currentSticker,
              }
            : undefined,
        },
      ])[0]

      recordPostInHistory(freshPost)
      handleUpdateActivePost(freshPost)
      setActiveSlideIndex(0)

      toast.success('Yeni alternatif hazırlandı! Beğenmezsen tekrar "Yeniden Dene"ye tıklayabilirsin.', {
        id: toastId,
      })
    } catch {
      const fallback = createFallbackPost(
        activePost.type,
        preservedPrompt,
        genGrade,
        isBookPost ? 'book_recommendation' : activePost.topic || 'custom',
        currentSticker,
        excludeSummary,
        nextSeed
      )
      const replacedFallback: SocialPostItem = {
        ...fallback,
        id: activePost.id,
        sourcePrompt: preservedPrompt,
      }
      recordPostInHistory(replacedFallback)
      handleUpdateActivePost(replacedFallback)
      setActiveSlideIndex(0)
      toast.success('Yeni alternatif hazırlandı! Beğenmezsen tekrar "Yeniden Dene"ye tıklayabilirsin.', {
        id: toastId,
      })
    } finally {
      setIsRegenerating(false)
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
      const batchItems: SocialPostItem[] = sanitizePostList(data.items)
      const newIds = new Set(batchItems.map((i) => i.id))
      const updatedPosts = [...batchItems, ...posts.filter((p) => !newIds.has(p.id))]
      savePosts(updatedPosts)
      setActivePostId(batchItems[0].id)
      setActiveSlideIndex(0)
      for (const item of batchItems) {
        upsertSocialPostToDb(item).catch(() => {})
      }
      toast.success('Günün 3 otonom içeriği (Sabah Hikayesi, Öğle Rehberi, Akşam Reels) üretildi!', { id: toastId })
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
      const weeklyItems: SocialPostItem[] = sanitizePostList(data.items)
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

  // Tek Tuşla Instagram & TikTok Paylaşımı (Cihaza zorunlu indirme yapmadan doğrudan Bulut + Graph API / TikTok API üzerinden paylaşır)
  async function handleOneClickPublish() {
    setIsPublishing(true)
    const toastId = toast.loading(
      '1080p medya buluta yükleniyor ve Instagram Graph API & TikTok API üzerinden paylaşılıyor...'
    )
    try {
      // 1. Görselleri bellekte 1080p PNG olarak üret (cihaza zorla İNDİRMEZ!)
      const mediaFiles = await generateAllPostMediaFiles(activePost)
      setLastDownloadCount(0)

      // 2. Eğer gönderi Reels ise ayrıca 9:16 hareketli video üret
      let reelsVideoDataUrl: string | undefined
      if (activePost.type === 'reels') {
        try {
          const videoRes = await generateReelsAnimatedVideoDataUrl(activePost)
          reelsVideoDataUrl = videoRes.dataUrl
        } catch {
          // Tarayıcı MediaRecorder desteklemiyorsa kapak görseliyle devam et
        }
      }

      // 3. Açıklama ve hashtag'leri kolaylık için panoya kopyala
      const fullText = `${activePost.caption}\n\n${(activePost.hashtags || []).map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`
      try {
        await navigator.clipboard.writeText(fullText)
      } catch {
        // ignore clipboard permission issues
      }

      // 4. API üzerinden doğrudan bulut yüklemesi ve Instagram / TikTok paylaşımı yap
      const res = await fetch('/api/admin/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: activePost.id,
          post: activePost,
          caption: activePost.caption,
          hashtags: activePost.hashtags,
          contentType: activePost.type,
          isStory: activePost.type === 'story',
          isReels: activePost.type === 'reels',
          title: activePost.title,
          imageUrls: mediaFiles.map((f) => f.dataUrl),
          videoUrl: reelsVideoDataUrl,
          platform: 'both',
          instagramAccessToken: customIgToken.trim() || undefined,
          instagramAccountId: customIgAccountId.trim() || undefined,
          tiktokAccessToken: customTiktokToken.trim() || undefined,
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

      if (data.directApiPublished) {
        toast.success('Gönderi doğrudan Instagram & TikTok hesaplarında yayınlandı!', { id: toastId })
      } else {
        toast.success(
          'Görseller buluta yüklendi! Doğrudan otomatik paylaşım için API anahtarı bağlayabilir veya tek tıkla paylaşabilirsin.',
          { id: toastId }
        )
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Paylaşım sırasında bir sorun oluştu.', { id: toastId })
    } finally {
      setIsPublishing(false)
    }
  }

  function handleSaveApiConfig() {
    try {
      localStorage.setItem(
        'dersolab_social_api_keys_v1',
        JSON.stringify({
          igToken: customIgToken.trim(),
          igAccountId: customIgAccountId.trim(),
          tiktokToken: customTiktokToken.trim(),
        })
      )
      setIsApiConfigOpen(false)
      toast.success('Instagram & TikTok API bağlantı ayarları kaydedildi!')
    } catch {
      toast.error('Ayarlar kaydedilirken hata oluştu.')
    }
  }

  async function handleAutoFindBookCover(level: 'ortaokul' | 'lise') {
    if (!activePost?.storyData?.dualBookData) return
    const currentBook = activePost.storyData.dualBookData[level]
    if (!currentBook?.title) {
      toast.error('Lütfen önce kitap adını girin.')
      return
    }
    setIsSearchingCover((prev) => ({ ...prev, [level]: true }))
    try {
      const res = await fetch(
        `/api/admin/social/books/cover?title=${encodeURIComponent(currentBook.title)}&author=${encodeURIComponent(currentBook.author || '')}`
      )
      const data = await res.json()
      if (data.found && data.imageUrl) {
        handleUpdateActivePost({
          ...activePost,
          storyData: {
            ...activePost.storyData,
            dualBookData: {
              ...activePost.storyData.dualBookData,
              [level]: {
                ...currentBook,
                imageUrl: data.imageUrl,
              },
            },
          },
        })
        toast.success(`"${currentBook.title}" için gerçek kapak bulundu!`)
      } else {
        toast.error('Gerçek kapak bulunamadı. Web veya Google Görseller bağlantısını kutucuğa yapıştırabilirsiniz.')
      }
    } catch {
      toast.error('Kapak aranırken bir hata oluştu.')
    } finally {
      setIsSearchingCover((prev) => ({ ...prev, [level]: false }))
    }
  }

  async function handlePickNextPairFromPool() {
    if (!activePost?.storyData?.dualBookData) return
    const pair = pickNextBookPair('', Math.floor(Math.random() * 1000), true)

    let ortCover = pair.ortaokul.imageUrl
    if (!ortCover) {
      try {
        const res = await fetch(
          `/api/admin/social/books/cover?title=${encodeURIComponent(pair.ortaokul.title)}&author=${encodeURIComponent(pair.ortaokul.author)}`
        )
        const data = await res.json()
        if (data?.coverUrl) ortCover = data.coverUrl
      } catch {}
    }
    if (!ortCover) {
      ortCover = buildBookCoverSvgDataUrl(pair.ortaokul.title, pair.ortaokul.author, pair.ortaokul.genre, 'ortaokul')
    }

    let lisCover = pair.lise.imageUrl
    if (!lisCover) {
      try {
        const res = await fetch(
          `/api/admin/social/books/cover?title=${encodeURIComponent(pair.lise.title)}&author=${encodeURIComponent(pair.lise.author)}`
        )
        const data = await res.json()
        if (data?.coverUrl) lisCover = data.coverUrl
      } catch {}
    }
    if (!lisCover) {
      lisCover = buildBookCoverSvgDataUrl(pair.lise.title, pair.lise.author, pair.lise.genre, 'lise')
    }

    const updatedOrt = {
      title: pair.ortaokul.title,
      author: pair.ortaokul.author,
      genre: pair.ortaokul.genre,
      whyRead: pair.ortaokul.whyRead,
      highlightTag: pair.ortaokul.highlightTag || 'ORTAOKUL & LGS (10-14 YAŞ)',
      imageUrl: ortCover,
    }

    const updatedLis = {
      title: pair.lise.title,
      author: pair.lise.author,
      genre: pair.lise.genre,
      whyRead: pair.lise.whyRead,
      highlightTag: pair.lise.highlightTag || 'LİSE & YKS (14-18 YAŞ)',
      imageUrl: lisCover,
    }

    handleUpdateActivePost({
      ...activePost,
      title: `Haftalık Kitap Önerisi: ${updatedOrt.title} & ${updatedLis.title}`,
      caption: `Haftalık Kitap Kulübümüz yayında! 📚🦊\n\n📘 Ortaokul (LGS): ${updatedOrt.title} — ${updatedOrt.author}\n📕 Lise (YKS): ${updatedLis.title} — ${updatedLis.author}\n\nHem LGS hem YKS hazırlığında okuma hızını, odaklanmayı ve sınav derinliğini uçuracak 2 harika başucu kitabı!\n\n#pazarkitabı #kitaponerisi #lgs2027 #yks2027 #dersolab #kitapkurdu`,
      storyData: {
        ...activePost.storyData,
        dualBookData: {
          ortaokul: updatedOrt,
          lise: updatedLis,
        },
        stickerOptions: [`📘 ${updatedOrt.title}`, `📕 ${updatedLis.title}`],
      },
    })

    toast.success(`Yeni kitap çifti seçildi ve havuzdan çıkarıldı: "${pair.ortaokul.title}" & "${pair.lise.title}"`)
  }

  async function handlePickNextSingleBookFromPool(level: 'ortaokul' | 'lise') {
    if (!activePost?.storyData?.dualBookData) return
    const book = pickNextSingleBook(level, true)

    let cover = book.imageUrl
    if (!cover) {
      try {
        const res = await fetch(
          `/api/admin/social/books/cover?title=${encodeURIComponent(book.title)}&author=${encodeURIComponent(book.author)}`
        )
        const data = await res.json()
        if (data?.coverUrl) cover = data.coverUrl
      } catch {}
    }
    if (!cover) {
      cover = buildBookCoverSvgDataUrl(book.title, book.author, book.genre, level)
    }

    const updatedBook = {
      title: book.title,
      author: book.author,
      genre: book.genre,
      whyRead: book.whyRead,
      highlightTag: book.highlightTag || (level === 'ortaokul' ? 'ORTAOKUL & LGS (10-14 YAŞ)' : 'LİSE & YKS (14-18 YAŞ)'),
      imageUrl: cover,
    }

    const currentDual = activePost.storyData.dualBookData
    const newDual = {
      ...currentDual,
      [level]: updatedBook,
    }

    handleUpdateActivePost({
      ...activePost,
      title: `Haftalık Kitap Önerisi: ${newDual.ortaokul.title} & ${newDual.lise.title}`,
      storyData: {
        ...activePost.storyData,
        dualBookData: newDual,
        stickerOptions: [`📘 ${newDual.ortaokul.title}`, `📕 ${newDual.lise.title}`],
      },
    })

    toast.success(`Sıradaki ${level === 'ortaokul' ? 'Ortaokul' : 'Lise'} eseri seçildi ve havuzdan çıkarıldı: "${book.title}"`)
  }

  function handleResetBookPool() {
    resetUsedPool()
    toast.success('Kitap havuzu sıfırlandı! 1000 Ortaokul ve 1000 Lise eseri tekrar kullanılabilir.')
  }

  // Dinamik Konu Odaklı Yerel Üretici (4 Sabit Tema & Konuya %100 Uyumlu + Tüm Gönderi Türleri İçin Çoklu Alternatif Desteği)
  function createFallbackPost(
    type: InstagramContentType,
    subject: string,
    grade: string,
    topic: ContentTopic,
    storyStickerType: StoryStickerType = 'none',
    excludeSummary: string = '',
    variationSeed: number = 1
  ): SocialPostItem {
    const rawPrompt = subject.trim() || 'ÖSYM Net Artırma Stratejisi'
    const title = toTurkishTitleCase(rawPrompt)
    const id = `post_${Date.now()}`
    const isBook = topic === 'book_recommendation' || /kitap|okuma|roman/i.test(title)
    const themes: SlideThemeVariant[] = ['lab_dark', 'neon_orange', 'cyan_cyber', 'purple_matrix']
    const primaryTheme = themes[variationSeed % themes.length]

    if (isBook && type === 'story') {
      const chosen = pickCuratedBookPair(excludeSummary, variationSeed)

      return {
        id,
        title: `Pazar Hikayesi: ${chosen.ortaokul.title} & ${chosen.lise.title}`,
        type: 'story',
        topic: 'book_recommendation',
        topicLabel: 'Pazar Kitap Kulübü • 9:16 Story',
        sourcePrompt: rawPrompt,
        status: 'draft',
        targetAudience: 'Ortaokul (LGS) & Lise (YKS)',
        caption: `Pazar Kitap Kulübümüzde bu haftanın seçkisi! 📚🦊\n\n📘 Ortaokul (LGS): ${chosen.ortaokul.title} - ${chosen.ortaokul.author}\n📕 Lise (YKS): ${chosen.lise.title} - ${chosen.lise.author}\n\nParagraf hızını ve derin analiz yeteneğini geliştirmek için bu hafta mutlaka listene ekle! 👇\n\n#pazarkitabı #kitaponerisi #lgs2027 #yks2027 #dersolab`,
        hashtags: ['#pazarkitabı', '#kitaponerisi', '#lgs2027', '#yks2027', '#dersolab'],
        storyData: {
          badge: 'PAZAR KİTAP KULÜBÜ 📚',
          headline: 'Haftanın Kitap Önerileri',
          subhead: 'Hem Ortaokul (LGS) Hem Lise (YKS) İçin Seçtik',
          stickerType: storyStickerType,
          stickerQuestion: 'Bu hafta hangisini okuyacaksın? 📚',
          stickerOptions: [`📘 ${chosen.ortaokul.title}`, `📕 ${chosen.lise.title}`],
          stickerLinkText: 'Kitap Listesi & İpuçları',
          stickerLinkUrl: 'https://dersolab.com/lab',
          themeVariant: (['purple_matrix', 'lab_dark', 'cyan_cyber', 'neon_orange'] as SlideThemeVariant[])[
            variationSeed % 4
          ],
          dualBookData: {
            ortaokul: {
              ...chosen.ortaokul,
              highlightTag: 'ORTAOKUL & LGS',
              imageUrl:
                chosen.ortaokul.imageUrl ||
                buildBookCoverSvgDataUrl(
                  chosen.ortaokul.title,
                  chosen.ortaokul.author,
                  chosen.ortaokul.genre,
                  'ortaokul'
                ),
            },
            lise: {
              ...chosen.lise,
              highlightTag: 'LİSE & YKS',
              imageUrl:
                chosen.lise.imageUrl ||
                buildBookCoverSvgDataUrl(
                  chosen.lise.title,
                  chosen.lise.author,
                  chosen.lise.genre,
                  'lise'
                ),
            },
          },
        },
        createdAt: new Date().toISOString(),
      }
    }

    const isDeneme = /deneme|taktik|strateji|süre|zaman|turlama|hata/i.test(title)
    const isMath = /matematik|geometri|trigo|türev|integral|denklem|fonksiyon|limit|polinom|üslü|köklü|olasılık/i.test(title)
    const isPhysics = /fizik|kuvvet|hareket|newton|elektrik|manyetizma|dalga|optik|termodinamik/i.test(title)
    const isChemistry = /kimya|organik|mol|asit|baz|tepkime|periyodik|bağlar|gazlar/i.test(title)
    const isBiology = /biyoloji|hücre|genetik|dna|rna|fotosentez|solunum|ekoloji|sistemler/i.test(title)
    const isTurkish = /türkçe|paragraf|edebiyat|yazım|noktalama|anlatım|dil bilgisi/i.test(title)

    let badge = `${grade.toUpperCase()} • STRATEJİ`
    if (isMath) badge = `${grade.toUpperCase()} • MATEMATİK`
    else if (isPhysics) badge = `${grade.toUpperCase()} • FİZİK`
    else if (isChemistry) badge = `${grade.toUpperCase()} • KİMYA`
    else if (isBiology) badge = `${grade.toUpperCase()} • BİYOLOJİ`
    else if (isTurkish) badge = `${grade.toUpperCase()} • TÜRKÇE`

    const carouselVariants = [
      {
        s1Headline: isDeneme ? `${title}: En Sık Yapılan 3 Hata` : `${title}: En Çok Karıştırılan Noktalar`,
        s1Subhead: 'ÖSYM sınavlarında öğrencilerin en çok net kaybettiği kritik tuzaklar ve püf noktalar',
        s1Points: [
          `${title} konusunda temel mantığı kavramadan kuralları ezberleyip geçmek`,
          'Soru kökündeki sınırlayıcı koşulları ve öncülleri dikkatsizce okumak',
          'Kaydır; netlerini artıracak 3 adımlı çözüm stratejisini keşfet 👉',
        ],
        s2Headline: `${title}: Kritik Formül & Mantık`,
        s2Points: [
          'Temel tanım ve kuralı ezberlemek yerine soru üzerinde adım adım modelle.',
          'Birim dönüşümlerine, işaretlere ve tanım kümesi sınırlarına dikkat et.',
          'Doğru şıkkı ararken önce en bariz 2 çeldiriciyi eleyerek ilerle.',
        ],
        s3Headline: 'ÖSYM Soru Tarzı & Çözüm Yolu',
        s3Points: [
          'Soru kökündeki "kesinlikle", "olabilir" veya "her zaman" ifadelerinin altını çiz.',
          'Klasik soru kalıplarının yeni nesil grafik ve tablo yorumlarına odaklan.',
          'Denemelerde benzer soru pratikleriyle çözüm süreni 45 saniyenin altına indir.',
        ],
      },
      {
        s1Headline: `${title}: 3 Adımda Garanti Çözüm Şablonu`,
        s1Subhead: 'Zor görünen yeni nesil soruları saniyeler içinde çözen sistematik yaklaşım',
        s1Points: [
          'Soruyu ilk okuduğunda verilenleri ve isteneni net biçimde ayır',
          'Uzun paragraflı veya şekilli sorularda gözünü korkutan detayları sadeleştir',
          'Kaydır; derece öğrencilerinin kullandığı çözüm sırasını gör 👉',
        ],
        s2Headline: `${title}: Kestirme Çözüm Tekniği`,
        s2Points: [
          'Verilen öncülleri veya denklemleri en sade haline dönüştürerek başla.',
          'Grafik, tablo veya şekil üzerindeki kritik kesişim noktalarını işaretle.',
          'Uzun işlem yapmak yerine oran-orantı ve uç değer kontrolüyle sağlamasını yap.',
        ],
        s3Headline: 'Denemede Süre Kazandıran Hamle',
        s3Points: [
          'İlk 30 saniyede çözüm yolu belirmeyen soruda turlama tekniğini uygula.',
          'Yaptığın her yanlış soruyu hata defterine "bilgi" veya "dikkat" olarak kodla.',
          'Aynı kazanımdan 3 farklı zorlukta soru çözerek konuyu tamamen mühürle.',
        ],
      },
      {
        s1Headline: `${title}: ÖSYM'nin Gizli Çeldirici Rehberi`,
        s1Subhead: 'Sınavda öğrencilerin %80’inin düştüğü öncül tuzaklarını önceden yakala',
        s1Points: [
          'Doğru gibi görünen ama uç değerlerde bozulan öncüllere hemen atlama',
          'İstisnai durumları ve özel koşulları mutlaka kontrol listene ekle',
          'Kaydır; sınavda +1 net kurtaracak kontrol listesini kaydet 👉',
        ],
        s2Headline: `${title}: İstisnalar & Özel Durumlar`,
        s2Points: [
          'Genel kuralın geçerli olmadığı sınır değerleri ve istisnaları mutlaka hatırla.',
          'Öncüllü sorularda (I, II, III) her maddeyi birbirinden bağımsız kanıtla.',
          'Sadece tek bir örnek deneyerek "kesinlikle doğrudur" şıkkını işaretleme.',
        ],
        s3Headline: 'Derece Öğrencisinin Kontrol Listesi',
        s3Points: [
          'İşlemi bitirdikten sonra "Benden tam olarak ne isteniyordu?" diye son kez bak.',
          'Şıklar arasındaki simetrik veya birbirini tamamlayan çeldiricilere dikkat et.',
          'Konu özetini tekrar etmek yerine çıkmış soruların mantığını analiz et.',
        ],
      },
      {
        s1Headline: `${title}: Son Tekrar & Hızlı Net Özeti`,
        s1Subhead: 'Sınav öncesi 60 saniyede tüm konunun en kritik kazanımlarını hatırla',
        s1Points: [
          `${title} başlığında her yıl mutlaka yoklanan çekirdek kavramlar`,
          'Karmaşık anlatımları bir kenara bırakıp doğrudan soru çözdüren özet',
          'Kaydır; denemeye girmeden önce bilmen gereken altın kuralları incele 👉',
        ],
        s2Headline: `${title}: Çekirdek Kazanım Özeti`,
        s2Points: [
          'Konunun temel ilişkisini (neden-sonuç veya formül bağıntısını) tek cümlede özetle.',
          'Soru kökünde geçen anahtar kelimelerin hangi kurala işaret ettiğini eşleştir.',
          'Görsel veya sözel veriyi matematiksel/mantıksal modele hızlıca aktar.',
        ],
        s3Headline: 'Hedef: Sıfır Dikkat Hatası',
        s3Points: [
          'Birimleri, katsayıları ve parantez içi işaretleri işlem sonunda tekrar denetle.',
          'Olumsuz soru köklerinde ("değildir", "ulaşılamaz") şıklardan eleme yap.',
          'DersoLab L.A.B. üzerinden bu konunun nokta atışı testini hemen çöz.',
        ],
      },
    ]

    const cv = carouselVariants[variationSeed % carouselVariants.length]

    if (type === 'carousel') {
      return {
        id,
        title: cv.s1Headline,
        type: 'carousel',
        topic,
        topicLabel: `${grade} • ${title}`,
        sourcePrompt: rawPrompt,
        status: 'draft',
        targetAudience: grade,
        caption: `${title} (${cv.s1Headline}) hakkında sınavda hayat kurtaran kritik püf noktalar! 🦊⚡\n\nBu adımları denemelerinde uygula, soru kaçırma! Unutmamak için hemen kaydet! 👇\n\n#yks2027 #lgs2027 #dersolab #ykstayfa #${title.toLowerCase().replace(/[^a-z0-9ğüşıöç]/gi, '')}`,
        hashtags: ['#yks2027', '#lgs2027', '#dersolab', '#ykstayfa'],
        carouselSlides: [
          {
            slideNumber: 1,
            badge,
            headline: cv.s1Headline,
            subhead: cv.s1Subhead,
            bodyPoints: cv.s1Points,
            highlightTag: 'KAYDETMELİK',
            footerNote: 'DersoLab Sınav Laboratuvarı • @dersolabegitim',
            themeVariant: themes[variationSeed % 4],
          },
          {
            slideNumber: 2,
            badge: `${badge} • KURAL`,
            headline: cv.s2Headline,
            subhead: 'Öğrencilerin en çok işine yarayacak temel bilgi',
            bodyPoints: cv.s2Points,
            highlightTag: 'PÜF NOKTA',
            footerNote: 'DersoLab Taktikleri',
            themeVariant: themes[(variationSeed + 1) % 4],
          },
          {
            slideNumber: 3,
            badge: `${badge} • KAZANIM`,
            headline: cv.s3Headline,
            subhead: 'Sınavda karşına çıkacak soru kalıbı',
            bodyPoints: cv.s3Points,
            highlightTag: '+ NET',
            footerNote: 'DersoLab Soru Analizi',
            themeVariant: themes[(variationSeed + 2) % 4],
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
            themeVariant: themes[(variationSeed + 3) % 4],
          },
        ],
        createdAt: new Date().toISOString(),
      }
    }

    if (type === 'story') {
      const storyVariants = [
        {
          headline: `${title} • Kritik İpucu`,
          subhead: 'Sınavda +1 net kazandıran altın kuralı unutma: Önce soru kökündeki sınırı belirle!',
          question: `${title} konusunda hangisi doğrudur?`,
          options: ['A) Temel Kural & Modelleme ✅', 'B) Ezbere İşlem Yapmak ❌'],
        },
        {
          headline: `${title} • ÖSYM Çeldiricisi`,
          subhead: 'Öğrencilerin %80’i bu noktada acele ettiği için şıkkı yanlış işaretliyor!',
          question: `${title} sorusunda ilk adımın ne olmalı?`,
          options: ['Verilenleri Sadeleştirmek 🎯', 'Doğrudan Şıklardan Gitmek ⚡'],
        },
        {
          headline: `${title} • 30 Saniye Kuralı`,
          subhead: 'Yeni nesil sorularda süreyi yarıya indiren pratik yaklaşımı denemende uygula!',
          question: `${title} denemelerde nasıl gidiyor?`,
          options: ['Netlerim Artıyor 🚀', 'Tekrar Etmem Lazım 📚'],
        },
        {
          headline: `${title} • Derece Taktiği`,
          subhead: 'Öncüllü sorularda uç değerleri ve istisnaları kontrol etmeden şıkkı işaretleme!',
          question: 'Bu taktiği bir sonraki denemede deneyecek misin?',
          options: ['Kesinlikle Evet! 🔥', 'Hemen Not Aldım ✍️'],
        },
      ]
      const sv = storyVariants[variationSeed % storyVariants.length]

      return {
        id,
        title: `Story: ${sv.headline}`,
        type: 'story',
        topic,
        topicLabel: `${grade} • Hikaye`,
        sourcePrompt: rawPrompt,
        status: 'draft',
        targetAudience: grade,
        caption: `${title} (${sv.headline}) hakkında günün hikayesi yayında! 🦊👇\n\n#dersolab #yks2027 #lgs2027`,
        hashtags: ['#dersolab', '#yks2027', '#lgs2027'],
        storyData: {
          badge: `${badge} ⚡`,
          headline: sv.headline,
          subhead: sv.subhead,
          stickerType: storyStickerType,
          stickerQuestion: sv.question,
          stickerOptions: sv.options,
          stickerLinkText: 'DersoLab L.A.B.',
          stickerLinkUrl: 'https://dersolab.com/lab',
          themeVariant: primaryTheme,
        },
        createdAt: new Date().toISOString(),
      }
    }

    if (type === 'reels') {
      const reelsVariants = [
        {
          hook: `Eğer ${title} sorusunda hala bu hatayı yapıyorsan sınavda 1 netin gidebilir!`,
          visual: `Ön planda konuşmacı, arkada ${title} ile ilgili şema veya formül görseli belirir.`,
          script: `${title} konusunda ÖSYM'nin her yıl yokladığı en kritik nokta burada gizli! Şifre çok basit: Temel kuralı doğrudan soruya uygula, çeldiricileri adım adım ele ve sürenden tasarruf et. Profildeki linkten benzer soruları hemen çöz!`,
          screen: ['🚨 1 NETİ KURTAR', `${title.toUpperCase()}`, 'ÖSYM ÇOK SEVER', 'Link Biyoda 🦊'],
        },
        {
          hook: `${title} sorularını 90 saniye yerine 25 saniyede çözmenin sırrını açıklıyorum!`,
          visual: `Kronometre animasyonu eşliğinde ${title} sorusu üzerinde pratik eleme adımları gösterilir.`,
          script: `Denemede ${title} sorusu geldiğinde uzun uzun işlem yapmayı bırak! Önce soru kökündeki anahtar koşulu yakala, uç değerleri kontrol et ve iki çeldiriciyi anında ele. Bu yöntemi kaydet, denemede farkı gör!`,
          screen: ['⏱️ 25 SANİYEDE ÇÖZ', `${title.toUpperCase()}`, 'KESTİRME METOT ⚡', 'Kaydet & Dene 📌'],
        },
        {
          hook: `Sınavda öğrencilerin %85'inin düştüğü o meşhur ${title} tuzağına sakın düşme!`,
          visual: `Kırmızı çarpı ve yeşil onay efektleriyle ${title} konusundaki doğru ve yanlış yaklaşım karşılaştırılır.`,
          script: `Herkes ${title} konusunu bildiğini sanıyor ama öncüllü sorularda istisnayı unuttuğu için net kaybediyor! Kesinlik sorularında tek bir değer denemek yetmez, sınır durumları mutlaka kontrol etmelisin.`,
          screen: ['⚠️ BU TUZAĞA DÜŞME', `${title.toUpperCase()}`, 'İSTİSNAYI UNUTMA 🎯', 'Arkadaşına Gönder 🚀'],
        },
        {
          hook: `Derece öğrencileri ${title} konusunu nasıl çalışıyor? İşte 3 adımlı sistem!`,
          visual: `3 maddelik dinamik liste ekrana sırayla gelir, DersoLab L.A.B. ekranı gösterilir.`,
          script: `${title} netlerini kalıcı olarak artırmak istiyorsan: Bir, konunun mantığını şemayla kavra. İki, çıkmış soru kalıplarını analiz et. Üç, yanlışlarını hata defterine kaydet ve 3 gün sonra tekrar çöz!`,
          screen: ['🏆 DERECE SİSTEMİ', `${title.toUpperCase()}`, '3 ADIMDA +1 NET', 'DersoLab L.A.B. 🦊'],
        },
      ]
      const rv = reelsVariants[variationSeed % reelsVariants.length]

      return {
        id,
        title: `Reels: ${title} (#${(variationSeed % 4) + 1})`,
        type: 'reels',
        topic,
        topicLabel: `${grade} • Reels & Video`,
        sourcePrompt: rawPrompt,
        status: 'draft',
        targetAudience: grade,
        caption: `${rv.hook} 🤯\n\nSen bu yöntemi denemelerinde kullanıyor musun? Yorumlarda buluşalım! 👇\n\n#reels #yks2027 #dersolab`,
        hashtags: ['#reels', '#yks2027', '#dersolab'],
        reelsStoryboard: {
          hook3s: rv.hook,
          visualDirection: rv.visual,
          spokenScript: rv.script,
          onScreenText: rv.screen,
          musicAudioVibe: 'Trending Phonk / Fast BPM',
          callToAction: 'Profildeki linkten hemen ücretsiz dene!',
        },
        createdAt: new Date().toISOString(),
      }
    }

    // Single post (Tekli Post - Çoklu Alternatif)
    const singlePostVariants = [
      {
        headline: `${title} • Kritik Püf Noktası`,
        questionOrSummary: `${title} sorularında ÖSYM'nin en çok yokladığı kazanım: Verilen öncülleri ezbere kural yerine temel tanım ve sınır koşullarıyla sınamak.`,
        keyTakeaway: 'Kritik ipucu: Soru kökündeki sınırlayıcı ifadeyi ("kesinlikle", "en az", "her zaman") işaretle ve çeldiricileri ilk aşamada ele.',
        options: [
          { key: 'A', text: 'Tanım kümesi ve sınır koşullarını kontrol ederek model kurmak', isCorrect: true },
          { key: 'B', text: 'Öncülleri kontrol etmeden sadece tek bir değer deneyerek geçmek', isCorrect: false },
        ],
      },
      {
        headline: `${title} • 1 Soru 1 Net Analizi`,
        questionOrSummary: `${title} başlığında zaman kaybettiren yeni nesil sorularda en hızlı çözüm yolu hangisidir?`,
        keyTakeaway: 'Kestirme Taktik: Karmaşık görünen ifadeyi en sade haline getir, grafik/tablo kesişimlerini kullan ve işlem kalabalığından kaçın.',
        options: [
          { key: 'A', text: 'Bütün şıkları tek tek baştan sona uzun işlemle denemek', isCorrect: false },
          { key: 'B', text: 'Veriyi sadeleştirip anahtar bağıntıyı doğrudan uygulamak', isCorrect: true },
        ],
      },
      {
        headline: `${title} • ÖSYM Tuzak Avcısı`,
        questionOrSummary: `Öğrencilerin ${title} sorularında en sık net kaybetmesine yol açan kavram yanılgısı aşağıdakilerden hangisidir?`,
        keyTakeaway: 'Unutma: İstisnai durumları ve birim/işaret dönüşümlerini işlem sonunda mutlaka 5 saniye ayırarak kontrol et!',
        options: [
          { key: 'A', text: 'İstisnai durumları ve işaret/birim dönüşümlerini denetlemek', isCorrect: true },
          { key: 'B', text: 'Genel kuralın her koşulda istisnasız sağlandığını varsaymak', isCorrect: false },
        ],
      },
      {
        headline: `${title} • Derece Öğrencisi Notu`,
        questionOrSummary: `${title} konusunu tamamen bitirip denemelerde fullemek için uygulanması gereken en etkili çalışma stratejisi:`,
        keyTakeaway: 'Altın Kural: Yapamadığın veya boş bıraktığın her soru kalıbını hata defterine ekle ve 72 saat içinde benzerini tekrar çöz.',
        options: [
          { key: 'A', text: 'Sadece konu anlatımı okuyup soru analizini atlamak', isCorrect: false },
          { key: 'B', text: 'Çıkmış soru kalıplarını ve hata defteri analizini birleştirmek', isCorrect: true },
        ],
      },
    ]
    const spv = singlePostVariants[variationSeed % singlePostVariants.length]

    return {
      id,
      title: spv.headline,
      type: 'post',
      topic,
      topicLabel: `${grade} • 1 Soru 1 Net`,
      sourcePrompt: rawPrompt,
      status: 'draft',
      targetAudience: grade,
      caption: `${spv.headline} 🦊🎯\n\n${spv.questionOrSummary}\n\n💡 ${spv.keyTakeaway}\n\nDoğru cevabı yorumlara yaz bakalım kimler yapabilecek? 👇\n\n#1soru1net #yks2027 #dersolab`,
      hashtags: ['#1soru1net', '#yks2027', '#dersolab'],
      singlePostData: {
        badge: `${badge} • 1 SORU 1 NET`,
        headline: spv.headline,
        questionOrSummary: spv.questionOrSummary,
        keyTakeaway: spv.keyTakeaway,
        options: spv.options,
        themeVariant: primaryTheme,
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

  // Tüm Slaytları + Açıklama Metnini Tek .ZIP Paketi Olarak İndir
  async function handleDownloadZip() {
    setIsZipDownloading(true)
    const toastId = toast.loading('Tüm slaytlar ve açıklama metni tek .ZIP paketinde birleştiriliyor...')
    try {
      await downloadPostAsZip(activePost, (curr, tot) => {
        setDownloadProgress(`ZIP Hazırlanıyor: ${curr}/${tot}`)
      })
      toast.success('Tüm slaytlar + açıklama.txt tek bir .ZIP paketi olarak indirildi!', { id: toastId })
    } catch (err: any) {
      console.error(err)
      toast.error('ZIP paketi oluşturulurken bir hata oluştu.', { id: toastId })
    } finally {
      setIsZipDownloading(false)
      setDownloadProgress('')
    }
  }

  // Reels İçin 9:16 Hareketli Video (.WEBM / .MP4) Üret ve İndir
  async function handleExportReelsVideo() {
    setIsVideoRendering(true)
    const toastId = toast.loading('9:16 dikey hareketli Reels videosu kare kare oluşturuluyor...')
    try {
      const videoRes = await generateReelsAnimatedVideoDataUrl(activePost)
      const videoFileName = `dersolab_reels_${Date.now()}.${videoRes.ext}`
      const link = document.createElement('a')
      link.href = videoRes.dataUrl
      link.download = videoFileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success(`Hareketli Reels videosu (${videoFileName}) hazırlandı ve indirildi!`, { id: toastId })
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Hareketli video oluşturulurken hata oluştu.', { id: toastId })
    } finally {
      setIsVideoRendering(false)
    }
  }

  // Reels Konuşma Metnini Sesli Oku (TTS Voiceover Önizleme)
  function handleSpeakReelsScript() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      toast.error('Tarayıcınız ses sentezleme (TTS) özelliğini desteklemiyor.')
      return
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    const textToRead =
      activePost.reelsStoryboard?.spokenScript ||
      `${activePost.title}. ${activePost.caption.replace(/#\S+/g, '')}`

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(textToRead)
    utterance.lang = 'tr-TR'
    utterance.rate = 1.04
    utterance.pitch = 1.0
    const voices = window.speechSynthesis.getVoices()
    const trVoice = voices.find((v) => v.lang.toLowerCase().includes('tr'))
    if (trVoice) utterance.voice = trVoice

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    window.speechSynthesis.speak(utterance)
    toast.success('Türkçe seslendirme (TTS) başlatıldı!')
  }

  // ÖZELLİK 1: 2 Slaytlı "Önce Soru, Kaydırınca Çözüm" Mini-Carousel Üretici
  function handleGenerateQuestionSolutionCarousel() {
    const rawSubject = genSubject.trim() || 'Paragrafta Ana Düşünce ve Çeldirici Eleme'
    const cleanTopic = toTurkishTitleCase(rawSubject)
    const nextSeed = variationSeedRef.current + 1
    variationSeedRef.current = nextSeed

    const qaBank = [
      {
        badge: `${genGrade} • ÖSYM PROVA SORUSU`,
        questionTitle: `${cleanTopic}: Bu Soruyu 40 Saniyede Çözebilir Misin?`,
        questionSub: 'Önce kendi cevabını yorumlara yaz, sonra çözümü görmek için sola kaydır 👉',
        options: [
          `Soru: ${cleanTopic} kapsamında verilen öncüllerden hangisi her koşulda kesinlikle doğrudur?`,
          'A) Yalnız I  •  B) Yalnız II  •  C) I ve II',
          'D) II ve III (Doğru Cevap Adayı)  •  E) I, II ve III',
        ],
        solutionTitle: 'Adım Adım Çözüm & Çeldirici Analizi ✅',
        solutionSub: 'Öğrencilerin %78’i C şıkkındaki sınır değer tuzağına düşüyor!',
        solutionSteps: [
          '1. Adım: Soru kökündeki "kesinlikle doğrudur" ifadesi uç değerlerin de sağlanmasını zorunlu kılar.',
          '2. Adım: I. öncül sınır değerde sağlansa bile negatif/istisnai durumda bozulduğu için elenir (Çeldirici!).',
          '3. Adım: II ve III. öncüller tanım kümesinin tamamında sağlandığı için doğru yanıt D seçeneğidir.',
        ],
      },
      {
        badge: `${genGrade} • 1 SORU 1 NET`,
        questionTitle: `${cleanTopic}: Sınavda Çıkarsa Eleyici Olacak Soru!`,
        questionSub: 'Çoğu kişinin B ve E şıkkı arasında kaldığı o soru kalıbı • Kaydır ve Çözümü Gör 👉',
        options: [
          `Soru: ${cleanTopic} kurallarına göre aşağıdaki ifadelerden hangisinde kavram yanılgısı vardır?`,
          'A) Temel bağıntı doğrudan korunur  •  B) Birim dönüşümü sabit kalır',
          'C) Oran-orantı modeli uygulanır  •  D) Sınır koşulu denetlenir  •  E) İstisna durumu hariç tutulur',
        ],
        solutionTitle: 'Doğru Cevap: B Şıkkı • Neden Yanıltıcı? 🎯',
        solutionSub: 'ÖSYM’nin en sevdiği "birim ve işaret" çeldiricisini yakala!',
        solutionSteps: [
          '1. Adım: A, C, D ve E şıkları konunun çekirdek kazanımıyla birebir örtüşmektedir.',
          '2. Adım: B şıkkında verilen "birim dönüşümü sabit kalır" ifadesi boyut analizi yapıldığında yanlıştır.',
          '3. Adım: Net Kurtaran Taktik: İşlemi bitirmeden önce birim ve işaret kontrolü yapmayı alışkanlık haline getir!',
        ],
      },
      {
        badge: `${genGrade} • DERECE SORUSU`,
        questionTitle: `${cleanTopic}: İlk Bakışta Kolay Görünüyor Ama...`,
        questionSub: 'Bakalım çeldiriciye düşmeden doğru şıkkı bulabilecek misin? Sola kaydır 👉',
        options: [
          `Soru: ${cleanTopic} ile ilgili I, II ve III numaralı yargılardan hangilerine ulaşılabilir?`,
          'A) Yalnız I  •  B) Yalnız III  •  C) I ve III',
          'D) II ve III  •  E) I, II ve III',
        ],
        solutionTitle: 'Çözüm & ÖSYM Tuzak Rehberi (Cevap: C) 🧠',
        solutionSub: 'II. öncüldeki "tümü / tamamı" genellemesi klasik bir ÖSYM çeldiricisidir!',
        solutionSteps: [
          '1. Adım: I. yargı verilen temel ilkenin doğrudan sonucudur (+).',
          '2. Adım: II. yargıdaki aşırı genelleme ("her zaman tüm durumlarda") tek bir aksi örnekle çürütülür (-).',
          '3. Adım: III. yargı neden-sonuç ilişkisini doğru kurduğu için cevap C (I ve III) olur.',
        ],
      },
    ]

    const chosen = qaBank[nextSeed % qaBank.length]
    const themes: SlideThemeVariant[] = ['neon_orange', 'lab_dark', 'cyan_cyber', 'purple_matrix']

    const qaPost: SocialPostItem = {
      id: `post_qa_${Date.now()}`,
      title: chosen.questionTitle,
      type: 'carousel',
      topic: 'exam_tactics',
      topicLabel: `${genGrade} • Soru + Çözüm (2 Slayt)`,
      sourcePrompt: rawSubject,
      status: 'draft',
      targetAudience: genGrade,
      caption: `❓ Önce Soru, Kaydırınca Çözüm! (${cleanTopic}) 🦊🎯\n\nKaydırmadan önce bulduğun şıkkı yorumlara yaz, sonra 2. slayttaki çeldirici analizini kontrol et! 👇\n\n💾 Sınav öncesi tekrar etmek için kaydetmeyi unutma!\n\n#1soru1net #yks2027 #lgs2027 #dersolab #soruçözüm`,
      hashtags: ['#1soru1net', '#yks2027', '#lgs2027', '#dersolab', '#soruçözüm'],
      carouselSlides: [
        {
          slideNumber: 1,
          badge: chosen.badge,
          headline: chosen.questionTitle,
          subhead: chosen.questionSub,
          bodyPoints: chosen.options,
          highlightTag: '1. SLAYT: SORU ❓',
          footerNote: 'Cevabını Yorumlara Yaz • Çözüm İçin Kaydır 👉',
          themeVariant: themes[nextSeed % 4],
        },
        {
          slideNumber: 2,
          badge: '2. SLAYT • ADIM ADIM ÇÖZÜM & ÇELDİRİCİ ANALİZİ',
          headline: chosen.solutionTitle,
          subhead: chosen.solutionSub,
          bodyPoints: chosen.solutionSteps,
          highlightTag: '2. SLAYT: ÇÖZÜM ✅',
          footerNote: 'DersoLab L.A.B. • @dersolabegitim',
          themeVariant: themes[(nextSeed + 1) % 4],
        },
      ],
      createdAt: new Date().toISOString(),
    }

    const updated = [qaPost, ...posts]
    savePosts(updated)
    setActivePostId(qaPost.id)
    setActiveSlideIndex(0)
    setGenType('carousel')
    upsertSocialPostToDb(qaPost).catch(() => {})
    toast.success('2 Slaytlı "Önce Soru, Kaydırınca Çözüm" gönderisi oluşturuldu!')
  }

  // ÖZELLİK 2: YKS 2027 & LGS 2027 Otomatik Canlı Geri Sayım (Countdown) Şablonu
  function handleGenerateCountdownPost() {
    const now = new Date()
    const isLgs = genGrade === 'LGS'
    // Tahmini resmi sınav takvimi: YKS 2027 -> 19 Haziran 2027, LGS 2027 -> 6 Haziran 2027
    const targetDate = isLgs ? new Date('2027-06-06T09:30:00') : new Date('2027-06-19T10:15:00')
    const diffMs = targetDate.getTime() - now.getTime()
    const daysLeft = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
    const examName = isLgs ? 'LGS 2027' : 'YKS 2027'
    const focusTopic = toTurkishTitleCase(genSubject.trim() || (isLgs ? 'Paragraf & Yeni Nesil Matematik' : 'TYT Türkçe & AYT Matematik'))

    const nextSeed = variationSeedRef.current + 1
    variationSeedRef.current = nextSeed
    const themes: SlideThemeVariant[] = ['cyan_cyber', 'neon_orange', 'purple_matrix', 'lab_dark']
    const chosenTheme = themes[nextSeed % themes.length]

    if (genType === 'story') {
      const countdownStory: SocialPostItem = {
        id: `post_countdown_${Date.now()}`,
        title: `⏳ ${examName}'ye ${daysLeft} Gün Kaldı!`,
        type: 'story',
        topic: 'motivation',
        topicLabel: `${examName} • Canlı Geri Sayım (${daysLeft} Gün)`,
        sourcePrompt: `${examName} Geri Sayım`,
        status: 'draft',
        targetAudience: examName,
        caption: `⏳ ${examName}'ye tam ${daysLeft} gün kaldı! Bugün hedefin için masanın başında mısın? 🔥🦊\n\nGünün Odak Konusu: ${focusTopic}\n\n#yks2027 #lgs2027 #gerisayım #dersolab #motivasyon`,
        hashtags: ['#yks2027', '#lgs2027', '#gerisayım', '#dersolab', '#motivasyon'],
        storyData: {
          badge: `⏳ ${examName} GERİ SAYIM SAYACI`,
          headline: `${examName}'ye ${daysLeft} Gün Kaldı!`,
          subhead: `Bugünün Odak Görevi: ${focusTopic} konusundan en az 40 soru çöz ve yanlışlarını analiz et! 🎯`,
          stickerType: genStorySticker,
          stickerQuestion: `Bugün ${daysLeft}. gün hedefini tamamladın mı?`,
          stickerOptions: ['Hedef Tamamlandı 🔥', 'Şimdi Başlıyorum 💪'],
          stickerLinkText: 'Günlük Çalışma Planı',
          stickerLinkUrl: 'https://dersolab.com/lab',
          themeVariant: chosenTheme,
        },
        createdAt: new Date().toISOString(),
      }
      const updated = [countdownStory, ...posts]
      savePosts(updated)
      setActivePostId(countdownStory.id)
      setActiveSlideIndex(0)
      upsertSocialPostToDb(countdownStory).catch(() => {})
      toast.success(`${examName}'ye ${daysLeft} Gün Kaldı hikaye şablonu hazırlandı!`)
      return
    }

    const countdownCarousel: SocialPostItem = {
      id: `post_countdown_${Date.now()}`,
      title: `⏳ ${examName}'ye ${daysLeft} Gün Kaldı: Bugün Ne Yapmalısın?`,
      type: 'carousel',
      topic: 'motivation',
      topicLabel: `${examName} • ${daysLeft} Gün Geri Sayım`,
      sourcePrompt: `${examName} Geri Sayım`,
      status: 'draft',
      targetAudience: examName,
      caption: `⏳ ${examName} Maratonunda Son ${daysLeft} Gün! 🦊🔥\n\nKalan ${daysLeft} günü en verimli şekilde değerlendirmek için bugünün 3 kritik görevini kaydırarak incele ve kaydet! 👇\n\n#yks2027 #lgs2027 #gerisayım #dersolab #studygram`,
      hashtags: ['#yks2027', '#lgs2027', '#gerisayım', '#dersolab', '#studygram'],
      carouselSlides: [
        {
          slideNumber: 1,
          badge: `⏳ CANLI GERİ SAYIM • ${examName}`,
          headline: `${examName}'ye ${daysLeft} Gün Kaldı!`,
          subhead: 'Zaman daralırken netlerini sıçratacak günlük çalışma disiplini',
          bodyPoints: [
            `📅 Bugünün Odak Konusu: ${focusTopic}`,
            '⏱️ 20 dakika kesintisiz paragraf + 40 dakika branş denemesi rutini',
            'Kaydır; kalan sürede netlerini +15 artıracak planı gör 👉',
          ],
          highlightTag: `SON ${daysLeft} GÜN`,
          footerNote: 'DersoLab Sınav Laboratuvarı • @dersolabegitim',
          themeVariant: chosenTheme,
        },
        {
          slideNumber: 2,
          badge: `GÜNÜN 3 ALTIN GÖREVİ • ${daysLeft}. GÜN`,
          headline: 'Bugün Masadan Kalkmadan Önce Bu 3 Adımı Tamamla',
          subhead: 'Ertelemeyi bırak, bugün çözdüğün her soru sınav günü +1 net demek!',
          bodyPoints: [
            `1. Görev: ${focusTopic} başlığındaki eksik kazanımlarını 30 dakikada tekrar et.`,
            '2. Görev: Süre tutarak 2 test çöz ve boş/yanlış sorularının çözümünü hemen öğren.',
            '3. Görev: Yorumlara "Bugünkü hedefim tamam!" yazarak zinciri kırma 🔥',
          ],
          highlightTag: 'ZİNCİRİ KIRMA 🔥',
          footerNote: 'DersoLab L.A.B. • @dersolabegitim',
          themeVariant: themes[(nextSeed + 1) % 4],
        },
      ],
      createdAt: new Date().toISOString(),
    }

    const updated = [countdownCarousel, ...posts]
    savePosts(updated)
    setActivePostId(countdownCarousel.id)
    setActiveSlideIndex(0)
    setGenType('carousel')
    upsertSocialPostToDb(countdownCarousel).catch(() => {})
    toast.success(`${examName}'ye ${daysLeft} Gün Kaldı geri sayım şablonu oluşturuldu!`)
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
            onClick={() => setIsApiConfigOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/25 text-xs font-semibold text-emerald-300 hover:text-white transition-all cursor-pointer"
            title="Instagram Graph API ve TikTok API Doğrudan Paylaşım Ayarları"
          >
            <Settings className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Doğrudan API Ayarları</span>
          </button>

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
                <div className="text-[10px] text-slate-400">9:16 Dikey Hikaye</div>
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

            {/* Story seçildiğinde İsteğe Bağlı Çıkartma Tercihi (Varsayılan: Çıkartma Yok) */}
            {genType === 'story' && (
              <div className="mb-3.5 p-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-slate-300">
                  Story Etkileşim Çıkartması (İsteğe Bağlı):
                </span>
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: 'none', label: '✨ Çıkartma Yok (Saf Görsel)' },
                    { id: 'poll', label: '📊 İkili Anket (Poll)' },
                    { id: 'quiz', label: '❓ Çoktan Seçmeli Test (Quiz)' },
                    { id: 'link', label: '🔗 Bağlantı (Link)' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setGenStorySticker(st.id as StoryStickerType)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        genStorySticker === st.id
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'bg-black/40 text-slate-400 hover:text-white border border-white/10'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Konu Girişi ve Butonlar */}
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
                  placeholder="İstediğin konuyu yaz (örn: Kitap Önerisi, Trigonometri, Paragraf Hızı, Hücre Zarı)..."
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

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  disabled={isGenerating || isRegenerating || isBatchLoading}
                  onClick={() => handleGeneratePost()}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-orange-500/20 transition-all shrink-0 active:scale-95 cursor-pointer"
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

                <button
                  type="button"
                  disabled={isRegenerating || isGenerating || isBatchLoading}
                  onClick={handleRegenerateActivePost}
                  title="Girilen prompt/konu sabit kalır, sadece gönderi çıktısını değiştirerek yeni bir alternatif üretir"
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-orange-500/40 text-orange-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shrink-0 active:scale-95 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                  <span>{isRegenerating ? 'Yenileniyor...' : 'Yeniden Dene'}</span>
                </button>
              </div>
            </div>

            {/* Otonom Günlük Paket (3 Post), 7 Günlük Haftalık Takvim, 2 Slayt Soru+Çözüm ve Canlı Geri Sayım Hızlı Butonları */}
            <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isBatchLoading || isGenerating}
                onClick={handleGenerateQuestionSolutionCarousel}
                className="py-2 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>❓ Önce Soru, Kaydırınca Çözüm (2 Slayt)</span>
              </button>

              <button
                type="button"
                disabled={isBatchLoading || isGenerating}
                onClick={handleGenerateCountdownPost}
                className="py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-emerald-400" />
                <span>⏳ YKS & LGS 2027 Canlı Geri Sayım Şablonu</span>
              </button>

              <button
                type="button"
                disabled={isBatchLoading || isGenerating}
                onClick={handleGenerateDailyBatch}
                className="py-2 px-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/25 text-cyan-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Flame className="w-3.5 h-3.5 text-cyan-400" />
                <span>⚡ Otonom Günlük Paket (3 Post)</span>
              </button>

              <button
                type="button"
                disabled={isBatchLoading || isGenerating}
                onClick={handleGenerateWeeklyCalendar}
                className="py-2 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/25 text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span>📅 7 Günlük Haftalık Takvim Üret</span>
              </button>
            </div>
          </div>

          {/* KART 2: CANLI GÖNDERİ DÜZENLEYİCİ */}
          <div className="rounded-2xl border border-white/10 bg-[#0B0F19]/80 backdrop-blur-md p-4 sm:p-5 shadow-xl flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-orange-400" />
                <h3 className="text-sm font-bold text-white">Gönderi Düzenleyici</h3>
                <span className="text-[11px] font-bold text-slate-400 uppercase px-2 py-0.5 rounded-md bg-white/5">
                  {activePost.type === 'carousel'
                    ? '📸 Carousel'
                    : activePost.type === 'story'
                      ? '📱 Story (9:16)'
                      : activePost.type === 'reels'
                        ? '🎬 Reels'
                        : '📝 Tekli Post'}
                </span>
              </div>

              {/* Beğenmedim / Yeniden Dene Butonu */}
              <button
                type="button"
                disabled={isRegenerating || isGenerating}
                onClick={handleRegenerateActivePost}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 border border-orange-500/40 text-orange-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                <span>
                  {isRegenerating ? 'Alternatif Üretiliyor...' : '🔄 Beğenmedim, Yeniden Dene'}
                </span>
              </button>
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
              <div className="border border-white/10 rounded-xl p-3.5 bg-black/30 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-orange-400">Story (9:16) İçerik ve Çıkartma Ayarları</div>
                  <span className="text-[10px] text-slate-400">
                    {activePost.storyData.stickerType === 'none' || !activePost.storyData.stickerType
                      ? '✨ Saf Görsel (Çıkartmasız)'
                      : '🎯 Etkileşim Çıkartması Aktif'}
                  </span>
                </div>

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
                    <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                      Çıkartma Tipi (İsteğe Bağlı)
                    </label>
                    <select
                      value={activePost.storyData.stickerType || 'none'}
                      onChange={(e) =>
                        handleUpdateActivePost({
                          ...activePost,
                          storyData: { ...activePost.storyData!, stickerType: e.target.value as StoryStickerType },
                        })
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                    >
                      <option value="none" className="bg-neutral-900">
                        ✨ Çıkartma Yok (Sadece Görsel & İçerik)
                      </option>
                      <option value="poll" className="bg-neutral-900">
                        📊 İkili Anket (Poll)
                      </option>
                      <option value="quiz" className="bg-neutral-900">
                        ❓ Çoktan Seçmeli Test (Quiz)
                      </option>
                      <option value="link" className="bg-neutral-900">
                        🔗 Bağlantı Çıkartması (Link)
                      </option>
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

                {/* İKİLİ KİTAP ÖNERİSİ EDİTÖRÜ (ORTAOKUL & LİSE) */}
                {activePost.storyData.dualBookData && (
                  <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 flex flex-col gap-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-bold text-white">
                          Haftalık Kitap Önerisi Kartları (Ortaokul & Lise)
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={handlePickNextPairFromPool}
                          className="px-2.5 py-1 rounded-lg bg-emerald-500/25 hover:bg-emerald-500/35 border border-emerald-400/40 text-emerald-200 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-sm"
                          title="1000'er kitaplık havuzdan sıradaki kullanılmamış Ortaokul ve Lise eserlerini çeker ve havuzdan çıkarır."
                        >
                          <span>🎲 Sıradaki Çifti Çek</span>
                        </button>
                        <button
                          type="button"
                          disabled={isRegenerating || isGenerating}
                          onClick={handleRegenerateActivePost}
                          className="px-2.5 py-1 rounded-lg bg-purple-500/25 hover:bg-purple-500/35 border border-purple-400/40 text-purple-200 text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <RefreshCw className={`w-3 h-3 ${isRegenerating ? 'animate-spin' : ''}`} />
                          <span>🔄 Yeniden Dene</span>
                        </button>
                      </div>
                    </div>

                    {/* CANLI KİTAP HAVUZU İSTATİSTİK ŞERİDİ (1000 Ortaokul + 1000 Lise) */}
                    <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-purple-950/60 via-slate-900/80 to-purple-950/60 border border-purple-400/30 flex flex-wrap items-center justify-between gap-2 shadow-inner">
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span className="font-bold text-purple-300 flex items-center gap-1">
                          📚 Canlı Kitap Havuzu:
                        </span>
                        <div className="flex items-center gap-1 bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 rounded text-sky-200 font-semibold">
                          <span>📘 Ortaokul:</span>
                          <strong className="text-sky-300 font-black">{poolStats.ortaokul.remaining}</strong>
                          <span className="text-sky-400/70 text-[10px]">/ {poolStats.ortaokul.total}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-orange-500/15 border border-orange-500/30 px-2 py-0.5 rounded text-orange-200 font-semibold">
                          <span>📕 Lise:</span>
                          <strong className="text-orange-300 font-black">{poolStats.lise.remaining}</strong>
                          <span className="text-orange-400/70 text-[10px]">/ {poolStats.lise.total}</span>
                        </div>
                        <span className="text-emerald-400 font-semibold text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          ✓ {poolStats.ortaokul.used + poolStats.lise.used} Eser Kullanıldı
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleResetBookPool}
                        className="text-[10px] px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/15 transition-all cursor-pointer font-medium"
                        title="Tüm kullanılan kitap kayıtlarını sıfırlar; 1000 Ortaokul ve 1000 Lise eseri tekrar taze havuz olur."
                      >
                        🔄 Havuzu Sıfırla
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Ortaokul Kitabı */}
                      <div className="p-2.5 rounded-lg bg-black/40 border border-sky-500/25 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-sky-400 uppercase">
                            📘 Ortaokul (LGS) Kitabı
                          </span>
                          <button
                            type="button"
                            onClick={() => handlePickNextSingleBookFromPool('ortaokul')}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 border border-sky-500/30 font-semibold cursor-pointer transition-all flex items-center gap-1"
                            title="1000 kitaplık Ortaokul havuzundan sıradaki kullanılmamış eseri getirir."
                          >
                            <span>🎲 Sıradaki Eser</span>
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Kitap Adı"
                          value={activePost.storyData.dualBookData.ortaokul.title}
                          onChange={(e) => {
                            const nextTitle = e.target.value
                            const currentBook = activePost.storyData!.dualBookData!.ortaokul
                            const isRealCover = currentBook.imageUrl && !currentBook.imageUrl.startsWith('data:image/svg')
                            handleUpdateActivePost({
                              ...activePost,
                              storyData: {
                                ...activePost.storyData!,
                                dualBookData: {
                                  ...activePost.storyData!.dualBookData!,
                                  ortaokul: {
                                    ...currentBook,
                                    title: nextTitle,
                                    imageUrl: isRealCover
                                      ? currentBook.imageUrl
                                      : buildBookCoverSvgDataUrl(
                                          nextTitle,
                                          currentBook.author,
                                          currentBook.genre,
                                          'ortaokul'
                                        ),
                                  },
                                },
                              },
                            })
                          }}
                          className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-white font-bold"
                        />
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            placeholder="Yazar"
                            value={activePost.storyData.dualBookData.ortaokul.author}
                            onChange={(e) => {
                              const nextAuthor = e.target.value
                              const currentBook = activePost.storyData!.dualBookData!.ortaokul
                              const isRealCover = currentBook.imageUrl && !currentBook.imageUrl.startsWith('data:image/svg')
                              handleUpdateActivePost({
                                ...activePost,
                                storyData: {
                                  ...activePost.storyData!,
                                  dualBookData: {
                                    ...activePost.storyData!.dualBookData!,
                                    ortaokul: {
                                      ...currentBook,
                                      author: nextAuthor,
                                      imageUrl: isRealCover
                                        ? currentBook.imageUrl
                                        : buildBookCoverSvgDataUrl(
                                            currentBook.title,
                                            nextAuthor,
                                            currentBook.genre,
                                            'ortaokul'
                                          ),
                                    },
                                  },
                                },
                              })
                            }}
                            className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-[11px] text-slate-200"
                          />
                          <input
                            type="text"
                            placeholder="Tür"
                            value={activePost.storyData.dualBookData.ortaokul.genre}
                            onChange={(e) => {
                              const nextGenre = e.target.value
                              const currentBook = activePost.storyData!.dualBookData!.ortaokul
                              const isRealCover = currentBook.imageUrl && !currentBook.imageUrl.startsWith('data:image/svg')
                              handleUpdateActivePost({
                                ...activePost,
                                storyData: {
                                  ...activePost.storyData!,
                                  dualBookData: {
                                    ...activePost.storyData!.dualBookData!,
                                    ortaokul: {
                                      ...currentBook,
                                      genre: nextGenre,
                                      imageUrl: isRealCover
                                        ? currentBook.imageUrl
                                        : buildBookCoverSvgDataUrl(
                                            currentBook.title,
                                            currentBook.author,
                                            nextGenre,
                                            'ortaokul'
                                          ),
                                    },
                                  },
                                },
                              })
                            }}
                            className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-[11px] text-slate-200"
                          />
                        </div>
                        <textarea
                          rows={2}
                          placeholder="Neden okunmalı?"
                          value={activePost.storyData.dualBookData.ortaokul.whyRead}
                          onChange={(e) => {
                            const currentBook = activePost.storyData!.dualBookData!.ortaokul
                            handleUpdateActivePost({
                              ...activePost,
                              storyData: {
                                ...activePost.storyData!,
                                dualBookData: {
                                  ...activePost.storyData!.dualBookData!,
                                  ortaokul: {
                                    ...currentBook,
                                    whyRead: e.target.value,
                                  },
                                },
                              },
                            })
                          }}
                          className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-[11px] text-slate-300"
                        />
                        {/* Gerçek Kapak Görseli ve Arama Butonu */}
                        <div className="pt-1.5 border-t border-sky-500/20 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-sky-300 font-semibold flex items-center gap-1">
                              🖼️ Kitap Kapağı Görseli
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAutoFindBookCover('ortaokul')}
                              disabled={isSearchingCover.ortaokul}
                              className="text-[10px] px-2 py-0.5 rounded bg-sky-500/25 hover:bg-sky-500/35 border border-sky-500/30 text-sky-200 font-semibold cursor-pointer disabled:opacity-50 transition-all flex items-center gap-1"
                            >
                              {isSearchingCover.ortaokul ? '⏳ Aranıyor...' : '🔍 Gerçek Kapağı Bul'}
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            {activePost.storyData.dualBookData.ortaokul.imageUrl && (
                              <div className="w-8 h-11 shrink-0 rounded overflow-hidden border border-sky-500/40 bg-black/50">
                                <img
                                  src={activePost.storyData.dualBookData.ortaokul.imageUrl}
                                  alt="Kapak"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <input
                              type="text"
                              placeholder="Google Görseller veya web kapak URL'si yapıştırın"
                              value={activePost.storyData.dualBookData.ortaokul.imageUrl || ''}
                              onChange={(e) => {
                                const newUrl = e.target.value
                                const currentBook = activePost.storyData!.dualBookData!.ortaokul
                                handleUpdateActivePost({
                                  ...activePost,
                                  storyData: {
                                    ...activePost.storyData!,
                                    dualBookData: {
                                      ...activePost.storyData!.dualBookData!,
                                      ortaokul: {
                                        ...currentBook,
                                        imageUrl: newUrl || buildBookCoverSvgDataUrl(currentBook.title, currentBook.author, currentBook.genre, 'ortaokul'),
                                      },
                                    },
                                  },
                                })
                              }}
                              className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300 font-mono"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Lise Kitabı */}
                      <div className="p-2.5 rounded-lg bg-black/40 border border-orange-500/25 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-orange-400 uppercase">
                            📕 Lise (YKS) Kitabı
                          </span>
                          <button
                            type="button"
                            onClick={() => handlePickNextSingleBookFromPool('lise')}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 hover:bg-orange-500/30 text-orange-200 border border-orange-500/30 font-semibold cursor-pointer transition-all flex items-center gap-1"
                            title="1000 kitaplık Lise havuzundan sıradaki kullanılmamış eseri getirir."
                          >
                            <span>🎲 Sıradaki Eser</span>
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Kitap Adı"
                          value={activePost.storyData.dualBookData.lise.title}
                          onChange={(e) => {
                            const nextTitle = e.target.value
                            const currentBook = activePost.storyData!.dualBookData!.lise
                            const isRealCover = currentBook.imageUrl && !currentBook.imageUrl.startsWith('data:image/svg')
                            handleUpdateActivePost({
                              ...activePost,
                              storyData: {
                                ...activePost.storyData!,
                                dualBookData: {
                                  ...activePost.storyData!.dualBookData!,
                                  lise: {
                                    ...currentBook,
                                    title: nextTitle,
                                    imageUrl: isRealCover
                                      ? currentBook.imageUrl
                                      : buildBookCoverSvgDataUrl(
                                          nextTitle,
                                          currentBook.author,
                                          currentBook.genre,
                                          'lise'
                                        ),
                                  },
                                },
                              },
                            })
                          }}
                          className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-xs text-white font-bold"
                        />
                        <div className="grid grid-cols-2 gap-1.5">
                          <input
                            type="text"
                            placeholder="Yazar"
                            value={activePost.storyData.dualBookData.lise.author}
                            onChange={(e) => {
                              const nextAuthor = e.target.value
                              const currentBook = activePost.storyData!.dualBookData!.lise
                              const isRealCover = currentBook.imageUrl && !currentBook.imageUrl.startsWith('data:image/svg')
                              handleUpdateActivePost({
                                ...activePost,
                                storyData: {
                                  ...activePost.storyData!,
                                  dualBookData: {
                                    ...activePost.storyData!.dualBookData!,
                                    lise: {
                                      ...currentBook,
                                      author: nextAuthor,
                                      imageUrl: isRealCover
                                        ? currentBook.imageUrl
                                        : buildBookCoverSvgDataUrl(
                                            currentBook.title,
                                            nextAuthor,
                                            currentBook.genre,
                                            'lise'
                                          ),
                                    },
                                  },
                                },
                              })
                            }}
                            className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-[11px] text-slate-200"
                          />
                          <input
                            type="text"
                            placeholder="Tür"
                            value={activePost.storyData.dualBookData.lise.genre}
                            onChange={(e) => {
                              const nextGenre = e.target.value
                              const currentBook = activePost.storyData!.dualBookData!.lise
                              const isRealCover = currentBook.imageUrl && !currentBook.imageUrl.startsWith('data:image/svg')
                              handleUpdateActivePost({
                                ...activePost,
                                storyData: {
                                  ...activePost.storyData!,
                                  dualBookData: {
                                    ...activePost.storyData!.dualBookData!,
                                    lise: {
                                      ...currentBook,
                                      genre: nextGenre,
                                      imageUrl: isRealCover
                                        ? currentBook.imageUrl
                                        : buildBookCoverSvgDataUrl(
                                            currentBook.title,
                                            currentBook.author,
                                            nextGenre,
                                            'lise'
                                          ),
                                    },
                                  },
                                },
                              })
                            }}
                            className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-[11px] text-slate-200"
                          />
                        </div>
                        <textarea
                          rows={2}
                          placeholder="Neden okunmalı?"
                          value={activePost.storyData.dualBookData.lise.whyRead}
                          onChange={(e) => {
                            const currentBook = activePost.storyData!.dualBookData!.lise
                            handleUpdateActivePost({
                              ...activePost,
                              storyData: {
                                ...activePost.storyData!,
                                dualBookData: {
                                  ...activePost.storyData!.dualBookData!,
                                  lise: {
                                    ...currentBook,
                                    whyRead: e.target.value,
                                  },
                                },
                              },
                            })
                          }}
                          className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-[11px] text-slate-300"
                        />
                        {/* Gerçek Kapak Görseli ve Arama Butonu */}
                        <div className="pt-1.5 border-t border-orange-500/20 flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-orange-300 font-semibold flex items-center gap-1">
                              🖼️ Kitap Kapağı Görseli
                            </span>
                            <button
                              type="button"
                              onClick={() => handleAutoFindBookCover('lise')}
                              disabled={isSearchingCover.lise}
                              className="text-[10px] px-2 py-0.5 rounded bg-orange-500/25 hover:bg-orange-500/35 border border-orange-500/30 text-orange-200 font-semibold cursor-pointer disabled:opacity-50 transition-all flex items-center gap-1"
                            >
                              {isSearchingCover.lise ? '⏳ Aranıyor...' : '🔍 Gerçek Kapağı Bul'}
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            {activePost.storyData.dualBookData.lise.imageUrl && (
                              <div className="w-8 h-11 shrink-0 rounded overflow-hidden border border-orange-500/40 bg-black/50">
                                <img
                                  src={activePost.storyData.dualBookData.lise.imageUrl}
                                  alt="Kapak"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <input
                              type="text"
                              placeholder="Google Görseller veya web kapak URL'si yapıştırın"
                              value={activePost.storyData.dualBookData.lise.imageUrl || ''}
                              onChange={(e) => {
                                const newUrl = e.target.value
                                const currentBook = activePost.storyData!.dualBookData!.lise
                                handleUpdateActivePost({
                                  ...activePost,
                                  storyData: {
                                    ...activePost.storyData!,
                                    dualBookData: {
                                      ...activePost.storyData!.dualBookData!,
                                      lise: {
                                        ...currentBook,
                                        imageUrl: newUrl || buildBookCoverSvgDataUrl(currentBook.title, currentBook.author, currentBook.genre, 'lise'),
                                      },
                                    },
                                  },
                                })
                              }}
                              className="w-full px-2 py-1 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300 font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Çıkartma Ayarları yalnızca çıkartma seçildiyse gösterilir */}
                {activePost.storyData.stickerType && activePost.storyData.stickerType !== 'none' && (
                  <>
                    {(activePost.storyData.stickerType === 'quiz' || activePost.storyData.stickerType === 'poll') && (
                      <>
                        <div>
                          <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                            Anket / Soru Çıkartması Başlığı
                          </label>
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
                                      const next = (activePost.storyData?.stickerOptions || []).filter(
                                        (_, i) => i !== idx
                                      )
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
                      </>
                    )}

                    {activePost.storyData.stickerType === 'link' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-semibold text-slate-400 block mb-1">
                            Link Çıkartma Metni
                          </label>
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
                    )}
                  </>
                )}
              </div>
            )}

            {/* 4. REELS ALANLARI */}
            {isReels && activePost.reelsStoryboard && (
              <div className="border border-white/10 rounded-xl p-3.5 bg-black/30 flex flex-col gap-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-bold text-orange-400">Reels & TikTok Tam Senaryo + Video Stüdyosu</div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handleSpeakReelsScript}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-200 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{isSpeaking ? 'Seslendirmeyi Durdur' : 'Seslendirmeyi Dinle (TTS)'}</span>
                    </button>
                    <button
                      type="button"
                      disabled={isVideoRendering}
                      onClick={handleExportReelsVideo}
                      className="px-2.5 py-1 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-200 text-[11px] font-bold flex items-center gap-1 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Video className="w-3.5 h-3.5 text-orange-400" />
                      <span>{isVideoRendering ? 'Video Hazırlanıyor...' : 'Hareketli Video İndir (.WEBM/.MP4)'}</span>
                    </button>
                  </div>
                </div>
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

          {/* HIZLI DIŞA AKTARMA, YENİDEN DENE VE TEK TUŞLA PAYLAŞIM PANELİ */}
          <div className="w-full max-w-[390px] rounded-2xl border border-white/10 bg-[#0B0F19]/90 backdrop-blur-md p-4 shadow-xl flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Yayın Hazırlığı & Paylaşım</span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                1080p Hazır
              </span>
            </div>

            {/* Beğenmedim / Yeniden Dene Butonu (Telefonun Hemen Altında) */}
            <button
              type="button"
              disabled={isRegenerating || isGenerating || isPublishing}
              onClick={handleRegenerateActivePost}
              className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-orange-500/20 hover:from-indigo-500/30 hover:to-orange-500/30 border border-orange-500/40 disabled:opacity-50 text-orange-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 text-orange-400 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>
                {isRegenerating
                  ? 'Yeni Alternatif Hazırlanıyor...'
                  : 'Beğenmedim, Yeniden Dene (Farklı Alternatif Üret)'}
              </span>
            </button>

            {/* Tek Tuşla Instagram & TikTok Paylaşım Butonu (Zorla İndirmez, Doğrudan Bulut & API Kullanır) */}
            <button
              type="button"
              disabled={isPublishing || isDownloading || isZipDownloading}
              onClick={handleOneClickPublish}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-pink-500 via-orange-500 to-amber-500 hover:from-pink-600 hover:to-amber-600 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-pink-500/20 transition-all active:scale-98 cursor-pointer"
            >
              {isPublishing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Buluta Yükleniyor & API İle Paylaşılıyor...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Tek Tuşla Doğrudan Paylaş (Instagram & TikTok)</span>
                </>
              )}
            </button>

            {/* Reels ise Hareketli Video & TTS Hızlı Aksiyonları */}
            {isReels && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isVideoRendering || isPublishing}
                  onClick={handleExportReelsVideo}
                  className="py-2 px-3 rounded-xl bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                >
                  <Video className={`w-3.5 h-3.5 text-orange-400 ${isVideoRendering ? 'animate-pulse' : ''}`} />
                  <span>{isVideoRendering ? 'Video Üretiliyor...' : 'Hareketli Video (.MP4)'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleSpeakReelsScript}
                  className="py-2 px-3 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{isSpeaking ? 'Sesi Durdur' : 'Sesli Oku (TTS)'}</span>
                </button>
              </div>
            )}

            {/* İsteğe Bağlı İndirme Seçenekleri: Tek .ZIP Paketi veya PNG İndir */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                disabled={isZipDownloading || isDownloading || isPublishing}
                onClick={handleDownloadZip}
                className="py-2 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 disabled:opacity-50 text-emerald-200 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Tüm slaytları ve açıklama metnini tek bir .ZIP paketi olarak indirir"
              >
                <Archive className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">
                  {isZipDownloading ? 'ZIP Hazırlanıyor...' : '📦 Tek .ZIP Paketi İndir'}
                </span>
              </button>

              <button
                type="button"
                disabled={isDownloading || isZipDownloading || isPublishing}
                onClick={handleDownloadAll}
                className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 disabled:opacity-50 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span className="truncate">
                  {isDownloading
                    ? downloadProgress || 'İndiriliyor...'
                    : isCarousel
                      ? `PNG İndir (${activePost.carouselSlides?.length || 1})`
                      : 'PNG İndir (1080p)'}
                </span>
              </button>
            </div>

            {/* İkincil Eylemler (Metin Kopyala + API Ayarları) */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleCopyCaption}
                className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Metni Kopyala</span>
              </button>

              <button
                type="button"
                onClick={() => setIsApiConfigOpen(true)}
                className="py-2 px-3 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20 text-xs font-semibold text-pink-300 hover:text-pink-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>API Bağlantısı</span>
              </button>
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

      {/* DOĞRUDAN INSTAGRAM GRAPH API & TIKTOK API BAĞLANTI AYARLARI MODALI */}
      {isApiConfigOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-[#0E1322] border border-white/15 rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Instagram & TikTok Doğrudan Paylaşım (API) Ayarları
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsApiConfigOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                ✕
              </button>
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-slate-200 leading-relaxed space-y-1.5">
              <div className="font-bold text-emerald-300">Neden Cihaza İndirmeden Doğrudan Paylaşım?</div>
              <p className="text-[11px] text-slate-300">
                <strong>"Tek Tuşla Doğrudan Paylaş"</strong> butonuna bastığında görseller/videolar artık cihazına zorla indirilmez; otomatik olarak <strong>Supabase Bulut Depolamaya</strong> yüklenir.
              </p>
              <p className="text-[11px] text-slate-300">
                Meta (Instagram Graph API v21.0) ve TikTok Content Posting API v2 güvenlik kuralları gereği, hesabına dışarıdan otomatik gönderi atılabilmesi için resmi <strong>Access Token</strong> ve <strong>Business Account ID</strong> tanımlanmalıdır (Vercel ortam değişkenlerinden veya aşağıdaki alandan).
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-pink-300 block mb-1">
                  Instagram Business Account ID (INSTAGRAM_BUSINESS_ACCOUNT_ID)
                </label>
                <input
                  type="text"
                  value={customIgAccountId}
                  onChange={(e) => setCustomIgAccountId(e.target.value)}
                  placeholder="Örn: 17841405822304914 (Sunucu env'de tanımlıysa boş bırakabilirsiniz)"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-pink-300 block mb-1">
                  Instagram Graph API Access Token (INSTAGRAM_ACCESS_TOKEN)
                </label>
                <input
                  type="password"
                  value={customIgToken}
                  onChange={(e) => setCustomIgToken(e.target.value)}
                  placeholder="EAA... (Meta Developer Portal > Instagram Graph API Token)"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-cyan-300 block mb-1">
                  TikTok Content Posting API Access Token (TIKTOK_ACCESS_TOKEN)
                </label>
                <input
                  type="password"
                  value={customTiktokToken}
                  onChange={(e) => setCustomTiktokToken(e.target.value)}
                  placeholder="act.... (TikTok Developer Portal > video.publish yetkili Token)"
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsApiConfigOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleSaveApiConfig}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-xs font-bold text-white shadow-lg"
              >
                Kaydet ve Etkinleştir
              </button>
            </div>
          </div>
        </div>
      )}

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
                      localStorage.removeItem('dersolab_social_posts_v7')
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
