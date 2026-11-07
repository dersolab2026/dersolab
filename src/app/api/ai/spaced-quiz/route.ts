import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { GoogleGenAI } from '@google/genai'

export interface SpacedQuizQuestion {
  id: string
  subject: string
  topic: string
  questionText: string
  options: string[]
  correctIndex: number
  explanation: string
}

const FALLBACK_QUIZ: SpacedQuizQuestion[] = [
  {
    id: 'fb-1',
    subject: 'TYT Matematik',
    topic: 'Fonksiyonlar ve Denklemler',
    questionText:
      'f(x) = 2x + 5 doğrusal fonksiyonu veriliyor. Buna göre f(3) + f⁻¹(9) toplamının değeri kaçtır?',
    options: ['A) 11', 'B) 12', 'C) 13', 'D) 14', 'E) 15'],
    correctIndex: 2,
    explanation:
      'f(3) = 2(3) + 5 = 11 bulunur. f⁻¹(9) için 2x + 5 = 9 ⇒ 2x = 4 ⇒ x = 2 olur. Buradan 11 + 2 = 13 elde edilir.',
  },
  {
    id: 'fb-2',
    subject: 'TYT Fizik',
    topic: 'Newton Hareket Yasaları',
    questionText:
      'Sürtünmesiz yatay düzlemde durmakta olan 4 kg kütleli bir cisme yatay 20 N büyüklüğünde sabit kuvvet uygulanıyor. Cismin 3 saniye sonundaki hızı kaç m/s olur?',
    options: ['A) 10', 'B) 12', 'C) 15', 'D) 18', 'E) 20'],
    correctIndex: 2,
    explanation:
      'F = m · a bağıntısından 20 = 4 · a ⇒ a = 5 m/s² ivme bulunur. v = a · t = 5 · 3 = 15 m/s olur.',
  },
  {
    id: 'fb-3',
    subject: 'TYT Kimya',
    topic: 'Asitler, Bazlar ve pH',
    questionText:
      '25 °C sıcaklıkta sulu bir çözeltinin pH değeri 2 olarak ölçülmüştür. Bu çözelti ile ilgili aşağıdakilerden hangisi doğrudur?',
    options: [
      'A) Mavi turnusol kağıdının rengini değiştirmez.',
      'B) Kuvvetli veya zayıf bir baz çözeltisidir.',
      'C) Aktif metallerle (Zn, Mg gibi) tepkimeye girerek H₂ gazı açığa çıkarır.',
      'D) OH⁻ iyon sayısı H⁺ iyon sayısından fazladır.',
      'E) Nötr özellik gösterir.',
    ],
    correctIndex: 2,
    explanation:
      '25 °C\'de pH = 2 < 7 olduğu için çözelti asidiktir. Asit çözeltileri aktif metallerle (Zn, Mg, Fe vb.) tepkimeye girerek hidrojen gazı (H₂) açığa çıkarır.',
  },
]

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Lütfen giriş yapın.' }, { status: 401 })
    }

    const body = await request.json()
    const {
      subject = 'TYT Matematik',
      recentQuestions = [],
    } = body as {
      subject?: string
      recentQuestions?: Array<{ subject: string; question: string }>
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ questions: FALLBACK_QUIZ })
    }

    const historyContext =
      Array.isArray(recentQuestions) && recentQuestions.length > 0
        ? recentQuestions
            .slice(0, 5)
            .map((q, idx) => `${idx + 1}. [${q.subject}] ${q.question.slice(0, 180)}`)
            .join('\n')
        : `Branş odağı: ${subject}`

    const prompt = `Sen DersoLab Aralıklı Tekrar (Spaced Repetition) Sınav Motorusun.
Öğrencinin yakın zamanda zorlandığı veya Soru Defterine kaydettiği sorular şunlardır:
${historyContext}

GÖREVİN:
Öğrencinin bu kazanımları unutup unutmadığını ölçmek için ÖSYM (TYT/AYT) ve MEB (LGS) standartlarında, rakamları ve kurgusu tamamen özgün **3 adet çoktan seçmeli soru** üret.
Yanıtını YALNIZCA geçerli bir JSON dizisi (array) olarak ver, hiçbir markdown kod bloğu veya ek açıklama ekleme:
[
  {
    "id": "q1",
    "subject": "${subject}",
    "topic": "Konu Başlığı",
    "questionText": "Soru metni...",
    "options": ["A) ...", "B) ...", "C) ...", "D) ...", "E) ..."],
    "correctIndex": 0,
    "explanation": "Kısa ve net adım adım çözüm açıklaması..."
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
            maxOutputTokens: 1200,
          },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
        })

        const raw = res?.text?.trim()
        if (raw) {
          const cleaned = raw.replace(/^```json\s*/i, '').replace(/```$/i, '').trim()
          const parsed = JSON.parse(cleaned)
          if (Array.isArray(parsed) && parsed.length > 0) {
            return NextResponse.json({ questions: parsed.slice(0, 3) })
          }
        }
      } catch (e) {
        console.warn(`[Spaced Quiz] ${modelName} hatası:`, e)
      }
    }

    return NextResponse.json({ questions: FALLBACK_QUIZ })
  } catch (err) {
    console.error('[Spaced Quiz] Genel hata:', err)
    return NextResponse.json({ questions: FALLBACK_QUIZ })
  }
}
