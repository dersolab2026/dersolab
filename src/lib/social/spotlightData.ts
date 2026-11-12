import type { SpotlightCardData, SocialPostItem, InstagramContentType } from '@/types/social'
import {
  findMovieInPool,
  convertMovieToSpotlightData,
  getAllPoolMovies,
} from './moviePoolManager'
import {
  findFigureInPool,
  convertFigureToSpotlightData,
  getAllPoolFigures,
} from './figurePoolManager'

export const CURATED_MOTIVATION_SPOTLIGHTS: SpotlightCardData[] = getAllPoolFigures().map(convertFigureToSpotlightData)

export const CURATED_MOVIE_SPOTLIGHTS: SpotlightCardData[] = [
  {
    category: 'movie',
    categoryPill: 'HAFTANIN FİLMİ',
    watermarkLetters: ['U', 'K'],
    title: 'Umudunu Kaybetme',
    subtitle: '(The Pursuit of Happyness, 2006)',
    ratingOrBadge: '⭐ 8.0 / 10',
    quote: '“Kimsenin sana bir şeyi yapamayacağını söylemesine izin verme; bir hayalin varsa onu korumalısın.”',
    quoteSecondary: '“İnsanlar kendilerinin yapamadığı şeyleri senin de yapamayacağını söylerler.”',
    explanation:
      'Evsiz kalan bir babanın oğluna iyi bir gelecek sunmak için borsa stajında gecesini gündüzüne katarak verdiği insanüstü mücadele. Hedefe odaklanmanın ve pes etmemenin yaşayan kanıtı.',
    badges: [
      { text: 'Oscar Adayı', color: 'green' },
      { text: '117 Dakika', color: 'blue' },
      { text: 'Azim & Başarı', color: 'purple' },
      { text: 'Will Smith', color: 'rose' },
    ],
    footerClub: 'DersoLab Sinema Kulübü',
    footerCredit: 'Yönetmen: Gabriele Muccino • Will Smith',
    imageUrl: '/spotlight/umudunu_kaybetme.jpg',
  },
  {
    category: 'movie',
    categoryPill: 'HAFTANIN FİLMİ',
    watermarkLetters: ['A', 'B'],
    title: 'Akıl Oyunları',
    subtitle: '(A Beautiful Mind, 2001)',
    ratingOrBadge: '⭐ 8.2 / 10',
    quote: '“Her zorluğun üstesinden gelen tek formül: Sebat ve inançtır.”',
    quoteSecondary: '“Beni buraya getiren en önemli şey, vazgeçmeyi reddetmemdir.”',
    explanation:
      'Nobel ödüllü dahi matematikçi John Nash’in Oyun Teorisi’ni keşfederken zihninin sınırlarında verdiği destansı mücadele ve azim hikayesi.',
    badges: [
      { text: '4 Oscar Ödüllü', color: 'green' },
      { text: '135 Dakika', color: 'blue' },
      { text: 'Matematik & Biyografi', color: 'purple' },
      { text: 'Ron Howard', color: 'rose' },
    ],
    footerClub: 'DersoLab Sinema Kulübü',
    footerCredit: 'Yönetmen: Ron Howard',
    imageUrl: '/spotlight/akil_oyunlari.jpg',
  },
  {
    category: 'movie',
    categoryPill: 'HAFTANIN FİLMİ',
    watermarkLetters: ['H', 'Ö'],
    title: 'Her Çocuk Özeldir',
    subtitle: '(Taare Zameen Par, 2007)',
    ratingOrBadge: '⭐ 8.3 / 10',
    quote: '“Her çocuğun kendi ritmi ve dünyası vardır; önemli olan onu anlayacak sevgiyle bakmaktır.”',
    quoteSecondary: '“Yeryüzündeki her fidan, doğru ışığı bulduğunda çiçek açar.”',
    explanation:
      'Harfleri ve sayıları dans eder gibi gören disleksili bir çocuğun, idealist bir sanat öğretmeni sayesinde içindeki dahiyi ortaya çıkarma serüveni. Öğrenme gücünü katlayan bir başyapıt.',
    badges: [
      { text: 'Eğitim Klasiği', color: 'green' },
      { text: '165 Dakika', color: 'blue' },
      { text: 'İlham & Farkındalık', color: 'purple' },
      { text: 'Aamir Khan', color: 'rose' },
    ],
    footerClub: 'DersoLab Sinema Kulübü',
    footerCredit: 'Yönetmen: Aamir Khan • Darsheel Safary',
    imageUrl: '/spotlight/her_cocuk_ozeldir.jpg',
  },
  {
    category: 'movie',
    categoryPill: 'HAFTANIN FİLMİ',
    watermarkLetters: ['W', 'P'],
    title: 'Whiplash',
    subtitle: '(Whiplash, 2014)',
    ratingOrBadge: '⭐ 8.5 / 10',
    quote: '“İngiliz dilindeki en zararlı iki kelime şudur: ‘Aferin, yeterli.’ ”',
    quoteSecondary: '“Sınırlarını aşmak istiyorsan, konfor alanından çıkmaya cesaret etmelisin.”',
    explanation:
      'Zirveye ulaşmak için gereken sınırları zorlayan çalışma disiplinini, odaklanmayı ve mükemmellik tutkusunu soluksuz bir tempoyla yaşatan modern başyapıt.',
    badges: [
      { text: '3 Oscar Ödüllü', color: 'green' },
      { text: '106 Dakika', color: 'blue' },
      { text: 'Yüksek Disiplin', color: 'purple' },
      { text: 'Damien Chazelle', color: 'rose' },
    ],
    footerClub: 'DersoLab Sinema Kulübü',
    footerCredit: 'Yönetmen: Damien Chazelle',
    imageUrl: '/spotlight/whiplash.jpg',
  },
  {
    category: 'movie',
    categoryPill: 'HAFTANIN FİLMİ',
    watermarkLetters: ['K', 'N'],
    title: 'Kör Nokta',
    subtitle: '(The Blind Side, 2009)',
    ratingOrBadge: '⭐ 7.6 / 10',
    quote: '“Fırsat verildiğinde ve bir insan sana inandığında, geçmişin hiçbir önemi kalmaz.”',
    quoteSecondary: '“Cesaret korkunun olmaması değil, korkuya rağmen adım atmaktır.”',
    explanation:
      'Sokaklardan Amerikan futbolu şampiyonluğuna uzanan Michael Oher’ın gerçek başarı hikayesi. Sevgi, güven ve rehberliğin insan potansiyelini nasıl mucizeye dönüştürdüğünü gösterir.',
    badges: [
      { text: 'Oscar Ödüllü', color: 'green' },
      { text: '129 Dakika', color: 'blue' },
      { text: 'Gerçek Yaşam Öyküsü', color: 'purple' },
      { text: 'Sandra Bullock', color: 'rose' },
    ],
    footerClub: 'DersoLab Sinema Kulübü',
    footerCredit: 'Yönetmen: John Lee Hancock',
    imageUrl: '/spotlight/kor_nokta.jpg',
  },
  {
    category: 'movie',
    categoryPill: 'HAFTANIN FİLMİ',
    watermarkLetters: ['K', 'K'],
    title: 'Kralın Konuşması',
    subtitle: "(The King's Speech, 2010)",
    ratingOrBadge: '⭐ 8.0 / 10',
    quote: '“En büyük zafer, kendi içindeki korkuyu ve tereddüdü yendiğin andır.”',
    quoteSecondary: '“Sesini bulmak, kim olduğunu hatırlamakla başlar.”',
    explanation:
      'Kekemeliği yüzünden topluluk önünde konuşmaktan korkan Kral VI. George’un sıra dışı bir konuşma terapistiyle sabırla çalışarak milletine ilham veren bir lidere dönüşme serüveni.',
    badges: [
      { text: '4 Oscar Ödüllü', color: 'green' },
      { text: '118 Dakika', color: 'blue' },
      { text: 'Sabır & Kararlılık', color: 'purple' },
      { text: 'Colin Firth', color: 'rose' },
    ],
    footerClub: 'DersoLab Sinema Kulübü',
    footerCredit: 'Yönetmen: Tom Hooper',
    imageUrl: '/spotlight/kralin_konusmasi.jpg',
  },
  {
    category: 'movie',
    categoryPill: 'HAFTANIN FİLMİ',
    watermarkLetters: ['3', 'I'],
    title: '3 Idiots',
    subtitle: '(3 Idiots, 2009)',
    ratingOrBadge: '⭐ 8.4 / 10',
    quote: '“Başarının peşinden koşma; mükemmelliği yakala, o zaman başarı seni kovalar.”',
    quoteSecondary: '“All is well! Kalbine korkuyu değil, cesareti fısılda.”',
    explanation:
      'Ezberci ve baskıcı sınav sistemine karşı sorgulayan aklı ve tutkuyla öğrenmeyi savunan Rancho ile arkadaşlarının eğlenceli ve derinlikli eğitim serüveni.',
    badges: [
      { text: 'Kült Eğitim Filmi', color: 'green' },
      { text: '170 Dakika', color: 'blue' },
      { text: 'Mükemmellik & Tutku', color: 'purple' },
      { text: 'Rajkumar Hirani', color: 'rose' },
    ],
    footerClub: 'DersoLab Sinema Kulübü',
    footerCredit: 'Yönetmen: Rajkumar Hirani • Aamir Khan',
    imageUrl: '/spotlight/3_idiots.jpg',
  },
]

