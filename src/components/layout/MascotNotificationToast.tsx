'use client'

import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { getNotifications, type NotificationItem } from '@/actions/notifications'

const POLL_INTERVAL_MS = 20_000
const TOAST_DURATION_MS = 7_000
const STORAGE_KEY = 'dersolab_last_seen_notification_id'

export function MascotNotificationToast() {
  const [toast, setToast] = useState<NotificationItem | null>(null)
  const lastSeenRef = useRef<string | null>(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    lastSeenRef.current = localStorage.getItem(STORAGE_KEY)

    async function poll() {
      const notifications = await getNotifications()
      if (notifications.length === 0) return
      const newest = notifications[0]

      if (lastSeenRef.current !== newest.id) {
        if (initializedRef.current) {
          setToast(newest)
          setTimeout(() => setToast(null), TOAST_DURATION_MS)
        }
        lastSeenRef.current = newest.id
        localStorage.setItem(STORAGE_KEY, newest.id)
      }
      initializedRef.current = true
    }

    poll()
    const interval = setInterval(poll, POLL_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  if (!toast) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex items-end gap-2">
      <img src="/fox-mascot.png" alt="" className="h-16 w-16 shrink-0" style={{ imageRendering: 'pixelated' }} />
      <div className="relative max-w-64 rounded-2xl border-4 border-[#1B2430] bg-[#F4F1E8] p-3 shadow-[0_4px_0_#1B2430]">
        <button type="button" onClick={() => setToast(null)} className="absolute -top-2 -right-2 rounded-full border-2 border-[#1B2430] bg-white p-0.5">
          <X className="h-3 w-3 text-[#1B2430]" />
        </button>
        <p className="text-sm font-bold text-[#1B2430]">{toast.title}</p>
        {toast.body && <p className="mt-1 text-xs font-semibold text-[#1B2430]/70 line-clamp-2">{toast.body}</p>}
      </div>
    </div>
  )
}
