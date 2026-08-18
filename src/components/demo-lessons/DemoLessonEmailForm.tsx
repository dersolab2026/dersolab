'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { requestDemoLessonByEmail } from '@/actions/demo-lessons'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY, PIXEL_INPUT } from '@/lib/theme'

export function DemoLessonEmailForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await requestDemoLessonByEmail(name, email)
      if (!result.success) {
        setError(result.error)
        return
      }
      setSent(true)
    })
  }

  if (sent) {
    return (
      <div className={`${PIXEL_CARD} p-5`}>
        <p className="font-bold text-[#1B2430]">Talebin alındı!</p>
        <p className="mt-1 text-sm font-semibold text-[#1B2430]/70">
          Uygun bir eğitmenimiz e-posta adresinden seninle iletişime geçip dersi planlayacak.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={`${PIXEL_CARD} p-5 space-y-3`}>
      <p className="font-bold text-[#1B2430]">Tanışma Dersinle Başla</p>
      <p className="text-sm font-semibold text-[#1B2430]/70">
        Hoş geldin paketinin ilk yarısını hesap açmadan da alabilirsin: 20 dakikalık, kredi
        kullanmayan bir tanışma dersi. Uygun bir eğitmenimiz e-posta adresinden seninle iletişime
        geçip dersi planlar. Hesabını açtığında 1 haftalık koçluk desteğin de açılır.
      </p>
      <div>
        <label className="block text-sm font-bold text-[#1B2430] mb-1">Ad Soyad</label>
        <input required value={name} onChange={(e) => setName(e.target.value)} className={PIXEL_INPUT} />
      </div>
      <div>
        <label className="block text-sm font-bold text-[#1B2430] mb-1">E-posta</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ornek@email.com"
          className={PIXEL_INPUT}
        />
      </div>
      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      <button type="submit" disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm`}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Tanışma Dersi Talep Et'}
      </button>
    </form>
  )
}
