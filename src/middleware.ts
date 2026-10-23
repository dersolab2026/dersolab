import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Bilinen otomatik zaafiyet tarayıcıları ve scanner user-agent imzaları
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

// Botların otomatik taradığı hassas/zararlı yol kalıpları (Hepsini anında 404 ile kes)
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
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 dakika
const MAX_MUTATION_REQUESTS_PER_MINUTE = 60 // IP başına dakikada 60 mutasyon isteği
const MAX_TOTAL_REQUESTS_PER_MINUTE = 240 // IP başına dakikada 240 toplam istek (Agresif bot/scraping kalkanı)

function checkRateLimit(key: string, maxRequests: number): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(key)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }
  
  record.count++
  return record.count > maxRequests
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const userAgent = (request.headers.get('user-agent') || '').toLowerCase()
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  // 1. ZARARLI BOT VE GÜVENLİK TARAYICISI (SCANNER) KALKANI
  const isMaliciousBot = BLOCKED_USER_AGENTS.some((bot) => userAgent.includes(bot))
  if (isMaliciousBot) {
    return new NextResponse('Access Denied', { status: 403 })
  }

  // 2. HASSAS VE SAHTE YOL (PATH PROBING) KALKANI
  const isBlockedPath = BLOCKED_PATH_PATTERNS.some((pattern) => pattern.test(pathname))
  if (isBlockedPath) {
    return new NextResponse('Not Found', { status: 404 })
  }

  // 3. AGRESİF DOŚ / BOT SCRAPING KORUMASI (Genel Rotalar)
  if (ip !== 'unknown' && checkRateLimit(`total:${ip}`, MAX_TOTAL_REQUESTS_PER_MINUTE)) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  // 4. CSRF / CORS KORUMASI: Sadece GET, HEAD, OPTIONS dışındaki mutasyon (veri değiştirici) istekleri kontrol et
  if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') {
    const isWebhook = pathname.startsWith('/api/shopier/webhook')
    const isCron = pathname.startsWith('/api/cron/')

    // Webhook (HMAC imzalı) ve Cron (Bearer token korumalı) uç noktaları harici çağrıldığı için CSRF kontrolünden muaftır
    if (!isWebhook && !isCron) {
      const origin = request.headers.get('origin')
      const host = request.headers.get('host')
      
      // İstek aynı alan adından (host) gelmiyorsa engelle (CSRF önlemi, Capacitor localhost isteklerine de izin ver)
      if (origin && host) {
        try {
          const originHost = new URL(origin).host
          const isCapacitor = originHost === 'localhost' || origin.startsWith('capacitor://')
          if (originHost !== host && !isCapacitor) {
            return new NextResponse('Invalid Origin', { status: 403 })
          }
        } catch {
          return new NextResponse('Invalid Origin', { status: 403 })
        }
      }

      // Mutasyon Rate Limiter (IP başına dakikada 60 mutasyon)
      if (checkRateLimit(`mut:${ip}`, MAX_MUTATION_REQUESTS_PER_MINUTE)) {
        return new NextResponse('Too Many Requests', { status: 429 })
      }
    }
  }

  return updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
