import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SocialStudioPage from '@/app/dashboard/admin/social/page'

export const metadata: Metadata = {
  title: 'Sosyal Medya Asistanı — DersoLab (@dersolabegitim)',
  description: 'DersoLab Instagram & TikTok içerik asistanı, kaydırmalı carousel, tekli post ve story oluşturucu.',
}

export default async function StandaloneSocialPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?redirect=/social')
  }

  const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
  if (userRow?.role !== 'admin') {
    redirect('/dashboard')
  }

  return <SocialStudioPage />
}
