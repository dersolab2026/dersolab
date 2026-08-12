'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { AuthShell } from '@/components/auth/AuthShell'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { registerUser } from '@/actions/auth'

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
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const gradeNumber = grade ? Number(grade) : undefined
  const isLise = gradeNumber !== undefined && gradeNumber >= 9

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
