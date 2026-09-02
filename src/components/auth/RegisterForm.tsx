'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { AuthShell } from '@/components/auth/AuthShell'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { registerUser, signInWithGoogle } from '@/actions/auth'
import { TERMS_VERSION } from '@/lib/legal'

type Role = 'student' | 'instructor' | 'parent'
type Track = 'sayisal' | 'sozel' | 'ea' | 'dil'

const GRADES = [5, 6, 7, 8, 9, 10, 11, 12]
const MEZUN_GRADE = 13

const TRACK_LABELS: Record<Track, string> = {
  sayisal: 'Sayısal',
  sozel: 'Sözel',
  ea: 'Eşit Ağırlık',
  dil: 'Dil',
}

export function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [role, setRole] = useState<Role>('student')
  const [schoolName, setSchoolName] = useState('')
  const [grade, setGrade] = useState('')
  const [track, setTrack] = useState<Track | ''>('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isGooglePending, setIsGooglePending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const gradeNumber = grade ? Number(grade) : undefined
  const isLise = gradeNumber !== undefined && gradeNumber >= 9

  async function handleGoogleRegister() {
    setError(null)
    if (!termsAccepted) {
      setError('Devam etmek için Kullanım Şartları’nı kabul etmelisin')
      return
    }
    setIsGooglePending(true)
    const isNative = Capacitor.isNativePlatform()
    const result = await signInWithGoogle(isNative, { rol: role, sartSurumu: TERMS_VERSION })
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!termsAccepted) {
      setError('Devam etmek için Kullanım Şartları’nı kabul etmelisin')
      return
    }

    if (password !== passwordConfirm) {
      setError('Şifreler eşleşmiyor')
      return
    }

    startTransition(async () => {
      const result = await registerUser({
        name,
        email,
        password,
        role,
        schoolName: role === 'student' ? schoolName : undefined,
        grade: role === 'student' ? gradeNumber : undefined,
        track: role === 'student' && isLise && track ? track : undefined,
        termsVersion: TERMS_VERSION,
      })
      if (!result.success) { setError(result.error); return }
      setSuccess(true)
    })
  }

  if (success) {
    return (
      <AuthShell baslik="Kaydın Alındı" role={role}>
        <p className="text-center text-slate-300">
          E-postana gönderdiğimiz onay linkine tıklayınca giriş yapabilirsin.
        </p>
        <Link
          href="/login"
          className="mt-6 block w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all text-center"
        >
          Giriş Yap
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell baslik="Kaydol" role={role}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Rol Secimi Pill UI */}
        <div className="flex bg-white/[0.02] border border-white/5 rounded-2xl p-1 mb-2">
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

        {role === 'parent' && (
          <p className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-sm font-semibold text-slate-300">
            Kaydolduktan sonra öğrencinizin <strong>Ayarlar</strong> sayfasından aldığı
            8 karakterlik veli kodunu girerek hesabınızı öğrencinize bağlarsınız.
          </p>
        )}

        <div className="flex flex-col gap-2 mt-2">
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={isGooglePending}
            className="w-full py-4 px-4 bg-white text-black font-bold rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-60 hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
            </svg>
            {isGooglePending ? 'Yönlendiriliyor...' : 'Google ile Kaydol'}
          </button>
          <p className="text-xs font-semibold text-slate-500 mb-2">
            Google ile devam edersen hesap türünü bir sonraki adımda onaylarsın.
          </p>
        </div>

        <div className="flex items-center gap-4 mb-2">
          <div className="h-[1px] w-full bg-white/10"></div>
          <span className="text-slate-500 font-medium text-sm">VEYA</span>
          <div className="h-[1px] w-full bg-white/10"></div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-2">Ad Soyad</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl border border-white/10 bg-white/[0.03] text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
          />
        </div>

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
          <PasswordInput required minLength={8} value={password} onChange={setPassword} placeholder="••••••••" />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-2">Şifre (Tekrar)</label>
          <PasswordInput required minLength={8} value={passwordConfirm} onChange={setPasswordConfirm} placeholder="••••••••" />
        </div>

        {role === 'student' && (
          <>
            <div>
              <label className="block text-slate-300 font-semibold mb-2">Okul Adı</label>
              <input
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full p-3 rounded-xl border border-white/10 bg-white/[0.03] text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-2">Sınıf</label>
              <select
                required
                value={grade}
                onChange={(e) => { setGrade(e.target.value); setTrack('') }}
                className="w-full p-3 rounded-xl border border-white/10 bg-white/[0.03] text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all appearance-none"
              >
                <option value="" disabled className="text-black">Seç</option>
                {GRADES.map((g) => (
                  <option key={g} value={g} className="text-black">{g}. Sınıf</option>
                ))}
                <option value={MEZUN_GRADE} className="text-black">Mezun</option>
              </select>
            </div>

            {isLise && (
              <div>
                <label className="block text-slate-300 font-semibold mb-2">Alan</label>
                <select
                  required
                  value={track}
                  onChange={(e) => setTrack(e.target.value as Track)}
                  className="w-full p-3 rounded-xl border border-white/10 bg-white/[0.03] text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all appearance-none"
                >
                  <option value="" disabled className="text-black">Seç</option>
                  {(Object.keys(TRACK_LABELS) as Track[]).map((t) => (
                    <option key={t} value={t} className="text-black">{TRACK_LABELS[t]}</option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}

        <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-300 mt-2">
          <input
            type="checkbox"
            required
            checked={termsAccepted}
            onChange={(event) => setTermsAccepted(event.target.checked)}
            className="mt-1 h-4 w-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/50"
          />
          <span>
            <Link href="/terms" target="_blank" className="font-semibold text-blue-400 hover:text-blue-300 underline transition-colors">
              Kullanım Şartları’nı
            </Link>{' '}
            okudum ve kabul ediyorum. Verilerimin nasıl işlendiğini{' '}
            <Link href="/privacy" target="_blank" className="font-semibold text-blue-400 hover:text-blue-300 underline transition-colors">
              Gizlilik Politikası’nda
            </Link>{' '}
            gördüm.
          </span>
        </label>

        {error && <p className="text-sm font-bold text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="mt-4 w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all disabled:opacity-60"
        >
          {isPending ? 'Kaydediliyor...' : 'Kaydol'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-slate-400">Zaten hesabın var mı? </span>
        <Link href="/login" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
          Giriş Yap
        </Link>
      </div>
    </AuthShell>
  )
}
