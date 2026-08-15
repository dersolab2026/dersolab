'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { AuthShell } from '@/components/auth/AuthShell'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { registerUser, signInWithGoogle } from '@/actions/auth'

type Role = 'student' | 'instructor'
type Track = 'sayisal' | 'sozel' | 'ea' | 'dil'

const ROLE_LABELS: Record<Role, string> = {
  student: 'Öğrenci',
  instructor: 'Eğitmen',
}

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
  const [referralCode, setReferralCode] = useState('')
  const [isPending, startTransition] = useTransition()
  const [isGooglePending, setIsGooglePending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const gradeNumber = grade ? Number(grade) : undefined
  const isLise = gradeNumber !== undefined && gradeNumber >= 9

  async function handleGoogleRegister() {
    setError(null)
    setIsGooglePending(true)
    const isNative = Capacitor.isNativePlatform()
    const result = await signInWithGoogle(isNative ? 'com.dersolab.app://auth/callback' : undefined)
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
        referralCode: role === 'student' ? referralCode : undefined,
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
          <div className="grid grid-cols-2 gap-2">
            {(['student', 'instructor'] as const).map((r) => (
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
        </div>

        {role === 'student' && (
          <>
            <button
              type="button"
              onClick={handleGoogleRegister}
              disabled={isGooglePending}
              className="w-full py-3 px-4 bg-white text-[#1B2430] font-bold rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-60"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
              </svg>
              {isGooglePending ? 'Yönlendiriliyor...' : 'Google ile Kaydol'}
            </button>

            <div className="flex items-center gap-2">
              <div className="h-1 w-full bg-[#1B2430] rounded-full"></div>
              <span className="text-[#1B2430] font-bold px-2">VEYA</span>
              <div className="h-1 w-full bg-[#1B2430] rounded-full"></div>
            </div>
          </>
        )}

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
          <PasswordInput required minLength={8} value={password} onChange={setPassword} placeholder="••••••••" />
        </div>

        <div>
          <label className="block text-[#1B2430] font-bold mb-2">Şifre (Tekrar)</label>
          <PasswordInput required minLength={8} value={passwordConfirm} onChange={setPasswordConfirm} placeholder="••••••••" />
        </div>

        {role === 'student' && (
          <>
            <div>
              <label className="block text-[#1B2430] font-bold mb-2">Okul Adı</label>
              <input
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full p-3 rounded-xl border-4 border-[#1B2430] bg-white outline-none focus:ring-4 focus:ring-[#6FA89E]/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-[#1B2430] font-bold mb-2">Sınıf</label>
              <select
                required
                value={grade}
                onChange={(e) => { setGrade(e.target.value); setTrack('') }}
                className="w-full p-3 rounded-xl border-4 border-[#1B2430] bg-white outline-none focus:ring-4 focus:ring-[#6FA89E]/50 transition-all"
              >
                <option value="" disabled>Seç</option>
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g}. Sınıf</option>
                ))}
                <option value={MEZUN_GRADE}>Mezun</option>
              </select>
            </div>

            {isLise && (
              <div>
                <label className="block text-[#1B2430] font-bold mb-2">Alan</label>
                <select
                  required
                  value={track}
                  onChange={(e) => setTrack(e.target.value as Track)}
                  className="w-full p-3 rounded-xl border-4 border-[#1B2430] bg-white outline-none focus:ring-4 focus:ring-[#6FA89E]/50 transition-all"
                >
                  <option value="" disabled>Seç</option>
                  {(Object.keys(TRACK_LABELS) as Track[]).map((t) => (
                    <option key={t} value={t}>{TRACK_LABELS[t]}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-[#1B2430] font-bold mb-2">
                Davet Kodu <span className="font-semibold text-[#1B2430]/60">(isteğe bağlı)</span>
              </label>
              <input
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder="Bir arkadaşın davet ettiyse kodunu gir"
                className="w-full p-3 rounded-xl border-4 border-[#1B2430] bg-white outline-none focus:ring-4 focus:ring-[#6FA89E]/50 transition-all"
              />
            </div>
          </>
        )}

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
