import { NextRequest, NextResponse } from 'next/server'
import { getAvailableSlots } from '@/lib/availability/get-available-slots'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: instructorId } = await params
  const dateParam = request.nextUrl.searchParams.get('date')

  if (!dateParam) {
    return NextResponse.json({ error: 'date parametresi gerekli' }, { status: 400 })
  }

  const rangeStart = new Date(dateParam)
  rangeStart.setHours(0, 0, 0, 0)
  const rangeEnd = new Date(rangeStart)
  rangeEnd.setDate(rangeEnd.getDate() + 6)
  rangeEnd.setHours(23, 59, 59, 999)

  try {
    const slots = await getAvailableSlots(instructorId, rangeStart, rangeEnd)
    return NextResponse.json({ slots })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Müsaitlik bilgisi alınamadı'
    console.error('Müsaitlik sorgusu hatası:', err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
