import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import {
  fetchRealBookCover,
  fetchRealMoviePoster,
  findMatchingCuratedMovie,
  buildMoviePosterSvgDataUrl,
} from '@/lib/social/bookCovers'

export async function GET(req: Request) {
  try {
    const isDev = process.env.NODE_ENV === 'development'
    if (!isDev) {
      const supabase = await createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
      }
    }

    const { searchParams } = new URL(req.url)
    const title = (searchParams.get('title') || '').trim()
    const author = (searchParams.get('author') || '').trim()
    const type = (searchParams.get('type') || 'auto').trim()

    if (!title) {
      return NextResponse.json({ error: 'Eser veya film başlığı (title) zorunludur.' }, { status: 400 })
    }

    const isMovieQuery =
      type === 'movie' ||
      /\b(film|sinema|belgesel|dizi|afiş|movie)\b/i.test(`${title} ${author}`) ||
      Boolean(findMatchingCuratedMovie(title))

    let imageUrl: string | null = null

    if (isMovieQuery) {
      imageUrl = await fetchRealMoviePoster(title, author)
      if (!imageUrl) {
        const matched = findMatchingCuratedMovie(title)
        imageUrl = buildMoviePosterSvgDataUrl(
          matched?.title || title,
          matched?.director || author || 'Sinema Seçkisi',
          matched?.genre || 'Bilim & Motivasyon',
          matched?.imdb || '8.4',
          matched?.level || 'lise'
        )
      }
    } else {
      imageUrl = await fetchRealBookCover(title, author)
    }

    if (imageUrl) {
      return NextResponse.json({
        found: true,
        imageUrl,
        coverUrl: imageUrl,
      })
    }

    return NextResponse.json({
      found: false,
      message: 'Gerçek kapak veya afiş görseli bulunamadı.',
    })
  } catch (err: unknown) {
    console.error('Cover/Poster fetch error:', err)
    const message = err instanceof Error ? err.message : 'Kapak/afiş sorgulama hatası'
    return NextResponse.json({ found: false, error: message }, { status: 500 })
  }
}
