'use client'

import type { UserRole } from '@/types'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, FlaskConical, Sparkles } from 'lucide-react'
import { logoutUser } from '@/actions/auth'
import { NotificationBell } from '@/components/layout/NotificationBell'
import type { NotificationItem } from '@/actions/notifications'
import { PIXEL_BUTTON_SECONDARY } from '@/lib/theme'

const SIDEBAR_COLLAPSED_KEY = 'dersolab-sidebar-collapsed'
const SIDEBAR_WIDTH = 224

const SIDEBAR_LINK_BASE = 'block w-full px-3 py-2 rounded-lg border border-transparent text-sm font-bold text-left transition-all duration-300'
const SIDEBAR_LINK_INACTIVE = `${SIDEBAR_LINK_BASE} bg-transparent text-slate-400 hover:text-slate-200 hover:bg-white/5`

function getActiveLinkClass(role: string) {
  if (role === 'instructor' || role === 'admin') {
    return `${SIDEBAR_LINK_BASE} bg-blue-500/20 border-blue-500/30 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]`
  }
  if (role === 'parent') {
    return `${SIDEBAR_LINK_BASE} bg-emerald-500/20 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.15)]`
  }
  return `${SIDEBAR_LINK_BASE} bg-orange-500/20 border-orange-500/30 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]`
}

