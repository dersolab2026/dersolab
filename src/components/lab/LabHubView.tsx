'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FlaskConical,
  Zap,
  Dna,
  Calculator,
  BookOpen,
  Globe2,
  Search,
  ArrowRight,
  CheckCircle2,
  Sliders,
  Play,
  Layers,
  GraduationCap,
  Eye,
  Rocket,
  Atom,
  RotateCcw,
  Languages,
} from 'lucide-react'
import { BranchNavHeader, BRANCHES, BranchId } from './BranchNavHeader'

interface ModuleInfo {
  title: string
  desc: string
  badge: string
}

interface BranchCardData {
  id: BranchId
  name: string
  href: string
  icon: React.ElementType
  color: string
  bgGlow: string
  borderColor: string
  textColor: string
  tag: string
  category: 'sayisal' | 'sozel' | 'dil'
  levels: ('ortaokul' | 'lise')[]
  levelBadge: string
  maarifModel: boolean
  description: string
  modules: ModuleInfo[]
}

const LAB_BRANCH_DATA: BranchCardData[] = [
  {
    id: 'kimya',
    name: 'KimyaLab',
    href: '/lab/kimya',
    icon: FlaskConical,
    color: 'from-cyan-500 to-teal-400',
    bgGlow: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/30 group-hover:border-cyan-400/60',
    textColor: 'text-cyan-400',
    tag: '3D Atom, Gazlar & Titrasyon',
    category: 'sayisal',
    levels: ['ortaokul', 'lise'],
    levelBadge: '7 - 12. Sınıf & Maarif',
    maarifModel: true,
    description:
      '3D Bohr atom modeli ve katman elektron dağılımı (2-8-8 kuralı), ideal gaz yasaları, sanal asit-baz titrasyon deneyi, tepkime hız/denge ve mol/çözelti aracı.',
    modules: [
      {
        title: '3D Atom Modeli & Katman Dağılımı (Bohr)',
        desc: 'Çekirdekteki proton ve nötronlar ile yörüngelerdeki elektron katmanlarını (2-8-8 kuralı) 3 boyutta inceleyin; grup-periyot ilişkisini keşfedin.',
        badge: '7-9. Sınıf',
      },
      {
        title: 'İdeal Gaz Yasaları & Pistonlu Kap (P·V = n·R·T)',
        desc: 'Hareketli piston, ısıtıcı/soğutucu ateşi, basınç manometresi; Boyle, Charles ve Gay-Lussac gaz yasaları simülasyonu.',
        badge: '11. Sınıf AYT',
      },
      {
        title: 'Sanal Asit-Baz Titrasyon Deneyi & pH',
        desc: 'Büret musluğunu açın; asit-baz nötralleşmesini, pH cetvelini (0-14) ve fenolftalein indikatörünün pembeleşme dönüm noktasını canlı izleyin.',
        badge: '8. Sınıf LGS & Lise',
      },
      {
        title: 'Tepkime Hızı & Le Chatelier Kimyasal Dengesi',
        desc: 'Aktivasyon enerjisi (Eai, Eag), katalizörün etkisi ve Haber-Bosch denge tepkimesinde sağa/sola kayma simülatörü.',
        badge: '11. Sınıf AYT',
      },
      {
        title: 'Mol & Çözelti Konsantrasyon Aracı',
        desc: 'M = n/V derişim ve kütle formüllerini interaktif hesaplama laboratuvarı.',
        badge: '10. Sınıf TYT/AYT',
      },
      {
        title: 'Kimya-Le: Günün Elementi',
        desc: 'İlk 18 element ve günlük hayattaki yaygın metalleri/ametalleri ipuçlarıyla periyodik cetvelde tahmin etme oyunu.',
        badge: 'Keşif & Oyun',
      },
    ],
  },
  {
    id: 'fizik',
    name: 'FizikLab',
    href: '/lab/fizik',
    icon: Zap,
    color: 'from-blue-500 to-cyan-400',
    bgGlow: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30 group-hover:border-blue-400/60',
    textColor: 'text-blue-400',
    tag: 'Dinamik, Atış, Optik & Dalga',
    category: 'sayisal',
    levels: ['ortaokul', 'lise'],
    levelBadge: '7 - 12. Sınıf & Maarif',
    maarifModel: true,
    description:
      'Newton hareket yasaları, Arşimet kaldırma kuvveti, merceklerde ışın izleme, balistik eğik atış, elektrik devreleri ve basit harmonik hareket.',
    modules: [
      {
        title: 'Elektrik Devresi & Ohm Yasası (V = I·R)',
        desc: 'Akan elektronları canlı izleyin; anahtarı açıp kapatın, seri/paralel lamba parlaklıklarını gözlemleyin.',
        badge: '7-10. Sınıf',
      },
      {
        title: 'Sıvıların Kaldırma Kuvveti & Basınç',
        desc: 'Arşimet prensibi, cisim ve sıvı yoğunluğu karşılaştırması (dc vs ds), dinamometrede hafifleme ve P = h·d·g sıvı basıncı.',
        badge: '8. Sınıf LGS & 10. Sınıf',
      },
      {
        title: 'Mercekler & Işın İzleme (Optik)',
        desc: 'İnce ve kalın kenarlı merceklerde cismi kaydırın; odak, merkez ve büyüteç sanal görüntülerini anında izleyin.',
        badge: '8-10. Sınıf Optik',
      },
      {
        title: 'Newton Hareket Yasaları & Dinamik (F = m·a)',
        desc: 'Sürtünmeli eğimli düzlem, serbest cisim diyagramı vektörleri, statik/kinetik sürtünme eşiği ve ivmeli hareket.',
        badge: '9. & 11. Sınıf',
      },
      {
        title: 'Eğik Atış & Balistik Simülatörü',
        desc: 'Fırlatma açısını ve hızını ayarlayın; havada asılı kalma süresini, hMax ve menzili 60 FPS fizikle simüle edin.',
        badge: '11. Sınıf Mekanik',
      },
      {
        title: 'Basit Harmonik Hareket & Dalgalar',
        desc: 'T = 2π√(m/k) yay sarkacı, ipli sarkaç, dalga boyu frekans ilişkisi ve kinetik-potansiyel enerji dönüşümü.',
        badge: '12. Sınıf AYT',
      },
    ],
  },
  {
    id: 'biyoloji',
    name: 'BiyolojiLab',
    href: '/lab/biyoloji',
    icon: Dna,
    color: 'from-emerald-500 to-teal-400',
    bgGlow: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30 group-hover:border-emerald-400/60',
    textColor: 'text-emerald-400',
    tag: 'Punnett, Bölünme & Fotosentez',
    category: 'sayisal',
    levels: ['ortaokul', 'lise'],
    levelBadge: '7 - 12. Sınıf & Maarif',
    maarifModel: true,
    description:
      'Mendel kalıtımı Punnett karesi, mitoz ve mayoz hücre döngüsü, Engelmann fotosentez deneyi ve ribozomda protein sentezi.',
    modules: [
      {
        title: 'Punnett Karesi & Kalıtım Genetiği',
        desc: 'Monohibrit çaprazlamalar, kan grupları ve fenotip/genotip olasılık oranlarını etkileşimli hesaplayın.',
        badge: '8. Sınıf LGS & 10. Sınıf',
      },
      {
        title: 'Fotosentez & Engelmann Spektrumu',
        desc: 'Işık rengi (dalga boyu), ışık şiddeti, CO₂ ve sıcaklığın fotosentez hızına ve O₂ çıkışına canlı etkisi.',
        badge: '8. Sınıf LGS & 12. Sınıf',
      },
      {
        title: 'Mitoz & Mayoz Hücre Bölünmesi',
        desc: 'İnterfaz, profaz, metafaz, anafaz, krossing-over ve kromozom sayısı (2n → 2n vs 2n → n) değişimi.',
        badge: '7. & 10. Sınıf',
      },
      {
        title: 'DNA Protein Sentezi & Ribozom Atölyesi',
        desc: 'Kalıp DNA zincirinden mRNA transkripsiyonu yapın, tRNA antikodonlarını eşleştirip polipeptit zinciri örün.',
        badge: '12. Sınıf AYT',
      },
    ],
  },
  {
    id: 'matematik',
    name: 'MatematikLab',
    href: '/lab/matematik',
    icon: Calculator,
    color: 'from-violet-500 to-indigo-400',
    bgGlow: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30 group-hover:border-violet-400/60',
    textColor: 'text-violet-400',
    tag: '5-12. Sınıf Maarif Cebir & Geometri',
    category: 'sayisal',
    levels: ['ortaokul', 'lise'],
    levelBadge: '5 - 12. Sınıf & Maarif',
    maarifModel: true,
    description:
      '5-8. sınıf ortaokul için kesirler, tam sayılar, denklem terazisi, EBOB-EKOK ve Pisagor/eğim; lise için fonksiyonlar, parabol, birim çember ve türev.',
    modules: [
      {
        title: 'Çarpanlar ve Katlar / EBOB-EKOK',
        desc: 'Asal çarpan ağacı, Venn şeması ortak bölenleri, EBOB-EKOK hesabı ve LGS dikdörtgen tarla problemi.',
        badge: '8. Sınıf LGS',
      },
      {
        title: 'Pisagor Bağıntısı & Koordinat Eğimi (m = Δy/Δx)',
        desc: 'a² + b² = c² geometrik kare alanı ispatı, özel dik üçgenler (3-4-5, 5-12-13) ve LGS koordinat eğim hesaplayıcısı.',
        badge: '8. Sınıf LGS',
      },
      {
        title: 'Eşit Kollu Denklem Terazisi Laboratuvarı',
        desc: 'Bilinmeyen x kutuları ve birim ağırlıklarla eşitliğin korunumu ve 1. dereceden denklem çözümü.',
        badge: '7. Sınıf Cebir',
      },
      {
        title: 'Tam Sayılar & Sayı Doğrusu Termometre',
        desc: 'Yönlü sayılar, sıfır çifti pulları, termometre dondurucu sıcaklıkları ve mutlak değer (|x|).',
        badge: '6. Sınıf',
      },
      {
        title: 'Kesirler & Pasta/Şerit Modeli',
        desc: 'Birim kesir, basit/bileşik/tam sayılı kesirler ve interaktif pasta dilimi ile denk kesir genişletmesi.',
        badge: '5. Sınıf',
      },
      {
        title: 'Fonksiyonlar & Grafik Dönüşümleri',
        desc: 'f(x) = ax + b doğrusal fonksiyonu, eksen kesişimleri, tanım/değer kümesi ve girdi-çıktı makinesi.',
        badge: '9. Sınıf Lise',
      },
      {
        title: 'İkinci Dereceden Parabol Simülatörü',
        desc: 'Tepe noktası T(r, k), diskriminant (Δ = b² - 4ac), kolların yönü ve reel köklerin kartezyen çizimi.',
        badge: '10. Sınıf Lise',
      },
      {
        title: 'Trigonometrik Birim Çember (360°)',
        desc: 'Açıyı döndürün; sinüs, kosinüs, tanjant eksen izdüşümlerini ve canlı sinüs dalgasını anlık kavrayın.',
        badge: '11. Sınıf Lise',
      },
      {
        title: 'Türev & Teğet Doğrusu Simülatörü',
        desc: 'Eğri üzerinde noktayı kaydırın, m = f\'(x) teğet eğimini ve f\'(x) = 0 yerel ekstremum zirvelerini keşfedin.',
        badge: '12. Sınıf AYT',
      },
    ],
  },
  {
    id: 'turkce',
    name: 'TürkçeLab',
    href: '/lab/turkce',
    icon: BookOpen,
    color: 'from-amber-500 to-orange-400',
    bgGlow: 'bg-amber-500/10',
    borderColor: 'border-amber-500/30 group-hover:border-amber-400/60',
    textColor: 'text-amber-400',
    tag: 'Ögeler, Bionic Hız & Edebiyat',
    category: 'sozel',
    levels: ['ortaokul', 'lise'],
    levelBadge: '5 - 12. Sınıf & Maarif',
    maarifModel: true,
    description:
      'Cümlenin ögeleri ve fiilimsiler çözümleyici, bionic okuma paragraf antrenörü, canlı TDK günün kelimesi ve edebiyat eşleştirme oyunu.',
    modules: [
      {
        title: 'Cümlenin Ögeleri & Fiilimsiler Çözümleyici',
        desc: 'Yüklem, özne, nesne, yer tamlayıcısı ve zarf tümleci tespiti; isim-fiil, sıfat-fiil ve zarf-fiil ekleri.',
        badge: '8. Sınıf LGS & TYT',
      },
      {
        title: 'Bionic Paragraf Hız Antrenörü',
        desc: 'Kelimelerin ilk harflerini vurgulayarak göz sıçrama hızınızı artırın; anlama ve kavrama hızınızı katlayın.',
        badge: 'Hızlı Okuma',
      },
      {
        title: 'Günün Kelimesi & TDK Sözlük',
        desc: 'Türkçenin zengin söz varlığını, anlamı karıştırılan sözcükleri ve köken bilgilerini keşfedin.',
        badge: 'Canlı TDK',
      },
      {
        title: 'Edebiyat Yazar — Eser Match',
        desc: 'Divan, Tanzimat, Milli Edebiyat ve Cumhuriyet dönemi yazarlarını eserleriyle eşleştirme kart oyunu.',
        badge: 'Edebiyat Oyunu',
      },
      {
        title: 'Ses Olayları Dedektifi',
        desc: 'Cümledeki ünlü düşmesi, ünsüz benzeşmesi ve yumuşamalarını etkileşimli büyüteçle ortaya çıkarın.',
        badge: '5-12. Sınıf',
      },
    ],
  },
  {
    id: 'sosyal',
    name: 'SosyalLab',
    href: '/lab/sosyal',
    icon: Globe2,
    color: 'from-rose-500 to-amber-400',
    bgGlow: 'bg-rose-500/10',
    borderColor: 'border-rose-500/30 group-hover:border-rose-400/60',
    textColor: 'text-rose-400',
    tag: 'Atlas, Mevsimler & Demografi',
    category: 'sozel',
    levels: ['ortaokul', 'lise'],
    levelBadge: '5 - 12. Sınıf & Maarif',
    maarifModel: true,
    description:
      'Türkiye fiziki ve iklim atlası, 23° 27\' eksen eğikliği ve mevsimler, nüfus piramitleri ile kronolojik tarih zaman şeridi.',
    modules: [
      {
        title: 'Türkiye Fiziki & İklim Atlası',
        desc: '81 ilin iklim bölgelerini, yerel rüzgâr yönlerini, fay hatlarını ve masif arazilerini katman katman keşfedin.',
        badge: '5-12. Sınıf',
      },
      {
        title: 'Mevsimlerin Oluşumu & Yörünge Simülatörü',
        desc: '23° 27\' eksen eğikliği, 21 Haziran/Aralık gün dönümleri, ekinokslar, güneş açısı ve gölge boyu.',
        badge: '8. Sınıf LGS & 9. Sınıf',
      },
      {
        title: 'Nüfus Piramitleri & Demografik Analiz',
        desc: 'Doğum/ölüm oranları, gelişmişlik piramitleri (arı kovanı, içe çökük, çan), aktif ve bağımlı nüfus oranları.',
        badge: '10. Sınıf Coğrafya',
      },
      {
        title: 'Tarih Kronoloji & Antlaşmalar',
        desc: 'İlk Türk devletlerinden Kurtuluş Savaşı\'na kritik antlaşmaların sebep-sonuç ve kronoloji şemaları.',
        badge: 'Tarih Atlası',
      },
    ],
  },
  {
    id: 'ingilizce',
    name: 'İngilizceLab',
    href: '/lab/ingilizce',
    icon: Languages,
    color: 'from-sky-500 to-indigo-500',
    bgGlow: 'bg-sky-500/10',
    borderColor: 'border-sky-500/30 group-hover:border-sky-400/60',
    textColor: 'text-sky-400',
    tag: 'Pratik Konuşma & Dil',
    category: 'dil',
    levels: ['ortaokul', 'lise'],
    levelBadge: '5 - 12. Sınıf & Maarif',
    maarifModel: true,
    description:
      'Durumsal konuşma senaryoları (kafe, havalimanı, mülakat), Amerikan/İngiliz sokak jargonu & deyimler, kritik telaffuz hataları ve görsel sahne nesne sözlüğü ile interaktif İngilizce atölyesi.',
    modules: [
      {
        title: 'Durumsal Mikro Senaryolar',
        desc: 'Kafede sipariş, havalimanında kayıp bagaj, iş mülakatı ve yön sorma gibi gerçek hayat senaryoları ve diyaloglar.',
        badge: 'Durumsal Öğrenme',
      },
      {
        title: 'Doğal Konuşma & Deyimler (Slang & Idioms)',
        desc: 'Amerikan, İngiliz ve Avustralya aksanlarında yaşayan sokak dili, deyimler ve Türkçe kültürel karşılıkları.',
        badge: 'US • UK • AU',
      },
      {
        title: 'Fonetik Telaffuz & Konuşma Antrenörü',
        desc: 'Türk öğrencilerin en sık yaptığı sessiz harf tuzakları (receipt, subtle, queue) ve sesli telaffuz tanıma.',
        badge: 'Web Speech Audio',
      },
      {
        title: 'Görsel Sahne Sözlüğü (Visual Explorer)',
        desc: 'Kahve barı, havalimanı ve ofis ortamlarında nesnelere dokunarak telaffuz ve örnek kalıp cümle keşfi.',
        badge: 'Görsel Öğrenme',
      },
    ],
  },
]

