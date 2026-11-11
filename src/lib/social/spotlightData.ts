import type { SpotlightCardData, SocialPostItem, InstagramContentType } from '@/types/social'

export const CURATED_MOTIVATION_SPOTLIGHTS: SpotlightCardData[] = [
  {
    category: 'motivation',
    categoryPill: 'HAFTANIN MOTİVASYONU',
    watermarkLetters: ['R', 'F'],
    title: 'Richard Feynman',
    subtitle: '(Teorik Fizikçi & Nobel Ödülü)',
    quote: '“Önemli olan bir şeyin adını bilmek değil, onu gerçekten anlamaktır.”',
    explanation:
      'Ezberlemek yorar, anlamak özgürleştirir. Bu hafta çözemediğin her soruyu bir engel değil, konuyu derinlemesine keşfetme fırsatı olarak gör.',
    badges: [
      { text: 'Feynman Tekniği', color: 'green' },
      { text: 'Aktif Öğrenme', color: 'blue' },
      { text: 'Merak', color: 'purple' },
      { text: 'Motivasyon', color: 'rose' },
    ],
    footerClub: 'DersoLab Rehberlik Kulübü',
    footerCredit: 'DersoLab 2026',
    imageUrl: '/spotlight/feynman_portrait.jpg',
  },
  {
    category: 'motivation',
    categoryPill: 'HAFTANIN MOTİVASYONU',
    watermarkLetters: ['A', 'E'],
    title: 'Albert Einstein',
    subtitle: '(Teorik Fizikçi & Nobel Ödülü)',
    quote: '“Hiç hata yapmamış bir insan, yeni hiçbir şey denememiş demektir.”',
    explanation:
      'Denemelerde yaptığın hatalar bir eksiklik değil, öğrenmenin en değerli basamaklarıdır. Bu hafta yanlışlarından korkma, onları analiz ederek gelişime dönüştür.',
    badges: [
      { text: 'Gelişim Zihniyeti', color: 'green' },
      { text: 'Hata Analizi', color: 'blue' },
      { text: 'Pes Etmemek', color: 'purple' },
      { text: 'Haftalık Odak', color: 'rose' },
    ],
    footerClub: 'DersoLab Rehberlik Kulübü',
    footerCredit: 'DersoLab 2026',
    imageUrl: '/spotlight/einstein_portrait.jpg',
  },
  {
    category: 'motivation',
    categoryPill: 'HAFTANIN MOTİVASYONU',
    watermarkLetters: ['C', 'A'],
    title: 'Cahit Arf',
    subtitle: '(Matematikçi & Bilim İnsanı)',
    quote: '“Matematik esas olarak sabır olayıdır. Ezberleyerek değil, keşfederek anlamak gerekir.”',
    explanation:
      'Zor bir problemle karşılaştığında hemen vazgeçme. Başarı, ezberlenmiş formüllerde değil; sabırla denemekte ve mantığını kavramakta saklıdır.',
    badges: [
      { text: 'Sabır & Emek', color: 'green' },
      { text: 'Analitik Düşünce', color: 'blue' },
      { text: 'Keşfederek Öğrenme', color: 'purple' },
      { text: 'Haftalık Odak', color: 'rose' },
    ],
    footerClub: 'DersoLab Rehberlik Kulübü',
    footerCredit: 'DersoLab 2026',
    imageUrl: '/spotlight/cahit_arf_portrait.jpg',
  },
  {
    category: 'motivation',
    categoryPill: 'HAFTANIN MOTİVASYONU',
    watermarkLetters: ['M', 'C'],
    title: 'Marie Curie',
    subtitle: '(Fizikçi & Kimyager, 2 Nobel Ödülü)',
    quote: '“Hayatta hiçbir şeyden korkulmamalıdır, sadece anlaşılmalıdır. Şimdi daha çok anlama zamanı.”',
    explanation:
      'Zor konuların ve karmaşık formüllerin seni korkutmasına izin verme. Sabırla ve merakla üzerine gittiğinde, her bilinmeyenin çözülebilir olduğunu göreceksin.',
    badges: [
      { text: 'Azim & Sabır', color: 'green' },
      { text: 'Merak Tutkusu', color: 'blue' },
      { text: 'Bilimsel Düşünce', color: 'purple' },
      { text: 'Haftalık Odak', color: 'rose' },
    ],
    footerClub: 'DersoLab Rehberlik Kulübü',
    footerCredit: 'DersoLab 2026',
    imageUrl: '/spotlight/curie_portrait.jpg',
  },
  {
    category: 'motivation',
    categoryPill: 'HAFTANIN MOTİVASYONU',
    watermarkLetters: ['N', 'T'],
    title: 'Nikola Tesla',
    subtitle: '(Elektrik Mühendisi & Büyük Mucit)',
    quote: '“Gelecek gerçeği gösterecek ve herkesi eserine ve değerine göre yargılayacaktır.”',
    explanation:
      'Bugün gösterdiğin sessiz çabanın karşılığını hemen göremesen de asla pes etme. Emek verilen hiçbir bilgi ve disiplin kaybolmaz; zamanı geldiğinde ışık saçar.',
    badges: [
      { text: 'Vizyoner Zihin', color: 'green' },
      { text: 'Üretkenlik', color: 'blue' },
      { text: 'Odak & Disiplin', color: 'purple' },
      { text: 'Haftalık Odak', color: 'rose' },
    ],
    footerClub: 'DersoLab Rehberlik Kulübü',
    footerCredit: 'DersoLab 2026',
    imageUrl: '/spotlight/tesla.jpg',
  },
  {
    category: 'motivation',
    categoryPill: 'HAFTANIN MOTİVASYONU',
    watermarkLetters: ['A', 'S'],
    title: 'Aziz Sancar',
    subtitle: '(Moleküler Biyolog & Nobel Ödülü)',
    quote: '“Çoğu insan zekaya inanır, ben inanmıyorum. Bizi birbirimizden ayıran emektir, çalışmaktır.”',
    explanation:
      'Sınav başarısı tesadüf veya doğuştan gelen ayrıcalık değildir. Her gün düzenli masa başına geçip adım adım soru analiz eden emekçinin zaferidir.',
    badges: [
      { text: 'Çalışma Disiplini', color: 'green' },
      { text: 'DNA Onarımı', color: 'blue' },
      { text: 'Azim & Kararlılık', color: 'purple' },
      { text: 'Haftalık Odak', color: 'rose' },
    ],
    footerClub: 'DersoLab Rehberlik Kulübü',
    footerCredit: 'DersoLab 2026',
    imageUrl: '/spotlight/aziz_sancar.jpg',
  },
  {
    category: 'motivation',
    categoryPill: 'HAFTANIN MOTİVASYONU',
    watermarkLetters: ['A', 'T'],
    title: 'Alan Turing',
    subtitle: '(Matematikçi & Bilgisayar Biliminin Babası)',
    quote: '“Bazen hiç kimsenin hayal edemediği şeyleri, hiç kimsenin beklemediği insanlar yapar.”',
    explanation:
      'Kendine olan inancını asla kaybetme. Netlerin bugün istediğin seviyede olmasa bile doğru strateji, sabır ve azimle hedefini fethedebilirsin.',
    badges: [
      { text: 'Algoritmik Zihin', color: 'green' },
      { text: 'Kriptoloji', color: 'blue' },
      { text: 'Problem Çözme', color: 'purple' },
      { text: 'Haftalık Odak', color: 'rose' },
    ],
    footerClub: 'DersoLab Rehberlik Kulübü',
    footerCredit: 'DersoLab 2026',
    imageUrl: '/spotlight/turing.jpg',
  },
  {
    category: 'motivation',
    categoryPill: 'HAFTANIN MOTİVASYONU',
    watermarkLetters: ['M', 'A'],
    title: 'Marcus Aurelius',
    subtitle: '(Filozof & Roma İmparatoru)',
    quote: '“Zihnini kontrol et, dış olayları değil. Bunu anladığında gerçek gücünü bulacaksın.”',
    explanation:
      'Sınav stresini ve sonuç kaygısını büyütmek yerine sadece bugün çalışabileceğin saatlere ve çözeceğin sorulara odaklan. Stoacı sükunet sana kazandırır.',
    badges: [
      { text: 'Stoacı Felsefe', color: 'green' },
      { text: 'Zihin Kontrolü', color: 'blue' },
      { text: 'Sınav Sakinliği', color: 'purple' },
      { text: 'Haftalık Odak', color: 'rose' },
    ],
    footerClub: 'DersoLab Rehberlik Kulübü',
    footerCredit: 'DersoLab 2026',
    imageUrl: '/spotlight/aurelius.jpg',
  },
]

