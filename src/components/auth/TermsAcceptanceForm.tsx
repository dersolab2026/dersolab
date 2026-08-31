'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { acceptCurrentTerms } from '@/actions/terms'
import { PIXEL_BUTTON_PRIMARY, PIXEL_CARD } from '@/lib/theme'

export function TermsAcceptanceForm() {
  const router = useRouter()
  const [accepted, setAccepted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!accepted) {
      setError('Devam etmek için Kullanım Şartları’nı kabul etmelisin')
      return
    }

    startTransition(async () => {
      const result = await acceptCurrentTerms()
      if (!result.success) {
        setError(result.error)
        return
      }
      router.replace('/dashboard')
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className={`${PIXEL_CARD} space-y-5 p-6`}>
      <p className="leading-relaxed text-[#1B2430]">
        DersoLab&apos;ı kullanmaya devam etmek için güncel Kullanım Şartları&apos;nı kabul etmelisin.
      </p>
      <label className="flex items-start gap-3 text-sm leading-relaxed text-[#1B2430]">
        <input
          type="checkbox"
          required
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
          className="mt-1 h-4 w-4 accent-[#DD7B3A]"
        />
        <span>
          <Link href="/terms" target="_blank" className="font-bold text-[#9C4A0C] underline">
            Kullanım Şartları’nı
          </Link>{' '}
          okudum ve kabul ediyorum.{' '}
          <Link href="/privacy" target="_blank" className="font-bold text-[#9C4A0C] underline">
            KVKK Aydınlatma Metni
          </Link>{' '}
          hakkında da bilgilendirildim.
        </span>
      </label>
      {error && <p className="text-sm font-bold text-red-600">{error}</p>}
      <button type="submit" disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} w-full px-4 py-3`}>
        {isPending ? 'Kaydediliyor...' : 'Kabul Et ve Devam Et'}
      </button>
    </form>
  )
}
