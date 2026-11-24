import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAvailableSlots } from '@/lib/availability/get-available-slots'

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/
const ISTANBUL_OFFSET_MS = 3 * 60 * 60 * 1000
const MAX_FORWARD_DAYS_MS = 35 * 24 * 60 * 60 * 1000

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Bu bilgi için giriş yapmalısın' }, { status: 401 })
  }

  const { id: instructorId } = await params
  if (!UUID_REGEX.test(instructorId)) {
    return NextResponse.json({ error: 'Geçersiz eğitmen kimliği' }, { status: 400 })
  }

  const dateParam = request.nextUrl.searchParams.get('date')
  if (!dateParam || !DATE_REGEX.test(dateParam)) {
    return NextResponse.json({ error: 'Geçerli bir YYYY-MM-DD tarihi gerekli' }, { status: 400 })
  }

  const [year, month, day] = dateParam.split('-').map(Number)
  const utcCalendarCheck = new Date(Date.UTC(year, month - 1, day))
  if (
    Number.isNaN(utcCalendarCheck.getTime()) ||
    utcCalendarCheck.getUTCFullYear() !== year ||
    utcCalendarCheck.getUTCMonth() !== month - 1 ||
    utcCalendarCheck.getUTCDate() !== day
  ) {
    return NextResponse.json({ error: 'Geçersiz takvim tarihi' }, { status: 400 })
  }

  const rangeStart = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0) - ISTANBUL_OFFSET_MS)
  const rangeEnd = new Date(rangeStart.getTime() + 7 * 24 * 60 * 60 * 1000 - 1)
  if (rangeStart.getTime() > Date.now() + MAX_FORWARD_DAYS_MS) {
    return NextResponse.json({ slots: [] })
  }

  try {
    const slots = await getAvailableSlots(instructorId, rangeStart, rangeEnd)
    return NextResponse.json({ slots })
  } catch (err) {
    console.error('Müsaitlik sorgusu hatası:', err)
    return NextResponse.json({ error: 'Müsaitlik bilgisi şu anda alınamadı' }, { status: 500 })
  }
}
