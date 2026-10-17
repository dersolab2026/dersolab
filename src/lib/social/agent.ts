import { GoogleGenAI } from '@google/genai'
import type {
  CarouselSlide,
  GeneratePostRequest,
  InstagramContentType,
  ReelsStoryboard,
  SinglePostData,
  SocialPostItem,
  WeeklyCalendarRequest,
} from '@/types/social'

const SYSTEM_INSTRUCTION = `Sen DersoLab'ın Baş Sosyal Medya Büyüme ve İçerik Ajanısın (Instagram Growth Lead & Creative Strategist).

DERSOLAB HAKKINDA:
- DersoLab, YKS (TYT / AYT) ve LGS öğrencilerine yönelik yeni nesil bir dijital eğitim, 1'e 1 özel ders, koçluk ve inovatif öğrenme laboratuvarı (L.A.B.) platformudur.
- Bünyesindeki özel araçlar:
  1. L.A.B. Bionic Speed Reader (Biyonik Hızlı Paragraf Okuma)
  2. L.A.B. Phonetic Inspector (Türkçe Ses Bilgisi & Yazım Kuralları Müfettişi)
  3. Netlerim & Deneme Takip Sistemi (Öğrencinin net grafiğini analiz eder)
  4. AI Soru Asistanı (Fotoğrafını çek, anında adım adım çöz)
  5. 1'e 1 Canlı Ders ve Sınav Koçluğu
- Maskot: Zeki, dinamik ve sevimli Tilki (Fox).
- Marka Renkleri & Havası: Koyu uzay siyahı, siber camgöbeği (cyan) ve enerjik neon turuncu (orange).
- Instagram Hesabı: @dersolabegitim

HEDEF KİTLE VE İÇERİK DİLİ:
- 14-19 yaş arası sınav hazırlığı yapan öğrenciler ve ebeveynler.
- Dil samimi, motive edici, sınav jargonuna hakim (ÖSYM mantığı, net artırma, süre yetiştirme, turlama taktiği, paragraf püf noktaları, TYT matematik tuzakları).
- Asla yapay, sıkıcı veya ansiklopedik yazma! Doğrudan etkileşim, "Kaydet", "Arkadaşına Gönder" ve "Biyodaki linke tıkla" psikolojisini tetikle.

ÇIKTI FORMATI:
Sadece ve sadece istenilen JSON formatında yanıt ver. Markdown blokları (\`\`\`json ... \`\`\`) içine alarak ver.`

/**
 * Tekil Instagram Gönderisi Üretir
 */
