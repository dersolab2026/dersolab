'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Bell } from 'lucide-react'
import { getNotifications, markNotificationRead, markAllNotificationsRead, type NotificationItem } from '@/actions/notifications'
import { getNotificationLink } from '@/lib/notifications/get-notification-link'
import { PIXEL_CARD } from '@/lib/theme'

const POLL_INTERVAL_MS = 30_000

interface NotificationBellProps {
  initialNotifications: NotificationItem[]
  role: 'student' | 'parent' | 'instructor' | 'admin'
}

export function NotificationBell({ initialNotifications, role }: NotificationBellProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const [, startTransition] = useTransition()
  const containerRef = useRef<HTMLDivElement>(null)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  useEffect(() => {
    const interval = setInterval(async () => {
      const fresh = await getNotifications()
      setNotifications(fresh)
    }, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleItemClick(notification: NotificationItem) {
    if (!notification.isRead) {
      setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)))
      startTransition(() => { markNotificationRead(notification.id) })
    }
    setIsOpen(false)
    router.push(getNotificationLink(notification.type, role))
  }

  function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    startTransition(() => { markAllNotificationsRead() })
  }

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button type="button" onClick={() => setIsOpen((v) => !v)} className="relative p-2" aria-label="Bildirimler">
        <Bell className="h-5 w-5 text-[#1B2430]" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#DD7B3A] px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className={`absolute right-0 top-full mt-2 max-h-96 w-80 overflow-y-auto z-50 ${PIXEL_CARD} p-0`}>
          <div className="flex items-center justify-between border-b-2 border-[#1B2430] p-3">
            <p className="font-bold text-[#1B2430]">Bildirimler</p>
            {unreadCount > 0 && (
              <button type="button" onClick={handleMarkAllRead} className="text-xs font-bold text-[#DD7B3A] underline">
                Tümünü okundu işaretle
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="p-4 text-sm font-semibold text-[#1B2430]/60">Henüz bildirimin yok.</p>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => handleItemClick(n)}
                    className={`block w-full border-b border-[#1B2430]/10 p-3 text-left hover:bg-[#1B2430]/5 ${n.isRead ? '' : 'bg-[#DD7B3A]/10'}`}
                  >
                    <p className="text-sm font-bold text-[#1B2430]">{n.title}</p>
                    {n.body && <p className="mt-0.5 text-xs font-semibold text-[#1B2430]/70">{n.body}</p>}
                    <p className="mt-1 text-[10px] font-semibold text-[#1B2430]/50">
                      {new Date(n.createdAt).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
