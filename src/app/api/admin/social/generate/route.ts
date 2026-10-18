import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  generateAutonomousDailyBatch,
  generateEngagementReplies,
  generateHookMatrix,
  generateSocialPost,
  generateWeeklyCalendar,
  generateXThread,
  getAgentLearningInsights,
  processNaturalLanguageAgentCommand,
  runPedagogicalAudit,
} from '@/lib/social/agent'
import { generateSocialImage } from '@/lib/social/imageGenerator'
import type {
  GenerateImageRequest,
  GeneratePostRequest,
  GrokAgentCommandRequest,
  WeeklyCalendarRequest,
} from '@/types/social'

export async function POST(request: NextRequest) {
  try {
    const isDev = process.env.NODE_ENV === 'development'

    // Auth kontrolü
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user && !isDev) {
      return NextResponse.json({ error: 'Yetkisiz erişim. Lütfen giriş yapınız.' }, { status: 401 })
    }

    if (user) {
      const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
      if (userRow?.role !== 'admin' && !isDev) {
        return NextResponse.json({ error: 'Bu işlem yalnızca sistem yöneticilerine açıktır.' }, { status: 403 })
      }
    }

    const body = await request.json()
    const { action } = body as { action?: string; [key: string]: any }

    // 0. AI Görsel & İllüstrasyon Üretimi
    if (action === 'generate_image') {
      const imageParams = body as GenerateImageRequest
      const result = await generateSocialImage(imageParams)
      return NextResponse.json(result)
    }

    // 1. Yapay Zeka Doğal Dil Komut & İçerik Sihirbazı
    if (action === 'command') {
      const cmdParams = body as GrokAgentCommandRequest
      const result = await processNaturalLanguageAgentCommand(cmdParams)
      return NextResponse.json({ success: true, ...result })
    }

    // 2. Otonom Günlük Paket (Auto-Pilot 3 Post)
    if (action === 'auto_pilot') {
      const batch = await generateAutonomousDailyBatch(body.targetGrade, body.focusSubject, body.persona)
      return NextResponse.json({
        success: true,
        items: batch,
        message: 'DersoLab Otonom Ajan: 3 koordineli günlük içerik ve AI görselleri başarıyla üretildi!',
      })
    }

    // 3. 5x Viral Kanca Matrisi
    if (action === 'hook_matrix') {
      const hooks = await generateHookMatrix(body.topic || 'Sınav Hazırlığı', body.subject, body.persona)
      return NextResponse.json({ success: true, hooks })
    }

    // 4. Etkileşim & Yorum Simülasyonu
    if (action === 'engagement_replies') {
      const comments = await generateEngagementReplies(body.title || '', body.caption || '', body.persona)
      return NextResponse.json({ success: true, comments })
    }

    // 5. X / Twitter Flood
    if (action === 'generate_x_thread') {
      const threadPost = await generateXThread(body as GeneratePostRequest)
      return NextResponse.json({ success: true, item: threadPost })
    }

    // 6. Haftalık Takvim
    if (action === 'generate_weekly') {
      const weeklyParams = body as WeeklyCalendarRequest
      const calendar = await generateWeeklyCalendar(weeklyParams)
      return NextResponse.json({ success: true, items: calendar })
    }

    // 7. Pedagojik Doğruluk & ÖSYM Kazanım Denetimi
    if (action === 'pedagogical_audit') {
      const audit = runPedagogicalAudit(body.post || { title: body.title, caption: body.caption })
      return NextResponse.json({ success: true, audit })
    }

    // 8. Kendi Kendini Optimize Eden Ajan Öğrenme Stratejisi
    if (action === 'learning_insights') {
      const insights = getAgentLearningInsights()
      return NextResponse.json({ success: true, insights })
    }

    // 9. Standart Tekil Gönderi
    const singleParams = body as GeneratePostRequest
    const post = await generateSocialPost(singleParams)
    return NextResponse.json({ success: true, item: post })
  } catch (error: any) {
    console.error('Social media generation API error:', error)
    return NextResponse.json(
      { error: error?.message || 'İçerik üretilirken bir sorun oluştu.' },
      { status: 500 }
    )
  }
}
