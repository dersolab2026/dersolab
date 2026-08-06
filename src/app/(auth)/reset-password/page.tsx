'use client'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { AuthShell } from '@/components/auth/AuthShell'
import { updatePassword } from '@/actions/auth'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await updatePassword(password)
      if (!result.success) { setError(result.error); return }
      router.push('/login')
    })
  }

  return (
    <AuthShell subtitle="Yeni Şifre Belirle">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-[#1B2430] font-bold mb-2">Yeni Şifre</label>
          <input
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl border-4 border-[#1B2430] bg-white outline-none focus:ring-4 focus:ring-[#6FA89E]/50 transition-all"
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-sm font-bold text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 w-full py-4 bg-[#DD7B3A] text-[#F4F1E8] font-bold text-lg rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all disabled:opacity-60"
        >
          {isPending ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
        </button>
      </form>
    </AuthShell>
  )
}
