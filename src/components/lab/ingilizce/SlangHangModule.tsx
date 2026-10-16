'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Volume2,
  VolumeX,
  MessageSquare,
  Flame,
  Globe2,
  Info,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Play,
  Shuffle,
  ChevronRight,
} from 'lucide-react'
import { playSpeech, EnglishAccent } from './speechHelper'

interface SlangDefinition {
  phrase: string
  phonetic: string
  meaning: string
  literalMeaning: string
  turkishEquivalent: string
  appropriateness: 'Work-Safe' | 'Casual (Everyday)' | 'Informal Slang' | 'Street / Gen Z'
  example: string
}

interface SlangDialogueLine {
  speaker: string
  avatar: string
  accent: EnglishAccent
  text: string
  highlightedSlang: string[]
  translation: string
}

interface SlangConversation {
  id: string
  title: string
  dialect: 'US' | 'UK' | 'AU'
  accentCode: EnglishAccent
  dialectName: string
  flag: string
  context: string
  characters: { name: string; avatar: string; role: string }[]
  dialogue: SlangDialogueLine[]
  slangGlossary: Record<string, SlangDefinition>
}

const SLANG_CONVERSATIONS: SlangConversation[] = [
  {
    id: 'us-weekend-plans',
    title: 'Weekend Plans & Exam Stress',
    dialect: 'US',
    accentCode: 'en-US',
    dialectName: 'American English (US)',
    flag: '🇺🇸',
    context: 'İki üniversite arkadaşı kahve molasında vize sınavları ve hafta sonu planları hakkında konuşuyor.',
    characters: [
      { name: 'Liam', avatar: '🧢', role: 'Öğrenci (California)' },
      { name: 'Chloe', avatar: '🎧', role: 'Öğrenci (New York)' },
    ],
    dialogue: [
      {
        speaker: 'Liam',
        avatar: '🧢',
        accent: 'en-US',
        text: 'Hey Chloe! You look beat. Did you hit the books all night for the Calculus midterm?',
        highlightedSlang: ['beat', 'hit the books'],
        translation: 'Selam Chloe! Perişan görünüyorsun. Dün gece kalkülüs vizesi için sabaha kadar derslere mi gömüldün?',
      },
      {
        speaker: 'Chloe',
        avatar: '🎧',
        accent: 'en-US',
        text: 'Tell me about it! I thought the exam was going to be a piece of cake, but it was brutal.',
        highlightedSlang: ['piece of cake'],
        translation: 'Hiç sorma! Sınavın çantada keklik olacağını sanıyordum ama acımasızdı.',
      },
      {
        speaker: 'Liam',
        avatar: '🧢',
        accent: 'en-US',
        text: 'Don’t sweat it! At least it’s behind us. Are you going to that rooftop party tonight?',
        highlightedSlang: ['Don’t sweat it'],
        translation: 'Hiç kafana takma! En azından bitti gitti. Bu gece çatı partisine gidiyor musun?',
      },
      {
        speaker: 'Chloe',
        avatar: '🎧',
        accent: 'en-US',
        text: 'Honestly, I’m feeling a bit under the weather. I think I’ll take a rain check and hit the sack early.',
        highlightedSlang: ['under the weather', 'take a rain check', 'hit the sack'],
        translation: 'Dürüst olmak gerekirse kendimi biraz kırgın ve halsiz hissediyorum. Sanırım erteleyip erken kafayı vurup yatacağım.',
      },
      {
        speaker: 'Liam',
        avatar: '🧢',
        accent: 'en-US',
        text: 'Fair enough. Getting some sleep is a total no-brainer. Catch you on Monday!',
        highlightedSlang: ['no-brainer'],
        translation: 'Haklısın. Biraz uyumak tartışmasız en mantıklı karar. Pazartesi görüşürüz!',
      },
    ],
    slangGlossary: {
      beat: {
        phrase: 'Beat (adj.)',
        phonetic: '/biːt/',
        meaning: 'Extremely exhausted, worn out, or drained.',
        literalMeaning: 'Dövülmüş / yenilmiş',
        turkishEquivalent: 'Pili bitmiş / pestili çıkmış',
        appropriateness: 'Casual (Everyday)',
        example: 'After a 10-hour shift, I am totally beat.',
      },
      'hit the books': {
        phrase: 'Hit the books (idiom)',
        phonetic: '/hɪt ðə bʊks/',
        meaning: 'To study intensively, especially before an exam.',
        literalMeaning: 'Kitapları yumruklamak',
        turkishEquivalent: 'Derslere gömülmek / ineklemek',
        appropriateness: 'Work-Safe',
        example: 'I have finals next week, so it’s time to hit the books.',
      },
      'piece of cake': {
        phrase: 'A piece of cake (idiom)',
        phonetic: '/ə piːs əv keɪk/',
        meaning: 'Something very easy and simple to accomplish.',
        literalMeaning: 'Bir dilim pasta',
        turkishEquivalent: 'Çantada keklik / çocuk oyuncağı',
        appropriateness: 'Work-Safe',
        example: 'Don’t worry about the driving test, it’s a piece of cake.',
      },
      'Don’t sweat it': {
        phrase: 'Don’t sweat it (phrase)',
        phonetic: '/doʊnt swet ɪt/',
        meaning: 'Don’t worry about it; no big deal.',
        literalMeaning: 'Bunun için terleme',
        turkishEquivalent: 'Kafana takma / dert etme',
        appropriateness: 'Casual (Everyday)',
        example: 'You forgot your wallet? Don’t sweat it, I got this.',
      },
      'under the weather': {
        phrase: 'Under the weather (idiom)',
        phonetic: '/ˌʌn.dɚ ðə ˈweð.ɚ/',
        meaning: 'Feeling slightly sick, tired, or indisposed.',
        literalMeaning: 'Havanın altında olmak',
        turkishEquivalent: 'Kırgın / hafif hasta / keyifsiz',
        appropriateness: 'Work-Safe',
        example: 'I woke up feeling a bit under the weather with a runny nose.',
      },
      'take a rain check': {
        phrase: 'Take a rain check (idiom)',
        phonetic: '/teɪk ə reɪn tʃek/',
        meaning: 'Politely postpone an invitation to a later date.',
        literalMeaning: 'Yağmur kuponu almak (beyzbol terimi)',
        turkishEquivalent: 'Başka bir sefere ertelemek',
        appropriateness: 'Work-Safe',
        example: 'I’d love to grab dinner, but can I take a rain check?',
      },
      'hit the sack': {
        phrase: 'Hit the sack (idiom)',
        phonetic: '/hɪt ðə sæk/',
        meaning: 'To go to bed and sleep.',
        literalMeaning: 'Çuvala vurmak',
        turkishEquivalent: 'Kafayı vurup yatmak',
        appropriateness: 'Casual (Everyday)',
        example: 'It’s already past midnight, I’m going to hit the sack.',
      },
      'no-brainer': {
        phrase: 'A no-brainer (noun/idiom)',
        phonetic: '/ˈnoʊˌbreɪ.nɚ/',
        meaning: 'A decision that is ridiculously easy and requires no thought.',
        literalMeaning: 'Beyin gerektirmeyen',
        turkishEquivalent: 'Tartışmasız en mantıklı karar / çocuk oyuncağı seçim',
        appropriateness: 'Casual (Everyday)',
        example: 'Accepting the scholarship was a total no-brainer for him.',
      },
    },
  },
  {
    id: 'uk-pub-banter',
    title: 'London Catch-up & Football Banter',
    dialect: 'UK',
    accentCode: 'en-GB',
    dialectName: 'British English (UK)',
    flag: '🇬🇧',
    context: 'İki Londralı arkadaş maç sonrasında çay/kahve eşliğinde haftalık dedikoduları paylaşıyor.',
    characters: [
      { name: 'Oliver', avatar: '☕', role: 'Mimar (London)' },
      { name: 'Harry', avatar: '🧣', role: 'Tasarımcı (Manchester)' },
    ],
    dialogue: [
      {
        speaker: 'Oliver',
        avatar: '☕',
        accent: 'en-GB',
        text: 'Alright mate? You look completely knackered! Rough week at the office?',
        highlightedSlang: ['Alright mate', 'knackered'],
        translation: 'Naber dostum? Tamamen bitkin görünüyorsun! Ofiste zor bir hafta mıydı?',
      },
      {
        speaker: 'Harry',
        avatar: '🧣',
        accent: 'en-GB',
        text: 'Mate, the client threw a spanner in the works at the eleventh hour. I was proper gutted.',
        highlightedSlang: ['threw a spanner in the works', 'proper', 'gutted'],
        translation: 'Dostum, müşteri son dakikada işin içine etti (tekerimize çomak soktu). Resmen kahroldum.',
      },
      {
        speaker: 'Oliver',
        avatar: '☕',
        accent: 'en-GB',
        text: 'That sounds dodgy as hell. But hey, Arsenal won the derby yesterday, so you must be chuffed to bits!',
        highlightedSlang: ['dodgy', 'chuffed to bits'],
        translation: 'Kulağa fena halde şüpheli/sıkıntılı geliyor. Ama Arsenal dünkü derbiyi kazandı, havalara uçmuş olmalısın!',
      },
      {
        speaker: 'Harry',
        avatar: '🧣',
        accent: 'en-GB',
        text: 'Spot on! Saka scored a screamer in extra time. Fancy a proper cup of tea?',
        highlightedSlang: ['Spot on', 'screamer', 'Fancy a proper cup of tea'],
        translation: 'Tam üstüne bastın! Saka uzatmalarda füze gibi bir gol attı. Güzel bir tavşan kanı çay içer miyiz?',
      },
      {
        speaker: 'Oliver',
        avatar: '☕',
        accent: 'en-GB',
        text: 'Sounds brilliant. Kettle’s on, and Bob’s your uncle!',
        highlightedSlang: ['Bob’s your uncle'],
        translation: 'Harika fikir. Kettle kaynıyor, işte bu kadar basit!',
      },
    ],
    slangGlossary: {
      'Alright mate': {
        phrase: 'Alright mate? (greeting)',
        phonetic: '/ɔːlˈraɪt meɪt/',
        meaning: 'Standard informal British greeting meaning "How are you doing?".',
        literalMeaning: 'Tamam mısın dostum?',
        turkishEquivalent: 'Naber / nasıl gidiyor dostum?',
        appropriateness: 'Casual (Everyday)',
        example: '“Alright mate?” — “Not bad, yourself?”',
      },
      knackered: {
        phrase: 'Knackered (adj.)',
        phonetic: '/ˈnæk.əd/',
        meaning: 'Extremely exhausted, dead tired (distinctly British).',
        literalMeaning: 'Eski at mezbahasına gönderilmiş (knacker)',
        turkishEquivalent: 'Canı çıkmış / pestili çıkmış',
        appropriateness: 'Casual (Everyday)',
        example: 'I’ve been on my feet all day, I’m absolutely knackered.',
      },
      'threw a spanner in the works': {
        phrase: 'Throw a spanner in the works (idiom)',
        phonetic: '/θrəʊ ə ˈspæn.ə r ɪn ðə wɜːks/',
        meaning: 'To disrupt a plan, process, or project at the last minute.',
        literalMeaning: 'Çarkların arasına İngiliz anahtarı fırlatmak',
        turkishEquivalent: 'Tekere çomak sokmak / planı altüst etmek',
        appropriateness: 'Work-Safe',
        example: 'Losing that budget threw a spanner in the works.',
      },
      proper: {
        phrase: 'Proper (adv. / adj.)',
        phonetic: '/ˈprɒp.ər/',
        meaning: 'British intensifier meaning "thoroughly", "genuinely", or "completely".',
        literalMeaning: 'Düzgün / uygun',
        turkishEquivalent: 'Harbiden / tam anlamıyla',
        appropriateness: 'Informal Slang',
        example: 'It was a proper good film.',
      },
      gutted: {
        phrase: 'Gutted (adj.)',
        phonetic: '/ˈɡʌt.ɪd/',
        meaning: 'Bitterly disappointed, devastated, or heartbroken.',
        literalMeaning: 'İç organları deşilmiş',
        turkishEquivalent: 'Kahrolmuş / içi parçalanmış',
        appropriateness: 'Casual (Everyday)',
        example: 'When we conceded in the 90th minute, I was gutted.',
      },
      dodgy: {
        phrase: 'Dodgy (adj.)',
        phonetic: '/ˈdɒdʒ.i/',
        meaning: 'Suspicious, unreliable, questionable, or risky.',
        literalMeaning: 'Sürekli kaçamak yapan',
        turkishEquivalent: 'Tirink / şüpheli / tekin olmayan',
        appropriateness: 'Informal Slang',
        example: 'That website looks a bit dodgy, don’t enter your password.',
      },
      'chuffed to bits': {
        phrase: 'Chuffed to bits (idiom)',
        phonetic: '/tʃʌft tə bɪts/',
        meaning: 'Extremely pleased, proud, and delighted with oneself.',
        literalMeaning: 'Parçalara ayrılacak kadar memnun',
        turkishEquivalent: 'Ağzı kulaklarına varmak / havalara uçmak',
        appropriateness: 'Casual (Everyday)',
        example: 'She got accepted into Oxford and is chuffed to bits!',
      },
      'Spot on': {
        phrase: 'Spot on (phrase)',
        phonetic: '/spɒt ɒn/',
        meaning: 'Completely accurate, exact, or correct.',
        literalMeaning: 'Noktanın üstünde',
        turkishEquivalent: 'Tam üstüne bastın / nokta atışı',
        appropriateness: 'Work-Safe',
        example: 'Your market analysis was spot on.',
      },
      screamer: {
        phrase: 'A screamer (noun/slang)',
        phonetic: '/ˈskriː.mər/',
        meaning: 'In football/soccer, a breathtaking, powerful long-range goal.',
        literalMeaning: 'Çığlık attıran',
        turkishEquivalent: 'Füze gibi gol / doksana takılan şut',
        appropriateness: 'Casual (Everyday)',
        example: 'He scored an absolute screamer from 30 yards out.',
      },
      'Fancy a proper cup of tea': {
        phrase: 'Fancy a...? (phrase)',
        phonetic: '/ˈfæn.si ə/',
        meaning: 'British way of saying "Would you like / Do you feel like having...?"',
        literalMeaning: 'Hayal eder misin?',
        turkishEquivalent: 'İster misin / bir çay içer miyiz?',
        appropriateness: 'Casual (Everyday)',
        example: 'Fancy a coffee before the lecture?',
      },
      'Bob’s your uncle': {
        phrase: 'Bob’s your uncle (idiom)',
        phonetic: '/bɒbz jɔːr ˈʌŋ.kəl/',
        meaning: 'Said when something is accomplished quickly and simply: "And there you have it!"',
        literalMeaning: 'Bob senin amcan/dayın',
        turkishEquivalent: 'İşte bu kadar basit / tereyağından kıl çeker gibi!',
        appropriateness: 'Informal Slang',
        example: 'Just press this green button, and Bob’s your uncle!',
      },
    },
  },
  {
    id: 'au-sydney-beach',
    title: 'Surfing & Barbecue Banter',
    dialect: 'AU',
    accentCode: 'en-AU',
    dialectName: 'Australian English (AU)',
    flag: '🇦🇺',
    context: 'Bondi sahilinde sörf yapan iki arkadaş hafta sonu barbeküsü (barbie) organize ediyor.',
    characters: [
      { name: 'Jack', avatar: '🏄‍♂️', role: 'Sörfçü (Sydney)' },
      { name: 'Mia', avatar: '🦘', role: 'Fotoğrafçı (Melbourne)' },
    ],
    dialogue: [
      {
        speaker: 'Jack',
        avatar: '🏄‍♂️',
        accent: 'en-AU',
        text: 'G’day Mia! How were the waves this morning? Stoked with your session?',
        highlightedSlang: ['G’day', 'Stoked'],
        translation: 'Selam Mia! Bu sabah dalgalar nasıldı? Sörf seansından memnun musun?',
      },
      {
        speaker: 'Mia',
        avatar: '🦘',
        accent: 'en-AU',
        text: 'Fair dinkum, Jack, the swell was massive! I was flat out like a lizard drinking just trying to paddle back out.',
        highlightedSlang: ['Fair dinkum', 'flat out like a lizard drinking'],
        translation: 'Harbi söylüyorum Jack, dalga kabarması devasaydı! Tekrar açığa kürek çekebilmek için canım çıktı.',
      },
      {
        speaker: 'Jack',
        avatar: '🏄‍♂️',
        accent: 'en-AU',
        text: 'Haha, classic! Are we still firing up the barbie this arvo?',
        highlightedSlang: ['barbie', 'arvo'],
        translation: 'Haha, klasik! Bu öğleden sonra mangalı yakıyor muyuz?',
      },
      {
        speaker: 'Mia',
        avatar: '🦘',
        accent: 'en-AU',
        text: 'No worries at all! Bring some snags and I’ll sort out the cold drinks.',
        highlightedSlang: ['No worries at all', 'snags'],
        translation: 'Hiç dert değil! Biraz sosis kap gel, soğuk içecekleri ben hallederim.',
      },
    ],
    slangGlossary: {
      'G’day': {
        phrase: 'G’day (greeting)',
        phonetic: '/ɡəˈdeɪ/',
        meaning: 'Iconic Australian greeting for "Good day / Hello".',
        literalMeaning: 'İyi günler',
        turkishEquivalent: 'Selam / günaydın millet',
        appropriateness: 'Casual (Everyday)',
        example: 'G’day mate, how are ya?',
      },
      Stoked: {
        phrase: 'Stoked (adj.)',
        phonetic: '/stoʊkt/',
        meaning: 'Extremely excited, pumped, and happy (surf culture).',
        literalMeaning: 'Ateşlenmiş / kömür atılmış',
        turkishEquivalent: 'Gözü parlayan / mest olmuş / heyecanlı',
        appropriateness: 'Informal Slang',
        example: 'I’m stoked to see you all here.',
      },
      'Fair dinkum': {
        phrase: 'Fair dinkum (idiom / exclamation)',
        phonetic: '/feər ˈdɪŋ.kəm/',
        meaning: 'Authentic, genuine, true; or expressing "seriously / honestly".',
        literalMeaning: 'Dürüst çalışma / madenci terimi',
        turkishEquivalent: 'Harbiden / vallahi / sahiden söylüyorum',
        appropriateness: 'Casual (Everyday)',
        example: 'Is that story fair dinkum or are you pulling my leg?',
      },
      'flat out like a lizard drinking': {
        phrase: 'Flat out like a lizard drinking (idiom)',
        phonetic: '/flæt aʊt laɪk ə ˈlɪz.əd ˈdrɪŋ.kɪŋ/',
        meaning: 'Extremely busy and working at maximum speed.',
        literalMeaning: 'Su içen kertenkele gibi yere yapışıp hızla çalışan',
        turkishEquivalent: 'Arı gibi çalışan / canı çıkan / başını kaşıyacak vakti olmayan',
        appropriateness: 'Informal Slang',
        example: 'We were flat out like a lizard drinking all afternoon.',
      },
      barbie: {
        phrase: 'Barbie (noun)',
        phonetic: '/ˈbɑː.bi/',
        meaning: 'Barbecue (BBQ grill party).',
        literalMeaning: 'Oyuncak bebek değil, mangal!',
        turkishEquivalent: 'Mangal / barbekü',
        appropriateness: 'Casual (Everyday)',
        example: 'Let’s throw some prawns on the barbie.',
      },
      arvo: {
        phrase: 'Arvo (noun)',
        phonetic: '/ˈɑː.voʊ/',
        meaning: 'Afternoon (Aussie abbreviation).',
        literalMeaning: 'Öğleden sonra',
        turkishEquivalent: 'Öğleden sonra / ikindi vakti',
        appropriateness: 'Casual (Everyday)',
        example: 'See you this arvo at the gym.',
      },
      'No worries at all': {
        phrase: 'No worries at all (phrase)',
        phonetic: '/noʊ ˈwʌr.iz æt ɔːl/',
        meaning: 'You’re welcome / it’s completely fine / don’t fret.',
        literalMeaning: 'Hiç endişe yok',
        turkishEquivalent: 'Rica ederim / lafı bile olmaz / sıkıntı yok',
        appropriateness: 'Work-Safe',
        example: '“Thanks for helping out!” — “No worries at all, mate!”',
      },
      snags: {
        phrase: 'Snags (noun)',
        phonetic: '/snæɡz/',
        meaning: 'Sausages for grilling.',
        literalMeaning: 'Kancalar değil, ızgara sosis!',
        turkishEquivalent: 'Izgara sosis / sucuk',
        appropriateness: 'Casual (Everyday)',
        example: 'Grab a pack of snags from the butcher.',
      },
    },
  },
]

