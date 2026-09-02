'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
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
  const [role, setRole] = useState<'student' | 'instructor' | 'parent'>('student')

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
    const isNative = Capacitor.isNativePlatform()
    const result = await signInWithGoogle(isNative)
    if ('url' in result) {
      if (isNative) {
        await Browser.open({ url: result.url })
        setIsGooglePending(false)
      } else {
        window.location.href = result.url
      }
    } else {
      setError(result.error)
      setIsGooglePending(false)
    }
  }

  return (
    <AuthShell baslik="Giriş Yap" role={role}>
      
      {/* Rol Secimi Pill UI */}
      <div className="flex bg-white/[0.02] border border-white/5 rounded-2xl p-1 mb-6 mt-2">
        <button
          type="button"
          onClick={() => setRole('student')}
          className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
            role === 'student' 
              ? 'bg-orange-500/20 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]' 
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Öğrenci
        </button>
        <button
          type="button"
          onClick={() => setRole('parent')}
          className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
            role === 'parent'
              ? 'bg-emerald-600/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Veli
        </button>
        <button
          type="button"
          onClick={() => setRole('instructor')}
          className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
            role === 'instructor'
              ? 'bg-blue-600/20 text-blue-400 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
              : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Eğitmen
        </button>
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={isGooglePending}
        className="w-full mb-6 py-4 px-4 bg-white text-black font-bold rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-60 hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
      >
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
        </svg>
        {isGooglePending ? 'Yönlendiriliyor...' : 'Google ile Giriş'}
      </button>

      <div className="flex items-center gap-4 mb-6">
        <div className="h-[1px] w-full bg-white/10"></div>
        <span className="text-slate-500 font-medium text-sm">VEYA</span>
        <div className="h-[1px] w-full bg-white/10"></div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-slate-300 font-semibold mb-2">E-posta</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl border border-white/10 bg-white/[0.03] text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
            placeholder="ornek@email.com"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-2">Şifre</label>
          <PasswordInput required value={password} onChange={setPassword} placeholder="••••••••" />
          <div className="text-right mt-2">
            <Link href="/forgot-password" className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors">
              Şifremi Unuttum
            </Link>
          </div>
        </div>

        {error && <p className="text-sm font-bold text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="mt-4 w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all disabled:opacity-60"
        >
          {isPending ? 'Giriş yapılıyor...' : 'Giriş Yap'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-slate-400">Hesabın yok mu? </span>
        <Link href="/register" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
          Kaydol
        </Link>
      </div>
    </AuthShell>
  )
}
