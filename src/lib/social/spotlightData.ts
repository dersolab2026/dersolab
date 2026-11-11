import type { SpotlightCardData, SocialPostItem, InstagramContentType } from '@/types/social'

export const CURATED_MOTIVATION_SPOTLIGHTS: SpotlightCardData[] = [
  {
    category: 'motivation',
    categoryPill: 'HAFTANIN MOTİVASYONU',
    watermarkLetters: ['A', 'S'],
    title: 'Aziz Sancar',
    subtitle: '(Moleküler Biyolog & Nobel Ödülü)',
    quote: '“Çoğu insan zekaya inanır, ben inanmıyorum. Bizi birbirimizden ayıran emektir, çalışmaktır.”',
    explanation:
      'Sınav başarısı bir tesadüf veya doğuştan gelen ayrıcalık değildir. Her gün düzenli masa başına geçip adım adım soru analiz eden emekçinin zaferidir.',
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
    watermarkLetters: ['İ', 'S'],
    title: 'İbn-i Sina',
    subtitle: '(Tıp & Felsefe Dehası • Avicenna)',
    quote: '“Tıp ve ilim iki şeyle beslenir: Şüphe duymak ve sabırla araştırmak.”',
    explanation:
      'Anlamadığın bir konuyu veya zor bir soruyu hemen geçme. Sorgulayarak, parçalarına ayırarak ve derinlemesine sabır göstererek her zorluğun üstesinden gelebilirsin.',
    badges: [
      { text: 'Bilimsel Merak', color: 'green' },
      { text: 'Sabırlı Analiz', color: 'blue' },
      { text: 'El-Kanun Fi’t-Tıbb', color: 'purple' },
      { text: 'Haftalık Odak', color: 'rose' },
    ],
    footerClub: 'DersoLab Rehberlik Kulübü',
    footerCredit: 'DersoLab 2026',
    imageUrl: '/spotlight/ibni_sina.jpg',
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
  {
    category: 'motivation',
    categoryPill: 'HAFTANIN MOTİVASYONU',
    watermarkLetters: ['S', 'H'],
    title: 'Stephen Hawking',
    subtitle: '(Teorik Fizikçi & Kozmolog)',
    quote: '“Zekâ, değişime ve yeni şartlara uyum sağlama yeteneğidir.”',
    explanation:
      'Denemelerde soru tarzları veya sınav kuralları zorlaştığında şikayet etmek yerine zihnini esnet. Uyum sağlayan ve stratejisini güncelleyen her zaman zirveye ulaşır.',
    badges: [
      { text: 'Evrenin Şifresi', color: 'green' },
      { text: 'Zihinsel Güç', color: 'blue' },
      { text: 'Kozmoloji', color: 'purple' },
      { text: 'Haftalık Odak', color: 'rose' },
    ],
    footerClub: 'DersoLab Rehberlik Kulübü',
    footerCredit: 'DersoLab 2026',
    imageUrl: '/spotlight/hawking.jpg',
  },
  {
    category: 'motivation',
    categoryPill: 'HAFTANIN MOTİVASYONU',
    watermarkLetters: ['C', 'S'],
    title: 'Carl Sagan',
    subtitle: '(Astronom & Bilim İletişimcisi)',
    quote: '“Bir yerlerde inanılmaz bir şey, senin onu keşfetmeni bekliyor.”',
    explanation:
      'Ders çalışmayı zorunlu bir külfet değil, evrenin ve bilginin sırlarını açan bir keşif yolculuğu olarak gör. Merak ettiğin an öğrenmek en büyük tutkun olur.',
    badges: [
      { text: 'Evrensel Merak', color: 'green' },
      { text: 'Cosmos', color: 'blue' },
      { text: 'Bilim Aşkı', color: 'purple' },
      { text: 'Haftalık Odak', color: 'rose' },
    ],
    footerClub: 'DersoLab Rehberlik Kulübü',
    footerCredit: 'DersoLab 2026',
    imageUrl: '/spotlight/sagan.jpg',
  },
  {
    category: 'motivation',
    categoryPill: 'HAFTANIN MOTİVASYONU',
    watermarkLetters: ['I', 'N'],
    title: 'Isaac Newton',
    subtitle: '(Klasik Mekaniğin Kurucusu & Matematikçi)',
    quote: '“Daha ileriyi görebildiysem, bu devlerin omuzlarında durduğum içindir.”',
    explanation:
      'Hocalarından, soru çözümlerinden ve daha önce başarmış kişilerin yöntemlerinden ilham al. Doğru rehberlik ve metodolojiyle çözülemeyecek formül yoktur.',
    badges: [
      { text: 'Hareket Yasaları', color: 'green' },
      { text: 'Matematik & Analiz', color: 'blue' },
      { text: 'Büyük Odak', color: 'purple' },
      { text: 'Haftalık Odak', color: 'rose' },
    ],
    footerClub: 'DersoLab Rehberlik Kulübü',
    footerCredit: 'DersoLab 2026',
    imageUrl: '/spotlight/newton.jpg',
  },
  {
    category: 'motivation',
    categoryPill: 'HAFTANIN MOTİVASYONU',
    watermarkLetters: ['M', 'S'],
    title: 'Mimar Sinan',
    subtitle: '(Başmimar & Geometri Dehası)',
    quote: '“Yaptığın işi gönlünde hissedersen, taşlar bile sana sırrını fısıldar.”',
    explanation:
      'Günü kurtarmak için değil, sağlam temeller üzerine kalıcı bilgi inşa etmek için çalış. Geometri ve matematiğin sabrı, hayallerinin mimarı olmanı sağlar.',
    badges: [
      { text: 'Mimari Deha', color: 'green' },
      { text: 'Kusursuz Statik', color: 'blue' },
      { text: 'Sabır & Emek', color: 'purple' },
      { text: 'Haftalık Odak', color: 'rose' },
    ],
    footerClub: 'DersoLab Rehberlik Kulübü',
    footerCredit: 'DersoLab 2026',
    imageUrl: '/spotlight/mimar_sinan.jpg',
  },
  {
    category: 'motivation',
    categoryPill: 'HAFTANIN MOTİVASYONU',
    watermarkLetters: ['A', 'K'],
    title: 'Ali Kuşçu',
    subtitle: '(Astronom & Matematikçi)',
    quote: '“Gökleri anlamak, insanın yeryüzündeki cehaletini yenmesiyle başlar.”',
    explanation:
      'Zor konuların karşısında küçülme; zihnini evrenin genişliğine aç. Sayıların ve gök cisimlerinin düzeni, disiplinli çalışan bir zihne asla kapı kapatmaz.',
    badges: [
      { text: 'Gökbilim & Rasat', color: 'green' },
      { text: 'Semerkant Mirası', color: 'blue' },
      { text: 'Analitik Disiplin', color: 'purple' },
      { text: 'Haftalık Odak', color: 'rose' },
    ],
    footerClub: 'DersoLab Rehberlik Kulübü',
    footerCredit: 'DersoLab 2026',
    imageUrl: '/spotlight/ali_kuscu.jpg',
  },
]

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
    watermarkLetters: ['H', 'Ö'],
    title: 'Her Çocuk Özeldir',
    subtitle: '(Taare Zameen Par, 2007)',
    ratingOrBadge: '⭐ 8.3 / 10',
    quote: '“Her çocuğun kendi ritmi ve dünyası vardır; önemli olan onu anlayacak sevgiyle bakmaktır.”',
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
  {
    category: 'movie',
    categoryPill: 'HAFTANIN FİLMİ',
    watermarkLetters: ['K', 'N'],
    title: 'Kör Nokta',
    subtitle: '(The Blind Side, 2009)',
    ratingOrBadge: '⭐ 7.6 / 10',
    quote: '“Fırsat verildiğinde ve bir insan sana inandığında, geçmişin hiçbir önemi kalmaz.”',
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
  },
  {
    category: 'movie',
    categoryPill: 'HAFTANIN FİLMİ',
    watermarkLetters: ['K', 'K'],
    title: 'Kralın Konuşması',
    subtitle: "(The King's Speech, 2010)",
    ratingOrBadge: '⭐ 8.0 / 10',
    quote: '“En büyük zafer, kendi içindeki korkuyu ve tereddüdü yendiğin andır.”',
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
