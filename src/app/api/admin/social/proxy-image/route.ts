import dns from 'node:dns/promises'
import net from 'node:net'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ALLOWED_HOST_PATTERNS = [
  /^covers\.openlibrary\.org$/i,
  /^[a-z0-9-]+\.archive\.org$/i,
  /^upload\.wikimedia\.org$/i,
  /^[a-z0-9-]+\.mzstatic\.com$/i,
  /^nkqifjcyudvwfaehgtgp\.supabase\.co$/i,
  /^img\.youtube\.com$/i,
  /^i\.ytimg\.com$/i,
]

const ALLOWED_IMAGE_MIMES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
])

const MAX_IMAGE_BYTES = 8 * 1024 * 1024 // 8 MB

function isPrivateIp(ip: string): boolean {
  const normalized = ip.toLowerCase().replace(/^\[|\]$/g, '')
  if (normalized.startsWith('::ffff:')) {
    return isPrivateIp(normalized.slice(7))
  }
  if (net.isIPv4(normalized)) {
    const parts = normalized.split('.').map(Number)
    const [a, b] = parts
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      a >= 224
    )
  }
  if (net.isIPv6(normalized)) {
    return (
      normalized === '::' ||
      normalized === '::1' ||
      normalized.startsWith('fc') ||
      normalized.startsWith('fd') ||
      normalized.startsWith('fe80:')
    )
  }
  return true
}

function isAllowedHostname(hostname: string): boolean {
  return ALLOWED_HOST_PATTERNS.some((re) => re.test(hostname))
}

export async function GET(req: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Yetkisiz erişim.' }, { status: 401 })
    }

    const { data: userRow } = await supabase.from('users').select('role').eq('id', user.id).single()
    if (userRow?.role !== 'admin') {
      return NextResponse.json({ error: 'Bu işlem yalnızca sistem yöneticilerine açıktır.' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const targetUrl = searchParams.get('url')

    if (!targetUrl || targetUrl.length > 1024) {
      return NextResponse.json({ error: 'Geçersiz görsel URL adresi' }, { status: 400 })
    }

    let parsedUrl: URL
    try {
      parsedUrl = new URL(targetUrl)
    } catch {
      return NextResponse.json({ error: 'Geçersiz URL formatı' }, { status: 400 })
    }

    if (parsedUrl.protocol !== 'https:' || !isAllowedHostname(parsedUrl.hostname)) {
      return NextResponse.json({ error: 'Bu sunucu adresine erişim engellendi.' }, { status: 403 })
    }

    const resolved = await dns.lookup(parsedUrl.hostname, { all: true })
    if (resolved.length === 0 || resolved.some((entry) => isPrivateIp(entry.address))) {
      return NextResponse.json({ error: 'Geçersiz ağ adresi.' }, { status: 403 })
    }

    const res = await fetch(parsedUrl.toString(), {
      redirect: 'manual',
      signal: AbortSignal.timeout(6000),
      headers: {
        'User-Agent': 'DersoLabMediaProxy/1.0',
        Accept: 'image/avif,image/webp,image/png,image/jpeg;q=0.9',
      },
    })

    // OpenLibrary bazen kapak görsellerini *.archive.org adresine 302 ile yönlendirir; tek adımlı güvenli kontrol
    let finalRes = res
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get('location')
      if (!loc) {
        return NextResponse.json({ error: 'Görsel yönlendirmesi geçersiz.' }, { status: 502 })
      }
      const nextUrl = new URL(loc, parsedUrl)
      if (nextUrl.protocol !== 'https:' || !isAllowedHostname(nextUrl.hostname)) {
        return NextResponse.json({ error: 'Yönlendirilen sunucu adresine izin verilmiyor.' }, { status: 403 })
      }
      const nextResolved = await dns.lookup(nextUrl.hostname, { all: true })
      if (nextResolved.length === 0 || nextResolved.some((entry) => isPrivateIp(entry.address))) {
        return NextResponse.json({ error: 'Geçersiz yönlendirme ağ adresi.' }, { status: 403 })
      }
      finalRes = await fetch(nextUrl.toString(), {
        redirect: 'error',
        signal: AbortSignal.timeout(6000),
        headers: {
          'User-Agent': 'DersoLabMediaProxy/1.0',
          Accept: 'image/avif,image/webp,image/png,image/jpeg;q=0.9',
        },
      })
    }

    if (!finalRes.ok) {
      return NextResponse.json({ error: 'Görsel yüklenemedi.' }, { status: 502 })
    }

    const rawMime = (finalRes.headers.get('content-type') || '').split(';')[0].trim().toLowerCase()
    if (!ALLOWED_IMAGE_MIMES.has(rawMime)) {
      return NextResponse.json({ error: 'Desteklenmeyen görsel formatı.' }, { status: 415 })
    }

    const contentLen = Number(finalRes.headers.get('content-length') || '0')
    if (contentLen > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: 'Görsel boyutu sınırı aşıyor.' }, { status: 413 })
    }

    const reader = finalRes.body?.getReader()
    if (!reader) {
      return NextResponse.json({ error: 'Görsel verisi okunamadı.' }, { status: 502 })
    }

    const chunks: Uint8Array[] = []
    let total = 0
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) {
        total += value.byteLength
        if (total > MAX_IMAGE_BYTES) {
          await reader.cancel()
          return NextResponse.json({ error: 'Görsel boyutu sınırı aşıyor.' }, { status: 413 })
        }
        chunks.push(value)
      }
    }

    const bodyBuf = Buffer.concat(chunks, total)
    const safeMime = rawMime === 'image/jpg' ? 'image/jpeg' : rawMime

    return new Response(bodyBuf, {
      headers: {
        'Content-Type': safeMime,
        'Cache-Control': 'private, max-age=3600',
        'X-Content-Type-Options': 'nosniff',
        'Content-Security-Policy': "default-src 'none'; sandbox",
      },
    })
  } catch (err) {
    console.error('proxy-image error:', err)
    return NextResponse.json({ error: 'Görsel vekil sunucu hatası.' }, { status: 500 })
  }
}
