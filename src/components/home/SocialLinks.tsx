import { SOCIAL_LINKS, SOCIAL_LABELS, type SocialPlatform } from '@/lib/constants'

/**
 * Ana sayfanin alt kismindaki "Bizi takip edin" seridi.
 *
 * Hesaplar src/lib/constants.ts icindeki SOCIAL_LINKS listesinden geliyor.
 * Liste bos oldugu surece bolum hic basilmiyor — yarim kalmis bir bolum ya da
 * olu link yayina cikmasin diye.
 *
 * lucide-react bu surumde marka ikonlarini artik gondermedigi icin ikonlar
 * satir ici SVG; sitenin kalin cizgili gorunumune uysun diye stroke 2.
 */

const IKONLAR: Record<SocialPlatform, React.ReactNode> = {
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  youtube: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9.5v5l4.5-2.5z" fill="currentColor" stroke="none" />
    </>
  ),
  tiktok: (
    <>
      <path d="M15 3v10.5a4 4 0 1 1-3-3.87" />
      <path d="M15 3a5 5 0 0 0 5 5" />
    </>
  ),
  x: (
    <>
      <path d="M4 4l16 16M20 4L4 20" />
    </>
  ),
  linkedin: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="4" />
      <path d="M7 10v7M7 7v.01M12 17v-4a2 2 0 0 1 4 0v4" />
    </>
  ),
}

export function SocialLinks() {
  if (SOCIAL_LINKS.length === 0) return null

  return (
    <div className="bg-[var(--yuzey)] rounded-2xl p-7 sm:p-8 border-4 border-[var(--cizgi)] shadow-[0_8px_0_var(--golge)] text-center">
      <p className="font-sans text-lg sm:text-xl font-bold text-[var(--yazi)] mb-5">
        Bizi sosyal medya hesaplarımızdan da takip edebilirsiniz.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {SOCIAL_LINKS.map(({ platform, url }) => (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`DersoLab ${SOCIAL_LABELS[platform]} hesabı`}
            title={SOCIAL_LABELS[platform]}
            className="flex h-14 w-14 items-center justify-center rounded-xl border-4 border-[var(--cizgi)] bg-[var(--yuzey-ic)] text-[var(--yazi)] shadow-[0_4px_0_var(--golge)] transition-all hover:bg-[var(--vurgu)] hover:text-[var(--yazi-ters)] active:translate-y-1 active:shadow-none"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {IKONLAR[platform]}
            </svg>
          </a>
        ))}
      </div>
    </div>
  )
}
