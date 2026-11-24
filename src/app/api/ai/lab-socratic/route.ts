import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string, limit = 40): boolean {
  const now = Date.now()
  const windowMs = 60 * 60 * 1000 // 1 saat
  if (rateLimitMap.size > 1000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (v.resetAt < now) rateLimitMap.delete(k)
    }
  }
  const entry = rateLimitMap.get(ip)
  if (!entry || entry.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= limit) return false
  entry.count++
  return true
}

function buildSmartFallback(
  branch: string,
  moduleTitle: string,
  currentState: Record<string, unknown>,
  question: string,
): string {
  const stateEntries = Object.entries(currentState || {})
    .slice(0, 5)
    .map(([k, v]) => `${k}: ${String(v)}`)
    .join(', ')
  const lower = question.toLowerCase()

  if (lower.includes('neden') || lower.includes('mantık')) {
    return `Harika bir sorgulama! 🧐 **${moduleTitle}** deneyinde şu anki parametrelerin (${stateEntries || 'başlangıç durumu'}) üzerinden düşünelim:\n\nDoğadaki bu olayı formül ezberlemeden sebep-sonuç ilişkisiyle incelediğinde, bağımsız değişkeni artırdığında sistem dengeyi korumak için nasıl tepki veriyor? Slider'ı bir kademe değiştirip çıktının doğrusal mı yoksa karesel mi değiştiğini gözlemle!`
  }
  if (lower.includes('lgs') || lower.includes('yks') || lower.includes('tuzak') || lower.includes('sınav')) {
    return `🎯 **ÖSYM & MEB Sınav Tuzağı (${branch}):**\n**${moduleTitle}** sorularında en sık yapılan hata, sabit tutulan değişkeni gözden kaçırmaktır. Şu an ekrandaki **[${stateEntries || 'aktif'}]** değerlerinden birini sabit tutup diğerini 2 katına çıkardığında grafik/sonuç nasıl etkileniyor? Sınavda tam olarak bu yorumu sorarlar!`
  }
  return `Çok güzel bir nokta! 💡 **${moduleTitle}** simülasyonunda şu anki canlı değerlerin: **[${stateEntries || 'aktif'}]**. Bu parametrelerden birini uç değere (minimum veya maksimuma) çektiğinde sistemin sınır davranışının nasıl değişeceğini tahmin edebilir misin?`
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-real-ip') ||
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'anon'

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Saatlik soru limitine ulaştınız. Lütfen biraz dinlenip tekrar deneyin.' },
        { status: 429 },
      )
    }

    const body = await request.json()
    const rawBody = (body && typeof body === 'object' ? body : {}) as {
      branch?: unknown
      moduleTitle?: unknown
      currentState?: Record<string, unknown>
      question?: unknown
      history?: Array<{ sender: 'ai' | 'user'; text: string }>
    }

    const branch = String(rawBody.branch ?? 'Fen & Matematik').replace(/[\r\n\t]/g, ' ').trim().slice(0, 60) || 'Fen & Matematik'
    const moduleTitle = String(rawBody.moduleTitle ?? 'L.A.B. Simülasyonu').replace(/[\r\n\t]/g, ' ').trim().slice(0, 80) || 'L.A.B. Simülasyonu'
    const currentState =
      rawBody.currentState && typeof rawBody.currentState === 'object' && !Array.isArray(rawBody.currentState)
        ? rawBody.currentState
        : {}
    const trimmedQuestion = String(rawBody.question ?? '').trim()
    if (!trimmedQuestion || trimmedQuestion.length < 2) {
      return NextResponse.json({ error: 'Lütfen bir soru yazın.' }, { status: 400 })
    }
    if (trimmedQuestion.length > 600) {
      return NextResponse.json({ error: 'Sorunuz çok uzun (en fazla 600 karakter).' }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        reply: buildSmartFallback(branch, moduleTitle, currentState, trimmedQuestion),
        source: 'fallback',
      })
    }

    const stateFormatted = Object.entries(currentState)
      .slice(0, 12)
      .map(([k, v]) => {
        const safeKey = String(k).replace(/[\r\n]/g, '').slice(0, 40)
        const safeVal = (typeof v === 'object' ? JSON.stringify(v) : String(v)).replace(/[\r\n]/g, ' ').slice(0, 80)
        return `- ${safeKey}: ${safeVal}`
      })
      .join('\n')

    const systemInstruction = `Sen DersoLab L.A.B. (Laboratuvar Destekli Akademik Başarı) platformunun Sokratik Deney Koçusun (DersoAI).
Öğrenci şu anda tarayıcıda canlı bir 60 FPS bilim/matematik simülasyonu ile etkileşim kuruyor:
- Branş: ${branch}
- Aktif Simülasyon Modülü: ${moduleTitle}
- Öğrencinin Ekrandaki Canlı Simülasyon Parametreleri (Sensör Verisi):
${stateFormatted || '- Başlangıç parametreleri aktif'}

PEDAGOJİK VE SOKRATİK KURALLARIN:
1. ASLA doğrudan kuru bir ansiklopedi cevabı verme; öğrencinin ekrandaki canlı parametre değerlerine (yukarıdaki sensör verisine) doğrudan atıfta bulun!
2. Yanıtın kısa, enerjik, anlaşılır (en fazla 3-4 kısa paragraf veya madde) ve Türkiye Yüzyılı Maarif Modeli ile LGS/YKS (TYT-AYT) sınav kazanımlarına tam uyumlu olsun.
3. Yanıtının sonunda mutlaka öğrenciye simülasyondaki bir slider'ı/parametreyi değiştirmesini öneren 1 adet merak uyandırıcı Sokratik soru sor (Örn: "Şimdi ekrandaki açıyı 45 dereceden 60 dereceye çekersen menzilin nasıl değişeceğini tahmin ediyorsun?").
4. Eğitim ve bu deney dışındaki konulara (sohbet, fal, oyun vb.) kesinlikle yanıt verme; kibarca deneye odaklanmasını söyle.`

    const history = Array.isArray(rawBody.history) ? rawBody.history : []
    const recentHistoryText = history
      .slice(-4)
      .map((m) => `${m?.sender === 'user' ? 'Öğrenci' : 'DersoAI'}: ${String(m?.text ?? '').slice(0, 350)}`)
      .join('\n')

    const promptText = recentHistoryText
      ? `Önceki Diyalog:\n${recentHistoryText}\n\nÖğrencinin Yeni Sorusu: ${trimmedQuestion}`
      : `Öğrencinin Sorusu: ${trimmedQuestion}`

    const ai = new GoogleGenAI({ apiKey })
    const models = [
      'gemini-3.8-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-4-argon',
    ]

    for (const modelName of models) {
      try {
        const res = await ai.models.generateContent({
          model: modelName,
          config: {
            systemInstruction,
            temperature: 0.45,
            maxOutputTokens: 450,
          },
          contents: [{ role: 'user', parts: [{ text: promptText }] }],
        })
        if (res?.text) {
          return NextResponse.json({
            reply: res.text.trim(),
            source: modelName,
          })
        }
      } catch (err) {
        console.warn(`[Lab Socratic AI] ${modelName} hatası, sonrakine geçiliyor:`, err)
      }
    }

    return NextResponse.json({
      reply: buildSmartFallback(branch, moduleTitle, currentState, trimmedQuestion),
      source: 'fallback',
    })
  } catch (err) {
    console.error('[Lab Socratic AI] Genel hata:', err)
    return NextResponse.json(
      { error: 'Sokratik asistan yanıt üretirken bir sorun oluştu.' },
      { status: 500 },
    )
  }
}
