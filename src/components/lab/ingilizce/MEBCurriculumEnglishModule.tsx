'use client'

import React, { useState } from 'react'
import {
  BookOpen,
  Volume2,
  CheckCircle2,
  XCircle,
  Sparkles,
  School,
  GraduationCap,
  MessageSquare,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  Award,
  ChevronRight,
  Check,
} from 'lucide-react'
import { playSpeech, EnglishAccent } from './speechHelper'
import { playSuccessFanfare, playErrorBuzz, playClickSound } from '@/lib/soundFx'

export type GradeLevel = '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12'

export interface UnitVocabItem {
  word: string
  phonetic: string
  partOfSpeech: string
  turkish: string
  exampleSentence: string
}

export interface UnitDialogueLine {
  speaker: string
  text: string
  turkish: string
  avatar: string
}

export interface UnitPracticeQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface MEBEnglishUnit {
  id: string
  grade: GradeLevel
  gradeGroup: 'ortaokul' | 'lise'
  unitNumber: number
  title: string
  turkishTitle: string
  themeDesc: string
  grammarFocus: {
    ruleName: string
    formula: string
    explanation: string
    examples: { en: string; tr: string }[]
    examTrap: string
  }
  vocabulary: UnitVocabItem[]
  dialogue: UnitDialogueLine[]
  practiceQuestions: UnitPracticeQuestion[]
  examQuestion?: {
    examName: string
    year: string
    questionText: string
    options: { key: string; text: string }[]
    correctKey: string
    explanation: string
  }
}

