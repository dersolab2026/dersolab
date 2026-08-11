import { PIXEL_BUTTON_PRIMARY } from '@/lib/theme'

interface PurchasePackageButtonProps {
  shopierProductUrl: string | null
}

export function PurchasePackageButton({ shopierProductUrl }: PurchasePackageButtonProps) {
  if (!shopierProductUrl) {
    return (
      <p className="text-sm font-semibold text-red-600">Bu paket şu anda satın alınamıyor, bizi bilgilendirdik.</p>
    )
  }

  return (
    <div className="space-y-1.5">
      <a href={shopierProductUrl} className={`${PIXEL_BUTTON_PRIMARY} block w-full py-2.5 text-center`}>
        Satın Al
      </a>
      <p className="text-xs font-semibold text-[#1B2430]/60">
        Ödeme Shopier üzerinden alınır. Kredilerin doğru hesaba tanımlanması için Shopier&apos;de bu DersoLab hesabınla aynı e-postayı kullan.
      </p>
    </div>
  )
}
