'use client'

import { useEffect, useRef, useState } from 'react'
import { FeatureCard, type FeatureIcon } from '@/components/home/FeatureCard'

/**
 * Vitrindeki kart slayti.
 *
 * Kartlar 2x2 izgara yerine tek tek geciyor: her kart tam genislikte
 * duruyor ve tiklandikca ilerliyor.
 *
 * Erisilebilirlik: oklar ve noktalar GERCEK <button>, yani klavyeyle de
 * gezilebiliyor; piste tiklamak yalnizca fare kolayligi, tek erisim yolu
 * degil. Gorunmeyen kartlar aria-hidden ile ekran okuyucudan gizleniyor.
 *
 * Kartlar esit yukseklikte: pist bir flex satiri, en uzun kart digerlerini
 * de kendi boyuna cekiyor. Boylece slayt degisince kutu ziplamiyor.
 */

interface Kart {
  icon: FeatureIcon
  baslik: string
  metin: string
}

export function KartSlayti({ kartlar, etiket }: { kartlar: Kart[]; etiket: string }) {
  const [aktif, setAktif] = useState(0)
  const kutuRef = useRef<HTMLDivElement>(null)

  // Sekme degisince bastan basla; yoksa yeni kitlenin kartlari
  // ortasindan aciliyor.
  useEffect(() => { setAktif(0) }, [kartlar])

  const adet = kartlar.length
  const git = (yon: number) => setAktif((o) => (o + yon + adet) % adet)
  const iki = (n: number) => (n < 10 ? '0' + n : String(n))

  return (
    <div
      ref={kutuRef}
      className="rounded-2xl border-4 border-[var(--cizgi)] bg-[var(--yuzey)] p-5 shadow-[0_8px_0_var(--golge)] sm:p-7"
      aria-roledescription="slayt gösterisi"
      aria-label={etiket}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); git(1) }
        if (e.key === 'ArrowLeft') { e.preventDefault(); git(-1) }
      }}
    >
      <div className="mb-3 flex items-baseline justify-between gap-3 text-xs font-bold tracking-wide text-[var(--yazi)]/70">
        <span>{iki(aktif + 1)} / {iki(adet)}</span>
        <span>Tıkla → İlerle</span>
      </div>

      <div
        className="cursor-pointer overflow-hidden"
        onClick={() => git(1)}
        aria-live="polite"
      >
        <div
          className="flex transition-transform duration-[420ms] ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${aktif * 100}%)` }}
        >
          {kartlar.map((k, i) => (
            <div key={k.baslik} className="w-full shrink-0" aria-hidden={i !== aktif}>
              <FeatureCard icon={k.icon} title={k.baslik} body={k.metin} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => git(-1)}
          aria-label="Önceki kart"
          className="rounded-lg border-2 border-[var(--cizgi)] px-3 py-1.5 text-xs font-bold text-[var(--yazi)] transition-colors hover:bg-[var(--yuzey-ic)]"
        >
          ◀
        </button>
        <div className="flex items-center gap-2">
          {kartlar.map((k, i) => (
            <button
              key={k.baslik}
              type="button"
              onClick={() => setAktif(i)}
              aria-label={`${i + 1}. kart`}
              aria-current={i === aktif ? 'true' : undefined}
              className={`h-2.5 rounded-full transition-all ${
                i === aktif ? 'w-6 bg-[var(--vurgu)]' : 'w-2.5 bg-[var(--yazi)]/25'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => git(1)}
          aria-label="Sonraki kart"
          className="rounded-lg border-2 border-[var(--cizgi)] px-3 py-1.5 text-xs font-bold text-[var(--yazi)] transition-colors hover:bg-[var(--yuzey-ic)]"
        >
          ▶
        </button>
      </div>
    </div>
  )
}
