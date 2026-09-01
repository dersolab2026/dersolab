import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AIAsistanClient } from './AIAsistanClient'

export const metadata = {
  title: 'AI Soru Asistanı — DersoLab',
  description: 'Google Gemini ile güçlendirilmiş LGS ve YKS soru çözüm asistanı.',
}

export default async function AIAsistanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return <AIAsistanClient />
}
