import Link from 'next/link'
import { ArrowRight, LayoutDashboard, Sparkles } from 'lucide-react'
import type { UserRole } from '@/types'

interface AuthenticatedWelcomeBannerProps {
  userName: string
  role: UserRole
}

const DASHBOARD_ROUTES: Record<UserRole, { label: string; href: string; roleLabel: string }> = {
  student: { label: 'Öğrenci Paneline Git', href: '/dashboard/student', roleLabel: 'Öğrenci' },
  instructor: { label: 'Eğitmen Paneline Git', href: '/dashboard/instructor', roleLabel: 'Eğitmen' },
  parent: { label: 'Veli Paneline Git', href: '/dashboard/parent', roleLabel: 'Veli' },
  admin: { label: 'Yönetim Paneline Git', href: '/dashboard/admin', roleLabel: 'Yönetici' },
}

export function AuthenticatedWelcomeBanner({ userName, role }: AuthenticatedWelcomeBannerProps) {
  const info = DASHBOARD_ROUTES[role] || {
    label: 'Panele Git',
    href: '/dashboard',
    roleLabel: 'Kullanıcı',
  }

  return (
    <div className="rounded-2xl bg-slate-950 text-white p-4 sm:p-5 border border-slate-800 shadow-xl shadow-slate-950/10 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3.5 text-center sm:text-left">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-0.5">
            <span className="font-semibold text-sm sm:text-base text-white">Tekrar Hoş Geldiniz, {userName}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {info.roleLabel}
            </span>
          </div>
          <p className="text-xs text-slate-400 font-normal">
            Derslerinizi ve randevularınızı panelinizden yönetebilirsiniz.
          </p>
        </div>
      </div>
      <Link
        href={info.href}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-5 rounded-xl bg-white text-slate-950 font-semibold text-xs sm:text-sm hover:bg-slate-100 transition-all text-center whitespace-nowrap"
      >
        <LayoutDashboard className="w-4 h-4 text-slate-700" />
        <span>{info.label}</span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
      </Link>
    </div>
  )
}