export async function generateSocialPost(request: GeneratePostRequest): Promise<SocialPostItem> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return generateLocalFallbackPost(request)
  }

  try {
    const ai = new GoogleGenAI({ apiKey })

    const userPrompt = `
Lütfen aşağıdaki parametrelere göre 1 adet yüksek etkileşimli Instagram içeriği üret:
- İçerik Tipi: ${request.type} (${request.type === 'carousel' ? 'Kaydırmalı Carousel' : request.type === 'reels' ? 'Reels / Kısa Video Senaryosu' : 'Tekli Görsel / Günün Sorusu'})
- Konu Kategorisi: ${request.topic}
${request.subject ? `- İlgili Ders / Branş: ${request.subject}` : '- İlgili Ders: İlgili sınav seviyesine göre en uygun branşı kendin seç'}
${request.subTopic ? `- Odak Konu / Ünite: ${request.subTopic}` : ''}
- Hedef Kitle: ${request.targetGrade || 'YKS (TYT/AYT)'}
- Ton: ${request.tone || 'energetic'}
${request.customPrompt ? `- Özel Talimat / Ekstra Not: ${request.customPrompt}` : ''}

Yanıtını kesinlikle şu JSON şemasına uygun döndür:
{
  "title": "İçerik başlığı",
  "topicLabel": "Konu etiketi (örn: TYT Matematik, Hızlı Okuma, vb.)",
  "targetAudience": "YKS 2026 Adayları",
  "caption": "Instagram gönderi açıklaması (Emojili, kancalı, CTA'li)",
  "hashtags": ["#yks2026", "#tytmatematik", "#dersolab", "#ykskocluk"],
  ${
    request.type === 'carousel'
      ? `"carouselSlides": [
    {
      "slideNumber": 1,
      "badge": "TYT MATEMATİK",
      "headline": "Vurucu Kapak Başlığı",
      "subhead": "Merak uyandırıcı alt başlık",
      "bodyPoints": ["Neden bu konuyu kaçırıyorsun?", "Kaydır ve püf noktayı kap 👉"],
      "highlightTag": "KAYDETMELİK",
      "footerNote": "DersoLab • Sınav Laboratuvarı",
      "themeVariant": "lab_dark" // "lab_dark" | "neon_orange" | "cyan_cyber" | "purple_matrix"
    },
    {
      "slideNumber": 2,
      "badge": "1. ADIM",
      "headline": "Kural veya Püf Nokta Başlığı",
      "subhead": "Önemli açıklama",
      "bodyPoints": ["Madde 1", "Madde 2", "Örnek soru mantığı"],
      "highlightTag": "ÖNEMLİ",
      "footerNote": "DersoLab",
      "themeVariant": "neon_orange"
    },
    {
      "slideNumber": 3,
      "badge": "ÖZET & CTA",
      "headline": "Netlerini Artırmak Bu Kadar Kolay",
      "subhead": "Biyodaki linkten ücretsiz deneme dersini kap!",
      "bodyPoints": ["Bu postu kaydet, tekrar bak", "Çalışma arkadaşına gönder", "DersoLab L.A.B.'ı ücretsiz dene"],
      "highlightTag": "LİNK BİYODA",
      "footerNote": "@dersolabegitim",
      "themeVariant": "cyan_cyber"
    }
  ]`
      : request.type === 'reels'
        ? `"reelsStoryboard": {
    "hook3s": "İlk 3 saniye kancası: (Kameraya şaşkın bakarak) 'Hala paragraf sorularını baştan sona okuyorsan bu 15 dakikanı çöpe atıyorsun!'",
    "visualDirection": "Kamera masada, arkada DersoLab açık ekranı var. Ekrana hızlı okuma grafiği geliyor.",
    "spokenScript": "Tam konuşma metni...",
    "onScreenText": ["Paragrafa Baştan Başlama!", "Önce Soru Kökü!", "+5 Net Garantisi"],
    "musicAudioVibe": "Hızlı, dinamik Lo-Fi veya trend Synthwave beat",
    "callToAction": "Paragraf hızını 2 katına çıkarmak için profildeki L.A.B. Bionic Reader'ı hemen test et!"
  }`
        : `"singlePostData": {
    "badge": "GÜNÜN ÖSYM SORUSU",
    "headline": "Bu Soruyu Adayların %80'i Yanlış Çözdü!",
    "questionOrSummary": "Sorunun metni veya özet ipucu...",
    "keyTakeaway": "Püf nokta: ÖSYM burada kelime oyununa başvuruyor.",
    "options": [
      { "key": "A", "text": "Cevap seçeneği A", "isCorrect": false },
      { "key": "B", "text": "Cevap seçeneği B", "isCorrect": true },
      { "key": "C", "text": "Cevap seçeneği C", "isCorrect": false },
      { "key": "D", "text": "Cevap seçeneği D", "isCorrect": false }
    ],
    "themeVariant": "neon_orange"
  }`
  }
}
`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 2500,
      },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    })

    const rawText = response.text || ''
    const cleanJson = extractJsonFromText(rawText)
    const parsed = JSON.parse(cleanJson)

    return {
      id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: parsed.title || 'DersoLab Instagram İçeriği',
      type: request.type,
      topic: request.topic,
      topicLabel: parsed.topicLabel || 'Eğitim & Sınav',
      status: 'draft',
      caption: parsed.caption || '',
      hashtags: parsed.hashtags || ['#dersolab', '#yks2026'],
      targetAudience: parsed.targetAudience || request.targetGrade || 'YKS Adayları',
      carouselSlides: parsed.carouselSlides,
      singlePostData: parsed.singlePostData,
      reelsStoryboard: parsed.reelsStoryboard,
      createdAt: new Date().toISOString(),
    }
  } catch (err) {
    console.warn('Gemini API post generation failed, falling back to local generator:', err)
    return generateLocalFallbackPost(request)
  }
}

