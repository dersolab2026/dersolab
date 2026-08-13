'use client'

import { useState, useTransition } from 'react'
import { updateMyPassword } from '@/actions/account'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { PIXEL_BUTTON_PRIMARY, PIXEL_CARD } from '@/lib/theme'

export function ChangePasswordForm() {
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (password !== passwordConfirm) { setError('Şifreler eşleşmiyor'); return }

    startTransition(async () => {
      const result = await updateMyPassword(password)
      if (!result.success) { setError(result.error); return }
      setPassword('')
      setPasswordConfirm('')
      setSuccess(true)
    })
  }

  return (
    <form onSubmit={handleSubmit} className={`${PIXEL_CARD} p-5 space-y-4`}>
      <p className="font-bold text-[#1B2430]">Şifremi Değiştir</p>

      <div>
        <label className="block text-[#1B2430] font-bold mb-2">Yeni Şifre</label>
        <PasswordInput required minLength={8} value={password} onChange={setPassword} placeholder="••••••••" />
      </div>

      <div>
        <label className="block text-[#1B2430] font-bold mb-2">Yeni Şifre (Tekrar)</label>
        <PasswordInput required minLength={8} value={passwordConfirm} onChange={setPasswordConfirm} placeholder="••••••••" />
      </div>

      {error && <p className="text-sm font-bold text-red-600">{error}</p>}
      {success && <p className="text-sm font-bold text-[#6FA89E]">Şifren güncellendi.</p>}

      <button type="submit" disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2`}>
        {isPending ? 'Kaydediliyor...' : 'Şifreyi Değiştir'}
      </button>
    </form>
  )
}
