'use client'

import { useState, useTransition, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Capacitor } from '@capacitor/core'
import { Browser } from '@capacitor/browser'
import { AuthShell } from '@/components/auth/AuthShell'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { registerUser, signInWithGoogle } from '@/actions/auth'
import { ROL_TEMASI } from '@/lib/tema'
import { TERMS_VERSION } from '@/lib/legal'

type Role = 'student' | 'instructor' | 'parent'
type Track = 'sayisal' | 'sozel' | 'ea' | 'dil'

const ROLE_LABELS: Record<Role, string> = {
  student: 'Öğrenci',
  instructor: 'Eğitmen',
  parent: 'Veli',
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
  // Ana sayfada kendini secip geldiyse rol onden isaretli gelsin:
  // hem bir tiklama eksiliyor hem palet dogru aciliyor (asagidaki
  // etki temayi bu degerden suruyor).
  const kitleParam = useSearchParams().get('kitle')
  const baslangicRol: Role =
    kitleParam === 'veli' ? 'parent' : kitleParam === 'egitmen' ? 'instructor' : 'student'

  const [role, setRole] = useState<Role>(baslangicRol)

  // Secilen rol butun sayfayi giydiriyor: kisi daha kaydolmadan kendi
  // dilini goruyor. Kok duzen anonim ziyaretcide tema koymadigi icin
  // cakisma yok; ayrilirken onceki deger geri veriliyor.
  useEffect(() => {
    const kok = document.documentElement
    const onceki = kok.dataset.tema
    const yeni = ROL_TEMASI[role]
    if (yeni) kok.dataset.tema = yeni
    else delete kok.dataset.tema
    return () => {
      if (onceki) kok.dataset.tema = onceki
      else delete kok.dataset.tema
    }
  }, [role])
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
    // Formda secilen hesap turu ve kabul edilen sart surumu Google
    // donusune tasiniyor; donuste ayni sorular tekrar sorulmasin.
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
      <AuthShell subtitle="Kaydın alındı!">
        <p className="text-center text-[var(--yazi)]">
          E-postana gönderdiğimiz onay linkine tıklayınca giriş yapabilirsin.
        </p>
        <Link
          href="/login"
          className="mt-6 block w-full py-4 bg-[var(--vurgu)] text-[var(--yazi-ters)] font-bold text-lg rounded-xl border-4 border-[var(--cizgi)] shadow-[0_4px_0_var(--golge)] active:translate-y-1 active:shadow-none transition-all text-center"
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
          <label className="block text-[var(--yazi)] font-bold mb-2">Hesap Türü</label>
          <div className="grid grid-cols-3 gap-2">
            {(['student', 'instructor', 'parent'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-2 rounded-xl border-4 border-[var(--cizgi)] font-bold text-sm transition-all ${
                  role === r
                    ? 'bg-[var(--vurgu)] text-[var(--yazi-ters)] shadow-[0_4px_0_var(--golge)]'
                    : 'bg-[var(--yuzey-ic)] text-[var(--yazi)]'
                }`}
              >
                {ROLE_LABELS[r]}
              </button>
            ))}
          </div>
        </div>

        {role === 'parent' && (
          <p className="rounded-xl border-2 border-[var(--cizgi)] bg-[var(--yuzey-ic)] p-3 text-sm font-semibold text-[var(--yazi)]/80">
            Kaydolduktan sonra öğrencinizin <strong>Ayarlar</strong> sayfasından aldığı
            8 karakterlik veli kodunu girerek hesabınızı öğrencinize bağlarsınız.
          </p>
        )}

        {/* Google her rol icin acik. Google bize rolu soylemedigi icin
            secim girisin ardindan /hesap-turu sayfasinda onaylaniyor. */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={isGooglePending}
            className="w-full py-3 px-4 bg-[var(--yuzey-ic)] text-[var(--yazi)] font-bold rounded-xl border-4 border-[var(--cizgi)] shadow-[0_4px_0_var(--golge)] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3 disabled:opacity-60"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"/>
            </svg>
            {isGooglePending ? 'Yönlendiriliyor...' : 'Google ile Kaydol'}
          </button>
          <p className="text-xs font-semibold text-[var(--yazi)]/60">
            Google ile devam edersen hesap türünü bir sonraki adımda onaylarsın.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-1 w-full bg-[var(--koyu)] rounded-full"></div>
          <span className="text-[var(--yazi)] font-bold px-2">VEYA</span>
          <div className="h-1 w-full bg-[var(--koyu)] rounded-full"></div>
        </div>

        <div>
          <label className="block text-[var(--yazi)] font-bold mb-2">Ad Soyad</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-xl border-4 border-[var(--cizgi)] bg-[var(--yuzey-ic)] text-[var(--yazi)] outline-none focus:ring-4 focus:ring-[var(--ikincil-yazi)]/50 transition-all"
          />
        </div>

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

        <div>
          <label className="block text-[var(--yazi)] font-bold mb-2">Şifre</label>
          <PasswordInput required minLength={8} value={password} onChange={setPassword} placeholder="••••••••" />
        </div>

        <div>
          <label className="block text-[var(--yazi)] font-bold mb-2">Şifre (Tekrar)</label>
          <PasswordInput required minLength={8} value={passwordConfirm} onChange={setPasswordConfirm} placeholder="••••••••" />
        </div>

        {role === 'student' && (
          <>
            <div>
              <label className="block text-[var(--yazi)] font-bold mb-2">Okul Adı</label>
              <input
                required
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full p-3 rounded-xl border-4 border-[var(--cizgi)] bg-[var(--yuzey-ic)] text-[var(--yazi)] outline-none focus:ring-4 focus:ring-[var(--ikincil-yazi)]/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-[var(--yazi)] font-bold mb-2">Sınıf</label>
              <select
                required
                value={grade}
                onChange={(e) => { setGrade(e.target.value); setTrack('') }}
                className="w-full p-3 rounded-xl border-4 border-[var(--cizgi)] bg-[var(--yuzey-ic)] text-[var(--yazi)] outline-none focus:ring-4 focus:ring-[var(--ikincil-yazi)]/50 transition-all"
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
                <label className="block text-[var(--yazi)] font-bold mb-2">Alan</label>
                <select
                  required
                  value={track}
                  onChange={(e) => setTrack(e.target.value as Track)}
                  className="w-full p-3 rounded-xl border-4 border-[var(--cizgi)] bg-[var(--yuzey-ic)] text-[var(--yazi)] outline-none focus:ring-4 focus:ring-[var(--ikincil-yazi)]/50 transition-all"
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

        <label className="flex items-start gap-3 rounded-xl border-2 border-[var(--cizgi)] bg-[var(--yuzey-ic)] p-3 text-sm text-[var(--yazi)]">
          <input
            type="checkbox"
            required
            checked={termsAccepted}
            onChange={(event) => setTermsAccepted(event.target.checked)}
            className="mt-1 h-4 w-4 accent-[var(--vurgu-yazi)]"
          />
          <span>
            <Link href="/terms" target="_blank" className="font-bold text-[var(--vurgu-yazi)] underline">
              Kullanım Şartları’nı
            </Link>{' '}
            okudum ve kabul ediyorum. Kayıt bilgilerimin işlenmesiyle ilgili açıklamayı da{' '}
            <Link href="/privacy" target="_blank" className="font-bold text-[var(--vurgu-yazi)] underline">
              KVKK Aydınlatma Metni’nde
            </Link>{' '}
            gördüm.
          </span>
        </label>

        {error && <p className="text-sm font-bold text-[var(--tehlike)]">{error}</p>}

        <button
          type="submit"
          disabled={isPending}
          className="mt-2 w-full py-4 bg-[var(--vurgu)] text-[var(--yazi-ters)] font-bold text-lg rounded-xl border-4 border-[var(--cizgi)] shadow-[0_4px_0_var(--golge)] active:translate-y-1 active:shadow-none transition-all disabled:opacity-60"
        >
          {isPending ? 'Kaydediliyor...' : 'Kaydol'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <span className="text-[var(--yazi)]">Zaten hesabın var mı? </span>
        <Link href="/login" className="text-[var(--vurgu-yazi)] font-bold hover:underline">
          Giriş Yap
        </Link>
      </div>
    </AuthShell>
  )
}
