import Link from 'next/link'
import { ArrowRight, LayoutDashboard, Sparkles } from 'lucide-react'
import type { UserRole } from '@/types'

interface AuthenticatedWelcomeBannerProps {
  userName: string
  role: UserRole
}

const DASHBOARD_ROUTES: Record<UserRole, { label: string; href: string; roleLabel: string }> = {
  student: { label: 'Öğrenci Paneline Git', href: '/dashboard/student', roleLabel: '🎓 Öğrenci' },
  instructor: { label: 'Eğitmen Paneline Git', href: '/dashboard/instructor', roleLabel: '👨‍🏫 Eğitmen' },
  parent: { label: 'Veli Paneline Git', href: '/dashboard/parent', roleLabel: '👨‍👩‍👧 Veli' },
  admin: { label: 'Yönetim Paneline Git', href: '/dashboard/admin', roleLabel: '🛡️ Yönetici' },
}

export function AuthenticatedWelcomeBanner({ userName, role }: AuthenticatedWelcomeBannerProps) {
  const info = DASHBOARD_ROUTES[role] || {
    label: 'Panele Git',
    href: '/dashboard',
    roleLabel: 'Kullanıcı',
  }

  return (
    <div className="bg-[#1B2430] text-[#F4F1E8] rounded-2xl p-4 sm:p-5 border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430] flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3 text-center sm:text-left">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DD7B3A] text-[#F4F1E8] border-2 border-white/20">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-0.5">
            <span className="font-bold text-base sm:text-lg">Tekrar Hoş Geldin, {userName}!</span>
            <span className="text-[11px] font-black uppercase px-2 py-0.5 rounded bg-[#D5EAE3] text-[#1B2430]">
              {info.roleLabel}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#F4F1E8]/70 font-semibold">
            Hesabınız aktif. Derslerinizi, planlarınızı ve bildirimlerinizi panelinizden yönetebilirsiniz.
          </p>
        </div>
      </div>
      <Link
        href={info.href}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl bg-[#DD7B3A] text-[#F4F1E8] font-bold text-sm sm:text-base border-2 border-white/30 shadow-[0_3px_0_#000] hover:translate-y-[-1px] active:translate-y-0.5 active:shadow-none transition-all text-center whitespace-nowrap"
      >
        <LayoutDashboard className="w-4 h-4" />
        <span>{info.label}</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  )
}
