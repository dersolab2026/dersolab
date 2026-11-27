import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { GoogleGenAI } from '@google/genai'

// L1 bellek önbelleği + Supabase private storage (`bot-secrets`) tabanlı dağıtık (serverless-safe) rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
let lastRateLimitCleanup = Date.now()
const RATE_LIMIT_BUCKET = 'bot-secrets'

const DAILY_LIMIT_STUDENT = 500 // Kayıtlı öğrenciler için günlük güvenlik tavanı

function getInMemoryRateLimit(key: string, limit: number): { allowed: boolean; remaining: number; count: number } {
  const now = Date.now()
  const dayMs = 24 * 60 * 60 * 1000

  if (now - lastRateLimitCleanup > 60 * 60 * 1000 && rateLimitMap.size > 200) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (v.resetAt < now) rateLimitMap.delete(k)
    }
    lastRateLimitCleanup = now
  }

  const entry = rateLimitMap.get(key)

  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(key, { count: 1, resetAt: now + dayMs })
    return { allowed: true, remaining: limit - 1, count: 1 }
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, count: entry.count }
  }

  entry.count++
  return { allowed: true, remaining: limit - entry.count, count: entry.count }
}

async function checkDistributedRateLimit(
  userId: string,
  limit: number
): Promise<{ allowed: boolean; remaining: number }> {
  const utcDay = new Date().toISOString().slice(0, 10)
  const memKey = `user:${userId}:${utcDay}`
  const storagePath = `rate-limits/ai-solve/${utcDay}/${userId}.json`

  try {
    const admin = createAdminClient()
    let remoteCount = 0

    // Cold-start veya ilk istekte Supabase üzerindeki kalıcı sayacı oku
    const cached = rateLimitMap.get(memKey)
    if (!cached) {
      const { data: blob } = await admin.storage.from(RATE_LIMIT_BUCKET).download(storagePath)
      if (blob) {
        const parsed = JSON.parse(await blob.text()) as { count?: number }
        if (typeof parsed.count === 'number' && parsed.count > 0) {
          remoteCount = parsed.count
          rateLimitMap.set(memKey, {
            count: remoteCount,
            resetAt: Date.now() + 24 * 60 * 60 * 1000,
          })
        }
      }
    }

    const mem = getInMemoryRateLimit(memKey, limit)
    if (!mem.allowed) {
      return { allowed: false, remaining: 0 }
    }

    // Güncel sayacı kalıcı depoya asenkron kaydet (isteği bloklamadan)
    const payload = Buffer.from(
      JSON.stringify({ count: mem.count, date: utcDay, updatedAt: new Date().toISOString() }),
      'utf-8'
    )
    void admin.storage
      .from(RATE_LIMIT_BUCKET)
      .upload(storagePath, payload, { contentType: 'application/json', upsert: true })
      .catch(() => {})

    return { allowed: true, remaining: mem.remaining }
  } catch {
    const fallback = getInMemoryRateLimit(memKey, limit)
    return { allowed: fallback.allowed, remaining: fallback.remaining }
  }
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

    // Kullanıcı oturumunu kontrol et (Cookie veya Authorization Header üzerinden)
    const supabase = await createClient()
    
    let user = null;
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const { data } = await supabase.auth.getUser(token);
      user = data.user;
    } else {
      const { data } = await supabase.auth.getUser();
      user = data.user;
    }

    if (!user) {
      return NextResponse.json(
        {
          error: 'AI Soru Çözüm Asistanı sadece kayıtlı ve giriş yapmış DersoLab öğrencilerine özeldir. Lütfen giriş yapın veya ücretsiz hesap oluşturun.',
          requiresAuth: true,
        },
        { status: 401 },
      )
    }

    // Rate limiting (Kayıtlı öğrenciler için — dağıtık Supabase + L1 bellek)
    const { allowed, remaining } = await checkDistributedRateLimit(user.id, DAILY_LIMIT_STUDENT)
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

    const effectiveQuestion = question?.trim() || (imageBase64 ? 'Görseldeki soruyu adım adım detaylı şekilde çözünüz.' : '')

    if (!effectiveQuestion || effectiveQuestion.length < 3) {
      return NextResponse.json({ error: 'Lütfen geçerli bir soru yazın veya bir soru fotoğrafı yükleyin.' }, { status: 400 })
    }

    if (effectiveQuestion.length > 2000) {
      return NextResponse.json({ error: 'Soru çok uzun. Maksimum 2000 karakter.' }, { status: 400 })
    }

    const ai = new GoogleGenAI({ apiKey })

    const safeSubject = typeof subject === 'string' ? subject.replace(/[\r\n]/g, ' ').trim().slice(0, 60) : ''
    const userPrompt = safeSubject
      ? `Branş: ${safeSubject}\n\nSoru:\n${effectiveQuestion}`
      : `Soru:\n${effectiveQuestion}`

    // Görsel varsa multimodal, yoksa sadece metin
    let contents: Parameters<typeof ai.models.generateContent>[0]['contents']

    if (imageBase64) {
      if (typeof imageBase64 !== 'string' || imageBase64.length > 6_000_000) {
        return NextResponse.json({ error: 'Yüklenen görsel boyutu çok büyük (maksimum ~4.5 MB).' }, { status: 413 })
      }
      const mimeMatch = imageBase64.match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,/i)
      const mimeType = mimeMatch
        ? (mimeMatch[1].toLowerCase() === 'image/jpg' ? 'image/jpeg' : mimeMatch[1].toLowerCase())
        : 'image/jpeg'
      const base64Data = imageBase64.replace(/^data:image\/[a-zA-Z0-9.+_-]+;base64,/, '')
      contents = [
        {
          role: 'user',
          parts: [
            { text: userPrompt },
            {
              inlineData: {
                mimeType,
                data: base64Data,
              },
            },
          ],
        },
      ]
    } else {
      contents = [{ role: 'user', parts: [{ text: userPrompt }] }]
    }

    const solveModels = [
      'gemini-3.8-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-4-argon',
      'gemini-flash-lite-latest',
    ]
    let response: any = null
    let lastError: any = null

    for (const m of solveModels) {
      try {
        response = await ai.models.generateContent({
          model: m,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.3,
            maxOutputTokens: 1024,
          },
          contents,
        })
        if (response?.text) break
      } catch (err: any) {
        lastError = err
        console.warn(`[AI Solve] ${m} hatası, sonrakine geçiliyor:`, err?.message || err)
      }
    }

    if (!response?.text && lastError) {
      throw lastError
    }

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
