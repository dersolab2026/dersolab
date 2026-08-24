'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Copy, Loader2 } from 'lucide-react'
import { veliKoduUret, type GuardianLinkRow, type StudentGuardianCode } from '@/actions/guardian'
import { useToast } from '@/components/ui/Toast'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY } from '@/lib/theme'

interface Props {
  mevcutKod: StudentGuardianCode | null
  veliler: GuardianLinkRow[]
}

/**
 * Ogrencinin veli baglantisi karti.
 *
 * Ogrenci kodu uretip velisine veriyor. Bagli velileri GORUYOR ama
 * kaldiramiyor — bagi yalnizca veli koparabiliyor (urun karari: odeyen
 * taraf veli). Seffaflik yine de onemli oldugu icin liste gosteriliyor:
 * ogrenci en azindan kimin goruyor oldugunu bilsin.
 */
export function GuardianLinkCard({ mevcutKod, veliler }: Props) {
  const router = useRouter()
  const { showToast } = useToast()
  const [isPending, startTransition] = useTransition()
  const [kopyalandi, setKopyalandi] = useState(false)

  function uret() {
    startTransition(async () => {
      const sonuc = await veliKoduUret()
      if (!sonuc.success) { showToast(sonuc.error); return }
      showToast('Yeni veli kodu oluşturuldu.')
      router.refresh()
    })
  }

  function kopyala(kod: string) {
    navigator.clipboard.writeText(kod).then(() => {
      setKopyalandi(true)
      setTimeout(() => setKopyalandi(false), 1500)
    })
  }

  return (
    <div className={`${PIXEL_CARD} space-y-4 p-5`}>
      <div>
        <p className="font-bold text-[#1B2430]">Veli Bağlantısı</p>
        <p className="text-sm font-semibold text-[#1B2430]/70">
          Velin gelişimini takip edebilsin istiyorsan bir kod üret ve ona ver. Velin bu kodu
          kendi hesabına girer. Kod <strong>tek kullanımlıktır</strong> ve 7 gün geçerlidir.
        </p>
      </div>

      {mevcutKod ? (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex-1 rounded-xl border-4 border-[#1B2430] bg-white px-4 py-2.5 font-mono text-lg font-bold tracking-widest text-[#1B2430]">
              {mevcutKod.code}
            </span>
            <button
              type="button"
              onClick={() => kopyala(mevcutKod.code)}
              aria-label="Veli kodunu kopyala"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-4 border-[#1B2430] bg-white shadow-[0_3px_0_#1B2430] active:translate-y-0.5 active:shadow-none transition-all"
            >
              {kopyalandi ? <Check className="h-5 w-5 text-[#6FA89E]" /> : <Copy className="h-5 w-5 text-[#1B2430]" />}
            </button>
          </div>
          <p className="text-xs font-semibold text-[#1B2430]/60">
            Son kullanma: {new Date(mevcutKod.expiresAt).toLocaleDateString('tr-TR', { dateStyle: 'medium' })}
          </p>
        </div>
      ) : null}

      <button type="button" onClick={uret} disabled={isPending} className={`${PIXEL_BUTTON_PRIMARY} px-4 py-2 text-sm`}>
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : mevcutKod ? 'Yeni Kod Üret' : 'Veli Kodu Üret'}
      </button>

      {veliler.length > 0 && (
        <div className="space-y-2 border-t-2 border-[#1B2430]/10 pt-3">
          <p className="text-sm font-bold text-[#1B2430]">Hesabına bağlı veliler</p>
          <ul className="space-y-1">
            {veliler.map((v) => (
              <li key={v.id} className="text-sm font-semibold text-[#1B2430]">
                {v.personName} <span className="text-[#1B2430]/60">· {v.personEmail}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs font-semibold text-[#1B2430]/60">
            Bağlantıyı yalnızca velin kaldırabilir. Bir yanlışlık olduğunu düşünüyorsan bize yaz.
          </p>
        </div>
      )}
    </div>
  )
}
