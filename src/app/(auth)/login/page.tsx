'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AuthShell } from '@/components/auth/AuthShell'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { loginUser, signInWithGoogle } from '@/actions/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, startTransition] = useTransition()
  const [isGooglePending, setIsGooglePending] = useState(false)
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
    setError(null)
    setIsGooglePending(true)
    const result = await signInWithGoogle()
    if ('url' in result) {
      window.location.href = result.url
    } else {
      setError(result.error)
      setIsGooglePending(false)
    }
  }

  return (
    <AuthShell>
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isGooglePending}
        className="w-full mb-6 py-3 px-4 bg-white text-[#1B2430] font-bold rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-60"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
        </svg>
        {isGooglePending ? 'Yönlendiriliyor...' : 'Google ile Giriş'}
      </button>

      <div className="flex items-center gap-2 mb-6">
        <div className="h-1 w-full bg-[#1B2430] rounded-full"></div>
        <span className="text-[#1B2430] font-bold px-2">VEYA</span>
        <div className="h-1 w-full bg-[#1B2430] rounded-full"></div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <PasswordInput required value={password} onChange={setPassword} placeholder="••••••••" />
          <div className="text-right mt-2">
            <Link href="/forgot-password" className="text-sm font-bold text-[#6FA89E] hover:underline">
              Şifremi Unuttum
            </Link>
          </div>
        </div>

        {error && <p className="text-sm font-bold text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 w-full py-4 bg-[#DD7B3A] text-[#F4F1E8] font-bold text-lg rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all disabled:opacity-60"
        >
          {isPending ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-[#1B2430]">Hesabın yok mu? </span>
        <Link href="/register" className="text-[#DD7B3A] font-bold hover:underline">
          Kaydol
        </Link>
      </div>
    </AuthShell>
  )
}