export function SlangHangModule() {
  const [selectedConvoId, setSelectedConvoId] = useState<string>(SLANG_CONVERSATIONS[0].id)
  const [activeSlangPhrase, setActiveSlangPhrase] = useState<string | null>(null)
  const [activeLineIdx, setActiveLineIdx] = useState<number>(0)
  const [activeSpeechText, setActiveSpeechText] = useState<string | null>(null)

  const currentConvo =
    SLANG_CONVERSATIONS.find((c) => c.id === selectedConvoId) || SLANG_CONVERSATIONS[0]

  const activeSlangDetail: SlangDefinition | null =
    activeSlangPhrase && currentConvo.slangGlossary[activeSlangPhrase]
      ? currentConvo.slangGlossary[activeSlangPhrase]
      : null

  const handlePlayAudio = (text: string, accent: EnglishAccent) => {
    setActiveSpeechText(text)
    playSpeech(text, accent, 0.95, () => {
      setActiveSpeechText(null)
    })
  }

  const handleSelectConvo = (id: string) => {
    setSelectedConvoId(id)
    setActiveSlangPhrase(null)
    setActiveLineIdx(0)
  }

  // Helper to render text with clickable highlighted slang words
  const renderInteractiveLine = (line: SlangDialogueLine) => {
    // Sort highlighted slang by longest first to match correctly
    const sortedSlang = [...line.highlightedSlang].sort((a, b) => b.length - a.length)

    // Tokenize
    const regex = new RegExp(`(${sortedSlang.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi')
    const parts = line.text.split(regex)

    return (
      <p className="text-sm sm:text-base font-medium text-slate-100 leading-relaxed">
        {parts.map((part, pIdx) => {
          const matchedKey = sortedSlang.find((s) => s.toLowerCase() === part.toLowerCase())
          if (matchedKey) {
            const isSelected = activeSlangPhrase?.toLowerCase() === matchedKey.toLowerCase()
            return (
              <button
                key={pIdx}
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveSlangPhrase(matchedKey)
                }}
                className={`inline-flex items-center px-1.5 py-0.5 mx-0.5 rounded-md font-bold transition-all cursor-pointer underline decoration-2 underline-offset-4 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 decoration-amber-600 shadow-md shadow-amber-400/30'
                    : 'bg-amber-500/10 text-amber-300 decoration-amber-400/60 hover:bg-amber-500/25 hover:text-amber-100'
                }`}
                title="Deyim Detayını Gör"
              >
                {part}
              </button>
            )
          }
          return <span key={pIdx}>{part}</span>
        })}
      </p>
    )
  }

  return (
    <div className="space-y-8">
      {/* ── Subheader ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-rose-950/30 border border-amber-500/20 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              DersoLab — Yaşayan Dil & Deyimler
            </span>
            <span className="text-xs text-slate-400">Doğal Diyalog & Yerel Deyimler</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-400" />
            Doğal Konuşma & Sokak Deyimleri (Slang & Idioms)
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Amerikan, İngiliz ve Avustralya sokak jargonu, kültürel deyimler ve argo ifadeler. Altı çizili deyimlere dokunarak gerçek anlamı ve Türkçe karşılıklarını keşfedin.
          </p>
        </div>

        {/* Dialect Selector */}
        <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 self-start md:self-auto">
          {SLANG_CONVERSATIONS.map((c) => (
            <button
              key={c.id}
              onClick={() => handleSelectConvo(c.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                c.id === currentConvo.id
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <span>{c.flag}</span>
              <span>{c.dialect}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Main Layout: Dialogue on Left, Active Slang Breakdown on Right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Dialogue View (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{currentConvo.flag}</span>
              <div>
                <h3 className="text-base font-bold text-white">{currentConvo.title}</h3>
                <p className="text-xs text-slate-400">{currentConvo.context}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {currentConvo.dialectName}
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {currentConvo.dialogue.map((line, idx) => {
              const isSpeaking = activeSpeechText === line.text
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/90 hover:border-slate-700 transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{line.avatar}</span>
                      <span className="text-xs font-bold text-white">{line.speaker}</span>
                    </div>

                    <button
                      onClick={() => handlePlayAudio(line.text, line.accent)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        isSpeaking
                          ? 'bg-amber-500 text-slate-950 border-amber-400 animate-pulse'
                          : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                      }`}
                      title="Seslendir"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Highlighted text with interactive buttons */}
                  {renderInteractiveLine(line)}

                  {/* Turkish translation */}
                  <p className="text-xs text-slate-400 pt-1 border-t border-slate-800/60">
                    🇹🇷 {line.translation}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Slang Glossary & Detail Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-20">
          
          {/* Active Slang Breakdown Card */}
          <AnimatePresence mode="wait">
            {activeSlangDetail ? (
              <motion.div
                key={activeSlangDetail.phrase}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-5 rounded-2xl bg-gradient-to-b from-amber-950/40 to-slate-900 border border-amber-400/50 shadow-[0_0_25px_rgba(245,158,11,0.2)] space-y-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Seçilen Deyim / Slang
                    </span>
                    <h3 className="text-xl font-extrabold text-white mt-1">
                      {activeSlangDetail.phrase}
                    </h3>
                    <div className="font-mono text-xs text-sky-400">{activeSlangDetail.phonetic}</div>
                  </div>

                  <button
                    onClick={() => handlePlayAudio(activeSlangDetail.phrase, currentConvo.accentCode)}
                    className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-all cursor-pointer shadow-md shadow-amber-500/30"
                    title="Telaffuzu Dinle"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Appropriateness badge */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Kullanım Yeri:</span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      activeSlangDetail.appropriateness === 'Work-Safe'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {activeSlangDetail.appropriateness}
                  </span>
                </div>

                {/* Real Meaning */}
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Gerçek Anlamı (Real Meaning):
                  </div>
                  <div className="text-sm font-semibold text-white">
                    {activeSlangDetail.meaning}
                  </div>
                </div>

                {/* Literal vs Turkish Equivalent */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-0.5">
                    <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                      Kelime Kelime (Literal):
                    </div>
                    <div className="text-xs text-rose-200">{activeSlangDetail.literalMeaning}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-0.5">
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                      Benzer Türkçe Deyim:
                    </div>
                    <div className="text-xs font-bold text-emerald-200">
                      {activeSlangDetail.turkishEquivalent}
                    </div>
                  </div>
                </div>

                {/* Example sentence */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 italic">
                  “{activeSlangDetail.example}”
                </div>
              </motion.div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center">
                  <Info className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">Deyim Keşif Kutusu</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Sol taraftaki konuşma balonlarında sarı renkle vurgulanmış deyim veya argo kelimelere tıklayarak derinlemesine anlamını ve Türkçe benzerini görün.
                </p>
              </div>
            )}
          </AnimatePresence>

          {/* Quick Slang Tag Cloud */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Bu Bölümdeki Deyimler</span>
              <span className="text-[10px] text-amber-400">
                {Object.keys(currentConvo.slangGlossary).length} İfade
              </span>
            </h4>

            <div className="flex flex-wrap gap-1.5">
              {Object.keys(currentConvo.slangGlossary).map((phraseKey) => {
                const isSelected = activeSlangPhrase === phraseKey
                return (
                  <button
                    key={phraseKey}
                    onClick={() => setActiveSlangPhrase(phraseKey)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                        : 'bg-slate-800/80 text-slate-300 border border-slate-700/80 hover:bg-slate-700'
                    }`}
                  >
                    {phraseKey}
                  </button>
                )
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
