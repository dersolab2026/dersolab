'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, X } from 'lucide-react'
import {
  getNotifications, markNotificationRead, markAllNotificationsRead,
  deleteNotification, clearReadNotifications, type NotificationItem,
} from '@/actions/notifications'
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
  const readCount = notifications.filter((n) => n.isRead).length

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

  function handleDelete(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
    startTransition(() => { deleteNotification(id) })
  }

  function handleClearRead() {
    setNotifications((prev) => prev.filter((n) => !n.isRead))
    startTransition(() => { clearReadNotifications() })
  }

  return (
    <div className="relative shrink-0" ref={containerRef}>
      <button type="button" onClick={() => setIsOpen((v) => !v)} className="relative p-2" aria-label="Bildirimler">
        <Bell className={`h-5 w-5 ${unreadCount > 0 ? 'text-[#DD7B3A]' : 'text-[#1B2430]'}`} />
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
            <div className="flex items-center gap-3">
              {readCount > 0 && (
                <button type="button" onClick={handleClearRead} className="text-xs font-bold text-[#1B2430]/60 underline">
                  Okunanları temizle
                </button>
              )}
              {unreadCount > 0 && (
                <button type="button" onClick={handleMarkAllRead} className="text-xs font-bold text-[#DD7B3A] underline">
                  Tümünü okundu işaretle
                </button>
              )}
            </div>
          </div>
          {notifications.length === 0 ? (
            <p className="p-4 text-sm font-semibold text-[#1B2430]/60">Henüz bildirimin yok.</p>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li key={n.id} className="relative border-b border-[#1B2430]/10">
                  <button
                    type="button"
                    onClick={() => handleItemClick(n)}
                    className={`block w-full p-3 pr-8 text-left hover:bg-[#1B2430]/5 ${n.isRead ? '' : 'bg-[#DD7B3A]/10'}`}
                  >
                    <p className="text-sm font-bold text-[#1B2430]">{n.title}</p>
                    {n.body && <p className="mt-0.5 text-xs font-semibold text-[#1B2430]/70">{n.body}</p>}
                    <p className="mt-1 text-[10px] font-semibold text-[#1B2430]/50">
                      {new Date(n.createdAt).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDelete(n.id) }}
                    className="absolute top-3 right-2 text-[#1B2430]/40 hover:text-[#1B2430]"
                    aria-label="Bildirimi sil"
                  >
                    <X className="h-3.5 w-3.5" />
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
