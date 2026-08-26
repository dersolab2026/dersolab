'use client'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { AuthShell } from '@/components/auth/AuthShell'
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
    <AuthShell subtitle="Şifreni mi unuttun?">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-[var(--yazi)] font-bold mb-2">E-posta</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border-4 border-[var(--cizgi)] bg-[var(--yuzey-ic)] text-[var(--yazi)] outline-none focus:ring-4 focus:ring-[var(--ikincil-yazi)]/50 transition-all"
            placeholder="ornek@email.com"
          />
        </div>

        {message && (
          <p className={`text-sm font-bold ${message.ok ? 'text-[var(--ikincil-yazi)]' : 'text-[var(--tehlike)]'}`}>{message.text}</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 w-full py-4 bg-[var(--vurgu)] text-[var(--yazi-ters)] font-bold text-lg rounded-xl border-4 border-[var(--cizgi)] shadow-[0_4px_0_var(--golge)] active:translate-y-1 active:shadow-none transition-all disabled:opacity-60"
        >
          {isPending ? 'Gönderiliyor...' : 'Sıfırlama Linki Gönder'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link href="/login" className="text-[var(--vurgu-yazi)] font-bold hover:underline">
          Giriş sayfasına dön
        </Link>
      </div>
    </AuthShell>
  )
}