export const MEB_ENGLISH_UNITS: MEBEnglishUnit[] = [
  // ── 5. SINIF ──
  {
    id: 'unit-5-1',
    grade: '5',
    gradeGroup: 'ortaokul',
    unitNumber: 1,
    title: 'Hello!',
    turkishTitle: 'Merhaba! (Ülkeler, Diller & Dersler)',
    themeDesc: 'Kendini tanıtma, ülkeler, milletler, konuşulan yabancı diller ve okul dersleri hakkında konuşma.',
    grammarFocus: {
      ruleName: 'Country & Nationality & Language Patterns',
      formula: 'Where are you from? → I am from [Country]. / What nationality are you? → I am [Nationality].',
      explanation: 'Ülke isimleri ile millet/uyruk isimleri sınavlarda sıklıkla birbirine karıştırılır. "from" edatından sonra ülke, "am/is/are"dan sonra uyruk gelir.',
      examples: [
        { en: 'Where are you from? - I am from Turkey.', tr: 'Nerelisin? - Ben Türkiyeliyim.' },
        { en: 'What nationality are you? - I am Turkish.', tr: 'Hangi millettensin? - Ben Türküm.' },
        { en: 'How many languages can you speak? - I can speak two languages.', tr: 'Kaç dil konuşabiliyorsun? - İki dil konuşabiliyorum.' },
      ],
      examTrap: 'Tuzak: "I am from Turkish" yanlıştır! "from" varsa ülke gelmelidir: "I am from Turkey" veya "I am Turkish".',
    },
    vocabulary: [
      { word: 'Country', phonetic: '/ˈkʌn.tri/', partOfSpeech: 'noun', turkish: 'Ülke', exampleSentence: 'Turkey is a beautiful country.' },
      { word: 'Nationality', phonetic: '/ˌnæʃ.ənˈæl.ə.ti/', partOfSpeech: 'noun', turkish: 'Uyruk, Milliyet', exampleSentence: 'What is your nationality?' },
      { word: 'Timetable', phonetic: '/ˈtaɪmˌteɪ.bəl/', partOfSpeech: 'noun', turkish: 'Ders Programı', exampleSentence: 'I have Science on my Monday timetable.' },
      { word: 'Physical Education (P.E.)', phonetic: '/ˌfɪz.ɪ.kəl ed.jʊˈkeɪ.ʃən/', partOfSpeech: 'noun', turkish: 'Beden Eğitimi', exampleSentence: 'We play basketball in P.E. class.' },
      { word: 'Favorite', phonetic: '/ˈfeɪ.vər.ɪt/', partOfSpeech: 'adj', turkish: 'En sevilen, Favori', exampleSentence: 'My favorite school subject is Maths.' },
    ],
    dialogue: [
      { speaker: 'Zeynep', text: 'Hello! My name is Zeynep. I am new at this school.', turkish: 'Merhaba! Benim adım Zeynep. Bu okulda yeniyim.', avatar: '👩' },
      { speaker: 'David', text: 'Hi Zeynep! Nice to meet you. Where are you from?', turkish: 'Selam Zeynep! Tanıştığıma sevindim. Nerelisin?', avatar: '👦' },
      { speaker: 'Zeynep', text: 'I am from Turkey, but I live in London now. Which classes do we have today?', turkish: 'Türkiyeliyim ama şu an Londra\'da yaşıyorum. Bugün hangi derslerimiz var?', avatar: '👩' },
      { speaker: 'David', text: 'We have Science, English, and P.E. in the afternoon!', turkish: 'Öğleden sonra Fen Bilgisi, İngilizce ve Beden Eğitimi var!', avatar: '👦' },
    ],
    practiceQuestions: [
      {
        id: 'q-5-1',
        question: 'Complete the sentence: "Elena is from Italy, so she is __________."',
        options: ['Italian', 'Italish', 'Italy', 'Italianian'],
        correctIndex: 0,
        explanation: 'İtalya (Italy) ülkesinin milliyet karşılığı "Italian"dır.',
      },
      {
        id: 'q-5-2',
        question: 'Which question matches the answer: "I speak Turkish and English"?',
        options: ['Where are you from?', 'How many languages do you speak?', 'What is your favorite class?', 'What nationality are you?'],
        correctIndex: 1,
        explanation: 'Konuşulan dilleri sormak için "How many languages do you speak?" sorusu kullanılır.',
      },
    ],
  },

  // ── 6. SINIF ──
  {
    id: 'unit-6-3',
    grade: '6',
    gradeGroup: 'ortaokul',
    unitNumber: 3,
    title: 'Downtown',
    turkishTitle: 'Şehir Merkezi (Karşılaştırmalar & Sıfatlar)',
    themeDesc: 'Şehir hayatı ile köy hayatını karşılaştırma, sıfatların üstünlük derecesi (Comparatives), şehirdeki günlük eylemler.',
    grammarFocus: {
      ruleName: 'Comparative Adjectives (Karşılaştırma Sıfatları)',
      formula: 'Kısa Sıfatlar: Adj + -er + than (busier than) | Uzun Sıfatlar: more + Adj + than (more crowded than)',
      explanation: 'İki varlığı veya yeri karşılaştırırken tek heceli sıfatların sonuna "-er", iki veya daha fazla heceli sıfatların başına "more" eklenir. Karşılaştırılan ikinci nesneden önce mutlaka "than" gelir.',
      examples: [
        { en: 'Downtown is noisier than a village.', tr: 'Şehir merkezi bir köyden daha gürültülüdür.' },
        { en: 'Shopping malls are more crowded on weekends.', tr: 'Alışveriş merkezleri hafta sonları daha kalabalıktır.' },
        { en: 'A bicycle is cheaper than a car.', tr: 'Bir bisiklet bir arabadan daha ucuzdur.' },
      ],
      examTrap: '"more cheaper" veya "more noisier" gibi iki kuralı aynı anda kullanmak büyük bir gramer hatasıdır!',
    },
    vocabulary: [
      { word: 'Downtown', phonetic: '/ˌdaʊnˈtaʊn/', partOfSpeech: 'noun', turkish: 'Şehir merkezi', exampleSentence: 'There are many skyscrapers downtown.' },
      { word: 'Crowded', phonetic: '/ˈkraʊ.dɪd/', partOfSpeech: 'adj', turkish: 'Kalabalık', exampleSentence: 'The subway station is very crowded today.' },
      { word: 'Skyscraper', phonetic: '/ˈskaɪˌskreɪ.pər/', partOfSpeech: 'noun', turkish: 'Gökdelen', exampleSentence: 'Istanbul has modern skyscrapers.' },
      { word: 'Traffic jam', phonetic: '/ˈtræf.ɪk dʒæm/', partOfSpeech: 'noun', turkish: 'Trafik sıkışıklığı', exampleSentence: 'We were stuck in a heavy traffic jam.' },
      { word: 'Feeding street animals', phonetic: '/ˈfiː.dɪŋ striːt ˈæn.ɪ.məlz/', partOfSpeech: 'phrase', turkish: 'Sokak hayvanlarını beslemek', exampleSentence: 'Can is feeding the street cats in the park.' },
    ],
    dialogue: [
      { speaker: 'Emre', text: 'Do you prefer living downtown or in a quiet village, Mert?', turkish: 'Şehir merkezinde mi yoksa sakin bir köyde mi yaşamayı tercih edersin Mert?', avatar: '👱‍♂️' },
      { speaker: 'Mert', text: 'I love village life because the city is more stressful and crowded.', turkish: 'Köy hayatını seviyorum çünkü şehir daha stresli ve kalabalık.', avatar: '👨‍🌾' },
      { speaker: 'Emre', text: 'Yes, but downtown has better museums, cinemas, and parks!', turkish: 'Evet ama şehir merkezinde daha iyi müzeler, sinemalar ve parklar var!', avatar: '👱‍♂️' },
    ],
    practiceQuestions: [
      {
        id: 'q-6-1',
        question: 'City life is __________ than village life.',
        options: ['more noisy', 'noisier', 'most noisy', 'noisy'],
        correctIndex: 1,
        explanation: '"noisy" sonu "-y" ile biten kısa bir sıfattır, karşılaştırmada "-ier" alır: "noisier".',
      },
    ],
  },

  // ── 7. SINIF ──
  {
    id: 'unit-7-1',
    grade: '7',
    gradeGroup: 'ortaokul',
    unitNumber: 1,
    title: 'Appearance and Personality',
    turkishTitle: 'Dış Görünüş & Kişilik Özellikleri',
    themeDesc: 'İnsanların fiziksel görünüşlerini ve karakter özelliklerini detaylı tarif etme, sıfat zıtlıkları.',
    grammarFocus: {
      ruleName: 'What is he like? vs What does he look like?',
      formula: 'Kişilik: What is she like? → She is generous. | Dış Görünüş: What does she look like? → She is tall and slim.',
      explanation: 'MEB sınavlarında en çok karıştırılan iki soru kalıbıdır. "What is he like?" karakter sorar; "What does he look like?" boy, kilo, saç ve göz gibi fiziksel özellikleri sorar.',
      examples: [
        { en: 'What is your best friend like? - She is honest and punctual.', tr: 'En yakın arkadaşın nasıl biridir? - O dürüst ve dakiktir.' },
        { en: 'What does he look like? - He has got curly brown hair and green eyes.', tr: 'Onun dış görünüşü nasıldır? - Kıvırcık kahverengi saçları ve yeşil gözleri vardır.' },
      ],
      examTrap: 'Kişilik sorusuna boy/kilo cevabı vermek veya görünüş sorusuna "He is polite" demek klasik şaşırtmacadır.',
    },
    vocabulary: [
      { word: 'Punctual', phonetic: '/ˈpʌŋk.tʃu.əl/', partOfSpeech: 'adj', turkish: 'Dakik (asla geç kalmayan)', exampleSentence: 'Ayşe is always punctual for meetings.' },
      { word: 'Generous', phonetic: '/ˈdʒen.ər.əs/', partOfSpeech: 'adj', turkish: 'Cömert (paylaşmayı seven)', exampleSentence: 'He is generous; he likes buying presents for friends.' },
      { word: 'Stubborn', phonetic: '/ˈstʌb.ən/', partOfSpeech: 'adj', turkish: 'İnatçı (fikrini değiştirmeyen)', exampleSentence: 'Ali never changes his mind, he is so stubborn.' },
      { word: 'Clumsy', phonetic: '/ˈklʌm.zi/', partOfSpeech: 'adj', turkish: 'Sakar (eşyaları düşüren)', exampleSentence: 'I dropped the glass on the floor, I am so clumsy.' },
      { word: 'Outgoing', phonetic: '/ˌaʊtˈɡəʊ.ɪŋ/', partOfSpeech: 'adj', turkish: 'Dışa dönük, Sosyal', exampleSentence: 'She has many friends because she is outgoing.' },
    ],
    dialogue: [
      { speaker: 'Teacher', text: 'Who can describe our new foreign student, Lucas?', turkish: 'Yeni yabancı öğrencimiz Lucas\'ı kim tarif edebilir?', avatar: '👩‍🏫' },
      { speaker: 'Selin', text: 'He is tall with fair hair. In terms of personality, he is very polite and generous.', turkish: 'Uzun boylu ve sarışın. Kişilik olarak ise çok kibar ve cömert.', avatar: '👧' },
    ],
    practiceQuestions: [
      {
        id: 'q-7-1',
        question: 'Jack: "What is your brother like?" — Tom: "__________."',
        options: ['He has got blue eyes and wavy hair.', 'He is tall and well-built.', 'He is very helpful and honest.', 'He looks like our grandfather.'],
        correctIndex: 2,
        explanation: '"What is ... like?" sorusu kişilik (personality) sorduğu için doğru cevap dürüstlük ve yardımseverlik bildiren seçenektir.',
      },
    ],
  },

  // ── 8. SINIF (LGS) ──
  {
    id: 'unit-8-1',
    grade: '8',
    gradeGroup: 'ortaokul',
    unitNumber: 1,
    title: 'Friendship (Arkadaşlık)',
    turkishTitle: 'Arkadaşlık (LGS 1. Ünite - Teklif & Bahane Bildirme)',
    themeDesc: 'İyi bir arkadaşın özellikleri, teklif yapma (making offers), teklifi kabul etme (accepting), bahane bildirerek reddetme (refusing & making excuses).',
    grammarFocus: {
      ruleName: 'Offers, Invitations, Accepting & Refusing with an Excuse',
      formula: 'Would you like to + V1? / How about + V_ing? / Why don\'t we + V1?',
      explanation: 'LGS İngilizce sınavında garanti soru çıkan ünitedir. Bir daveti kibarca reddederken mutlaka bir mazeret/bahane (excuse) belirtilir.',
      examples: [
        { en: 'Would you like to come over for a slumber party tonight?', tr: 'Bu gece pijama partisi için bize gelmek ister misin?' },
        { en: 'I would love to, but I have to finish my Science project.', tr: 'Çok isterdim ama Fen projemi bitirmek zorundayım. (Bahane ile ret)' },
        { en: 'A true buddy always backs you up and never tells lies.', tr: 'Gerçek bir dost daima seni destekler ve asla yalan söylemez.' },
      ],
      examTrap: 'LGS Tuzağı: "I\'d love to, but..." kalıbı olumlu başlasa da "but" bağlacı nedeniyle bir REDDETME (refusal) cümlesidir!',
    },
    vocabulary: [
      { word: 'Count on / Rely on', phonetic: '/kaʊnt ɒn/', partOfSpeech: 'phrasal verb', turkish: 'Güvenmek, İtimat etmek', exampleSentence: 'A real friend is someone you can always count on.' },
      { word: 'Back up', phonetic: '/bæk ʌp/', partOfSpeech: 'phrasal verb', turkish: 'Arka çıkmak, Desteklemek', exampleSentence: 'Best buddies always back each other up.' },
      { word: 'Get on well with', phonetic: '/ɡet ɒn wel wɪð/', partOfSpeech: 'phrasal verb', turkish: 'Biriyle iyi geçinmek', exampleSentence: 'I get on really well with Ece; we have lots of fun.' },
      { word: 'Make an excuse', phonetic: '/meɪk ən ɪkˈskjuːs/', partOfSpeech: 'phrase', turkish: 'Mazeret / Bahane bildirmek', exampleSentence: 'He didn\'t come to the match and made a silly excuse.' },
      { word: 'Laid-back', phonetic: '/ˌleɪdˈbæk/', partOfSpeech: 'adj', turkish: 'Rahat, Umursamaz, Sakin', exampleSentence: 'Ahmet is so laid-back; nothing ever worries him.' },
      { word: 'Tactful', phonetic: '/ˈtækt.fəl/', partOfSpeech: 'adj', turkish: 'İnce düşünceli, Nazik', exampleSentence: 'She is a tactful girl; she never hurts anyone\'s feelings.' },
    ],
    dialogue: [
      { speaker: 'Eda', text: 'Hey Ceren! We are organizing a barbecue party on Sunday. Would you like to join us?', turkish: 'Selam Ceren! Pazar günü mangal partisi düzenliyoruz. Bize katılmak ister misin?', avatar: '👩' },
      { speaker: 'Ceren', text: 'I\'d love to, but my cousins are visiting us on Sunday. Thank you for inviting me!', turkish: 'Çok isterdim ama Pazar günü kuzenlerim bizi ziyarete geliyor. Davetin için teşekkürler!', avatar: '👱‍♀️' },
      { speaker: 'Eda', text: 'No worries! Maybe next time then. Take care!', turkish: 'Sorun değil! O halde bir dahaki sefere. Kendine iyi bak!', avatar: '👩' },
    ],
    practiceQuestions: [
      {
        id: 'q-8-1',
        question: 'Which of the following phrases is used to REFUSE an invitation with an excuse?',
        options: [
          'Yeah, why not! That sounds awesome.',
          'Sure, I will definitely be there.',
          'I\'d love to, but I have a dentist appointment.',
          'Of course, what time does it start?',
        ],
        correctIndex: 2,
        explanation: '"I\'d love to, but I have a dentist appointment" cümlesi hem "but" ile reddetmiş hem de dişçi randevusu bahanesini bildirmiştir.',
      },
    ],
    examQuestion: {
      examName: 'LGS Çıkmış Soru',
      year: '2023',
      questionText:
        'Arthur invites Brian to a bowling tournament on Saturday. Brian says: "That sounds fantastic, but I have to help my father in the garden." According to the conversation, what does Brian do?',
      options: [
        { key: 'A', text: 'He accepts the invitation and brings his father.' },
        { key: 'B', text: 'He refuses the invitation because he has another plan.' },
        { key: 'C', text: 'He invites Arthur to his house instead.' },
        { key: 'D', text: 'He complains about bowling tournaments.' },
      ],
      correctKey: 'B',
      explanation:
        'Brian daveti çok cazip bulsa da ("That sounds fantastic") "but" bağlacıyla babasına bahçede yardım etmek zorunda olduğunu belirterek daveti başka bir planı olduğu için REDDETMİŞTİR (refuses). Doğru cevap B seçeneğidir.',
    },
  },

  // ── 8. SINIF: IN THE KITCHEN ──
  {
    id: 'unit-8-3',
    grade: '8',
    gradeGroup: 'ortaokul',
    unitNumber: 3,
    title: 'In the Kitchen (Mutfakta)',
    turkishTitle: 'Mutfakta (LGS 3. Ünite - Yemek Tarifleri & Adım Zarfı)',
    themeDesc: 'Yemek yapma süreçleri (cooking processes), mutfak aletleri (kitchen utensils), sıra bildiren zarflar (First, Second, Then, After that, Finally).',
    grammarFocus: {
      ruleName: 'Sequence Adverbs & Process Verbs (Sıralama Zarfları)',
      formula: 'First → Second → Then → Next → After that → Finally',
      explanation: 'Yemek tarifi veya bir bilimsel sürecin aşamalarını anlatırken kullanılan bağlaçlardır. LGS\'de tarif adımlarının kronolojik sırası test edilir.',
      examples: [
        { en: 'First, peel and dice the potatoes.', tr: 'İlk olarak patatesleri soyun ve küp küp doğrayın.' },
        { en: 'Then, heat some olive oil in a pan.', tr: 'Ardından tavada biraz zeytinyağı kızdırın.' },
        { en: 'Finally, serve the soup hot with fresh bread.', tr: 'Son olarak çorbayı taze ekmekle sıcak servis edin.' },
      ],
      examTrap: '"Chop" (iri doğramak) ile "Dice" (küp küp doğramak) ve "Grate" (rendelemek) fiilleri soru köklerinde sıkça tuzak olarak kullanılır.',
    },
    vocabulary: [
      { word: 'Dice', phonetic: '/daɪs/', partOfSpeech: 'verb', turkish: 'Küp küp doğramak', exampleSentence: 'Dice the onions and tomatoes into small cubes.' },
      { word: 'Peel', phonetic: '/piːl/', partOfSpeech: 'verb', turkish: 'Kabuğunu soymak', exampleSentence: 'Peel the apples before making the pie.' },
      { word: 'Knead', phonetic: '/niːd/', partOfSpeech: 'verb', turkish: 'Hamur yoğurmak', exampleSentence: 'Knead the dough for five minutes until it gets smooth.' },
      { word: 'Drain', phonetic: '/dreɪn/', partOfSpeech: 'verb', turkish: 'Suyunu süzmek', exampleSentence: 'Boil the pasta and then drain the water.' },
      { word: 'Bake vs Fry', phonetic: '/beɪk/ vs /fraɪ/', partOfSpeech: 'verbs', turkish: 'Fırında pişirmek vs Yağda kızartmak', exampleSentence: 'I prefer baking fish in the oven rather than frying it.' },
    ],
    dialogue: [
      { speaker: 'Chef Emre', text: 'Welcome! Today we are making traditional Menemen. First, dice the green peppers and tomatoes.', turkish: 'Hoş geldiniz! Bugün geleneksel Menemen yapıyoruz. İlk olarak yeşil biberleri ve domatesleri küp küp doğrayın.', avatar: '👨‍🍳' },
      { speaker: 'Student', text: 'Chef, when should we crack the eggs into the pan?', turkish: 'Şefim, yumurtaları tavaya ne zaman kırmalıyız?', avatar: '👩‍🎓' },
      { speaker: 'Chef Emre', text: 'After cooking the tomatoes for 5 minutes, crack the eggs and stir gently!', turkish: 'Domatesleri 5 dakika pişirdikten sonra yumurtaları kırın ve nazikçe karıştırın!', avatar: '👨‍🍳' },
    ],
    practiceQuestions: [
      {
        id: 'q-8-3',
        question: 'Which kitchen utensil is used to DRAIN pasta?',
        options: ['Grater', 'Strainer / Colander', 'Baking tray', 'Rolling pin'],
        correctIndex: 1,
        explanation: 'Makarnanın suyunu süzmek (drain) için süzgeç (strainer / colander) kullanılır.',
      },
    ],
  },

  // ── 9. SINIF (MAARİF MODELİ) ──
  {
    id: 'unit-9-3',
    grade: '9',
    gradeGroup: 'lise',
    unitNumber: 3,
    title: 'Movies and Cinema',
    turkishTitle: 'Sinema & Film Türleri (9. Sınıf Maarif Modeli)',
    themeDesc: 'Film türleri, film hakkındaki kişisel eleştiriler, tercih bildirme yapıları (prefer, would rather).',
    grammarFocus: {
      ruleName: 'Expressing Preferences (Prefer vs Would Rather)',
      formula: 'prefer + Noun / V_ing + TO + Noun / V_ing  |  would rather + V1 + THAN + V1',
      explanation: '"Prefer" edat olarak daima "to" ile kullanılırken, "would rather" çıplak fiil (bare infinitive) alır ve "than" ile kıyaslama yapar.',
      examples: [
        { en: 'I prefer watching sci-fi movies to romantic comedies.', tr: 'Bilim kurgu filmi izlemeyi romantik komedilere tercih ederim.' },
        { en: 'I would rather stay home and watch a thriller than go out.', tr: 'Dışarı çıkmaktansa evde kalıp gerilim filmi izlemeyi yeğlerim.' },
      ],
      examTrap: '"prefer ... than" kullanımı kesinlikle yanlıştır! Sınavlarda "prefer" ile "to", "would rather" ile "than" aranmalıdır.',
    },
    vocabulary: [
      { word: 'Blockbuster', phonetic: '/ˈblɒkˌbʌs.tər/', partOfSpeech: 'noun', turkish: 'Büyük gişe başarısı yakalayan film', exampleSentence: 'The new Marvel movie became an instant blockbuster.' },
      { word: 'Cast', phonetic: '/kɑːst/', partOfSpeech: 'noun', turkish: 'Oyuncu kadrosu', exampleSentence: 'The movie has an all-star cast including famous actors.' },
      { word: 'Plot', phonetic: '/plɒt/', partOfSpeech: 'noun', turkish: 'Filmin / Kitabın konusu', exampleSentence: 'The plot of the thriller kept me guessing until the end.' },
      { word: 'Soundtrack', phonetic: '/ˈsaʊnd.træk/', partOfSpeech: 'noun', turkish: 'Film müzikleri albümü', exampleSentence: 'Hans Zimmer composed the iconic soundtrack for Interstellar.' },
    ],
    dialogue: [
      { speaker: 'Can', text: 'Are you coming to the cinema with us tonight? We are going to watch a horror movie.', turkish: 'Bu akşam bizimle sinemaya geliyor musun? Korku filmi izleyeceğiz.', avatar: '🧑' },
      { speaker: 'Defne', text: 'No thanks! I would rather read a science-fiction book than watch horror films; they give me nightmares.', turkish: 'Hayır teşekkürler! Korku filmi izlemektense bilim kurgu kitabı okumayı yeğlerim; kabus görmeme sebep oluyorlar.', avatar: '👩' },
    ],
    practiceQuestions: [
      {
        id: 'q-9-1',
        question: 'Sarah prefers listening to classical music __________ rock music.',
        options: ['than', 'to', 'from', 'against'],
        correctIndex: 1,
        explanation: '"prefer" fiilinin karşılaştırma edatı daima "to"dur.',
      },
    ],
  },

  // ── 10. SINIF: LEGENDARY FIGURES ──
  {
    id: 'unit-10-3',
    grade: '10',
    gradeGroup: 'lise',
    unitNumber: 3,
    title: 'Legendary Figures',
    turkishTitle: 'Tarihi Efsaneler & Geçmiş Alışkanlıklar (Used To)',
    themeDesc: 'Tarihe yön vermiş liderler, bilim insanları ve geçmişte yapılıp artık terkedilmiş alışkanlıkları anlatma (Used to).',
    grammarFocus: {
      ruleName: 'Used to + V1 (Geçmişteki Alışkanlıklar & Durumlar)',
      formula: 'Affirmative: S + used to + V1  |  Negative: S + didn\'t use to + V1  |  Question: Did + S + use to + V1?',
      explanation: 'Geçmişte düzenli olarak yapılan fakat günümüzde artık yapılmayan durum veya alışkanlıkları ifade eder.',
      examples: [
        { en: 'People used to travel on horses before the invention of steam engines.', tr: 'Buharlı makinelerin icadından önce insanlar atlarla seyahat ederdi.' },
        { en: 'He didn\'t use to read historical books when he was younger.', tr: 'Daha gençken tarih kitapları okumazdı (şimdi okuyor).' },
      ],
      examTrap: 'Olumsuz cümlede "didn\'t used to" değil, "-d" harfi düşerek "didn\'t use to" yazılır!',
    },
    vocabulary: [
      { word: 'Conqueror', phonetic: '/ˈkɒŋ.kər.ər/', partOfSpeech: 'noun', turkish: 'Fatih, Fetheden hükümdar', exampleSentence: 'Mehmed the Conqueror captured Istanbul in 1453.' },
      { word: 'Sacrifice', phonetic: '/ˈsæk.rɪ.faɪs/', partOfSpeech: 'noun/verb', turkish: 'Fedakarlık, Özveri', exampleSentence: 'National heroes made great sacrifices for our independence.' },
      { word: 'Overcome', phonetic: '/ˌəʊ.vəˈkʌm/', partOfSpeech: 'verb', turkish: 'Zorlukların üstesinden gelmek', exampleSentence: 'She overcame many obstacles to become a renowned scientist.' },
    ],
    dialogue: [
      { speaker: 'History Teacher', text: 'How did people communicate across long distances in ancient times?', turkish: 'Eski zamanlarda insanlar uzun mesafeler arasında nasıl iletişim kurardı?', avatar: '👨‍🏫' },
      { speaker: 'Student', text: 'They used to send smoke signals or use carrier pigeons before telegraphs were invented.', turkish: 'Telgraf icat edilmeden önce duman işaretleri gönderir veya posta güvercinleri kullanırlardı.', avatar: '🧑‍🎓' },
    ],
    practiceQuestions: [
      {
        id: 'q-10-1',
        question: 'My grandfather __________ smoke cigarettes, but he quit ten years ago.',
        options: ['used to', 'is used to', 'was used to', 'uses to'],
        correctIndex: 0,
        explanation: 'Geçmişte yapılan fakat 10 yıl önce bırakılan bir alışkanlık "used to + V1" kalıbıyla ifade edilir.',
      },
    ],
  },

  // ── 11. SINIF (YKS / YDT) ──
  {
    id: 'unit-11-1',
    grade: '11',
    gradeGroup: 'lise',
    unitNumber: 1,
    title: 'Future Jobs & Careers',
    turkishTitle: 'Geleceğin Meslekleri & Şart Cümleleri (Conditionals)',
    themeDesc: 'Yapay zeka, biyoteknoloji, veri analizi gibi geleceğin meslekleri; Type 1 & Type 2 koşul cümleleri (Conditionals).',
    grammarFocus: {
      ruleName: 'Conditional Sentences Type 1 (Real) & Type 2 (Unreal / Hypothetical)',
      formula: 'Type 1: If + Present Simple, will + V1  |  Type 2: If + Past Simple, would + V1',
      explanation: 'Gelecekte olması muhtemel durumlar için Type 1; günümüzdeki hayali, varsayımsal durumlar ve tavsiye için Type 2 kullanılır.',
      examples: [
        { en: 'If you learn coding, you will find a tech job easily in the future.', tr: 'Eğer kodlama öğrenirsen, gelecekte kolayca teknoloji işi bulursun. (Type 1)' },
        { en: 'If I were an AI engineer, I would design green energy algorithms.', tr: 'Eğer bir yapay zeka mühendisi olsaydım, yeşil enerji algoritmaları tasarlardım. (Type 2)' },
      ],
      examTrap: 'YDT Tuzağı: Type 2 koşul cümlelerinde "I/he/she/it" özneleriyle geleneksel kural gereği "was" yerine "were" tercih edilir (If I were you...).',
    },
    vocabulary: [
      { word: 'Artificial Intelligence', phonetic: '/ˌɑː.tɪˈfɪʃ.əl ɪnˈtel.ɪ.dʒəns/', partOfSpeech: 'noun', turkish: 'Yapay Zekâ', exampleSentence: 'AI will transform healthcare and autonomous driving.' },
      { word: 'Qualifications', phonetic: '/ˌkwɒl.ɪ.fɪˈkeɪ.ʃənz/', partOfSpeech: 'noun', turkish: 'Nitelikler, Yetkinlikler', exampleSentence: 'Do you meet the necessary qualifications for this internship?' },
      { word: 'Renewable energy', phonetic: '/rɪˈnjuː.ə.bəl ˈen.ə.dʒi/', partOfSpeech: 'noun', turkish: 'Yenilenebilir enerji', exampleSentence: 'Solar panels provide clean renewable energy.' },
    ],
    dialogue: [
      { speaker: 'Career Advisor', text: 'Which field are you planning to specialize in at university?', turkish: 'Üniversitede hangi alanda uzmanlaşmayı planlıyorsun?', avatar: '👩‍💼' },
      { speaker: 'Student', text: 'If I pass the university exam with a high score, I will choose Bioinformatics.', turkish: 'Eğer üniversite sınavını yüksek puanla geçersem Biyoinformatik seçeceğim.', avatar: '🧑‍🎓' },
    ],
    practiceQuestions: [
      {
        id: 'q-11-1',
        question: 'If I __________ enough money right now, I would invest in a robotics startup company.',
        options: ['have', 'had', 'will have', 'have had'],
        correctIndex: 1,
        explanation: 'Sonuç cümlesinde "would + V1" kullanıldığı için bu bir Type 2 Conditional cümlesidir; "if" kısmında Past Simple ("had") gelmelidir.',
      },
    ],
  },

  // ── 12. SINIF (YKS / YDT İLERİ SEVİYE) ──
  {
    id: 'unit-12-3',
    grade: '12',
    gradeGroup: 'lise',
    unitNumber: 3,
    title: 'Cyber World & Artificial Intelligence',
    turkishTitle: 'Siber Dünya & İleri Düzey Çıkarım Kipleri (Modals of Deduction)',
    themeDesc: 'Siber güvenlik, veri etiği, teknolojik devrimler; geçmişe ve günümüze yönelik kesinlik/tahmin bildiren kipler (must have, can\'t have, might have).',
    grammarFocus: {
      ruleName: 'Modals of Deduction in the Past (Geçmişe Dair Mantıksal Çıkarımlar)',
      formula: 'Must have + V3 (Kesinlikle öyleydi) | Can\'t have + V3 (Mümkün değil, olamaz) | Might have + V3 (Olmuş olabilir)',
      explanation: 'Geçmişte gerçekleşen olayların ipuçlarına bakarak mantıksal tahmin yürütürken kullanılır. YDT sınavlarının en popüler dil bilgisi sorularındandır.',
      examples: [
        { en: 'The system crashed; there must have been a severe security breach.', tr: 'Sistem çöktü; ciddi bir güvenlik ihlali yaşanmış olmalı. (Kuvvetli kesinlik)' },
        { en: 'He can\'t have deleted the database intentionally; he is our top engineer.', tr: 'Veri tabanını bilerek silmiş olamaz; o bizim en iyi mühendisimiz.' },
      ],
      examTrap: 'Geçmiş çıkarımlarda "must + V1" yerine mutlaka "must have + V3" yapısı aranmalıdır.',
    },
    vocabulary: [
      { word: 'Data breach', phonetic: '/ˈdeɪ.tə briːtʃ/', partOfSpeech: 'noun', turkish: 'Veri ihlali / Sızıntısı', exampleSentence: 'The bank suffered a major data breach yesterday.' },
      { word: 'Vulnerability', phonetic: '/ˌvʌl.nər.əˈbɪl.ə.ti/', partOfSpeech: 'noun', turkish: 'Sistem açığı / Zafiyeti', exampleSentence: 'Ethical hackers detect vulnerabilities before attackers do.' },
      { word: 'Algorithm', phonetic: '/ˈæl.ɡə.rɪ.ðəm/', partOfSpeech: 'noun', turkish: 'Algoritma', exampleSentence: 'Machine learning algorithms analyze large datasets.' },
    ],
    dialogue: [
      { speaker: 'Analyst A', text: 'Someone accessed the main server at 3 a.m. last night.', turkish: 'Dün gece saat 3\'te ana sunucuya birisi erişim sağlamış.', avatar: '👨‍💻' },
      { speaker: 'Analyst B', text: 'It can\'t have been an outside hacker because multi-factor authentication was active.', turkish: 'Çok faktörlü kimlik doğrulama aktif olduğu için dışarıdan bir bilgisayar korsanı olmuş olamaz.', avatar: '👩‍💻' },
    ],
    practiceQuestions: [
      {
        id: 'q-12-1',
        question: 'The lights of the office were completely off when I arrived. Everyone __________ home already.',
        options: ['must have gone', 'can\'t go', 'should go', 'might go'],
        correctIndex: 0,
        explanation: 'Ofis ışıklarının tamamen kapalı olması geçmişe dair kuvvetli bir kanıttır: "Herkes çoktan eve gitmiş olmalı" (must have gone).',
      },
    ],
  },
]