/**
 * 7 Günlük Instagram İçerik Takvimi Üretir
 */
export async function generateWeeklyCalendar(request: WeeklyCalendarRequest): Promise<SocialPostItem[]> {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return generateLocalWeeklyCalendar(request)
  }

  try {
    const ai = new GoogleGenAI({ apiKey })

    const userPrompt = `
DersoLab (@dersolabegitim) için Instagram'da 7 GÜNLÜK tam bir içerik takvimi üret.
Haftanın her gününe (Pazartesi'den Pazar'a) tam 1 gönderi planla.

Format Dağılımı:
1. Pazartesi: CAROUSEL (Haftalık Çalışma & Planlama Taktikleri)
2. Salı: REELS (Hızlı Ders İpucu & Kanca)
3. Çarşamba: CAROUSEL (Ders Konusu Püf Noktası - Örn: Paragraf veya Matematik)
4. Perşembe: POST (Günün Şaşırtmalı ÖSYM Sorusu / Mini Quiz)
5. Cuma: REELS (DersoLab L.A.B. Özelliği - Bionic Reader veya Fonetik Müfettişi ile Net Kurtarma)
6. Cumartesi: CAROUSEL (Deneme Analizi & Hataları Fırsata Çevirme)
7. Pazar: REELS veya POST (Pazar Motivasyonu & Sınav Koçluğu Tavsiyesi)

Kitle: ${request.targetGrade || 'YKS (TYT/AYT)'}
${request.focusSubject ? `Öncelikli Branş: ${request.focusSubject}` : ''}
${request.customInstructions ? `Ekstra Notlar: ${request.customInstructions}` : ''}

Yanıtını kesinlikle 7 elemanlı bir JSON dizisi [ ... ] olarak döndür. Her bir eleman tam SocialPostItem yapısında olmalı:
[
  {
    "title": "Pazartesi: ...",
    "type": "carousel",
    "topic": "weekly_plan",
    "topicLabel": "Çalışma Disiplini",
    "targetAudience": "YKS 2026",
    "caption": "...",
    "hashtags": ["#yks2026", "#dersolab"],
    "carouselSlides": [ ... en az 4 slayt ... ]
  },
  ...
]
`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        maxOutputTokens: 6000,
      },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
    })

    const rawText = response.text || ''
    const cleanJson = extractJsonFromText(rawText)
    const list = JSON.parse(cleanJson)

    if (Array.isArray(list)) {
      return list.map((item, idx) => ({
        id: `post_week_${Date.now()}_${idx}`,
        title: item.title || `Gün ${idx + 1} İçeriği`,
        type: item.type || (idx % 2 === 0 ? 'carousel' : 'reels'),
        topic: item.topic || 'exam_tactics',
        topicLabel: item.topicLabel || 'DersoLab',
        status: 'draft',
        caption: item.caption || '',
        hashtags: item.hashtags || ['#dersolab', '#yks'],
        targetAudience: item.targetAudience || request.targetGrade || 'YKS Adayları',
        carouselSlides: item.carouselSlides,
        singlePostData: item.singlePostData,
        reelsStoryboard: item.reelsStoryboard,
        createdAt: new Date().toISOString(),
      }))
    }
    return generateLocalWeeklyCalendar(request)
  } catch (err) {
    console.warn('Gemini weekly calendar error, falling back:', err)
    return generateLocalWeeklyCalendar(request)
  }
}

function extractJsonFromText(text: string): string {
  const match = text.match(/```json([\s\S]*?)```/)
  if (match && match[1]) {
    return match[1].trim()
  }
  const genericMatch = text.match(/```([\s\S]*?)```/)
  if (genericMatch && genericMatch[1]) {
    return genericMatch[1].trim()
  }
  return text.trim()
}

