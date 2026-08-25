'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { hesapTuruSec, type SecilebilirRol } from '@/actions/account-type'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY } from '@/lib/theme'

/**
 * Google ile gelen kullanicinin hesap turunu sectigi ekran.
 *
 * Google bize rolu soylemiyor, biz de tahmin etmiyoruz — soruyoruz.
 * Secim TEK KULLANIMLIK oldugu icin arayuzde de bu acikca yaziyor.
 */

const SECENEKLER: { deger: SecilebilirRol; baslik: string; aciklama: string }[] = [
  {
    deger: 'student',
    baslik: 'Öğrenci',
    aciklama: 'Ders alacağım, denemelerimi takip edeceğim.',
  },
  {
    deger: 'instructor',
    baslik: 'Eğitmen',
    aciklama: 'Ders vereceğim. Profilim incelendikten sonra yayına alınır.',
  },
  {
    deger: 'parent',
    baslik: 'Veli',
    aciklama: 'Öğrencimin gelişimini takip edeceğim, kredi yükleyeceğim.',
  },
]

export function AccountTypeForm() {
  const router = useRouter()
  const [secili, setSecili] = useState<SecilebilirRol | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function kaydet() {
    if (!secili) { setError('Bir hesap türü seç'); return }
    setError(null)
    startTransition(async () => {
      const sonuc = await hesapTuruSec(secili)
      if (!sonuc.success) { setError(sonuc.error); return }
      router.replace('/dashboard')
      router.refresh()
    })
  }

  return (
    <div className={`${PIXEL_CARD} space-y-4 p-6`}>
      <p className="text-[#1B2430] leading-relaxed">
        Google hesabınla giriş yaptın. DersoLab&apos;ı nasıl kullanacağını seç.
      </p>

      <div className="flex flex-col gap-2">
        {SECENEKLER.map((s) => (
          <button
            key={s.deger}
            type="button"
            onClick={() => setSecili(s.deger)}
            aria-pressed={secili === s.deger}
            className={`rounded-xl border-4 border-[#1B2430] p-4 text-left transition-all ${
              secili === s.deger
                ? 'bg-[#DD7B3A] text-[#F4F1E8] shadow-[0_4px_0_#1B2430]'
                : 'bg-white text-[#1B2430]'
            }`}
          >
            <p className="font-bold">{s.baslik}</p>
            <p className={`text-sm font-semibold ${secili === s.deger ? 'text-[#F4F1E8]/85' : 'text-[#1B2430]/70'}`}>
              {s.aciklama}
            </p>
          </button>
        ))}
      </div>

      <p className="text-xs font-semibold text-[#1B2430]/60">
        Bu seçimi sonradan kendin değiştiremezsin; yanlış seçersen bize yazman gerekir.
      </p>

      {error && <p className="text-sm font-bold text-red-600">{error}</p>}

      <button
        type="button"
        onClick={kaydet}
        disabled={isPending || !secili}
        className={`${PIXEL_BUTTON_PRIMARY} w-full px-4 py-3 disabled:opacity-60`}
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Devam Et'}
      </button>
    </div>
  )
}