export const CURATED_BOOK_SPOTLIGHTS: SpotlightCardData[] = [
  {
    category: 'book',
    categoryPill: 'HAFTANIN KİTABI',
    watermarkLetters: ['S', 'P'],
    title: 'Şeker Portakalı',
    subtitle: '(José Mauro de Vasconcelos, 1968)',
    ratingOrBadge: '⭐ 4.8 / 5',
    quote: '“İnsanın içi acır mı hiç? Acıyor işte. Hem de nasıl...”',
    quoteSecondary: '“Sevgi olmadan hiçbir şeyin anlamı yoktur.”',
    explanation:
      'Küçük Zezé’nin dünyayı keşfetme serüveni; empati yeteneğini, duygusal zekayı ve uzun soluklu paragraf metinlerini derin duyguyla kavrama refleksini geliştirir.',
    badges: [
      { text: 'Dünya Klasiği', color: 'green' },
      { text: '182 Sayfa', color: 'blue' },
      { text: 'Empati & Büyüme', color: 'purple' },
      { text: 'LGS & YKS Seçkisi', color: 'rose' },
    ],
    footerClub: 'DersoLab Kitap Kulübü',
    footerCredit: 'Yazar: José Mauro de Vasconcelos',
    imageUrl: '/spotlight/seker_portakali.jpg',
  },
  {
    category: 'book',
    categoryPill: 'HAFTANIN KİTABI',
    watermarkLetters: ['1', '9'],
    title: '1984',
    subtitle: '(George Orwell, 1949)',
    ratingOrBadge: '⭐ 4.9 / 5',
    quote: '“Bilinçleninceye kadar asla başkaldıramayacaklar, başkaldırmadıkça da bilinçlenemezler.”',
    quoteSecondary: '“Özgürlük, iki kere ikinin dört ettiğini söyleyebilmektir.”',
    explanation:
      'Düşünce özgürlüğü, dilin düşünce üzerindeki etkisi ve kavramsal analiz gücünü zirveye taşıyan, ÖSYM paragraf sorularının vazgeçilmez zihinsel altyapısı.',
    badges: [
      { text: 'Distopya Klasiği', color: 'green' },
      { text: '352 Sayfa', color: 'blue' },
      { text: 'Eleştirel Düşünce', color: 'purple' },
      { text: 'YKS Başucu Eseri', color: 'rose' },
    ],
    footerClub: 'DersoLab Kitap Kulübü',
    footerCredit: 'Yazar: George Orwell',
    imageUrl: '/spotlight/1984_book.jpg',
  },
  {
    category: 'book',
    categoryPill: 'HAFTANIN KİTABI',
    watermarkLetters: ['B', 'Z'],
    title: 'Beyaz Zambaklar Ülkesinde',
    subtitle: '(Grigory Petrov, 1923)',
    ratingOrBadge: '⭐ 4.7 / 5',
    quote: '“Bir milletin büyüklüğü, her bir ferdinin kendi işini en iyi şekilde yapma arzusunda gizlidir.”',
    quoteSecondary: '“Gelecek, bugünkü emeğin ve sabrın meyvesidir.”',
    explanation:
      'Atatürk’ün okullarda zorunlu okunmasını tavsiye ettiği; çalışma disiplini, irade ve sıfırdan başarı inşa etme azmini aşılayan bir rehber eserdir.',
    badges: [
      { text: 'Tarih & İrade', color: 'green' },
      { text: '144 Sayfa', color: 'blue' },
      { text: 'Çalışma Disiplini', color: 'purple' },
      { text: 'Atatürk Tavsiyesi', color: 'rose' },
    ],
    footerClub: 'DersoLab Kitap Kulübü',
    footerCredit: 'Yazar: Grigory Petrov',
    imageUrl: '/spotlight/beyaz_zambaklar.jpg',
  },
  {
    category: 'book',
    categoryPill: 'HAFTANIN KİTABI',
    watermarkLetters: ['F', '4'],
    title: 'Fahrenheit 451',
    subtitle: '(Ray Bradbury, 1953)',
    ratingOrBadge: '⭐ 4.6 / 5',
    quote: '“Kitapları yakmaktan daha büyük bir suç varsa, o da onları okumamaktır.”',
    quoteSecondary: '“Düşünmek, rüzgara karşı yürümek gibidir; cesaret ister.”',
    explanation:
      'Sığ düşünceye karşı derin okumanın kıymetini anlatan, hızlı okurken ana fikri yakalama refleksini güçlendiren sürükleyici bir distopya.',
    badges: [
      { text: 'Kült Roman', color: 'green' },
      { text: '208 Sayfa', color: 'blue' },
      { text: 'Okuma Sevgisi', color: 'purple' },
      { text: 'TYT & AYT Destek', color: 'rose' },
    ],
    footerClub: 'DersoLab Kitap Kulübü',
    footerCredit: 'Yazar: Ray Bradbury',
    imageUrl: '/spotlight/fahrenheit451.jpg',
  },
  {
    category: 'book',
    categoryPill: 'HAFTANIN KİTABI',
    watermarkLetters: ['K', 'P'],
    title: 'Küçük Prens',
    subtitle: '(Antoine de Saint-Exupéry, 1943)',
    ratingOrBadge: '⭐ 4.9 / 5',
    quote: '“Gerçeğin mayası gözle görülmez. İnsan ancak yüreğiyle baktığı zaman doğruyu görebilir.”',
    quoteSecondary: '“Gülünü senin için bunca önemli kılan, ona harcadığın zamandır.”',
    explanation:
      'Satır aralarındaki metaforları okuma, soyut düşünme ve LGS-YKS’de kapalı anlamlı soruları saniyeler içinde çözme yetisi kazandırır.',
    badges: [
      { text: 'Felsefi Masal', color: 'green' },
      { text: '112 Sayfa', color: 'blue' },
      { text: 'Metafor Okuma', color: 'purple' },
      { text: 'Her Yaşa Uygun', color: 'rose' },
    ],
    footerClub: 'DersoLab Kitap Kulübü',
    footerCredit: 'Yazar: Antoine de Saint-Exupéry',
    imageUrl: '/spotlight/kucuk_prens.jpg',
  },
  {
    category: 'book',
    categoryPill: 'HAFTANIN KİTABI',
    watermarkLetters: ['D', 'K'],
    title: 'Dönüşüm',
    subtitle: '(Franz Kafka, 1915)',
    ratingOrBadge: '⭐ 4.5 / 5',
    quote: '“Herkesin bir derdi var ve kimse kimsenin içindeki yükü tam olarak göremiyor.”',
    quoteSecondary: '“Zaman hızla akıp giderken, asıl cesaret kendin kalabilmektir.”',
    explanation:
      'Kafkaesk anlatımı ve sembolik diliyle zihni zorlayan, AYT Edebiyat tahlillerinde ve felsefe metinlerinde derin kavrayış sağlayan kült eser.',
    badges: [
      { text: 'Modern Klasik', color: 'green' },
      { text: '104 Sayfa', color: 'blue' },
      { text: 'Soyut Çözümleme', color: 'purple' },
      { text: 'AYT Edebiyat', color: 'rose' },
    ],
    footerClub: 'DersoLab Kitap Kulübü',
    footerCredit: 'Yazar: Franz Kafka',
    imageUrl: '/spotlight/donusum.jpg',
  },
]

