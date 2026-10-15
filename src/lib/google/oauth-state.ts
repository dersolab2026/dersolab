import crypto from 'crypto'

function getSigningSecret(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.CRON_SECRET || 'dersolab-calendar-oauth-secret'
}

/**
 * Google Calendar OAuth state parametresini kullanıcı kimliği ve zaman damgasıyla
 * HMAC-SHA256 kullanarak güvenli şekilde imzalar.
 * 
 * Bu sayede Android Capacitor uygulamasında harici sistem tarayıcısı (Chrome) açıldığında
 * oturum çerezleri taşınmasa bile geri dönüşte kullanıcının kimliği kriptografik olarak doğrulanır.
 */
export function createSignedOAuthState(userId: string): string {
  const nonce = crypto.randomBytes(16).toString('hex')
  const timestamp = Date.now()
  const payload = `${userId}:${timestamp}:${nonce}`
  const signature = crypto
    .createHmac('sha256', getSigningSecret())
    .update(payload)
    .digest('hex')
  return Buffer.from(`${payload}:${signature}`).toString('base64url')
}

export function verifySignedOAuthState(stateStr: string): { valid: boolean; userId: string | null } {
  try {
    const raw = Buffer.from(stateStr, 'base64url').toString('utf-8')
    const parts = raw.split(':')
    if (parts.length !== 4) return { valid: false, userId: null }
    const [userId, timestampStr, nonce, signature] = parts
    const timestamp = Number(timestampStr)

    // 15 dakika geçerlilik süresi kontrolü
    if (isNaN(timestamp) || Date.now() - timestamp > 15 * 60 * 1000 || Date.now() < timestamp - 60 * 1000) {
      return { valid: false, userId: null }
    }

    const payload = `${userId}:${timestampStr}:${nonce}`
    const expected = crypto
      .createHmac('sha256', getSigningSecret())
      .update(payload)
      .digest('hex')

    const expectedBuf = Buffer.from(expected, 'hex')
    const actualBuf = Buffer.from(signature, 'hex')
    if (expectedBuf.length !== actualBuf.length || !crypto.timingSafeEqual(expectedBuf, actualBuf)) {
      return { valid: false, userId: null }
    }

    return { valid: true, userId }
  } catch {
    return { valid: false, userId: null }
  }
}
