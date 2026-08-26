'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

const SLIDE_DURATION_MS = 6000

interface Slide {
  rozet: string
  baslik: string
  metin: string
  cta: { href: string; label: string }
  ikincilCta?: { href: string; label: string }
  arka: string
  yazi: string
  rozetArka: string
}

const SLIDES: Slide[] = [
  {
    rozet: 'DERSOLAB',
    baslik: 'Öğrenciler İçin Online Özel Ders ve Koçluk',
    metin: 'Okul derslerinden LGS, YKS, KPSS, DGS ve ALES hazırlığına kadar, alanında deneyimli ve onaylı eğitmenlerden bire bir online ders alın.',
    cta: { href: '/register', label: 'Ücretsiz Kaydolun' },
    arka: 'bg-[var(--yuzey)]', yazi: 'text-[var(--yazi)]', rozetArka: 'bg-[var(--vurgu)] text-[var(--yazi-ters)]',
  },
  {
    rozet: 'ÖDEME YOK · KART YOK',
    baslik: 'Hoş Geldin Paketiniz Bizden',
    metin: 'Her öğrenciye bir kere ücretsiz tanışma dersi. Beğenmezseniz hiçbir ödeme yapmadan bırakabilirsiniz.',
    cta: { href: '/demo-ders', label: 'Hoş Geldin Paketini Alın' },
    arka: 'bg-[var(--ikincil-zemin)]', yazi: 'text-[var(--yazi-ters)]', rozetArka: 'bg-[var(--yuzey)] text-[var(--yazi)]',
  },
]

export function HeroSlider() {
  const [aktif, setAktif] = useState(0)
  const [duraklat, setDuraklat] = useState(false)

  const ilerle = useCallback((yon: 1 | -1) => {
    setAktif((s) => (s + yon + SLIDES.length) % SLIDES.length)
  }, [])

  useEffect(() => {
    if (duraklat) return
    const t = setInterval(() => setAktif((s) => (s + 1) % SLIDES.length), SLIDE_DURATION_MS)
    return () => clearInterval(t)
  }, [duraklat])

  const slide = SLIDES[aktif]

  return (
    <div
      className="relative"
      onMouseEnter={() => setDuraklat(true)}
      onMouseLeave={() => setDuraklat(false)}
      aria-roledescription="carousel"
      aria-label="Öne çıkan fırsatlar"
    >
      <div className={`rounded-2xl border-4 border-[var(--cizgi)] shadow-[0_8px_0_var(--golge)] overflow-hidden ${slide.arka}`}>
        {/* Yükseklik slaytlar arasında zıplamasın diye sabit minimum. */}
        <div className="relative min-h-[440px] sm:min-h-[420px] p-6 sm:p-12 flex flex-col items-center justify-center text-center">
          {SLIDES.map((s, i) => (
            <div
              key={s.baslik}
              aria-hidden={i !== aktif}
              className={`absolute inset-0 p-6 sm:p-12 flex flex-col items-center justify-center text-center transition-opacity duration-700 ease-in-out ${
                i === aktif ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <span className={`inline-block mb-4 px-3.5 py-1.5 rounded-lg border-2 border-[var(--cizgi)] text-xs sm:text-sm font-black ${s.rozetArka}`}>
                {s.rozet}
              </span>
              <h2 className={`font-sans text-3xl sm:text-5xl font-black mb-4 max-w-3xl mx-auto text-center text-balance ${s.yazi}`}>
                {s.baslik}
              </h2>
              <p className={`font-semibold text-base sm:text-lg mb-7 max-w-2xl mx-auto text-center ${s.yazi} opacity-90`}>
                {s.metin}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={s.cta.href}
                  className="py-3.5 px-9 text-lg bg-[var(--vurgu)] text-[var(--yazi-ters)] font-bold rounded-xl border-4 border-[var(--cizgi)] shadow-[0_4px_0_var(--golge)] active:translate-y-1 active:shadow-none transition-all"
                >
                  {s.cta.label}
                </Link>
                {s.ikincilCta && (
                  <Link
                    href={s.ikincilCta.href}
                    className="py-3 px-8 bg-[var(--yuzey-ic)] text-[var(--yazi)] font-bold rounded-xl border-4 border-[var(--cizgi)] shadow-[0_4px_0_var(--golge)] active:translate-y-1 active:shadow-none transition-all"
                  >
                    {s.ikincilCta.label}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => ilerle(-1)}
          aria-label="Önceki fırsat"
          className="flex h-9 w-9 items-center justify-center rounded-full border-4 border-[var(--cizgi)] bg-[var(--yuzey-ic)] text-[var(--yazi)] font-bold shadow-[0_3px_0_var(--golge)] active:translate-y-0.5 active:shadow-none transition-all"
        >
          ‹
        </button>
        <div className="flex gap-2">
          {SLIDES.map((s, i) => (
            <button
              key={s.baslik}
              type="button"
              onClick={() => setAktif(i)}
              aria-label={`${i + 1}. fırsat: ${s.baslik}`}
              aria-current={i === aktif}
              className={`h-3 rounded-full border-2 border-[var(--cizgi)] transition-all ${
                i === aktif ? 'w-8 bg-[var(--vurgu)]' : 'w-3 bg-[var(--yuzey-ic)]'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => ilerle(1)}
          aria-label="Sonraki fırsat"
          className="flex h-9 w-9 items-center justify-center rounded-full border-4 border-[var(--cizgi)] bg-[var(--yuzey-ic)] text-[var(--yazi)] font-bold shadow-[0_3px_0_var(--golge)] active:translate-y-0.5 active:shadow-none transition-all"
        >
          ›
        </button>
      </div>
    </div>
  )
}
