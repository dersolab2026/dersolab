'use client'

import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Calendar,
  Layers,
  Film,
  HelpCircle,
  Smartphone,
  Plus,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  MoreVertical,
  Download,
  Share2,
  Copy,
  Trash2,
  ArrowRight,
  TrendingUp,
  Zap,
  ExternalLink,
} from 'lucide-react'
import type { InstagramContentType, PostStatus, SocialPostItem, ContentTopic } from '@/types/social'
import { GeneratePostModal } from '@/components/admin/social/GeneratePostModal'
import { PostEditorDrawer } from '@/components/admin/social/PostEditorDrawer'
import { toast } from 'sonner'

function InstagramIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function XPlatformIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

const STORAGE_KEY = 'dersolab_social_posts_v5'

const INITIAL_DEMO_POSTS: SocialPostItem[] = [
  {
    id: 'demo_tiktok_1',
    title: 'TikTok & Reels: Paragrafta Süre Yetiştiremeyenlerin 3 Hatası (9:16)',
    type: 'reels',
    platform: 'tiktok',
    persona: 'derso_friendly',
    isAutoPilot: true,
    topic: 'exam_tactics',
    topicLabel: 'TikTok & Reels • 9:16 Video',
    status: 'approved',
    targetAudience: 'YKS 2026',
    caption: `Paragraflarda son şıkka gelince soruyu unutanlar buraya! 🎬⚡ 30 saniyede paragraf süreni yarıya indirecek 3 püf nokta!\n\nSen denemelerde en çok hangi derse süre yetiştiremiyorsun? Yorumlara yaz 👇\n\n#yks2026 #tiktokegitim #reels #paragraftaktikleri #dersolab #ykstayfa`,
    hashtags: ['#yks2026', '#tiktokegitim', '#reels', '#paragraftaktikleri', '#dersolab', '#ykstayfa'],
    virality: {
      score: 97,
      hookStrength: 98,
      shareability: 96,
      savePotential: 97,
      commentBait: 95,
      verdict: 'Çok yüksek izlenme ve paylaşım potansiyeli. Sınav süre paniği kancası son derece etkili.',
    },
    reelsStoryboard: {
      hook3s: 'Paragrafta son şıkka gelince başını unutanlar, bu taktik tam size göre!',
      visualDirection: 'Hızlı zoom, ekranda neon kronometre ve soru kökü vurgusu.',
      spokenScript:
        'Paragrafı roman gibi baştan sona okumayı hemen bırak. İlk iş: Soru kökünü daireye al ve şıkların ilk kelimelerini tara. Zihnine arama emri ver!',
      onScreenText: [
        '⏱️ Paragraf Süreni Yarıya İndir',
        '❌ Hata: Roman gibi okumak',
        '✅ Taktik: Şıklardan arama emri ver',
        '🚀 Biyodaki linkten Bionic Reader dene',
      ],
      musicAudioVibe: 'Trending Phonk / Fast BPM',
      callToAction: 'Profildeki linkten DersoLab Bionic Reader ücretsiz dene 🦊⚡',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo_1',
    title: 'TYT Türkçede Süre Kazandıran 4 Altın Taktik',
    type: 'carousel',
    topic: 'exam_tactics',
    topicLabel: 'TYT Türkçe • Paragraf',
    status: 'approved',
    targetAudience: 'YKS 2026',
    caption: `Paragraf sorularında son şıkka geldiğinde ilk şıkkı unutanlar burada mı? 🙋‍♂️\n\nÖSYM paragraf sorularını bilgi değil, "odaklanma ve hız" testi olarak sorar. Bu 4 kuralı denemelerinde uygula, sürenden en az 12 dakika tasarruf et!\n\n💡 Biyonik hızlı okuma modülümüzü denemek için profildeki linke tıkla!\n\n#yks2026 #tytturkce #paragraftaktikleri #dersolab #ykstayfa #studygram`,
    hashtags: ['#yks2026', '#tytturkce', '#paragraftaktikleri', '#dersolab', '#ykstayfa'],
    carouselSlides: [
      {
        slideNumber: 1,
        badge: 'TYT TÜRKÇE • PARAGRAF',
        headline: 'Paragrafta Süre Yetiştiremeyenlerin Yaptığı 3 Hata',
        subhead: 'Son şıkta ilk şıkkı unutanlar için kurtarıcı rehber',
        uploadedImageUrl:
          'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDgwIDEwODAiIHdpZHRoPSIxMDgwIiBoZWlnaHQ9IjEwODAiPjxkZWZzPjxyYWRpYWxHcmFkaWVudCBpZD0iYmciIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjYwJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzE4MGUyOSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzBhMDUxMiIvPjwvcmFkaWFsR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJnbG93IiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMzhiZGY4Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjYTg1NWY3Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwODAiIGhlaWdodD0iMTA4MCIgZmlsbD0idXJsKCNiZykiLz48Y2lyY2xlIGN4PSI1NDAiIGN5PSI1MDAiIHI9IjI4MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDU2LCAxODksIDI0OCwgMC4yKSIgc3Ryb2tlLXdpZHRoPSI0Ii8+PGNpcmNsZSBjeD0iNTQwIiBjeT0iNTAwIiIgcj0iMjIwIiBmaWxsPSJub25lIiBzdHJva2U9InVybCgjZ2xvdykiIHN0cm9rZS13aWR0aD0iOCIgc3Ryb2tlLWRhc2hhcnJheT0iMTYsMTIiLz48Y2lyY2xlIGN4PSI1NDAiIGN5PSI1MDAiIHI9IjE0MCIgZmlsbD0icmdiYSgxNjgsIDg1LCAyNDcsIDAuMTUpIiBzdHJva2U9IiMzOGJkZjgiIHN0cm9rZS13aWR0aD0iNCIvPjxjaXJjbGUgY3g9IjU0MCIgY3k9IjUwMCIgcj0iNDAiIGZpbGw9IiNmOTczMTYiLz48dGV4dCB4PSI1NDAiIHk9Ijg4MCIgZm9udC1mYW1pbHk9InN5c3RlbS11aSwgc2Fucy1zZXJpZiIgZm9udC13ZWlnaHQ9IjkwMCIgZm9udC1zaXplPSIzNiIgZmlsbD0iIzM4YmRmOCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+TC5BLkIuIEJJT05JQyBSRUFERVIg4oCiIEhJWkxJIE9EQUs8L3RleHQ+PHRleHQgeD0iNTQwIiB5PSI5MzAiIGZvbnQtZmFtaWx5PSJzeXN0ZW0tdWksIHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSJib2xkIiBmb250LXNpemU9IjI0IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuNykiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkfDllogS0FTSSBUQVJBTUEgVkUgQkxPSyBPS1VNQSDFnkVNQVNJPC90ZXh0Pjwvc3ZnPg==',
        aiImagePrompt: 'Bionic Eye reading focus diagram, futuristic HUD interface',
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
    id: 'demo_2',
    title: 'Reels: 30 Saniyede Fonetik Müfettişi ile Yazım Kuralı Hilesi',
    type: 'reels',
    topic: 'dersolab_features',
    topicLabel: 'Reels • Yazım Kuralları',
    status: 'draft',
    targetAudience: 'YKS 2026',
    caption: `ÖSYM'nin her yıl banko sorduğu ama adayların %60'ının takıldığı yazım kuralı! 🤯\n\nSen doğru bildiğini sanıyordun değil mi? Yorumlarda cevabını yaz, bakalım kimler doğru bildi! 👇\n\n#reels #yksreels #tyt2026 #yazımkuralları #dersolab #ykstayfa`,
    hashtags: ['#reels', '#yksreels', '#tyt2026', '#yazımkuralları', '#dersolab'],
    reelsStoryboard: {
      hook3s:
        'Kameraya şaşkınlıkla bakarak ekrana "BİRÇOK mu BİR ÇOK mu?" yazısını vur: "Eğer buna ayrı yazılır dediysen sınavda 1 netin gitti bile!"',
      visualDirection:
        'Ön planda dinamik konuşmacı. Arkada DersoLab L.A.B. Fonetik Müfettişi ekranı açık. Yanlış şık kırmızı, doğru şık parlak yeşil yanıp söner.',
      spokenScript:
        'ÖSYM her yıl istisnasız bitişik yazılan birleşik sözcüklerden en az bir soru soruyor. Şifre çok basit: Belirsizlik bildiren "birkaç, birtakım, birçok, hiçbir" sözcükleri daima bitişik yazılır! DersoLab Fonetik Müfettişine cümleyi at, hangi ses olayının olduğunu anında gör. Profildeki linkten ücretsiz dene!',
      onScreenText: ['🚨 1 NETİ KURTAR!', 'Birçok / Birkaç = BİTİŞİK', 'ÖSYM BU TUZAĞI ÇOK SEVER', 'Link Biyoda 🦊'],
      musicAudioVibe: 'Enerjik TikTok trend hip-hop veya dinamik synthwave beat',
      callToAction: 'DersoLab Fonetik Müfettişini hemen profildeki linkten ücretsiz dene!',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo_3',
    title: 'Günün TYT Sorusu: Ses Olayları Tuzağı',
    type: 'post',
    topic: 'daily_question',
    topicLabel: 'Günün Sorusu • TYT Türkçe',
    status: 'published',
    targetAudience: 'YKS 2026',
    caption: `Günün ÖSYM Sorusu geldi! Bakalım kimler ilk seferde doğru şıkkı bulacak? 🧠\n\nCevabını yoruma bırak, doğru cevabı ve detaylı çözümü sabitlediğimiz yorumda açıkla! 🎯\n\n#gununsorusu #yks #tyt #dersolab #sorucozumu`,
    hashtags: ['#gununsorusu', '#yks', '#tyt', '#dersolab', '#sorucozumu'],
    singlePostData: {
      badge: 'GÜNÜN ÖSYM SORUSU',
      headline: '"Kaybolduğunu" Sözcüğündeki Ses Olayları Nelerdir?',
      questionOrSummary:
        'Aşağıdaki seçeneklerden hangisinde "kaybolduğunu" sözcüğünde meydana gelen ses olaylarının tamamı doğru verilmiştir?',
      keyTakeaway: 'İpucu: Kayıp + olmak + dık + ı -> Ünlü düşmesi + Ünsüz yumuşaması',
      options: [
        { key: 'A', text: 'Ünlü düşmesi - Ünsüz yumuşaması', isCorrect: true },
        { key: 'B', text: 'Sadece Ünsüz yumuşaması', isCorrect: false },
        { key: 'C', text: 'Ünsüz benzeşmesi - Ünlü daralması', isCorrect: false },
        { key: 'D', text: 'Ünlü türemesi - Kaynaştırma', isCorrect: false },
      ],
      themeVariant: 'neon_orange',
    },
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo_4',
    title: 'Günün Story Testi: Aralarında Asal Sayılar',
    type: 'story',
    topic: 'daily_question',
    topicLabel: 'Instagram Story • Mini Quiz',
    status: 'draft',
    targetAudience: 'YKS 2026',
    caption: 'Bugünün YKS matematik hikaye sorusu geldi! Hikayedeki test çıkartmasına dokunarak doğru cevabı işaretle 🔥 #yks2026 #matematik #dersolab',
    hashtags: ['#yks2026', '#matematik', '#dersolab', '#storyquiz'],
    storyData: {
      badge: 'GÜNÜN HİKAYE TESTİ',
      headline: 'Aralarında Asal İki Sayının EKOK\'u Kaçtır?',
      subhead: 'Doğru cevaba dokun, sonucunu gör! 🎯',
      stickerType: 'quiz',
      stickerQuestion: 'Aralarında asal iki sayının EKOK\'u nedir?',
      stickerOptions: ['Sayıların Çarpımı', 'Her zaman 1', 'Sayıların Toplamı'],
      themeVariant: 'purple_matrix',
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'demo_5',
    title: 'Pazar Hikayesi: Ortaokul & Lise Haftalık Kitap Önerisi',
    type: 'story',
    topic: 'book_recommendation',
    topicLabel: 'Pazar Kitap Kulübü • Çift Öneri',
    status: 'approved',
    targetAudience: 'Ortaokul (LGS) & Lise (YKS)',
    caption: `Pazar gününün vazgeçilmezi: Haftalık Kitap Kulübümüz yayında! 📚🦊\n\nBu hafta hem ortaokul (LGS) hem de lise (YKS) adaylarımız için okuma hızını, odaklanmayı ve sınav paragraf netlerini uçuracak 2 harika başucu kitabı seçtik!\n\nSen bu hafta hangisine başlıyorsun? Hikayedeki ankete katıl! 👇\n\n#pazarkitabı #kitaponerisi #lgs2026 #yks2026 #paragrafhizi #dersolab #kitapkurdu`,
    hashtags: ['#pazarkitabı', '#kitaponerisi', '#lgs2026', '#yks2026', '#paragrafhizi', '#dersolab'],
    storyData: {
      badge: 'PAZAR KİTAP KULÜBÜ 📚',
      headline: 'Haftanın Kitap Önerileri',
      subhead: 'Hem Ortaokul (LGS) Hem Lise (YKS) İçin Seçtik',
      stickerType: 'poll',
      stickerQuestion: 'Bu hafta hangisini okuyacaksın?',
      stickerOptions: ['Ortaokul: Momo 📘', 'Lise: Simyacı 📕'],
      stickerLinkText: 'Kitap Listesi & İpuçları',
      stickerLinkUrl: 'https://dersolab.com/lab',
      themeVariant: 'purple_matrix',
      dualBookData: {
        ortaokul: {
          title: 'Momo',
          author: 'Michael Ende',
          genre: 'Felsefi Masal & Zaman Macerası',
          whyRead: 'LGS yeni nesil paragraf sorularında zaman algısı ve dikkat süresini geliştirir.',
          highlightTag: 'ORTAOKUL & LGS (10-14 YAŞ)',
          imageUrl: '/books/momo.jpg',
        },
        lise: {
          title: 'Simyacı',
          author: 'Paulo Coelho',
          genre: 'Alegorik Roman',
          whyRead: 'YKS maratonunda motivasyon, içsel yolculuk ve TYT derin anlama becerisi kazandırır.',
          highlightTag: 'LİSE & YKS (14-18 YAŞ)',
          imageUrl: '/books/simyaci.jpg',
        },
      },
    },
    createdAt: new Date().toISOString(),
  },
]

export default function SocialStudioPage() {
  const [posts, setPosts] = useState<SocialPostItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedPost, setSelectedPost] = useState<SocialPostItem | null>(null)
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)
  const [isAdvancedTerminalOpen, setIsAdvancedTerminalOpen] = useState(false)
  const [modalPreset, setModalPreset] = useState<{
    contentType?: InstagramContentType
    topic?: ContentTopic
    subject?: string
  }>({})

  // Filtreler
  const [typeFilter, setTypeFilter] = useState<'all' | InstagramContentType>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | PostStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Yerel Hafızadan Yükle
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as SocialPostItem[]
        const updated = parsed.map((p) => {
          if (p.id === 'demo_5' && p.storyData?.dualBookData) {
            return {
              ...p,
              storyData: {
                ...p.storyData,
                dualBookData: {
                  ...p.storyData.dualBookData,
                  ortaokul: {
                    ...p.storyData.dualBookData.ortaokul,
                    imageUrl: p.storyData.dualBookData.ortaokul.imageUrl || '/books/momo.jpg',
                  },
                  lise: {
                    ...p.storyData.dualBookData.lise,
                    imageUrl: p.storyData.dualBookData.lise.imageUrl || '/books/simyaci.jpg',
                  },
                },
              },
            }
          }
          return p
        })
        setPosts(updated)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } else {
        setPosts(INITIAL_DEMO_POSTS)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_POSTS))
      }
    } catch {
      setPosts(INITIAL_DEMO_POSTS)
    } finally {
      setIsLoaded(true)
    }
  }, [])

  // Değişiklikleri Kaydet
  function savePosts(newPosts: SocialPostItem[]) {
    setPosts(newPosts)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts))
    } catch (e) {
      console.warn('LocalStorage save error:', e)
    }
  }

  // Yeni Üretilen İçerikleri Ekle
  function handlePostsGenerated(newGenerated: SocialPostItem[]) {
    const updated = [...newGenerated, ...posts]
    savePosts(updated)
    if (newGenerated.length === 1) {
      setSelectedPost(newGenerated[0])
    }
  }

  // Gönderi Güncelle
  function handleUpdatePost(updated: SocialPostItem) {
    const newPosts = posts.map((p) => (p.id === updated.id ? updated : p))
    savePosts(newPosts)
    setSelectedPost(updated)
  }

  // Gönderi Sil
  function handleDeletePost(id: string) {
    const newPosts = posts.filter((p) => p.id !== id)
    savePosts(newPosts)
    if (selectedPost?.id === id) {
      setSelectedPost(null)
    }
    toast.success('Gönderi silindi.')
  }

  // Hızlı Durum Değiştir
  function handleQuickApprove(post: SocialPostItem, e: React.MouseEvent) {
    e.stopPropagation()
    const nextStatus: PostStatus = post.status === 'approved' ? 'draft' : 'approved'
    const updated = { ...post, status: nextStatus }
    handleUpdatePost(updated)
    toast.success(`Gönderi ${nextStatus === 'approved' ? 'paylaşıma hazırlandı!' : 'taslağa geri alındı.'}`)
  }

  // Hızlı Kopyala
  function handleQuickCopy(post: SocialPostItem, e: React.MouseEvent) {
    e.stopPropagation()
    const text = `${post.caption}\n\n${(post.hashtags || []).join(' ')}`
    navigator.clipboard.writeText(text)
    toast.success('Açıklama ve hashtagler kopyalandı!')
  }

  // Şablon ile modal aç
  function handleOpenPreset(contentType: InstagramContentType, topic: ContentTopic, subject?: string) {
    setModalPreset({ contentType, topic, subject })
    setIsGenerateModalOpen(true)
  }

  function handleOpenNewPost() {
    setModalPreset({})
    setIsGenerateModalOpen(true)
  }

  const [quickPrompt, setQuickPrompt] = useState('')
  const [quickFormat, setQuickFormat] = useState<InstagramContentType>('carousel')
  const [isQuickGenerating, setIsQuickGenerating] = useState(false)

  async function handleQuickGenerate(e: React.FormEvent) {
    e.preventDefault()
    if (!quickPrompt.trim()) return

    setIsQuickGenerating(true)
    toast.info('İçeriğiniz hazırlanıyor...')

    try {
      const res = await fetch('/api/admin/social/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_single',
          type: quickFormat,
          topic: 'custom',
          subject: quickPrompt.trim(),
          customPrompt: quickPrompt.trim(),
          persona: 'derso_friendly',
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.item) {
        throw new Error(data.error || 'İçerik oluşturulamadı.')
      }

      handlePostsGenerated([data.item])
      setSelectedPost(data.item)
      setQuickPrompt('')
      toast.success('İçeriğiniz başarıyla hazırlandı ve önizleme açıldı!')
    } catch (err: any) {
      toast.error(err?.message || 'Üretim sırasında bir hata oluştu.')
    } finally {
      setIsQuickGenerating(false)
    }
  }

  // Filtrelenmiş Liste
  const filteredPosts = posts.filter((p) => {
    if (typeFilter !== 'all' && p.type !== typeFilter) return false
    if (statusFilter !== 'all' && p.status !== statusFilter) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchTitle = p.title.toLowerCase().includes(q)
      const matchCaption = p.caption.toLowerCase().includes(q)
      const matchTopic = p.topicLabel.toLowerCase().includes(q)
      if (!matchTitle && !matchCaption && !matchTopic) return false
    }
    return true
  })

  // İstatistikler
  const totalCount = posts.length
  const draftCount = posts.filter((p) => p.status === 'draft').length
  const approvedCount = posts.filter((p) => p.status === 'approved').length
  const publishedCount = posts.filter((p) => p.status === 'published').length

  return (
    <div className="space-y-8 pb-12">
      {/* 1. ÜST HERO & STATS HEADER */}
      <div className="relative rounded-3xl p-6 md:p-8 bg-gradient-to-br from-neutral-900/90 via-[#0e111a] to-neutral-950 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Glow Efektleri */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-orange-500/10 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-blue-500/10 blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DersoLab Sosyal Medya Asistanı</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Sosyal Medya Asistanı</span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-medium">
                Instagram & TikTok
              </span>
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              DersoLab öğrencileri için dikkat çekici Instagram ve TikTok gönderilerini saniyeler içinde hazırlayın.
              Aşağıdaki hazır şablonlardan birini seçin, canlı telefon ekranında önizleyin ve tek tıkla kullanıma hazır hale getirin.
            </p>
          </div>

          {/* Hızlı Aksiyon Butonları */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleOpenNewPost}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Gönderi Oluştur</span>
            </button>
            <a
              href="https://www.instagram.com/dersolabegitim/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-all hover:scale-105 active:scale-95"
            >
              <InstagramIcon className="w-4 h-4 text-pink-400" />
              <span>@dersolabegitim</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        </div>

        {/* Sayaç Kartları */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-xs text-slate-400 block mb-1">Toplam Gönderi</span>
            <span className="text-2xl font-black text-white">{totalCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-amber-500/[0.05] border border-amber-500/20">
            <span className="text-xs text-amber-300 block mb-1">Taslaklar (Hazırlanan)</span>
            <span className="text-2xl font-black text-amber-400">{draftCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-blue-500/[0.05] border border-blue-500/20">
            <span className="text-xs text-blue-300 block mb-1">Paylaşıma Hazır</span>
            <span className="text-2xl font-black text-blue-400">{approvedCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/20">
            <span className="text-xs text-emerald-300 block mb-1">Yayınlananlar</span>
            <span className="text-2xl font-black text-emerald-400">{publishedCount}</span>
          </div>
        </div>
      </div>

      {/* 2. HIZLI İÇERİK BAŞLATICI ŞABLONLARI */}
      <div className="space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-orange-400" />
            <span>Hızlı İçerik Başlatıcı</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Hangi türde içerik hazırlamak istiyorsunuz? Bir şablona tıklayarak hemen oluşturun:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Şablon 1: Carousel */}
          <div
            onClick={() => handleOpenPreset('carousel', 'exam_tactics', 'TYT Paragraf Sınav Taktikleri')}
            className="group relative p-5 rounded-2xl bg-gradient-to-b from-[#131622] to-[#0c0e17] border border-white/10 hover:border-orange-500/50 shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 group-hover:scale-110 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  1:1 Kaydırmalı
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                  Kaydırmalı Carousel
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Konu özetleri, süre kazandıran formüller ve kaydetmelik sınav rehberleri (4-6 slayt).
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-orange-400 group-hover:translate-x-0.5 transition-transform">
              <span>Carousel Başlat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Şablon 2: Reels / TikTok */}
          <div
            onClick={() => handleOpenPreset('reels', 'exam_tactics', '30 Saniyede Sınav Hilesi')}
            className="group relative p-5 rounded-2xl bg-gradient-to-b from-[#131622] to-[#0c0e17] border border-white/10 hover:border-cyan-500/50 shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                  <Film className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  9:16 Dikey Video
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                  TikTok & Reels Senaryosu
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  İlk 3 saniye viral kancası, ekranda beliren metinler ve konuşma metni senaryosu.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:translate-x-0.5 transition-transform">
              <span>Reels Yaz →</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Şablon 3: Günün Sorusu / Mini Test */}
          <div
            onClick={() => handleOpenPreset('post', 'daily_question', 'Günün TYT/AYT Sorusu')}
            className="group relative p-5 rounded-2xl bg-gradient-to-b from-[#131622] to-[#0c0e17] border border-white/10 hover:border-emerald-500/50 shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  1:1 Soru Postu
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  Günün Sorusu & Test
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Öğrencilerin yorumlarda çözeceği şıklı test sorusu, ipucu ve sabitlemelik çözüm.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:translate-x-0.5 transition-transform">
              <span>Soru Postu Hazırla →</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Şablon 4: Story & Mini Quiz */}
          <div
            onClick={() => handleOpenPreset('story', 'daily_question', 'Story Mini Quiz')}
            className="group relative p-5 rounded-2xl bg-gradient-to-b from-[#131622] to-[#0c0e17] border border-white/10 hover:border-purple-500/50 shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  9:16 Hikaye
                </span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                  Story & Mini Quiz
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Öğrencilerin ekrana dokunarak katılacağı Instagram test veya anket çıkartmalı hikaye.
                </p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-purple-400 group-hover:translate-x-0.5 transition-transform">
              <span>Story Başlat →</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* 3. YAPAY ZEKA İÇERİK SİHİRBAZI */}
      <div className="p-5 md:p-6 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-purple-500/10 border border-orange-500/20 shadow-lg relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Yapay Zeka İçerik Sihirbazı</h3>
                <p className="text-xs text-slate-400">
                  Aklınızdaki konuyu yazın, DersoLab asistanı görsel ve metin içeriğini saniyeler içinde oluştursun.
                </p>
              </div>
            </div>

            {/* Format Seçici */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/40 border border-white/10 shrink-0">
              {[
                { id: 'carousel', label: 'Carousel (1:1)' },
                { id: 'reels', label: 'Reels / TikTok' },
                { id: 'post', label: 'Soru Postu' },
                { id: 'story', label: 'Story (9:16)' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setQuickFormat(f.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    quickFormat === f.id
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleQuickGenerate} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <input
                type="text"
                value={quickPrompt}
                onChange={(e) => setQuickPrompt(e.target.value)}
                placeholder="Örn: TYT Paragrafta süre yetiştiremeyenlerin yaptığı 3 hata veya AYT Türev teğet eğrisi..."
                className="w-full bg-black/50 border border-white/15 focus:border-orange-500 rounded-2xl px-4 py-3 text-xs text-white placeholder-slate-500 outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isQuickGenerating || !quickPrompt.trim()}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-95 shrink-0"
            >
              {isQuickGenerating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Hazırlanıyor...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Hemen Üret</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* 4. FİLTRE VE ARAMA ÇUBUĞU */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
        {/* Format Sekmeleri */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: `Tümü (${totalCount})`, icon: Filter },
            { id: 'carousel', label: 'Carousel', icon: Layers },
            { id: 'reels', label: 'Reels & TikTok', icon: Film },
            { id: 'story', label: 'Story', icon: Smartphone },
            { id: 'post', label: 'Soru Postu', icon: HelpCircle },
          ].map((tab) => {
            const Icon = tab.icon
            const active = typeFilter === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setTypeFilter(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                  active
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Durum Filtresi & Arama */}
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-orange-500"
          >
            <option value="all" className="bg-neutral-900">Tüm Durumlar</option>
            <option value="draft" className="bg-neutral-900">Taslak (Hazırlanan)</option>
            <option value="approved" className="bg-neutral-900">Paylaşıma Hazır</option>
            <option value="published" className="bg-neutral-900">Yayınlandı</option>
          </select>

          <div className="relative w-48 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Başlık veya konu ara..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* 5. İÇERİK KARTLARI LİSTESİ */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Hazır Gönderiler</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
              {filteredPosts.length}
            </span>
          </h2>
          <span className="text-xs text-slate-400">
            Önizlemek veya düzenlemek için bir karta tıklayın.
          </span>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-4">
            <div className="w-14 h-14 rounded-3xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-bold text-white">İçerik Bulunamadı</h3>
              <p className="text-xs text-slate-400">
                Bu filtreye uygun gönderi bulunamadı. Yeni bir içerik oluşturabilir veya filtreleri sıfırlayabilirsiniz.
              </p>
            </div>
            <button
              onClick={handleOpenNewPost}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni İçerik Oluştur</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPosts.map((post) => {
              const isCar = post.type === 'carousel'
              const isRel = post.type === 'reels'
              const isStory = post.type === 'story'
              const isApproved = post.status === 'approved'
              const isPublished = post.status === 'published'

              return (
                <div
                  key={post.id}
                  onClick={() => setSelectedPost(post)}
                  className="group relative rounded-3xl p-5 bg-[#0f121a] hover:bg-[#131722] border border-white/10 hover:border-orange-500/40 shadow-xl transition-all duration-200 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
                >
                  {/* Kart Üst Bilgileri */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
                          isRel || post.platform === 'tiktok'
                            ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300'
                            : isCar
                              ? 'bg-orange-500/15 border-orange-500/30 text-orange-400'
                              : isStory
                                ? 'bg-purple-500/15 border-purple-500/30 text-purple-400'
                                : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                        }`}
                      >
                        {isRel || post.platform === 'tiktok' ? (
                          <Film className="w-3 h-3 text-cyan-400" />
                        ) : isCar ? (
                          <Layers className="w-3 h-3" />
                        ) : isStory ? (
                          <Smartphone className="w-3 h-3" />
                        ) : (
                          <HelpCircle className="w-3 h-3" />
                        )}
                        <span>
                          {isRel || post.platform === 'tiktok'
                            ? 'TikTok & Reels'
                            : isCar
                              ? 'Carousel (1:1)'
                              : isStory
                                ? 'Story (9:16)'
                                : 'Soru Postu'}
                        </span>
                      </span>

                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wide shrink-0 ${
                          isPublished
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : isApproved
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {isPublished ? 'Yayınlandı' : isApproved ? 'Paylaşıma Hazır' : 'Taslak'}
                      </span>
                    </div>

                    {/* Başlık */}
                    <div>
                      <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {post.topicLabel} • {post.targetAudience}
                      </p>
                    </div>

                    {/* Caption Özeti */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {post.caption}
                    </p>
                  </div>

                  {/* Kart Alt Aksiyonları */}
                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      {isCar && <span>{post.carouselSlides?.length || 4} Slayt</span>}
                      {isRel && <span>30sn Video Senaryosu</span>}
                      {isStory && <span>{post.storyData?.stickerType?.toUpperCase() || 'STORY'} Çıkartması</span>}
                      {post.type === 'post' && <span>Şıklı Test Sorusu</span>}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleQuickCopy(post, e)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                        title="Metni Kopyala"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => handleQuickApprove(post, e)}
                        className={`px-2 py-1 rounded-lg text-[11px] font-semibold border transition-colors ${
                          isApproved
                            ? 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                        }`}
                        title={isApproved ? 'Taslağa Al' : 'Paylaşıma Hazırla'}
                      >
                        {isApproved ? 'Hazır ✓' : 'Onayla'}
                      </button>

                      <button
                        onClick={() => setSelectedPost(post)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-500/15 hover:bg-orange-500/25 border border-orange-500/30 text-orange-400 text-[11px] font-bold transition-colors"
                      >
                        <span>İncele</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* 6. MODALLAR */}
      <GeneratePostModal
        isOpen={isGenerateModalOpen}
        onClose={() => {
          setIsGenerateModalOpen(false)
          setModalPreset({})
        }}
        onPostsGenerated={handlePostsGenerated}
        initialContentType={modalPreset.contentType}
        initialTopic={modalPreset.topic}
        initialSubject={modalPreset.subject}
      />

      <PostEditorDrawer
        post={selectedPost}
        isOpen={Boolean(selectedPost)}
        onClose={() => setSelectedPost(null)}
        onUpdatePost={handleUpdatePost}
        onDeletePost={handleDeletePost}
      />
    </div>
  )
}
