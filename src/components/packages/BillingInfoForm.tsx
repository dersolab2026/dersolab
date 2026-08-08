'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { saveBillingInfo, type BillingInfo } from '@/actions/billing'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY, PIXEL_INPUT } from '@/lib/theme'

interface BillingInfoFormProps {
  initialInfo: BillingInfo | null
  onSaved: () => void
}

export function BillingInfoForm({ initialInfo, onSaved }: BillingInfoFormProps) {
  const [identityNumber, setIdentityNumber] = useState(initialInfo?.identityNumber ?? '')
  const [phone, setPhone] = useState(initialInfo?.phone ?? '')
  const [address, setAddress] = useState(initialInfo?.address ?? '')
  const [city, setCity] = useState(initialInfo?.city ?? '')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await saveBillingInfo({ identityNumber, phone, address, city })
      if (!result.success) {
        setError(result.error)
        return
      }
      onSaved()
    })
  }

  return (
    <form onSubmit={handleSubmit} className={`${PIXEL_CARD} p-5 space-y-3`}>
      <p className="font-bold text-[#1B2430]">Fatura Bilgileri</p>
      <p className="text-xs font-semibold text-[#1B2430]/70">
        Ödeme sağlayıcımız iyzico, işlemi tamamlayabilmek için bu bilgileri zorunlu tutuyor.
      </p>

      <div>
        <label className="block text-sm font-bold text-[#1B2430] mb-1">TC Kimlik No</label>
        <input
          value={identityNumber}
          onChange={(e) => setIdentityNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
          inputMode="numeric"
          maxLength={11}
          required
          className={PIXEL_INPUT}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-[#1B2430] mb-1">Telefon</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="05XX XXX XX XX"
          required
          className={PIXEL_INPUT}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-[#1B2430] mb-1">Adres</label>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className={PIXEL_INPUT}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-[#1B2430] mb-1">Şehir</label>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
          className={PIXEL_INPUT}
        />
      </div>

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}

      <button type="submit" disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} gap-2 px-4 py-2 text-sm w-full`}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kaydet ve Devam Et'}
      </button>
    </form>
  )
}
