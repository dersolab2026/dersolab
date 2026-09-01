import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenAI } from '@google/genai'

// Rate limiting için basit in-memory store (production'da Redis kullanılır)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const DAILY_LIMIT_STUDENT = 500 // Kayıtlı öğrenciler için sınırsız kullanım (güvenlik tavanı)

function getRateLimit(key: string, limit: number): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000
  const entry = rateLimitMap.get(key)

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + dayMs })
    return { allowed: true, remaining: limit - 1 }
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 }
  }

  entry.count++
  return { allowed: true, remaining: limit - entry.count }
}

const SYSTEM_PROMPT = `Sen DersoLab AI Soru Asistanı'sın. 
Sadece ve sadece Türkiye'deki LGS (8. Sınıf Liselere Geçiş Sınavı) ve YKS (TYT ve AYT Yükseköğretim Kurumları Sınavı) müfredatında yer alan akademik ders sorularını çözmek için tasarlandın.

İZİN VERİLEN BRANŞLAR:
- Matematik, Geometri
- Fizik, Kimya, Biyoloji, Fen Bilimleri
- Türkçe, Türk Dili ve Edebiyatı
- Tarih, T.C. İnkılap Tarihi ve Atatürkçülük, Coğrafya, Felsefe, Din Kültürü ve Ahlak Bilgisi
- Yabancı Dil (İngilizce)

KATI GÜVENLİK VE ALAN KISITLAMA KURALLARI (GUARDRAILS):
1. YALNIZCA VE YALNIZCA yukarıdaki derslere ait okul, sınav, deneme veya ödev sorularını çöz.
2. KESİNLİKLE YASAK: Kahve falı, burç, astroloji, el falı, tarot, günlük arkadaşlık sohbeti, dertleşme, dedikodu, yemek tarifi, oyun hileleri, ders dışı kod/yazılım üretimi, şarkı sözü, siyaset veya eğitim dışı genel kültür soruları.
3. Kural Dışı Giriş Tespit Edilirse:
   Kullanıcı ders/sınav sorusu DIŞINDA herhangi bir şey girerse veya kahve falı, burç, sohbet vb. isterse, ASLA fal bakma veya cevap verme. YALNIZCA şu standart mesajı dön:
   "⚠️ Üzgünüm, ben sadece DersoLab bünyesindeki LGS ve YKS derslerine (Matematik, Fizik, Kimya, Biyoloji, Türkçe, Tarih vb.) ait eğitim ve sınav sorularını çözmek için tasarlandım. Lütfen derslerinizle veya sınavlarınızla ilgili bir soru giriniz."

ÇÖZÜM FORMATI KURALLARI (Ders Soruları İçin):
1. Her zaman akıcı, samimi ve anlaşılır bir Türkçe kullan.
2. Ezberletme; mantığını öğret. Çözümü adım adım numaralandır.
3. Kullanılan formül, teorem veya kuralı vurgula (ör: **Öklid Bağıntısı**, **Logaritma Çarpım Kuralı**, **Newton'un 2. Yasası**).
4. Çözümün sonunda tek cümlelik "Anahtar Fikir" yaz (öğrencinin bu soru tipini bir dahaki sefere hızlıca tanımasını sağlayacak püf nokta).

ÇIKTI FORMATI:
## 🎯 [Branş] - [Konu Başlığı]

**Çözüm Adımları:**

1. [1. Adım açıklaması]
   → [formül veya işlem]

2. [2. Adım açıklaması]
   → [formül veya işlem]

...

**✅ Sonuç:** [Final cevap]

**💡 Anahtar Fikir:** [Tek cümlelik püf nokta ve sınav ipucu]`

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI servisi şu an yapılandırılmıyor. Lütfen daha sonra tekrar deneyin.' },
        { status: 503 },
      )
    }

    // Kullanıcı oturumunu kontrol et
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        {
          error: 'AI Soru Çözüm Asistanı sadece kayıtlı ve giriş yapmış DersoLab öğrencilerine özeldir. Lütfen giriş yapın veya ücretsiz hesap oluşturun.',
          requiresAuth: true,
        },
        { status: 401 },
      )
    }

    // Rate limiting (Kayıtlı öğrenciler için)
    const rateLimitKey = `user:${user.id}`
    const { allowed, remaining } = getRateLimit(rateLimitKey, DAILY_LIMIT_STUDENT)
    if (!allowed) {
      return NextResponse.json(
        {
          error: `Günlük ${DAILY_LIMIT_STUDENT} soru çözüm limitinize ulaştınız. Limitiniz yarın tekrar yenilenecektir.`,
          limitReached: true,
        },
        { status: 429 },
      )
    }

    const body = await request.json()
    const { question, subject, imageBase64 } = body as {
      question: string
      subject?: string
      imageBase64?: string
    }

    if (!question || question.trim().length < 5) {
      return NextResponse.json({ error: 'Lütfen geçerli bir soru yazın.' }, { status: 400 })
    }

    if (question.length > 2000) {
      return NextResponse.json({ error: 'Soru çok uzun. Maksimum 2000 karakter.' }, { status: 400 })
    }

    const ai = new GoogleGenAI({ apiKey })

    const userPrompt = subject
      ? `Branş: ${subject}\n\nSoru:\n${question}`
      : `Soru:\n${question}`

    // Görsel varsa multimodal, yoksa sadece metin
    let contents: Parameters<typeof ai.models.generateContent>[0]['contents']

    if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '')
      contents = [
        {
          role: 'user',
          parts: [
            { text: userPrompt },
            {
              inlineData: {
                mimeType: 'image/jpeg',
                data: base64Data,
              },
            },
          ],
        },
      ]
    } else {
      contents = [{ role: 'user', parts: [{ text: userPrompt }] }]
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.3,
        maxOutputTokens: 1024,
      },
      contents,
    })

    const text = response.text

    return NextResponse.json({
      solution: text,
      remaining,
      isAnon: !user,
    })
  } catch (err) {
    console.error('AI solve error:', err)
    return NextResponse.json(
      { error: 'Yapay zeka servisi geçici olarak kullanılamıyor. Lütfen birkaç saniye sonra tekrar deneyin.' },
      { status: 500 },
    )
  }
}
