import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateSocialPost, generateWeeklyCalendar } from '@/lib/social/agent'
import type { GeneratePostRequest, WeeklyCalendarRequest } from '@/types/social'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim. Lütfen giriş yapınız.' }, { status: 401 })
    }

    const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (userRow?.role !== 'admin') {
      return NextResponse.json({ error: 'Bu işlem yalnızca sistem yöneticilerine açıktır.' }, { status: 403 })
    }

    const body = await request.json()
    const { action } = body as { action: 'generate_single' | 'generate_weekly'; [key: string]: any }

    if (action === 'generate_weekly') {
      const weeklyParams = body as WeeklyCalendarRequest
      const calendar = await generateWeeklyCalendar(weeklyParams)
      return NextResponse.json({ success: true, items: calendar })
    }

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
