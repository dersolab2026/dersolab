'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { sendAdminNotification } from '@/actions/admin'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

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
  specific: 'Belirli Bir Kişi',
}

const ROLE_LABELS: Record<UserOption['role'], string> = {
  student: 'Öğrenciler',
  parent: 'Veliler',
  instructor: 'Eğitmenler',
}

export function AdminNotificationForm({ users }: { users: UserOption[] }) {
  const [audience, setAudience] = useState<Audience>('all')
  const [userId, setUserId] = useState('')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (audience === 'specific' && !userId) {
      setError('Bir kişi seçmelisin')
      return
    }
    setError(null)
    setSuccessMsg(null)
    startTransition(async () => {
      const result = await sendAdminNotification({
        audience,
        userId: audience === 'specific' ? userId : undefined,
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
          <Label htmlFor="notif-user">Kişi</Label>
          <select
            id="notif-user"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            required
          >
            <option value="">Seç...</option>
            {(['student', 'parent', 'instructor'] as const).map((role) => (
              <optgroup key={role} label={ROLE_LABELS[role]}>
                {users.filter((u) => u.role === role).map((u) => (
                  <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      )}

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
