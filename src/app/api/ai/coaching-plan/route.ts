import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenAI } from '@google/genai'
import { getTopicsForSubject } from '@/lib/exams/curriculum'

export interface GeneratedPlanDraftItem {
  dayIndex: number
  planTime: string
  subject: string
  topic: string
  source: string
  targetQuestions: number
  targetMinutes: number
}

function buildFallbackDraft(subjects: string[]): GeneratedPlanDraftItem[] {
  const safeSubjects = subjects.length > 0 ? subjects : ['TYT Matematik', 'TYT Türkçe', 'TYT Fen Bilimleri']
  const items: GeneratedPlanDraftItem[] = []

  for (let i = 0; i < 5; i++) {
    const subj = safeSubjects[i % safeSubjects.length]
    const topics = getTopicsForSubject(subj)
    const topic = topics[i % Math.max(1, topics.length)] || 'Konu Tekrarı ve Soru Çözümü'
    items.push({
      dayIndex: i,
      planTime: '17:00',
      subject: subj,
      topic,
      source: 'DersoLab L.A.B. & Soru Bankası',
      targetQuestions: 30,
      targetMinutes: 50,
    })
  }
  return items
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    let user = null
    const authHeader = request.headers.get('authorization')
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const { data } = await supabase.auth.getUser(token)
      user = data.user
    } else {
      const { data } = await supabase.auth.getUser()
      user = data.user
    }

    if (!user) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor.' }, { status: 401 })
    }

    const body = await request.json()
    const { subjects = [] } = body as { subjects?: string[] }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ items: buildFallbackDraft(subjects) })
    }

    const allowedSubjects =
      Array.isArray(subjects) && subjects.length > 0
        ? subjects
        : ['TYT Matematik', 'TYT Türkçe', 'TYT Fizik', 'TYT Kimya', 'TYT Biyoloji']

    const prompt = `Sen DersoLab Akademik Koçluk Motorusun.
Öğrencinin ders listesi: ${allowedSubjects.join(', ')}.
Bu derslerden oluşan, Pazartesi'den Cuma'ya (dayIndex: 0, 1, 2, 3, 4) dengeli dağılmış 5 satırlık bir haftalık çalışma planı taslağı üret.
Her satırda subject değeri MUTLAKA yukarıdaki ders listesinden birebir aynı isimle seçilmelidir.
Yanıtını YALNIZCA geçerli bir JSON dizisi olarak ver:
[
  {
    "dayIndex": 0,
    "planTime": "17:00",
    "subject": "${allowedSubjects[0]}",
    "topic": "Resmi MEB/ÖSYM Konu Başlığı",
    "source": "Konu Özeti + L.A.B. Simülasyonu",
    "targetQuestions": 30,
    "targetMinutes": 50
  }
]`

    const ai = new GoogleGenAI({ apiKey })
    const models = ['gemini-3.8-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite', 'gemini-4-argon']

    for (const modelName of models) {
      try {
        const res = await ai.models.generateContent({
          model: modelName,
          config: {
            temperature: 0.4,
            maxOutputTokens: 900,
          },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        })
        const raw = res?.text?.trim()
        if (raw) {
          const cleaned = raw.replace(/^```json\s*/i, '').replace(/```$/i, '').trim()
          const parsed = JSON.parse(cleaned)
          if (Array.isArray(parsed) && parsed.length > 0) {
            return NextResponse.json({ items: parsed.slice(0, 7) })
          }
        }
      } catch (err) {
        console.warn(`[AI Coaching Plan] ${modelName} hatası:`, err)
      }
    }

    return NextResponse.json({ items: buildFallbackDraft(allowedSubjects) })
  } catch (err) {
    console.error('[AI Coaching Plan] Genel hata:', err)
    return NextResponse.json({ items: buildFallbackDraft([]) })
  }
}
