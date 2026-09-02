'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { acceptCurrentTerms } from '@/actions/terms'

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
      <p className="text-slate-300 text-center leading-relaxed text-sm">
        DersoLab&apos;ı kullanmaya devam etmek için güncel Kullanım Şartları&apos;nı kabul etmelisin.
      </p>

      <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-sm text-slate-300 hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer">
        <input
          type="checkbox"
          required
          checked={accepted}
          onChange={(event) => setAccepted(event.target.checked)}
          className="mt-1 h-5 w-5 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/50 flex-shrink-0 cursor-pointer"
        />
        <span className="leading-relaxed">
          <Link href="/terms" target="_blank" className="font-semibold text-blue-400 hover:text-blue-300 underline transition-colors">
            Kullanım Şartları’nı
          </Link>{' '}
          okudum ve kabul ediyorum.{' '}
          <Link href="/privacy" target="_blank" className="font-semibold text-blue-400 hover:text-blue-300 underline transition-colors">
            KVKK Aydınlatma Metni
          </Link>{' '}
          hakkında da bilgilendirildim.
        </span>
      </label>

      {error && <p className="text-sm font-bold text-red-500 text-center">{error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all disabled:opacity-60 flex justify-center items-center"
      >
        {isPending ? 'Kaydediliyor...' : 'Kabul Et ve Devam Et'}
      </button>
    </form>
  )
}
