'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { loginUser, signInWithGoogle } from '@/actions/auth'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await loginUser(email, password)
      if (!result.success) { setError(result.error); return }
      router.push('/dashboard')
      router.refresh()
    })
  }

  async function handleGoogleLogin() {
    const result = await signInWithGoogle()
    if ('url' in result) {
      window.location.href = result.url
    } else {
      setError(result.error)
    }
  }

  return (
    <Card className="mx-auto mt-16 max-w-sm">
      <CardHeader><CardTitle>Giriş Yap</CardTitle></CardHeader>
      <CardContent>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full border rounded-md py-2 text-sm font-medium mb-4"
        >
          Google ile Giriş Yap
        </button>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Şifre</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <a href="/forgot-password" className="block text-sm text-muted-foreground underline">Şifremi unuttum</a>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Giriş Yap'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Hesabın yok mu? <a href="/register" className="underline">Kayıt ol</a>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}