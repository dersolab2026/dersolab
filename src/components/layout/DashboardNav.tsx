'use client'

import type { UserRole } from '@/types'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import { logoutUser } from '@/actions/auth'
import { NotificationBell } from '@/components/layout/NotificationBell'
import type { NotificationItem } from '@/actions/notifications'
import { PIXEL_BUTTON_SECONDARY } from '@/lib/theme'

const SIDEBAR_COLLAPSED_KEY = 'dersolab-sidebar-collapsed'
const SIDEBAR_WIDTH = 224

const SIDEBAR_LINK_BASE = 'block w-full px-3 py-2 rounded-lg border-2 border-[#1B2430] text-sm font-bold text-left'
const SIDEBAR_LINK_ACTIVE = `${SIDEBAR_LINK_BASE} bg-[#DD7B3A] text-[#F4F1E8]`
const SIDEBAR_LINK_INACTIVE = `${SIDEBAR_LINK_BASE} bg-white text-[#1B2430]`

interface DashboardNavProps {
  role: UserRole
  offersFreeTrial?: boolean
  notifications: NotificationItem[]
}

const NAV_ITEMS: Record<string, { href: string; label: string }[]> = {
  student: [
    { href: '/dashboard/student/bookings', label: 'Derslerim' },
    { href: '/dashboard/student/gunluk', label: 'Günlük' },
    { href: '/dashboard/student/netlerim', label: 'Netlerim' },
    { href: '/dashboard/student/kocluk-formu', label: 'Koçluk Formu' },
    { href: '/dashboard/student/homework', label: 'Ödevlerim' },
    { href: '/dashboard/student/packages', label: 'Paketler' },
    { href: '/instructors', label: 'Eğitmenler' },
    { href: '/kocluk', label: 'Koçluk' },
    { href: '/demo-ders', label: 'Hoş Geldin Paketi' },
    { href: '/dashboard/student/nasil-calisir', label: 'Nasıl Çalışır?' },
    { href: '/dashboard/student/settings', label: 'Ayarlar' },
  ],
  parent: [
    { href: '/dashboard/parent', label: 'Öğrencilerim' },
    { href: '/dashboard/parent/paketler', label: 'Paketler' },
    { href: '/dashboard/parent/settings', label: 'Ayarlar' },
  ],
  instructor: [
    { href: '/dashboard/instructor', label: 'Derslerim' },
    { href: '/dashboard/instructor/ogrencilerim', label: 'Öğrencilerim' },
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
  const [collapsed, setCollapsed] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    setCollapsed(localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === '1')
    setHasMounted(true)
  }, [])

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, next ? '1' : '0')
      return next
    })
  }

  // Talep havuzunda yalnızca tanışma dersi var; sayfayı yalnızca tanışma
  // dersi veren eğitmenler görüyor.
  const instructorItemsWithDemo = offersFreeTrial
    ? [...NAV_ITEMS.instructor, { href: '/dashboard/instructor/demo-talepleri', label: 'Hoş Geldin Talepleri' }]
    : NAV_ITEMS.instructor

  // Admin hesabı genelde aynı zamanda aktif bir eğitmen de olduğu için
  // (sahibinin kendi hesabı gibi) admin menüsünün altında eğitmen
  // sekmeleri de gösteriliyor, aralarına bir ayraç konuyor.
  const items = role === 'admin'
    ? [...NAV_ITEMS.admin, ...instructorItemsWithDemo]
    : role === 'instructor' ? instructorItemsWithDemo : NAV_ITEMS[role] ?? []

  const dividerIndex = role === 'admin' ? NAV_ITEMS.admin.length : -1

  return (
    <>
      {/* Mobil: üst bar + hamburger */}
      <nav className="flex md:hidden items-center justify-between gap-2 border-b-4 border-[#1B2430] bg-[#F4F1E8] px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Menüyü aç"
            className={`${PIXEL_BUTTON_SECONDARY} p-1.5`}
          >
            {/* Kafa kare değil (300x242); w-auto olmazsa eziliyor.
                imageRendering:pixelated YOK — kaynak yumuşak bir çizim,
                zorlanınca kenarlar lapa oluyordu. */}
            <img src="/fox-head.png" alt="" className="h-7 w-auto" />
          </button>
          <Link href="/dashboard">
            <img src="/dersolab-logo-560.png" alt="DersoLab" className="h-7 w-auto" />
          </Link>
        </div>
        <NotificationBell initialNotifications={notifications} role={role} />
      </nav>

      {/* Mobil: kayan menü (drawer) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#1B2430]/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] flex flex-col border-r-4 border-[#1B2430] bg-[#F4F1E8] px-4 py-5 transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-6 shrink-0">
          <Link href="/dashboard">
            <img src="/dersolab-logo-560.png" alt="DersoLab" className="h-8 w-auto" />
          </Link>
          <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Menüyü kapat" className="p-1">
            <X className="h-5 w-5 text-[#1B2430]" />
          </button>
        </div>
        <div className="flex-1 flex flex-col gap-2 overflow-y-auto gizli-kaydirma">
          {items.map((item, i) => (
            <div key={item.href}>
              {i === dividerIndex && <div className="my-2 border-t-2 border-[#1B2430]/10" />}
              <Link
                href={item.href}
                className={pathname === item.href ? SIDEBAR_LINK_ACTIVE : SIDEBAR_LINK_INACTIVE}
              >
                {item.label}
              </Link>
            </div>
          ))}
        </div>
        <div className="pt-4 mt-4 border-t-2 border-[#1B2430]/10 shrink-0">
          <form action={logoutUser}>
            <button type="submit" className={`${PIXEL_BUTTON_SECONDARY} w-full px-3 py-1.5 text-xs`}>Çıkış Yap</button>
          </form>
        </div>
      </div>

      {/* Masaüstü: sol menü (açılıp kapanabilir) */}
      <aside
        className={`hidden md:flex md:flex-col md:shrink-0 md:min-w-0 md:sticky md:top-0 md:h-screen md:overflow-hidden border-r-4 border-[#1B2430] bg-[#F4F1E8] py-5 ${hasMounted ? 'transition-[width,padding] duration-300 ease-in-out' : ''}`}
        style={{
          width: collapsed ? 0 : SIDEBAR_WIDTH,
          flexBasis: collapsed ? 0 : SIDEBAR_WIDTH,
          flexGrow: 0,
          flexShrink: 0,
          paddingLeft: collapsed ? 0 : 16,
          paddingRight: collapsed ? 0 : 16,
        }}
      >
        <div className="flex flex-col h-full" style={{ width: SIDEBAR_WIDTH - 32 }}>
          <Link href="/dashboard" className="mb-6 block shrink-0">
            <img src="/dersolab-logo-560.png" alt="DersoLab" className="h-8 w-auto" />
          </Link>
          <div className="flex-1 flex flex-col gap-2 overflow-y-auto gizli-kaydirma">
            {items.map((item, i) => (
              <div key={item.href}>
                {i === dividerIndex && <div className="my-2 border-t-2 border-[#1B2430]/10" />}
                <Link
                  href={item.href}
                  className={pathname === item.href ? SIDEBAR_LINK_ACTIVE : SIDEBAR_LINK_INACTIVE}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t-2 border-[#1B2430]/10 shrink-0">
            <NotificationBell initialNotifications={notifications} role={role} panelPosition="up" />
            <form action={logoutUser}>
              <button type="submit" className={`${PIXEL_BUTTON_SECONDARY} px-3 py-1.5 text-xs`}>Çıkış Yap</button>
            </form>
          </div>
        </div>
      </aside>

      <button
        type="button"
        onClick={toggleCollapsed}
        aria-label={collapsed ? 'Menüyü aç' : 'Menüyü kapat'}
        className={`hidden md:flex fixed top-24 z-30 h-10 w-10 items-center justify-center rounded-full border-2 border-[#1B2430] bg-white shadow-sm ${hasMounted ? 'transition-[left] duration-300 ease-in-out' : ''}`}
        style={{ left: collapsed ? 12 : SIDEBAR_WIDTH - 20 }}
      >
        {/* Kapalıyken tilki soluklaşıyor. Ayrı bir "uyuyan" görsel yok:
            eski kapalı-göz dosyası da kırpıktı ve temizinden türetmek
            gözleri bozuyordu; soluklaşma aynı geri bildirimi veriyor. */}
        <img
          src="/fox-head.png"
          alt=""
          className={`h-8 w-auto transition-opacity ${collapsed ? 'opacity-45' : 'opacity-100'}`}
        />
      </button>
    </>
  )
}
