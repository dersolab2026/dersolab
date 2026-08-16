import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAvailableSlots } from '@/lib/availability/get-available-slots'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Eğitmenin haftalık müsaitliği kişisel bilgi; rezervasyon sayfası zaten
  // giriş istiyor, API de aynı sınırda olmalı.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Bu bilgi için giriş yapmalısın' }, { status: 401 })
  }

  const { id: instructorId } = await params
  const dateParam = request.nextUrl.searchParams.get('date')

  if (!dateParam) {
    return NextResponse.json({ error: 'date parametresi gerekli' }, { status: 400 })
  }

  // dateParam "YYYY-MM-DD" formatinda ve Istanbul yerel takvim gununu temsil ediyor.
  // Sunucunun calistigi saat dilimine (ornegin Vercel'de UTC) bagli kalmadan
  // sabit UTC+3 offset ile gunun basini/sonunu hesapliyoruz.
  const ISTANBUL_OFFSET_MS = 3 * 60 * 60 * 1000
  const [year, month, day] = dateParam.split('-').map(Number)
  const rangeStart = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0) - ISTANBUL_OFFSET_MS)
  const rangeEnd = new Date(rangeStart.getTime() + 7 * 24 * 60 * 60 * 1000 - 1)

  try {
    const slots = await getAvailableSlots(instructorId, rangeStart, rangeEnd)
    return NextResponse.json({ slots })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Müsaitlik bilgisi alınamadı'
    console.error('Müsaitlik sorgusu hatası:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
