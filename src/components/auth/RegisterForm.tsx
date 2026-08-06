'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { AuthShell } from '@/components/auth/AuthShell'
import { registerUser } from '@/actions/auth'

type Role = 'student' | 'parent' | 'instructor'

const ROLE_LABELS: Record<Role, string> = {
  parent: 'Veli',
  student: 'Öğrenci',
  instructor: 'Eğitmen',
}

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
      <AuthShell subtitle="Kaydın alındı!">
        <p className="text-center text-[#1B2430]">
          E-postana gönderdiğimiz onay linkine tıklayınca giriş yapabilirsin.
        </p>
        <Link
          href="/login"
          className="mt-6 block w-full py-4 bg-[#DD7B3A] text-[#F4F1E8] font-bold text-lg rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all text-center"
        >
          Giriş Yap
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-[#1B2430] font-bold mb-2">Hesap Türü</label>
          <div className="grid grid-cols-3 gap-2">
            {(['parent', 'student', 'instructor'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-2 rounded-xl border-4 border-[#1B2430] font-bold text-sm transition-all ${
                  role === r
                    ? 'bg-[#DD7B3A] text-[#F4F1E8] shadow-[0_4px_0_#1B2430]'
                    : 'bg-white text-[#1B2430]'
                }`}
              >
                {ROLE_LABELS[r]}
              </button>
            ))}
          </div>
          {role === 'student' && (
            <p className="mt-2 text-xs text-[#1B2430]">
              LGS öğrencisiysen, önce bir veli &quot;Veli&quot; seçeneğiyle kayıt olmalı ve seni eklemeli.
            </p>
          )}
        </div>

        <div>
          <label className="block text-[#1B2430] font-bold mb-2">Ad Soyad</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl border-4 border-[#1B2430] bg-white outline-none focus:ring-4 focus:ring-[#6FA89E]/50 transition-all"
          />
        </div>

        <div>
          <label className="block text-[#1B2430] font-bold mb-2">E-posta</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border-4 border-[#1B2430] bg-white outline-none focus:ring-4 focus:ring-[#6FA89E]/50 transition-all"
            placeholder="ornek@email.com"
          />
        </div>

        <div>
          <label className="block text-[#1B2430] font-bold mb-2">Şifre</label>
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
          {isPending ? 'Kaydediliyor...' : 'Kaydol'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-[#1B2430]">Zaten hesabın var mı? </span>
        <Link href="/login" className="text-[#DD7B3A] font-bold hover:underline">
          Giriş Yap
        </Link>
      </div>
    </AuthShell>
  )
}