/**
 * İsme veya index'e göre spotlight verisi çeker
 */
export function getCuratedSpotlight(
  category: 'motivation' | 'movie' | 'book',
  seedOrName?: string | number
): SpotlightCardData {
  if (category === 'movie') {
    const allMovies = getAllPoolMovies()
    if (typeof seedOrName === 'string' && seedOrName.trim()) {
      const q = seedOrName.toLocaleLowerCase('tr-TR').trim()
      const match = allMovies.find(
        (m) =>
          m.title.toLocaleLowerCase('tr-TR').includes(q) ||
          m.originalTitle.toLocaleLowerCase('tr-TR').includes(q)
      )
      if (match) return convertMovieToSpotlightData(match)
    }
    const idx =
      typeof seedOrName === 'number'
        ? Math.abs(seedOrName) % allMovies.length
        : Math.floor(Math.random() * allMovies.length)
    return convertMovieToSpotlightData(allMovies[idx] || allMovies[0])
  }

  const pool =
    category === 'motivation'
      ? CURATED_MOTIVATION_SPOTLIGHTS
      : CURATED_BOOK_SPOTLIGHTS

  if (typeof seedOrName === 'string' && seedOrName.trim()) {
    const q = seedOrName.toLocaleLowerCase('tr-TR').trim()
    const match = pool.find(
      (item) =>
        item.title.toLocaleLowerCase('tr-TR').includes(q) ||
        item.subtitle.toLocaleLowerCase('tr-TR').includes(q)
    )
    if (match) return match
  }

  const idx =
    typeof seedOrName === 'number'
      ? Math.abs(seedOrName) % pool.length
      : Math.floor(Math.random() * pool.length)

  return pool[idx] || pool[0]
}

