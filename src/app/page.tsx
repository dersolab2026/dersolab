import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import type { UserRole } from '@/types'
import { MinimalLuxuryHeader } from '@/components/home/MinimalLuxuryHeader'
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

  const dashboardHref =
    userProfile?.role === 'student'
      ? '/dashboard/student'
      : userProfile?.role === 'instructor'
      ? '/dashboard/instructor'
      : userProfile?.role === 'parent'
      ? '/dashboard/parent'
      : '/dashboard'

  return (
    <div className="min-h-screen w-full bg-[#080B11] text-slate-100 relative overflow-hidden selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* High-End Ambient Gradient Lighting (Dark Obsidian Mesh) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[25%] left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-emerald-500/[0.08] rounded-full blur-[140px] animate-pulse-glow" />
        <div className="absolute top-[40%] -left-[15%] w-[700px] h-[600px] bg-teal-500/[0.05] rounded-full blur-[160px]" />
        <div className="absolute top-[70%] -right-[15%] w-[600px] h-[600px] bg-indigo-500/[0.04] rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl space-y-8 px-4 sm:px-6 py-4 sm:py-8">
        {/* Minimal Luxury Navigation Header */}
        <MinimalLuxuryHeader isLoggedIn={!!userProfile} dashboardHref={dashboardHref} />

        {/* Hidden SEO H1 */}
        <h1 className="sr-only">
          DersoLab — Bire Bir Canlı Online Özel Ders ve Koçluk Platformu
        </h1>

        {/* Authenticated Welcome Banner */}
        {userProfile && <AuthenticatedWelcomeBanner userName={userProfile.name} role={userProfile.role} />}

        {/* Dynamic Minimalist Luxury Persona Experience */}
        <HomePersonaView initialPersona={initialPersona} />

        {/* Minimalist Ultra-Clean Luxury Footer */}
        <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 pt-10 pb-8 border-t border-white/[0.08]">
          <p>© {new Date().getFullYear()} DersoLab Platformu. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-6">
            <Link href="/hakkimizda" className="hover:text-slate-300 transition-colors">
              Hakkımızda
            </Link>
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Gizlilik Politikası
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Kullanım Şartları
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}
