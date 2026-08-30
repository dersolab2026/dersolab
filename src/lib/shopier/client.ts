import crypto from 'crypto'

const SHOPIER_BASE_URL = 'https://api.shopier.com/v1'

function hasCredentials(): boolean {
  return !!process.env.SHOPIER_API_TOKEN
}

async function shopierRequest<T>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', path: string, body?: Record<string, unknown>): Promise<T> {
  if (!hasCredentials()) {
    throw new Error('SHOPIER_API_TOKEN tanımlı değil')
  }

  const response = await fetch(`${SHOPIER_BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${process.env.SHOPIER_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  // DELETE gibi bazi cagrilar govdesi bos yanit dönüyor.
  const text = await response.text()
  const data = text ? JSON.parse(text) : null
  if (!response.ok) {
    throw new Error(`Shopier API hatası (${response.status}): ${JSON.stringify(data)}`)
  }
  return data as T
}

export interface ShopierProduct {
  id: string
  title: string
  url: string
}

// Alicinin Shopier'de kullandigi e-posta ile DersoLab hesabini otomatik
// eslestiriyoruz (bkz. /api/shopier/webhook); alici farkli bir e-posta
// girerse bu not, admin'in elle eslestirmesi icin bir ipucu olarak kalir.
const CUSTOM_NOTE =
  'Kredilerinin doğru hesaba tanımlanabilmesi için lütfen DersoLab hesabına kayıtlı e-posta adresini yaz.'

// Shopier stok takibini dijital urunlerde de zorunlu tutuyor; stockQuantity
// belirtilmezse 0 (Tukendi) ile basliyor. Kredi paketleri fiziksel stokla
// sinirli olmadigi icin cok yuksek sabit bir deger kullaniyoruz.
const UNLIMITED_STOCK = 999999

// Shopier /v1/products yalnizca digital/physical urun turlerini destekliyor;
// DersoLab kredi paketleri "digital" olarak modelleniyor. media alani zorunlu,
// bu yuzden sabit bir logo gorseli kullaniyoruz.
export async function createShopierProduct(params: { title: string; price: number }): Promise<ShopierProduct> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL!
  return shopierRequest<ShopierProduct>('POST', '/products', {
    title: params.title,
    type: 'digital',
    media: [{ type: 'image', url: `${appUrl}/dersolab-logo.png`, placement: 1 }],
    priceData: { currency: 'TRY', price: params.price.toFixed(2) },
    shippingPayer: 'sellerPays',
    customNote: CUSTOM_NOTE,
    stockQuantity: UNLIMITED_STOCK,
  })
}

// Shopier hesabimizda /v1/products üzerinde GET ve PUT "forbidden" (403)
// dönüyor — yalnizca POST (olustur) ve DELETE calisiyor (canli olarak
// dogrulandi). Bu yuzden "guncelleme" aslinda eskiyi silip yenisini
// olusturmak: bu, urun linkinin (ve id'sinin) her fiyat/baslik
// degisikliginde degismesi anlamina geliyor.
export async function updateShopierProduct(id: string, params: { title: string; price: number }): Promise<ShopierProduct> {
  // Silme basarisiz olsa bile (orn. urun zaten silinmis) yenisini olusturmaktan
  // vazgecmiyoruz; en kotu ihtimalle Shopier panelinde yetim bir urun kalir.
  try {
    await deleteShopierProduct(id)
  } catch (err) {
    console.error('Shopier ürün silme hatası (yok sayılıyor):', err)
  }
  return createShopierProduct(params)
}

export async function deleteShopierProduct(id: string): Promise<void> {
  await shopierRequest<void>('DELETE', `/products/${id}`)
}

export interface ShopierWebhookSubscription {
  id: string
  event: string
  url: string
  token: string
}

export async function createShopierWebhook(event: string, url: string): Promise<ShopierWebhookSubscription> {
  return shopierRequest<ShopierWebhookSubscription>('POST', '/webhooks', { event, url })
}

export async function listShopierWebhooks(): Promise<ShopierWebhookSubscription[]> {
  return shopierRequest<ShopierWebhookSubscription[]>('GET', '/webhooks')
}

export async function deleteShopierWebhook(id: string): Promise<void> {
  await shopierRequest<void>('DELETE', `/webhooks/${id}`)
}

// Shopier'in resmi Node.js tarifi: HMAC-SHA256(webhookToken, rawRequestBody), hex.
// Bkz. developer.shopier.com/v1.0/recipes/webhook-handler-nodejs-1
// Not: JSON.stringify yerine ham istek metni (rawBody) kullanılmalıdır,
// aksi halde alan sıralaması veya boşluk farkları geçerli imzaların reddedilmesine yol açabilir.
export function verifyShopierWebhookSignature(rawBody: string, signatureHeader: string | null): boolean {
  const token = process.env.SHOPIER_WEBHOOK_TOKEN
  if (!token || !signatureHeader) return false

  const expected = crypto.createHmac('sha256', token).update(rawBody).digest('hex')

  const expectedBuf = Buffer.from(expected, 'hex')
  const actualBuf = Buffer.from(signatureHeader, 'hex')
  if (expectedBuf.length !== actualBuf.length) return false
  return crypto.timingSafeEqual(expectedBuf, actualBuf)
}
