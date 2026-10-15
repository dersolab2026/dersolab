'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Volume2,
  VolumeX,
  BookOpen,
  MessageSquare,
  Lightbulb,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Coffee,
  Plane,
  Briefcase,
  Building2,
  MapPin,
  Stethoscope,
  GraduationCap,
  UtensilsCrossed,
  ArrowRight,
  Eye,
  EyeOff,
  Flame,
} from 'lucide-react'
import { playSpeech, EnglishAccent } from './speechHelper'

interface VocabItem {
  word: string
  phonetic: string
  type: string
  meaning: string
  example: string
  collocation?: string
}

interface PhraseItem {
  phrase: string
  meaning: string
  tone: 'Casual' | 'Formal' | 'Polite' | 'Urgent'
  usageNote: string
}

interface DialogueLine {
  speaker: string
  role: string
  avatar: string
  text: string
  translation: string
}

interface Scenario {
  id: string
  title: string
  turkishTitle: string
  icon: React.ElementType
  category: string
  cefrLevel: 'A1-A2 (Temel)' | 'A2-B1 (Temel-Orta)' | 'B1-B2 (Orta-İleri)'
  description: string
  vocab: VocabItem[]
  phrases: PhraseItem[]
  dialogue: DialogueLine[]
  grammarTip: {
    ruleTitle: string
    dontSay: string
    sayInstead: string
    explanation: string
    maarifRule: string
  }
  challenge: {
    question: string
    options: string[]
    correctIndex: number
    explanation: string
  }
}

