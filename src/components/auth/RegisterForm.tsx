'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { registerUser } from '@/actions/auth'

type Role = 'student' | 'parent' | 'instructor'

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('parent')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await registerUser({
        name, email, password, role,
        gradeTrack: role === 'student' ? 'yks' : undefined,
      })
      if (!result.success) { setError(result.error); return }
      setSuccess(true)
    })
  }

  if (success) {
    return (
      <Card className="mx-auto mt-16 max-w-sm">
        <CardContent className="py-8 text-center">
          <p className="font-medium">Kaydın alındı</p>
          <p className="mt-1 text-sm text-muted-foreground">E-postana gönderdiğimiz onay linkine tıklayınca giriş yapabilirsin.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto mt-16 max-w-sm">
      <CardHeader><CardTitle>Kayıt Ol</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Hesap Türü</Label>
            <div className="grid grid-cols-3 gap-2">
              {(['parent', 'student', 'instructor'] as const).map((r) => (
                <Button key={r} type="button" variant={role === r ? 'default' : 'outline'} size="sm" onClick={() => setRole(r)}>
                  {r === 'student' ? 'Öğrenci' : r === 'parent' ? 'Veli' : 'Eğitmen'}
                </Button>
              ))}
            </div>
            {role === 'student' && (
              <p className="text-xs text-muted-foreground">
                LGS öğrencisiysen, önce bir veli "Veli" seçeneğiyle kayıt olmalı ve seni eklemeli.
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Ad Soyad</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Şifre</Label>
            <Input id="password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kayıt Ol'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Zaten hesabın var mı? <a href="/login" className="underline">Giriş yap</a>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
