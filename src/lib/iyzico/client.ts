import crypto from 'crypto'

const IYZICO_BASE_URL = process.env.IYZICO_BASE_URL ?? 'https://sandbox-api.iyzipay.com'

export interface CheckoutFormInitializeResult {
  status: string
  token?: string
  paymentPageUrl?: string
  errorMessage?: string
}

export interface CheckoutFormRetrieveResult {
  status: string
  conversationId?: string
  paymentStatus?: string
  paymentId?: string
  errorMessage?: string
}

function hasCredentials(): boolean {
  return !!process.env.IYZICO_API_KEY && !!process.env.IYZICO_SECRET_KEY
}

// iyzico REST API'sini iyzipay SDK'sı olmadan doğrudan fetch ile çağırıyoruz —
// SDK'nın Vercel/Turbopack ile uyumsuz eski bağımlılık zinciri (postman-request
// ve 70'ten fazla transitif paket) yüzünden. Kimlik doğrulama şeması (IYZWSv2),
// iyzico'nun kendi node_modules/iyzipay/lib/utils.js dosyasındaki
// generateAuthorizationHeaderV2 / generateHashV2 referans alınarak birebir
// uygulandı.
async function iyzicoRequest<T>(uriPath: string, body: Record<string, unknown>): Promise<T> {
  if (!hasCredentials()) {
    throw new Error('IYZICO_API_KEY veya IYZICO_SECRET_KEY tanımlı değil')
  }

  const apiKey = process.env.IYZICO_API_KEY!
  const secretKey = process.env.IYZICO_SECRET_KEY!
  const randomKey = `${Date.now()}${crypto.randomBytes(8).toString('hex')}`
  const bodyString = JSON.stringify(body)

  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(randomKey + uriPath + bodyString)
    .digest('hex')

  const authParams = [`apiKey:${apiKey}`, `randomKey:${randomKey}`, `signature:${signature}`]
  const authorization = 'IYZWSv2 ' + Buffer.from(authParams.join('&')).toString('base64')

  const response = await fetch(`${IYZICO_BASE_URL}${uriPath}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: authorization,
      'x-iyzi-rnd': randomKey,
    },
    body: bodyString,
  })

  return response.json() as Promise<T>
}

export async function initializeCheckoutForm(body: Record<string, unknown>): Promise<CheckoutFormInitializeResult> {
  return iyzicoRequest<CheckoutFormInitializeResult>('/payment/iyzipos/checkoutform/initialize/auth/ecom', body)
}

export async function retrieveCheckoutForm(params: { locale: string; conversationId?: string; token: string }): Promise<CheckoutFormRetrieveResult> {
  return iyzicoRequest<CheckoutFormRetrieveResult>('/payment/iyzipos/checkoutform/auth/ecom/detail', params)
}