type FilterType = 'all' | 'maarif' | 'ortaokul' | 'lise' | 'sayisal' | 'sozel' | 'dil'

export function LabHubView() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Filtered branches based on search query and category filters
  const filteredBranches = useMemo(() => {
    return LAB_BRANCH_DATA.filter((branch) => {
      // Search matching
      const matchesSearch =
        searchQuery.trim() === '' ||
        branch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        branch.modules.some(
          (m) =>
            m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.badge.toLowerCase().includes(searchQuery.toLowerCase())
        )

      if (!matchesSearch) return false

      // Category matching
      if (activeFilter === 'ortaokul') return branch.levels.includes('ortaokul')
      if (activeFilter === 'lise') return branch.levels.includes('lise')
      if (activeFilter === 'maarif') return branch.maarifModel === true
      if (activeFilter === 'sayisal') return branch.category === 'sayisal'
      if (activeFilter === 'sozel') return branch.category === 'sozel'
      if (activeFilter === 'dil') return branch.category === 'dil'

      return true
    })
  }, [activeFilter, searchQuery])

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-cyan-500 selection:text-slate-950 font-sans">
      {/* ── Background Glow Effects ── */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed top-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />
      <div className="fixed bottom-10 left-1/3 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none -z-10" />

      {/* ── Top Navigation Bar ── */}
      <BranchNavHeader />

      {/* ── Hero Banner ── */}
      <section className="relative border-b border-slate-800/80 bg-gradient-to-b from-indigo-950/20 via-slate-900/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/15 via-indigo-500/15 to-teal-500/15 border border-cyan-500/30 text-cyan-200 text-xs font-semibold shadow-lg shadow-cyan-500/10">
            <span className="px-2 py-0.5 rounded-md bg-cyan-400 text-slate-950 font-black tracking-wider text-[11px]">
              L.A.B.
            </span>
            <span className="text-slate-300 font-medium">Laboratuvar Destekli Akademik Başarı</span>
            <span className="hidden sm:inline text-slate-600">•</span>
            <span className="hidden sm:inline text-amber-300 font-semibold text-[11px]">
              Türkiye Yüzyılı Maarif Modeli & MEB Uyumlu
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight">
            Bilimi Ezberleme,{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
              Simüle Ederek Keşfet.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Türkiye Yüzyılı Maarif Modeli ve MEB müfredatına tam uyumlu; ortaokul ve lise (5-12. sınıf) kazanımlarını 60 FPS fizik motoru, 3D modeller ve beceri temelli sanal deneylerle dokunarak öğrenin.
          </p>

          {/* ── Live Platform Stats ── */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <div className="text-left">
                <span className="text-xs text-slate-400 block font-medium">Toplam</span>
                <span className="text-sm font-bold text-white">7 Branş Atölyesi</span>
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <div className="text-left">
                <span className="text-xs text-slate-400 block font-medium">İçerik</span>
                <span className="text-sm font-bold text-white">20+ Sanal Simülatör</span>
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <div className="text-left">
                <span className="text-xs text-slate-400 block font-medium">Kademeler</span>
                <span className="text-sm font-bold text-white">5 - 12. Sınıf</span>
              </div>
            </div>

            <div className="px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-violet-400" />
              <div className="text-left">
                <span className="text-xs text-slate-400 block font-medium">Müfredat</span>
                <span className="text-sm font-bold text-white">Maarif & MEB</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Search & Filter Controls ── */}
      <section className="sticky top-16 z-40 backdrop-blur-2xl bg-slate-950/85 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'all' as FilterType, label: 'Tüm Atölyeler' },
              { id: 'maarif' as FilterType, label: '✨ Maarif Modeli' },
              { id: 'ortaokul' as FilterType, label: '🎒 Ortaokul (5-8. Sınıf)' },
              { id: 'lise' as FilterType, label: '🎓 Lise (9-12. Sınıf)' },
              { id: 'sayisal' as FilterType, label: '🔬 Fen & Matematik' },
              { id: 'sozel' as FilterType, label: '📚 Türkçe & Sosyal' },
              { id: 'dil' as FilterType, label: '🌐 İngilizceLab' },
            ].map((f) => {
              const isActive = activeFilter === f.id
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              )
            })}
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Simülasyon veya konu ara (örn: titrasyon, optik, türev)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Laboratories Grid ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <AnimatePresence>
            {filteredBranches.map((branch) => {
              const Icon = branch.icon
              const isOrtaokul = activeFilter === 'ortaokul'
              const isLise = activeFilter === 'lise'

              let displayTitle = branch.name
              let displayTag = branch.tag

              if (isOrtaokul) {
                if (branch.id === 'kimya') {
                  displayTitle = 'Fen Bilimleri (Kimya)'
                  displayTag = 'Madde, Atom & Periyodik Sistem'
                } else if (branch.id === 'fizik') {
                  displayTitle = 'Fen Bilimleri (Fizik)'
                  displayTag = 'Elektrik Devreleri & Işık'
                } else if (branch.id === 'biyoloji') {
                  displayTitle = 'Fen Bilimleri (Biyoloji)'
                  displayTag = 'Hücre, DNA & Kalıtım'
                } else if (branch.id === 'sosyal') {
                  displayTitle = 'Sosyal Bilgiler & İnkılap'
                  displayTag = 'LGS Sosyal & Tarih Atlası'
                }
              } else if (isLise) {
                if (branch.id === 'sosyal') {
                  displayTitle = 'Tarih & Coğrafya'
                  displayTag = 'AYT / TYT Sosyal Bilimler'
                }
              }

              return (
                <motion.div
                  key={branch.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="group relative rounded-3xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 backdrop-blur-xl p-6 flex flex-col justify-between overflow-hidden shadow-xl transition-all hover:shadow-2xl hover:shadow-cyan-500/5"
                >
                  {/* Subtle Corner Glow */}
                  <div
                    className={`absolute -top-12 -right-12 w-36 h-36 ${branch.bgGlow} rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-500`}
                  />

                  <div>
                    {/* Header Row: Icon & Tag */}
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${branch.color} flex items-center justify-center shadow-lg shadow-cyan-500/10 group-hover:scale-105 transition-transform`}
                        >
                          <Icon className="w-6 h-6 text-slate-950" />
                        </div>
                        <div>
                          <h2 className="text-xl font-black text-white group-hover:text-cyan-300 transition-colors">
                            {displayTitle}
                          </h2>
                          <span className="text-[11px] font-semibold text-slate-400">
                            {displayTag}
                          </span>
                        </div>
                      </div>

                      {/* Kademe & Maarif Badge */}
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                          {branch.levelBadge}
                        </span>
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-slate-300 leading-relaxed mb-5">
                      {branch.description}
                    </p>

                    {/* Interactive Modules Preview List */}
                    <div className="space-y-2 mb-6">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        İçerdiği Sanal Modüller:
                      </div>
                      <div className="space-y-1.5">
                        {branch.modules.map((m, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start justify-between gap-2 text-xs hover:border-slate-700 transition-colors"
                          >
                            <div>
                              <span className="font-semibold text-white block">
                                {m.title}
                              </span>
                              <span className="text-[11px] text-slate-400 leading-tight">
                                {m.desc}
                              </span>
                            </div>
                            <span className="shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300 border border-cyan-500/30">
                              {m.badge}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Direct Link Button */}
                  <Link
                    href={branch.href}
                    className={`w-full py-3 px-4 rounded-xl bg-gradient-to-r ${branch.color} text-slate-950 font-black text-xs flex items-center justify-center gap-2 group-hover:opacity-95 shadow-md shadow-cyan-500/10 transition-all cursor-pointer tracking-wider`}
                  >
                    <span>BAŞLA</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* ── Feature Highlights (Why DersoLab?) ── */}
        <section className="p-8 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Neden DersoLab Simülasyonları?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Ezberci eğitim anlayışının ötesine geçin; kavramları gözünüzle görün, deneyerek kavrayın.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Eye className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Görsel Hafıza & Kalıcı Öğrenme</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Formülleri kuru kuruya ezberlemek yerine; elektronların kablodaki akışını, teğet eğiminin türevini ve odak ışınlarının kesişimini anında canlandırın.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">ÖSYM Tuzakları & Hap Bilgiler</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Her simülatörün altında MEB müfredatına ve son 10 yılın TYT/AYT çıkmış sorularına dayalı sınav hap kuralları ve en sık düşülen hatalar listelenir.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">Bire Bir Eğitmen Desteği</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Simülasyonda deneyip aklınıza takılan soruları DersoLab’ın onaylı öğretmenleriyle bire bir canlı online derste pekiştirin.
              </p>
            </div>
          </div>
        </section>

        {/* ── Bottom Callout: Convert Student to Booking ── */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-indigo-950/40 border border-cyan-500/30 backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>DersoLab Canlı Özel Ders</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Eksik Konunu Bire Bir Uzman Eğitmenle Kapat.
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Fizik, kimya, biyoloji veya matematikteki zorlandığın kazanımları DersoLab öğretmenleriyle canlı Google Meet ortamında çöz.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              href="/instructors"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-black text-xs sm:text-sm shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Eğitmenleri Keşfet</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