const SCENARIOS: Scenario[] = [
  {
    id: 'coffee-shop',
    title: 'Ordering at a Specialty Café',
    turkishTitle: 'Kahve Siparişi & Tercihler',
    icon: Coffee,
    category: 'Günlük Hayat',
    cefrLevel: 'A1-A2 (Temel)',
    description:
      'Özel kahve siparişi verme, süt alternatifleri (oat/almond milk), sipariş boyutu ve paket/burada tüketim diyalogları.',
    vocab: [
      {
        word: 'Decaf',
        phonetic: '/ˈdiː.kæf/',
        type: 'adj. / n.',
        meaning: 'Kafeinsiz kahve',
        example: 'Could I get a decaf Americano with oat milk?',
        collocation: 'decaf espresso / decaf latte',
      },
      {
        word: 'To stay or to go?',
        phonetic: '/tə steɪ ɔːr tə ɡoʊ/',
        type: 'phrase',
        meaning: 'Burada mı içeceksiniz, paket mi?',
        example: '“For here or to go?” — “To go, please.”',
        collocation: 'takeaway / for here',
      },
      {
        word: 'On the house',
        phonetic: '/ɒn ðə haʊs/',
        type: 'idiom',
        meaning: 'Müesseseden / ikram',
        example: 'Here is a cookie on the house!',
        collocation: 'drinks on the house',
      },
      {
        word: 'Skim milk',
        phonetic: '/skɪm mɪlk/',
        type: 'noun',
        meaning: 'Yağsız süt (İngiltere: skimmed milk)',
        example: 'Do you have skim milk or almond milk?',
        collocation: 'semi-skimmed / whole milk',
      },
    ],
    phrases: [
      {
        phrase: 'Could I get a flat white with oat milk, please?',
        meaning: 'Yulaf sütlü bir flat white alabilir miyim lütfen?',
        tone: 'Polite',
        usageNote: 'Doğal sipariş verirken "I want..." kaba kaçar; "Could I get..." veya "I\'d like..." en doğal kalıptır.',
      },
      {
        phrase: 'Can you make that an extra hot, please?',
        meaning: 'Lütfen ekstra sıcak hazırlayabilir misiniz?',
        tone: 'Polite',
        usageNote: 'Kahvenin sıcaklığını belirtirken pratik bir baristanın favori kalıbı.',
      },
      {
        phrase: 'Keep the change!',
        meaning: 'Üstü kalsın!',
        tone: 'Casual',
        usageNote: 'Bahşiş bırakırken veya para üstünü almak istemediğinizde söylenir.',
      },
    ],
    dialogue: [
      {
        speaker: 'Barista (Sam)',
        role: 'Kahve Baristası',
        avatar: '☕',
        text: 'Morning! What can I get started for you today?',
        translation: 'Günaydın! Bugün sizin için ne hazırlayayım?',
      },
      {
        speaker: 'You (Alex)',
        role: 'Müşteri',
        avatar: '🧑',
        text: 'Hi! Could I please get an iced oat latte with a shot of vanilla?',
        translation: 'Merhaba! Bir vanilya şuruplu soğuk yulaf latte alabilir miyim lütfen?',
      },
      {
        speaker: 'Barista (Sam)',
        role: 'Kahve Baristası',
        avatar: '☕',
        text: 'Sure thing! Small, medium, or large? And is that for here or to go?',
        translation: 'Tabii ki! Küçük, orta mı yoksa büyük boy mu? Ve burada mı içeceksiniz paket mi?',
      },
      {
        speaker: 'You (Alex)',
        role: 'Müşteri',
        avatar: '🧑',
        text: 'Medium, to go please. Also, can you do that decaf?',
        translation: 'Orta boy, paket lütfen. Bir de kafeinsiz yapabilir misiniz?',
      },
      {
        speaker: 'Barista (Sam)',
        role: 'Kahve Baristası',
        avatar: '☕',
        text: 'You got it! That’ll be £4.50. You can tap your card whenever you’re ready.',
        translation: 'Hemen hallediyorum! 4.50 Pound tuttu. Hazır olduğunuzda kartınızı okutabilirsiniz.',
      },
    ],
    grammarTip: {
      ruleTitle: 'Kibar İsteklerde "I want" Tuzak Kalıbı',
      dontSay: 'I want a coffee and give me sugar.',
      sayInstead: 'Could I please get a coffee with two sugars? / I\'d like a coffee, please.',
      explanation:
        'İngilizcede "I want" doğrudan emir kipi gibi algılanır ve kabalık sayılabilir. Restoran, kafe ve mağazalarda "Could I get...", "Can I have..." veya "I\'d like..." yapıları kullanılır.',
      maarifRule: 'MEB 7-9. Sınıf: Polite requests with modals (Could / Would like)',
    },
    challenge: {
      question: 'Bir kafede paket kahve almak istediğinizi en doğal şekilde nasıl ifade edersiniz?',
      options: [
        'I want to take this coffee to my house immediately.',
        'To go, please. / Takeaway, please.',
        'Give me the coffee outside the cafe.',
        'Make coffee and bring it fast.',
      ],
      correctIndex: 1,
      explanation:
        'Amerikan İngilizcesinde "To go, please", İngiliz İngilizcesinde "Takeaway, please" standart ve en kibar kalıptır.',
    },
  },
  {
    id: 'airport-lost-luggage',
    title: 'Airport Check-in & Lost Luggage',
    turkishTitle: 'Havalimanı & Kayıp Bagaj Masası',
    icon: Plane,
    category: 'Seyahat',
    cefrLevel: 'B1-B2 (Orta-İleri)',
    description:
      'Pasaport kontrolü, aktarmalı uçuşlar (layover), bagaj bandında bavul çıkmaması ve kayıp eşya tutanağı tutturma.',
    vocab: [
      {
        word: 'Boarding pass',
        phonetic: '/ˈbɔː.dɪŋ ˌpɑːs/',
        type: 'noun',
        meaning: 'Uçağa biniş kartı',
        example: 'Please have your passport and boarding pass ready.',
        collocation: 'digital boarding pass / gate closing',
      },
      {
        word: 'Layover',
        phonetic: '/ˈleɪˌoʊ.vər/',
        type: 'noun',
        meaning: 'Aktarma süresi / mola',
        example: 'I have a 3-hour layover in Frankfurt before my connection.',
        collocation: 'long layover / connecting flight',
      },
      {
        word: 'Baggage claim',
        phonetic: '/ˈbæɡ.ɪdʒ kleɪm/',
        type: 'noun',
        meaning: 'Bagaj teslim alanı / bavul bandı',
        example: 'Head down to Carousel 4 at baggage claim.',
        collocation: 'carousel / lost luggage desk',
      },
      {
        word: 'Overhead bin',
        phonetic: '/ˈoʊ.vɚ.hed bɪn/',
        type: 'noun',
        meaning: 'Koltuk üstü el bagajı dolabı',
        example: 'Please place your carry-on in the overhead bin.',
        collocation: 'carry-on luggage / stowed under seat',
      },
    ],
    phrases: [
      {
        phrase: 'My luggage hasn’t arrived on the carousel. Where can I file a claim?',
        meaning: 'Bavulum bantta çıkmadı. Nereden kayıp bildirimi yapabilirim?',
        tone: 'Urgent',
        usageNote: 'Bagaj teslim masasında sorun bildirmek için anahtar cümle.',
      },
      {
        phrase: 'Is this flight non-stop or do we have a connection?',
        meaning: 'Bu uçuş direkt mi yoksa aktarmalı mı?',
        tone: 'Polite',
        usageNote: 'Uçuş detaylarını kontrol ederken kullanılır.',
      },
      {
        phrase: 'Could I get an aisle seat instead of a window seat?',
        meaning: 'Cam kenarı yerine koridor kenarı koltuk alabilir miyim?',
        tone: 'Polite',
        usageNote: 'Check-in sırasında koltuk tercihi belirtme.',
      },
    ],
    dialogue: [
      {
        speaker: 'Ground Staff (Elena)',
        role: 'Yer Hizmetleri Memuru',
        avatar: '🧳',
        text: 'Lost Baggage Services, how can I help you today?',
        translation: 'Kayıp Eşya Hizmetleri, size nasıl yardımcı olabilirim?',
      },
      {
        speaker: 'Traveler (John)',
        role: 'Yolcu',
        avatar: '🧑‍💼',
        text: 'Hi, I just arrived on flight TK1984 from Istanbul, but my checked suitcase didn\'t appear on belt 3.',
        translation: 'Merhaba, İstanbul\'dan TK1984 seferiyle yeni indim ama teslim ettiğim valizim 3 nolu bantta çıkmadı.',
      },
      {
        speaker: 'Ground Staff (Elena)',
        role: 'Yer Hizmetleri Memuru',
        avatar: '🧳',
        text: 'I’m sorry to hear that. Do you have your baggage tag receipt attached to your boarding pass?',
        translation: 'Bunu duyduğuma üzüldüm. Biniş kartınıza iliştirilmiş bagaj fişiniz yanınızda mı?',
      },
      {
        speaker: 'Traveler (John)',
        role: 'Yolcu',
        avatar: '🧑‍💼',
        text: 'Yes, here it is. It’s a navy blue hard-shell Samsonite suitcase with a red luggage tag.',
        translation: 'Evet, buyrun. Lacivert, sert kapaklı Samsonite bir valiz ve üzerinde kırmızı bir bagaj etiketi var.',
      },
      {
        speaker: 'Ground Staff (Elena)',
        role: 'Yer Hizmetleri Memuru',
        avatar: '🧳',
        text: 'Great, I see it in the tracking system. It missed the tight connection in Munich, but it will be delivered to your hotel tonight.',
        translation: 'Harika, takip sisteminde görüyorum. Münih\'teki kısa aktarmayı kaçırmış ancak bu gece otelinize teslim edilecek.',
      },
    ],
    grammarTip: {
      ruleTitle: 'Present Perfect ile "Just" ve "Already" Zaman Zarfları',
      dontSay: 'I just arrive and my bag didn’t come yet.',
      sayInstead: 'I have just arrived and my luggage hasn\'t shown up yet.',
      explanation:
        'Yeni tamamlanan eylemler ve etkisi halen devam eden güncel durumlar için Present Perfect (have/has + V3) ve "yet" (henüz) kullanılır.',
      maarifRule: 'MEB 9-11. Sınıf & YDT: Present Perfect Tense vs Past Simple',
    },
    challenge: {
      question: 'Koridor kenarı koltuk istemek için hangi ifade doğrudur?',
      options: [
        'Could I have an aisle seat, please?',
        'Give me the corridor chair now.',
        'I want to sit in the road of plane.',
        'Make me sit beside the door.',
      ],
      correctIndex: 0,
      explanation:
        'İngilizcede uçak koridoru "aisle" (/aɪl/ okunur, s harfi okunmaz) kelimesi ile ifade edilir.',
    },
  },
  {
    id: 'job-interview',
    title: 'Job Interview & Highlighting Strengths',
    turkishTitle: 'İş Mülakatı & Güçlü Yönleri Anlatma',
    icon: Briefcase,
    category: 'Kariyer & Dil',
    cefrLevel: 'B1-B2 (Orta-İleri)',
    description:
      'Özgeçmiş özetleme, STAR tekniği ile başarı örneği verme ve maaş/yan haklar hakkında profesyonel sorular sorma.',
    vocab: [
      {
        word: 'Track record',
        phonetic: '/ˈtræk ˌrek.ɔːd/',
        type: 'noun',
        meaning: 'Geçmiş başarı performansı / kariyer sicili',
        example: 'I have a proven track record in software product development.',
        collocation: 'proven track record of success',
      },
      {
        word: 'Proactive',
        phonetic: '/prəʊˈæk.tɪv/',
        type: 'adj.',
        meaning: 'İnisiyatif alan / önceden harekete geçen',
        example: 'I take a proactive approach to solving bottlenecks.',
        collocation: 'proactive mindset / proactive measures',
      },
      {
        word: 'Deliverable',
        phonetic: '/dɪˈlɪv.ər.ə.bəl/',
        type: 'noun',
        meaning: 'Teslim edilecek iş / proje çıktısı',
        example: 'Our team consistently met every key deliverable on time.',
        collocation: 'key deliverables / project milestones',
      },
      {
        word: 'Cross-functional',
        phonetic: '/ˌkrɒsˈfʌŋk.ʃən.əl/',
        type: 'adj.',
        meaning: 'Farklı departmanlar arası (disiplinler arası)',
        example: 'I worked closely with cross-functional teams including design and marketing.',
        collocation: 'cross-functional collaboration',
      },
    ],
    phrases: [
      {
        phrase: 'I pride myself on my ability to stay calm under tight deadlines.',
        meaning: 'Dar teslim sürelerinde soğukkanlı kalabilme yeteneğimle gurur duyarım.',
        tone: 'Formal',
        usageNote: 'Güçlü yönlerinizi kibirli olmadan profesyonelce sunar.',
      },
      {
        phrase: 'Could you tell me more about the day-to-day responsibilities of this role?',
        meaning: 'Bu pozisyonun günlük sorumlulukları hakkında biraz daha bilgi verebilir misiniz?',
        tone: 'Formal',
        usageNote: 'Mülakatın sonunda adayın şirkete soru sorma hakkı doğduğunda en ideal soru.',
      },
      {
        phrase: 'What does success look like in the first 90 days?',
        meaning: 'İlk 90 günde başarı sizin için ne anlama geliyor?',
        tone: 'Formal',
        usageNote: 'Etkileyici ve vizyoner bir aday sorusu.',
      },
    ],
    dialogue: [
      {
        speaker: 'Interviewer (Sarah)',
        role: 'İK Yöneticisi',
        avatar: '👩‍💼',
        text: 'Tell me about a time you faced an unexpected roadblock on a project.',
        translation: 'Bana bir projede beklenmedik bir engelle karşılaştığınız bir andan bahseder misiniz?',
      },
      {
        speaker: 'Candidate (David)',
        role: 'Aday',
        avatar: '👨‍💻',
        text: 'Certainly. When our backend API failed two days before launch, I quickly organized a huddle with the lead engineers to isolate the bug.',
        translation: 'Elbette. Lansmandan iki gün önce backend API\'mız çöktüğünde, hatayı izole etmek için baş mühendislerle hızlıca bir durum toplantısı organize ettim.',
      },
      {
        speaker: 'Interviewer (Sarah)',
        role: 'İK Yöneticisi',
        avatar: '👩‍💼',
        text: 'Impressive response. How did you communicate the delay to stakeholders?',
        translation: 'Etkileyici bir tepki. Gecikmeyi paydaşlara nasıl ilettiniz?',
      },
      {
        speaker: 'Candidate (David)',
        role: 'Aday',
        avatar: '👨‍💻',
        text: 'I kept them updated transparently every 3 hours with realistic delivery timelines, and we launched only 12 hours behind schedule without data loss.',
        translation: 'Onları her 3 saatte bir gerçekçi teslimat zaman çizelgeleriyle şeffaf şekilde bilgilendirdim ve veri kaybı olmadan takvimin sadece 12 saat gerisinde lansmanı yaptık.',
      },
    ],
    grammarTip: {
      ruleTitle: 'STAR Metodu ile Geçmiş Başarıları Anlatırken Doğru Zaman Kipi',
      dontSay: 'I am doing the project and we fix the bug.',
      sayInstead: 'When we encountered the bug, we analyzed the root cause and deployed a hotfix.',
      explanation:
        'Mülakatlarda belirli bir geçmiş olay anlatılırken daima Past Simple (-ed ve düzensiz fiil 2. halleri) kullanılmalıdır.',
      maarifRule: 'MEB 10-12. Sınıf & YDT: Narrative Tenses & Past Simple vs Continuous',
    },
    challenge: {
      question: 'İş mülakatında "Neden bu şirkette çalışmak istiyorsunuz?" sorusuna en profesyonel yaklaşım hangisidir?',
      options: [
        'Because I need money to buy a new car.',
        'I admire your company culture and my skills align with your upcoming global expansion.',
        'My friend told me that you pay very good salary.',
        'I don’t know, I just applied to 20 different places.',
      ],
      correctIndex: 1,
      explanation:
        'Kişisel yetenekler ile şirketin vizyonunu eşleştiren "align with your expansion/culture" kalıbı profesyonel mülakat standardıdır.',
    },
  },
  {
    id: 'hotel-checkin',
    title: 'Hotel Check-in & Room Request',
    turkishTitle: 'Otel Girişi & Oda Talepleri',
    icon: Building2,
    category: 'Seyahat & Konaklama',
    cefrLevel: 'A1-A2 (Temel)',
    description:
      'Rezervasyon teyidi, erken giriş (early check-in), sessiz oda talebi, oda kartı ve Wi-Fi şifresi sorma.',
    vocab: [
      {
        word: 'Complimentary',
        phonetic: '/ˌkɒm.plɪˈmen.tər.i/',
        type: 'adj.',
        meaning: 'Ücretsiz / İkram olan (otelde)',
        example: 'Complimentary breakfast is served on the terrace from 7 to 10 AM.',
        collocation: 'complimentary Wi-Fi / complimentary toiletries',
      },
      {
        word: 'Amenities',
        phonetic: '/əˈmiː.nə.tiz/',
        type: 'noun pl.',
        meaning: 'Otelin sunduğu imkanlar (havuz, spor salonu, sauna)',
        example: 'All guests have free access to the spa amenities.',
        collocation: 'hotel amenities / room amenities',
      },
      {
        word: 'Late checkout',
        phonetic: '/leɪt ˈtʃek.aʊt/',
        type: 'noun',
        meaning: 'Geç çıkış hakkı',
        example: 'Is it possible to arrange a late checkout until 2 PM?',
        collocation: 'request late checkout',
      },
      {
        word: 'Deposit',
        phonetic: '/dɪˈpɒz.ɪt/',
        type: 'noun',
        meaning: 'Güvence bedeli / depozito',
        example: 'We just place a temporary deposit hold on your credit card.',
        collocation: 'security deposit / refundable deposit',
      },
    ],
    phrases: [
      {
        phrase: 'I have a reservation under the name Demir.',
        meaning: 'Demir ismi adına bir rezervasyonum var.',
        tone: 'Polite',
        usageNote: 'Otele adım attığınızda resepsiyondaki ilk açılış cümleniz.',
      },
      {
        phrase: 'Would it be possible to get a room away from the elevator?',
        meaning: 'Asansörden uzakta, sessiz bir oda almamız mümkün olabilir mi?',
        tone: 'Polite',
        usageNote: 'Hassas uyuyanların sessiz oda rica etme kalıbı.',
      },
      {
        phrase: 'Could you please call me a taxi for tomorrow morning at 6:30?',
        meaning: 'Yarın sabah 6:30 için bana bir taksi çağırabilir misiniz lütfen?',
        tone: 'Polite',
        usageNote: 'Erken uçuşlar için resepsiyon yardımı.',
      },
    ],
    dialogue: [
      {
        speaker: 'Front Desk (Marco)',
        role: 'Resepsiyon Görevlisi',
        avatar: '🛎️',
        text: 'Good afternoon, welcome to the Grand Royale. Checking in today?',
        translation: 'İyi günler, Grand Royale\'e hoş geldiniz. Bugün giriş mi yapıyorsunuz?',
      },
      {
        speaker: 'Guest (Selin)',
        role: 'Misafir',
        avatar: '🧳',
        text: 'Hi, yes! I have a reservation under Selin Yilmaz for three nights.',
        translation: 'Merhaba, evet! Selin Yılmaz adına üç gecelik rezervasyonum var.',
      },
      {
        speaker: 'Front Desk (Marco)',
        role: 'Resepsiyon Görevlisi',
        avatar: '🛎️',
        text: 'Found it! Room 402, King bed with a city view. May I have your passport and a credit card for the incidental deposit?',
        translation: 'Buldum! 402 nolu oda, şehir manzaralı çift kişilik yatak. Pasaportunuzu ve olası harcamalar depozitosu için kredi kartınızı alabilir miyim?',
      },
      {
        speaker: 'Guest (Selin)',
        role: 'Misafir',
        avatar: '🧳',
        text: 'Here you go. Also, what time is breakfast served, and what is the Wi-Fi code?',
        translation: 'Buyrun. Bir de kahvaltı hangi saatlerde servis ediliyor ve Wi-Fi şifresi nedir?',
      },
      {
        speaker: 'Front Desk (Marco)',
        role: 'Resepsiyon Görevlisi',
        avatar: '🛎️',
        text: 'Breakfast is from 7 to 10:30 AM on the 2nd floor. Wi-Fi connects automatically with your room number. Enjoy your stay!',
        translation: 'Kahvaltı 2. katta saat 07:00 - 10:30 arasındadır. Wi-Fi oda numaranızla otomatik bağlanır. İyi konaklamalar dilerim!',
      },
    ],
    grammarTip: {
      ruleTitle: '"Under the name" Edat Kullanımı',
      dontSay: 'I have reservation with my name Selin.',
      sayInstead: 'I have a reservation under the name Selin.',
      explanation:
        'İngilizcede rezervasyon, bilet veya hesap bir isim adına kayıtlı olduğunda "under the name of..." edatı kullanılır.',
      maarifRule: 'MEB 8-10. Sınıf: Prepositions of specification',
    },
    challenge: {
      question: 'Otelde "Ücretsiz Wi-Fi var mı?" diye sormanın en profesyonel yolu hangisidir?',
      options: [
        'Do you provide complimentary Wi-Fi in the rooms?',
        'Give me free internet zero dollar.',
        'Why internet is not open?',
        'Does your computer have no fee?',
      ],
      correctIndex: 0,
      explanation:
        '"Complimentary" kelimesi otelcilik ve turizm sektöründe "ücretsiz ikram" anlamına gelen en prestijli kelimedir.',
    },
  },
  {
    id: 'asking-directions',
    title: 'Navigating the City & Directions',
    turkishTitle: 'Şehirde Yön & Adres Sorma',
    icon: MapPin,
    category: 'Günlük Hayat',
    cefrLevel: 'A1-A2 (Temel)',
    description:
      'Metro hattı bulma, sağa/sola dönme, köşe başı, yaya geçidi ve tahmini yürüme mesafesini öğrenme.',
    vocab: [
      {
        word: 'Intersection',
        phonetic: '/ˌɪn.təˈsek.ʃən/',
        type: 'noun',
        meaning: 'Kavşak / Dörtyol ağzı (UK: crossroads)',
        example: 'Turn left at the next intersection.',
        collocation: 'busy intersection / traffic lights',
      },
      {
        word: 'Within walking distance',
        phonetic: '/wɪˈðɪn ˈwɔː.kɪŋ ˈdɪs.təns/',
        type: 'phrase',
        meaning: 'Yürüme mesafesinde',
        example: 'The British Museum is within walking distance from here.',
        collocation: 'close by / a stone\'s throw away',
      },
      {
        word: 'Pedestrian crossing',
        phonetic: '/pəˈdes.tri.ən ˈkrɒs.ɪŋ/',
        type: 'noun',
        meaning: 'Yaya geçidi (UK: zebra crossing / US: crosswalk)',
        example: 'Use the pedestrian crossing to cross the avenue safely.',
        collocation: 'zebra crossing / crosswalk',
      },
      {
        word: 'Roundabout',
        phonetic: '/ˈraʊnd.ə.baʊt/',
        type: 'noun',
        meaning: 'Dönel kavşak (göbek)',
        example: 'Take the second exit at the roundabout.',
        collocation: 'take the 2nd exit',
      },
    ],
    phrases: [
      {
        phrase: 'Excuse me, could you tell me how to get to the nearest metro station?',
        meaning: 'Afedersiniz, en yakın metro istasyonuna nasıl gidebileceğimi söyleyebilir misiniz?',
        tone: 'Polite',
        usageNote: 'Yoldan geçen birine yön sorarken en kibar ve klasik açılış kalıbı.',
      },
      {
        phrase: 'You can\'t miss it; it\'s right opposite the pharmacy.',
        meaning: 'Gözünüzden kaçırmanız imkansız; tam eczanenin karşısında.',
        tone: 'Casual',
        usageNote: 'Tarif verenlerin bir yerin çok belirgin olduğunu anlatırken kullandığı deyim.',
      },
      {
        phrase: 'How long does it take on foot?',
        meaning: 'Yürüyerek ne kadar sürer?',
        tone: 'Polite',
        usageNote: 'Mesafenin yürünmeye değer olup olmadığını öğrenmek için.',
      },
    ],
    dialogue: [
      {
        speaker: 'Lost Tourist (Can)',
        role: 'Yolunu Arayan',
        avatar: '🧭',
        text: 'Excuse me, sorry to bother you! Is the Central Library far from here?',
        translation: 'Afedersiniz, rahatsız ettiğim için kusura bakmayın! Merkez Kütüphanesi buradan çok uzak mı?',
      },
      {
        speaker: 'Local Resident (Emma)',
        role: 'Yerli Vatandaş',
        avatar: '🚶‍♀️',
        text: 'Not at all! Walk straight down this street for two blocks until you see the red brick church.',
        translation: 'Hiç değil! Bu cadde boyunca iki sokak düz ilerleyin, kırmızı tuğlalı kiliseyi görene kadar.',
      },
      {
        speaker: 'Lost Tourist (Can)',
        role: 'Yolunu Arayan',
        avatar: '🧭',
        text: 'Okay, two blocks down to the red church. And then?',
        translation: 'Tamam, kırmızı kiliseye kadar iki sokak düz. Peki sonra?',
      },
      {
        speaker: 'Local Resident (Emma)',
        role: 'Yerli Vatandaş',
        avatar: '🚶‍♀️',
        text: 'Take a right onto Baker Street. The library is on your left, right opposite the post office. You can’t miss it!',
        translation: 'Baker Caddesi\'ne sağa dönün. Kütüphane solunuzda kalacak, tam postanenin karşısında. Görmemeniz imkansız!',
      },
    ],
    grammarTip: {
      ruleTitle: 'Yön ve Süre Sorularında "How long does it take...?"',
      dontSay: 'How much time it goes with walking?',
      sayInstead: 'How long does it take on foot? / How far is it?',
      explanation:
        'Bir yere gitmenin ne kadar sürdüğünü sormak için standart yapı: "How long does it take by bus/car/on foot?" kalıbıdır.',
      maarifRule: 'MEB 5-7. Sınıf: Asking for and giving directions, Imperatives',
    },
    challenge: {
      question: '"Görmemeniz imkansız, hemen karşınıza çıkacak" manasına gelen doğal İngilizce deyim hangisidir?',
      options: [
        'You cannot miss it!',
        'You are not able to lose eyes!',
        'Your view is impossible!',
        'Don\'t drop the building!',
      ],
      correctIndex: 0,
      explanation:
        '"You can\'t miss it!" yer ve yön tariflerinin dünya genelinde en çok kullanılan deyimsel ifadesidir.',
    },
  },
  {
    id: 'doctor-pharmacy',
    title: 'Pharmacy & Explaining Symptoms',
    turkishTitle: 'Eczane & Şikayetleri Anlatma',
    icon: Stethoscope,
    category: 'Sağlık & Yaşam',
    cefrLevel: 'A2-B1 (Temel-Orta)',
    description:
      'Ağrı, ateş, alerji ve öksürük gibi semptomları tarif etme, reçeteli/reçetesiz ilaç (OTC) ve dozaj sorma.',
    vocab: [
      {
        word: 'Over-the-counter (OTC)',
        phonetic: '/ˌoʊ.vɚ.ðəˈkaʊn.tər/',
        type: 'adj.',
        meaning: 'Reçetesiz satılan (ilaç)',
        example: 'You can buy pain relievers over the counter without a prescription.',
        collocation: 'OTC medication / prescription-only',
      },
      {
        word: 'Drowsy',
        phonetic: '/ˈdraʊ.zi/',
        type: 'adj.',
        meaning: 'Uyku getiren / sersemletici',
        example: 'Will this allergy syrup make me feel drowsy?',
        collocation: 'non-drowsy formula',
      },
      {
        word: 'Dosage',
        phonetic: '/ˈdəʊ.sɪdʒ/',
        type: 'noun',
        meaning: 'İlaç dozu / kullanım sıklığı',
        example: 'What is the recommended dosage for an adult?',
        collocation: 'take the recommended dosage',
      },
      {
        word: 'Throbbing headache',
        phonetic: '/ˈθrɒb.ɪŋ ˈhed.eɪk/',
        type: 'noun',
        meaning: 'Zonklayan baş ağrısı',
        example: 'I’ve had a throbbing headache since this morning.',
        collocation: 'severe headache / migraine',
      },
    ],
    phrases: [
      {
        phrase: 'I’ve been feeling under the weather with a sore throat and chills.',
        meaning: 'Boğaz ağrısı ve titremeyle birlikte kendimi kırgın/halsiz hissediyorum.',
        tone: 'Polite',
        usageNote: '"Under the weather" hafif rahatsız/hasta hissetmek için en doğal ifadedir.',
      },
      {
        phrase: 'Should I take this on an empty stomach or with food?',
        meaning: 'Bunu aç karnına mı yoksa tok karnına mı almalıyım?',
        tone: 'Polite',
        usageNote: 'İlaç alırken hayati önem taşıyan kullanım sorusu.',
      },
      {
        phrase: 'Are there any side effects I should watch out for?',
        meaning: 'Dikkat etmem gereken herhangi bir yan etki var mı?',
        tone: 'Polite',
        usageNote: 'Olası alerji veya reaksiyonları öğrenmek için.',
      },
    ],
    dialogue: [
      {
        speaker: 'Pharmacist (Dr. Ryan)',
        role: 'Eczacı',
        avatar: '💊',
        text: 'Hello! How can I assist you today?',
        translation: 'Merhaba! Bugün size nasıl yardımcı olabilirim?',
      },
      {
        speaker: 'Customer (Melis)',
        role: 'Hasta',
        avatar: '🤒',
        text: 'Hi, I have a dry cough and a congested nose. Could you recommend something that won\'t make me drowsy?',
        translation: 'Merhaba, kuru bir öksürüğüm ve tıkalı bir burnum var. Uyku yapmayacak bir ilaç önerebilir misiniz?',
      },
      {
        speaker: 'Pharmacist (Dr. Ryan)',
        role: 'Eczacı',
        avatar: '💊',
        text: 'Certainly. This non-drowsy daytime decongestant will clear your sinuses. Take one tablet every 8 hours with plenty of water.',
        translation: 'Kesinlikle. Bu uyku yapmayan gündüz dekonjestanı sinüslerinizi açacaktır. Bol su ile 8 saatte bir tablet içiniz.',
      },
      {
        speaker: 'Customer (Melis)',
        role: 'Hasta',
        avatar: '🤒',
        text: 'Thank you! Do I need a doctor’s prescription for this?',
        translation: 'Teşekkürler! Bunun için doktor reçetesine ihtiyacım var mı?',
      },
      {
        speaker: 'Pharmacist (Dr. Ryan)',
        role: 'Eczacı',
        avatar: '💊',
        text: 'No, it’s available over the counter. Feel better soon!',
        translation: 'Hayır, reçetesiz temin edilebilir. Çok geçmiş olsun!',
      },
    ],
    grammarTip: {
      ruleTitle: 'Hastalık Belirtilerinde "I have a / an..." Yapısı',
      dontSay: 'I am headache and paining.',
      sayInstead: 'I have a headache. / My back aches. / I feel dizzy.',
      explanation:
        'İngilizcede fiziksel rahatsızlıkları ifade ederken "I have a headache / sore throat / stomachache" kullanılır, "I am..." denmez.',
      maarifRule: 'MEB 5-8. Sınıf: Expressing illness and health conditions',
    },
    challenge: {
      question: 'İlacın "uyku getirmeyen" formülü İngilizcede nasıl adlandırılır?',
      options: [
        'Non-drowsy formula',
        'No-sleep syrup',
        'Always awake pill',
        'Anti-tired remedy',
      ],
      correctIndex: 0,
      explanation:
        '"Non-drowsy", ilaç ambalajlarında uyku hali yapmayan içerikleri belirtmek için kullanılan resmi ve yaygın terimdir.',
    },
  },
]

