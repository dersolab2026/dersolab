import { RegisterForm } from '@/components/auth/RegisterForm'

// Sunucu bileseni oldugu icin metadata'yi dogrudan verebiliyor;
// login/forgot/reset istemci bileseni oldugundan onlarda layout.tsx var.
export const metadata = {
  title: 'Kaydol',
  description: 'Ücretsiz hesap aç, onaylı eğitmenlerle bire bir online ders al.',
}

export default function RegisterPage() {
  return <RegisterForm />
}
