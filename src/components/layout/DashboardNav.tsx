'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { logoutUser } from '@/actions/auth'
import { PIXEL_BUTTON_SECONDARY } from '@/lib/theme'

interface DashboardNavProps {
  role: 'student' | 'parent' | 'instructor' | 'admin'
}

const NAV_ITEMS: Record<string, { href: string; label: string }[]> = {
  student: [
    { href: '/dashboard/student/bookings', label: 'Derslerim' },
    { href: '/dashboard/student/homework', label: 'Ödevlerim' },
    { href: '/dashboard/student/packages', label: 'Paketler' },
    { href: '/instructors', label: 'Eğitmen Bul' },
    { href: '/rehberlik', label: 'Rehberlik' },
  ],
  parent: [
    { href: '/dashboard/student/bookings', label: 'Derslerim' },
    { href: '/dashboard/student/homework', label: 'Ödevler' },
    { href: '/dashboard/student/packages', label: 'Paketler' },
    { href: '/instructors', label: 'Eğitmen Bul' },
    { href: '/rehberlik', label: 'Rehberlik' },
  ],
  instructor: [
    { href: '/dashboard/instructor', label: 'Derslerim' },
    { href: '/dashboard/instructor/homework', label: 'Ödevler' },
    { href: '/dashboard/instructor/availability', label: 'Müsaitlik' },
    { href: '/dashboard/instructor/profile', label: 'Profilim' },
    { href: '/dashboard/instructor/settings', label: 'Ayarlar' },
  ],
  admin: [
    { href: '/dashboard/admin', label: 'Genel Bakış' },
    { href: '/dashboard/admin/instructors', label: 'Eğitmen Onayları' },
    { href: '/dashboard/admin/packages', label: 'Paketler' },
  ],
}

export function DashboardNav({ role }: DashboardNavProps) {
  const pathname = usePathname()
  const items = NAV_ITEMS[role] ?? []

  if (role === 'admin') {
    return (
      <nav className="flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-4 overflow-x-auto">
          <span className="font-semibold">DersoLab</span>
          {items.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? 'text-sm font-medium' : 'text-sm text-muted-foreground'}>
              {item.label}
            </Link>
          ))}
        </div>
        <form action={logoutUser}>
          <Button type="submit" variant="ghost" size="sm">Çıkış Yap</Button>
        </form>
      </nav>
    )
  }

  return (
    <nav className="flex items-center justify-between gap-4 border-b-4 border-[#1B2430] bg-[#F4F1E8] px-4 sm:px-6 py-3 overflow-x-auto">
      <div className="flex items-center gap-4 sm:gap-6 shrink-0">
        <img src="/dersolab-logo.png" alt="DersoLab" className="h-7 w-auto" />
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm font-bold whitespace-nowrap ${
              pathname === item.href ? 'text-[#DD7B3A] underline underline-offset-4' : 'text-[#1B2430]'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <form action={logoutUser} className="shrink-0">
        <button type="submit" className={`${PIXEL_BUTTON_SECONDARY} px-3 py-1.5 text-xs`}>Çıkış Yap</button>
      </form>
    </nav>
  )
}
