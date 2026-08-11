'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { logoutUser } from '@/actions/auth'
import { NotificationBell } from '@/components/layout/NotificationBell'
import type { NotificationItem } from '@/actions/notifications'
import { PIXEL_BUTTON_SECONDARY } from '@/lib/theme'

const NAV_LINK_BASE = 'inline-block px-3 py-1.5 rounded-lg border-2 border-[#1B2430] text-sm font-bold'
const NAV_LINK_ACTIVE = `${NAV_LINK_BASE} bg-[#DD7B3A] text-[#F4F1E8]`
const NAV_LINK_INACTIVE = `${NAV_LINK_BASE} bg-white text-[#1B2430]`

interface DashboardNavProps {
  role: 'student' | 'instructor' | 'admin'
  offersFreeTrial?: boolean
  notifications: NotificationItem[]
}

const NAV_ITEMS: Record<string, { href: string; label: string }[]> = {
  student: [
    { href: '/dashboard/student/bookings', label: 'Derslerim' },
    { href: '/dashboard/student/homework', label: 'Ödevlerim' },
    { href: '/dashboard/student/packages', label: 'Paketler' },
    { href: '/instructors', label: 'Eğitmenler' },
    { href: '/rehberlik', label: 'Rehberlik' },
    { href: '/demo-ders', label: 'Tanışma Dersi' },
    { href: '/dashboard/student/nasil-calisir', label: 'Nasıl Çalışır?' },
  ],
  instructor: [
    { href: '/dashboard/instructor', label: 'Derslerim' },
    { href: '/dashboard/instructor/homework', label: 'Ödevler' },
    { href: '/dashboard/instructor/availability', label: 'Ajanda' },
    { href: '/dashboard/instructor/profile', label: 'Profilim' },
    { href: '/dashboard/instructor/odemeler', label: 'Ödemelerim' },
    { href: '/dashboard/instructor/settings', label: 'Ayarlar' },
    { href: '/dashboard/instructor/nasil-calisir', label: 'Nasıl Çalışır?' },
  ],
  admin: [
    { href: '/dashboard/admin', label: 'Genel Bakış' },
    { href: '/dashboard/admin/users', label: 'Kullanıcılar' },
    { href: '/dashboard/admin/instructors', label: 'Eğitmen Onayları' },
    { href: '/dashboard/admin/packages', label: 'Paketler' },
    { href: '/dashboard/admin/odemeler', label: 'Eşleşmeyen Ödemeler' },
    { href: '/dashboard/admin/muhasebe', label: 'Muhasebe' },
    { href: '/dashboard/admin/notifications', label: 'Bildirim Gönder' },
  ],
}

export function DashboardNav({ role, offersFreeTrial, notifications }: DashboardNavProps) {
  const pathname = usePathname()

  const instructorItemsWithDemo = offersFreeTrial
    ? [...NAV_ITEMS.instructor, { href: '/dashboard/instructor/demo-talepleri', label: 'Demo Talepleri' }]
    : NAV_ITEMS.instructor

  const items = role === 'instructor' ? instructorItemsWithDemo : NAV_ITEMS[role] ?? []

  if (role === 'admin') {
    const instructorItems = instructorItemsWithDemo

    return (
      <nav className="flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-4 overflow-x-auto">
          <Link href="/dashboard" className="font-semibold">DersoLab</Link>
          {items.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? 'text-sm font-medium' : 'text-sm text-muted-foreground'}>
              {item.label}
            </Link>
          ))}
          <span className="text-muted-foreground">|</span>
          {instructorItems.map((item) => (
            <Link key={item.href} href={item.href} className={pathname === item.href ? 'text-sm font-medium' : 'text-sm text-muted-foreground'}>
              {item.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <NotificationBell initialNotifications={notifications} role={role} />
          <form action={logoutUser}>
            <Button type="submit" variant="ghost" size="sm">Çıkış Yap</Button>
          </form>
        </div>
      </nav>
    )
  }

  return (
    <nav className="flex items-center justify-between gap-2 border-b-4 border-[#1B2430] bg-[#F4F1E8] px-4 sm:px-6 py-3">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 overflow-x-auto">
        <Link href="/dashboard" className="shrink-0 mr-1">
          <img src="/dersolab-logo.png" alt="DersoLab" className="h-7 w-auto" />
        </Link>
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${pathname === item.href ? NAV_LINK_ACTIVE : NAV_LINK_INACTIVE} whitespace-nowrap shrink-0`}
          >
            {item.label}
          </Link>
        ))}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <NotificationBell initialNotifications={notifications} role={role} />
        <form action={logoutUser}>
          <button type="submit" className={`${PIXEL_BUTTON_SECONDARY} px-3 py-1.5 text-xs`}>Çıkış Yap</button>
        </form>
      </div>
    </nav>
  )
}
