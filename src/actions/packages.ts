'use server'

import Iyzipay from 'iyzipay'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createIyzicoClient, type CheckoutFormInitializeResult } from '@/lib/iyzico/client'

interface CreateCheckoutSessionParams {
  packageId: string
  studentId: string
}

type ActionResult =
  | { success: true; checkoutUrl: string }
  | { success: false; error: string; missingBillingInfo?: boolean }

function splitName(fullName: string): { name: string; surname: string } {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return { name: parts[0], surname: parts[0] }
  return { name: parts.slice(0, -1).join(' '), surname: parts[parts.length - 1] }
}

export async function createCheckoutSession({
  packageId,
  studentId,
}: CreateCheckoutSessionParams): Promise<ActionResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Bu işlem için giriş yapmalısın' }
  }

  const { data: buyer } = await supabase
    .from('users')
    .select('name, email, phone, identity_number, address, city, created_at')
    .eq('id', user.id)
    .single()

  if (!buyer?.identity_number || !buyer.phone || !buyer.address || !buyer.city) {
    return { success: false, error: 'Ödeme için önce fatura bilgilerini tamamlamalısın', missingBillingInfo: true }
  }

  const { data: pkg, error: pkgError } = await supabase
    .from('packages')
    .select('id, title, credit_amount, price, is_active')
    .eq('id', packageId)
    .single()

  if (pkgError || !pkg || !pkg.is_active) {
    return { success: false, error: 'Paket bulunamadı veya artık satışta değil' }
  }

  const { data: purchase, error: purchaseError } = await supabase
    .from('package_purchases')
    .insert({
      package_id: pkg.id,
      student_id: studentId,
      purchased_by: user.id,
      credits_granted: pkg.credit_amount,
      amount_paid: pkg.price,
      payment_provider: 'iyzico',
      status: 'pending',
    })
    .select('id')
    .single()

  if (purchaseError || !purchase) {
    return { success: false, error: purchaseError?.message ?? 'Satın alma kaydı oluşturulamadı' }
  }
  const purchaseId = purchase.id

  if (!process.env.IYZICO_API_KEY || !process.env.IYZICO_SECRET_KEY) {
    console.error('iyzico API key/secret key tanımlı değil')
    await supabase.from('package_purchases').update({ status: 'failed' }).eq('id', purchaseId)
    return { success: false, error: 'Ödeme sistemi şu anda kullanılamıyor, daha sonra tekrar dener misin?' }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL!
  const iyzipay = createIyzicoClient()
  const { name, surname } = splitName(buyer.name)
  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '85.34.78.112'
  const price = pkg.price.toFixed(2)
  const now = new Date().toISOString().slice(0, 19).replace('T', ' ')
  const registrationDate = buyer.created_at
    ? new Date(buyer.created_at).toISOString().slice(0, 19).replace('T', ' ')
    : now

  const request = {
    locale: Iyzipay.LOCALE.TR,
    conversationId: purchaseId,
    price,
    paidPrice: price,
    currency: Iyzipay.CURRENCY.TRY,
    basketId: purchaseId,
    paymentGroup: Iyzipay.PAYMENT_GROUP.PRODUCT,
    callbackUrl: `${appUrl}/api/iyzico/callback`,
    enabledInstallments: [1],
    buyer: {
      id: user.id,
      name,
      surname,
      gsmNumber: buyer.phone,
      email: buyer.email,
      identityNumber: buyer.identity_number,
      lastLoginDate: now,
      registrationDate,
      registrationAddress: buyer.address,
      ip,
      city: buyer.city,
      country: 'Turkey',
    },
    shippingAddress: {
      contactName: buyer.name,
      city: buyer.city,
      country: 'Turkey',
      address: buyer.address,
    },
    billingAddress: {
      contactName: buyer.name,
      city: buyer.city,
      country: 'Turkey',
      address: buyer.address,
    },
    basketItems: [
      {
        id: pkg.id,
        name: pkg.title,
        category1: 'Eğitim',
        itemType: Iyzipay.BASKET_ITEM_TYPE.VIRTUAL,
        price,
      },
    ],
  }

  type CreateArgs = Parameters<typeof iyzipay.checkoutFormInitialize.create>
  const createCheckoutForm = iyzipay.checkoutFormInitialize.create.bind(iyzipay.checkoutFormInitialize)

  return new Promise((resolve) => {
    async function fail(reason: unknown) {
      console.error('iyzico checkout form hatası:', reason)
      await supabase.from('package_purchases').update({ status: 'failed' }).eq('id', purchaseId)
      resolve({ success: false, error: 'Ödeme sayfası oluşturulamadı, tekrar dener misin?' })
    }

    try {
      // @types/iyzipay tiplemesi checkoutFormInitialize.create icin yanlislikla
      // 3DS/kart odemesi tipini bekliyor; Checkout Form akisinda kart bilgisi
      // bizde toplanmiyor, bu yuzden request'i gercek sekliyle unknown uzerinden geciyoruz.
      createCheckoutForm(request as unknown as CreateArgs[0], (err: unknown, result: CheckoutFormInitializeResult) => {
        if (err || result?.status !== 'success' || !result.paymentPageUrl) {
          fail(err ?? result)
          return
        }

        supabase
          .from('package_purchases')
          .update({ payment_reference: result.token })
          .eq('id', purchaseId)
          .then(() => resolve({ success: true, checkoutUrl: result.paymentPageUrl! }))
      })
    } catch (syncErr) {
      fail(syncErr)
    }
  })
}
