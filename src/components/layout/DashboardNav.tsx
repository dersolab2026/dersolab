'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { logoutUser } from '@/actions/auth'

interface DashboardNavProps {
  role: 'student' | 'parent' | 'instructor' | 'admin'
}

const NAV_ITEMS: Record<string, { href: string; label: string }[]> = {
  student: [
    { href: '/dashboard/student/bookings', label: 'Derslerim' },
    { href: '/dashboard/student/homework', label: 'Ödevlerim' },
    { href: '/dashboard/student/packages', label: 'Paketler' },
    { href: '/instructors', label: 'Eğitmen Bul' },
  ],
  parent: [
    { href: '/dashboard/student/bookings', label: 'Derslerim' },
    { href: '/dashboard/student/homework', label: 'Ödevler' },
    { href: '/dashboard/student/packages', label: 'Paketler' },
    { href: '/instructors', label: 'Eğitmen Bul' },
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
