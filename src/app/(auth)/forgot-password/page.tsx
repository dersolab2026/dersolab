'use client'
import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { requestPasswordReset } from '@/actions/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const result = await requestPasswordReset(email)
      setMessage(result.success
        ? { ok: true, text: 'E-postana bir sıfırlama linki gönderdik.' }
        : { ok: false, text: result.error })
    })
  }

  return (
    <Card className="mx-auto mt-16 max-w-sm">
      <CardHeader><CardTitle>Şifremi Unuttum</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">E-posta</Label>
            <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          {message && <p className={message.ok ? 'text-sm text-green-600' : 'text-sm text-destructive'}>{message.text}</p>}
          <Button type="submit" className="w-full" disabled={isPending}>Sıfırlama Linki Gönder</Button>
        </form>
      </CardContent>
    </Card>
  )
}

