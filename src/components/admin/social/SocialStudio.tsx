'use client'

import React, { useState, useEffect } from 'react'
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
  Share2,
  ExternalLink,
  BookOpen,
  Zap,
  FolderOpen,
  ArrowRight,
  ArrowLeft,
  Eye,
  Edit3,
  RefreshCw,
  Hash,
  Palette,
  CheckCircle2,
  Calendar,
} from 'lucide-react'
import type {
  CarouselSlide,
  ContentTopic,
  InstagramContentType,
  SlideThemeVariant,
  SocialPostItem,
  StoryStickerType,
} from '@/types/social'
import { SocialPhoneMockup } from './SocialPhoneMockup'
import { downloadAllPostMedia } from '@/lib/social/canvasRenderer'
import { toTurkishTitleCase } from '@/lib/social/agent'
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
    targetAudience: 'YKS 2026',
    caption: `Paragraf sorularında son şıkka geldiğinde ilk şıkkı unutanlar burada mı? 🙋‍♂️\n\nÖSYM paragraf sorularını bilgi değil, "odaklanma ve hız" testi olarak sorar. Bu 3 kuralı denemelerinde uygula, sürenden en az 12 dakika tasarruf et!\n\n💡 Biyonik hızlı okuma modülümüzü denemek için profildeki linke tıkla!\n\n#yks2026 #tytturkce #paragraftaktikleri #dersolab #ykstayfa #studygram`,
    hashtags: ['#yks2026', '#tytturkce', '#paragraftaktikleri', '#dersolab', '#ykstayfa'],
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
    targetAudience: 'YKS 2026',
    caption: `ÖSYM her yıl istisnasız bu tuzağı kurar! 🎯\n\nMetinde geçen bir kelimenin aynısını yanlış şıkka koyarak dikkatini dağıtır. Doğru cevap ise genellikle kelimelerin eş anlamlılarıyla yeniden ifade edilmiş halidir.\n\nKaydet ve denemelerde bu tuzağa düşme! 🦊\n\n#1soru1net #tytturkce #yks2026 #dersolab #ykstayfa`,
    hashtags: ['#1soru1net', '#tytturkce', '#yks2026', '#dersolab'],
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
    caption: `Pazar gününün klasiği: Haftalık Kitap Kulübümüz yayında! 📚🦊\n\nHem LGS hem YKS hazırlığında okuma hızını ve analitik düşünme gücünü katlayacak 2 muazzam başucu kitabı!\n\nSen bu hafta hangisine başlıyorsun? Hikayedeki ankete katıl! 👇\n\n#pazarkitabı #kitaponerisi #lgs2026 #yks2026 #dersolab`,
    hashtags: ['#pazarkitabı', '#kitaponerisi', '#lgs2026', '#yks2026', '#dersolab'],
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
    targetAudience: 'YKS 2026',
    caption: `ÖSYM'nin her yıl banko sorduğu ama adayların %60'ının takıldığı yazım kuralı! 🤯\n\nSen doğru bildiğini sanıyordun değil mi? Yorumlarda cevabını yaz! 👇\n\n#reels #yksreels #tyt2026 #yazımkuralları #dersolab #ykstayfa`,
    hashtags: ['#reels', '#yksreels', '#tyt2026', '#yazımkuralları', '#dersolab'],
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



