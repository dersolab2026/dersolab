'use client'

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Check, X } from 'lucide-react'

const TOAST_DURATION_MS = 3500

type ToastTone = 'success' | 'error'

interface ToastItem {
  id: number
  message: string
  tone: ToastTone
}

interface ToastContextValue {
  /** Kısa bir onay balonu gösterir. */
  showToast: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast, ToastProvider içinde kullanılmalı')
  return ctx
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => setIsMounted(true), [])

  const showToast = useCallback((message: string, tone: ToastTone = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, tone }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), TOAST_DURATION_MS)
  }, [])

  function dismiss(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const overlay = (
    <div className="fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 pointer-events-none sm:inset-x-auto sm:right-4 sm:items-end">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          aria-live="polite"
          className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border border-white/10 px-4 py-3 shadow-[0_0_15px_rgba(0,0,0,0.3)] ${
            t.tone === 'success' ? 'bg-[#6FA89E] text-[#F4F1E8]' : 'bg-white text-red-600'
          }`}
        >
          {t.tone === 'success' && (
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/5 bg-white/[0.02]">
              <Check className="h-4 w-4 text-slate-200" strokeWidth={3} />
            </span>
          )}
          <p className="flex-1 text-sm font-bold">{t.message}</p>
          <button
            type="button"
            onClick={() => dismiss(t.id)}
            aria-label="Kapat"
            className="shrink-0 opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {isMounted && createPortal(overlay, document.body)}
    </ToastContext.Provider>
  )
}
