import { ChevronDown } from 'lucide-react'

/**
 * Admin listelerini katlanabilir yapan bolum kabugu.
 *
 * Neden <details>: acilip kapanmasi icin istemci durumu gerekmiyor.
 * Sayfa sunucu bileseni olarak kaliyor, hidrasyondan once de calisiyor,
 * klavye ve ekran okuyucu destegi tarayicidan hazir geliyor. Bir
 * useState + aria-expanded ikilisi ayni seyi daha fazla kodla yapardi.
 *
 * Varsayilan KAPALI: uc liste birden acikken sayfa yuzlerce satir uzunlugunda
 * aciliyor ve aranan bolume ulasmak icin kaydirmak gerekiyordu.
 *
 * Adet basligin yaninda duruyor ki kapaliyken de bilgi versin — "kac
 * ogrenci var" sorusu icin listeyi acmak gerekmiyor.
 */
interface KatlanirBolumProps {
  baslik: string
  adet: number
  /** Basligin sag tarafinda duran kisa ozet (ornegin kac ogrenci ders yapti). */
  ozet?: string
  bosMesaj: string
  children: React.ReactNode
}

export function KatlanirBolum({ baslik, adet, ozet, bosMesaj, children }: KatlanirBolumProps) {
  return (
    <details className="group rounded-md border">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 hover:bg-muted/50 [&::-webkit-details-marker]:hidden">
        <ChevronDown
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180"
          aria-hidden
        />
        <h2 className="text-lg font-semibold">{baslik}</h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {adet}
        </span>
        {ozet && <span className="ml-auto hidden text-sm text-muted-foreground sm:block">{ozet}</span>}
      </summary>

      <div className="border-t">
        {adet === 0 ? <p className="px-4 py-3 text-sm text-muted-foreground">{bosMesaj}</p> : children}
      </div>
    </details>
  )
}
