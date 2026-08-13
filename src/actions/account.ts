'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type ActionResult = { success: true } | { success: false; error: string }

export async function updateMyPassword(newPassword: string): Promise<ActionResult> {
  if (newPassword.length < 8) return { success: false, error: 'Şifre en az 8 karakter olmalı' }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { success: false, error: error.message }

  return { success: true }
}

export async function deleteMyAccount(): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const admin = createAdminClient()
  const anonymizedEmail = `silinmis-${user.id}@dersolab.local`

  const { error: userError } = await admin
    .from('users')
    .update({
      name: 'Silinmiş Kullanıcı',
      email: anonymizedEmail,
      phone: null,
      birth_date: null,
      avatar_url: null,
      identity_number: null,
      address: null,
      city: null,
    })
    .eq('id', user.id)

  if (userError) return { success: false, error: userError.message }

  await admin
    .from('instructors')
    .update({ approval_status: 'rejected', bio: null, intro_video_url: null, paused: true })
    .eq('user_id', user.id)

  const { error: authError } = await admin.auth.admin.updateUserById(user.id, {
    email: anonymizedEmail,
    ban_duration: '876000h',
  })

  if (authError) return { success: false, error: authError.message }

  await supabase.auth.signOut()
  return { success: true }
}
