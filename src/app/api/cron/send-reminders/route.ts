import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { notifyBookingReminder } from '@/lib/notifications/send-guardian-notification'

export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const now = new Date()
  const windowEnd = new Date(now.getTime() + 60 * 60 * 1000)

  const { data: bookings, error } = await admin
    .from('bookings')
    .select('id, student_id, instructor_id, start_time, meet_link')
    .eq('status', 'scheduled')
    .eq('reminder_sent', false)
    .gt('start_time', now.toISOString())
    .lte('start_time', windowEnd.toISOString())

  if (error) {
    console.error('send-reminders: rezervasyonlar okunamadı', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let sent = 0
  for (const booking of bookings ?? []) {
    const [{ data: student }, { data: instructor }] = await Promise.all([
      admin.from('users').select('name').eq('id', booking.student_id).single(),
      admin.from('users').select('name').eq('id', booking.instructor_id).single(),
    ])

    await notifyBookingReminder({
      studentId: booking.student_id,
      instructorId: booking.instructor_id,
      bookingId: booking.id,
      instructorName: instructor?.name ?? 'Eğitmen',
      studentName: student?.name ?? 'Öğrenci',
      startTime: booking.start_time,
      meetLink: booking.meet_link ?? '',
    })

    await admin.from('bookings').update({ reminder_sent: true }).eq('id', booking.id)
    sent += 1
  }

  return NextResponse.json({ sent })
}
