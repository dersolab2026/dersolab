import type { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Kayıt Ol',
  description: 'Ücretsiz hesap aç, onaylı eğitmenlerle bire bir online ders al.',
  alternates: {
    canonical: '/register',
  },
}

export default function RegisterPage() {
  return <RegisterForm />
}