export function TinyLessonsModule() {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(SCENARIOS[0].id)
  const [accent, setAccent] = useState<EnglishAccent>('en-US')
  const [activeSpeechText, setActiveSpeechText] = useState<string | null>(null)
  const [showTranslations, setShowTranslations] = useState<boolean>(true)
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null)
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false)

  const currentScenario = SCENARIOS.find((s) => s.id === selectedScenarioId) || SCENARIOS[0]

  const handlePlayAudio = (text: string) => {
    setActiveSpeechText(text)
    playSpeech(text, accent, 0.95, () => {
      setActiveSpeechText(null)
    })
  }

  const handleSelectScenario = (id: string) => {
    setSelectedScenarioId(id)
    setSelectedQuizAnswer(null)
    setIsQuizSubmitted(false)
  }

  return (
    <div className="space-y-8">
      {/* ── Subheader & Concept Banner ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-sky-950/40 via-slate-900 to-indigo-950/30 border border-sky-500/20 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              DersoLab — Durumsal Konuşma Atölyesi
            </span>
            <span className="text-xs text-slate-400">Durumsal Bağlamsal Öğrenme</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-sky-400" />
            Durumsal Pratik Senaryoları (Situational Lessons)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Kuru gramer tabloları yerine gerçek hayat senaryolarını seçin. Doğal diyalogları dinleyin, telaffuzları öğrenin ve konuşma tuzaklarından kurtulun.
          </p>
        </div>

        {/* Accent / Voice Selector */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto shrink-0">
          <span className="text-[11px] font-semibold text-slate-400 pl-2">Aksan:</span>
          {(['en-US', 'en-GB', 'en-AU'] as EnglishAccent[]).map((acc) => (
            <button
              key={acc}
              onClick={() => setAccent(acc)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                accent === acc
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {acc === 'en-US' ? '🇺🇸 US' : acc === 'en-GB' ? '🇬🇧 UK' : '🇦🇺 AU'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scenario Carousel / Selector — Compact \u0026 Fitted Cleanly ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 sm:gap-2.5">
        {SCENARIOS.map((scenario) => {
          const Icon = scenario.icon
          const isSelected = scenario.id === currentScenario.id
          return (
            <button
              key={scenario.id}
              onClick={() => handleSelectScenario(scenario.id)}
              className={`group flex flex-col text-left p-2.5 sm:p-3 rounded-2xl border transition-all cursor-pointer min-w-0 ${
                isSelected
                  ? 'bg-gradient-to-b from-sky-900/40 to-slate-900/90 border-sky-400/60 shadow-[0_0_20px_rgba(56,189,248,0.25)] ring-1 ring-sky-400/30'
                  : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shrink-0 ${
                    isSelected
                      ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span
                  className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                    scenario.cefrLevel.includes('A1')
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30'
                  }`}
                >
                  {scenario.cefrLevel.split(' ')[0]}
                </span>
              </div>
              <h4 className="text-xs sm:text-[13px] font-bold text-white truncate" title={scenario.title}>
                {scenario.title}
              </h4>
              <p className="text-[11px] text-slate-400 truncate mt-0.5" title={scenario.turkishTitle}>
                {scenario.turkishTitle}
              </p>
            </button>
          )
        })}
      </div>

      {/* ── Active Scenario Details ── */}
      <div className="space-y-6">
        
        {/* Scenario Header Info */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 mb-1">
                <span>{currentScenario.category}</span>
                <span>•</span>
                <span>{currentScenario.cefrLevel}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {currentScenario.title} —{' '}
                <span className="text-slate-400 font-medium">{currentScenario.turkishTitle}</span>
              </h3>
              <p className="text-sm text-slate-300 mt-1 max-w-3xl">{currentScenario.description}</p>
            </div>
            
            {/* Translation Toggle */}
            <button
              onClick={() => setShowTranslations(!showTranslations)}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-semibold text-slate-200 hover:bg-slate-750 transition-all self-start sm:self-auto cursor-pointer"
            >
              {showTranslations ? <EyeOff className="w-4 h-4 text-sky-400" /> : <Eye className="w-4 h-4 text-slate-400" />}
              {showTranslations ? 'Türkçe Çevirileri Gizle' : 'Türkçe Çevirileri Göster'}
            </button>
          </div>
        </div>

        {/* ── Turn-by-Turn Real-World Dialogue ── */}
        <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              Doğal Senaryo Diyaloğu (Turn-by-turn Dialogue)
            </h4>
            <span className="text-xs text-slate-400">
              🔊 Cümleleri dinlemek için hoparlör simgesine tıklayın
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {currentScenario.dialogue.map((line, idx) => {
              const isSpeaking = activeSpeechText === line.text
              const isEven = idx % 2 === 0
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                    isEven
                      ? 'bg-slate-950/70 border-slate-800/80'
                      : 'bg-sky-950/20 border-sky-500/20 ml-2 sm:ml-6'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800/90 border border-slate-700/60 flex items-center justify-center text-xl shrink-0">
                    {line.avatar}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{line.speaker}</span>
                        <span className="text-[11px] text-slate-500">({line.role})</span>
                      </div>
                      <button
                        onClick={() => handlePlayAudio(line.text)}
                        title="Telaffuzu Dinle"
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isSpeaking
                            ? 'bg-sky-500 text-slate-950 border-sky-400 animate-pulse'
                            : 'bg-slate-800/70 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-sm sm:text-base font-medium text-slate-100">{line.text}</p>

                    <AnimatePresence>
                      {showTranslations && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-sky-300/80 pt-0.5"
                        >
                          {line.translation}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* ── Key Vocabulary Cards ── */}
        <div className="space-y-3">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            Senaryo Anahtar Kelimeleri & Kalıplaşmış İfadeler
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {currentScenario.vocab.map((v, i) => {
              const isSpeaking = activeSpeechText === v.word
              return (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-base font-extrabold text-white">{v.word}</span>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <span className="font-mono text-sky-400">{v.phonetic}</span>
                          <span>•</span>
                          <span className="italic text-[11px] text-slate-500">{v.type}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handlePlayAudio(v.word)}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          isSpeaking
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 animate-pulse'
                            : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                        }`}
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs font-semibold text-emerald-300">{v.meaning}</div>
                    <div className="text-xs text-slate-300 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 italic">
                      “{v.example}”
                    </div>
                  </div>

                  {v.collocation && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Birlikte Kullanım:</span>
                      <span className="text-slate-300 font-medium">{v.collocation}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Key Native Phrases & Tones ── */}
        <div className="space-y-3">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            Önemli Kalıp Cümleler & Nezaket Tonu
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {currentScenario.phrases.map((p, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/30 transition-all space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        p.tone === 'Polite'
                          ? 'bg-sky-500/10 text-sky-300 border border-sky-500/30'
                          : p.tone === 'Formal'
                          ? 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                          : p.tone === 'Urgent'
                          ? 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {p.tone}
                    </span>
                    <button
                      onClick={() => handlePlayAudio(p.phrase)}
                      className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Dinle"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm font-bold text-white leading-snug">{p.phrase}</div>
                  <div className="text-xs text-amber-300/90 mt-1">{p.meaning}</div>
                </div>

                <div className="text-[11px] text-slate-400 bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                  💡 {p.usageNote}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Grammar Nugget / "Don't Say, Say Instead" ── */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Lightbulb className="w-4 h-4" />
              </div>
              <h4 className="text-base font-bold text-white">
                Gramer & İfade İpucu: {currentScenario.grammarTip.ruleTitle}
              </h4>
            </div>
            <span className="text-[11px] font-semibold text-indigo-300 px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30">
              {currentScenario.grammarTip.maarifRule}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-start gap-2.5">
              <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block mb-0.5">
                  Bunu Söylemeyin (Don't Say):
                </span>
                <span className="text-sm font-semibold text-rose-200 line-through">
                  {currentScenario.grammarTip.dontSay}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                  Bunun Yerine (Say Instead):
                </span>
                <span className="text-sm font-semibold text-emerald-200">
                  {currentScenario.grammarTip.sayInstead}
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 pt-1 leading-relaxed">
            {currentScenario.grammarTip.explanation}
          </p>
        </div>

        {/* ── Interactive Practice Quiz ── */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-sky-400" />
              <h4 className="text-base font-bold text-white">Mini Bilgi Kontrolü (Quick Check)</h4>
            </div>
            <span className="text-xs text-slate-400">Senaryo Pekiştirme</span>
          </div>

          <div className="space-y-3">
            <p className="text-sm sm:text-base font-semibold text-white">
              {currentScenario.challenge.question}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentScenario.challenge.options.map((opt, idx) => {
                const isSelected = selectedQuizAnswer === idx
                const isCorrect = idx === currentScenario.challenge.correctIndex
                let btnStyle = 'bg-slate-950/60 border-slate-800 text-slate-200 hover:bg-slate-800/60 hover:border-slate-700'

                if (isQuizSubmitted) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-950/40 border-emerald-500/80 text-emerald-200 font-bold'
                  } else if (isSelected) {
                    btnStyle = 'bg-rose-950/40 border-rose-500/80 text-rose-200 line-through'
                  }
                } else if (isSelected) {
                  btnStyle = 'bg-sky-950/40 border-sky-400 text-white font-bold'
                }

                return (
                  <button
                    key={idx}
                    disabled={isQuizSubmitted}
                    onClick={() => setSelectedQuizAnswer(idx)}
                    className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{opt}</span>
                    {isQuizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 ml-2 shrink-0" />}
                    {isQuizSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 ml-2 shrink-0" />}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              {!isQuizSubmitted ? (
                <button
                  disabled={selectedQuizAnswer === null}
                  onClick={() => setIsQuizSubmitted(true)}
                  className="px-5 py-2 rounded-xl bg-sky-500 text-slate-950 font-bold text-xs sm:text-sm hover:bg-sky-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-sky-500/20 cursor-pointer"
                >
                  Cevabı Kontrol Et
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-300">
                    💡 {currentScenario.challenge.explanation}
                  </span>
                  <button
                    onClick={() => {
                      setSelectedQuizAnswer(null)
                      setIsQuizSubmitted(false)
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Tekrar Dene
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
