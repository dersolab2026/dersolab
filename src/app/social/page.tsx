import type { Metadata } from 'next'
import SocialStudioPage from '@/app/dashboard/admin/social/page'

export const metadata: Metadata = {
  title: 'Sosyal Medya Asistanı — DersoLab (@dersolabegitim)',
  description: 'DersoLab Instagram & TikTok içerik asistanı, kaydırmalı carousel, tekli post ve story oluşturucu.',
}

export default function StandaloneSocialPage() {
  return <SocialStudioPage />
}