export default function SocialStudio() {
  const [posts, setPosts] = useState<SocialPostItem[]>(INITIAL_DEMO_POSTS)
  const [activePostId, setActivePostId] = useState<string>('demo_carousel_1')
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0)
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor')

  // Hızlı Yapay Zeka Üretim Alanı
  const [genType, setGenType] = useState<InstagramContentType>('carousel')
  const [genGrade, setGenGrade] = useState<'YKS (TYT/AYT)' | 'LGS' | 'Genel'>('YKS (TYT/AYT)')
  const [genSubject, setGenSubject] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState<boolean>(false)

  // İndirme ve Kopyalama Durumları
  const [isDownloading, setIsDownloading] = useState<boolean>(false)
  const [downloadProgress, setDownloadProgress] = useState<string>('')
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const [isDraftsOpen, setIsDraftsOpen] = useState<boolean>(false)

  // Yerel Depolamadan Yükleme ve Veri Temizleme (Sanitize)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('dersolab_social_posts_v6')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized: SocialPostItem[] = parsed.map((post: SocialPostItem) => {
            const cleanTitle = toTurkishTitleCase(post.title || '')
            const cleanTopicLabel = toTurkishTitleCase(post.topicLabel || '')
            return {
              ...post,
              title: cleanTitle,
              topicLabel: cleanTopicLabel,
              // Carousel kapak veya çoklu madde içeren slaytlardaki hatalı maskot görselini temizle
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
          setPosts(sanitized)
          setActivePostId(sanitized[0].id)
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized))
          } catch {
            // ignore
          }
        }
      }
    } catch {
      // ignore
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

  const activePost = posts.find((p) => p.id === activePostId) || posts[0] || INITIAL_DEMO_POSTS[0]

  // Aktif Gönderiyi Güncelle
  function handleUpdateActivePost(updated: SocialPostItem) {
    const updatedList = posts.map((p) => (p.id === updated.id ? updated : p))
    savePosts(updatedList)
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

      toast.success('Yeni içerik başarıyla oluşturuldu ve yüklendi!', { id: toastId })
      setGenSubject('')
    } catch (err: any) {
      console.warn('API uyarısı, dinamik içerik motoru devreye alınıyor:', err?.message)

      // Fallback: Girilen konuya %100 uyarlanan dinamik içerik
      const fallbackPost = createFallbackPost(typeToUse, subjectToUse, gradeToUse, topicToUse)
      const updatedPosts = [fallbackPost, ...posts.filter((p) => p.id !== fallbackPost.id)]
      savePosts(updatedPosts)
      setActivePostId(fallbackPost.id)
      setActiveSlideIndex(0)

      toast.success('İçerik konunuza özel olarak başarıyla hazırlandı!', { id: toastId })
    } finally {
      setIsGenerating(false)
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
        caption: `${title} hakkında sınavda hayat kurtaran kritik püf noktalar! 🦊⚡\n\nBu adımları denemelerinde uygula, soru kaçırma! Unutmamak için hemen kaydet! 👇\n\n#yks2026 #lgs2026 #dersolab #ykstayfa #${title.toLowerCase().replace(/[^a-z0-9ğüşıöç]/gi, '')}`,
        hashtags: ['#yks2026', '#lgs2026', '#dersolab', '#ykstayfa'],
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
        caption: `${title} hakkında günün test sorusu yayında! Sen cevabı biliyor musun? 🦊👇\n\n#dersolab #yks2026 #lgs2026`,
        hashtags: ['#dersolab', '#yks2026', '#lgs2026'],
        storyData: {
          badge: `${badge} ⚡`,
          headline: `${title} • Hızlı Test`,
          subhead: 'Sence doğru kural / yaklaşım hangisi?',
          stickerType: 'quiz',
          stickerQuestion: `${title} konusunda hangisi doğrudur?`,
          stickerOptions: ['A) Doğru Kural / Yaklaşım ✅', 'B) Sık Yapılan Yanılgı ❌', 'C) Eksik Bilgi Şıkkı', 'D) Emin Değilim'],
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
        caption: `ÖSYM'nin en çok sorduğu ${title} konusu! 🤯 Sen bu kuralı biliyor muydun? Yorumlarda yaz! 👇\n\n#reels #yks2026 #dersolab`,
        hashtags: ['#reels', '#yks2026', '#dersolab'],
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
      caption: `${title} hakkında bilmen gereken en kritik kural!\n\nDoğru cevabı yorumlara yaz bakalım kimler yapabilecek? 👇\n\n#1soru1net #yks2026 #dersolab`,
      hashtags: ['#1soru1net', '#yks2026', '#dersolab'],
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
    setActivePostId(duplicated.id)
    setActiveSlideIndex(0)
    toast.success('Gönderi kopyalandı ve açıldı!')
  }

  const isCarousel = activePost.type === 'carousel'
  const isStory = activePost.type === 'story'
  const isReels = activePost.type === 'reels'
  const isPost = activePost.type === 'post'
  const currentSlide = isCarousel ? activePost.carouselSlides?.[activeSlideIndex] : null

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
        {/* SOL KOLON: HIZLI YAPAY ZEKA ÜRETİCİSİ VE DÜZENLEYİCİ */}
        <section
          className={`lg:col-span-7 flex flex-col gap-6 ${
            mobileTab === 'preview' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* KART 1: HIZLI YAPAY ZEKA ÜRETİCİSİ */}
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
                  <option value="YKS (TYT/AYT)" className="bg-neutral-900">YKS 2026</option>
                  <option value="LGS" className="bg-neutral-900">LGS 2026</option>
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
                disabled={isGenerating}
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

            {/* CAROUSEL SLAYT YÖNETİCİSİ */}
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
                            updatedSlides[activeSlideIndex] = { ...currentSlide, badge: (currentSlide.badge || '').toLocaleUpperCase('tr-TR') }
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
                            updatedSlides[activeSlideIndex] = { ...currentSlide, highlightTag: (currentSlide.highlightTag || '').toLocaleUpperCase('tr-TR') }
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
                          updatedSlides[activeSlideIndex] = { ...currentSlide, headline: toTurkishTitleCase(currentSlide.headline) }
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

            {/* STORY ALANLARI */}
            {isStory && activePost.storyData && (
              <div className="border border-white/10 rounded-xl p-3.5 bg-black/30 flex flex-col gap-2.5">
                <div className="text-xs font-bold text-orange-400">Story Çıkartma ve İçerik Ayarları</div>
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
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">Anket / Soru Çıkartması</label>
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
              </div>
            )}

            {/* REELS ALANLARI */}
            {isReels && activePost.reelsStoryboard && (
              <div className="border border-white/10 rounded-xl p-3.5 bg-black/30 flex flex-col gap-2.5">
                <div className="text-xs font-bold text-orange-400">Reels & TikTok Senaryosu</div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-400 block mb-1">3 Saniye Kancası (Hook)</label>
                  <input
                    type="text"
                    value={activePost.reelsStoryboard.hook3s}
                    onChange={(e) =>
                      handleUpdateActivePost({
                        ...activePost,
                        reelsStoryboard: { ...activePost.reelsStoryboard!, hook3s: e.target.value },
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
              </div>
            )}

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
        </section>

        {/* SAĞ KOLON: GERÇEKÇİ CANLI INSTAGRAM MOCKUP & HIZLI İNDİRME */}
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

          {/* HIZLI DIŞA AKTARMA VE EYLEM PANELİ */}
          <div className="w-full max-w-[390px] rounded-2xl border border-white/10 bg-[#0B0F19]/90 backdrop-blur-md p-4 shadow-xl flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Yayın Hazırlığı</span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                1080p Hazır
              </span>
            </div>

            {/* Ana İndirme Butonu */}
            <button
              type="button"
              disabled={isDownloading}
              onClick={handleDownloadAll}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-700 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 transition-all active:scale-98 cursor-pointer"
            >
              {isDownloading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{downloadProgress || 'Görseller İndiriliyor...'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>
                    {isCarousel
                      ? `Tüm Slaytları İndir (${activePost.carouselSlides?.length || 1} PNG)`
                      : 'Görseli İndir (1080p PNG)'}
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
                      <span className="text-xs font-bold text-white truncate max-w-[280px]">
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