/**
 * Zengin Yedek / Yerel İçerik Üreteci (API Anahtarı olmadığı veya hata durumunda)
 */
function generateLocalFallbackPost(request: GeneratePostRequest): SocialPostItem {
  const now = Date.now()

  if (request.type === 'carousel') {
    return {
      id: `post_${now}_car`,
      title: 'TYT Türkçede Süre Kazandıran 4 Altın Taktik',
      type: 'carousel',
      topic: request.topic,
      topicLabel: 'TYT Türkçe & Hızlı Okuma',
      status: 'draft',
      targetAudience: request.targetGrade || 'YKS (TYT/AYT)',
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
            'Soru kökündeki olumsuz ifadeyi (değinilmemiştir/çıkarılamaz) daire içine al.',
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
    }
  }

  if (request.type === 'reels') {
    return {
      id: `post_${now}_reel`,
      title: 'Reels: 30 Saniyede Fonetik Müfettişi ile Yazım Kuralı Hilesi',
      type: 'reels',
      topic: request.topic,
      topicLabel: 'Reels • TYT Türkçe',
      status: 'draft',
      targetAudience: request.targetGrade || 'YKS (TYT/AYT)',
      caption: `ÖSYM'nin her yıl banko sorduğu ama adayların %60'ının takıldığı yazım kuralı! 🤯\n\nSen doğru bildiğini sanıyordun değil mi? Yorumlarda cevabını yaz, bakalım kimler doğru bildi! 👇\n\n#reels #yksreels #tyt2026 #yazımkuralları #dersolab #ykstayfa`,
      hashtags: ['#reels', '#yksreels', '#tyt2026', '#yazımkuralları', '#dersolab'],
      reelsStoryboard: {
        hook3s:
          'Kameraya şaşkınlıkla bakarak ekrana "BİRÇOK mu BİR ÇOK mu?" yazısını vur: "Eğer buna ayrı yazılır dediysen sınavda 1 netin gitti bile!"',
        visualDirection:
          'Ön planda dinamik konuşmacı. Arkada DersoLab L.A.B. Fonetik Müfettişi ekranı açık. Yanlış şık kırmızı, doğru şık parlak yeşil yanıp söner.',
        spokenScript:
          'ÖSYM her yıl istisnasız bitişik yazılan birleşik sözcüklerden en az bir soru soruyor. Şifre çok basit: Belirsizlik bildiren "birkaç, birtakım, birçok, hiçbir" sözcükleri daima bitişik yazılır! DersoLab Fonetik Müfettişine cümleyi at, hangi ses olayının ve yazım kuralının olduğunu saniyesinde yakalasın. Profildeki linkten ücretsiz dene!',
        onScreenText: [
          '🚨 1 NETİ KURTAR!',
          'Birçok / Birkaç / Hiçbir = BİTİŞİK',
          'ÖSYM BU TUZAĞI ÇOK SEVER',
          'Link Biyoda 🦊',
        ],
        musicAudioVibe: 'Enerjik TikTok/Instagram trend hip-hop veya lofi beat (orta tempo)',
        callToAction:
          'DersoLab Fonetik Müfettişini hemen profildeki linkten ücretsiz dene, yazım kurallarını fullle!',
      },
      createdAt: new Date().toISOString(),
    }
  }

  // Single post
  return {
    id: `post_${now}_single`,
    title: 'Günün TYT Sorusu: Ses Olayları Tuzağı',
    type: 'post',
    topic: request.topic,
    topicLabel: 'Günün Sorusu',
    status: 'draft',
    targetAudience: request.targetGrade || 'YKS (TYT/AYT)',
    caption: `Günün ÖSYM Sorusu geldi! Bakalım kimler ilk seferde doğru şıkkı bulacak? 🧠\n\nCevabını yoruma bırak, doğru cevabı ve detaylı çözümü sabitlediğimiz yorumda açıkla! 🎯\n\n#gununsorusu #yks #tyt #dersolab #sorucozumu`,
    hashtags: ['#gununsorusu', '#yks', '#tyt', '#dersolab', '#sorucozumu'],
    singlePostData: {
      badge: 'GÜNÜN ÖSYM SORUSU',
      headline: '"Kaybolduğunu" Sözcüğündeki Ses Olayları Nelerdir?',
      questionOrSummary:
        'Aşağıdaki seçeneklerden hangisinde "kaybolduğunu" sözcüğünde meydana gelen ses olaylarının tamamı doğru verilmiştir?',
      keyTakeaway: 'İpucu: Kayıp + olmak + dık + ı -> Ünlü düşmesi + Ünsüz türemesi/yumuşaması',
      options: [
        { key: 'A', text: 'Ünlü düşmesi - Ünsüz yumuşaması', isCorrect: true },
        { key: 'B', text: 'Sadece Ünsüz yumuşaması', isCorrect: false },
        { key: 'C', text: 'Ünsüz benzeşmesi - Ünlü daralması', isCorrect: false },
        { key: 'D', text: 'Ünlü türemesi - Kaynaştırma', isCorrect: false },
      ],
      themeVariant: 'neon_orange',
    },
    createdAt: new Date().toISOString(),
  }
}