/**
 * Gönderiden veya metinden spotlight kategorisini ve verisini tespit eder
 */
export function findMatchingSpotlight(text: string): SpotlightCardData | null {
  if (!text) return null
  const q = text.toLocaleLowerCase('tr-TR')

  // 1. Motivasyon
  for (const item of CURATED_MOTIVATION_SPOTLIGHTS) {
    if (q.includes(item.title.toLocaleLowerCase('tr-TR'))) return item
  }
  // 2. Film (Önce ana kürasyon, sonra 100 filmlik havuz)
  for (const item of CURATED_MOVIE_SPOTLIGHTS) {
    if (q.includes(item.title.toLocaleLowerCase('tr-TR'))) return item
  }
  const poolMovie = findMovieInPool(q)
  if (poolMovie) {
    return convertMovieToSpotlightData(poolMovie)
  }

  // 3. Kitap
  for (const item of CURATED_BOOK_SPOTLIGHTS) {
    if (q.includes(item.title.toLocaleLowerCase('tr-TR'))) return item
  }

  return null
}

export const BLACKLISTED_MOTIVATION_FIGURES: string[] = [
  'einstein',
  'albert einstein',
  'tesla',
  'nikola tesla',
  'curie',
  'marie curie',
  'cahit arf',
  'arf',
  'feynman',
  'richard feynman',
]

