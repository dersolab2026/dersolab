import { parseVideoUrl } from '@/lib/video/parse-video-url'

interface IntroVideoPlayerProps {
  videoUrl: string | null
}

export function IntroVideoPlayer({ videoUrl }: IntroVideoPlayerProps) {
  if (!videoUrl) return null

  const parsed = parseVideoUrl(videoUrl)

  return (
    <div className="aspect-video w-full overflow-hidden rounded-xl border-4 border-[#1B2430]">
      {parsed ? (
        <iframe
          src={parsed.embedUrl}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Tanıtım videosu"
        />
      ) : (
        <video src={videoUrl} controls className="h-full w-full" />
      )}
    </div>
  )
}