function getLogoTextClass(role: string) {
  if (role === 'instructor' || role === 'admin') return 'from-blue-400 to-cyan-400'
  if (role === 'parent') return 'from-emerald-400 to-teal-400'
  return 'from-orange-400 to-amber-400'
}

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
    { href: '/dashboard/student/ai-asistan', label: 'AI Soru Asistanı' },
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

  const mascotSrc = '/fox-head.png'

  return (
    <>
      {/* Mobil: üst bar + hamburger */}
      <nav className="flex md:hidden items-center justify-between gap-2 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Menüyü aç"
            className="p-1 hover:scale-105 transition-transform"
          >
            <img src={mascotSrc} alt="" className="h-8 w-8 object-contain drop-shadow-md" />
          </button>
          <Link href="/dashboard">
            <div className="flex items-center gap-2 group">
              <span className="font-black text-white text-lg tracking-tight">Derso<span className={`text-transparent bg-clip-text bg-gradient-to-r ${getLogoTextClass(role)}`}>Lab</span></span>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/lab"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/15 border border-purple-500/30 text-purple-300 hover:bg-purple-500/25 transition-all shadow-sm"
          >
            <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
            <span>L.A.B.</span>
          </Link>
          <NotificationBell initialNotifications={notifications} role={role} />
        </div>
      </nav>

      {/* Mobil: kayan menü (drawer) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 max-w-[80vw] flex flex-col border-r border-white/10 bg-[#0a0a0a] px-4 py-5 transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-5 shrink-0">
          <Link href="/dashboard">
            <div className="flex items-center gap-2 group">
              <span className="font-black text-white text-xl tracking-tight">Derso<span className={`text-transparent bg-clip-text bg-gradient-to-r ${getLogoTextClass(role)}`}>Lab</span></span>
            </div>
          </Link>
          <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Menüyü kapat" className="p-1">
            <X className="h-5 w-5 text-slate-400" />
          </button>
        </div>

        {/* Mobil: L.A.B. Ayrı Öne Çıkan Buton */}
        <div className="mb-4 shrink-0">
          <Link
            href="/lab"
            onClick={() => setMobileMenuOpen(false)}
            className={`group relative flex items-center justify-between p-2.5 rounded-xl border transition-all duration-300 ${
              pathname.startsWith('/lab')
                ? 'bg-gradient-to-r from-purple-500/25 via-indigo-500/20 to-pink-500/20 border-purple-400/50 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                : 'bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-900/20 border-purple-500/30 text-purple-200 hover:border-purple-400/60 hover:bg-purple-900/40'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-purple-500/25">
                <FlaskConical className="w-4 h-4" />
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm tracking-wider text-white">L.A.B.</span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white uppercase tracking-wider">
                    Yeni
                  </span>
                </div>
                <span className="text-[10px] text-purple-300/80 font-medium">
                  Laboratuvar & Simülasyon
                </span>
              </div>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-purple-400/70 shrink-0" />
          </Link>
          <div className="mt-3 border-t border-white/10" />
        </div>

        <div className="flex-1 flex flex-col gap-2 overflow-y-auto gizli-kaydirma">
          {items.map((item, i) => (
            <div key={item.href}>
              {i === dividerIndex && <div className="my-2 border-t border-white/10" />}
              <Link
                href={item.href}
                className={pathname === item.href ? getActiveLinkClass(role) : SIDEBAR_LINK_INACTIVE}
              >
                {item.label}
              </Link>
            </div>
          ))}
        </div>
        <div className="pt-4 mt-4 border-t border-white/10 shrink-0">
          <form action={logoutUser}>
            <button type="submit" className={`${PIXEL_BUTTON_SECONDARY} w-full px-3 py-1.5 text-xs`}>Çıkış Yap</button>
          </form>
        </div>
      </div>

      {/* Masaüstü: sol menü (açılıp kapanabilir) */}
      <aside
        className={`hidden md:flex md:flex-col md:shrink-0 md:min-w-0 md:sticky md:top-0 md:h-screen md:overflow-hidden border-r border-white/10 bg-[#0a0a0a]/50 backdrop-blur-xl py-5 ${hasMounted ? 'transition-[width,padding] duration-300 ease-in-out' : ''}`}
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
          <Link href="/dashboard" className="mb-5 block shrink-0">
            <div className="flex items-center gap-2 group">
              <span className="font-black text-white text-xl tracking-tight">Derso<span className={`text-transparent bg-clip-text bg-gradient-to-r ${getLogoTextClass(role)}`}>Lab</span></span>
            </div>
          </Link>

          {/* Masaüstü: L.A.B. Ayrı Öne Çıkan Buton (Öğrenci, Eğitmen ve Veli için) */}
          <div className="mb-4 shrink-0">
            <Link
              href="/lab"
              className={`group relative flex items-center justify-between p-2.5 rounded-xl border transition-all duration-300 ${
                pathname.startsWith('/lab')
                  ? 'bg-gradient-to-r from-purple-500/25 via-indigo-500/20 to-pink-500/20 border-purple-400/50 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)]'
                  : 'bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-purple-900/20 border-purple-500/30 text-purple-200 hover:border-purple-400/60 hover:bg-purple-900/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 via-indigo-500 to-pink-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-purple-500/25 group-hover:scale-105 transition-transform">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm tracking-wider text-white">L.A.B.</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-gradient-to-r from-purple-500 to-pink-500 text-white uppercase tracking-wider shadow-sm">
                      Yeni
                    </span>
                  </div>
                  <span className="text-[10px] text-purple-300/80 font-medium truncate">
                    Simülasyon Merkezi
                  </span>
                </div>
              </div>
              <Sparkles className="w-3.5 h-3.5 text-purple-400/70 shrink-0 group-hover:text-purple-200 group-hover:rotate-12 transition-all" />
            </Link>
            <div className="mt-3 border-t border-white/10" />
          </div>

          <div className="flex-1 flex flex-col gap-2 overflow-y-auto gizli-kaydirma">
            {items.map((item, i) => (
              <div key={item.href}>
                {i === dividerIndex && <div className="my-2 border-t border-white/10" />}
                <Link
                  href={item.href}
                  className={pathname === item.href ? getActiveLinkClass(role) : SIDEBAR_LINK_INACTIVE}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between gap-2 pt-4 mt-4 border-t border-white/10 shrink-0">
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
        className={`hidden md:flex fixed top-24 z-30 h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)] ${hasMounted ? 'transition-[left] duration-300 ease-in-out' : ''}`}
        style={{ left: collapsed ? 12 : SIDEBAR_WIDTH - 20 }}
      >
        <img
          src={mascotSrc}
          alt=""
          className={`h-8 w-8 object-contain drop-shadow-md transition-opacity ${collapsed ? 'opacity-45' : 'opacity-100'}`}
        />
      </button>
    </>
  )
}
