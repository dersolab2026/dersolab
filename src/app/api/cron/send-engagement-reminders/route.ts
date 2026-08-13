import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { notifyInstructorCalendarReminder, notifyStudentDemoLessonReminder } from '@/lib/notifications/send-engagement-reminders'

export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()

  const { data: unconnectedInstructors } = await admin
    .from('instructors')
    .select('user_id')
    .eq('calendar_connected', false)

  const { data: instructorUsers } = await admin
    .from('users')
    .select('id, name, email')
    .in('id', (unconnectedInstructors ?? []).map((i) => i.user_id))
    .is('deleted_at', null)

  for (const instructor of instructorUsers ?? []) {
    await notifyInstructorCalendarReminder({ name: instructor.name, email: instructor.email })
  }

  const { data: nonTrialStudents } = await admin
    .from('students')
    .select('user_id')
    .eq('free_trial_used', false)

  const { data: pendingRequests } = await admin
    .from('demo_lesson_requests')
    .select('student_id')
    .in('status', ['pending', 'assigned'])

  const pendingIds = new Set((pendingRequests ?? []).map((r) => r.student_id))
  const eligibleStudentIds = (nonTrialStudents ?? [])
    .map((s) => s.user_id)
    .filter((id) => !pendingIds.has(id))

  const { data: studentUsers } = await admin
    .from('users')
    .select('id, name, email')
    .in('id', eligibleStudentIds)
    .is('deleted_at', null)

  for (const student of studentUsers ?? []) {
    await notifyStudentDemoLessonReminder({ name: student.name, email: student.email })
  }

  return NextResponse.json({
    instructorsReminded: instructorUsers?.length ?? 0,
    studentsReminded: studentUsers?.length ?? 0,
  })
}
