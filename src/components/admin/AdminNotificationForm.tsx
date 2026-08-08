'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { sendAdminNotification } from '@/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ADMIN_NOTIFICATION_CATEGORY_LABELS, type AdminNotificationCategory } from '@/lib/notifications/get-notification-link'

type Audience = 'all' | 'student' | 'parent' | 'instructor' | 'specific'

interface UserOption {
  id: string
  name: string
  email: string
  role: 'student' | 'parent' | 'instructor'
}

const AUDIENCE_LABELS: Record<Audience, string> = {
  all: 'Tüm Kullanıcılar',
  student: 'Tüm Öğrenciler',
  parent: 'Tüm Veliler',
  instructor: 'Tüm Eğitmenler',
  specific: 'Belirli Kişiler',
}

const ROLE_LABELS: Record<UserOption['role'], string> = {
  student: 'Öğrenciler',
  parent: 'Veliler',
  instructor: 'Eğitmenler',
}

export function AdminNotificationForm({ users }: { users: UserOption[] }) {
  const [audience, setAudience] = useState<Audience>('all')
  const [userIds, setUserIds] = useState<string[]>([])
  const [category, setCategory] = useState<AdminNotificationCategory>('general')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  function toggleUser(id: string) {
    setUserIds((prev) => (prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (audience === 'specific' && userIds.length === 0) {
      setError('En az bir kişi seçmelisin')
      return
    }
    setError(null)
    setSuccessMsg(null)
    startTransition(async () => {
      const result = await sendAdminNotification({
        audience,
        userIds: audience === 'specific' ? userIds : undefined,
        category,
        title,
        body,
      })
      if (!result.success) {
        setError(result.error)
        return
      }
      setSuccessMsg(`${result.count} kişiye gönderildi.`)
      setTitle('')
      setBody('')
      setUserIds([])
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-md border p-4">
      <div className="space-y-1.5">
        <Label htmlFor="notif-audience">Kime</Label>
        <select
          id="notif-audience"
          value={audience}
          onChange={(e) => setAudience(e.target.value as Audience)}
          className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {(Object.entries(AUDIENCE_LABELS) as [Audience, string][]).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {audience === 'specific' && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label>Kişiler ({userIds.length} seçili)</Label>
            {userIds.length > 0 && (
              <button type="button" onClick={() => setUserIds([])} className="text-xs font-bold text-muted-foreground underline">
                Seçimi temizle
              </button>
            )}
          </div>
          <div className="max-h-56 space-y-3 overflow-y-auto rounded-md border p-3">
            {(['student', 'parent', 'instructor'] as const).map((role) => {
              const roleUsers = users.filter((u) => u.role === role)
              if (roleUsers.length === 0) return null
              return (
                <div key={role} className="space-y-1">
                  <p className="text-xs font-bold text-muted-foreground">{ROLE_LABELS[role]}</p>
                  {roleUsers.map((u) => (
                    <label key={u.id} className="flex items-center gap-2 py-0.5 text-sm">
                      <input
                        type="checkbox"
                        checked={userIds.includes(u.id)}
                        onChange={() => toggleUser(u.id)}
                      />
                      {u.name} ({u.email})
                    </label>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="notif-category">Kategori</Label>
        <select
          id="notif-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as AdminNotificationCategory)}
          className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {(Object.entries(ADMIN_NOTIFICATION_CATEGORY_LABELS) as [AdminNotificationCategory, string][]).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <p className="text-xs text-muted-foreground">Bildirime tıklayınca kullanıcı ilgili sayfaya yönlendirilir.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notif-title">Başlık</Label>
        <Input id="notif-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notif-body">Mesaj</Label>
        <Textarea id="notif-body" value={body} onChange={(e) => setBody(e.target.value)} rows={4} required />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}

      <Button type="submit" disabled={isPending} className="gap-2">
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Gönder'}
      </Button>
    </form>
  )
}
