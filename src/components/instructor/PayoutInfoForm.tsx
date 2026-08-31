'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { updateInstructorPayoutInfo } from '@/actions/instructor-profile'
import { useToast } from '@/components/ui/Toast'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY, PIXEL_INPUT } from '@/lib/theme'

interface PayoutInfoFormProps {
  initialPayoutName: string | null
  initialPayoutIban: string | null
  payoutUpdatedAt: string | null
}

export function PayoutInfoForm({ initialPayoutName, initialPayoutIban, payoutUpdatedAt }: PayoutInfoFormProps) {
  const router = useRouter()
  const [payoutName, setPayoutName] = useState(initialPayoutName ?? '')
  const [payoutIban, setPayoutIban] = useState(initialPayoutIban ?? '')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await updateInstructorPayoutInfo(payoutName, payoutIban)
      if (!result.success) { setError(result.error); return }
      showToast('Ödeme bilgilerin kaydedildi.')
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className={`${PIXEL_CARD} p-5 space-y-3`}>
      <div>
        <p className="font-bold text-[#1B2430]">Ödeme Bilgilerim</p>
        <p className="text-sm font-semibold text-[#1B2430]/70">
          Ders ücretlerinin yatırılacağı hesap bilgilerini buradan güncelleyebilirsin.
        </p>
      </div>

      <div>
        <label className="block text-sm font-bold text-[#1B2430] mb-1">Ad Soyad (hesap sahibi)</label>
        <input
          value={payoutName}
          onChange={(e) => setPayoutName(e.target.value)}
          required
          className={PIXEL_INPUT}
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-[#1B2430] mb-1">IBAN</label>
        <input
          value={payoutIban}
          onChange={(e) => setPayoutIban(e.target.value)}
          placeholder="TR00 0000 0000 0000 0000 0000 00"
          required
          className={PIXEL_INPUT}
        />
      </div>

      {error && <p className="text-sm font-semibold text-red-600">{error}</p>}
      {payoutUpdatedAt && (
        <p className="text-xs font-semibold text-[#1B2430]/70">
          Son güncelleme: {new Date(payoutUpdatedAt).toLocaleString('tr-TR', { dateStyle: 'long', timeStyle: 'short' })}
        </p>
      )}

      <button type="submit" disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2`}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kaydet'}
      </button>
    </form>
  )
}
