import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function isPrivateOrForbiddenHost(hostname: string): boolean {
  const lower = hostname.toLowerCase().trim()
  if (
    lower === 'localhost' ||
    lower === '0.0.0.0' ||
    lower === '[::1]' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal') ||
    lower.startsWith('127.') ||
    lower.startsWith('10.') ||
    lower.startsWith('192.168.') ||
    lower.startsWith('169.254.') ||
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(lower)
  ) {
    return true
  }
  return false
}

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
    const targetUrl = searchParams.get('url')

    if (!targetUrl || (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://'))) {
      return NextResponse.json({ error: 'Geçersiz görsel URL adresi' }, { status: 400 })
    }

    let parsedUrl: URL
    try {
      parsedUrl = new URL(targetUrl)
    } catch {
      return NextResponse.json({ error: 'Geçersiz URL formatı' }, { status: 400 })
    }

    if (isPrivateOrForbiddenHost(parsedUrl.hostname)) {
      return NextResponse.json({ error: 'Bu sunucu adresine erişim engellendi.' }, { status: 403 })
    }

    const res = await fetch(parsedUrl.toString(), {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        Referer: parsedUrl.origin,
      },
      next: { revalidate: 86400 },
    })

    if (!res.ok) {
      return NextResponse.json({ error: `Görsel yüklenemedi: HTTP ${res.status}` }, { status: res.status })
    }

    const contentType = res.headers.get('content-type') || 'image/jpeg'
    if (!contentType.toLowerCase().startsWith('image/')) {
      return NextResponse.json({ error: 'Hedef adres geçerli bir görsel döndürmedi.' }, { status: 415 })
    }

    const buffer = await res.arrayBuffer()

    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Görsel vekil sunucu hatası'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
