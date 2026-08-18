import { redirect } from 'next/navigation'

// Tanışma dersi ve 1 haftalık koçluk artık tek paket olarak birlikte
// veriliyor; ayrı koçluk sayfası birleşik sayfaya yönleniyor.
export default function FreeCoachingPage() {
  redirect('/demo-ders')
}
