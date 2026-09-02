import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 dakika
const MAX_REQUESTS_PER_MINUTE = 60 // IP başına dakikada 60 mutasyon isteği

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }
  
  record.count++
  return record.count > MAX_REQUESTS_PER_MINUTE
}

export async function middleware(request: NextRequest) {
  // CSRF / CORS Koruması: Sadece GET, HEAD, OPTIONS dışındaki mutasyon (veri değiştirici) istekleri kontrol et
  if (request.method !== 'GET' && request.method !== 'HEAD' && request.method !== 'OPTIONS') {
    const origin = request.headers.get('origin')
    const host = request.headers.get('host')
    
    // İstek aynı alan adından (host) gelmiyorsa engelle (CSRF önlemi)
    if (origin && host && new URL(origin).host !== host) {
      return new NextResponse('Invalid Origin', { status: 403 })
    }

    // Basit In-Memory Rate Limiter (Edge üzerinde per-instance çalışır)
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    if (checkRateLimit(ip)) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }
  }

  return updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
