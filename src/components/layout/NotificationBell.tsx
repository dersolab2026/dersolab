'use client'

import type { UserRole } from '@/types'
import { useEffect, useRef, useState, useTransition } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { Lightbulb, X } from 'lucide-react'
import {
  getNotifications, markNotificationRead, markAllNotificationsRead,
  deleteNotification, clearReadNotifications, type NotificationItem,
} from '@/actions/notifications'
import { getNotificationLink } from '@/lib/notifications/get-notification-link'
import { PIXEL_CARD } from '@/lib/theme'

const POLL_INTERVAL_MS = 30_000
const PANEL_WIDTH = 320
const PANEL_GAP = 8

interface NotificationBellProps {
  initialNotifications: NotificationItem[]
  role: UserRole
  panelPosition?: 'up' | 'down'
}

export function NotificationBell({ initialNotifications, role, panelPosition = 'down' }: NotificationBellProps) {
  const router = useRouter()
  const [notifications, setNotifications] = useState(initialNotifications)
  const [isOpen, setIsOpen] = useState(false)
  const [, startTransition] = useTransition()
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [coords, setCoords] = useState<{ left: number; top?: number; bottom?: number } | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const readCount = notifications.filter((n) => n.isRead).length

  useEffect(() => setIsMounted(true), [])

  useEffect(() => {
    const interval = setInterval(async () => {
      const fresh = await getNotifications()
      setNotifications(fresh)
    }, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (containerRef.current?.contains(target)) return
      if (panelRef.current?.contains(target)) return
      setIsOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Panel body'ye taşındığı için konumunu butona göre kendimiz hesaplıyoruz.
  useEffect(() => {
    if (!isOpen) { setCoords(null); return }

    function reposition() {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return
      const preferredLeft = panelPosition === 'up' ? rect.left : rect.right - PANEL_WIDTH
      const left = Math.max(PANEL_GAP, Math.min(preferredLeft, window.innerWidth - PANEL_WIDTH - PANEL_GAP))
      setCoords(
        panelPosition === 'up'
          ? { left, bottom: window.innerHeight - rect.top + PANEL_GAP }
          : { left, top: rect.bottom + PANEL_GAP },
      )
    }

    reposition()
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
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

  const panel = (
    <div
      ref={panelRef}
      className={`fixed max-h-96 w-80 overflow-y-auto z-50 ${PIXEL_CARD} p-0`}
      style={{ left: coords?.left, top: coords?.top, bottom: coords?.bottom }}
    >
      <div className="flex items-center justify-between border-b-2 border-[var(--cizgi)] p-3">
        <p className="font-bold text-[var(--yazi)]">Bildirimler</p>
        <div className="flex items-center gap-3">
          {readCount > 0 && (
            <button type="button" onClick={handleClearRead} className="text-xs font-bold text-[var(--yazi)]/60 underline">
              Okunanları temizle
            </button>
          )}
          {unreadCount > 0 && (
            <button type="button" onClick={handleMarkAllRead} className="text-xs font-bold text-[var(--vurgu-yazi)] underline">
              Tümünü okundu işaretle
            </button>
          )}
        </div>
      </div>
      {notifications.length === 0 ? (
        <p className="p-4 text-sm font-semibold text-[var(--yazi)]/60">Henüz bildirimin yok.</p>
      ) : (
        <ul>
          {notifications.map((n) => (
            <li key={n.id} className="relative border-b border-[var(--cizgi)]/10">
              <button
                type="button"
                onClick={() => handleItemClick(n)}
                className={`block w-full p-3 pr-8 text-left hover:bg-[var(--koyu)]/5 ${n.isRead ? '' : 'bg-[var(--vurgu)]/10'}`}
              >
                <p className="text-sm font-bold text-[var(--yazi)]">{n.title}</p>
                {n.body && <p className="mt-0.5 text-xs font-semibold text-[var(--yazi)]/70">{n.body}</p>}
                <p className="mt-1 text-[10px] font-semibold text-[var(--yazi)]/50">
                  {new Date(n.createdAt).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleDelete(n.id) }}
                className="absolute top-3 right-2 text-[var(--yazi)]/40 hover:text-[var(--yazi)]"
                aria-label="Bildirimi sil"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )

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
              : 'text-[var(--yazi)]/25'
          }`}
        />
        {/* 600px'lik kaynak 48px'e `imageRendering:pixelated` ile
            kuculuyordu: en yakin komsu ornekleme piksellerin %98'ini
            atiyor, tilkinin ince cizgileri tamamen kayboluyor ve kenarlar
            tirtikli kaliyordu. Artik gosterim boyutuna (2x ekran icin
            96px) lanczos ile bir kez kucultulmus surum servis ediliyor —
            hem temiz hem 340 KB yerine 14 KB. */}
        <img
          src="/fox-mascot-icon-96.png"
          alt="Bildirimler"
          className="h-12 w-12"
        />
        {unreadCount > 0 && (
          <span className="absolute bottom-0 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-[var(--cizgi)] bg-[var(--vurgu)] px-1 text-[10px] font-bold text-[var(--yazi-ters)]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && isMounted && coords && createPortal(panel, document.body)}
    </div>
  )
}
