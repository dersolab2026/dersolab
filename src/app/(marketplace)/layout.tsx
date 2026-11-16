import type { UserRole } from '@/types'
import type { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { DashboardNav } from '@/components/layout/DashboardNav'
import { getNotifications } from '@/actions/notifications'

export default async function MarketplaceLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return (
      <div className="dark flex flex-col min-h-screen bg-[#0a0a0a] text-slate-200 relative">
        <div className="fixed top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none z-0" />
        <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[120px] pointer-events-none z-0" />

        <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0a0a0a]/85 border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <Image src="/fox-head.png" alt="DersoLab" width={32} height={32} className="w-8 h-8 object-contain" />
              <span className="text-lg font-black tracking-tight text-white">
                Derso<span className="text-orange-400">Lab</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-5 text-sm font-semibold text-slate-300">
              <Link href="/instructors" className="hover:text-white transition-colors">Eğitmenler</Link>
              <Link href="/kocluk" className="hover:text-white transition-colors">Koçluk</Link>
              <Link href="/lab" className="hover:text-cyan-300 transition-colors">L.A.B.</Link>
              <Link href="/hesaplama" className="hover:text-white transition-colors">Net Simülatörü</Link>
              <Link href="/demo-ders" className="text-amber-300 hover:text-amber-200 transition-colors">Ücretsiz Demo</Link>
            </nav>

            <div className="flex items-center gap-2.5 shrink-0">
              <Link
                href="/login"
                className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs sm:text-sm font-bold text-slate-200 transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-xl bg-[#DD7B3A] hover:bg-[#DD7B3A]/90 text-xs sm:text-sm font-bold text-white transition-colors shadow-[0_0_15px_rgba(221,123,58,0.25)]"
              >
                Ücretsiz Kayıt
              </Link>
            </div>
          </div>
        </header>

        <main className="relative z-10 flex-1 min-w-0">{children}</main>
      </div>
    )
  }

  const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
  const role = (userRow?.role ?? 'student') as UserRole

  let offersFreeTrial = false
  if (role === 'instructor' || role === 'admin') {
    const { data: instructorRow } = await supabase
      .from('instructors').select('offers_free_trial').eq('user_id', user.id).single()
    offersFreeTrial = instructorRow?.offers_free_trial ?? false
  }

  const notifications = await getNotifications()

  return (
    <div className="dark md:flex min-h-screen bg-[#0a0a0a] text-slate-200 relative">
      {/* Global Background Orbs */}
      <div className="fixed top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-orange-600/10 blur-[120px] pointer-events-none z-0" />
      
      <div className="relative z-50 md:shrink-0">
        <DashboardNav role={role} offersFreeTrial={offersFreeTrial} notifications={notifications} />
      </div>
      <main className="relative z-10 md:flex-1 md:min-w-0">{children}</main>
    </div>
  )
}
