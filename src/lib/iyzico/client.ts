import Iyzipay from 'iyzipay'

// @types/iyzipay bu iki sonuc tipini eksik/yanlis tanimliyor (checkoutFormInitialize
// icin 3DS kart odemesi tipini bekliyor, retrieve sonucunda paymentPageUrl/paymentId yok).
// Gercekte kullandigimiz alanlari burada elle tanimliyoruz.
export interface CheckoutFormInitializeResult {
  status: string
  token?: string
  paymentPageUrl?: string
}

export interface CheckoutFormRetrieveResult {
  status: string
  conversationId?: string
  paymentStatus?: string
  paymentId?: string
}

export function createIyzicoClient() {
  return new Iyzipay({
    apiKey: process.env.IYZICO_API_KEY!,
    secretKey: process.env.IYZICO_SECRET_KEY!,
    uri: process.env.IYZICO_BASE_URL ?? 'https://sandbox-api.iyzipay.com',
  })
}
