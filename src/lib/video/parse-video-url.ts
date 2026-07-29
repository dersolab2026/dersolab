export interface ParsedVideoEmbed {
  platform: 'youtube' | 'vimeo'
  embedUrl: string
  thumbnailUrl: string | null
}

const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{6,15}$/
const VIMEO_ID_PATTERN = /^\d+$/

export function parseVideoUrl(url: string): ParsedVideoEmbed | null {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return null
  }

  if (parsed.hostname.includes('youtube.com') || parsed.hostname === 'youtu.be') {
    let videoId: string | null = null

    if (parsed.hostname === 'youtu.be') {
      videoId = parsed.pathname.slice(1)
    } else if (parsed.pathname.startsWith('/watch')) {
      videoId = parsed.searchParams.get('v')
    } else if (parsed.pathname.startsWith('/embed/')) {
      videoId = parsed.pathname.split('/embed/')[1]
    }

    if (!videoId || !YOUTUBE_ID_PATTERN.test(videoId)) return null

    return {
      platform: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    }
  }

  if (parsed.hostname.includes('vimeo.com')) {
    const segments = parsed.pathname.split('/').filter(Boolean)
    const videoId = segments[segments.length - 1]

    if (!videoId || !VIMEO_ID_PATTERN.test(videoId)) return null

    return {
      platform: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${videoId}`,
      thumbnailUrl: null,
    }
  }

  return null
}