export const CURATED_MOVIE_SPOTLIGHTS: SpotlightCardData[] = [
  {
    category: 'movie',
    categoryPill: 'HAFTANIN FİLMİ',
    watermarkLetters: ['U', 'P'],
    title: 'Yukarı Bak',
    subtitle: '(Up, 2009)',
    ratingOrBadge: '⭐ 8.3 / 10',
    quote: '“Macera dışarıda bir yerde!”',
    quoteSecondary: '“Hayallerin peşinden gitmek için hiçbir yaş geç değil.”',
    explanation:
      'Eşine verdiği çocukluk sözünü tutmak için evini binlerce renkli balonla gökyüzüne havalandıran Carl Fredricksen ile neşeli izci Russell’ın Cennet Şelalesi serüveni. Gerçek maceranın sevdiklerimizle paylaşılan anlar olduğunu anlatan yürek ısıtan bir başyapıt.',
    badges: [
      { text: '2 Oscar Ödüllü', color: 'green' },
      { text: '96 Dakika', color: 'blue' },
      { text: 'Aile & Macera', color: 'purple' },
      { text: 'Pixar Animasyon', color: 'rose' },
    ],
    footerClub: 'DersoLab Sinema Kulübü',
    footerCredit: 'Yönetmen: Pete Docter • Bob Peterson',
    imageUrl: '/spotlight/up_movie.jpg',
  },
  {
    category: 'movie',
    categoryPill: 'HAFTANIN FİLMİ',
    watermarkLetters: ['I', 'S'],
    title: 'Yıldızlararası',
    subtitle: '(Interstellar, 2014)',
    ratingOrBadge: '⭐ 8.7 / 10',
    quote: '“Korku insanı sınırlarken sevgi, merak ve bilim boyutları aşar.”',
    explanation:
      'Kuantum kütleçekimi, solucan delikleri ve zaman genişlemesi kavramlarını modern astrofizik temelleriyle somutlaştıran, insanın sınırlarını aşma azmini anlatan bir sinema mucizesi.',
    badges: [
      { text: 'Oscar Ödüllü', color: 'green' },
      { text: '169 Dakika', color: 'blue' },
      { text: 'Astrofizik & Bilim', color: 'purple' },
      { text: 'Christopher Nolan', color: 'rose' },
    ],
    footerClub: 'DersoLab Sinema Kulübü',
    footerCredit: 'Yönetmen: Christopher Nolan',
    imageUrl: '/spotlight/interstellar.jpg',
  },
  {
    category: 'movie',
    categoryPill: 'HAFTANIN FİLMİ',
    watermarkLetters: ['G', 'W'],
    title: 'Can Dostum',
    subtitle: '(Good Will Hunting, 1997)',
    ratingOrBadge: '⭐ 8.3 / 10',
    quote: '“Gerçek başarı, sahip olduğun potansiyeli korkularının önüne geçirebilmektir.”',
    explanation:
      'M.I.T.’de hademelik yapan bir matematik dehasının geçmiş korkularıyla yüzleşip hayatına yön verme serüveni. Potansiyelini keşfetmek ve rehberliğin gücünü anlamak isteyen her gence ilham verir.',
    badges: [
      { text: '2 Oscar Ödüllü', color: 'green' },
      { text: '126 Dakika', color: 'blue' },
      { text: 'Matematik & Psikoloji', color: 'purple' },
      { text: 'Gus Van Sant', color: 'rose' },
    ],
    footerClub: 'DersoLab Sinema Kulübü',
    footerCredit: 'Yönetmen: Gus Van Sant • Robin Williams',
  },
  {
    category: 'movie',
    categoryPill: 'HAFTANIN FİLMİ',
    watermarkLetters: ['D', 'P'],
    title: 'Ölü Ozanlar Derneği',
    subtitle: '(Dead Poets Society, 1989)',
    ratingOrBadge: '⭐ 8.1 / 10',
    quote: '“Carpe Diem! Anı yakalayın çocuklar, hayatınızı olağanüstü kılın.”',
    explanation:
      'Ezberci kalıpları yıkan edebiyat öğretmeni John Keating’in öğrencilerine kendi seslerini bulmayı, sorgulamayı ve hayata tutkuyla sarılmayı öğrettiği eşsiz bir sinema klasiği.',
    badges: [
      { text: 'Oscar Ödüllü', color: 'green' },
      { text: '128 Dakika', color: 'blue' },
      { text: 'Edebiyat & İlham', color: 'purple' },
      { text: 'Kült Klasik', color: 'rose' },
    ],
    footerClub: 'DersoLab Sinema Kulübü',
    footerCredit: 'Yönetmen: Peter Weir • Robin Williams',
  },
  {
    category: 'movie',
    categoryPill: 'HAFTANIN FİLMİ',
    watermarkLetters: ['A', 'B'],
    title: 'Akıl Oyunları',
    subtitle: '(A Beautiful Mind, 2001)',
    ratingOrBadge: '⭐ 8.2 / 10',
    quote: '“Her zorluğun üstesinden gelen tek formül: Sebat ve inançtır.”',
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
  },
  {
    category: 'movie',
    categoryPill: 'HAFTANIN FİLMİ',
    watermarkLetters: ['W', 'P'],
    title: 'Whiplash',
    subtitle: '(Whiplash, 2014)',
    ratingOrBadge: '⭐ 8.5 / 10',
    quote: '“İngiliz dilindeki en zararlı iki kelime şudur: ‘Aferin, yeterli.’ ”',
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
  const pool =
    category === 'motivation'
      ? CURATED_MOTIVATION_SPOTLIGHTS
      : category === 'movie'
        ? CURATED_MOVIE_SPOTLIGHTS
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
  // 2. Film
  for (const item of CURATED_MOVIE_SPOTLIGHTS) {
    if (q.includes(item.title.toLocaleLowerCase('tr-TR'))) return item
  }
  // 3. Kitap
  for (const item of CURATED_BOOK_SPOTLIGHTS) {
    if (q.includes(item.title.toLocaleLowerCase('tr-TR'))) return item
  }

  return null
}

/**
 * SpotlightCardData'dan tam teşekküllü SocialPostItem üretir
 */
export function createSpotlightSocialPost(
  spotlight: SpotlightCardData,
  contentType: InstagramContentType = 'story'
): SocialPostItem {
  const isMotivation = spotlight.category === 'motivation'
  const isMovie = spotlight.category === 'movie'

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

  const caption = `${spotlight.categoryPill} • ${spotlight.title} ✨\n\n${spotlight.quote}\n${spotlight.quoteSecondary ? `${spotlight.quoteSecondary}\n` : ''}\n${spotlight.explanation}\n\n💡 Bu haftaki çalışma planında kendine bir soluklanma alanı aç ve ilham al!\n\n${hashtags.join(' ')}`

  return {
    id: `spotlight_${spotlight.category}_${Date.now()}`,
    title: `${spotlight.categoryPill}: ${spotlight.title}`,
    type: contentType,
    topic,
    topicLabel: spotlight.categoryPill,
    status: 'draft',
    targetAudience: 'YKS (TYT/AYT) & LGS',
    caption,
    hashtags,
    spotlightData: spotlight,
    storyData: {
      badge: spotlight.categoryPill,
      headline: spotlight.title,
      subhead: spotlight.subtitle,
      stickerType: 'none',
      themeVariant: 'lab_dark',
      uploadedImageUrl: spotlight.imageUrl,
      spotlightData: spotlight,
    },
    singlePostData: {
      badge: spotlight.categoryPill,
      headline: spotlight.title,
      questionOrSummary: spotlight.subtitle,
      keyTakeaway: spotlight.quote,
      themeVariant: 'lab_dark',
      uploadedImageUrl: spotlight.imageUrl,
      spotlightData: spotlight,
    },
    uploadedImageUrl: spotlight.imageUrl,
    createdAt: new Date().toISOString(),
  }
}
