import { SOCIAL_LINKS, SOCIAL_LABELS, type SocialPlatform } from '@/lib/constants'

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
    <div className="rounded-2xl bg-white/70 backdrop-blur-md border border-slate-200/80 p-6 sm:p-8 text-center shadow-[0_4px_20px_-4px_rgba(15,23,42,0.03)]">
      <p className="text-sm sm:text-base font-semibold text-slate-800 mb-4">
        DersoLab topluluğuna katılın, eğitim ve sınav ipuçlarını kaçırmayın.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {SOCIAL_LINKS.map(({ platform, url }) => (
          <a
            key={platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`DersoLab ${SOCIAL_LABELS[platform]} hesabı`}
            title={SOCIAL_LABELS[platform]}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:text-slate-950 hover:scale-105 active:scale-95"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
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
