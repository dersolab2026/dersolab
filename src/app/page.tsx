import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/types'
import { SocialLinks } from '@/components/home/SocialLinks'
import { AuthenticatedWelcomeBanner } from '@/components/home/AuthenticatedWelcomeBanner'
import { HomePersonaView } from '@/components/home/HomePersonaView'
import type { PersonaType } from '@/components/home/PersonaSwitcher'

interface HomePageProps {
  searchParams?: Promise<{ role?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userProfile: { name: string; role: UserRole } | null = null

  if (user) {
    const { data: userRow } = await supabase.from('users').select('name, role').eq('id', user.id).maybeSingle()
    if (userRow) {
      userProfile = {
        name: userRow.name || 'Kullanıcı',
        role: userRow.role as UserRole,
      }
    }
  }

  const resolvedParams = searchParams ? await searchParams : undefined
  const roleParam = resolvedParams?.role as PersonaType | undefined
  const initialPersona: PersonaType =
    roleParam && ['student', 'parent', 'instructor'].includes(roleParam)
      ? roleParam
      : userProfile?.role === 'parent'
      ? 'parent'
      : userProfile?.role === 'instructor'
      ? 'instructor'
      : 'student'

  return (
    <div className="min-h-screen w-full bg-[#D5EAE3] relative overflow-hidden">
      {/* Neo-brutalist patterned background */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(45deg, #6FA89E 25%, transparent 25%), linear-gradient(-45deg, #6FA89E 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #6FA89E 75%), linear-gradient(-45deg, transparent 75%, #6FA89E 75%)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl space-y-7 p-4 sm:p-6 py-8 sm:py-12">
        {/* Sabit Marka & Logo Şeridi */}
        <div className="bg-[#F4F1E8] rounded-2xl p-6 sm:p-7 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430] flex items-center justify-center">
          <img src="/dersolab-logo.png" alt="DersoLab" className="h-auto w-full max-w-[360px]" />
        </div>

        {/* SEO Ana Başlık */}
        <h1 className="sr-only">
          DersoLab — Öğrenciler, Veliler ve Eğitmenler İçin Bire Bir Online Özel Ders ve Koçluk Platformu
        </h1>

        {/* Giriş yapmış kullanıcılar için akıllı karşılama */}
        {userProfile && <AuthenticatedWelcomeBanner userName={userProfile.name} role={userProfile.role} />}

        {/* Dinamik Rol Bazlı Ana Sayfa Deneyimi (Öğrenci, Veli, Eğitmen) */}
        <HomePersonaView initialPersona={initialPersona} />

        {/* Giriş bağlantısı (ziyaretçiler için) */}
        {!userProfile && (
          <p className="text-center text-base font-bold text-[#1B2430]">
            Zaten bir hesabınız var mı?{' '}
            <Link href="/login" className="underline hover:text-[#DD7B3A] transition-colors">
              Giriş Yapın
            </Link>
          </p>
        )}

        {/* Sosyal Medya ve Topluluk */}
        <SocialLinks />

        {/* Alt Bilgi & Yasal */}
        <div className="flex flex-wrap justify-center gap-5 text-sm font-sans font-semibold text-[#1B2430]/70 pb-4">
          <Link href="/hakkimizda" className="hover:underline hover:text-[#1B2430]">
            Hakkımızda
          </Link>
          <Link href="/privacy" className="hover:underline hover:text-[#1B2430]">
            Gizlilik Politikası
          </Link>
          <Link href="/terms" className="hover:underline hover:text-[#1B2430]">
            Kullanım Şartları
          </Link>
        </div>
      </div>
    </div>
  )
}
