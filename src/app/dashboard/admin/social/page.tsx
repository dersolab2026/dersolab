'use client'

import React, { useState, useEffect } from 'react'
import {
  Sparkles,
  Calendar,
  Layers,
  Film,
  HelpCircle,
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
} from 'lucide-react'
import type { InstagramContentType, PostStatus, SocialPostItem } from '@/types/social'
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

const STORAGE_KEY = 'dersolab_social_posts_v1'

const INITIAL_DEMO_POSTS: SocialPostItem[] = [
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
]

export default function SocialStudioPage() {
  const [posts, setPosts] = useState<SocialPostItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedPost, setSelectedPost] = useState<SocialPostItem | null>(null)
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false)

  // Filtreler
  const [typeFilter, setTypeFilter] = useState<'all' | InstagramContentType>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | PostStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Yerel Hafızadan Yükle
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setPosts(JSON.parse(saved))
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
    toast.success(`Gönderi ${nextStatus === 'approved' ? 'onaylandı!' : 'taslağa çekildi.'}`)
  }

  // Hızlı Kopyala
  function handleQuickCopy(post: SocialPostItem, e: React.MouseEvent) {
    e.stopPropagation()
    const text = `${post.caption}\n\n${(post.hashtags || []).join(' ')}`
    navigator.clipboard.writeText(text)
    toast.success('Açıklama ve hashtagler kopyalandı!')
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
        {/* Neon Glow Efektleri */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-orange-500/10 blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 rounded-full bg-blue-500/10 blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-orange-400 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>DersoLab Sosyal Medya Ajanı</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Instagram İçerik Fabrikası & Stüdyosu
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              YKS ve LGS adayları için yüksek etkileşimli Kaydırmalı Carousel rehberler, Reels senaryoları ve günün
              sorularını yapay zeka ile üretin; tek tıkla şablon görselini alıp hesabınızı büyütün.
            </p>
          </div>

          {/* Hızlı Aksiyon Butonları */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsGenerateModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-[0_0_25px_rgba(249,115,22,0.4)] transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Yeni İçerik Üret</span>
            </button>
            <a
              href="https://www.instagram.com/dersolabegitim/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-semibold transition-all hover:scale-105 active:scale-95"
            >
              <InstagramIcon className="w-4 h-4 text-pink-400" />
              <span>@dersolabegitim</span>
            </a>
          </div>
        </div>

        {/* Sayaç Kartları */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mt-8 pt-6 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
            <span className="text-xs text-slate-400 block mb-1">Toplam İçerik</span>
            <span className="text-2xl font-black text-white">{totalCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-amber-500/[0.05] border border-amber-500/20">
            <span className="text-xs text-amber-300 block mb-1">Taslaklar</span>
            <span className="text-2xl font-black text-amber-400">{draftCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-blue-500/[0.05] border border-blue-500/20">
            <span className="text-xs text-blue-300 block mb-1">Onaylananlar</span>
            <span className="text-2xl font-black text-blue-400">{approvedCount}</span>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-500/[0.05] border border-emerald-500/20">
            <span className="text-xs text-emerald-300 block mb-1">Yayınlananlar</span>
            <span className="text-2xl font-black text-emerald-400">{publishedCount}</span>
          </div>
        </div>
      </div>

      {/* 2. FİLTRE VE ARAMA ÇUBUĞU */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
        {/* Format Sekmeleri */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'Tüm Formatlar', icon: Filter },
            { id: 'carousel', label: 'Kaydırmalı Carousel', icon: Layers },
            { id: 'reels', label: 'Reels Senaryoları', icon: Film },
            { id: 'post', label: 'Günün Sorusu / Post', icon: HelpCircle },
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
            <option value="draft" className="bg-neutral-900">Taslak (Draft)</option>
            <option value="approved" className="bg-neutral-900">Onaylandı (Approved)</option>
            <option value="scheduled" className="bg-neutral-900">Planlandı (Scheduled)</option>
            <option value="published" className="bg-neutral-900">Yayınlandı (Published)</option>
          </select>

          <div className="relative w-48 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="İçeriklerde ara..."
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-orange-500"
            />
          </div>
        </div>
      </div>

      {/* 3. İÇERİK KARTLARI LİSTESİ */}
      {filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 rounded-3xl bg-white/[0.02] border border-white/10 text-center space-y-4">
          <div className="w-14 h-14 rounded-3xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Sparkles className="w-7 h-7" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-bold text-white">İçerik Bulunamadı</h3>
            <p className="text-xs text-slate-400">
              Bu filtreye uygun gönderi bulunamadı veya henüz içerik üretilmedi. Hemen yeni bir içerik oluşturun!
            </p>
          </div>
          <button
            onClick={() => setIsGenerateModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>İlk İçeriği Üret</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPosts.map((post) => {
            const isCar = post.type === 'carousel'
            const isRel = post.type === 'reels'
            const isApproved = post.status === 'approved'
            const isPublished = post.status === 'published'

            return (
              <div
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className="group relative rounded-3xl p-5 bg-[#0f121a] hover:bg-[#131722] border border-white/10 hover:border-orange-500/40 shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                {/* Kart Üst Bilgileri */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border ${
                          isCar
                            ? 'bg-orange-500/15 border-orange-500/30 text-orange-400'
                            : isRel
                              ? 'bg-blue-500/15 border-blue-500/30 text-blue-400'
                              : 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                        }`}
                      >
                        {isCar ? <Layers className="w-3 h-3" /> : isRel ? <Film className="w-3 h-3" /> : <HelpCircle className="w-3 h-3" />}
                        <span>{isCar ? 'Carousel' : isRel ? 'Reels' : 'Post / Soru'}</span>
                      </span>

                      <span className="text-[11px] text-slate-400 font-medium truncate max-w-[120px]">
                        {post.topicLabel}
                      </span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        isPublished
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : isApproved
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {isPublished ? 'Yayınlandı' : isApproved ? 'Onaylandı' : 'Taslak'}
                    </span>
                  </div>

                  {/* Başlık */}
                  <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>

                  {/* Caption Özeti */}
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {post.caption}
                  </p>
                </div>

                {/* Kart Alt Aksiyonları */}
                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[11px] text-slate-500">
                    {isCar && <span>{post.carouselSlides?.length || 4} Slayt</span>}
                    {isRel && <span>Viral Kanca</span>}
                    {post.type === 'post' && <span>Şıklı Test</span>}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleQuickCopy(post, e)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                      title="Açıklamayı Kopyala"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={(e) => handleQuickApprove(post, e)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                        isApproved
                          ? 'bg-blue-500/20 border-blue-500/40 text-blue-300'
                          : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                      }`}
                      title={isApproved ? 'Taslağa Geri Al' : 'İçeriği Onayla'}
                    >
                      {isApproved ? '✓ Onaylı' : 'Onayla'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 4. MODALLAR */}
      <GeneratePostModal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        onPostsGenerated={handlePostsGenerated}
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
