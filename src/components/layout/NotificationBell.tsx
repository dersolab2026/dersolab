'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Lightbulb, X } from 'lucide-react'
import {
  getNotifications, markNotificationRead, markAllNotificationsRead,
  deleteNotification, clearReadNotifications, type NotificationItem,
} from '@/actions/notifications'
import { getNotificationLink } from '@/lib/notifications/get-notification-link'
import { PIXEL_CARD } from '@/lib/theme'

const POLL_INTERVAL_MS = 30_000

interface NotificationBellProps {
  initialNotifications: NotificationItem[]
  role: 'student' | 'instructor' | 'admin'
  panelPosition?: 'up' | 'down'
}

const PANEL_WIDTH = 320

export function NotificationBell({ initialNotifications, role, panelPosition = 'down' }: NotificationBellProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const [, startTransition] = useTransition()
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [fixedStyle, setFixedStyle] = useState<{ left: number; bottom: number } | null>(null)

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

  // Kenar çubuğu taşmayı gizlediği için paneli sabit konumlandırıp kırpılmasını önlüyoruz.
  useEffect(() => {
    if (panelPosition !== 'up') return
    if (!isOpen) { setFixedStyle(null); return }

    function reposition() {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return
      setFixedStyle({
        left: Math.max(8, Math.min(rect.left, window.innerWidth - PANEL_WIDTH - 8)),
        bottom: window.innerHeight - rect.top + 8,
      })
    }

    reposition()
    window.addEventListener('resize', reposition)
    return () => window.removeEventListener('resize', reposition)
  }, [isOpen, panelPosition])

  function handleItemClick(notification: NotificationItem) {
    if (!notification.isRead) {
      setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)))
      startTransition(() => { markNotificationRead(notification.id) })
    }
    setIsOpen(false)
    router.push(notification.link ?? getNotificationLink(notification.type, role))
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
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="relative block pt-4"
        aria-label="Bildirimler"
      >
        <Lightbulb
          className={`absolute top-0 left-1/2 h-5 w-5 -translate-x-1/2 transition-all ${
            unreadCount > 0
              ? 'fill-yellow-300 text-yellow-500 drop-shadow-[0_0_6px_rgba(250,204,21,0.95)] animate-pulse'
              : 'text-[#1B2430]/25'
          }`}
        />
        <img
          src="/fox-mascot-icon.png"
          alt="Bildirimler"
          className="h-12 w-12"
          style={{ imageRendering: 'pixelated' }}
        />
        {unreadCount > 0 && (
          <span className="absolute bottom-0 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[#1B2430] bg-[#DD7B3A] px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className={`${
            panelPosition === 'up' ? 'fixed' : 'absolute right-0 top-full mt-2'
          } max-h-96 w-80 overflow-y-auto z-50 ${PIXEL_CARD} p-0`}
          style={panelPosition === 'up' ? { left: fixedStyle?.left, bottom: fixedStyle?.bottom, visibility: fixedStyle ? 'visible' : 'hidden' } : undefined}
        >
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
