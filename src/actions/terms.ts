'use server'

import { TERMS_VERSION } from '@/lib/legal'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

type ActionResult = { success: true } | { success: false; error: string }

export async function acceptCurrentTerms(): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Giriş yapmalısın' }

  const admin = createAdminClient()
  const { error } = await admin.from('terms_acceptances').upsert(
    {
      user_id: user.id,
      terms_version: TERMS_VERSION,
      acceptance_source: 'oauth',
    },
    { onConflict: 'user_id,terms_version', ignoreDuplicates: true },
  )

  if (error) return { success: false, error: 'Kullanım şartları kaydedilemedi, lütfen tekrar dene' }
  return { success: true }
}
