import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const BLOCKED_USER_AGENTS = [
  'sqlmap',
  'nikto',
  'acunetix',
  'nuclei',
  'nmap',
  'masscan',
  'zgrab',
  'gobuster',
  'dirbuster',
  'wpscan',
  'nessus',
  'havij',
  'openvas',
]

const BLOCKED_PATH_PATTERNS = [
  /^\/\.env/i,
  /^\/\.git/i,
  /^\/\.aws/i,
  /^\/\.ssh/i,
  /^\/\.ds_store/i,
  /^\/wp-admin/i,
  /^\/wp-login\.php/i,
  /^\/xmlrpc\.php/i,
  /^\/phpmyadmin/i,
  /^\/telescope/i,
  /^\/actuator/i,
  /^\/boaform/i,
  /^\/cgi-bin/i,
  /\.(bak|sql|tar|gz|zip|bz2|7z|rar|ini|log)$/i,
]

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000
const MAX_MUTATION_REQUESTS_PER_MINUTE = 60
const MAX_TOTAL_REQUESTS_PER_MINUTE = 240
let lastCleanup = Date.now()

function checkRateLimit(key: string, maxRequests: number): boolean {
  const now = Date.now()

  if (now - lastCleanup > RATE_LIMIT_WINDOW && rateLimitMap.size > 500) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (now > v.resetTime) rateLimitMap.delete(k)
    }
    lastCleanup = now
  }

  const record = rateLimitMap.get(key)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }

  record.count++
  return record.count > maxRequests
}

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase()
  const ip =
    request.headers.get('x-real-ip')?.trim() ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'

  // 1. Zararlı tarayıcı User-Agent kalkanı
  if (BLOCKED_USER_AGENTS.some((bot) => userAgent.includes(bot))) {
    return new NextResponse('Access Denied', { status: 403 })
  }

  // 2. Hassas yol tarama (path probing) kalkanı
  if (BLOCKED_PATH_PATTERNS.some((pattern) => pattern.test(pathname))) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // 2b. Tasarım prototip rotalarını canlı (production) ortamda ana sayfaya yönlendir
  if (process.env.NODE_ENV === 'production' && /^\/tasarim($|[-2-9])/i.test(pathname)) {
    const homeUrl = request.nextUrl.clone()
    homeUrl.pathname = '/'
    homeUrl.search = ''
    return NextResponse.redirect(homeUrl)
  }

  // 3. Genel DoS / agresif scraping kalkanı
  const totalLimit = ip === 'unknown' ? MAX_TOTAL_REQUESTS_PER_MINUTE * 3 : MAX_TOTAL_REQUESTS_PER_MINUTE
  if (checkRateLimit(`total:${ip}`, totalLimit)) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  // 4. CSRF / Cross-Origin mutasyon koruması
  if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') {
    const isWebhook = pathname.startsWith('/api/shopier/webhook')
    const isCron = pathname.startsWith('/api/cron/')

    if (!isWebhook && !isCron) {
      const origin = request.headers.get('origin')
      const host = request.headers.get('x-forwarded-host') || request.headers.get('host')
      const secFetchSite = request.headers.get('sec-fetch-site')
      const isDev = process.env.NODE_ENV === 'development'

      if (secFetchSite === 'cross-site' && !origin?.startsWith('capacitor://')) {
        return new NextResponse('Invalid Origin', { status: 403 })
      }

      if (origin && host) {
        try {
          const originHost = new URL(origin).host
          const isDevLocalhost = isDev && (originHost === 'localhost' || originHost.startsWith('localhost:'))
          const isCapacitor = origin === 'capacitor://localhost' || origin === 'https://localhost'
          if (originHost !== host && !isDevLocalhost && !isCapacitor) {
            return new NextResponse('Invalid Origin', { status: 403 })
          }
        } catch {
          return new NextResponse('Invalid Origin', { status: 403 })
        }
      } else if (!origin && host) {
        const referer = request.headers.get('referer')
        if (referer) {
          try {
            if (new URL(referer).host !== host) {
              return new NextResponse('Invalid Origin', { status: 403 })
            }
          } catch {
            return new NextResponse('Invalid Origin', { status: 403 })
          }
        }
      }

      const mutLimit = ip === 'unknown' ? MAX_MUTATION_REQUESTS_PER_MINUTE * 2 : MAX_MUTATION_REQUESTS_PER_MINUTE
      if (checkRateLimit(`mut:${ip}`, mutLimit)) {
        return new NextResponse('Too Many Requests', { status: 429 })
      }
    }
  }

  return updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
