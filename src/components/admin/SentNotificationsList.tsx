'use client'

import { useState, useTransition } from 'react'
import { RefreshCw, ChevronDown, ChevronUp, Check, X } from 'lucide-react'
import { getSentAdminNotifications, type SentNotificationBatch } from '@/actions/admin'

export function SentNotificationsList({ initialBatches }: { initialBatches: SentNotificationBatch[] }) {
  const [batches, setBatches] = useState(initialBatches)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleRefresh() {
    startTransition(async () => {
      const fresh = await getSentAdminNotifications()
      setBatches(fresh)
    })
  }

  return (
    <div className="space-y-3 rounded-md border p-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">Gönderilen Bildirimler</h2>
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isPending}
          className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground underline disabled:opacity-50"
        >
          <RefreshCw className={`h-3 w-3 ${isPending ? 'animate-spin' : ''}`} />
          Yenile
        </button>
      </div>

      {batches.length === 0 ? (
        <p className="text-sm text-muted-foreground">Henüz bildirim gönderilmedi.</p>
      ) : (
        <ul className="space-y-2">
          {batches.map((batch) => {
            const isOpen = expanded === batch.batchId
            return (
              <li key={batch.batchId} className="rounded-md border">
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : batch.batchId)}
                  className="flex w-full items-center justify-between gap-3 p-3 text-left"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{batch.title}</p>
                    {batch.body && <p className="truncate text-xs text-muted-foreground">{batch.body}</p>}
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {new Date(batch.createdAt).toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        batch.readCount === batch.totalCount ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {batch.readCount}/{batch.totalCount} okundu
                    </span>
                    {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </div>
                </button>

                {isOpen && (
                  <ul className="space-y-1 border-t p-3">
                    {batch.recipients.map((r, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        {r.isRead ? (
                          <Check className="h-3.5 w-3.5 shrink-0 text-green-600" />
                        ) : (
                          <X className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                        )}
                        <span>{r.name} ({r.email})</span>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
