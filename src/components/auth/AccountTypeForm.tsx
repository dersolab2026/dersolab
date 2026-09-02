'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { hesapTuruSec, type SecilebilirRol } from '@/actions/account-type'

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

  const getThemeClass = (role: SecilebilirRol) => {
    switch(role) {
      case 'student': return 'bg-orange-500/20 border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)]'
      case 'parent': return 'bg-emerald-600/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
      case 'instructor': return 'bg-blue-600/20 border-blue-500/50 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
    }
  }

  const getTextClass = (role: SecilebilirRol) => {
    switch(role) {
      case 'student': return 'text-orange-400'
      case 'parent': return 'text-emerald-400'
      case 'instructor': return 'text-blue-400'
    }
  }

  return (
    <div className="flex flex-col gap-6 mt-4">
      <p className="text-slate-300 text-center leading-relaxed text-sm">
        Google hesabınla giriş yaptın. DersoLab&apos;ı nasıl kullanacağını seç.
      </p>

      <div className="flex flex-col gap-3">
        {SECENEKLER.map((s) => {
          const isSelected = secili === s.deger
          return (
            <button
              key={s.deger}
              type="button"
              onClick={() => setSecili(s.deger)}
              aria-pressed={isSelected}
              className={`rounded-2xl border p-5 text-left transition-all duration-300 ${
                isSelected
                  ? getThemeClass(s.deger)
                  : 'bg-white/[0.03] border-white/10 text-slate-200 hover:bg-white/[0.06] hover:border-white/20'
              }`}
            >
              <p className={`font-bold text-lg mb-1 ${isSelected ? getTextClass(s.deger) : 'text-white'}`}>{s.baslik}</p>
              <p className={`text-sm ${isSelected ? 'text-slate-200' : 'text-slate-400'}`}>
                {s.aciklama}
              </p>
            </button>
          )
        })}
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl">
        <p className="text-xs font-semibold text-amber-200/80 leading-relaxed text-center">
          Bu seçimi sonradan kendin değiştiremezsin; yanlış seçersen bize yazman gerekir.
        </p>
      </div>

      {error && <p className="text-sm font-bold text-red-500 text-center">{error}</p>}

      <button
        type="button"
        onClick={kaydet}
        disabled={isPending || !secili}
        className="mt-2 w-full py-4 bg-blue-600 text-white font-bold text-lg rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:shadow-[0_0_40px_rgba(37,99,235,0.5)] transition-all disabled:opacity-60 flex justify-center items-center gap-2"
      >
        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Devam Et'}
      </button>
    </div>
  )
}
