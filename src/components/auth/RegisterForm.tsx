'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { AuthShell } from '@/components/auth/AuthShell'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { registerUser, signInWithGoogle } from '@/actions/auth'
import { TERMS_VERSION } from '@/lib/legal'
import { formatTurkishTitleCase } from '@/lib/format/name'

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
  const searchParams = useSearchParams()
  const initialEmail = searchParams.get('email') ?? ''
  const roleParam = searchParams.get('role')
  const redirectParam = searchParams.get('redirect')
  const initialRole: Role = roleParam === 'instructor' || roleParam === 'parent' ? roleParam : 'student'

  const [name, setName] = useState('')
  const [email, setEmail] = useState(initialEmail)
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>(initialRole)
  const [schoolName, setSchoolName] = useState('')
  const [grade, setGrade] = useState('')
  const [track, setTrack] = useState<Track | ''>('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isInAppBrowser, setIsInAppBrowser] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isGooglePending, setIsGooglePending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent || ''
    if (/Instagram|FBAN|FBAV|musical_ly|BytedanceWebview|TikTok/i.test(ua)) {
      setIsInAppBrowser(true)
    }
  }, [])

  const gradeNumber = grade ? Number(grade) : undefined
  const isLise = gradeNumber !== undefined && gradeNumber >= 9

  async function handleGoogleRegister() {
    setError(null)
    if (!termsAccepted) {
      setError('Devam etmek için yukarıdaki Kullanım Şartları kutusunu işaretlemelisin')
      return
    }
    setIsGooglePending(true)
    const isNative = Capacitor.isNativePlatform()
    const result = await signInWithGoogle(
      isNative,
      { rol: role, sartSurumu: TERMS_VERSION },
      redirectParam || undefined
    )
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

    startTransition(async () => {
      const cleanName = formatTurkishTitleCase(name)
      const result = await registerUser({
        name: cleanName,
        email,
        password,
        role,
        schoolName: role === 'student' && schoolName.trim() ? schoolName.trim() : undefined,
        grade: role === 'student' ? gradeNumber : undefined,
        track: role === 'student' && isLise && track ? track : undefined,
        termsVersion: TERMS_VERSION,
        redirectTo: redirectParam || undefined,
      })
      if (!result.success) { setError(result.error); return }
      setSuccess(true)
    })
  }

  if (success) {
    return (
      <AuthShell baslik="Kaydın Alındı" role={role}>
        <p className="text-center text-slate-300">
          E-postana gönderdiğimiz onay linkine tıklayınca giriş yapabilirsin. (Gelen kutunda yoksa spam/gereksiz klasörünü kontrol et.)
        </p>
        <Link
          href={redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : '/login'}
          className="mt-6 block w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all text-center"
        >
          Giriş Yap
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell baslik="Kaydol" role={role}>
      {redirectParam && (
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-sm mb-4">
          <svg className="w-5 h-5 shrink-0 text-blue-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <span>DersoLab simülasyonları ve platform içeriklerini kullanabilmek için lütfen ücretsiz kayıt olun veya giriş yapın.</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Rol Secimi Pill UI */}
        <div className="flex bg-white/[0.02] border border-white/5 rounded-2xl p-1 mb-1">
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

        {/* KVKK / Kullanım Şartları — Google ile Kaydol'un hemen üstünde ki tek tıkta görünsün */}
        <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3.5 text-xs sm:text-sm text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            required
            checked={termsAccepted}
            onChange={(event) => {
              setTermsAccepted(event.target.checked)
              if (event.target.checked) setError(null)
            }}
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/50"
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

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={isGooglePending}
            className="w-full py-3.5 px-4 bg-white text-black font-bold rounded-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-60 hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
            </svg>
            {isGooglePending ? 'Yönlendiriliyor...' : 'Google ile Kaydol'}
          </button>

          {isInAppBrowser && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200 leading-relaxed">
              <strong>Instagram / TikTok içinden açtın:</strong> Uygulama içi tarayıcı Google ile girişi engelleyebilir.
              Hemen aşağıdan <strong>15 saniyede e-posta ile kaydolabilir</strong> ya da sağ üstteki <strong>⋯</strong> menüsünden
              Chrome/Safari’de açabilirsin.
            </div>
          )}

          {error && <p className="text-sm font-bold text-red-400">{error}</p>}
        </div>

        <div className="flex items-center gap-4 my-1">
          <div className="h-[1px] w-full bg-white/10"></div>
          <span className="text-slate-500 font-medium text-xs tracking-wider">VEYA E-POSTA İLE</span>
          <div className="h-[1px] w-full bg-white/10"></div>
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1.5 text-sm">Ad Soyad</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setName(formatTurkishTitleCase(name))}
            className="w-full p-3 rounded-xl border border-white/10 bg-white/[0.03] text-white outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
            placeholder="Adınız ve Soyadınız"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-semibold mb-1.5 text-sm">E-posta</label>
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
          <label className="block text-slate-300 font-semibold mb-1.5 text-sm">Şifre <span className="text-xs font-normal text-slate-500">(en az 8 karakter)</span></label>
          <PasswordInput required minLength={8} value={password} onChange={setPassword} placeholder="••••••••" />
        </div>

        {role === 'student' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-slate-400 font-semibold mb-1.5 text-xs">Sınıf <span className="text-slate-500 font-normal">(isteğe bağlı)</span></label>
              <select
                value={grade}
                onChange={(e) => { setGrade(e.target.value); setTrack('') }}
                className="w-full p-3 rounded-xl border border-white/10 bg-white/[0.03] text-white text-sm outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all appearance-none"
              >
                <option value="" className="text-black">Sonra seç</option>
                {GRADES.map((g) => (
                  <option key={g} value={g} className="text-black">{g}. Sınıf</option>
                ))}
                <option value={MEZUN_GRADE} className="text-black">Mezun</option>
              </select>
            </div>

            {isLise ? (
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5 text-xs">Alan <span className="text-slate-500 font-normal">(isteğe bağlı)</span></label>
                <select
                  value={track}
                  onChange={(e) => setTrack(e.target.value as Track | '')}
                  className="w-full p-3 rounded-xl border border-white/10 bg-white/[0.03] text-white text-sm outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all appearance-none"
                >
                  <option value="" className="text-black">Sonra seç</option>
                  {(Object.keys(TRACK_LABELS) as Track[]).map((t) => (
                    <option key={t} value={t} className="text-black">{TRACK_LABELS[t]}</option>
                  ))}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5 text-xs">Okul <span className="text-slate-500 font-normal">(isteğe bağlı)</span></label>
                <input
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Sonra da ekleyebilirsin"
                  className="w-full p-3 rounded-xl border border-white/10 bg-white/[0.03] text-white text-sm outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                />
              </div>
            )}
          </div>
        )}

        {error && <p className="text-sm font-bold text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all disabled:opacity-60"
        >
          {isPending ? 'Kaydediliyor...' : 'Ücretsiz Kaydol'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-slate-400">Zaten hesabın var mı? </span>
        <Link
          href={redirectParam ? `/login?redirect=${encodeURIComponent(redirectParam)}` : '/login'}
          className="text-blue-400 font-bold hover:text-blue-300 transition-colors"
        >
          Giriş Yap
        </Link>
      </div>
    </AuthShell>
  )
}