export function isBlacklistedFigure(name: string): boolean {
  if (!name) return false
  const q = name.toLocaleLowerCase('tr-TR')
  return BLACKLISTED_MOTIVATION_FIGURES.some((bad) => q.includes(bad))
}

/**
 * SpotlightCardData'dan tam teşekküllü SocialPostItem üretir
 */
export function createSpotlightSocialPost(
  spotlight: SpotlightCardData,
  contentType: InstagramContentType = 'story'
): SocialPostItem {
  let safeSpotlight = { ...spotlight }
  if (!safeSpotlight.imageUrl) {
    const matched = findMatchingSpotlight(safeSpotlight.title)
    if (matched?.imageUrl) {
      safeSpotlight.imageUrl = matched.imageUrl
    } else {
      const fallback = getCuratedSpotlight(safeSpotlight.category, 0)
      safeSpotlight.imageUrl = fallback.imageUrl
    }
  }

  const isMotivation = safeSpotlight.category === 'motivation'
  const isMovie = safeSpotlight.category === 'movie'

  const topic = isMotivation
    ? 'motivation'
    : isMovie
      ? 'movie_recommendation'
      : 'book_recommendation'

  const hashtags = isMotivation
    ? ['#haftaninmotivasyonu', '#dersolab', '#motivasyon', '#yks2027', '#lgs2027', '#bilim']
    : isMovie
      ? ['#haftaninfilmi', '#sinemakulübü', '#dersolab', '#filmönerisi', '#motivasyon']
      : ['#haftaninkitabi', '#kitapkulübü', '#dersolab', '#kitapönerisi', '#edebiyat']

  const caption = `${safeSpotlight.categoryPill} • ${safeSpotlight.title} ✨\n\n${safeSpotlight.quote}\n${safeSpotlight.quoteSecondary ? `${safeSpotlight.quoteSecondary}\n` : ''}\n${safeSpotlight.explanation}\n\n💡 Bu haftaki çalışma planında kendine bir soluklanma alanı aç ve ilham al!\n\n${hashtags.join(' ')}`

  return {
    id: `spotlight_${safeSpotlight.category}_${Date.now()}`,
    title: `${safeSpotlight.categoryPill}: ${safeSpotlight.title}`,
    type: contentType,
    topic,
    topicLabel: safeSpotlight.categoryPill,
    status: 'draft',
    targetAudience: 'YKS (TYT/AYT) & LGS',
    caption,
    hashtags,
    spotlightData: safeSpotlight,
    storyData: {
      badge: safeSpotlight.categoryPill,
      headline: safeSpotlight.title,
      subhead: safeSpotlight.subtitle,
      stickerType: 'none',
      themeVariant: 'lab_dark',
      uploadedImageUrl: safeSpotlight.imageUrl,
      spotlightData: safeSpotlight,
    },
    singlePostData: {
      badge: safeSpotlight.categoryPill,
      headline: safeSpotlight.title,
      questionOrSummary: safeSpotlight.subtitle,
      keyTakeaway: safeSpotlight.quote,
      themeVariant: 'lab_dark',
      uploadedImageUrl: safeSpotlight.imageUrl,
      spotlightData: safeSpotlight,
    },
    uploadedImageUrl: safeSpotlight.imageUrl,
    createdAt: new Date().toISOString(),
  }
}
