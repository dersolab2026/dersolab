'use client'

import { useState, useTransition } from 'react'
import { Loader2 } from 'lucide-react'
import { veliPaketAlimiBaslat, type GuardianLinkRow } from '@/actions/guardian'
import { PIXEL_CARD, PIXEL_BUTTON_PRIMARY } from '@/lib/theme'

interface PaketOzet {
  id: string
  title: string
  description: string | null
  creditAmount: number
  price: number
  shopierProductUrl: string | null
}

interface Props {
  ogrenciler: GuardianLinkRow[]
  paketler: PaketOzet[]
}

/**
 * Velinin ogrenci secip onun adina kredi aldigi panel.
 *
 * Ogrenci secimi ODEMEDEN ONCE sunucuya yaziliyor (bekleyen bir satin alma
 * kaydi olarak), cunku Shopier'e "kredi kime yazilacak" bilgisini tasiyacak
 * bir alan gonderemiyoruz. Webhook odeme gelince o kaydi tamamliyor.
 *
 * Tek ogrencisi olan velide secim otomatik; liste yine de gorunuyor ki
 * kimin adina odendigi ekranda acikca yazsin.
 */
export function GuardianPurchasePanel({ ogrenciler, paketler }: Props) {
  const [seciliId, setSeciliId] = useState(ogrenciler[0]?.personId ?? '')
  const [isPending, startTransition] = useTransition()
  const [bekleyenPaket, setBekleyenPaket] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const secili = ogrenciler.find((o) => o.personId === seciliId) ?? null

  function satinAl(packageId: string) {
    setError(null)
    setBekleyenPaket(packageId)
    startTransition(async () => {
      const sonuc = await veliPaketAlimiBaslat(seciliId, packageId)
      setBekleyenPaket(null)
      if (!sonuc.success) { setError(sonuc.error); return }
      window.location.href = sonuc.url
    })
  }

  if (ogrenciler.length === 0) {
    return (
      <div className={`${PIXEL_CARD} p-5`}>
        <p className="font-semibold text-[#1B2430]/70">
          Kredi alabilmek için önce bir öğrenci bağlamalısınız.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className={`${PIXEL_CARD} space-y-3 p-5`}>
        <div>
          <p className="font-bold text-[#1B2430]">Kimin için alıyorsunuz?</p>
          <p className="text-sm font-semibold text-[#1B2430]/70">
            Krediler seçtiğiniz öğrencinin hesabına yüklenir.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ogrenciler.map((o) => (
            <button
              key={o.personId}
              type="button"
              onClick={() => setSeciliId(o.personId)}
              aria-pressed={seciliId === o.personId}
              className={`rounded-lg border-4 border-[#1B2430] px-3 py-1.5 text-sm font-bold transition-all ${
                seciliId === o.personId ? 'bg-[#DD7B3A] text-[#F4F1E8]' : 'bg-white text-[#1B2430]'
              }`}
            >
              {o.personName}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-sm font-bold text-red-600">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        {paketler.map((pkg) => (
          <div key={pkg.id} className={`${PIXEL_CARD} space-y-2 p-5`}>
            <p className="font-bold text-[#1B2430]">{pkg.title}</p>
            <p className="text-2xl font-bold text-[#1B2430]">{pkg.price.toLocaleString('tr-TR')} ₺</p>
            <p className="text-sm font-semibold text-[#3F6E66]">{pkg.creditAmount} ders kredisi</p>
            {pkg.description && (
              <p className="text-sm font-semibold text-[#1B2430]/70">{pkg.description}</p>
            )}

            {pkg.shopierProductUrl ? (
              <div className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => satinAl(pkg.id)}
                  disabled={isPending || !seciliId}
                  className={`${PIXEL_BUTTON_PRIMARY} flex w-full items-center justify-center py-2.5 disabled:opacity-60`}
                >
                  {isPending && bekleyenPaket === pkg.id
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : secili ? `${secili.personName} için Satın Al` : 'Satın Al'}
                </button>
                <p className="text-xs font-semibold text-[#1B2430]/70">
                  Ödeme Shopier üzerinden alınır. Shopier&apos;de <strong>bu DersoLab hesabınızla
                  aynı e-postayı</strong> kullanın; krediler {secili?.personName ?? 'seçtiğiniz öğrenci'} hesabına yüklenir.
                </p>
              </div>
            ) : (
              <p className="text-sm font-semibold text-red-600">
                Bu paket şu anda satın alınamıyor, bizi bilgilendirdik.
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