function generateLocalWeeklyCalendar(request: WeeklyCalendarRequest): SocialPostItem[] {
  return [
    {
      id: `week_1_${Date.now()}`,
      title: 'Pazartesi: Haftalık Çalışma Taktiği - Turlama Yöntemi',
      type: 'carousel',
      topic: 'weekly_plan',
      topicLabel: 'Çalışma Disiplini',
      status: 'draft',
      targetAudience: request.targetGrade || 'YKS',
      caption: `Yeni haftaya hazır mıyız? Pazartesi gününü doğru planlayan öğrenci haftayı önde bitirir. Bu hafta denemelerinde "Turlama Yöntemini" dene!\n\n#pazartesi #yks2026 #dersolab`,
      hashtags: ['#pazartesi', '#yks2026', '#dersolab', '#motivasyon'],
      carouselSlides: [
        {
          slideNumber: 1,
          badge: 'PAZARTESİ TAKTİĞİ',
          headline: 'Sınavda 15 Dakika Kazandıran: Turlama Tekniği',
          subhead: 'Zor soruya inat etmek yok!',
          bodyPoints: ['1. Turda sadece bildiklerini çöz', '2. Turda işaretlediğin şüphelilere dön'],
          highlightTag: 'HAFTANIN TAKTİĞİ',
          footerNote: 'DersoLab • @dersolabegitim',
          themeVariant: 'lab_dark',
        },
        {
          slideNumber: 2,
          badge: 'UYGULAMA',
          headline: 'Sorularla İnatlaşmayı Bırak',
          subhead: 'Tüm soruların puan değeri aynı!',
          bodyPoints: [
            '10 dakika bir geometri sorusuna gömülmek = 5 kolay soruyu kaybetmek',
            'Soruya 45 saniyede yön bulamıyorsan yanına soru işareti koy ve geç',
          ],
          highlightTag: 'ÖNEMLİ KURAL',
          footerNote: 'DersoLab Koçluk',
          themeVariant: 'neon_orange',
        },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: `week_2_${Date.now()}`,
      title: 'Salı: Paragrafı 2 Kat Hızlı Okuma Reels',
      type: 'reels',
      topic: 'exam_tactics',
      topicLabel: 'Reels • Hızlı Okuma',
      status: 'draft',
      targetAudience: request.targetGrade || 'YKS',
      caption: `Paragraflarda gözün yoruluyor ve baştan mı okuyorsun? Biyonik okuma tekniğiyle odaklanmayı 2 katına çıkar! ⚡\n\n#reels #hizliokuma #yks #dersolab`,
      hashtags: ['#reels', '#hizliokuma', '#yks', '#dersolab'],
      reelsStoryboard: {
        hook3s: 'Kameraya parmağınla "DUR!" işareti yap: "Paragraf okurken içinden seslendiriyorsan hata yapıyorsun!"',
        visualDirection: 'Kamera önünde konuşmacı, arkada Bionic Speed Reader arayüzü kayıyor.',
        spokenScript:
          'İç seslendirme okuma hızını normal konuşma hızına sınırlar. Beynimiz kelimeleri blok halinde görsel olarak tanıyabilir. DersoLab L.A.B. ile her gün 10 dakika pratik yap, hızını katla!',
        onScreenText: ['İç Seslendirmeyi Bırak', 'Göz Kaslarını Eğit', '+10 Net'],
        musicAudioVibe: 'Lo-Fi Chill Hop Beat',
        callToAction: 'Profildeki L.A.B. linkinden ücretsiz biyonik okumayı test et!',
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: `week_3_${Date.now()}`,
      title: 'Çarşamba: TYT Matematik - Temel Kavramlar Püf Noktaları',
      type: 'carousel',
      topic: 'exam_tactics',
      topicLabel: 'TYT Matematik',
      status: 'draft',
      targetAudience: request.targetGrade || 'YKS',
      caption: `Her denemede garanti gelen ama dikkatsizlikten kaçan 3 soru tipi! Kaydet ve hafta sonu denemenden önce tekrar et. 📐\n\n#tytmatematik #yks2026 #dersolab`,
      hashtags: ['#tytmatematik', '#yks2026', '#dersolab'],
      carouselSlides: [
        {
          slideNumber: 1,
          badge: 'TYT MATEMATİK',
          headline: 'Adayların %70’inin Düştüğü 3 Temel Kavram Tuzağı',
          subhead: 'Soru kökündeki gizli kelimelere dikkat',
          bodyPoints: ['"Doğal sayı" ile "Pozitif tam sayı" farkı', 'Sıfırın çift sayı olduğunu unutmak'],
          highlightTag: 'DİKKAT',
          footerNote: 'DersoLab Matematik',
          themeVariant: 'cyan_cyber',
        },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: `week_4_${Date.now()}`,
      title: 'Perşembe: Günün Sorusu - Ünsüz Benzeşmesi',
      type: 'post',
      topic: 'daily_question',
      topicLabel: 'Günün Sorusu',
      status: 'draft',
      targetAudience: request.targetGrade || 'YKS',
      caption: `Bugünün şaşırtmalı sorusu geldi! Cevabını yorumlara yaz, doğru cevabı sabitleyelim! 🎯\n\n#gununsorusu #yks #turkce #dersolab`,
      hashtags: ['#gununsorusu', '#yks', '#turkce', '#dersolab'],
      singlePostData: {
        badge: 'GÜNÜN ÖSYM SORUSU',
        headline: '"Bitkisel" Sözcüğündeki Ses Olayı Nedir?',
        questionOrSummary: 'Bitki + sel -> Bit- kökünden "Bitgi" değil "Bitki" olmuştur. Hangi ses olayı gerçekleşmiştir?',
        keyTakeaway: 'Fıstıkçı Şahap sert ünsüzlerinden sonra gelen c, d, g sertleşerek ç, t, k olur.',
        options: [
          { key: 'A', text: 'Ünsüz Benzeşmesi (Sertleşme)', isCorrect: true },
          { key: 'B', text: 'Ünlü Düşmesi', isCorrect: false },
          { key: 'C', text: 'Ünsüz Yumuşaması', isCorrect: false },
          { key: 'D', text: 'Ünlü Daralması', isCorrect: false },
        ],
        themeVariant: 'neon_orange',
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: `week_5_${Date.now()}`,
      title: 'Cuma: L.A.B. Fonetik Müfettişi Özellik Tanıtımı',
      type: 'reels',
      topic: 'dersolab_features',
      topicLabel: 'Reels • DersoLab L.A.B.',
      status: 'draft',
      targetAudience: request.targetGrade || 'YKS',
      caption: `Yazım kurallarını ezberlemekten bıkanlar için yapay zekalı yardımcımız devrede! Metnini yapıştır, tüm ses olaylarını renk renk ayrıştırsın. 🦊✨\n\n#dersolab #ykslaboratuvari #aiasistan`,
      hashtags: ['#dersolab', '#ykslaboratuvari', '#aiasistan', '#edtech'],
      reelsStoryboard: {
        hook3s: 'Kamerada telefon tutuluyor: "Yazım kurallarını ezberlemeyi bıraktıran siteyi buldum!"',
        visualDirection: 'Ekranda DersoLab Fonetik Müfettişi demosu gösteriliyor, harfler canlı renkle parlıyor.',
        spokenScript:
          'DersoLab Fonetik Müfettişine herhangi bir paragrafı yapıştırıyorsun. Ünlü düşmesi sarı, ünsüz yumuşaması yeşil, benzeşme mavi yanıyor. Hangi kelimede ne var anında görüyorsun. Ücretsiz denemek için profildeki linke tıkla!',
        onScreenText: ['Ezberleme, Gör!', 'Renklerle Ses Bilgisi', 'DersoLab L.A.B.'],
        musicAudioVibe: 'Gelecekçi Cyber Beat',
        callToAction: 'Profildeki linkten hemen ücretsiz test et!',
      },
      createdAt: new Date().toISOString(),
    },
    {
      id: `week_6_${Date.now()}`,
      title: 'Cumartesi: Deneme Sonrası Net Analizi Rehberi',
      type: 'carousel',
      topic: 'exam_tactics',
      topicLabel: 'Deneme Analizi',
      status: 'draft',
      targetAudience: request.targetGrade || 'YKS',
      caption: `Cumartesi denemesini çözenler buraya! Çözdüğün denemenin analizini yapmıyorsan deneme çözmüş sayılmazsın. İşte 3 adımlı analiz şablonu 📋\n\n#denemeanalizi #yks #netler #dersolab`,
      hashtags: ['#denemeanalizi', '#yks', '#netler', '#dersolab'],
      carouselSlides: [
        {
          slideNumber: 1,
          badge: 'CUMARTESİ ANALİZİ',
          headline: 'Deneme Çözüp Bırakanlar Neden Net Artıramaz?',
          subhead: 'Gelişimi sağlayan sınavın kendisi değil, analizi!',
          bodyPoints: ['Hata defteri tutuyor musun?', 'Yanlışların bilgi mi, dikkat mi olduğunu biliyor musun?'],
          highlightTag: 'REHBER',
          footerNote: 'DersoLab • @dersolabegitim',
          themeVariant: 'purple_matrix',
        },
      ],
      createdAt: new Date().toISOString(),
    },
    {
      id: `week_7_${Date.now()}`,
      title: 'Pazar: Koçluk ve Zihinsel Sıfırlama',
      type: 'reels',
      topic: 'motivation',
      topicLabel: 'Pazar Motivasyonu',
      status: 'draft',
      targetAudience: request.targetGrade || 'YKS',
      caption: `Pazar günü sadece dinlenme değil, yeni haftanın enerjisini depolama günüdür. Kendine inan, emeklerin asla boşa gitmeyecek. 🧡🦊\n\n#pazar #motivasyon #dersolab`,
      hashtags: ['#pazar', '#motivasyon', '#dersolab', '#ykstayfa'],
      reelsStoryboard: {
        hook3s: 'Sakin, ilham verici bir çalışma masası görüntüsü: "Yorulduğunu biliyorum ama vazgeçmeyeceksin."',
        visualDirection: 'Sıcak lamba ışığı, çalışma notları, DersoLab tilki logosu kupası.',
        spokenScript:
          'Sınav hazırlığı bir sprint değil maratondur. Bugün bir saat yürüyüş yap, uykunu al ve yarın başlayacak yeni haftaya taze bir zihinle adım at. Biz senin yanındayız.',
        onScreenText: ['Nefes Al', 'Yeni Haftaya Hazır Ol', 'Sen Başaracaksın ✨'],
        musicAudioVibe: 'Duygusal, motive edici piyano / ambient',
        callToAction: 'Pazartesi hedefini yoruma yaz, birlikte takip edelim!',
      },
      createdAt: new Date().toISOString(),
    },
  ]
}
