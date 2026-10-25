import { NextResponse } from 'next/server'
import { fetchRealBookCover, CURATED_COVER_MAP } from '@/lib/social/bookCovers'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const title = (searchParams.get('title') || '').trim()
    const author = (searchParams.get('author') || '').trim()

    if (!title) {
      return NextResponse.json({ error: 'Kitap başlığı (title) zorunludur.' }, { status: 400 })
    }

    const imageUrl = await fetchRealBookCover(title, author)

    if (imageUrl) {
      return NextResponse.json({
        found: true,
        imageUrl,
      })
    }

    return NextResponse.json({
      found: false,
      message: 'Gerçek kitap kapağı bulunamadı.',
    })
  } catch (err: any) {
    console.error('Book cover fetch error:', err)
    return NextResponse.json({ found: false, error: err.message }, { status: 500 })
  }
}
