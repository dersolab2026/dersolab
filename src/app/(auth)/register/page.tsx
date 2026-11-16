import type { Metadata } from 'next'
import { RegisterForm } from '@/components/auth/RegisterForm'

export const metadata: Metadata = {
  title: 'Kayıt Ol',
  description: 'Ücretsiz hesap aç, onaylı eğitmenlerle bire bir online ders al.',
  alternates: {
    canonical: '/register',
  },
}

import { Suspense } from 'react'
import { AuthShell } from '@/components/auth/AuthShell'

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <AuthShell baslik="Kaydol">
          <div className="min-h-[320px] flex items-center justify-center text-sm font-semibold text-slate-400">
            Kayıt formu yükleniyor...
          </div>
        </AuthShell>
      }
    >
      <RegisterForm />
    </Suspense>
  )
}