export function MEBCurriculumEnglishModule() {
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>('8')
  const [selectedUnitId, setSelectedUnitId] = useState<string>('unit-8-1')
  const [accent, setAccent] = useState<EnglishAccent>('en-US')
  const [activeTab, setActiveTab] = useState<'vocab' | 'grammar' | 'dialogue' | 'quiz' | 'exam'>('vocab')

  // Quiz state for current unit
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({})
  const [showQuizResults, setShowQuizResults] = useState(false)

  // Exam Question state
  const [selectedExamKey, setSelectedExamKey] = useState<string | null>(null)
  const [showExamExplanation, setShowExamExplanation] = useState(false)

  const gradeUnits = MEB_ENGLISH_UNITS.filter((u) => u.grade === selectedGrade)
  const currentUnit = MEB_ENGLISH_UNITS.find((u) => u.id === selectedUnitId) || gradeUnits[0] || MEB_ENGLISH_UNITS[0]

  const handleSelectGrade = (g: GradeLevel) => {
    playClickSound()
    setSelectedGrade(g)
    const firstUnit = MEB_ENGLISH_UNITS.find((u) => u.grade === g)
    if (firstUnit) {
      setSelectedUnitId(firstUnit.id)
    }
    setUserAnswers({})
    setShowQuizResults(false)
    setSelectedExamKey(null)
    setShowExamExplanation(false)
  }

  const handleSelectUnit = (uId: string) => {
    playClickSound()
    setSelectedUnitId(uId)
    setUserAnswers({})
    setShowQuizResults(false)
    setSelectedExamKey(null)
    setShowExamExplanation(false)
  }

  const handleSpeak = (text: string) => {
    playSpeech(text, accent)
  }

  const handleAnswerSelect = (qId: string, optIndex: number, correctIndex: number) => {
    if (showQuizResults) return
    setUserAnswers((prev) => ({ ...prev, [qId]: optIndex }))
    if (optIndex === correctIndex) {
      playSuccessFanfare()
    } else {
      playErrorBuzz()
    }
  }

  return (
    <div className="space-y-8">
      {/* ── Top Grade Level Switcher Bar ── */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl backdrop-blur-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-sky-400 text-xs font-black uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>MEB Okul Ders Kitabı Müfredatı</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
              Sınıf Seviyenizi Seçin (5 - 12. Sınıf)
            </h2>
          </div>

          {/* Accent Switcher */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 px-2">Aksan:</span>
            {(['en-US', 'en-GB'] as EnglishAccent[]).map((acc) => (
              <button
                key={acc}
                type="button"
                onClick={() => {
                  playClickSound()
                  setAccent(acc)
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  accent === acc
                    ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {acc === 'en-US' ? '🇺🇸 US' : '🇬🇧 UK'}
              </button>
            ))}
          </div>
        </div>

        {/* Grade Buttons Grid */}
        <div className="mt-4 grid grid-cols-4 sm:grid-cols-8 gap-2">
          {(['5', '6', '7', '8', '9', '10', '11', '12'] as GradeLevel[]).map((g) => {
            const isOrtaokul = Number(g) <= 8
            const isLGS = g === '8'
            const isYKS = g === '12'
            const isSelected = selectedGrade === g

            return (
              <button
                key={g}
                type="button"
                onClick={() => handleSelectGrade(g)}
                className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-sky-500 to-blue-600 text-white border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.35)] scale-[1.03]'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-1">
                  {isOrtaokul ? <School className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
                  <span className="text-sm font-black">{g}. Sınıf</span>
                </div>
                <span
                  className={`text-[9px] font-extrabold uppercase mt-0.5 px-1.5 py-0.2 rounded ${
                    isLGS
                      ? 'bg-amber-400 text-slate-950'
                      : isYKS
                      ? 'bg-rose-500 text-white'
                      : 'text-slate-400'
                  }`}
                >
                  {isLGS ? 'LGS' : isYKS ? 'YKS / YDT' : isOrtaokul ? 'Ortaokul' : 'Lise'}
                </span>
              </button>
            )
          })}
        </div>

        {/* Unit Selector Pills for the chosen grade */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-2">
          {gradeUnits.map((u) => {
            const isUnitActive = currentUnit.id === u.id
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => handleSelectUnit(u.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isUnitActive
                    ? 'bg-sky-950/70 border border-sky-500 text-sky-200 shadow-md shadow-sky-500/15'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="w-5 h-5 rounded-md bg-sky-500/20 text-sky-400 flex items-center justify-center text-[11px] font-black">
                  {u.unitNumber}
                </span>
                <span>{u.title}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Active Unit Workspace ── */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-2xl space-y-6">
        {/* Unit Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-black uppercase tracking-wider mb-1.5">
              <span>MEB {currentUnit.grade}. Sınıf · Ünite {currentUnit.unitNumber}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              {currentUnit.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {currentUnit.turkishTitle} — {currentUnit.themeDesc}
            </p>
          </div>

          {/* Unit Sub-tabs */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-950 border border-slate-800 flex-wrap gap-1">
            <button
              type="button"
              onClick={() => {
                playClickSound()
                setActiveTab('vocab')
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'vocab'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📖 Kelimeler ({currentUnit.vocabulary.length})
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound()
                setActiveTab('grammar')
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'grammar'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📐 Dil Bilgisi & İpuçları
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound()
                setActiveTab('dialogue')
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'dialogue'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              💬 Kitap Diyaloğu
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound()
                setActiveTab('quiz')
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'quiz'
                  ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📝 Alıştırma Testi
            </button>
            {currentUnit.examQuestion && (
              <button
                type="button"
                onClick={() => {
                  playClickSound()
                  setActiveTab('exam')
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === 'exam'
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 font-black'
                    : 'text-amber-400 hover:text-amber-300'
                }`}
              >
                🎯 Çıkmış Soru
              </button>
            )}
          </div>
        </div>

        {/* ── TAB 1: VOCABULARY ── */}
        {activeTab === 'vocab' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                <span>Ders Kitabı Kazanım Kelimeleri</span>
                <span className="text-xs text-slate-400 font-normal">
                  (Hoparlör simgesine basarak telaffuzu dinleyin)
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {currentUnit.vocabulary.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-sky-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white">{item.word}</span>
                        <span className="text-xs text-sky-400/80 font-mono">{item.phonetic}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                        {item.partOfSpeech}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-amber-300 mt-1">
                      {item.turkish}
                    </div>

                    <p className="text-xs text-slate-300 mt-2 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/60 italic leading-relaxed">
                      "{item.exampleSentence}"
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleSpeak(item.word)}
                      className="flex items-center gap-1.5 text-xs font-bold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>Telaffuz Et ({accent.split('-')[1]})</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSpeak(item.exampleSentence)}
                      className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      Cümleyi Oku →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 2: GRAMMAR FOCUS ── */}
        {activeTab === 'grammar' && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-950/30 via-slate-950 to-indigo-950/30 border border-sky-500/30 space-y-4">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-black uppercase tracking-wider">
                <Lightbulb className="w-4 h-4" />
                <span>Ünitenin Hedef Dil Bilgisi Formülü</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {currentUnit.grammarFocus.ruleName}
              </h3>

              {/* Formula Callout */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-sky-500/40 text-sky-300 font-mono text-xs sm:text-sm font-bold shadow-inner">
                {currentUnit.grammarFocus.formula}
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentUnit.grammarFocus.explanation}
              </p>
            </div>

            {/* Examples Grid */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Örnek Cümle Kalıpları
              </h4>
              <div className="space-y-2">
                {currentUnit.grammarFocus.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                        <span>{ex.en}</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{ex.tr}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSpeak(ex.en)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sky-400 hover:bg-slate-900 transition-colors shrink-0 cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Exam Trap Alert */}
            <div className="p-4 rounded-2xl bg-amber-950/25 border border-amber-500/30 text-amber-200 text-xs sm:text-sm leading-relaxed flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-amber-300 block mb-0.5">
                  LGS / YKS Sınav Tuzağı Uyarısı:
                </span>
                {currentUnit.grammarFocus.examTrap}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 3: DIALOGUE ── */}
        {activeTab === 'dialogue' && (
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="text-xs text-slate-400 text-center pb-2">
              Ders kitabındaki karşılıklı konuşmayı dinleyin ve telaffuz refleksinizi geliştirin:
            </div>

            <div className="space-y-3">
              {currentUnit.dialogue.map((line, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3.5 hover:border-sky-500/30 transition-all"
                >
                  <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl shrink-0">
                    {line.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-sky-400">{line.speaker}</span>
                      <button
                        type="button"
                        onClick={() => handleSpeak(line.text)}
                        className="text-slate-400 hover:text-sky-300 p-1 transition-colors cursor-pointer"
                        title="Dinle"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-100 mt-1 leading-relaxed">
                      "{line.text}"
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{line.turkish}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: PRACTICE QUIZ ── */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <div className="text-sm font-bold text-slate-200">
              Üniteyi Pekiştir: Test Sorularını Yanıtla
            </div>

            <div className="space-y-5">
              {currentUnit.practiceQuestions.map((q, qIndex) => {
                const userAns = userAnswers[q.id]
                const isAnswered = userAns !== undefined

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3"
                  >
                    <div className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                      {qIndex + 1}. {q.question}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                        if (isAnswered) {
                          if (optIdx === q.correctIndex) {
                            btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold ring-1 ring-emerald-500/30'
                          } else if (userAns === optIdx) {
                            btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-200 line-through'
                          } else {
                            btnStyle = 'opacity-40 bg-slate-900 border-slate-800 text-slate-400'
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            disabled={isAnswered}
                            onClick={() => handleAnswerSelect(q.id, optIdx, q.correctIndex)}
                            className={`p-3 rounded-xl border text-xs sm:text-sm text-left transition-all cursor-pointer flex items-center justify-between ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {isAnswered && optIdx === q.correctIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                          </button>
                        )
                      })}
                    </div>

                    {isAnswered && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                        💡 <span className="font-bold text-sky-400">Çözüm & Açıklama:</span> {q.explanation}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── TAB 5: EXAM QUESTION (LGS / YKS) ── */}
        {activeTab === 'exam' && currentUnit.examQuestion && (
          <div className="space-y-4">
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-amber-950/30 via-slate-950 to-orange-950/30 border border-amber-500/30 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full uppercase">
                  {currentUnit.examQuestion.year} {currentUnit.examQuestion.examName}
                </span>
                <span className="text-xs text-amber-300/80 font-semibold">
                  MEB Resmi Sınav Sorusu
                </span>
              </div>

              <div className="text-sm sm:text-base font-semibold text-slate-100 leading-relaxed">
                {currentUnit.examQuestion.questionText}
              </div>

              <div className="space-y-2 pt-2">
                {currentUnit.examQuestion.options.map((opt) => {
                  const isAnswered = selectedExamKey !== null
                  let optStyle = 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700'
                  if (isAnswered) {
                    if (opt.key === currentUnit.examQuestion!.correctKey) {
                      optStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold ring-1 ring-emerald-500/30'
                    } else if (selectedExamKey === opt.key) {
                      optStyle = 'bg-rose-950/40 border-rose-500 text-rose-200 line-through'
                    } else {
                      optStyle = 'opacity-40 bg-slate-900 border-slate-800 text-slate-400'
                    }
                  }

                  return (
                    <button
                      key={opt.key}
                      type="button"
                      disabled={isAnswered}
                      onClick={() => {
                        setSelectedExamKey(opt.key)
                        setShowExamExplanation(true)
                        if (opt.key === currentUnit.examQuestion!.correctKey) {
                          playSuccessFanfare()
                        } else {
                          playErrorBuzz()
                        }
                      }}
                      className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm flex items-start gap-3 transition-all cursor-pointer ${optStyle}`}
                    >
                      <span className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                        {opt.key}
                      </span>
                      <span className="leading-relaxed">{opt.text}</span>
                    </button>
                  )
                })}
              </div>

              {showExamExplanation && (
                <div className="mt-4 p-4 rounded-xl bg-slate-900 border border-amber-500/30 text-xs sm:text-sm leading-relaxed text-slate-200">
                  <div className="font-extrabold text-amber-400 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>ÖSYM / MEB Çözüm Mantığı:</span>
                  </div>
                  <p>{currentUnit.examQuestion.explanation}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
