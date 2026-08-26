'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { veliKoduKullan } from '@/actions/guardian'
import { useToast } from '@/components/ui/Toast'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY, PIXEL_INPUT } from '@/lib/theme'

/**
 * Veli, ogrencinin verdigi 8 karakterlik kodu girerek bagi kuruyor.
 *
 * Kodu ogrenci uretiyor ve elden veriyor; yani onay zaten bu akisin
 * icinde. E-posta ile davet yontemi bilincli olarak secilmedi, cunku o
 * yontem "bu e-posta kayitli mi" bilgisini disari sizdirabiliyor.
 */
export function LinkStudentForm() {
  const router = useRouter()
  const { showToast } = useToast()
  const [kod, setKod] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)
    startTransition(async () => {
      const sonuc = await veliKoduKullan(kod)
      if (!sonuc.success) { setError(sonuc.error); return }
      showToast('Öğrenciniz hesabınıza bağlandı.')
      setKod('')
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className={`${PIXEL_CARD} space-y-3 p-5`}>
      <div>
        <p className="font-bold text-[var(--yazi)]">Öğrenci Bağla</p>
        <p className="text-sm font-semibold text-[var(--yazi)]/70">
          Öğrenciniz kendi hesabında <strong>Ayarlar &rsaquo; Veli Bağlantısı</strong> bölümünden
          bir kod üretsin ve size versin. Kod tek kullanımlıktır ve 7 gün geçerlidir.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          value={kod}
          onChange={(e) => setKod(e.target.value.toUpperCase())}
          maxLength={8}
          placeholder="ÖRN: 7K2M9X4A"
          aria-label="Veli bağlantı kodu"
          className={`${PIXEL_INPUT} flex-1 min-w-[180px] font-mono tracking-widest`}
        />
        <button
          type="submit"
          disabled={isPending || kod.trim().length !== 8}
          className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm disabled:opacity-60`}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Bağla'}
        </button>
      </div>
      {error && <p className="text-sm font-bold text-[var(--tehlike)]">{error}</p>}
    </form>
  )
}
