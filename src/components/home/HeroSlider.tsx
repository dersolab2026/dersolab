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
    baslik: 'Öğrenciler için online özel ders ve koçluk',
    metin: 'Okul derslerinden LGS, YKS, KPSS, DGS ve ALES hazırlığına kadar — alanında deneyimli, onaylı eğitmenlerle birebir online ders al.',
    cta: { href: '/register', label: 'Ücretsiz Kaydol' },
    ikincilCta: { href: '/instructors', label: 'Eğitmenleri İncele' },
    arka: 'bg-[#F4F1E8]', yazi: 'text-[#1B2430]', rozetArka: 'bg-[#DD7B3A] text-[#F4F1E8]',
  },
  {
    rozet: 'ÖDEME YOK · KART YOK',
    baslik: 'Önce ücretsiz tanış, sonra karar ver',
    metin: 'Her öğrencinin 20 dakikalık bir tanışma dersi hakkı var. Eğitmenle tanış, nasıl çalıştığını gör, beğenmezsen hiçbir şey ödemeden bırak.',
    cta: { href: '/demo-ders', label: 'Ücretsiz Tanışma Dersi Al' },
    arka: 'bg-[#6FA89E]', yazi: 'text-[#F4F1E8]', rozetArka: 'bg-[#F4F1E8] text-[#1B2430]',
  },
  {
    rozet: 'YENİ',
    baslik: '1 hafta ücretsiz koçluk',
    metin: 'Bir hafta boyunca bir koçun seninle ilgilensin: hedeflerini konuşun, çalışma programını birlikte kurun, nerede takıldığını takip etsin.',
    cta: { href: '/ucretsiz-kocluk', label: 'Ücretsiz Koçluk Al' },
    arka: 'bg-[#1B2430]', yazi: 'text-[#F4F1E8]', rozetArka: 'bg-[#DD7B3A] text-[#F4F1E8]',
  },
  {
    rozet: 'DAVET ET & KAZAN',
    baslik: 'Arkadaşını getirene 1 ders bizden',
    metin: 'Ayarlar sayfandaki davet kodunu arkadaşınla paylaş. O kayıt olurken kodu girsin, hesabını onayladığı anda ikinize de birer ders kredisi hediye edelim.',
    cta: { href: '/register', label: 'Hemen Kaydol' },
    arka: 'bg-[#DD7B3A]', yazi: 'text-[#F4F1E8]', rozetArka: 'bg-[#F4F1E8] text-[#1B2430]',
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
      <div className={`rounded-2xl border-4 border-[#1B2430] shadow-[0_8px_0_#1B2430] overflow-hidden ${slide.arka}`}>
        {/* Yükseklik slaytlar arasında zıplamasın diye sabit minimum. */}
        <div className="relative min-h-[380px] sm:min-h-[340px] p-6 sm:p-10 flex flex-col items-center justify-center text-center">
          {SLIDES.map((s, i) => (
            <div
              key={s.baslik}
              aria-hidden={i !== aktif}
              className={`absolute inset-0 p-6 sm:p-10 flex flex-col items-center justify-center text-center transition-opacity duration-700 ease-in-out ${
                i === aktif ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <span className={`inline-block mb-3 px-3 py-1 rounded-lg border-2 border-[#1B2430] text-xs font-black ${s.rozetArka}`}>
                {s.rozet}
              </span>
              <h2 className={`font-sans text-2xl sm:text-4xl font-black mb-3 max-w-2xl ${s.yazi}`}>
                {s.baslik}
              </h2>
              <p className={`font-semibold mb-6 max-w-xl ${s.yazi} opacity-90`}>
                {s.metin}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href={s.cta.href}
                  className="py-3 px-8 bg-[#DD7B3A] text-[#F4F1E8] font-bold rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all"
                >
                  {s.cta.label}
                </Link>
                {s.ikincilCta && (
                  <Link
                    href={s.ikincilCta.href}
                    className="py-3 px-8 bg-white text-[#1B2430] font-bold rounded-xl border-4 border-[#1B2430] shadow-[0_4px_0_#1B2430] active:translate-y-1 active:shadow-none transition-all"
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
          className="flex h-9 w-9 items-center justify-center rounded-full border-4 border-[#1B2430] bg-white text-[#1B2430] font-bold shadow-[0_3px_0_#1B2430] active:translate-y-0.5 active:shadow-none transition-all"
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
              className={`h-3 rounded-full border-2 border-[#1B2430] transition-all ${
                i === aktif ? 'w-8 bg-[#DD7B3A]' : 'w-3 bg-white'
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => ilerle(1)}
          aria-label="Sonraki fırsat"
          className="flex h-9 w-9 items-center justify-center rounded-full border-4 border-[#1B2430] bg-white text-[#1B2430] font-bold shadow-[0_3px_0_#1B2430] active:translate-y-0.5 active:shadow-none transition-all"
        >
          ›
        </button>
      </div>
    </div>
  )
}
