import crypto from 'crypto'
import type { NextRequest } from 'next/server'

/**
 * Cron uç noktalarında CRON_SECRET değerini zamanlama saldırılarına (timing attack)
 * karşı sabit sürede (constant-time) doğrular. CRON_SECRET tanımsızsa fail-closed döner.
 */
export function verifyCronRequest(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET?.trim()
  const authHeader = request.headers.get('authorization')?.trim()
  if (!secret || !authHeader) return false

  const expected = `Bearer ${secret}`
  const expectedDigest = crypto.createHash('sha256').update(expected, 'utf8').digest()
  const actualDigest = crypto.createHash('sha256').update(authHeader, 'utf8').digest()
  return crypto.timingSafeEqual(expectedDigest, actualDigest)
}
