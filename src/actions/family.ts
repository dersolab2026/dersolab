'use server'

import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type ActionResult = { success: true } | { success: false; error: string }

interface AddChildStudentParams {
  name: string
  gradeTrack: 'lgs' | 'yks'
  relationship?: string
}

export async function addChildStudent(params: AddChildStudentParams): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) return { success: false, error: 'Giriş yapmalısın' }

  const admin = createAdminClient()
  const [localPart, domain] = user.email.split('@')
  const syntheticEmail = `${localPart}+ogrenci${randomUUID().slice(0, 6)}@${domain}`

  const { data: createdUser, error: createError } = await admin.auth.admin.createUser({
    email: syntheticEmail,
    password: randomUUID(),
    email_confirm: true,
    user_metadata: { name: params.name, role: 'student', grade_track: params.gradeTrack },
  })

  if (createError || !createdUser.user) {
    return { success: false, error: 'Öğrenci profili oluşturulamadı' }
  }

  const { error: linkError } = await supabase.from('guardian_links').insert({
    guardian_id: user.id,
    student_id: createdUser.user.id,
    relationship: params.relationship ?? null,
  })

  if (linkError) {
    await admin.auth.admin.deleteUser(createdUser.user.id)
    return { success: false, error: linkError.message }
  }

  revalidatePath('/dashboard/student/bookings')
  return { success: true }
}
