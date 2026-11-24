import crypto from 'crypto'

function getSigningSecret(): string {
  if (process.env.OAUTH_SIGNING_SECRET) {
    return process.env.OAUTH_SIGNING_SECRET
  }
  const baseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!baseKey) {
    throw new Error('OAuth state imzalama anahtarı (OAUTH_SIGNING_SECRET veya SUPABASE_SECRET_KEY) yapılandırılmamış.')
  }
  // Domain-separated HKDF-benzeri türetilmiş anahtar (ham DB anahtarını doğrudan imzada kullanmaz)
  return crypto.createHmac('sha256', baseKey).update('dersolab:google-oauth-state:v1').digest('hex')
}

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
    if (!userId || !nonce || !/^[0-9a-f]{64}$/i.test(signature)) {
      return { valid: false, userId: null }
    }
    const timestamp = Number(timestampStr)

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
